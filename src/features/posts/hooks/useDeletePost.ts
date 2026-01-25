import { postsApi } from '@/features/posts/api/postsApi';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function useDeletePost() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (id: number) => postsApi.delete(id),
    onSuccess: () => {
      navigate('/posts');
    },
    onError: (error) => {
      console.error('Delete post failed:', error);
      // TODO: 에러 처리 (토스트 등)
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
  };
}
