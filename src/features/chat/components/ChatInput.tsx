import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { Spinner } from '@/components/atoms/Spinner';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  isSending?: boolean;
}

export function ChatInput({ onSend, disabled = false, isSending = false }: ChatInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (content.trim() && !disabled && !isSending) {
      onSend(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // 자동 높이 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
    }
  }, [content]);

  return (
    <form onSubmit={handleSubmit} className="sticky bottom-0 bg-gradient-to-t from-cream via-cream to-cream/95 border-t border-rose-100/30 p-4 backdrop-blur-sm">
      <div className="flex gap-3 items-end max-w-4xl mx-auto">
        {/* 텍스트 입력 영역 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메시지를 입력하세요... (Shift+Enter로 줄바꿈)"
            disabled={disabled || isSending}
            rows={1}
            className={clsx(
              'w-full min-h-[44px] max-h-32 px-4 py-3 rounded-2xl',
              'border-2 transition-all duration-200 resize-none',
              'bg-gradient-to-br from-warm-white to-rose-50/20',
              'text-warm-brown placeholder:text-rose-200/60',
              'focus:outline-none focus:ring-2 focus:ring-rose-200/50',
              'disabled:bg-warm-gray/20 disabled:cursor-not-allowed',
              !disabled && !isSending && 'border-rose-200/40 hover:border-rose-300/60 focus:border-rose-300',
              disabled && 'border-warm-gray/30'
            )}
          />

          {/* 글자 수 표시 (선택사항, 미적용 시 제거 가능) */}
          {content.length > 0 && (
            <span className="absolute bottom-2 right-3 text-xs text-rose-300/60 font-medium">
              {content.length}
            </span>
          )}
        </div>

        {/* 전송 버튼 */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!content.trim() || disabled || isSending}
          className={clsx(
            'flex-shrink-0 h-11 px-6 min-w-[44px]',
            'transition-all duration-200',
            'bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600',
            'shadow-md shadow-rose-300/30 hover:shadow-lg hover:shadow-rose-300/50',
            'disabled:from-rose-200 disabled:to-rose-200 disabled:shadow-none'
          )}
        >
          {isSending ? (
            <Spinner size="sm" variant="rose" />
          ) : (
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </Button>
      </div>
    </form>
  );
}

function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
