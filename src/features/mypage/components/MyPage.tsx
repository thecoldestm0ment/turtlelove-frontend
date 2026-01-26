import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks';
import { GradientOrb } from '@/components/atoms/GradientOrb';
import { cn } from '@/shared/utils/cn';
import { MyTabNavigation } from './MyTabNavigation';
import { MyPostList } from './MyPostList';
import { MyCommentList } from './MyCommentList';
import { MyChatList } from './MyChatList';
import { useMyPosts } from '../hooks/useMyPosts';
import { useMyComments } from '../hooks/useMyComments';
import type { MyPageTab } from '../types';

export function MyPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MyPageTab>('posts');

  const { data: posts, isLoading: isLoadingPosts } = useMyPosts();
  const { data: comments, isLoading: isLoadingComments } = useMyComments();

  return (
    <div className="space-y-6">
      {/* 사용자 프로필 헤더 */}
      <div className={cn(
        'flex items-center gap-4',
        'p-6',
        'bg-gradient-to-br',
        'from-rose-50/50',
        'to-sage-50/50',
        'rounded-2xl',
        'shadow-soft-sm',
        'border',
        'border-rose-100/30'
      )}>
        <GradientOrb size="lg" variant="sunset" />
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            {user?.nickname || '익명'}님의 마이페이지
          </h1>
          <p className="mt-1 font-ui text-sm text-text-muted">
            나의 활동을 한 곳에서 관리해요
          </p>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <MyTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 탭 컨텐츠 */}
      <div className="min-h-[400px]">
        {activeTab === 'posts' && (
          <MyPostList
            posts={posts || []}
            isLoading={isLoadingPosts}
          />
        )}

        {activeTab === 'comments' && (
          <MyCommentList
            comments={comments || []}
            isLoading={isLoadingComments}
          />
        )}

        {activeTab === 'chats' && (
          <MyChatList />
        )}
      </div>
    </div>
  );
}
