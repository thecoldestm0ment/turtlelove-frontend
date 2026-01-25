import { postsApi } from '@/features/posts/api/postsApi';
import type { UpdatePostRequest } from '@/features/posts/types/posts.types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function useUpdatePost(id: number) {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: UpdatePostRequest) => postsApi.update(id, data),
    onSuccess: () => {
      navigate(`/posts/${id}`);
    },
    onError: (error) => {
      console.error('Update post failed:', error);
      // TODO: 에러 처리 (토스트 등)
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
  };
}
