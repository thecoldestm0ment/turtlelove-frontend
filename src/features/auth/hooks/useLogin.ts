import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/stores';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { User } from '@/stores';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setToken = useAuthStore((state) => state.setToken);

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data, variables) => {
      // 토큰 저장 (user는 null로 초기화)
      setToken(data.accessToken);

      // TODO: /me API 추가되면 user 정보 가져오기
      // 임시: 최소한의 user 객체 생성 (이메일만 저장)
      const tempUser: User = {
        id: 0,
        email: variables.email,
        nickname: '익명',
        university: '미정',
        gender: null,
      };
      setAuth(tempUser, data.accessToken);

      navigate('/posts');
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // TODO: 에러 처리 (토스트 등)
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
