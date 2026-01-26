import { Link } from 'react-router-dom';
import { PostCard } from '@/features/posts/components/PostCard';
import { Spinner } from '@/components/atoms/Spinner';
import { cn } from '@/shared/utils/cn';
import type { MyPost } from '../types';

interface MyPostListProps {
  posts: MyPost[];
  isLoading: boolean;
  className?: string;
}

export function MyPostList({ posts, isLoading, className }: MyPostListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-ui text-text-muted">
          작성한 글이 없습니다.
        </p>
        <Link
          to="/posts/new"
          className={cn(
            'mt-4',
            'inline-block',
            'px-6 py-2',
            'font-ui text-sm font-medium',
            'bg-rose text-warm-white',
            'rounded-lg',
            'shadow-soft-sm',
            'hover:shadow-soft-md',
            'transition-all',
            'duration-[var(--duration-normal)]'
          )}
        >
          첫 글 작성하기
        </Link>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={{
            id: post.id,
            title: post.title,
            created_at: post.created_at,
          }}
          warmth={50}
          category={post.category}
          commentCount={post.comment_count}
        />
      ))}
    </div>
  );
}
