export const clubs = [
  {
    id: 1,
    name: '산악회',
    icon: '⛰️',
    description: '매월 정기적으로 전국의 명산을 탐방하며 건강과 친목을 도모하는 동호회입니다.',
    memberCount: 32,
    leaderId: 101,
    leaderName: '김정호',
    fee: 30000,
    meetingSchedule: '매월 둘째 주 토요일',
  },
  {
    id: 2,
    name: '골프회',
    icon: '⛳',
    description: '골프를 통해 회원 간 네트워크를 강화하고 건전한 여가 활동을 즐기는 동호회입니다.',
    memberCount: 24,
    leaderId: 102,
    leaderName: '박성민',
    fee: 50000,
    meetingSchedule: '매월 셋째 주 토요일',
  },
  {
    id: 3,
    name: '트레킹회',
    icon: '🥾',
    description: '도심 근교 둘레길과 해안길을 걸으며 자연을 만끽하는 동호회입니다.',
    memberCount: 28,
    leaderId: 103,
    leaderName: '이수진',
    fee: 20000,
    meetingSchedule: '매월 첫째 주 일요일',
  },
  {
    id: 4,
    name: '독서회',
    icon: '📚',
    description: '매월 선정 도서를 함께 읽고 토론하며 지적 교류를 나누는 동호회입니다.',
    memberCount: 18,
    leaderId: 104,
    leaderName: '최영희',
    fee: 15000,
    meetingSchedule: '매월 넷째 주 수요일 저녁',
  },
]

export const clubMembers = [
  // 산악회
  { id: 1, clubId: 1, memberId: 101, memberName: '김정호', joinedAt: '2023-03-15', role: '회장' },
  { id: 2, clubId: 1, memberId: 105, memberName: '한상우', joinedAt: '2023-03-15', role: '총무' },
  { id: 3, clubId: 1, memberId: 106, memberName: '윤재혁', joinedAt: '2023-04-10', role: '회원' },
  { id: 4, clubId: 1, memberId: 107, memberName: '장미란', joinedAt: '2023-05-20', role: '회원' },
  { id: 5, clubId: 1, memberId: 108, memberName: '오세훈', joinedAt: '2023-06-01', role: '회원' },
  // 골프회
  { id: 6, clubId: 2, memberId: 102, memberName: '박성민', joinedAt: '2023-02-10', role: '회장' },
  { id: 7, clubId: 2, memberId: 109, memberName: '정태영', joinedAt: '2023-02-10', role: '총무' },
  { id: 8, clubId: 2, memberId: 110, memberName: '강민수', joinedAt: '2023-03-05', role: '회원' },
  { id: 9, clubId: 2, memberId: 111, memberName: '서영진', joinedAt: '2023-04-15', role: '회원' },
  { id: 10, clubId: 2, memberId: 112, memberName: '임현정', joinedAt: '2023-05-08', role: '회원' },
  // 트레킹회
  { id: 11, clubId: 3, memberId: 103, memberName: '이수진', joinedAt: '2023-01-20', role: '회장' },
  { id: 12, clubId: 3, memberId: 113, memberName: '배준서', joinedAt: '2023-01-20', role: '총무' },
  { id: 13, clubId: 3, memberId: 114, memberName: '송지원', joinedAt: '2023-02-28', role: '회원' },
  { id: 14, clubId: 3, memberId: 115, memberName: '류동혁', joinedAt: '2023-03-12', role: '회원' },
  { id: 15, clubId: 3, memberId: 116, memberName: '허윤아', joinedAt: '2023-04-05', role: '회원' },
  // 독서회
  { id: 16, clubId: 4, memberId: 104, memberName: '최영희', joinedAt: '2023-04-01', role: '회장' },
  { id: 17, clubId: 4, memberId: 117, memberName: '문성호', joinedAt: '2023-04-01', role: '총무' },
  { id: 18, clubId: 4, memberId: 118, memberName: '나혜린', joinedAt: '2023-04-20', role: '회원' },
  { id: 19, clubId: 4, memberId: 119, memberName: '고은상', joinedAt: '2023-05-10', role: '회원' },
  { id: 20, clubId: 4, memberId: 120, memberName: '안서연', joinedAt: '2023-06-15', role: '회원' },
]

export const clubActivities = [
  // 산악회 활동
  { id: 1, clubId: 1, date: '2026-01-10', title: '북한산 백운대 등반', content: '겨울철 북한산 백운대 정상 등반을 진행하였습니다. 총 18명 참석하였으며 안전하게 완등하였습니다.', photos: [] },
  { id: 2, clubId: 1, date: '2026-02-14', title: '관악산 정기산행', content: '관악산 연주대 코스를 통해 정기산행을 실시하였습니다. 하산 후 뒤풀이를 진행하였습니다.', photos: [] },
  { id: 3, clubId: 1, date: '2026-03-14', title: '지리산 노고단 봄맞이 산행', content: '1박 2일 일정으로 지리산 노고단 산행을 진행하였습니다. 봄꽃이 만개하여 좋은 경치를 감상하였습니다.', photos: [] },
  // 골프회 활동
  { id: 4, clubId: 2, date: '2026-01-17', title: '신년 골프 라운딩', content: '용인 소재 골프장에서 신년 첫 라운딩을 진행하였습니다. 총 16명 참석하였습니다.', photos: [] },
  { id: 5, clubId: 2, date: '2026-02-21', title: '2월 정기 라운딩', content: '이천 소재 골프장에서 정기 라운딩을 진행하였습니다. 스킨스 게임을 병행하였습니다.', photos: [] },
  { id: 6, clubId: 2, date: '2026-03-21', title: '봄맞이 골프 대회', content: '회원 간 친선 골프 대회를 개최하였습니다. 우승자에게 소정의 상품을 수여하였습니다.', photos: [] },
  // 트레킹회 활동
  { id: 7, clubId: 3, date: '2026-01-04', title: '제주 올레길 트레킹', content: '제주 올레길 7코스를 걸으며 겨울 바다를 감상하였습니다. 20명이 참가하였습니다.', photos: [] },
  { id: 8, clubId: 3, date: '2026-02-01', title: '서울 한양도성 순성길', content: '한양도성 순성길 전 구간을 완보하였습니다. 도심 속 역사 탐방을 겸하였습니다.', photos: [] },
  { id: 9, clubId: 3, date: '2026-03-01', title: '남해 바래길 봄 트레킹', content: '남해 바래길 2코스를 걸으며 봄의 정취를 만끽하였습니다. 현지 맛집 탐방도 함께하였습니다.', photos: [] },
  // 독서회 활동
  { id: 10, clubId: 4, date: '2026-01-28', title: '1월 독서 토론: 데미안', content: '헤르만 헤세의 "데미안"을 주제로 심도 있는 토론을 진행하였습니다. 12명 참석하였습니다.', photos: [] },
  { id: 11, clubId: 4, date: '2026-02-25', title: '2월 독서 토론: 사피엔스', content: '유발 하라리의 "사피엔스"를 읽고 인류 문명에 대해 토론하였습니다.', photos: [] },
  { id: 12, clubId: 4, date: '2026-03-25', title: '3월 독서 토론: 아몬드', content: '손원평의 "아몬드"를 읽고 감정과 공감에 대해 이야기를 나누었습니다.', photos: [] },
]

export const clubFees = [
  // 산악회 회비
  { id: 1, clubId: 1, memberId: 101, memberName: '김정호', amount: 30000, paidDate: '2026-01-05', status: '납부' },
  { id: 2, clubId: 1, memberId: 105, memberName: '한상우', amount: 30000, paidDate: '2026-01-07', status: '납부' },
  { id: 3, clubId: 1, memberId: 106, memberName: '윤재혁', amount: 30000, paidDate: null, status: '미납' },
  { id: 4, clubId: 1, memberId: 107, memberName: '장미란', amount: 30000, paidDate: '2026-01-10', status: '납부' },
  { id: 5, clubId: 1, memberId: 108, memberName: '오세훈', amount: 30000, paidDate: null, status: '미납' },
  // 골프회 회비
  { id: 6, clubId: 2, memberId: 102, memberName: '박성민', amount: 50000, paidDate: '2026-01-03', status: '납부' },
  { id: 7, clubId: 2, memberId: 109, memberName: '정태영', amount: 50000, paidDate: '2026-01-05', status: '납부' },
  { id: 8, clubId: 2, memberId: 110, memberName: '강민수', amount: 50000, paidDate: '2026-01-12', status: '납부' },
  { id: 9, clubId: 2, memberId: 111, memberName: '서영진', amount: 50000, paidDate: null, status: '미납' },
  { id: 10, clubId: 2, memberId: 112, memberName: '임현정', amount: 50000, paidDate: '2026-01-15', status: '납부' },
  // 트레킹회 회비
  { id: 11, clubId: 3, memberId: 103, memberName: '이수진', amount: 20000, paidDate: '2026-01-02', status: '납부' },
  { id: 12, clubId: 3, memberId: 113, memberName: '배준서', amount: 20000, paidDate: '2026-01-04', status: '납부' },
  { id: 13, clubId: 3, memberId: 114, memberName: '송지원', amount: 20000, paidDate: null, status: '미납' },
  { id: 14, clubId: 3, memberId: 115, memberName: '류동혁', amount: 20000, paidDate: '2026-01-08', status: '납부' },
  { id: 15, clubId: 3, memberId: 116, memberName: '허윤아', amount: 20000, paidDate: '2026-01-10', status: '납부' },
  // 독서회 회비
  { id: 16, clubId: 4, memberId: 104, memberName: '최영희', amount: 15000, paidDate: '2026-01-06', status: '납부' },
  { id: 17, clubId: 4, memberId: 117, memberName: '문성호', amount: 15000, paidDate: '2026-01-06', status: '납부' },
  { id: 18, clubId: 4, memberId: 118, memberName: '나혜린', amount: 15000, paidDate: null, status: '미납' },
  { id: 19, clubId: 4, memberId: 119, memberName: '고은상', amount: 15000, paidDate: '2026-01-20', status: '납부' },
  { id: 20, clubId: 4, memberId: 120, memberName: '안서연', amount: 15000, paidDate: '2026-01-22', status: '납부' },
]
