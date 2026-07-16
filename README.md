# 운명 한 장 — 운세 뽑기 사이트

운세로 포장한 모바일형 뽑기 웹사이트입니다.

## 바로 확인하기

압축을 푼 뒤 루트의 `index.html`을 더블클릭하면 메인 홈 화면이 열립니다.

이 수정본은 루트 `index.html`에 완성된 CSS와 JavaScript가 포함되어 있어서, GitHub Pages에서 소스 파일을 그대로 배포해도 빈 화면이 나오지 않습니다.

## 들어 있는 기능

- 홈: 오늘의 운세 / 궁합 뽑기 버튼
- 운세: 등급, 점수, 행운색, 행운 아이템, 행운 시간
- 궁합: 두 이름과 관계를 입력해 궁합 점수와 해석 뽑기
- 달력: 날짜별 결과 확인 및 메모 저장
- 계정: 이메일 회원가입, 로그인, 로그아웃
- 로그인 전: 브라우저 localStorage에 게스트 기록 저장
- 로그인 후: Supabase DB에 사용자별 기록 저장
- GitHub Pages 대응: HashRouter + 정적 루트 배포 + GitHub Actions

## 파일 구조

- `index.html`: 바로 열거나 GitHub Pages에 직접 배포하는 완성본
- `dev.html`: React/Vite 개발용 시작 파일
- `src/`: React 소스 코드
- `dist/`: GitHub Actions 및 정적 서버 배포용 빌드 결과
- `supabase/schema.sql`: 회원별 기록 테이블과 보안 정책
- `START_HERE.txt`: 처음 실행할 때 보는 안내

## 소스 코드를 수정하며 실행하기

```bash
npm install
npm run dev
```

`dev.html` 개발 화면이 열립니다.

## 수정 후 다시 빌드하기

```bash
npm run build
```

명령을 실행하면 아래 파일이 자동으로 갱신됩니다.

- 루트 `index.html`
- 루트 `404.html`
- 루트 `assets/`
- `dist/`

## Supabase 연결

1. Supabase에서 새 프로젝트를 만듭니다.
2. `supabase/schema.sql` 내용을 SQL Editor에서 실행합니다.
3. 프로젝트 루트에 `.env` 파일을 만들고 `.env.example` 형식으로 입력합니다.

```env
VITE_SUPABASE_URL=https://프로젝트주소.supabase.co
VITE_SUPABASE_ANON_KEY=프로젝트_ANON_KEY
```

4. Supabase Authentication > URL Configuration에서 Site URL과 Redirect URL에 배포 주소를 추가합니다.
5. `npm run build`를 다시 실행하고 변경된 파일을 GitHub에 올립니다.

## GitHub Pages 배포 방법 1 — 브랜치에서 바로 배포

1. 압축 안의 파일을 GitHub 저장소 최상단에 올립니다.
2. 저장소 `Settings > Pages`로 이동합니다.
3. Source에서 `Deploy from a branch`를 선택합니다.
4. Branch를 `main`, 폴더를 `/(root)`로 선택합니다.
5. 저장합니다.

루트의 완성된 `index.html`이 배포되므로 메인 홈이 바로 표시됩니다.

## GitHub Pages 배포 방법 2 — GitHub Actions

1. 저장소 `Settings > Pages > Source`를 `GitHub Actions`로 선택합니다.
2. 로그인 기능을 사용할 경우 Repository secrets에 아래 값을 추가합니다.
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. `main` 브랜치에 push하면 자동 빌드·배포됩니다.

## 콘텐츠 수정 위치

- 운세/궁합 문장 조합: `src/data/fortune.js`
- 사이트 색상/디자인: `src/styles.css`
- 홈 화면: `src/pages/HomePage.jsx`
- 서비스 이름: `src/components/Layout.jsx`, `dev.html`

## 참고

운세는 오락용 콘텐츠입니다. 결제형 랜덤 뽑기나 실제 재화를 붙일 경우 관련 법률과 플랫폼 정책을 별도로 확인해야 합니다.
