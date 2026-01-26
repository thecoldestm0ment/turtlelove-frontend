import { apiClient } from '@/shared/api/client';
import type {
  MyPostListResponse,
  MyCommentListResponse,
} from '../types';

/**
 * 마이페이지 API
 */
export const mypageApi = {
  /**
   * 내가 쓴 글 목록 조회
   * GET /api/mypage/posts
   */
  getMyPosts: async (): Promise<MyPostListResponse> => {
    const response = await apiClient.get<MyPostListResponse>('/mypage/posts');
    return response.data;
  },

  /**
   * 내가 쓴 댓글 목록 조회
   * GET /api/mypage/comments
   */
  getMyComments: async (): Promise<MyCommentListResponse> => {
    const response = await apiClient.get<MyCommentListResponse>('/mypage/comments');
    return response.data;
  },
};
