import { useParams } from 'react-router-dom';
import { usePost } from '@/features/posts/hooks';
import { useUpdatePost } from '@/features/posts/hooks';
import { PostForm } from '@/features/posts/components';
import { Spinner } from '@/components/atoms/Spinner';

export function PostEditPage() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading } = usePost(id ? Number(id) : 0);
  const { mutate: updatePost, isPending } = useUpdatePost(id ? Number(id) : 0);

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

  // 수정 시에는 API에서 제공하는 필드만 전달
  // (visibility_type, target_gender는 API 스펙상 상세 조회 응답에 미포함)
  const defaultValues = {
    title: post.title,
    content: post.content,
  };

  return (
    <div className="page-enter min-h-screen bg-cream">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-semibold text-text-primary">
            게시글 수정
          </h1>
        </div>
        <PostForm
          mode="edit"
          defaultValues={defaultValues}
          categoryName={post.category}
          onSubmit={updatePost}
          isLoading={isPending}
        />
      </div>
    </div>
  );
}
