// 게시글 목록 조회
export interface PostListParams {
  category?: number;
  page?: number;
  size?: number;
  sort?: 'latest' | 'popular';
}

export interface PostListItem {
  id: number;
  title: string;
  created_at: string;
}

export interface PostListResponse {
  content: PostListItem[];
}

// 게시글 상세
export interface PostDetail {
  id: number;
  title: string;
  content: string;
  category: string;
  is_mine: boolean;
  created_at: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  user_id: number;
  content: string;
  is_filtered: boolean;
  is_mine: boolean;
  created_at: string;
}

// 게시글 작성/수정
export interface CreatePostRequest {
  title: string;
  content: string;
  category_id: number;
  visibility_type: 'ALL' | 'HIDE_SAME_UNI';
  target_gender: 'ALL' | 'MALE' | 'FEMALE' | null;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  visibility_type?: 'ALL' | 'HIDE_SAME_UNI';
  target_gender?: 'ALL' | 'MALE' | 'FEMALE' | null;
}

// 카테고리
export interface Category {
  id: number;
  name: string;
}

// 공개 범위
export type VisibilityType = 'ALL' | 'HIDE_SAME_UNI';
export type TargetGender = 'ALL' | 'MALE' | 'FEMALE' | null;
