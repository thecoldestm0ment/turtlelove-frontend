import { mockUsers } from '../data/users';
import { mockPosts } from '../data/posts';
import { mockComments } from '../data/comments';
import { mockChatRooms } from '../data/chatRooms';
import { mockChatMessages } from '../data/chatMessages';
import { generateId, generateTimestamp } from '../utils/generators';
import type { PostDetail, Comment } from '@/features/posts/types/posts.types';
import type { MockUser } from '../data/users';

/**
 * In-memory Mock Storage
 * 새로고침 시 초기 데이터로 리셋됨
 */
class MockStorage {
  private users: MockUser[] = [];
  private posts: PostDetail[] = [];
  private comments: Record<number, Comment[]> = {};
  private chatRooms: any[] = [];
  private chatMessages: Record<number, any[]> = {};

  // 현재 로그인된 사용자
  private currentUserId: number | null = null;

  constructor() {
    this.reset();
  }

  // 초기화 (새로고침 시뮬레이션)
  reset(): void {
    this.users = JSON.parse(JSON.stringify(mockUsers));
    this.posts = JSON.parse(JSON.stringify(mockPosts));
    this.comments = JSON.parse(JSON.stringify(mockComments));
    this.chatRooms = JSON.parse(JSON.stringify(mockChatRooms));
    this.chatMessages = JSON.parse(JSON.stringify(mockChatMessages));
    this.currentUserId = null;
  }

  // ===== 사용자 =====
  getUsers(): MockUser[] {
    return this.users;
  }

  getUserById(id: number): MockUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): MockUser | undefined {
    return this.users.find((u) => u.email === email);
  }

  // 현재 사용자
  setCurrentUser(userId: number): void {
    this.currentUserId = userId;
  }

  getCurrentUser(): MockUser | null {
    return this.currentUserId ? this.getUserById(this.currentUserId) || null : null;
  }

  getCurrentUserId(): number | null {
    return this.currentUserId;
  }

  // ===== 게시글 =====
  getPosts(): PostDetail[] {
    return this.posts;
  }

  getPostById(id: number): PostDetail | null {
    const post = this.posts.find((p) => p.id === id);
    if (!post) return null;

    // 댓글 포함하여 반환
    return {
      ...post,
      comments: this.comments[id] || [],
      is_mine: this.currentUserId === 1, // 간단화: 사용자 ID 1이 작성자
    };
  }

  createPost(data: any): PostDetail {
    const newPost: PostDetail = {
      id: generateId(),
      title: data.title,
      content: data.content,
      category: '연애', // 간단화: 카테고리 ID → 이름 매핑 생략
      created_at: generateTimestamp(),
      is_mine: true,
      comments: [],
    };
    this.posts.unshift(newPost); // 최신 글이 위로
    return newPost;
  }

  updatePost(id: number, data: any): PostDetail | null {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.posts[index] = { ...this.posts[index], ...data };
    return this.posts[index];
  }

  deletePost(id: number): boolean {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.posts.splice(index, 1);
    delete this.comments[id];
    return true;
  }

  // ===== 댓글 =====
  getCommentsByPostId(postId: number): Comment[] {
    return this.comments[postId] || [];
  }

  createComment(postId: number, data: any): Comment {
    if (!this.comments[postId]) {
      this.comments[postId] = [];
    }

    const newComment: Comment = {
      id: generateId(),
      user_id: this.currentUserId || 1,
      content: data.content,
      is_filtered: false, // AI 필터링 시뮬레이션 (항상 통과)
      is_mine: true,
      created_at: generateTimestamp(),
    };

    this.comments[postId].push(newComment);
    return newComment;
  }

  updateComment(commentId: number, data: any): Comment | null {
    for (const postId in this.comments) {
      const index = this.comments[postId].findIndex((c) => c.id === commentId);
      if (index !== -1) {
        this.comments[postId][index] = {
          ...this.comments[postId][index],
          content: data.content,
        };
        return this.comments[postId][index];
      }
    }
    return null;
  }

  deleteComment(commentId: number): boolean {
    for (const postId in this.comments) {
      const index = this.comments[postId].findIndex((c) => c.id === commentId);
      if (index !== -1) {
        this.comments[postId].splice(index, 1);
        return true;
      }
    }
    return false;
  }

  // ===== 채팅방 =====
  getChatRooms(): any[] {
    return this.chatRooms;
  }

  getChatRoomById(roomId: number): any | undefined {
    return this.chatRooms.find((r) => r.room_id === roomId);
  }

  createChatRoom(data: any): any {
    const newRoom = {
      room_id: generateId(),
      post_id: data.post_id,
      participant_ids: [this.currentUserId || 1, data.receiver_id],
      last_message: '',
      last_message_at: generateTimestamp(),
      unread_count: 0,
      post_info: {
        id: data.post_id,
        title: 'Demo 게시글',
      },
    };
    this.chatRooms.push(newRoom);
    this.chatMessages[newRoom.room_id] = [];
    return { room_id: newRoom.room_id };
  }

  // ===== 채팅 메시지 =====
  getChatMessages(roomId: number): any[] {
    return this.chatMessages[roomId] || [];
  }

  addChatMessage(roomId: number, data: any): any {
    if (!this.chatMessages[roomId]) {
      this.chatMessages[roomId] = [];
    }

    const newMessage = {
      id: generateId(),
      room_id: roomId,
      sender_id: data.sender_id || this.currentUserId || 1,
      content: data.content,
      created_at: generateTimestamp(),
    };

    this.chatMessages[roomId].push(newMessage);

    // 채팅방 마지막 메시지 업데이트
    const room = this.chatRooms.find((r) => r.room_id === roomId);
    if (room) {
      room.last_message = data.content;
      room.last_message_at = newMessage.created_at;
    }

    return newMessage;
  }
}

export const mockStorage = new MockStorage();
