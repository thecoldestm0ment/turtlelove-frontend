# TurtleLove Frontend

대학생 연애 상담 커뮤니티 플랫폼의 프론트엔드 애플리케이션입니다.

## 기술 스택

- **프레임워크**: React 19 + TypeScript
- **빌드 도구**: Vite 7
- **상태 관리**: Zustand, TanStack Query
- **스타일링**: Tailwind CSS
- **폼 관리**: React Hook Form + Zod
- **라우팅**: React Router v7
- **실시간 통신**: STOMP over WebSocket

## 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
npm install
```

### 개발 모드 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어 애플리케이션을 확인할 수 있습니다.

### 빌드

```bash
npm run build
```

프로덕션 빌드가 `dist/` 디렉토리에 생성됩니다.

### 미리보기

```bash
npm run preview
```

빌드된 애플리케이션을 로컬에서 미리볼 수 있습니다.

## Demo Mode

**백엔드 서버 없이** 앱의 모든 기능을 체험할 수 있는 Demo 모드를 지원합니다.

### Demo 모드 실행

```bash
npm run demo
```

브라우저가 자동으로 열리고, 백엔드 연결 없이 완전히 독립적으로 동작합니다.

### Demo 계정

로그인 페이지에서 다음 계정 중 하나를 사용하세요:

- **남학생 계정**: `student1@snu.ac.kr` / `demo123!`
- **여학생 계정**: `student2@yonsei.ac.kr` / `demo123!`

### Demo 모드 특징

- ✅ **완전한 인터랙션**: 게시글/댓글 작성, 수정, 삭제 가능
- ✅ **실시간 채팅 시뮬레이션**: 메시지 전송 시 2-5초 후 자동 응답
- ✅ **현실적인 데이터**: 한국 대학생 연애 상담 내용 25개 게시글 포함
- ⚠️ **데이터 영속성 없음**: 모든 데이터는 로컬 메모리에만 저장됩니다
- ⚠️ **새로고침 시 초기화**: 페이지 새로고침 시 초기 데이터로 리셋됩니다
- ⚠️ **회원가입 불가**: Demo 모드에서는 제공된 계정만 사용 가능합니다

### Demo 빌드 생성

```bash
npm run build:demo
```

Demo 모드의 정적 빌드를 생성하여 배포할 수 있습니다.

```bash
npm run preview:demo
```

빌드된 Demo 애플리케이션을 미리볼 수 있습니다.

## Docker 사용법

프로젝트는 Docker 컨테이너로 실행할 수 있습니다.

### 필수 요구사항

- Docker 20.10 이상
- Docker Compose (선택사항)

### Docker 이미지 빌드

```bash
# Demo 모드 빌드 (백엔드 불필요)
docker build -t turtlelove-frontend:demo \
  --build-arg BUILD_MODE=demo \
  --build-arg VITE_API_URL=mock \
  --build-arg VITE_WS_URL=mock \
  .

# Production 모드 빌드 (백엔드 필요)
docker build -t turtlelove-frontend:latest \
  --build-arg BUILD_MODE=production \
  --build-arg VITE_API_URL=/api \
  --build-arg VITE_WS_URL=/ws \
  .
```

### Docker 컨테이너 실행

```bash
# Demo 모드 실행
docker run -d -p 3000:8080 --name turtlelove-demo turtlelove-frontend:demo

# 브라우저에서 접속
open http://localhost:3000
```

### Docker Compose 사용

```bash
# Demo 모드 실행 (백엔드 없이)
docker-compose up demo

# Production 모드 실행 (백엔드 필요)
docker-compose --profile production up app

# 로그 확인
docker-compose logs -f demo

# 중지
docker-compose down
```

### 컨테이너 상태 확인

```bash
# 실행 중인 컨테이너 확인
docker ps

# 컨테이너 로그 확인
docker logs turtlelove-demo

# Health check 확인
curl http://localhost:3000/health
```

### 주요 포트

| 서비스 | 컨테이너 포트 | 호스트 포트 | URL |
|--------|--------------|------------|-----|
| Frontend (nginx) | 8080 | 3000 | http://localhost:3000 |

### Docker 이미지 정보

- **기본 이미지**: nginx:alpine
- **최종 이미지 크기**: 약 62.6 MB
- **Health Check**: 자동으로 컨테이너 상태 감시

## 주요 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 모드 실행 (백엔드 필요) |
| `npm run demo` | Demo 모드 실행 (백엔드 불필요) |
| `npm run build` | 프로덕션 빌드 |
| `npm run build:demo` | Demo 모드 빌드 |
| `npm run preview` | 프로덕션 빌드 미리보기 |
| `npm run preview:demo` | Demo 빌드 미리보기 |
| `npm run lint` | ESLint 검사 |
| `npm run lint:fix` | ESLint 자동 수정 |
| `npm run format` | Prettier 포맷팅 |
| `npm run test` | 테스트 실행 (watch 모드) |
| `npm run test:run` | 테스트 실행 (단일 실행) |
| `npm run test:coverage` | 테스트 커버리지 확인 |

## 프로젝트 구조

```
src/
├── app/                    # 앱 진입점 및 프로바이더
├── components/             # Atomic Design 기반 컴포넌트
│   ├── atoms/             # 기본 컴포넌트 (Button, Input 등)
│   ├── molecules/         # 복합 컴포넌트
│   ├── organisms/         # 복잡한 UI 블록
│   └── templates/         # 레이아웃 템플릿
├── features/              # 기능별 모듈
│   ├── auth/             # 인증
│   ├── posts/            # 게시글
│   ├── comments/         # 댓글
│   ├── chat/             # 채팅
│   └── mypage/           # 마이페이지
├── pages/                 # 페이지 컴포넌트
├── shared/                # 공유 리소스
│   ├── api/              # API 클라이언트
│   ├── config/           # 설정
│   ├── hooks/            # 공통 훅
│   ├── types/            # 공통 타입
│   └── utils/            # 유틸리티 함수
├── stores/                # Zustand 스토어
├── styles/                # 전역 스타일
├── mock/                  # Demo 모드 Mock 데이터 및 서비스
│   ├── data/             # Mock 데이터
│   ├── services/         # Mock API/WebSocket 서비스
│   └── utils/            # Mock 유틸리티
└── test/                  # 테스트 설정 및 유틸리티
```

## 환경 변수

프로젝트는 세 가지 환경을 지원합니다:

### Development (.env.development)
```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
VITE_APP_MODE=development
```

### Production (.env.production)
```env
VITE_API_URL=/api
VITE_WS_URL=wss://api.turtlelove.com/ws
VITE_APP_MODE=production
```

### Demo (.env.demo)
```env
VITE_API_URL=mock
VITE_WS_URL=mock
VITE_APP_MODE=demo
```

## 개발 가이드

### 코드 스타일

프로젝트는 ESLint와 Prettier를 사용하여 일관된 코드 스타일을 유지합니다.

```bash
# 린트 검사
npm run lint

# 자동 수정
npm run lint:fix

# 포맷팅
npm run format
```

### 테스트

Vitest와 React Testing Library를 사용합니다.

```bash
# 테스트 실행
npm run test

# 커버리지 확인
npm run test:coverage
```

## 라이선스

이 프로젝트는 비공개 프로젝트입니다.
