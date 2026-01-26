import type { Comment } from '@/features/posts/types/posts.types';
import { generatePastTimestamp } from '../utils/generators';

/**
 * 게시글별 댓글 (각 게시글당 3-8개)
 */
export const mockComments: Record<number, Comment[]> = {
  1: [
    // 썸 타는 사람이 있는데...
    {
      id: 101,
      user_id: 2,
      content: '저도 비슷한 상황이었는데, 용기내서 고백했어요! 결과는 성공했습니다 ㅎㅎ',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(1),
    },
    {
      id: 102,
      user_id: 5,
      content: '과 동기면 조심스러울 수 있어요. 하지만 후회 안 남게 행동하세요!',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(1),
    },
    {
      id: 103,
      user_id: 8,
      content: '혹시 상대방도 비슷한 감정일 수도 있어요. 신호를 조금 더 지켜보는 것도 방법입니다.',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(1),
    },
  ],
  2: [
    // 연인과 헤어진 후...
    {
      id: 201,
      user_id: 3,
      content: '정말 힘드시겠어요... 저도 비슷한 경험 있어서 공감됩니다.',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(2),
    },
    {
      id: 202,
      user_id: 7,
      content: '시간이 정말 약이에요. 지금은 힘들겠지만 분명 나아질 거예요.',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(2),
    },
    {
      id: 203,
      user_id: 12,
      content: '친구들이랑 시간 보내면서 마음을 달래보세요. 응원합니다!',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(2),
    },
    {
      id: 204,
      user_id: 15,
      content: '헤어짐은 끝이 아니라 새로운 시작이에요. 힘내세요!',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(2),
    },
  ],
  3: [
    // 친구들과 거리감이...
    {
      id: 301,
      user_id: 4,
      content: '저도 복학생인데 정말 공감돼요. 동아리 가입하는 것도 좋은 방법이에요!',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(3),
    },
    {
      id: 302,
      user_id: 9,
      content: '과 MT나 학과 행사에 참여해보세요. 자연스럽게 친해질 수 있어요.',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(3),
    },
    {
      id: 303,
      user_id: 14,
      content: '나이 차이는 생각보다 크게 중요하지 않아요. 먼저 다가가보세요!',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(3),
    },
  ],
  4: [
    // 취업 준비 언제부터...
    {
      id: 401,
      user_id: 6,
      content: '3학년이면 아직 늦지 않았어요. 지금부터라도 시작하세요!',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(3),
    },
    {
      id: 402,
      user_id: 11,
      content: '저는 3학년 2학기부터 시작했는데 충분했어요. 너무 걱정 마세요.',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(3),
    },
  ],
  5: [
    // 학점 관리 vs 대외활동...
    {
      id: 501,
      user_id: 10,
      content: '학점이 기본이에요. 학점부터 챙기시고 여유되면 대외활동 하세요.',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(4),
    },
    {
      id: 502,
      user_id: 16,
      content: '저는 학점 3.5 유지하면서 동아리 활동했어요. 우선순위를 정하는 게 중요해요!',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(4),
    },
  ],
  6: [
    // 동아리 선배가...
    {
      id: 601,
      user_id: 13,
      content: '부담스러우면 거리를 두는 게 맞아요. 단호하게 거절하세요.',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(5),
    },
    {
      id: 602,
      user_id: 18,
      content: '친구들이랑 같이 다니면서 자연스럽게 거리를 두는 건 어떨까요?',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(5),
    },
  ],
  7: [
    // 군대 다녀온 후...
    {
      id: 701,
      user_id: 17,
      content: '저도 전역 후 복학했는데, 처음 한 학기가 가장 힘들더라고요. 시간 지나면 적응돼요!',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(6),
    },
    {
      id: 702,
      user_id: 20,
      content: '복학생 모임에 참여해보세요. 비슷한 처지의 사람들 만나면 위로가 돼요.',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(6),
    },
  ],
  8: [
    // 소개팅에서 계속...
    {
      id: 801,
      user_id: 19,
      content: '너무 조급해하지 마세요. 좋은 사람 만나려면 시간이 걸려요.',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(7),
    },
    {
      id: 802,
      user_id: 22,
      content: '첫인상도 중요하지만, 대화 스킬도 연습해보세요!',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(7),
    },
  ],
  9: [
    // 과 MT 가기 싫은데...
    {
      id: 901,
      user_id: 21,
      content: '안 가도 왕따는 안 당해요. 하지만 한 번쯤은 가보는 것도 좋아요!',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(8),
    },
    {
      id: 902,
      user_id: 24,
      content: '첫날만 참석하고 일찍 나오는 건 어떨까요?',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(8),
    },
  ],
  10: [
    // 전공이 너무 안 맞는...
    {
      id: 1001,
      user_id: 23,
      content: '전과는 신중하게 결정하세요. 먼저 다른 과 수업을 들어보는 건 어떨까요?',
      is_filtered: false,
      is_mine: false,
      created_at: generatePastTimestamp(9),
    },
  ],
};
