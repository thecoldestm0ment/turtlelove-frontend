import { Link } from 'react-router-dom';
import type { ChatRoomType as ChatRoom } from '../types/chat.types';
import { GradientOrb } from '@/components/atoms/GradientOrb';
import { Badge } from '@/components/atoms/Badge';
import { formatRelativeTime } from '@/shared/utils/dateUtils';

interface ChatRoomCardProps {
  room: ChatRoom;
}

export function ChatRoomCard({ room }: ChatRoomCardProps) {
  const { room_id, last_message, last_message_at, unread_count, post_info } = room;

  return (
    <Link
      to={`/chats/${room_id}`}
      className="group block p-4 rounded-2xl bg-gradient-to-br from-warm-white/70 to-rose-50/30 hover:from-warm-white hover:to-rose-100/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 border border-rose-100/30 hover:border-rose-200/50 hover:shadow-lg hover:shadow-rose-100/20"
    >
      <div className="flex gap-3">
        {/* 익명 아바타 - 따뜻한 sunset gradient */}
        <div className="flex-shrink-0">
          <div className="relative">
            <GradientOrb size="md" variant="sunset" />
            {/* 온라인 인디케이터 (추후 확장용) */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-sage-400 border-2 border-warm-white rounded-full" />
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex-1 min-w-0">
          {/* 헤더: 게시글 제목 + 안읽은 배지 */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-heading font-semibold text-text-primary truncate group-hover:text-rose-600 transition-colors">
              {post_info.title}
            </h3>
            {unread_count > 0 && (
              <Badge
                variant="crush"
                className="flex-shrink-0 animate-pulse-slow shadow-sm shadow-rose-200/50"
              >
                {unread_count > 99 ? '99+' : unread_count}
              </Badge>
            )}
          </div>

          {/* 마지막 메시지 미리보기 */}
          <p className="text-sm text-text-secondary truncate mb-1 group-hover:text-text-primary transition-colors">
            {last_message || '아직 메시지가 없습니다'}
          </p>

          {/* 시간 정보 */}
          {last_message_at && (
            <div className="flex items-center gap-1.5">
              <svg
                className="w-3 h-3 text-rose-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs text-text-muted font-medium">
                {formatRelativeTime(last_message_at)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
