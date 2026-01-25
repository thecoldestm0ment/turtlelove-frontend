import { useParams } from 'react-router-dom';
import { usePost } from '@/features/posts/hooks';
import { PostDetailView } from '@/features/posts/components';
import { Spinner } from '@/components/atoms/Spinner';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading } = usePost(id ? Number(id) : 0);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="font-body text-text-muted">게시글을 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-screen bg-cream">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <PostDetailView post={post} />
      </div>
    </div>
  );
}
