import { PostCard } from './PostCard';
import { PostCardSkeleton } from '@/components/atoms/Skeleton';
import type { PostListItem } from '../types/posts.types';

/**
 * post.id를 기반으로 0-100 범위의 결정론적인 warmth 값을 생성
 */
function getWarmth(id: number): number {
  // 황금비 기반 해시 (Knuth's multiplicative hash)
  const hash = ((id * 2654435761) >>> 0) % 101;
  return hash;
}

interface PostListProps {
  posts: PostListItem[];
  isLoading?: boolean;
  isEmpty?: boolean;
}

export function PostList({ posts, isLoading, isEmpty }: PostListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isEmpty || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="font-body text-lg text-text-muted">아직 게시글이 없습니다</p>
        <p className="mt-2 font-ui text-sm text-text-muted">
          첫 번째 상담 글을 작성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          warmth={getWarmth(post.id)}
        />
      ))}
    </div>
  );
}
