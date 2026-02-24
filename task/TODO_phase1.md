# 🏥 프로젝트 작업 현황 및 향후 계획

## ✅ 완료된 작업 (Completed)
- [O] **CodeRabbit PR 코드리뷰 피드백 반영 완수**
  - [O] 환자 ID 형식 검증 로직 반영 및 무결성 제약조건 추가 (나이, 성별, 심박수 등)
  - [O] 데이터 초기화(Seeding)를 위한 전용 API 엔드포인트 분리
  - [O] 환경 변수 기반 서버 포트 설정
- [O] **불필요한 파일 및 환경 정리**
  - [O] `scripts` 폴더 분리 및 `.gitignore` 등록
  - [O] 깃허브 리뷰 관련 로컬 파일(`pr_*.txt`) 삭제 및 캐시 정리 완료
- [O] **프로젝트 문서화 (README.md) 고도화**
  - [O] FastAPI WebSocket + Supabase Realtime 기반 하이브리드 실시간 아키텍처 다이어그램 및 설명 추가
  - [O] Pandas의 Predictive Analytics(시계열 분석) 적용 부분 설명 강화
  - [O] 데이터 생성 및 시계열 예측과 관련된 'Random Walk(랜덤 워크)' 방법론 명시

## ⏳ 앞으로 진행할 작업 (TODO)
- [O] **QR 로그인 로직의 Backend 이관 (Supabase Anonymous Auth)**
  - [O] Supabase 익명 인증(Anonymous Sign-in)을 활성화하여 로그인 시 자동 JWT 발급 및 세션 관리 구현
  - [O] 프로필 정보를 저장할 `medical_staff` 테이블에 QR `key`와 `name` 보관 및 Supabase Auth 연동
  - [O] Frontend에서 LocalStorage 대신 Supabase 연동 방식(`supabase.auth.signInAnonymously()`)으로 개편
- [O] **Supabase 본격 연동 및 데이터베이스 구축**
  - [O] 발급된 PAT(Personal Access Token)를 활용하여 프로젝트 환경 구성
  
## 🧹 추후 기술 부채 해결 (Tech Debt & Refactoring)
- [O] `axios.ts` 인터셉터를 Supabase 익명 로그인(Anonymous Auth) 기반 토큰 통신으로 개편
- [O] 프론트엔드 헤더 프로필의 '로그아웃' 버튼 동작 오류 수정 및 연동
- [O] QR 로그인 동적 세션(매번 바뀌는 QR)으로 인한 중복 가입 문제 해결
  - [O] **이슈:** QR 코드가 매번 새로 발급되므로, 브라우저 대기발생 한계 해결.
  - [O] **해결안 1:** 닉네임과 함께 **전화번호(Phone Number)**를 식별 정보로 입력.
  - [O] **해결안 2 (Edge Case):** Zod 등 유효성 검사 프론트단 적용.
- [O] **Legacy API 및 Mock 데이터 정리**
  - [O] `mock-api.ts` -> `auth-api.ts`로 올바르게 리네이밍 완료 (실제 Supabase Auth 사용 중)
  - [O] 프론트엔드 전반의 import 참조 경로 수정 (`use-user.ts`, `join/page.tsx`, `patient-mock-api.ts` 주석 등)
