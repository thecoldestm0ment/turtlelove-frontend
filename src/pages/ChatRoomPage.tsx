import { useParams } from 'react-router-dom';
import { useChatRooms } from '@/features/chat';
import { ChatRoom } from '@/features/chat';
import { useAuthStore } from '@/stores';
import { Spinner } from '@/components/atoms/Spinner';

export function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuthStore();
  const { data: rooms, isLoading } = useChatRooms();

  const room = rooms?.find((r) => r.room_id === Number(roomId));

  if (isLoading || !room) {
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

  return (
    <div className="page-enter min-h-screen bg-gradient-to-br from-cream to-rose-50/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl h-[calc(100vh-8rem)]">
        <ChatRoom room={room} currentUserId={user.id} />
      </div>
    </div>
  );
}
