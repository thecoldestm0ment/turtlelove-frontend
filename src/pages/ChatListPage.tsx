import { useChatRooms } from '@/features/chat';
import { ChatRoomCard } from '@/features/chat';
import { Spinner } from '@/components/atoms/Spinner';
import { useChatSocket } from '@/features/chat/hooks/useChatSocket';

export function ChatListPage() {
  const { data: rooms, isLoading, isError } = useChatRooms();

  // WebSocket 연결 (실시간 업데이트)
  useChatSocket({
    onMessage: (message) => {
      if (import.meta.env.DEV) {
        console.log('New message received:', message);
      }
      // 방 목록은 useChatSocket에서 자동 무효화됨
    },
  });

  return (
    <div className="page-enter min-h-screen bg-gradient-to-br from-cream to-rose-50/20">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-300/30">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-text-primary to-rose-600 bg-clip-text text-transparent">
              채팅 목록
            </h1>
          </div>
          <p className="ml-13 text-sm text-text-muted">
            진행 중인 대화 목록입니다
          </p>
        </div>

        {/* 콘텐츠 영역 */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Spinner size="lg" variant="rose" />
              <p className="mt-4 text-sm text-text-muted animate-pulse">
                채팅 목록을 불러오는 중...
              </p>
            </div>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
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
            <p className="text-text-muted">채팅 목록을 불러오지 못했습니다</p>
          </div>
        ) : !rooms || rooms.length === 0 ? (
          <div className="text-center py-16">
            {/* 빈 상태 일러스트레이션 */}
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-rose-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              {/* 장식적인 광선 효과 */}
              <div className="absolute -inset-4 bg-rose-200/30 rounded-full blur-2xl animate-pulse-slow" />
            </div>

            <h3 className="text-xl font-semibold text-text-primary mb-2">
              진행 중인 채팅이 없습니다
            </h3>
            <p className="text-text-muted max-w-sm mx-auto mb-6">
              게시글에서 따뜻한 댓글을 남기고 대화를 시작해보세요! 🌸
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => (
              <ChatRoomCard key={room.room_id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
