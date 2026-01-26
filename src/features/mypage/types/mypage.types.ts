/**
 * 내가 쓴 게시글
 */
export interface MyPost {
  id: number;
  title: string;
  category: string;
  comment_count: number;
  created_at: string;
}

/**
 * 내가 쓴 댓글
 */
export interface MyComment {
  id: number;
  content: string;
  created_at: string;
  post: {
    id: number;
    title: string;
    category: string;
  };
}

/**
 * 마이페이지 API 응답 타입
 */
export type MyPostListResponse = MyPost[];
export type MyCommentListResponse = MyComment[];

/**
 * 마이페이지 탭 타입
 */
export type MyPageTab = 'posts' | 'comments' | 'chats';
