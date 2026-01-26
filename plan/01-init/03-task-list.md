# TurtleLove Frontend Task List

## Phase 1: 프로젝트 초기 설정

### 1.1 프로젝트 생성 및 기본 설정

- [x] Vite + React + TypeScript 프로젝트 생성
- [x] ESLint + Prettier 설정
- [x] tsconfig.json 경로 별칭 설정 (`@/` → `src/`)
- [x] .gitignore 설정
- [x] 환경 변수 설정 (`.env.example`, `.env.local`)
  - [x] `VITE_API_URL`
  - [x] `VITE_WS_URL`

### 1.2 핵심 의존성 설치

- [x] Tailwind CSS 설치 및 설정
  - [x] `tailwind.config.js` 커스텀 설정
  - [x] `globals.css` 설정
- [x] React Router v6 설치
- [x] Zustand 설치
- [x] TanStack Query 설치
- [x] Axios 설치
- [x] React Hook Form + Zod 설치
- [x] STOMP.js 설치

### 1.3 디렉토리 구조 생성

- [x] `src/app/` 구조 생성
- [x] `src/components/` 구조 생성 (atoms, molecules, organisms, templates)
- [x] `src/features/` 구조 생성 (auth, posts, comments, chat)
- [x] `src/pages/` 생성
- [x] `src/shared/` 구조 생성
- [x] `src/stores/` 생성
- [x] `src/styles/` 생성

---

## Phase 2: 공통 인프라 구축

### 2.1 API 레이어 설정

- [x] Axios 인스턴스 생성 (`shared/api/client.ts`)
- [x] 요청 인터셉터 설정 (토큰 자동 첨부)
- [x] 응답 인터셉터 설정 (에러 처리, 401 토큰 갱신)
- [x] API 에러 타입 정의 (`shared/types/api.types.ts`)

### 2.2 TanStack Query 설정

- [x] QueryClient 생성 및 설정
- [x] QueryProvider 컴포넌트 생성
- [x] 공통 Query Keys 정의 (`shared/api/queryKeys.ts`)

### 2.3 Zustand 스토어 생성

- [x] `authStore.ts` - 인증 상태 관리
- [x] `uiStore.ts` - UI 상태 (토스트, 모달)

### 2.4 라우터 설정

- [x] 라우트 정의 (`app/router/routes.tsx`)
- [x] ProtectedRoute 컴포넌트 구현
- [x] 라우트 상수 정의 (`shared/constants/routes.ts`)

### 2.5 레이아웃 컴포넌트

- [x] `MainLayout` 템플릿 구현
- [x] `AuthLayout` 템플릿 구현
- [x] `Header` 컴포넌트 구현
- [x] `Footer` 컴포넌트 구현

---

## Phase 3: Atoms 컴포넌트 구현

### 3.1 기본 컴포넌트

- [x] `Button` - variant(primary, secondary, ghost, danger), size, loading, disabled
- [x] `Input` - type, placeholder, error 상태
- [x] `Textarea` - rows, placeholder, error 상태
- [x] `Badge` - variant(success, warning, info, crush, breakup, dating, advice)
- [x] `Avatar` (GradientOrb) - 6가지 그라디언트 오브, fallback, size
- [x] `Spinner` - size, variant(default, rose, sage)
- [x] `Skeleton` - 로딩 플레이스홀더 (PostCardSkeleton, CommentSkeleton 포함)

### 3.2 유틸리티 컴포넌트

- [x] `Toast` - 알림 토스트 (success, error, info, warning)
- [x] `Modal` - 공통 모달 컴포넌트 (Radix UI Dialog 기반)
- [ ] `Dropdown` - 선택 드롭다운

### 3.3 TurtleLove 특화 컴포넌트

- [x] `WarmthMeter` - 게시글 "열기"를 보여주는 온도계 (0-100)

---

## Phase 4: 인증 기능 (UC-01 ~ UC-04)

### 4.1 API 및 타입

- [x] `features/auth/types/auth.types.ts` 정의
- [x] `features/auth/api/authApi.ts` 구현
  - [x] `sendVerificationCode` - 이메일 인증번호 발송
  - [x] `confirmVerificationCode` - 인증번호 확인
  - [x] `signup` - 회원가입
  - [x] `login` - 로그인
  - [x] `logout` - 로그아웃
  - [x] `refresh` - 토큰 갱신

### 4.2 훅 구현

- [x] `useAuth` - 인증 상태 및 유저 정보
- [x] `useLogin` - 로그인 뮤테이션
- [x] `useSignup` - 회원가입 뮤테이션 (useSendVerificationCode, useConfirmVerificationCode 포함)
- [x] `useLogout` - 로그아웃 뮤테이션

### 4.3 컴포넌트 및 페이지

- [x] `LoginForm` 컴포넌트
  - [x] 이메일 입력
  - [x] 비밀번호 입력
  - [x] 유효성 검사 (Zod)
  - [x] 로그인 버튼
- [x] `LoginPage` 페이지
- [x] `SignupForm` 컴포넌트
  - [x] Step 1: 이메일 입력 및 인증 요청
  - [x] Step 2: OTP 입력 및 확인 (3분 타이머)
  - [x] Step 3: 비밀번호, 닉네임, 성별 입력
- [x] `SignupPage` 페이지

---

## Phase 5: 게시글 기능 (UC-05 ~ UC-08)

### 5.1 API 및 타입

- [x] `features/posts/types/posts.types.ts` 정의
- [x] `features/posts/api/postsApi.ts` 구현
  - [x] `getList` - 목록 조회 (카테고리, 페이지네이션)
  - [x] `getDetail` - 상세 조회
  - [x] `create` - 작성
  - [x] `update` - 수정
  - [x] `delete` - 삭제

### 5.2 훅 구현

- [x] `usePosts` - 게시글 목록 쿼리 (무한스크롤)
- [x] `usePost` - 게시글 상세 쿼리
- [x] `useCreatePost` - 작성 뮤테이션
- [x] `useUpdatePost` - 수정 뮤테이션
- [x] `useDeletePost` - 삭제 뮤테이션

### 5.3 컴포넌트

- [x] `PostCard` 컴포넌트 - 목록용 카드
- [x] `PostList` 컴포넌트 - 무한스크롤 목록
- [x] `PostForm` 컴포넌트 - 작성/수정 폼
  - [x] 제목 입력
  - [x] 본문 에디터
  - [x] 카테고리 선택
  - [x] 공개 범위 설정 (대학 숨기기, 성별 필터)
- [x] `PostDetailView` 컴포넌트 - 상세 뷰

### 5.4 페이지

- [x] `PostListPage` - 목록 페이지 (카테고리 탭, 정렬)
- [x] `PostDetailPage` - 상세 페이지
- [x] `PostCreatePage` - 작성 페이지
- [x] `PostEditPage` - 수정 페이지

---

## Phase 6: 댓글 기능 (UC-09 ~ UC-10)

### 6.1 API 및 타입

- [x] `features/comments/types/comments.types.ts` 정의
- [x] `features/comments/api/commentsApi.ts` 구현
  - [x] `createComment` - 작성
  - [x] `updateComment` - 수정
  - [x] `deleteComment` - 삭제

### 6.2 훅 구현

- [x] `useCreateComment` - 작성 뮤테이션
- [x] `useUpdateComment` - 수정 뮤테이션
- [x] `useDeleteComment` - 삭제 뮤테이션

### 6.3 컴포넌트

- [x] `CommentItem` 컴포넌트 - 개별 댓글
  - [x] AI 필터링 표시 (is_filtered)
  - [x] 본인 댓글 수정/삭제 버튼
  - [x] 채팅 요청 버튼 (글쓴이에게만)
- [x] `CommentSection` 컴포넌트 - 댓글 목록 + 입력폼

---

## Phase 7: 채팅 기능 (UC-11 ~ UC-14)

### 7.1 API 및 타입

- [x] `features/chat/types/chat.types.ts` 정의
- [x] `features/chat/api/chatApi.ts` 구현
  - [x] `createChatRoom` - 채팅방 생성
  - [x] `getChatRooms` - 채팅방 목록
  - [x] `getChatMessages` - 메시지 내역

### 7.2 WebSocket 서비스

- [x] `features/chat/services/chatSocket.ts` 구현
  - [x] STOMP 연결/해제
  - [x] 채팅방 구독/해제
  - [x] 메시지 발송

### 7.3 훅 구현

- [x] `useChatRooms` - 채팅방 목록 쿼리
- [x] `useChatMessages` - 메시지 쿼리 (커서 기반 페이지네이션)
- [x] `useCreateChatRoom` - 채팅방 생성 뮤테이션
- [x] `useChatSocket` - WebSocket 연결 관리

### 7.4 컴포넌트

- [x] `ChatRoomCard` 컴포넌트 - 채팅방 목록 아이템
- [x] `ChatBubble` 컴포넌트 - 메시지 버블
- [x] `ChatInput` 컴포넌트 - 메시지 입력창
- [x] `ConnectionStatus` 컴포넌트 - WebSocket 연결 상태
- [x] `ChatRoom` 컴포넌트 - 채팅방 UI
  - [x] 메시지 목록 (자동 스크롤)
  - [x] 메시지 입력창
  - [x] 연결된 게시글 정보

### 7.5 페이지

- [x] `ChatListPage` - 채팅방 목록 페이지
- [x] `ChatRoomPage` - 채팅방 페이지
- [x] `CommentSection` 채팅 요청 기능 연결

---

## Phase 8: 마이페이지 (UC-04)

### 8.1 API 및 타입

- [x] `features/mypage/api/mypageApi.ts` 구현
  - [x] `getMyPosts` - 내가 쓴 글
  - [x] `getMyComments` - 내가 쓴 댓글

### 8.2 훅 구현

- [x] `useMyPosts` - 내 게시글 쿼리
- [x] `useMyComments` - 내 댓글 쿼리

### 8.3 컴포넌트 및 페이지

- [x] `MyPostList` 컴포넌트
- [x] `MyCommentList` 컴포넌트
- [x] `MyPage` 페이지 (탭: 내 글, 내 댓글, 채팅)

---

## Phase 9: 테스트 및 최적화

### 9.1 테스트

- [ ] Vitest 설정
- [ ] React Testing Library 설정
- [ ] 주요 컴포넌트 단위 테스트
- [ ] 주요 훅 테스트
- [ ] E2E 테스트 설정 (Playwright)

### 9.2 성능 최적화

- [ ] React.lazy를 활용한 코드 스플리팅
- [ ] 이미지 Lazy loading
- [ ] 번들 사이즈 분석 및 최적화
- [ ] Lighthouse 성능 점검

### 9.3 접근성

- [ ] ARIA 레이블 점검
- [ ] 키보드 네비게이션 점검
- [ ] 색상 대비 점검

---

## Phase 10: 배포 준비

### 10.1 빌드 설정

- [ ] 프로덕션 빌드 최적화
- [ ] 환경별 설정 분리 (dev, staging, prod)

### 10.2 배포

- [ ] Docker 설정 (Dockerfile, docker-compose)
- [ ] Nginx 설정 (SPA 라우팅)
- [ ] CI/CD 파이프라인 설정

---

## 우선순위 정리

| 우선순위 | Phase | 설명 |
|---------|-------|------|
| P0 | Phase 1-2 | 프로젝트 초기 설정 및 공통 인프라 |
| P0 | Phase 3 | Atoms 컴포넌트 |
| P1 | Phase 4 | 인증 기능 |
| P1 | Phase 5 | 게시글 기능 |
| P2 | Phase 6 | 댓글 기능 |
| P2 | Phase 7 | 채팅 기능 |
| P2 | Phase 8 | 마이페이지 |
| P3 | Phase 9 | 테스트 및 최적화 |
| P3 | Phase 10 | 배포 준비 |
