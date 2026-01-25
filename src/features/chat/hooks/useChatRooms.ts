import { chatApi } from '../api/chatApi';
import { queryKeys } from '@/shared/api/queryKeys';
import { useQuery } from '@tanstack/react-query';

export function useChatRooms() {
  return useQuery({
    queryKey: queryKeys.chat.rooms(),
    queryFn: () => chatApi.getRooms(),
    staleTime: 1000 * 30, // 30초
    // WebSocket으로 실시간 업데이트되므로 폴링 불필요
  });
}
