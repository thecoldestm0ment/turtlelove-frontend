import { mypageApi } from '@/features/mypage/api';
import { useQuery } from '@tanstack/react-query';

/**
 * 내가 쓴 댓글 목록 조회 훅
 */
export function useMyComments() {
  return useQuery({
    queryKey: ['mypage', 'comments'],
    queryFn: () => mypageApi.getMyComments(),
    staleTime: 1000 * 60 * 5, // 5분
  });
}
