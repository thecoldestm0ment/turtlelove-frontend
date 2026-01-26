import { mockStorage } from './mockStorage';
import type { SendMessagePayload, ChatMessageSubscription } from '@/features/chat/types/chat.types';
import { generateId, generateTimestamp } from '../utils/generators';

/**
 * Mock WebSocket Service
 * 자동 응답 시뮬레이션
 */
class MockSocketService {
  private subscriptions: Map<number, (message: ChatMessageSubscription) => void> = new Map();

  subscribeToRoom(roomId: number, callback: (message: ChatMessageSubscription) => void): void {
    this.subscriptions.set(roomId, callback);
  }

  unsubscribeFromRoom(roomId: number): void {
    this.subscriptions.delete(roomId);
  }

  sendMessage(payload: SendMessagePayload, onResponse: (response: ChatMessageSubscription) => void): void {
    const { room_id, content } = payload;

    // 내 메시지 저장
    const myMessage = mockStorage.addChatMessage(room_id, {
      content,
      sender_id: mockStorage.getCurrentUserId() || 1,
    });

    console.log('[MockSocket] Message sent:', myMessage);

    // 자동 응답 생성 (2-5초 후)
    const responses = [
      '그렇군요! 더 자세히 알려주실 수 있나요?',
      '좋은 생각이네요 👍',
      '공감되는 말씀이에요.',
      '그 부분은 저도 비슷한 경험이 있어요.',
      '조언 감사합니다!',
      '혹시 더 궁금한 게 있으면 물어보세요.',
      '네, 맞아요! 저도 그렇게 생각해요.',
      '정말 도움이 되는 말씀이네요.',
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const autoReply: ChatMessageSubscription = {
      id: generateId(),
      room_id,
      sender_id: this.getOtherParticipant(room_id),
      content: randomResponse,
      created_at: generateTimestamp(),
      type: 'MESSAGE',
    };

    // 응답 저장
    mockStorage.addChatMessage(room_id, {
      content: autoReply.content,
      sender_id: autoReply.sender_id,
    });

    onResponse(autoReply);
  }

  private getOtherParticipant(roomId: number): number {
    const room = mockStorage.getChatRoomById(roomId);
    const currentUserId = mockStorage.getCurrentUserId() || 1;

    if (!room) return 2; // 기본값

    return room.participant_ids.find((id: number) => id !== currentUserId) || 2;
  }
}

export const mockSocketService = new MockSocketService();
