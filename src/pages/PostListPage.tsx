import { usePosts } from '@/features/posts/hooks';
import { PostList } from '@/features/posts/components';
import { Button } from '@/components/atoms/Button';
import { Link } from 'react-router-dom';
import { useRef, useState, type KeyboardEvent } from 'react';

const CATEGORIES = ['전체', '연애', '이별', '썸', '짝사랑', '고민', '자유'];

export function PostListPage() {
  const { data, isLoading } = usePosts();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = CATEGORIES.indexOf(selectedCategory);
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const direction = e.key === 'ArrowRight' ? 1 : -1;
      const newIndex =
        (currentIndex + direction + CATEGORIES.length) % CATEGORIES.length;
      setSelectedCategory(CATEGORIES[newIndex]);
      tabRefs.current[newIndex]?.focus();
    }
  };

  return (
    <main className="page-enter min-h-screen bg-cream">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* 헤더 */}
        <header className="mb-6 flex items-center justify-between">
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
        </header>

        {/* 카테고리 탭 - ARIA tab 패턴 */}
        <nav aria-label="카테고리 필터" className="mb-6">
          <div
            className="flex gap-2 overflow-x-auto pb-2"
            role="tablist"
            aria-label="카테고리 선택"
            onKeyDown={handleTabKeyDown}
          >
            {CATEGORIES.map((cat, index) => (
              <button
                key={cat}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                role="tab"
                aria-selected={cat === selectedCategory}
                aria-controls="posts-panel"
                id={`tab-${index}`}
                tabIndex={cat === selectedCategory ? 0 : -1}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-ui text-sm whitespace-nowrap transition-colors ${
                  cat === selectedCategory
                    ? 'bg-rose text-white'
                    : 'bg-warm-white text-text-muted hover:bg-soft-gray'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>

        {/* 게시글 목록 */}
        <section
          id="posts-panel"
          role="tabpanel"
          aria-labelledby={`tab-${CATEGORIES.indexOf(selectedCategory)} posts-heading`}
        >
          <h2 id="posts-heading" className="sr-only">게시글 목록</h2>
          <PostList
            posts={data?.content ?? []}
            isLoading={isLoading}
            isEmpty={!isLoading && !data?.content?.length}
          />
        </section>
      </div>
    </main>
  );
}
