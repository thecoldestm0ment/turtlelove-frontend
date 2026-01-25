import { useEffect, useRef } from 'react';
import { useChatMessages, useChatSocket } from '../hooks';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { ConnectionStatus } from './ConnectionStatus';
import { Spinner } from '@/components/atoms/Spinner';
import type { ChatRoomType } from '../types/chat.types';

interface ChatRoomProps {
  room: ChatRoomType;
  currentUserId: number;
}

export function ChatRoom({ room, currentUserId }: ChatRoomProps) {
  const { room_id, post_info } = room;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useChatMessages({ roomId: room_id, enabled: true });

  const { isConnected, isConnecting, error, sendMessage, reconnect } = useChatSocket({
    roomId: room_id,
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data]);

  // Flatten infinite query pages
  const allMessages = data?.pages.flatMap((page) =>
    page.map((msg: any) => ({ ...msg, is_mine: msg.sender_id === currentUserId }))
  ) ?? [];

  const handleSendMessage = (content: string) => {
    try {
      sendMessage({ roomId: room_id, content });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Spinner size="lg" variant="rose" />
          <p className="mt-4 text-sm text-text-muted animate-pulse">
            메시지를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-rose-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-text-muted mb-4">메시지를 불러오지 못했습니다</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 text-white font-medium shadow-md shadow-rose-300/30 hover:shadow-lg hover:shadow-rose-300/50 transition-all"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-cream to-rose-50/20">
      {/* 게시글 정보 헤더 */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-rose-100/30 bg-gradient-to-r from-warm-white/80 to-rose-50/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-rose-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="font-heading font-semibold text-text-primary text-sm">
            "{post_info.title}" 게시글에서 시작된 대화
          </h2>
        </div>
      </div>

      {/* 연결 상태 표시 */}
      <ConnectionStatus
        status={{
          connected: isConnected,
          connecting: isConnecting,
          error,
        }}
        onReconnect={reconnect}
      />

      {/* 메시지 목록 영역 */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 scroll-smooth"
      >
        {/* 이전 메시지 더보기 버튼 */}
        {hasNextPage && (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                'bg-gradient-to-r from-warm-white/60 to-rose-50/40',
                'text-text-secondary hover:text-text-primary',
                'border border-rose-100/40 hover:border-rose-200/60',
                'shadow-sm hover:shadow-md',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isFetchingNextPage ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" variant="rose" />
                  불러오는 중...
                </span>
              ) : (
                '이전 메시지 더 보기'
              )}
            </button>
          </div>
        )}

        {/* 메시지 목록 또는 빈 상태 */}
        {allMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center py-12">
              {/* 빈 상태 아이콘 */}
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-rose-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                {/* 장식적인 광선 효과 */}
                <div className="absolute -inset-2 bg-rose-200/30 rounded-full blur-xl animate-pulse-slow" />
              </div>

              <p className="text-lg font-medium text-text-primary mb-2">
                첫 메시지를 보내보세요!
              </p>
              <p className="text-sm text-text-muted max-w-xs mx-auto">
                따뜻한 대화를 시작해보세요 🌸
              </p>
            </div>
          </div>
        ) : (
          <>
            {allMessages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {/* 스크롤 앵커 */}
            <div ref={messagesEndRef} className="h-1" />
          </>
        )}
      </div>

      {/* 입력 영역 */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={!isConnected}
        isSending={false}
      />
    </div>
  );
}

function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
