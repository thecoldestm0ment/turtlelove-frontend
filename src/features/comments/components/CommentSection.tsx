import { useState } from 'react';
import type { Comment } from '@/features/posts/types/posts.types';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';
import { useCreateComment } from '../hooks/useCreateComment';
import { useUpdateComment } from '../hooks/useUpdateComment';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { CommentItem } from './CommentItem';
import { useCreateChatRoom } from '@/features/chat/hooks';

interface CommentSectionProps {
  postId: number;
  comments: Comment[];
  isPostAuthor: boolean;
}

export function CommentSection({
  postId,
  comments,
  isPostAuthor,
}: CommentSectionProps) {
  const [content, setContent] = useState('');

  // 댓글 작성 훅
  const { mutate: createComment, isPending: isCreating } = useCreateComment({
    postId,
  });

  // 댓글 수정 훅
  const { mutate: updateComment } = useUpdateComment({
    postId,
  });

  // 댓글 삭제 훅
  const { mutate: deleteComment } = useDeleteComment({
    postId,
  });

  // 채팅방 생성 훅
  const { createRoom: createChatRoom, isPending: isCreatingChatRoom } = useCreateChatRoom();

  // 댓글 작성 핸들러
  const handleSubmit = () => {
    if (!content.trim()) return;

    createComment(
      { content: content.trim() },
      {
        onSuccess: () => {
          setContent(''); // 성공 시 입력창 초기화
        },
      }
    );
  };

  // 댓글 수정 핸들러
  const handleEdit = (commentId: number, newContent: string) => {
    updateComment(
      {
        commentId,
        content: newContent,
      },
      {
        onSuccess: () => {
          // CommentItem이 자체 editing state를 관리하므로 별도 처리 불필요
        },
      }
    );
  };

  // 댓글 삭제 핸들러
  const handleDelete = (commentId: number) => {
    deleteComment(commentId);
  };

  // 채팅 요청 핸들러
  const handleChatRequest = (comment: Comment) => {
    if (!isPostAuthor) {
      return;
    }

    // 재진입 방지: 채팅방 생성 진행 중일 때 추가 호출 방지
    if (isCreatingChatRoom) {
      return;
    }

    createChatRoom({
      post_id: postId,
      comment_id: comment.id,
      receiver_id: comment.user_id,
    });
  };

  return (
    <div className="space-y-6">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-semibold text-warm-brown">댓글</h3>
        <span className="text-sm text-warm-gray">({comments.length})</span>
      </div>

      {/* 댓글 작성 폼 */}
      <div className="space-y-3 p-4 rounded-2xl bg-warm-white/50 border border-warm-gray/20">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="따뜻한 응원이나 조언을 남겨주세요..."
          rows={3}
          className="bg-white"
        />
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim() || isCreating || isCreatingChatRoom}
            loading={isCreating}
            className="bg-rose-400 hover:bg-rose-500"
          >
            {isCreating ? '작성 중...' : '댓글 작성'}
          </Button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="py-12 text-center text-warm-gray">
            <p className="text-lg">아직 댓글이 없습니다.</p>
            <p className="text-sm mt-1">첫 번째 댓글을 작성해보세요!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isPostAuthor={isPostAuthor}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onChatRequest={handleChatRequest}
            />
          ))
        )}
      </div>
    </div>
  );
}
