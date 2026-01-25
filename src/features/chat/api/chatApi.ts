import { apiClient } from '@/shared/api/client';
import type {
  CreateChatRoomRequest,
  CreateChatRoomResponse,
  ChatRoomListResponse,
  ChatMessagesResponse,
  GetChatMessagesParams,
} from '../types/chat.types';

export type { ChatRoomType as ChatRoom } from '../types/chat.types';

export const chatApi = {
  /**
   * 채팅방 생성 (UC-11)
   * POST /chats/rooms
   * 게시글 작성자만 댓글 작성자에게 채팅을 시작할 수 있습니다
   */
  createRoom: async (data: CreateChatRoomRequest): Promise<CreateChatRoomResponse> => {
    const response = await apiClient.post<CreateChatRoomResponse>('/chats/rooms', data);
    return response.data;
  },

  /**
   * 내 채팅방 목록 조회 (UC-04)
   * GET /chats/rooms
   */
  getRooms: async (): Promise<ChatRoomListResponse> => {
    const response = await apiClient.get<ChatRoomListResponse>('/chats/rooms');
    return response.data;
  },

  /**
   * 채팅 메시지 내역 조회 (커서 기반 페이지네이션)
   * GET /chats/rooms/{roomId}/messages?lastMessageId={id}&size=50
   */
  getMessages: async (params: GetChatMessagesParams): Promise<ChatMessagesResponse> => {
    const { roomId, lastMessageId, size = 50 } = params;
    const response = await apiClient.get<ChatMessagesResponse>(
      `/chats/rooms/${roomId}/messages`,
      {
        params: {
          ...(lastMessageId !== null && lastMessageId !== undefined && { lastMessageId }),
          size,
        },
      }
    );
    return response.data;
  },
};
