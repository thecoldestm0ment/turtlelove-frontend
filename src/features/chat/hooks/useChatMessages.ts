import { chatApi } from '../api/chatApi';
import { queryKeys } from '@/shared/api/queryKeys';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { ChatMessage } from '../types/chat.types';

interface UseChatMessagesOptions {
  roomId: number;
  enabled?: boolean;
}

export function useChatMessages({ roomId, enabled = true }: UseChatMessagesOptions) {
  return useInfiniteQuery({
    queryKey: queryKeys.chat.messages(roomId),
    queryFn: ({ pageParam = null }) =>
      chatApi.getMessages({
        roomId,
        lastMessageId: pageParam as number | null | undefined,
        size: 50,
      }),
    getNextPageParam: (lastPage: ChatMessage[]) => {
      if (lastPage && lastPage.length > 0) {
        return lastPage[lastPage.length - 1].id;
      }
      return undefined;
    },
    enabled: !!roomId && enabled,
    staleTime: 0, // 실시간이므로 항상 최신
    refetchOnWindowFocus: false,
    initialPageParam: null as number | null,
  });
}
