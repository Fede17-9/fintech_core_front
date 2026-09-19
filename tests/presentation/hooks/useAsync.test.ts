import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAsync } from '../../../src/presentation/hooks/useAsync';
import { ApiError } from '../../../src/domain/errors/ApiError';

describe('useAsync Hook', () => {
  it('maneja el flujo exitoso con array y chequeo de empty', async () => {
    const fn = vi.fn().mockResolvedValue(['item1']);
    const { result } = renderHook(() => useAsync(fn));

    expect(result.current.status).toBe('idle');
    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual(['item1']);
    expect(result.current.isEmpty).toBe(false);

    act(() => {
      result.current.reset();
    });
    expect(result.current.status).toBe('idle');
  });

  it('maneja el flujo de lista vacía y checkIsEmpty custom', async () => {
    const fn = vi.fn().mockResolvedValue([]);
    const { result } = renderHook(() => useAsync(fn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.isEmpty).toBe(true);

    const customFn = vi.fn().mockResolvedValue({ items: [] });
    const { result: customResult } = renderHook(() =>
      useAsync<{ items: unknown[] }>(customFn, (data) => data.items.length === 0)
    );

    await act(async () => {
      await customResult.current.execute();
    });
    expect(customResult.current.isEmpty).toBe(true);
  });

  it('maneja el flujo de error normalizando a ApiError o Error genérico', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Fallo de red'));
    const { result } = renderHook(() => useAsync(fn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBeInstanceOf(ApiError);
    expect(result.current.error?.message).toBe('Fallo de red');

    const nonObjectFn = vi.fn().mockRejectedValue('Error string');
    const { result: nonObjResult } = renderHook(() => useAsync(nonObjectFn));

    await act(async () => {
      await nonObjResult.current.execute();
    });
    expect(nonObjResult.current.error?.message).toBe('Error al procesar la solicitud');
  });
});
