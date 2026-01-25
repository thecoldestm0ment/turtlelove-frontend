import { chatApi } from '../api/chatApi';
import type { CreateChatRoomRequest } from '../types/chat.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { useUIStore } from '@/stores/uiStore';

export function useCreateChatRoom() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const addToast = useUIStore((state) => state.addToast);

  const mutation = useMutation({
    mutationFn: (data: CreateChatRoomRequest) => chatApi.createRoom(data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'rooms'] });

      addToast({
        message: '채팅방이 생성되었습니다.',
        variant: 'success',
      });

      navigate(ROUTES.CHAT_ROOM(response.room_id));
    },

    onError: (error: any) => {
      console.error('Create chat room failed:', error);

      let errorMessage = '채팅방 생성에 실패했습니다.';

      if (error.response?.status === 403) {
        errorMessage = '게시글 작성자만 채팅을 시작할 수 있습니다.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      addToast({
        message: errorMessage,
        variant: 'error',
      });
    },
  });

  return {
    createRoom: mutation.mutate,
    isPending: mutation.isPending,
  };
}
