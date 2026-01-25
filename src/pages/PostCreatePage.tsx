import { PostForm } from '@/features/posts/components';
import { useCreatePost } from '@/features/posts/hooks';
import type { CreatePostRequest } from '@/features/posts/types/posts.types';

export function PostCreatePage() {
  const { mutate: createPost, isPending } = useCreatePost();

  const handleSubmit = (data: CreatePostRequest) => {
    createPost(data);
  };

  return (
    <div className="page-enter min-h-screen bg-cream">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-semibold text-text-primary">
            상담 글 작성
          </h1>
          <p className="mt-2 font-ui text-sm text-text-muted">
            따뜻한 마음으로 답변해드릴게요
          </p>
        </div>
        <PostForm mode="create" onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}
