import { mypageApi } from '@/features/mypage/api';
import { useQuery } from '@tanstack/react-query';

/**
 * 내가 쓴 글 목록 조회 훅
 */
export function useMyPosts() {
  return useQuery({
    queryKey: ['mypage', 'posts'],
    queryFn: () => mypageApi.getMyPosts(),
    staleTime: 1000 * 60 * 5, // 5분
  });
}
