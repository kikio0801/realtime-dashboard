# 🏥 프로젝트 작업 현황 및 향후 계획 (Phase 2)

## ⏳ 앞으로 진행할 작업 (TODO)
- [ ] **임상 역사 데이터 및 실시간 데이터 생성기 고도화 (Random Walk)**
  - [ ] 단순 난수가 아닌 변동성(Volatility)과 추세(Trend)가 반영된 환자 바이탈 데이터 생성기(Random Walk) 백엔드 구현
  - [ ] 프론트엔드에서 자체적으로 생성하던 랜덤 그래프 데이터를 백엔드 생성 데이터로 대체
- [ ] **End-to-End 실시간 데이터 파이프라인 완성 (Fr-Bk-DB)**
  - [ ] 백엔드(FastAPI) WebSocket `ConnectionManager` 및 `/api/ws/vitals` 엔드포인트 구현
  - [ ] 백엔드 내부에 Random Walk 기반 실시간 바이탈 데이터 생성기(백그라운드 태스크) 구현
  - [ ] 생성된 실시간 바이탈 데이터를 Supabase DB 적재 및 연결된 클라이언트(WebSocket)로 동시 브로드캐스팅
  - [ ] 프론트엔드 `useWebSocket` 커스텀 훅 구현을 통한 재연결(Auto-reconnect) 등 안정화 로직 구축
  - [ ] 프론트엔드 `vitals-store.ts`의 자체 가상 시뮬레이터(setInterval) 제거 후 리얼타임 웹소켓 데이터 연동
- [ ] **Supabase 본격 연동 및 데이터베이스 구축**
  - [ ] 환자 기본 정보(`patients`) 및 실시간 바이탈 데이터(`vitals`) 테이블 스키마 설계 및 마이그레이션 적용
  - [ ] 생성된 가상 역사 데이터를 Supabase DB에 적재하는 자동화 파이프라인 완성
- [ ] **최종 안정성 검증 및 문서 업데이트**
  - [ ] 실제 데이터베이스가 연동된 상태에서 부하 및 오류 테스트 진행
  - [ ] 프로젝트 README.md에 `Database: Supabase 연동 완료` 처리 및 데모 스크린샷 갱신

## 🧹 추후 기술 부채 해결 (Tech Debt & Refactoring)
- [ ] `patient-mock-api.ts`의 로컬스토리지 모의 데이터 로직을 FastAPI 백엔드 및 Supabase 연동 코드로 전면 대체
