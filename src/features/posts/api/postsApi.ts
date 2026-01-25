import { apiClient } from '@/shared/api/client';
import type {
  PostListParams,
  PostListResponse,
  PostDetail,
  CreatePostRequest,
  UpdatePostRequest,
} from '../types/posts.types';

export const postsApi = {
  // 게시글 목록 조회
  getList: async (params: PostListParams): Promise<PostListResponse> => {
    const response = await apiClient.get<PostListResponse>('/posts', { params });
    return response.data;
  },

  // 게시글 상세 조회
  getDetail: async (id: number): Promise<PostDetail> => {
    const response = await apiClient.get<PostDetail>(`/posts/${id}`);
    return response.data;
  },

  // 게시글 작성
  create: async (data: CreatePostRequest): Promise<PostDetail> => {
    const response = await apiClient.post<PostDetail>('/posts', data);
    return response.data;
  },

  // 게시글 수정
  update: async (id: number, data: UpdatePostRequest): Promise<PostDetail> => {
    const response = await apiClient.put<PostDetail>(`/posts/${id}`, data);
    return response.data;
  },

  // 게시글 삭제
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },
};
