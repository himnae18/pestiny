(function () {
  "use strict";

  const fortuneTitles = [
    "기다리던 흐름이 움직이는 날",
    "작은 선택이 행운을 부르는 날",
    "당신의 진심이 선명해지는 날",
    "천천히 가도 길을 잃지 않는 날",
    "뜻밖의 반가움이 찾아오는 날",
    "마음의 여유가 답을 보여주는 날",
    "용기 낸 한마디가 빛나는 날",
    "낯선 기회와 눈이 마주치는 날",
    "오래 품은 소원이 가까워지는 날",
    "정리할수록 새로운 자리가 생기는 날",
    "좋은 인연의 기척이 느껴지는 날",
    "당신의 감각을 믿어도 좋은 날",
    "조용한 집중이 성과로 이어지는 날",
    "예상 밖의 칭찬을 받게 되는 날",
    "한 걸음 물러서면 길이 보이는 날",
    "미뤄 둔 일을 끝내기 좋은 날",
    "따뜻한 말이 돌아오는 날",
    "우연처럼 보이는 기회가 오는 날",
    "스스로를 아끼는 만큼 풀리는 날",
    "끝이라고 생각한 곳에서 문이 열리는 날"
  ];

  const fortuneMessages = [
    "오늘은 서두르기보다 주변의 흐름을 한 번 더 살피는 편이 좋아요. 이미 충분히 잘하고 있으니 조급함만 내려놓으면 놓쳤던 기회가 자연스럽게 보일 거예요.",
    "마음속에서 계속 떠오르는 생각이 있다면 가볍게라도 실행해 보세요. 완벽한 준비보다 작은 시작이 더 큰 행운을 데려오는 하루입니다.",
    "사람 사이의 온도가 평소보다 섬세하게 느껴질 수 있어요. 상대의 말보다 행동을 천천히 바라보면 진심을 오해하지 않고 편안하게 받아들일 수 있습니다.",
    "해야 할 일이 많아 보여도 가장 중요한 하나만 제대로 끝내면 충분해요. 집중한 시간은 생각보다 빠르게 좋은 결과로 돌아올 가능성이 큽니다.",
    "뜻밖의 연락이나 제안이 들어올 수 있어요. 처음부터 정답을 정하기보다 열린 마음으로 대화를 이어가면 새로운 선택지가 생길 거예요.",
    "오늘은 스스로에게 조금 관대해져도 괜찮아요. 쉬어 가는 시간은 뒤처지는 시간이 아니라 다음 움직임을 정확하게 만드는 준비가 됩니다.",
    "평소 말하지 못했던 마음을 부드럽게 표현하기 좋은 날이에요. 솔직함에 배려를 더하면 관계의 막힌 부분이 예상보다 쉽게 풀릴 수 있습니다.",
    "돈이나 시간과 관련된 결정은 즉흥적으로 내리기보다 한 번 적어보고 판단하세요. 작은 점검만으로 불필요한 소비와 후회를 크게 줄일 수 있어요.",
    "이미 지나간 실수보다 지금 바꿀 수 있는 부분에 집중해 보세요. 오늘의 태도 하나가 앞으로의 분위기를 완전히 다르게 만들 수 있습니다.",
    "눈에 띄는 큰 행운보다 사소한 편안함이 여러 번 찾아오는 날이에요. 작은 좋은 일을 알아차릴수록 하루 전체의 흐름도 밝아질 거예요."
  ];

  const fortuneKickers = [
    "좋은 변화의 시작", "마음이 향하는 곳", "천천히 피어나는 기회", "관계가 맑아지는 순간",
    "집중이 힘이 되는 때", "새로운 문 앞에서", "정리 뒤에 오는 여유", "용기가 필요한 한 걸음",
    "당신 편인 하루", "우연이 건네는 힌트"
  ];

  const colors = ["라벤더", "와인 레드", "크림 화이트", "새벽 네이비", "로즈 핑크", "민트", "골드", "하늘색", "코랄", "은빛 회색"];
  const items = ["작은 거울", "이어폰", "손글씨 메모", "따뜻한 음료", "리본", "좋아하는 향수", "동전", "책갈피", "사진 한 장", "별 모양 소품"];
  const advices = ["한 번 더 웃어보기", "가장 쉬운 일부터 시작하기", "마음을 짧게라도 표현하기", "10분만 정리하기", "물을 충분히 마시기", "충동적인 답장은 잠시 미루기", "칭찬을 그대로 받아들이기", "작은 약속을 지키기", "혼자만의 시간을 챙기기", "고마운 사람에게 연락하기"];
  const grades = ["대길", "길", "소길", "평온", "기회"];

  const compatibilityTitles = [
    "말하지 않아도 온도가 닮은 사이",
    "다를수록 서로를 채워주는 사이",
    "천천히 가까워질수록 단단한 사이",
    "웃음의 박자가 잘 맞는 사이",
    "서로의 하루를 밝혀주는 사이",
    "솔직함이 관계를 키우는 사이",
    "함께할 때 용기가 생기는 사이",
    "조용한 신뢰가 쌓이는 사이",
    "작은 배려가 크게 돌아오는 사이",
    "같은 곳을 다른 방식으로 보는 사이",
    "감정의 속도를 맞추면 빛나는 사이",
    "편안함 속에 설렘이 숨어 있는 사이",
    "서로에게 좋은 자극이 되는 사이",
    "대화할수록 매력이 깊어지는 사이",
    "거리를 잘 지킬수록 가까워지는 사이",
    "서로의 부족함을 감싸는 사이",
    "기억에 오래 남을 장면을 만드는 사이",
    "함께 성장할 가능성이 큰 사이",
    "오해만 풀면 빠르게 가까워지는 사이",
    "서로의 편이 되어줄 수 있는 사이"
  ];

  const compatibilityMessages = [
    "두 사람은 표현 방식이 조금 달라도 마음이 향하는 방향은 비슷해요. 상대가 알아서 이해해 주길 기다리기보다 짧고 솔직하게 말하면 관계가 훨씬 편안해질 거예요.",
    "한 사람은 빠르게 움직이고 다른 한 사람은 충분히 생각한 뒤 움직이는 경향이 있어요. 속도의 차이를 틀림으로 보지 않으면 서로에게 든든한 균형이 됩니다.",
    "함께 있을 때 사소한 일도 즐거워질 가능성이 높은 조합이에요. 거창한 계획보다 가벼운 산책이나 짧은 통화처럼 부담 없는 시간을 자주 만들어 보세요.",
    "서로에게 기대하는 것이 많아질수록 서운함도 커질 수 있어요. 무엇을 바라는지 구체적으로 말하고, 상대가 해준 작은 노력도 바로 알아봐 주는 것이 중요합니다.",
    "두 사람 모두 자기 방식이 분명한 편이라 의견이 부딪힐 수 있어요. 누가 맞는지를 가리기보다 각자 중요하게 생각하는 이유를 들으면 오히려 신뢰가 깊어집니다.",
    "감정이 흔들릴 때 바로 결론을 내리기보다 잠깐 쉬고 다시 이야기하는 것이 좋아요. 차분해진 뒤 나눈 대화는 두 사람의 관계를 한 단계 더 단단하게 만들 거예요.",
    "한쪽의 다정함과 다른 쪽의 현실적인 판단이 잘 어울리는 조합이에요. 서로의 장점을 당연하게 여기지 않고 말로 칭찬하면 좋은 흐름이 오래갑니다.",
    "함께 새로운 경험을 할 때 가까워지는 속도가 빨라져요. 익숙한 장소만 반복하기보다 처음 가보는 곳이나 새로운 취미를 함께 시도해 보세요.",
    "두 사람 사이에는 말보다 행동으로 드러나는 애정이 많아요. 다만 표현을 너무 아끼면 상대가 확신을 잃을 수 있으니 마음을 확인시켜 주는 말을 종종 건네세요.",
    "완벽하게 맞는 관계보다 맞춰갈 수 있는 힘이 큰 관계예요. 작은 차이를 재미로 받아들이고, 각자의 혼자 있는 시간도 존중하면 오래 편안할 수 있습니다."
  ];

  const strengths = ["서로의 감정을 빠르게 알아챔", "대화가 자연스럽게 이어짐", "힘들 때 현실적인 도움을 줌", "같이 있으면 긴장이 풀림", "서로의 장점을 끌어냄", "웃음 코드가 잘 맞음", "약속을 중요하게 여김", "새로운 경험을 즐김", "상대의 성장을 응원함", "갈등 뒤 회복이 빠름"];
  const cautions = ["답장을 재촉하지 않기", "서운함을 쌓아두지 않기", "장난의 선을 확인하기", "혼자 판단하고 단정하지 않기", "피곤할 때 중요한 대화 피하기", "비교하는 말 줄이기", "상대의 시간을 존중하기", "감정적으로 결론 내리지 않기", "고마움을 당연하게 여기지 않기", "과거 일을 반복해서 꺼내지 않기"];
  const actions = ["같이 좋아하는 노래 듣기", "짧은 산책하기", "서로의 하루 한 가지 묻기", "사진 한 장 남기기", "작은 간식 나누기", "칭찬을 한 문장씩 건네기", "다음 약속을 함께 정하기", "처음 가는 카페 방문하기", "10분 동안 솔직하게 대화하기", "함께 할 목표 하나 정하기"];
  const places = ["조용한 카페", "노을이 보이는 산책로", "작은 서점", "야경이 보이는 곳", "편안한 집", "사진 찍기 좋은 골목", "한적한 공원", "음악이 잔잔한 공간", "맛있는 디저트 가게", "처음 가보는 동네"];
  const matchKickers = ["오늘의 관계 온도", "두 마음이 만나는 지점", "서로에게 닿는 방식", "가까워지는 작은 힌트", "두 사람의 숨은 균형", "함께 만드는 좋은 흐름", "마음을 이어주는 열쇠", "오늘 필요한 한 가지", "관계가 깊어지는 순간", "두 사람만의 리듬"];

  const fortunes = [];
  const compatibilities = [];

  for (let titleIndex = 0; titleIndex < fortuneTitles.length; titleIndex += 1) {
    for (let messageIndex = 0; messageIndex < fortuneMessages.length; messageIndex += 1) {
      const index = titleIndex * fortuneMessages.length + messageIndex;
      fortunes.push({
        id: `fortune-${index + 1}`,
        grade: grades[(titleIndex + messageIndex) % grades.length],
        kicker: fortuneKickers[(titleIndex * 3 + messageIndex) % fortuneKickers.length],
        title: fortuneTitles[titleIndex],
        message: fortuneMessages[messageIndex],
        luck: 58 + ((index * 17) % 41),
        color: colors[(titleIndex + messageIndex * 2) % colors.length],
        item: items[(titleIndex * 2 + messageIndex) % items.length],
        advice: advices[(titleIndex * 4 + messageIndex) % advices.length]
      });
    }
  }

  for (let titleIndex = 0; titleIndex < compatibilityTitles.length; titleIndex += 1) {
    for (let messageIndex = 0; messageIndex < compatibilityMessages.length; messageIndex += 1) {
      const index = titleIndex * compatibilityMessages.length + messageIndex;
      compatibilities.push({
        id: `compatibility-${index + 1}`,
        kicker: matchKickers[(titleIndex + messageIndex * 3) % matchKickers.length],
        title: compatibilityTitles[titleIndex],
        message: compatibilityMessages[messageIndex],
        baseScore: 56 + ((index * 19) % 42),
        strength: strengths[(titleIndex * 2 + messageIndex) % strengths.length],
        caution: cautions[(titleIndex + messageIndex * 2) % cautions.length],
        action: actions[(titleIndex * 3 + messageIndex) % actions.length],
        place: places[(titleIndex + messageIndex * 4) % places.length]
      });
    }
  }

  window.FORTUNE_DATA = Object.freeze(fortunes);
  window.COMPATIBILITY_DATA = Object.freeze(compatibilities);
})();
