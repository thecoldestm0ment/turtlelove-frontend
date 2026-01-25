import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuthStore } from '@/stores';
import { getChatSocketService } from '../services/chatSocket';
import type { ChatMessageSubscription, SendMessagePayload } from '../types/chat.types';
import { useQueryClient } from '@tanstack/react-query';
import type { Frame } from '@stomp/stompjs';

interface UseChatSocketOptions {
  roomId?: number;
  onMessage?: (message: ChatMessageSubscription) => void;
}

export function useChatSocket({ roomId, onMessage }: UseChatSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();
  const socketServiceRef = useRef<ReturnType<typeof getChatSocketService> | null>(null);
  const onMessageRef = useRef(onMessage);
  const { accessToken } = useAuthStore();

  // 최신 콜백 유지
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // 콜백 생성 로직을 useCallback으로 추출
  const createCallbacks = useCallback(() => ({
    onConnected: () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
    },
    onDisconnected: () => {
      setIsConnected(false);
    },
    onError: (frame: Frame) => {
      setError(new Error(frame.headers?.message || 'WebSocket error'));
      setIsConnecting(false);
    },
    onMessage: (message: ChatMessageSubscription) => {
      // 메시지 캐시 무효화
      if (message.room_id) {
        queryClient.invalidateQueries({
          queryKey: ['chat', 'messages', message.room_id],
        });
      }

      // 채팅방 목록 무효화 (last_message, unread_count 업데이트)
      queryClient.invalidateQueries({
        queryKey: ['chat', 'rooms'],
      });

      onMessageRef.current?.(message);
    },
  }), [queryClient]);

  // Initialize socket service
  useEffect(() => {
    if (!accessToken) return;

    socketServiceRef.current = getChatSocketService(createCallbacks());

    return () => {
      // Cleanup: don't destroy on unmount
    };
  }, [accessToken, createCallbacks]);

  // Connect/Disconnect based on auth
  useEffect(() => {
    if (!socketServiceRef.current || !accessToken) return;

    if (accessToken && !isConnected && !isConnecting) {
      setIsConnecting(true);
      socketServiceRef.current.connect(accessToken);
    }

    return () => {
      if (!accessToken) {
        socketServiceRef.current?.disconnect();
      }
    };
  }, [accessToken, isConnected, isConnecting]);

  // Subscribe to room when roomId changes
  useEffect(() => {
    if (!socketServiceRef.current || !roomId || !isConnected) return;

    socketServiceRef.current.subscribeToRoom(roomId);

    return () => {
      if (socketServiceRef.current) {
        socketServiceRef.current.unsubscribeFromRoom(roomId);
      }
    };
  }, [roomId, isConnected]);

  // Send message function
  const sendMessage = useCallback(
    (payload: SendMessagePayload) => {
      if (!socketServiceRef.current) {
        throw new Error('Socket service not initialized');
      }

      socketServiceRef.current.sendMessage(payload);
    },
    []
  );

  // Force reconnect function
  const reconnect = useCallback(() => {
    if (!socketServiceRef.current || !accessToken) return;

    setIsConnecting(true);
    socketServiceRef.current.forceReconnect(accessToken);
  }, [accessToken]);

  return {
    isConnected,
    isConnecting,
    error,
    sendMessage,
    reconnect,
  };
}
