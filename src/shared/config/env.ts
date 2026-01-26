/**
 * 환경 감지 및 설정 유틸리티
 * Demo 모드, 개발 모드, 프로덕션 모드를 구분합니다.
 */

export const isDemoMode = (): boolean => {
  return import.meta.env.VITE_APP_MODE === 'demo';
};

export const isProductionMode = (): boolean => {
  return import.meta.env.VITE_APP_MODE === 'production';
};

export const isDevelopmentMode = (): boolean => {
  return import.meta.env.VITE_APP_MODE === 'development';
};

export const getApiUrl = (): string => {
  if (isDemoMode()) {
    return 'mock';
  }
  return import.meta.env.VITE_API_URL ?? '/api';
};

export const getWsUrl = (): string => {
  if (isDemoMode()) {
    return 'mock';
  }
  return import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080/ws';
};
