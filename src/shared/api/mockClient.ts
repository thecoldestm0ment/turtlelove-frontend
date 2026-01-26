import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { mockApiService } from '@/mock/services/mockApiService';
import { simulateNetworkDelay } from '@/mock/utils/delays';

/**
 * Mock Axios-like client
 * 실제 axios 인터페이스를 모방하여 기존 API 함수들이 수정 없이 동작
 */
export const createMockClient = (): AxiosInstance => {
  const mockRequest = async <T = any>(
    method: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    try {
      const responseData = await mockApiService.handleRequest(method, url, data, config);

      return {
        data: responseData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: (config || {}) as any,
      };
    } catch (error: any) {
      // Mock 에러 처리
      const axiosError: any = new Error(error.data?.message || 'Mock API Error');
      axiosError.response = {
        status: error.status || 500,
        data: error.data || { code: 'MOCK_ERROR', message: error.message },
        statusText: error.statusText || 'Error',
        headers: {},
        config: (config || {}) as any,
      };
      axiosError.isAxiosError = true;
      throw axiosError;
    }
  };

  return {
    get: <T = any>(url: string, config?: AxiosRequestConfig) => mockRequest<T>('GET', url, undefined, config),

    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
      mockRequest<T>('POST', url, data, config),

    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
      mockRequest<T>('PUT', url, data, config),

    delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
      mockRequest<T>('DELETE', url, undefined, config),

    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
      mockRequest<T>('PATCH', url, data, config),

    head: <T = any>(url: string, config?: AxiosRequestConfig) => mockRequest<T>('HEAD', url, undefined, config),

    options: <T = any>(url: string, config?: AxiosRequestConfig) =>
      mockRequest<T>('OPTIONS', url, undefined, config),

    request: <T = any>(config: AxiosRequestConfig) =>
      mockRequest<T>(config.method || 'GET', config.url || '', config.data, config),

    // 인터셉터 모의 (사용하지 않지만 타입 호환성 유지)
    interceptors: {
      request: { use: () => 0, eject: () => {}, clear: () => {} },
      response: { use: () => 0, eject: () => {}, clear: () => {} },
    },

    defaults: {
      headers: {
        common: {},
        delete: {},
        get: {},
        head: {},
        post: {},
        put: {},
        patch: {},
      },
    } as any,

    getUri: (config?: AxiosRequestConfig) => config?.url || '',
  } as AxiosInstance;
};
