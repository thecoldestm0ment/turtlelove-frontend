import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { GradientOrb } from '@/components/atoms/GradientOrb';
import { WarmthMeter } from '@/components/atoms/WarmthMeter';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { useDeletePost } from '../hooks/useDeletePost';
import type { PostDetail as PostDetailType } from '../types/posts.types';

const orbVariants = ['sunset', 'ocean', 'blossom', 'forest', 'dawn', 'twilight'];

interface PostDetailProps {
  post: PostDetailType;
}

export function PostDetailView({ post }: PostDetailProps) {
  const { mutate: deletePost, isPending } = useDeletePost();

  const handleDelete = () => {
    if (confirm('게시글을 삭제하시겠습니까?')) {
      deletePost(post.id);
    }
  };

  const orbVariant = orbVariants[post.id % orbVariants.length] as 'sunset' | 'ocean' | 'blossom' | 'forest' | 'dawn' | 'twilight';

  const createdAt = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <article className="rounded-lg bg-warm-white p-6 shadow-soft-md">
      {/* 헤더 */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <GradientOrb variant={orbVariant} size="lg" />
          <div>
            <Badge variant="default">#{post.category}</Badge>
            <p className="mt-1 font-ui text-sm text-text-muted">{createdAt}</p>
          </div>
        </div>
        {/* TODO: Replace hardcoded level with post.warmth when PostDetail.warmth is available from API */}
        <WarmthMeter level={50} size="sm" showLabel />
      </div>

      {/* 제목 */}
      <h1 className="mb-6 font-heading text-2xl font-semibold text-text-primary">
        {post.title}
      </h1>

      {/* 내용 */}
      <div className="mb-8 font-body text-base leading-relaxed text-text-primary whitespace-pre-wrap">
        {post.content}
      </div>

      {/* 작성자 버튼 */}
      {post.is_mine && (
        <div className="flex gap-3 border-t border-warm-gray pt-6">
          <Button variant="ghost" asChild>
            <Link to={`/posts/${post.id}/edit`}>수정</Link>
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={isPending}>
            삭제
          </Button>
        </div>
      )}
    </article>
  );
}
