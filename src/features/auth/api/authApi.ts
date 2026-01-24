import { apiClient } from '@/shared/api/client';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SendVerificationCodeRequest,
  SignupRequest,
  SignupResponse,
  ConfirmVerificationCodeRequest,
} from '../types/auth.types';

export const authApi = {
  // 이메일 인증번호 발송
  sendVerificationCode: async (data: SendVerificationCodeRequest) => {
    await apiClient.post('/auth/email/verify', data);
  },

  // 인증번호 확인
  confirmVerificationCode: async (data: ConfirmVerificationCodeRequest) => {
    await apiClient.post('/auth/email/confirm', data);
  },

  // 회원가입
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>('/auth/signup', data);
    return response.data;
  },

  // 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  // 로그아웃
  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  // 토큰 갱신
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
    return response.data;
  },
};
