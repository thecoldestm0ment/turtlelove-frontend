import { ChatRoomCard } from '@/features/chat/components/ChatRoomCard';
import { useChatRooms } from '@/features/chat/hooks';
import { Spinner } from '@/components/atoms/Spinner';
import { cn } from '@/shared/utils/cn';

interface MyChatListProps {
  className?: string;
}

export function MyChatList({ className }: MyChatListProps) {
  const { data: chatRooms, isLoading } = useChatRooms();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!chatRooms || chatRooms.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-ui text-text-muted">
          참여 중인 채팅방이 없습니다.
        </p>
        <p className="mt-2 font-ui text-sm text-text-muted">
          게시글에서 댓글을 작성하고 쪽지를 보내보세요!
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {chatRooms.map((room) => (
        <ChatRoomCard key={room.room_id} room={room} />
      ))}
    </div>
  );
}
