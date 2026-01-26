import { generatePastTimestamp } from '../utils/generators';

/**
 * 채팅방별 메시지
 */
export const mockChatMessages: Record<number, any[]> = {
  1: [
    // room_id: 1
    {
      id: 1001,
      room_id: 1,
      sender_id: 1,
      content: '댓글 달아주셔서 감사해요! 좀 더 자세히 여쭤봐도 될까요?',
      created_at: generatePastTimestamp(1),
    },
    {
      id: 1002,
      room_id: 1,
      sender_id: 2,
      content: '네, 물론이죠! 무엇이든 물어보세요 :)',
      created_at: generatePastTimestamp(1),
    },
    {
      id: 1003,
      room_id: 1,
      sender_id: 1,
      content: '상대방이 나한테 관심 있는지 확인하는 방법이 있을까요?',
      created_at: generatePastTimestamp(1),
    },
    {
      id: 1004,
      room_id: 1,
      sender_id: 2,
      content: '같이 시간을 많이 보내려고 하는지, 먼저 연락하는지 보면 알 수 있어요!',
      created_at: generatePastTimestamp(1),
    },
    {
      id: 1005,
      room_id: 1,
      sender_id: 1,
      content: '네, 그렇게 생각하시는군요!',
      created_at: generatePastTimestamp(1),
    },
  ],
  2: [
    // room_id: 2
    {
      id: 2001,
      room_id: 2,
      sender_id: 1,
      content: '댓글 달아주신 분께 여쭤보고 싶은데 괜찮을까요?',
      created_at: generatePastTimestamp(2),
    },
    {
      id: 2002,
      room_id: 2,
      sender_id: 3,
      content: '네, 얼마든지요!',
      created_at: generatePastTimestamp(2),
    },
    {
      id: 2003,
      room_id: 2,
      sender_id: 1,
      content: '헤어진 후 얼마나 지나야 마음이 정리되던가요?',
      created_at: generatePastTimestamp(2),
    },
    {
      id: 2004,
      room_id: 2,
      sender_id: 3,
      content: '사람마다 다르지만 저는 3개월 정도 걸렸어요. 천천히 시간을 가지세요.',
      created_at: generatePastTimestamp(2),
    },
    {
      id: 2005,
      room_id: 2,
      sender_id: 1,
      content: '조언 감사합니다!',
      created_at: generatePastTimestamp(2),
    },
  ],
  3: [
    // room_id: 3
    {
      id: 3001,
      room_id: 3,
      sender_id: 1,
      content: '동아리 추천해주실 수 있나요?',
      created_at: generatePastTimestamp(3),
    },
    {
      id: 3002,
      room_id: 3,
      sender_id: 4,
      content: '취미가 뭐예요? 관심사에 맞는 동아리를 찾아보는 게 좋아요!',
      created_at: generatePastTimestamp(3),
    },
    {
      id: 3003,
      room_id: 3,
      sender_id: 1,
      content: '운동을 좋아해서 스포츠 동아리에 관심이 있어요.',
      created_at: generatePastTimestamp(3),
    },
    {
      id: 3004,
      room_id: 3,
      sender_id: 4,
      content: '그럼 축구 동아리나 배드민턴 동아리 어때요? 분위기도 좋고 친해지기 쉬워요!',
      created_at: generatePastTimestamp(3),
    },
    {
      id: 3005,
      room_id: 3,
      sender_id: 1,
      content: '한번 가보겠습니다!',
      created_at: generatePastTimestamp(3),
    },
  ],
};
