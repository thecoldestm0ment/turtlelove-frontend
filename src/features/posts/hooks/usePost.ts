import { postsApi } from '@/features/posts/api/postsApi';
import { useQuery } from '@tanstack/react-query';

export function usePost(id: number) {
  return useQuery({
    queryKey: ['posts', 'detail', id],
    queryFn: () => postsApi.getDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60, // 1분
  });
}
