import { Link } from 'react-router-dom';
import { CommentItem } from '@/features/comments/components/CommentItem';
import { Badge } from '@/components/atoms/Badge';
import { Spinner } from '@/components/atoms/Spinner';
import { cn } from '@/shared/utils/cn';
import type { MyComment } from '../types';

interface MyCommentListProps {
  comments: MyComment[];
  isLoading: boolean;
  className?: string;
}

export function MyCommentList({ comments, isLoading, className }: MyCommentListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-ui text-text-muted">
          작성한 댓글이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className={cn(
            'p-4',
            'rounded-lg',
            'bg-warm-white/50',
            'shadow-soft-sm'
          )}
        >
          {/* 원문 게시글 정보 */}
          <div className="mb-3 flex items-center gap-2">
            <span className="font-ui text-xs text-text-muted">원문:</span>
            <Link
              to={`/posts/${comment.post.id}`}
              className={cn(
                'font-ui text-sm font-medium',
                'text-rose',
                'hover:underline',
                'line-clamp-1'
              )}
            >
              {comment.post.title}
            </Link>
            <Badge variant="default" className="text-xs">
              {comment.post.category}
            </Badge>
          </div>

          {/* 댓글 (읽기 전용) */}
          <CommentItem
            comment={{
              id: comment.id,
              content: comment.content,
              created_at: comment.created_at,
              user_id: 0, // 마이페이지에서는 불필요
              is_mine: false,
              is_filtered: false, // API 응답에 없음
            }}
            isPostAuthor={false}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>
      ))}
    </div>
  );
}
