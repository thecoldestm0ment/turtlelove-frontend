import { postsApi } from '@/features/posts/api/postsApi';
import type { CreatePostRequest } from '@/features/posts/types/posts.types';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

export function useCreatePost() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: CreatePostRequest) => postsApi.create(data),
    onSuccess: (data) => {
      navigate(ROUTES.POST_DETAIL(data.id));
    },
    onError: (error) => {
      console.error('Create post failed:', error);
      // TODO: 에러 처리 (토스트 등)
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
  };
}
