# 달빛 운세함

GitHub Pages에서 바로 실행할 수 있는 정적 운세·궁합 뽑기 웹사이트입니다.

## 포함 기능

- 홈 화면에서 `운세 뽑기`, `궁합 뽑기` 이동
- 오늘의 운세 200가지 조합
- 이름과 관계를 이용한 궁합 200가지 조합
- 로컬 회원가입 / 로그인 / 로그아웃
- 로그인 사용자별 날짜별 운세·궁합 기록
- 달력 날짜별 자유 메모
- 기록 JSON 백업 및 복원
- 모바일 / PC 반응형 화면
- 별도 빌드 없이 GitHub Pages 배포

## 바로 실행하기

압축을 푼 뒤 `index.html`을 더블클릭해도 실행됩니다.

브라우저 보안 설정에 따라 일부 기능이 제한되면 아래처럼 로컬 서버를 실행하세요.

```bash
python -m http.server 8000
```

그 뒤 브라우저에서 `http://localhost:8000`으로 접속합니다.

## GitHub Pages 배포 방법

1. 새 GitHub 저장소를 만듭니다.
2. 이 폴더 안의 모든 파일을 저장소 최상단에 업로드합니다.
3. GitHub 저장소의 `Settings > Pages`로 이동합니다.
4. `Build and deployment`에서 Source를 `GitHub Actions`로 선택합니다.
5. Actions 배포가 끝난 뒤 표시되는 주소로 접속합니다.

`.github/workflows/pages.yml`이 자동 배포를 담당합니다.

## 계정 저장 방식 주의

현재 버전은 백엔드 서버 없이 GitHub Pages에서 바로 실행되도록 제작했습니다.

- 계정과 기록은 현재 브라우저의 `localStorage`에 저장됩니다.
- 다른 기기나 다른 브라우저와 자동 동기화되지 않습니다.
- 브라우저 데이터를 지우면 기록도 삭제될 수 있습니다.
- 더보기 메뉴의 `내 기록 백업하기`를 이용하면 JSON 파일로 보관할 수 있습니다.

실제 여러 기기 로그인과 동기화가 필요하면 Firebase 또는 Supabase 인증·데이터베이스 연결이 필요합니다.

## 파일 구조

```text
fortune-draw-site/
├─ index.html
├─ styles.css
├─ manifest.webmanifest
├─ 404.html
├─ assets/
│  └─ favicon.svg
├─ js/
│  ├─ data.js
│  └─ app.js
└─ .github/
   └─ workflows/
      └─ pages.yml
```
