import type { ConnectionStatusType as ConnStatus } from '../types/chat.types';
import { clsx } from 'clsx';

interface ConnectionStatusProps {
  status: ConnStatus;
  onReconnect?: () => void;
}

export function ConnectionStatus({ status, onReconnect }: ConnectionStatusProps) {
  const { connected, connecting, error } = status;

  if (connected) {
    return null; // 연결됨 → 숨김
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-xs animate-in slide-in-from-top-2 duration-300">
      <div
        className={clsx(
          'px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 border backdrop-blur-sm',
          error
            ? 'bg-red-50/90 border-red-200 shadow-red-200/30'
            : connecting
            ? 'bg-sage-light/90 border-sage/40 shadow-sage-200/30'
            : 'bg-warm-gray/90 border-warm-gray/40'
        )}
      >
        {/* 아이콘 */}
        <div className="flex-shrink-0">
          {error ? (
            // 에러 아이콘
            <div className="relative">
              <svg
                className="w-5 h-5 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {/* 펄싱 효과 */}
              <span className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
            </div>
          ) : (
            // 연결 중 스피너
            <svg
              className="w-5 h-5 text-sage-500 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 min-w-0">
          <p
            className={clsx(
              'text-sm font-medium',
              error ? 'text-red-700' : 'text-text-primary'
            )}
          >
            {error ? '연결 실패' : connecting ? '연결 중...' : '연결 끊김'}
          </p>
          {error && (
            <p className="text-xs text-red-600/70 mt-0.5">
              실시간 메시지를 받을 수 없습니다
            </p>
          )}
        </div>

        {/* 재연결 버튼 */}
        {error && onReconnect && (
          <button
            onClick={onReconnect}
            className={clsx(
              'flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg',
              'transition-all duration-200',
              'bg-gradient-to-r from-rose-400 to-rose-500',
              'text-white shadow-md shadow-rose-300/30',
              'hover:from-rose-500 hover:to-rose-600 hover:shadow-lg hover:shadow-rose-300/50',
              'active:scale-95'
            )}
          >
            재연결
          </button>
        )}
      </div>

      {/* 장식적인 그림자 레이어 */}
      {!error && connecting && (
        <div className="absolute inset-0 rounded-2xl bg-sage-400/10 blur-xl -z-10 animate-pulse-slow" />
      )}
    </div>
  );
}
