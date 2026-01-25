import { Client, StompSubscription, type IMessage, type Frame } from '@stomp/stompjs';
import type { SendMessagePayload, ChatMessageSubscription } from '../types/chat.types';

// WebSocket Configuration
const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080/ws';

export interface ChatSocketCallbacks {
  onConnected: () => void;
  onDisconnected: () => void;
  onError: (frame: Frame) => void;
  onMessage: (message: ChatMessageSubscription) => void;
}

export class ChatSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();

  constructor(private callbacks: ChatSocketCallbacks) {}

  /**
   * WebSocket 연결
   * @param token - JWT access token
   */
  connect(token: string): void {
    if (this.client?.connected) {
      console.warn('[ChatSocket] Already connected');
      return;
    }

    this.client = new Client({
      brokerURL: WS_URL,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,
      reconnectDelay: 5000,
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('[STOMP]', str);
        }
      },
      onConnect: () => {
        console.log('[ChatSocket] Connected');
        this.callbacks.onConnected();
      },
      onDisconnect: () => {
        console.log('[ChatSocket] Disconnected');
        this.callbacks.onDisconnected();
      },
      onStompError: (frame) => {
        console.error('[ChatSocket] STOMP error:', frame);
        this.callbacks.onError(frame);
      },
    });

    this.client.activate();
  }

  /**
   * WebSocket 연결 해제
   */
  disconnect(): void {
    if (this.client) {
      this.unsubscribeAll();
      this.client.deactivate();
      this.client = null;
    }
  }

  /**
   * 채팅방 구독
   * @param roomId - 채팅방 ID
   */
  subscribeToRoom(roomId: number): void {
    if (!this.client?.connected) {
      console.warn('[ChatSocket] Cannot subscribe: not connected');
      return;
    }

    const destination = `/topic/chat.room.${roomId}`;

    if (this.subscriptions.has(destination)) {
      this.subscriptions.get(destination)?.unsubscribe();
    }

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      try {
        const parsed: ChatMessageSubscription = JSON.parse(message.body);
        this.callbacks.onMessage(parsed);
      } catch (error) {
        console.error('[ChatSocket] Failed to parse message:', error);
      }
    });

    this.subscriptions.set(destination, subscription);
    console.log(`[ChatSocket] Subscribed to room ${roomId}`);
  }

  /**
   * 채팅방 구독 해제
   */
  unsubscribeFromRoom(roomId: number): void {
    const destination = `/topic/chat.room.${roomId}`;
    const subscription = this.subscriptions.get(destination);

    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
      console.log(`[ChatSocket] Unsubscribed from room ${roomId}`);
    }
  }

  private unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }

  /**
   * 메시지 전송
   */
  sendMessage(payload: SendMessagePayload): void {
    if (!this.client?.connected) {
      console.error('[ChatSocket] Cannot send message: not connected');
      throw new Error('WebSocket not connected');
    }

    this.client.publish({
      destination: '/app/chat.send',
      body: JSON.stringify(payload),
    });
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  /**
   * 강제 재연결
   */
  forceReconnect(token: string): void {
    this.disconnect();
    setTimeout(() => {
      this.connect(token);
    }, 1000);
  }
}

// Singleton 패턴
let socketServiceInstance: ChatSocketService | null = null;

export function getChatSocketService(callbacks: ChatSocketCallbacks): ChatSocketService {
  if (!socketServiceInstance) {
    socketServiceInstance = new ChatSocketService(callbacks);
  }
  return socketServiceInstance;
}

export function resetChatSocketService(): void {
  if (socketServiceInstance) {
    socketServiceInstance.disconnect();
    socketServiceInstance = null;
  }
}
