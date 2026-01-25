import type { ChatMessageWithMine } from '../types/chat.types';
import { formatRelativeTime } from '@/shared/utils/dateUtils';
import { clsx } from 'clsx';

interface ChatBubbleProps {
  message: ChatMessageWithMine;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const { content, created_at, is_mine } = message;

  return (
    <div
      className={clsx(
        'flex animate-in fade-in slide-in-from-bottom-2 duration-500 mb-4',
        is_mine ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={clsx(
          'group relative max-w-[75%] px-4 py-3 rounded-2xl transition-all duration-200',
          is_mine
            ? 'bg-gradient-to-br from-rose-300 to-rose-400 text-warm-brown rounded-br-md shadow-md shadow-rose-200/50 hover:shadow-lg hover:shadow-rose-200/70'
            : 'bg-gradient-to-br from-warm-white to-rose-50/30 text-warm-brown rounded-bl-md border border-rose-100/40 shadow-sm hover:shadow-md hover:border-rose-200/60'
        )}
      >
        {/* 메시지 내용 */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>

        {/* 시간戳 */}
        <div
          className={clsx(
            'mt-1.5 text-xs opacity-70 group-hover:opacity-100 transition-opacity',
            is_mine
              ? 'text-rose-800/70 text-right font-medium'
              : 'text-rose-900/50 text-left'
          )}
        >
          {formatRelativeTime(created_at)}
        </div>

        {/* 장식적인 광선 효과 (내 메시지만) */}
        {is_mine && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-200/50 rounded-full blur-[2px]" />
        )}
      </div>
    </div>
  );
}
