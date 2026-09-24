import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../../config/env';
import { ApiError, ApiErrorResponse } from '../../domain/errors/ApiError';
import { TokenStorage } from '../storage/TokenStorage';

export interface ApiSuccessEnvelope<T> {
  status: 'success';
  data: T;
  message?: string;
}

type UnauthorizedListener = () => void;
let unauthorizedListener: UnauthorizedListener | null = null;

export const setUnauthorizedListener = (listener: UnauthorizedListener | null): void => {
  unauthorizedListener = listener;
};

class ApiClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: ENV.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Interceptor de Petición: inyectar token Bearer desde TokenStorage
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = TokenStorage.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: unknown) => Promise.reject(error)
    );

    // Interceptor de Respuesta: detectar 401 e invalidar sesión globalmente
    this.client.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const code = error.response?.data?.code;

          if (status === 401 || code === 'UNAUTHORIZED' || code === 'INVALID_TOKEN') {
            TokenStorage.removeToken();
            if (unauthorizedListener) {
              unauthorizedListener();
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string): Promise<T> {
    try {
      const response = await this.client.get<ApiSuccessEnvelope<T> | T>(url);
      return this.unwrap(response.data);
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  public async post<T, D = unknown>(url: string, data?: D): Promise<T> {
    try {
      const response = await this.client.post<ApiSuccessEnvelope<T> | T>(url, data);
      return this.unwrap(response.data);
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  public async patch<T, D = unknown>(url: string, data?: D): Promise<T> {
    try {
      const response = await this.client.patch<ApiSuccessEnvelope<T> | T>(url, data);
      return this.unwrap(response.data);
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  private unwrap<T>(payload: ApiSuccessEnvelope<T> | T): T {
    if (
      payload !== null &&
      typeof payload === 'object' &&
      'status' in payload &&
      payload.status === 'success' &&
      'data' in payload
    ) {
      return payload.data as T;
    }

    return payload as T;
  }

  private normalizeError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const status = axiosError.response?.status ?? 500;
      const responseData = axiosError.response?.data;

      if (responseData && (responseData.status === 'fail' || responseData.status === 'error')) {
        return new ApiError(
          responseData.message || 'Error en la petición al servidor',
          status,
          responseData.code || 'UNKNOWN_ERROR',
          responseData.errors
        );
      }

      return new ApiError(
        responseData?.message || axiosError.message || 'Error de conexión con el servidor',
        status,
        'HTTP_ERROR'
      );
    }

    if (error instanceof ApiError) {
      return error;
    }

    return new ApiError(
      error instanceof Error ? error.message : 'Error inesperado',
      500,
      'INTERNAL_ERROR'
    );
  }
}

export const apiClient = new ApiClient();
