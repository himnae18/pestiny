const openings = [
  '조용히 기다리던 기회가 모습을 드러내는 날이에요.',
  '평소보다 감이 빠르게 맞아떨어지는 하루예요.',
  '작은 선택 하나가 생각보다 좋은 흐름을 만들어요.',
  '당신의 진심을 알아보는 사람이 가까이에 있어요.',
  '미뤄 두었던 일이 뜻밖에 쉽게 풀릴 수 있어요.',
  '오늘은 우연처럼 보이는 행운이 자주 찾아와요.',
  '불안했던 마음이 차분히 정리되기 시작해요.',
  '당신의 장점이 자연스럽게 드러나는 날이에요.',
  '새로운 인연이나 제안이 기분 좋은 자극이 돼요.',
  '익숙한 것 속에서 새로운 답을 발견하게 돼요.',
]

const middles = [
  '서두르지 말고 가장 마음이 편한 쪽을 고르면 좋은 결과로 이어질 가능성이 커요.',
  '먼저 건넨 한마디가 관계의 분위기를 부드럽게 바꿔 줄 거예요.',
  '완벽하게 준비하려 하기보다 지금 할 수 있는 만큼 시작해 보는 게 좋아요.',
  '평소보다 솔직한 표현이 오해를 줄이고 원하는 반응을 끌어낼 수 있어요.',
  '주변의 속도에 맞추기보다 나만의 리듬을 지키는 것이 행운을 붙잡는 방법이에요.',
  '오래 고민한 문제는 혼자 붙들기보다 믿을 만한 사람과 나눠 보세요.',
  '사소해 보이는 정리나 청소가 마음의 흐름까지 가볍게 만들어 줄 수 있어요.',
  '한 번 더 확인하는 습관이 실수를 막고 좋은 평가까지 가져올 수 있어요.',
  '지금 떠오른 아이디어는 메모해 두면 가까운 시일 안에 쓸모가 생겨요.',
  '기분이 흔들릴 때는 결론을 서두르지 말고 잠시 거리를 두는 편이 유리해요.',
]

const endings = [
  '오늘의 행운은 생각보다 가까운 곳에 있어요.',
  '작은 용기가 하루의 결말을 바꿀 수 있어요.',
  '당신이 먼저 자신을 믿어 주는 것이 가장 중요해요.',
  '좋은 흐름은 밤이 될수록 더 선명해질 거예요.',
  '기대하지 않았던 곳에서 반가운 답을 받을 수 있어요.',
  '천천히 가도 방향만 맞으면 충분히 좋은 날이에요.',
  '오늘의 선택은 다음 주의 기분 좋은 변화로 이어질 수 있어요.',
  '마음을 숨기지 않을수록 운이 당신 편에 서요.',
  '조금 쉬어 가는 것도 앞으로 나아가는 방법이에요.',
  '당신에게 필요한 건 큰 행운보다 정확한 한 걸음이에요.',
]

const titles = ['새벽별의 신호', '보랏빛 행운', '느린 기적', '우연한 초대', '마음의 나침반', '숨은 열쇠', '따뜻한 반전', '달빛 약속', '좋은 예감', '작은 왕관']
const colors = ['라벤더', '와인 레드', '크림 화이트', '딥 블루', '피치 핑크', '세이지 그린', '골드', '실버', '버건디', '스카이 블루']
const items = ['작은 거울', '리본', '이어폰', '따뜻한 음료', '메모장', '반지', '향수', '동전', '꽃', '책갈피']
const times = ['오전 9시', '오전 11시', '오후 2시', '오후 4시', '오후 6시', '오후 8시', '오후 10시', '자정 무렵']

export const grades = [
  { name: '대길', weight: 8, min: 92, max: 100 },
  { name: '길', weight: 24, min: 78, max: 91 },
  { name: '소길', weight: 38, min: 63, max: 77 },
  { name: '평', weight: 24, min: 48, max: 62 },
  { name: '조심', weight: 6, min: 35, max: 47 },
]

function pickByWeight() {
  const total = grades.reduce((sum, grade) => sum + grade.weight, 0)
  let cursor = Math.random() * total
  for (const grade of grades) {
    cursor -= grade.weight
    if (cursor <= 0) return grade
  }
  return grades[grades.length - 1]
}

export function drawFortune() {
  const grade = pickByWeight()
  const index = Math.floor(Math.random() * 200)
  const score = Math.floor(Math.random() * (grade.max - grade.min + 1)) + grade.min
  return {
    id: `fortune-${Date.now()}-${index}`,
    type: 'fortune',
    grade: grade.name,
    title: titles[index % titles.length],
    body: `${openings[index % openings.length]} ${middles[Math.floor(index / 10) % middles.length]} ${endings[Math.floor(index / 20) % endings.length]}`,
    score,
    luckyColor: colors[(index * 3) % colors.length],
    luckyItem: items[(index * 7) % items.length],
    luckyTime: times[(index * 5) % times.length],
    createdAt: new Date().toISOString(),
  }
}

const relationOpenings = [
  '두 사람은 서로 다른 방식으로 같은 곳을 바라보는 관계예요.',
  '처음에는 낯설어도 가까워질수록 편안함이 커지는 조합이에요.',
  '감정의 온도 차이가 있지만 그만큼 서로를 보완할 수 있어요.',
  '말보다 행동에서 마음을 확인하게 되는 인연이에요.',
  '서로의 장점을 빠르게 발견하는 밝은 궁합이에요.',
  '익숙함과 설렘이 함께 들어 있는 관계예요.',
  '조금만 솔직해지면 급격히 가까워질 수 있는 조합이에요.',
  '한쪽이 흔들릴 때 다른 한쪽이 중심을 잡아 주는 관계예요.',
  '서로에게 새로운 세계를 보여 줄 가능성이 큰 인연이에요.',
  '사소한 장난과 대화가 관계를 오래 이어 주는 궁합이에요.',
]

const relationAdvice = [
  '상대의 반응을 미리 단정 짓지 말고 궁금한 것은 직접 물어보는 것이 좋아요.',
  '연락의 양보다 서로가 편안해지는 방식을 함께 정하면 관계가 단단해져요.',
  '서운함을 참았다가 한꺼번에 말하기보다 작은 순간에 부드럽게 알려 주세요.',
  '칭찬과 고마움을 아끼지 않으면 두 사람의 좋은 흐름이 오래 유지돼요.',
  '다름을 고치려 하기보다 각자의 속도를 인정할수록 잘 맞는 부분이 커져요.',
  '함께하는 계획을 아주 작게라도 정해 두면 관계가 안정적으로 이어져요.',
  '감정이 격해졌을 때는 결론보다 서로의 의도를 먼저 확인하는 편이 좋아요.',
  '둘만의 농담이나 습관을 만드는 것이 관계를 특별하게 만들어 줘요.',
  '상대가 알아서 눈치채길 기다리기보다 원하는 것을 구체적으로 표현해 보세요.',
  '가끔은 평소와 다른 장소에서 시간을 보내면 새로운 설렘이 생겨요.',
]

export function drawCompatibility(nameA, nameB, relation = '연인') {
  const seedText = `${nameA.trim()}|${nameB.trim()}|${relation}|${Date.now()}`
  let seed = 0
  for (let i = 0; i < seedText.length; i += 1) seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0
  const index = seed % 200
  const score = 55 + (seed % 46)
  const grade = score >= 92 ? '운명' : score >= 82 ? '찰떡' : score >= 70 ? '좋음' : score >= 60 ? '가능성' : '노력형'
  return {
    id: `compat-${Date.now()}-${index}`,
    type: 'compatibility',
    grade,
    title: `${nameA || '나'} × ${nameB || '상대'}의 ${relation} 궁합`,
    body: `${relationOpenings[index % relationOpenings.length]} ${relationAdvice[Math.floor(index / 10) % relationAdvice.length]}`,
    score,
    keywords: [colors[index % colors.length], items[(index * 3) % items.length], endings[(index * 7) % endings.length].replace('오늘의 ', '').replace('이에요.', '')],
    createdAt: new Date().toISOString(),
  }
}
