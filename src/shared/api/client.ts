import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { useAuthStore } from '@/stores';
import { isDemoMode, getApiUrl } from '@/shared/config/env';
import { createMockClient } from './mockClient';

const baseURL = getApiUrl();

// Demo 모드 감지 및 분기
export const apiClient: AxiosInstance = isDemoMode() ? createMockClient() : createRealClient();

function createRealClient(): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터: 토큰 자동 첨부
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const state = useAuthStore.getState();
      const token = state.accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터: 에러 처리, 401 토큰 갱신
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // 401 에러且 재시도하지 않은 요청
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Refresh token으로 재시도 (구현 필요)
        // 임시: 로그아웃 처리
        useAuthStore.getState().logout();
      }

      return Promise.reject(error);
    }
  );

  return client;
}

export default apiClient;
