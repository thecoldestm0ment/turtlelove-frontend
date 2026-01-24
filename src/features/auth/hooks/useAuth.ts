import { useAuthStore } from '@/stores';
import { useQuery } from '@tanstack/react-query';

export function useAuth() {
  const { user, accessToken, isAuthenticated, setAuth, logout } = useAuthStore();

  // 유저 정보를 가져오는 쿼리 (필요시 구현)
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      // TODO: 유저 정보 조회 API
      return user;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  return {
    user: isAuthenticated ? (currentUser ?? user) : null,
    accessToken,
    isAuthenticated,
    isLoading,
    setAuth,
    logout,
  };
}
