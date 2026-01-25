// =====================================================
// REQUEST TYPES
// =====================================================

export interface CreateChatRoomRequest {
  post_id: number;
  comment_id: number;
  receiver_id: number;
}

export interface GetChatMessagesParams {
  roomId: number;
  lastMessageId?: number | null;
  size?: number;
}

// =====================================================
// RESPONSE TYPES (API Spec 기반)
// =====================================================

export interface ChatRoomType {
  room_id: number;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
  post_info: {
    id: number;
    title: string;
  };
  opponent_nickname?: string;
}

export interface ChatMessage {
  id: number;
  room_id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

export interface ChatMessageWithMine extends ChatMessage {
  is_mine: boolean;
}

export type ChatRoomListResponse = ChatRoomType[];
export type ChatMessagesResponse = ChatMessage[];

export interface CreateChatRoomResponse {
  room_id: number;
}

// =====================================================
// WEBSOCKET MESSAGE TYPES
// =====================================================

// STOMP: Send message payload
export interface SendMessagePayload {
  roomId: number;
  content: string;
}

// STOMP: Subscribe message format (from server)
export interface ChatMessageSubscription extends ChatMessage {
  type: 'MESSAGE' | 'TYPING' | 'READ';
}

export interface ConnectionStatusType {
  connected: boolean;
  connecting: boolean;
  error: Error | null;
}
