import { usePosts } from '@/features/posts/hooks';
import { PostList } from '@/features/posts/components';
import { Button } from '@/components/atoms/Button';
import { Link } from 'react-router-dom';

export function PostListPage() {
  const { data, isLoading } = usePosts();

  return (
    <div className="page-enter min-h-screen bg-cream">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-semibold text-text-primary">
            상담 게시글
          </h1>
          <Button
            asChild
            className="rounded-full shadow-rose"
            size="lg"
          >
            <Link to="/posts/new">글쓰기</Link>
          </Button>
        </div>

        {/* 카테고리 탭 (TODO) */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {['전체', '연애', '이별', '썸', '짝사랑', '고민', '자유'].map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full font-ui text-sm whitespace-nowrap transition-colors ${
                cat === '전체'
                  ? 'bg-rose text-white'
                  : 'bg-warm-white text-text-muted hover:bg-soft-gray'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 게시글 목록 */}
        <PostList
          posts={data?.content ?? []}
          isLoading={isLoading}
          isEmpty={!isLoading && !data?.content?.length}
        />
      </div>
    </div>
  );
}
