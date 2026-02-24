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
- [ ] **임상 역사 데이터 및 실시간 데이터 생성기 고도화 (Random Walk)**
  - [ ] 단순 난수가 아닌 변동성(Volatility)과 추세(Trend)가 반영된 환자 바이탈 데이터 생성기(Random Walk) 백엔드 구현
  - [ ] 프론트엔드에서 자체적으로 생성하던 랜덤 그래프 데이터를 백엔드 생성 데이터로 대체
- [ ] **End-to-End 실시간 데이터 파이프라인 완성 (Fr-Bk-DB)**
  - [ ] FastAPI 서버에서 WebSocket을 통해 수신받은 프론트엔드 연결과 DB의 실시간 동기화 구현
  - [ ] (백엔드) 랜덤 워크 기반으로 생성되는 실시간 바이탈 데이터를 WebSocket으로 프론트엔드에 지속 전송
  - [ ] Supabase Realtime API를 통해 변경된 DB 상태를 UI 대시보드에 즉각적으로 반영
- [O] **Supabase 본격 연동 및 데이터베이스 구축**
  - [O] 발급된 PAT(Personal Access Token)를 활용하여 프로젝트 환경 구성
  - [ ] 환자 기본 정보(`patients`) 및 실시간 바이탈 데이터(`vitals`) 테이블 스키마 설계 및 마이그레이션 적용
  - [ ] 생성된 가상 역사 데이터를 Supabase DB에 적재하는 자동화 파이프라인 완성
- [ ] **최종 안정성 검증 및 문서 업데이트**
  - [ ] 실제 데이터베이스가 연동된 상태에서 부하 및 오류 테스트 진행
  - [ ] 프로젝트 README.md에 `Database: Supabase 연동 완료` 처리 및 데모 스크린샷 갱신
  
## 🧹 추후 기술 부채 해결 (Tech Debt & Refactoring)
- [O] `axios.ts` 인터셉터를 Supabase 익명 로그인(Anonymous Auth) 기반 토큰 통신으로 개편
- [O] `patient-mock-api.ts`의 로컬스토리지 모의 데이터 로직을 FastAPI 백엔드 및 Supabase 연동 코드로 전면 대체
- [O] 프론트엔드 헤더 프로필의 '로그아웃' 버튼 동작 오류 수정 및 연동
- [O] QR 로그인 동적 세션(매번 바뀌는 QR)으로 인한 중복 가입 문제 해결
  - [O] **이슈:** QR 코드가 매번 새로 발급되므로, 브라우저 대기발생 한계 해결.
  - [O] **해결안 1:** 닉네임과 함께 **전화번호(Phone Number)**를 식별 정보로 입력.
  - [O] **해결안 2 (Edge Case):** Zod 등 유효성 검사 프론트단 적용.
- [O] **Legacy API 및 Mock 데이터 정리**
  - [O] `mock-api.ts` -> `auth-api.ts`로 올바르게 리네이밍 완료 (실제 Supabase Auth 사용 중)
  - [O] 프론트엔드 전반의 import 참조 경로 수정 (`use-user.ts`, `join/page.tsx`, `patient-mock-api.ts` 주석 등)
