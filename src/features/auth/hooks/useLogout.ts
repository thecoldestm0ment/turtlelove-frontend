import { authApi } from '@/features/auth/api/authApi';
import { useAuthStore } from '@/stores';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const mutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      navigate('/login');
    },
    onError: () => {
      // 에러가 발생해도 로컬 상태는 정리
      logout();
      navigate('/login');
    },
  });

  return {
    logout: mutation.mutate,
    isLoading: mutation.isPending,
  };
}
