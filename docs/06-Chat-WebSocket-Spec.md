# 채팅 WebSocket 백엔드 사양 제안

## 개요

TurtleLove 1:1 실시간 채팅 기능을 위한 WebSocket(STOMP) 백엔드 사양 제안입니다. 프론트엔드는 STOMP.js v7을 사용하여 구현할 예정입니다.

---

## 1. WebSocket 연결

### 1.1 엔드포인트

```text
ws://localhost:8080/ws
```

**프로덕션**: `wss://your-domain.com/ws`

### 1.2 연결 인증

STOMP CONNECT 프레임에 JWT Bearer token 포함:

```text
CONNECT
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**백엔드 처리**:
- STOMP `CONNECT` 헤더에서 `Authorization` 추출
- JWT 유효성 검증
- 유효하지 않으면 연결 거부 (ERROR frame)

---

## 2. STOMP Destination

### 2.1 Subscribe (클라이언트 → 서버)

클라이언트가 채팅방 구독:

```text
SUBSCRIBE
id:sub-0
destination:/topic/chat.room.1
```

**백엔드 처리**:
- `/topic/chat.room.{roomId}` 패턴 매칭
- 사용자가 해당 채팅방의 참여자인지 확인
- 권한 없으면 ERROR frame 반환

### 2.2 Send (클라이언트 → 서버)

클라이언트가 메시지 전송:

```text
SEND
destination:/app/chat.send
content-type:application/json

{"roomId": 1, "content": "안녕하세요"}
```

**백엔드 처리**:
1. 요청 JSON 파싱: `{ roomId, content }`
2. 사용자 인증 (JWT에서 user_id 추출)
3. 권한 확인: 사용자가 `roomId`의 참여자인지 확인
4. 메시지 저장: DB에 `messages` 테이블에 저장
5. 브로드캐스트: 해당 방의 모든 구독자에게 메시지 전송

**에러 처리**:
- 권한 없음: ERROR frame + `403 Forbidden`
- 방 없음: ERROR frame + `404 Not Found`
- 비어있는 메시지: ERROR frame + `400 Bad Request`

---

## 3. 메시지 포맷

### 3.1 클라이언트 → 서버 (Message Send)

**JSON Payload**:

```json
{
  "roomId": 1,
  "content": "안녕하세요, 만나서 반가워요!"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| roomId | number | Y | 채팅방 ID |
| content | string | Y | 메시지 내용 (최대 1000자) |

### 3.2 서버 → 클라이언트 (Broadcast)

**MESSAGE Frame**:

```text
MESSAGE
destination:/topic/chat.room.1
content-type:application/json

{
  "id": 123,
  "room_id": 1,
  "sender_id": 5,
  "content": "안녕하세요, 만나서 반가워요!",
  "created_at": "2026-01-25T12:34:56.789Z"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| id | number | Y | 메시지 고유 ID |
| room_id | number | Y | 채팅방 ID |
| sender_id | number | Y | 발신자 ID |
| content | string | Y | 메시지 내용 |
| created_at | string | Y | ISO 8601 타임스탬프 |

---

## 4. 구독 관리

### 4.1 사용자 접속/접속종료 처리

**선택 사항**: 다음과항들은 초기 구현에서는 불필요할 수 있습니다.

#### 4.1.1 접속 알림 (TYPING indicator 등)

```text
MESSAGE
destination:/topic/chat.room.1
content-type:application/json

{
  "type": "TYPING",
  "sender_id": 5,
  "room_id": 1
}
```

#### 4.1.2 접속종료 처리

- STOMP `DISCONNECT` 프레임 수신 시
- 또는 WebSocket 연결 끊어졌을 때 (heartbeat 실패 등)

**백엔드 처리**:
- 사용자의 활성 상태 업데이트 (선택)
- 다른 참여자에게 "상대방이 나갔습니다" 메시지 전송 (선택)

---

## 5. Heartbeat

**STOMP Heartbeat 설정**:

```text
CONNECT
heart-beat:20000,20000
```

- **클라이언트 → 서버**: 20초 간격
- **서버 → 클라이언트**: 20초 간격

**백엔드 처리**:
- 20초 동안 heartbeat 수신 없으면 연결 종료
- 불필요한 zombie connection 방지

---

## 6. 에러 처리

### 6.1 ERROR Frame 예시

```text
ERROR
message:Forbidden
content-type:application/json

{
  "code": "CHAT_FORBIDDEN",
  "message": "이 채팅방에 접근할 권한이 없습니다."
}
```

### 6.2 공통 에러 코드

| 코드 | HTTP Status | 설명 |
|------|-------------|------|
| `CHAT_NOT_FOUND` | 404 | 채팅방을 찾을 수 없음 |
| `CHAT_FORBIDDEN` | 403 | 채팅방 접근 권한 없음 |
| `CHAT_EMPTY_MESSAGE` | 400 | 메시지 내용이 비어있음 |
| `CHAT_UNAUTHORIZED` | 401 | 인증되지 않음 (JWT 없음 또는 만료) |

---

## 7. REST API와의 통합

### 7.1 REST API (기존 명세 유지)

```text
POST   /api/chats/rooms           - 채팅방 생성
GET    /api/chats/rooms           - 내 채팅방 목록
GET    /api/chats/rooms/{id}/messages - 메시지 내역 (커서 기반 페이지네이션)
```

### 7.2 REST vs WebSocket 역할 분담

| 작업 | 방식 | 이유 |
|------|------|------|
| 채팅방 생성 | REST | 일회성 작업, DB 즉시 반영 필요 |
| 방 목록 조회 | REST | 초기 로딩, WebSocket 연결 전 |
| 메시지 내역 조회 | REST | 페이지네이션, 과거 메시지 |
| **실시간 메시지 수신** | **WebSocket** | **즉시 전달** |
| **실시간 메시지 전송** | **WebSocket** | **즉시 전달** |

---

## 8. 데이터베이스 스키마 (참고)

### 8.1 chat_rooms 테이블

```sql
CREATE TABLE chat_rooms (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  post_id BIGINT NOT NULL,
  user1_id BIGINT NOT NULL,  -- 게시글 작성자
  user2_id BIGINT NOT NULL,  -- 댓글 작성자 (초대받은 사람)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user1_id) REFERENCES users(id),
  FOREIGN KEY (user2_id) REFERENCES users(id)
);
```

### 8.2 chat_messages 테이블

```sql
CREATE TABLE chat_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  room_id BIGINT NOT NULL,
  sender_id BIGINT NOT NULL,
  content VARCHAR(1000) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id),
  FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- 인덱스 (쿼리 성능)
CREATE INDEX idx_messages_room_created ON chat_messages(room_id, created_at DESC);
```

---

## 9. unread_count 처리

### 9.1 현재 REST API 명세

```json
// GET /api/chats/rooms
[
  {
    "room_id": 1,
    "unread_count": 2,
    ...
  }
]
```

### 9.2 unread_count 초기화 시점

**제안 1**: 사용자가 채팅방에 진입했을 때
- `GET /api/chats/rooms/{roomId}/messages` 호출 시
- 백엔드에서 `unread_count = 0`으로 업데이트

**제안 2**: 마지막 메시지를 읽었을 때 (WebSocket)
- 별도의 "메시지 읽음" WebSocket 메시지 도입
```text
SEND
destination:/app/chat.read
{"roomId": 1, "messageId": 123}
```

**초기 구현**: **제안 1** 채택 (단순)

---

## 10. Spring Boot 구현 예시

### 10.1 WebSocket Config

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")  // WebSocket 엔드포인트
                .setAllowedOriginPatterns("*")
                .withSockJS();  // Fallback (선택)
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");  // 브로드캐스트용
        registry.setApplicationDestinationPrefixes("/app");  // 클라이언트 전송용
    }
}
```

### 10.2 ChatMessageController

```java
@Controller
public class ChatMessageController {

    @MessageMapping("/chat.send")
    @SendTo("/topic/chat.room.{roomId}")
    public ChatMessage sendMessage(
        @Payload SendMessageRequest request,
        Principal principal
    ) {
        // 1. 인증: principal에서 user_id 추출
        Long userId = Long.parseLong(principal.getName());

        // 2. 권한 확인: 사용자가 roomId의 참여자인지
        chatService.validateParticipant(request.getRoomId(), userId);

        // 3. 메시지 저장
        ChatMessage message = chatService.saveMessage(
            request.getRoomId(),
            userId,
            request.getContent()
        );

        return message;
    }
}
```

### 10.3 WebSocket Interceptor (JWT 인증)

```java
@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
            StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Authorization 헤더에서 JWT 추출
            String token = accessor.getFirstNativeHeader("Authorization");

            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // JWT 검증
            if (jwtTokenProvider.validateToken(token)) {
                String userId = jwtTokenProvider.getUserIdFromToken(token);
                accessor.setUser(new Principal() {
                    @Override
                    public String getName() {
                        return userId;
                    }
                });
            } else {
                // 인증 실패 → 연결 거부
                throw new AuthenticationCredentialsNotValidException("Invalid JWT");
            }
        }

        return message;
    }
}
```

---

## 11. 테스트 시나리오

### 11.1 정상 플로우

1. 클라이언트 A: WebSocket 연결 (JWT 포함)
2. 클라이언트 A: `/topic/chat.room.1` 구독
3. 클라이언트 B: WebSocket 연결 (JWT 포함)
4. 클라이언트 B: `/topic/chat.room.1` 구독
5. 클라이언트 A: `/app/chat.send`로 메시지 전송
6. **예상**: 클라이언트 A와 B 모두 MESSAGE frame 수신

### 11.2 권한 테스트

1. 클라이언트 C: room 2의 참여자가 아님
2. 클라이언트 C: `/topic/chat.room.2` 구독 시도
3. **예상**: ERROR frame 수신 (403 Forbidden)

### 11.3 인증 실패

1. 클라이언트 D: 잘못된 JWT로 WebSocket 연결 시도
2. **예상**: 연결 거부 또는 ERROR frame

---

## 12. 프론트엔드 구현 가이드

프론트엔드는 STOMP.js v7을 사용하여 다음과 같이 구현:

```typescript
import { Client } from '@stomp/stompjs';

const client = new Client({
  brokerURL: 'ws://localhost:8080/ws',
  connectHeaders: {
    Authorization: `Bearer ${token}`,
  },
  onConnect: () => {
    // 구독
    client.subscribe('/topic/chat.room.1', (message) => {
      const payload = JSON.parse(message.body);
      console.log('New message:', payload);
    });
  },
});

client.activate();
```

---

## 13. 체크리스트 (백엔드 구현 시)

### 필수 사항
- [ ] WebSocket 엔드포인트: `/ws`
- [ ] STOMP broker 활성화 (`/topic`, `/app`)
- [ ] JWT 인증 (CONNECT frame)
- [ ] `/app/chat.send` 메시지 핸들러
- [ ] `/topic/chat.room.{roomId}` 브로드캐스트
- [ ] 권한 확인 (채팅방 참여자)
- [ ] 메시지 DB 저장
- [ ] 에러 처리 (ERROR frame)

### 선택 사항
- [ ] Heartbeat (20s)
- [ ] SockJS fallback
- [ ] TYPING indicator
- [ ] 접속/접속종료 알림

---

## 14. FAQ

### Q1: SockJS가 필요한가요?

**A**: 선택사항입니다. WebSocket을 지원하지 않는 구형 브라우저를 위해 fallback을 제공합니다. 최신 브라우저만 지원하면 불필요합니다.

### Q2: 메시지 전송 후 DB 저장과 브로드캐스트 순서는?

**A**:
1. DB 저장 (트랜잭션)
2. 저장된 메시지를 `/topic/chat.room.{roomId}`로 브로드캐스트
3. 실패 시 롤백 및 ERROR frame 전송

### Q3: 한 사용자가 여러 기기에서 접속하면?

**A**: 각 기기마다 별도 WebSocket 연결이 생성됩니다. 모든 기기에서 MESSAGE frame을 수신합니다.

### Q4: 채팅방 나가기는 어떻게 처리?

**A**:
- REST API: `DELETE /api/chats/rooms/{roomId}` (구현 필요)
- 클라이언트는 단순히 `/topic/chat.room.{roomId}` 구독 해제
- 백엔드에서는 방의 `is_active = false`로 업데이트

---

## 15. 참고 자료

- [STOMP Protocol Specification](https://stomp.github.io/stomp-specification-1.2.html)
- [Spring WebSocket Documentation](https://docs.spring.io/spring-framework/reference/web/websocket.html)
- [STOMP.js v7 Documentation](https://stomp-js.github.io/stomp-websocket/)

---

## 16. 문의

프론트엔드: @dev-wantap
백엔드: (담당자명)

**최종 확인 일자**: 2026-01-25
**버전**: 1.0
