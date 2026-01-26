import { generatePastTimestamp } from '../utils/generators';

/**
 * 채팅방 샘플 (3개)
 */
export const mockChatRooms = [
  {
    room_id: 1,
    post_id: 1,
    participant_ids: [1, 2], // 게시글 작성자(1)와 댓글 작성자(2)
    last_message: '네, 그렇게 생각하시는군요!',
    last_message_at: generatePastTimestamp(1),
    unread_count: 0,
    post_info: {
      id: 1,
      title: '썸 타는 사람이 있는데 고백해도 될까요?',
    },
  },
  {
    room_id: 2,
    post_id: 2,
    participant_ids: [1, 3],
    last_message: '조언 감사합니다!',
    last_message_at: generatePastTimestamp(2),
    unread_count: 0,
    post_info: {
      id: 2,
      title: '연인과 헤어진 후 너무 힘들어요',
    },
  },
  {
    room_id: 3,
    post_id: 3,
    participant_ids: [1, 4],
    last_message: '한번 가보겠습니다!',
    last_message_at: generatePastTimestamp(3),
    unread_count: 0,
    post_info: {
      id: 3,
      title: '친구들과 거리감이 느껴져요',
    },
  },
];
