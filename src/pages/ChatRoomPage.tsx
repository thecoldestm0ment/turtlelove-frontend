import { useParams, Link } from 'react-router-dom';
import { useChatRooms } from '@/features/chat';
import { ChatRoom } from '@/features/chat';
import { useAuthStore } from '@/stores';
import { Spinner } from '@/components/atoms/Spinner';

export function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuthStore();
  const { data: rooms, isLoading, isError, refetch } = useChatRooms();

  const room = rooms?.find((r) => r.room_id === Number(roomId));

  // 1. Authentication check - FIRST PRIORITY
  if (!user) {
    return (
      <div className="page-enter min-h-screen bg-gradient-to-br from-cream to-rose-50/20 flex items-center justify-center">
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <p className="text-lg font-medium text-text-primary mb-2">
            로그인이 필요합니다
          </p>
          <p className="text-sm text-text-muted">
            채팅을 이용하려면 로그인해주세요
          </p>
        </div>
      </div>
    );
  }

  // 2. Loading state check
  if (isLoading) {
    return (
      <div className="page-enter min-h-screen bg-gradient-to-br from-cream to-rose-50/20 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" variant="rose" />
          <p className="mt-4 text-sm text-text-muted animate-pulse">
            채팅방을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  // 3. Error state check
  if (isError) {
    return (
      <div className="page-enter min-h-screen bg-gradient-to-br from-cream to-rose-50/20 flex items-center justify-center">
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
          <p className="text-text-muted mb-4">채팅방을 불러오지 못했습니다</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 text-white font-medium shadow-md shadow-rose-300/30 hover:shadow-lg hover:shadow-rose-300/50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 4. Room not found check
  if (!room) {
    return (
      <div className="page-enter min-h-screen bg-gradient-to-br from-cream to-rose-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-6">
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute -inset-2 bg-rose-200/30 rounded-full blur-xl animate-pulse-slow" />
          </div>
          <p className="text-lg font-medium text-text-primary mb-2">
            채팅방을 찾을 수 없습니다
          </p>
          <p className="text-sm text-text-muted max-w-xs mx-auto">
            존재하지 않는 채팅방이거나 삭제된 방입니다
          </p>
          <Link
            to="/chats"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-rose-500 text-white font-medium shadow-md shadow-rose-300/30 hover:shadow-lg hover:shadow-rose-300/50 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            채팅 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen bg-gradient-to-br from-cream to-rose-50/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100vh-8rem)]">
        <ChatRoom room={room} currentUserId={user.id} />
      </div>
    </div>
  );
}
