import { cn } from '@/shared/utils/cn';
import type { MyPageTab } from '../types';

interface MyTabNavigationProps {
  activeTab: MyPageTab;
  onTabChange: (tab: MyPageTab) => void;
}

const tabs: { key: MyPageTab; label: string }[] = [
  { key: 'posts', label: '내 글' },
  { key: 'comments', label: '내 댓글' },
  { key: 'chats', label: '채팅' },
];

export function MyTabNavigation({ activeTab, onTabChange }: MyTabNavigationProps) {
  return (
    <div className="relative mb-6">
      {/* 탭 버튼 그룹 */}
      <div className="grid grid-cols-3 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'relative',
              'px-4 py-3',
              'font-ui text-sm font-medium',
              'rounded-lg',
              'transition-all',
              'duration-[var(--duration-normal)]',
              'ease-out',
              // 활성 탭 스타일
              activeTab === tab.key
                ? [
                    'bg-rose text-warm-white',
                    'shadow-soft-sm',
                    'scale-[1.02]',
                  ]
                : [
                    'bg-warm-white/50 text-text-muted',
                    'hover:bg-warm-white/80',
                    'hover:text-text-primary',
                  ]
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
