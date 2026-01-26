import type { ChatSocketCallbacks } from './chatSocket';
import type { SendMessagePayload, ChatMessageSubscription } from '../types/chat.types';
import { mockSocketService } from '@/mock/services/mockSocketService';

/**
 * Mock WebSocket Service
 * 실제 ChatSocketService 인터페이스를 모방
 */
export class ChatSocketServiceMock {
  private callbacks: ChatSocketCallbacks;
  private connected = false;
  private subscribedRooms = new Set<number>();

  constructor(callbacks: ChatSocketCallbacks) {
    this.callbacks = callbacks;
  }

  connect(token: string): void {
    if (this.connected) {
      console.warn('[MockChatSocket] Already connected');
      return;
    }

    // 연결 시뮬레이션 (500ms 후 연결)
    setTimeout(() => {
      this.connected = true;
      console.log('[MockChatSocket] Connected (simulated)');
      this.callbacks.onConnected();
    }, 500);
  }

  disconnect(): void {
    if (this.connected) {
      this.subscribedRooms.clear();
      this.connected = false;
      console.log('[MockChatSocket] Disconnected (simulated)');
      this.callbacks.onDisconnected();
    }
  }

  subscribeToRoom(roomId: number): void {
    if (!this.connected) {
      console.warn('[MockChatSocket] Cannot subscribe: not connected');
      return;
    }

    this.subscribedRooms.add(roomId);
    console.log(`[MockChatSocket] Subscribed to room ${roomId}`);

    // Mock 서비스에 구독 등록
    mockSocketService.subscribeToRoom(roomId, (message) => {
      this.callbacks.onMessage(message);
    });
  }

  unsubscribeFromRoom(roomId: number): void {
    if (this.subscribedRooms.has(roomId)) {
      this.subscribedRooms.delete(roomId);
      mockSocketService.unsubscribeFromRoom(roomId);
      console.log(`[MockChatSocket] Unsubscribed from room ${roomId}`);
    }
  }

  sendMessage(payload: SendMessagePayload): void {
    if (!this.connected) {
      console.error('[MockChatSocket] Cannot send message: not connected');
      throw new Error('WebSocket not connected');
    }

    // Mock 서비스로 메시지 전송 (자동 응답 트리거)
    mockSocketService.sendMessage(payload, (response) => {
      // 자동 응답 시뮬레이션 (2-5초 후)
      const delay = 2000 + Math.random() * 3000;
      setTimeout(() => {
        this.callbacks.onMessage(response);
      }, delay);
    });
  }

  isConnected(): boolean {
    return this.connected;
  }

  forceReconnect(token: string): void {
    this.disconnect();
    setTimeout(() => {
      this.connect(token);
    }, 1000);
  }

  setCallbacks(callbacks: ChatSocketCallbacks): void {
    this.callbacks = callbacks;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private unsubscribeAll(): void {
    this.subscribedRooms.forEach((roomId) => {
      mockSocketService.unsubscribeFromRoom(roomId);
    });
    this.subscribedRooms.clear();
  }
}

// Mock Singleton
let mockSocketInstance: ChatSocketServiceMock | null = null;

export function getMockChatSocketService(callbacks: ChatSocketCallbacks): ChatSocketServiceMock {
  if (!mockSocketInstance) {
    mockSocketInstance = new ChatSocketServiceMock(callbacks);
  } else {
    mockSocketInstance.setCallbacks(callbacks);
  }
  return mockSocketInstance;
}

export function resetMockChatSocketService(): void {
  if (mockSocketInstance) {
    mockSocketInstance.disconnect();
    mockSocketInstance = null;
  }
}
