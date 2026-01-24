// 이메일 인증
export interface SendVerificationCodeRequest {
  email: string;
}

export interface ConfirmVerificationCodeRequest {
  email: string;
  code: string;
}

// 회원가입
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  university: string;
  gender: 'MALE' | 'FEMALE';
}

export interface SignupResponse {
  id: number;
  email: string;
  nickname: string;
}

// 로그인
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

// 토큰 갱신
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// 유저 정보
export interface User {
  id: number;
  email: string;
  nickname: string;
  university: string;
  gender: 'MALE' | 'FEMALE' | null;
}
