import type { PostDetail } from '@/features/posts/types/posts.types';
import { generatePastTimestamp } from '../utils/generators';

/**
 * 현실적인 한국 대학생 연애 상담 게시글 (25개)
 */
export const mockPosts: PostDetail[] = [
  {
    id: 1,
    title: '썸 타는 사람이 있는데 고백해도 될까요?',
    content: `과 동기랑 한 달 정도 밥도 같이 먹고 영화도 봤는데, 고백하기가 무서워요.

거절당하면 과 생활이 어색해질까봐 걱정되는데... 어떻게 해야 할까요?

제 입장에서는 분명히 신호를 보내고 있다고 생각하는데, 상대방은 어떻게 생각하는지 모르겠어요.`,
    category: '연애',
    is_mine: false,
    created_at: generatePastTimestamp(1),
    comments: [],
  },
  {
    id: 2,
    title: '연인과 헤어진 후 너무 힘들어요',
    content: `2년 사귄 연인과 어제 헤어졌습니다.

가치관 차이로 헤어졌는데, 아직도 많이 보고 싶네요.
시간이 해결해준다고 하지만 지금은 너무 힘듭니다.

혹시 이별 극복하신 분들 계시면 조언 부탁드립니다.`,
    category: '연애',
    is_mine: false,
    created_at: generatePastTimestamp(2),
    comments: [],
  },
  {
    id: 3,
    title: '친구들과 거리감이 느껴져요',
    content: `복학하고 나니 같은 학번 친구들이 다 졸업해서 혼자 수업 듣는 느낌이에요.

새로운 친구를 만들고 싶은데 어떻게 시작해야 할까요?
나이 차이 때문에 선뜻 다가가기가 어렵네요.`,
    category: '친목',
    is_mine: false,
    created_at: generatePastTimestamp(3),
    comments: [],
  },
  {
    id: 4,
    title: '취업 준비 언제부터 해야 할까요',
    content: `3학년 1학기인데 아직 취업 준비를 시작하지 않았어요.

주변 친구들은 벌써 인턴도 하고 자격증도 따는데, 저만 뒤처진 것 같아서 불안합니다.
지금이라도 시작하면 늦지 않을까요?`,
    category: '취업',
    is_mine: false,
    created_at: generatePastTimestamp(3),
    comments: [],
  },
  {
    id: 5,
    title: '학점 관리 vs 대외활동 뭐가 더 중요할까요',
    content: `학점도 중요하고 대외활동도 중요하다는데, 둘 다 병행하기가 너무 힘들어요.

학점 관리에 집중하면 스펙이 부족할 것 같고,
대외활동에 치중하면 학점이 떨어질 것 같고...

어떻게 균형을 맞춰야 할까요?`,
    category: '학업',
    is_mine: false,
    created_at: generatePastTimestamp(4),
    comments: [],
  },
  {
    id: 6,
    title: '동아리 선배가 자꾸 연락해요',
    content: `같은 동아리 선배가 자꾸 개인적으로 연락하는데, 어떻게 대응해야 할지 모르겠어요.

처음에는 그냥 친하게 지내려는 줄 알았는데, 요즘은 좀 부담스러워요.
거절하면 동아리 활동이 어색해질까봐 걱정됩니다.`,
    category: '연애',
    is_mine: false,
    created_at: generatePastTimestamp(5),
    comments: [],
  },
  {
    id: 7,
    title: '군대 다녀온 후 학교 적응이 어려워요',
    content: `전역하고 복학했는데 학교 생활이 너무 낯설어요.

친구들은 다 졸업했고, 후배들이랑 같이 수업 듣는 게 어색하네요.
군대 전에는 학교생활이 즐거웠는데, 이제는 그냥 졸업만 하고 싶어요.`,
    category: '학업',
    is_mine: false,
    created_at: generatePastTimestamp(6),
    comments: [],
  },
  {
    id: 8,
    title: '소개팅에서 계속 차이는데 이유가 뭘까요',
    content: `친구들이 소개팅을 주선해줘서 여러 번 나갔는데, 매번 2-3번 보고 끝나요.

제가 뭐가 문제인지 모르겠어요. 외모도 평범하고 성격도 나쁘지 않다고 생각하는데...
혹시 제가 놓치고 있는 부분이 있을까요?`,
    category: '연애',
    is_mine: false,
    created_at: generatePastTimestamp(7),
    comments: [],
  },
  {
    id: 9,
    title: '과 MT 가기 싫은데 꼭 가야 할까요',
    content: `이번 주말에 과 MT가 있는데 솔직히 가기 싫어요.

술도 별로 안 좋아하고, 사람 많은 곳도 부담스러워요.
안 가면 왕따당할까봐 걱정되는데... 어떻게 해야 할까요?`,
    category: '친목',
    is_mine: false,
    created_at: generatePastTimestamp(8),
    comments: [],
  },
  {
    id: 10,
    title: '전공이 너무 안 맞는 것 같아요',
    content: `컴퓨터공학과에 다니고 있는데, 코딩이 너무 어렵고 흥미도 없어요.

부모님 권유로 입학했는데, 이제 와서 후회되네요.
전과를 고려 중인데, 늦지 않았을까요?`,
    category: '학업',
    is_mine: false,
    created_at: generatePastTimestamp(9),
    comments: [],
  },
  {
    id: 11,
    title: '장거리 연애 중인데 너무 힘들어요',
    content: `군대 간 남자친구를 기다리고 있는데, 외로움이 너무 크네요.

주변에서는 헤어지라고 하지만, 저는 기다리고 싶어요.
장거리 연애 성공하신 분들 계시면 조언 부탁드립니다.`,
    category: '연애',
    is_mine: false,
    created_at: generatePastTimestamp(10),
    comments: [],
  },
  {
    id: 12,
    title: '학과 공모전에 나갈까 말까 고민돼요',
    content: `학과에서 공모전 팀원을 구하는데, 참여할지 고민돼요.

스펙에는 도움이 될 것 같은데, 학점 관리와 병행하기가 부담스럽네요.
경험이 있으신 분들, 조언 부탁드립니다.`,
    category: '학업',
    is_mine: false,
    created_at: generatePastTimestamp(11),
    comments: [],
  },
  {
    id: 13,
    title: '헬스장에서 만난 사람에게 말 걸고 싶어요',
    content: `학교 헬스장에서 자주 보는 사람이 있는데, 어떻게 말을 걸어야 할까요?

운동 중에 말 거는 게 실례일까봐 망설여지네요.
자연스럽게 친해질 방법이 있을까요?`,
    category: '친목',
    is_mine: false,
    created_at: generatePastTimestamp(12),
    comments: [],
  },
  {
    id: 14,
    title: '인턴 경험이 너무 힘들어요',
    content: `방학 때 인턴을 시작했는데, 생각보다 너무 힘들어요.

선배들은 다 바쁘시고, 저는 잡일만 하는 것 같아서 의미가 있나 싶네요.
그래도 끝까지 버텨야 할까요?`,
    category: '취업',
    is_mine: false,
    created_at: generatePastTimestamp(13),
    comments: [],
  },
  {
    id: 15,
    title: '친구가 제 남자친구를 좋아하는 것 같아요',
    content: `친한 친구가 제 남자친구에게 자꾸 관심을 보이는데, 어떻게 대처해야 할까요?

남자친구는 제가 예민하다고 하는데, 저는 정말 불편해요.
친구에게 직접 말하는 게 나을까요?`,
    category: '연애',
    is_mine: false,
    created_at: generatePastTimestamp(14),
    comments: [],
  },
  {
    id: 16,
    title: '교환학생 가고 싶은데 부모님이 반대하세요',
    content: `교환학생 프로그램에 합격했는데, 부모님이 반대하세요.

돈도 많이 들고 위험하다고 하시는데, 저는 정말 가고 싶어요.
어떻게 설득해야 할까요?`,
    category: '학업',
    is_mine: false,
    created_at: generatePastTimestamp(15),
    comments: [],
  },
  {
    id: 17,
    title: '좋아하는 사람에게 거절당했어요',
    content: `용기내서 고백했는데 거절당했어요.

친구로 지내자고 하는데, 솔직히 친구로만 보기 힘들 것 같아요.
어떻게 정리해야 할까요?`,
    category: '연애',
    is_mine: false,
    created_at: generatePastTimestamp(16),
    comments: [],
  },
  {
    id: 18,
    title: '과 대표를 맡을까 고민돼요',
    content: `과 대표 선거에 출마하라고 하는데, 부담스러워요.

스펙에는 도움이 될 것 같은데, 시간이 너무 많이 걸릴 것 같아서요.
경험이 있으신 분들, 조언 부탁드립니다.`,
    category: '학업',
    is_mine: false,
    created_at: generatePastTimestamp(17),
    comments: [],
  },
  {
    id: 19,
    title: '술자리가 너무 부담스러워요',
    content: `학과 선배들이 자주 술자리에 부르는데, 매번 가기 힘들어요.

술도 약하고, 늦게까지 있는 것도 힘든데... 거절하면 이상하게 볼까요?`,
    category: '친목',
    is_mine: false,
    created_at: generatePastTimestamp(18),
    comments: [],
  },
  {
    id: 20,
    title: '동아리 친구들과 여행 가고 싶어요',
    content: `동아리 친구들과 여행을 계획 중인데, 어디가 좋을까요?

2박 3일 정도 생각하고 있고, 예산은 1인당 30만원 정도입니다.
추천 장소 있으면 알려주세요!`,
    category: '자유',
    is_mine: false,
    created_at: generatePastTimestamp(19),
    comments: [],
  },
  {
    id: 21,
    title: '졸업 후 대학원 vs 취업 고민돼요',
    content: `졸업을 앞두고 대학원과 취업 사이에서 고민하고 있어요.

연구하는 것도 좋아하지만, 경제적 부담도 걱정돼요.
어떤 선택이 나을까요?`,
    category: '취업',
    is_mine: false,
    created_at: generatePastTimestamp(20),
    comments: [],
  },
  {
    id: 22,
    title: '이성 친구와 단둘이 만나는 게 괜찮을까요',
    content: `연인이 있는데, 이성 친구와 단둘이 밥 먹는 게 괜찮을까요?

저는 그냥 친구라고 생각하는데, 연인이 싫어할까봐 걱정돼요.
여러분은 어떻게 생각하시나요?`,
    category: '연애',
    is_mine: false,
    created_at: generatePastTimestamp(21),
    comments: [],
  },
  {
    id: 23,
    title: '팀플 무임승차 어떻게 대처해야 하나요',
    content: `팀플에서 아무것도 안 하는 팀원이 있는데, 어떻게 대처해야 할까요?

교수님께 말씀드리기도 애매하고, 그냥 넘어가기도 억울해요.
좋은 방법 있을까요?`,
    category: '학업',
    is_mine: false,
    created_at: generatePastTimestamp(22),
    comments: [],
  },
  {
    id: 24,
    title: '자취 vs 기숙사 어디가 나을까요',
    content: `다음 학기에 자취를 할지 기숙사를 신청할지 고민돼요.

자취는 자유롭지만 비용이 많이 들고, 기숙사는 저렴하지만 불편할 것 같아요.
경험이 있으신 분들, 조언 부탁드립니다.`,
    category: '자유',
    is_mine: false,
    created_at: generatePastTimestamp(23),
    comments: [],
  },
  {
    id: 25,
    title: '연애 vs 학업 둘 다 잘하는 방법',
    content: `연애하면서 학점도 잘 받는 분들 어떻게 하시나요?

시간 관리가 너무 어려워요. 데이트도 하고 싶고 공부도 해야 하는데...
좋은 팁 있으면 공유 부탁드립니다!`,
    category: '연애',
    is_mine: false,
    created_at: generatePastTimestamp(24),
    comments: [],
  },
];
