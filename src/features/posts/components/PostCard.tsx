import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { GradientOrb } from '@/components/atoms/GradientOrb';
import { Badge } from '@/components/atoms/Badge';
import { WarmthMeter } from '@/components/atoms/WarmthMeter';
import { cn } from '@/shared/utils/cn';
import type { PostListItem } from '../types/posts.types';

interface PostCardProps {
  post: PostListItem;
  warmth?: number; // 0-100
  category?: string;
  commentCount?: number;
  className?: string;
}

const orbVariants = ['sunset', 'ocean', 'blossom', 'forest', 'dawn', 'twilight'];

export function PostCard({
  post,
  warmth = 50,
  category = '연애',
  commentCount = 0,
  className,
}: PostCardProps) {
  // 랜덤 오브 variant (게시글 ID 기반 고정)
  const orbVariant = orbVariants[post.id % orbVariants.length] as 'sunset' | 'ocean' | 'blossom' | 'forest' | 'dawn' | 'twilight';

  const createdAt = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <Link
      to={`/posts/${post.id}`}
      className={cn(
        'block',
        'group',
        'rounded-lg',
        'bg-warm-white',
        'p-5',
        'shadow-soft-sm',
        'transition-all',
        'duration-[var(--duration-normal)]',
        'ease-out',
        'hover:shadow-soft-md',
        'hover:-translate-y-1',
        'active:translate-y-0',
        className
      )}
    >
      {/* 헤더: 아바타 + 메타 정보 */}
      <div className="mb-4 flex items-center gap-3">
        <GradientOrb variant={orbVariant} size="md" />
        <div className="flex-1">
          <p className="font-ui text-xs text-text-muted">
            {createdAt} · {category}
          </p>
        </div>
        <WarmthMeter level={warmth} size="sm" />
      </div>

      {/* 제목 */}
      <h3 className="mb-3 font-heading text-lg font-semibold leading-snug text-text-primary line-clamp-2 group-hover:text-rose transition-colors">
        {post.title}
      </h3>

      {/* 하단: 태그 + 댓글 수 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Badge variant="default">#{category}</Badge>
        </div>
        {commentCount > 0 && (
          <span className="flex items-center gap-1 text-sm font-ui text-text-muted">
            <svg
              className="h-4 w-4"
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
            {commentCount}
          </span>
        )}
      </div>
    </Link>
  );
}
