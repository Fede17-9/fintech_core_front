import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { apiClient, setUnauthorizedListener } from '../../../src/infrastructure/http/ApiClient';
import { TokenStorage } from '../../../src/infrastructure/storage/TokenStorage';
import { ApiError } from '../../../src/domain/errors/ApiError';

describe('ApiClient Infrastructure Unit Tests', () => {
  const internalClient = (apiClient as any).client;

  beforeEach(() => {
    vi.restoreAllMocks();
    TokenStorage.removeToken();
  });

  it('setUnauthorizedListener permite registrar y limpiar el callback de 401', () => {
    const listener = vi.fn();
    setUnauthorizedListener(listener);
    setUnauthorizedListener(null);
    expect(listener).not.toHaveBeenCalled();
  });

  it('get() extrae la propiedad data de la respuesta envelope de éxito', async () => {
    vi.spyOn(internalClient, 'get').mockResolvedValue({
      data: { status: 'success', data: { id: 1, name: 'Test' } },
    });

    const result = await apiClient.get<{ id: number; name: string }>('/test-url');
    expect(result).toEqual({ id: 1, name: 'Test' });
  });

  it('post() envía datos y extrae data de la respuesta envelope', async () => {
    vi.spyOn(internalClient, 'post').mockResolvedValue({
      data: { status: 'success', data: { success: true } },
    });

    const result = await apiClient.post<{ success: boolean }>('/test-post', { payload: 123 });
    expect(result).toEqual({ success: true });
  });

  it('patch() envía datos y extrae data de la respuesta envelope', async () => {
    vi.spyOn(internalClient, 'patch').mockResolvedValue({
      data: { status: 'success', data: { patched: true } },
    });

    const result = await apiClient.patch<{ patched: boolean }>('/test-patch', { patch: true });
    expect(result).toEqual({ patched: true });
  });

  it('normalizeError maneja errores Axios con payload estructurado de ApiErrorResponse (fail)', async () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          status: 'fail',
          code: 'VALIDATION_ERROR',
          message: 'Datos requeridos faltantes',
          errors: [{ field: 'email', message: 'Email requerido' }],
        },
      },
    };
    vi.spyOn(internalClient, 'get').mockRejectedValue(axiosError);
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    await expect(apiClient.get('/fail-route')).rejects.toSatisfy((err: unknown) => {
      return (
        err instanceof ApiError &&
        err.httpStatus === 400 &&
        err.code === 'VALIDATION_ERROR' &&
        err.message === 'Datos requeridos faltantes' &&
        err.errors?.length === 1
      );
    });
  });

  it('normalizeError maneja errores Axios sin datos de respuesta (HTTP_ERROR)', async () => {
    const axiosError = {
      isAxiosError: true,
      message: 'Network Timeout',
      response: { status: 504 },
    };
    vi.spyOn(internalClient, 'get').mockRejectedValue(axiosError);
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    await expect(apiClient.get('/timeout-route')).rejects.toSatisfy((err: unknown) => {
      return (
        err instanceof ApiError &&
        err.httpStatus === 504 &&
        err.code === 'HTTP_ERROR' &&
        err.message === 'Network Timeout'
      );
    });
  });

  it('normalizeError maneja ApiError ya instanciados o errores genéricos JS', async () => {
    const customApiError = new ApiError('Error previo', 409, 'CONFLICT');
    vi.spyOn(internalClient, 'get').mockRejectedValue(customApiError);
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(false);

    await expect(apiClient.get('/custom-error')).rejects.toThrow('Error previo');

    vi.spyOn(internalClient, 'post').mockRejectedValue(new Error('Error de JS'));
    await expect(apiClient.post('/js-error')).rejects.toSatisfy((err: unknown) => {
      return err instanceof ApiError && err.code === 'INTERNAL_ERROR' && err.message === 'Error de JS';
    });

    vi.spyOn(internalClient, 'patch').mockRejectedValue('Error string no-object');
    await expect(apiClient.patch('/string-error')).rejects.toSatisfy((err: unknown) => {
      return err instanceof ApiError && err.code === 'INTERNAL_ERROR' && err.message === 'Error inesperado';
    });
  });

  it('interceptors inyectan Bearer Token en peticiones y capturan 401 en respuestas', async () => {
    TokenStorage.setToken('bearer-xyz');
    const requestInterceptor = internalClient.interceptors.request.handlers[0].fulfilled;
    const requestInterceptorRejected = internalClient.interceptors.request.handlers[0].rejected;
    const responseInterceptorFulfilled = internalClient.interceptors.response.handlers[0].fulfilled;
    const responseInterceptorError = internalClient.interceptors.response.handlers[0].rejected;

    const mockConfig = { headers: {} } as any;
    const updatedConfig = requestInterceptor(mockConfig);
    expect(updatedConfig.headers.Authorization).toBe('Bearer bearer-xyz');

    await expect(requestInterceptorRejected(new Error('req error'))).rejects.toThrow('req error');
    expect(responseInterceptorFulfilled({ data: 'ok' })).toEqual({ data: 'ok' });

    const listener = vi.fn();
    setUnauthorizedListener(listener);

    const error401 = {
      isAxiosError: true,
      response: { status: 401, data: { code: 'UNAUTHORIZED' } },
    };

    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true);

    await expect(responseInterceptorError(error401)).rejects.toEqual(error401);
    expect(TokenStorage.getToken()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(1);

    setUnauthorizedListener(null);
  });
});
