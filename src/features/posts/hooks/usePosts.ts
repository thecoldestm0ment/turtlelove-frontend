import { postsApi } from '@/features/posts/api/postsApi';
import type { PostListParams } from '@/features/posts/types/posts.types';
import { useQuery } from '@tanstack/react-query';

export function usePosts(params: PostListParams = {}) {
  return useQuery({
    queryKey: ['posts', 'list', params],
    queryFn: () => postsApi.getList(params),
    staleTime: 1000 * 60, // 1분
  });
}
