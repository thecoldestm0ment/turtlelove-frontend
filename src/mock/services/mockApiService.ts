import type { AxiosRequestConfig } from 'axios';
import { mockStorage } from './mockStorage';
import { simulateNetworkDelay } from '../utils/delays';

/**
 * Mock API Service
 * URL 패턴 매칭 및 응답 생성
 */
class MockApiService {
  async handleRequest(
    method: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<any> {
    console.log(`[MockAPI] ${method} ${url}`, data);

    // 네트워크 지연 시뮬레이션
    await simulateNetworkDelay();

    // URL 파싱
    const [path, queryString] = url.split('?');
    const params = this.parseQueryString(queryString);

    // ===== Auth 라우팅 =====
    if (path === '/auth/login' && method === 'POST') {
      return this.handleLogin(data);
    }

    if (path === '/auth/signup' && method === 'POST') {
      return this.handleSignup(data);
    }

    if (path === '/auth/logout' && method === 'POST') {
      return this.handleLogout();
    }

    if (path === '/auth/email/verify' && method === 'POST') {
      return this.handleEmailVerify(data);
    }

    if (path === '/auth/email/confirm' && method === 'POST') {
      return this.handleEmailConfirm(data);
    }

    // ===== Posts 라우팅 =====
    if (path === '/posts' && method === 'GET') {
      return this.handleGetPosts(params);
    }

    if (path.match(/^\/posts\/\d+$/) && method === 'GET') {
      const postId = parseInt(path.split('/')[2]);
      return this.handleGetPostDetail(postId);
    }

    if (path === '/posts' && method === 'POST') {
      return this.handleCreatePost(data);
    }

    if (path.match(/^\/posts\/\d+$/) && method === 'PUT') {
      const postId = parseInt(path.split('/')[2]);
      return this.handleUpdatePost(postId, data);
    }

    if (path.match(/^\/posts\/\d+$/) && method === 'DELETE') {
      const postId = parseInt(path.split('/')[2]);
      return this.handleDeletePost(postId);
    }

    // ===== Comments 라우팅 =====
    if (path.match(/^\/posts\/\d+\/comments$/) && method === 'POST') {
      const postId = parseInt(path.split('/')[2]);
      return this.handleCreateComment(postId, data);
    }

    if (path.match(/^\/comments\/\d+$/) && method === 'PUT') {
      const commentId = parseInt(path.split('/')[2]);
      return this.handleUpdateComment(commentId, data);
    }

    if (path.match(/^\/comments\/\d+$/) && method === 'DELETE') {
      const commentId = parseInt(path.split('/')[2]);
      return this.handleDeleteComment(commentId);
    }

    // ===== Chat 라우팅 =====
    if (path === '/chats/rooms' && method === 'GET') {
      return this.handleGetChatRooms();
    }

    if (path === '/chats/rooms' && method === 'POST') {
      return this.handleCreateChatRoom(data);
    }

    if (path.match(/^\/chats\/rooms\/\d+\/messages$/) && method === 'GET') {
      const roomId = parseInt(path.split('/')[3]);
      return this.handleGetChatMessages(roomId, params);
    }

    // ===== MyPage 라우팅 =====
    if (path === '/mypage/posts' && method === 'GET') {
      return this.handleGetMyPosts();
    }

    if (path === '/mypage/comments' && method === 'GET') {
      return this.handleGetMyComments();
    }

    // 404
    throw {
      status: 404,
      data: { code: 'NOT_FOUND', message: 'Mock endpoint not found' },
    };
  }

  // ===== Auth Handlers =====
  private handleLogin(data: any) {
    const user = mockStorage.getUserByEmail(data.email);

    if (!user || user.password !== data.password) {
      throw {
        status: 401,
        data: { code: 'INVALID_CREDENTIALS', message: '이메일 또는 비밀번호가 일치하지 않습니다.' },
      };
    }

    mockStorage.setCurrentUser(user.id);

    // Demo 모드에서 사용자 정보 함께 반환
    return {
      accessToken: `mock-token-${user.id}`,
      refreshToken: `mock-refresh-${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        university: user.university,
        gender: user.gender,
      },
    };
  }

  private handleSignup(data: any) {
    // Demo에서는 회원가입 불가 (기존 계정만 사용)
    throw {
      status: 400,
      data: {
        code: 'DEMO_MODE',
        message: 'Demo 모드에서는 회원가입이 불가능합니다. 제공된 계정을 사용하세요.',
      },
    };
  }

  private handleLogout() {
    mockStorage.setCurrentUser(null!);
    return { message: 'Logged out successfully' };
  }

  private handleEmailVerify(data: any) {
    // 항상 성공
    return { message: 'Verification code sent' };
  }

  private handleEmailConfirm(data: any) {
    // 항상 성공
    return { message: 'Email confirmed' };
  }

  // ===== Posts Handlers =====
  private handleGetPosts(params: any) {
    let posts = mockStorage.getPosts();

    // 카테고리 필터링
    if (params.category) {
      // 간단화: 카테고리 필터링 생략
    }

    return { content: posts };
  }

  private handleGetPostDetail(postId: number) {
    const post = mockStorage.getPostById(postId);

    if (!post) {
      throw {
        status: 404,
        data: { code: 'NOT_FOUND', message: '존재하지 않는 게시글입니다.' },
      };
    }

    return post;
  }

  private handleCreatePost(data: any) {
    return mockStorage.createPost(data);
  }

  private handleUpdatePost(postId: number, data: any) {
    const updated = mockStorage.updatePost(postId, data);

    if (!updated) {
      throw {
        status: 404,
        data: { code: 'NOT_FOUND', message: '존재하지 않는 게시글입니다.' },
      };
    }

    return updated;
  }

  private handleDeletePost(postId: number) {
    const deleted = mockStorage.deletePost(postId);

    if (!deleted) {
      throw {
        status: 404,
        data: { code: 'NOT_FOUND', message: '존재하지 않는 게시글입니다.' },
      };
    }

    return { message: 'Post deleted successfully' };
  }

  // ===== Comments Handlers =====
  private handleCreateComment(postId: number, data: any) {
    return mockStorage.createComment(postId, data);
  }

  private handleUpdateComment(commentId: number, data: any) {
    const updated = mockStorage.updateComment(commentId, data);

    if (!updated) {
      throw {
        status: 404,
        data: { code: 'NOT_FOUND', message: '존재하지 않는 댓글입니다.' },
      };
    }

    return updated;
  }

  private handleDeleteComment(commentId: number) {
    const deleted = mockStorage.deleteComment(commentId);

    if (!deleted) {
      throw {
        status: 404,
        data: { code: 'NOT_FOUND', message: '존재하지 않는 댓글입니다.' },
      };
    }

    return { message: 'Comment deleted successfully', commentId };
  }

  // ===== Chat Handlers =====
  private handleGetChatRooms() {
    return mockStorage.getChatRooms();
  }

  private handleCreateChatRoom(data: any) {
    return mockStorage.createChatRoom(data);
  }

  private handleGetChatMessages(roomId: number, params: any) {
    const messages = mockStorage.getChatMessages(roomId);

    // 커서 기반 페이지네이션 시뮬레이션
    let filtered = messages;
    if (params.lastMessageId) {
      const lastId = parseInt(params.lastMessageId);
      const index = messages.findIndex((m: any) => m.id === lastId);
      if (index !== -1) {
        filtered = messages.slice(index + 1);
      }
    }

    const size = params.size ? parseInt(params.size) : 50;
    return filtered.slice(0, size);
  }

  // ===== MyPage Handlers =====
  private handleGetMyPosts() {
    const posts = mockStorage.getPosts();
    // 간단화: 첫 3개 게시글을 내 글로 가정
    return posts.slice(0, 3).map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      comment_count: mockStorage.getCommentsByPostId(p.id).length,
      created_at: p.created_at,
    }));
  }

  private handleGetMyComments() {
    // 간단화: 몇 개의 댓글을 내 댓글로 반환
    return [
      {
        id: 101,
        content: '저도 비슷한 상황이었는데...',
        created_at: '2026-01-20T15:00:00',
        post: {
          id: 1,
          title: '썸 타는 사람이 있는데 고백해도 될까요?',
          category: '연애',
        },
      },
    ];
  }

  // ===== Utility =====
  private parseQueryString(queryString?: string): Record<string, string> {
    if (!queryString) return {};

    return queryString.split('&').reduce(
      (acc, pair) => {
        const [key, value] = pair.split('=');
        acc[decodeURIComponent(key)] = decodeURIComponent(value || '');
        return acc;
      },
      {} as Record<string, string>
    );
  }
}

export const mockApiService = new MockApiService();
