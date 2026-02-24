# 실시간 데이터 파이프라인 (WebSocket) 아키텍처 설계서

## 1. 개요
현재 임시로 프론트엔드에서 자체 시뮬레이션 중인 실시간 바이탈 데이터(심박수, 산소포화도 등) 흐름을 백엔드 주도형 실시간 아키텍처로 개편하기 위한 계획입니다. 웹소켓(WebSocket)을 도입하여 서버에서 발생하는 이벤트를 클라이언트로 지연 없이 밀어넣어(Push) 진정한 의미의 실시간 모니터링을 구현합니다.

## 2. API 통신 방식 분류 (REST vs WebSocket)

### 2.1 REST API (유지 및 신규 생성)
상태가 자주 변하지 않거나, 단발성(Request-Response)인 작업은 REST API를 사용합니다.

*   **`GET /api/patients`** [기존]: 인증된 의료진에게 할당된 환자 목록 초기 조회
*   **`GET /api/patients/{id}`** [기존]: 개별 환자 상세 정보 (히스토리 차트용 과거 데이터 등) 조회
*   **`POST /api/seed/...`** [기존]: 초기 세팅을 위한 더미 시드 데이터 삽입 API
*   **`POST /api/auth/...`** [기존]: (또는 Supabase Client Auth) QR 기반 세션 로그인
*   **`PUT /api/patients/{id}/status`** [신규 필요]: 의료진이 수동으로 환자의 상태(안정/주의/위급)를 조작할 때 사용하는 변경 API

### 2.2 WebSocket API (신규 생성)
지속적으로 변동하는 시계열 데이터 및 실시간 전파가 필요한 이벤트는 WebSocket 스트리밍을 사용합니다.

*   **`ws://[서버주소]/api/ws/vitals`** [신규 생성]
    *   **역할**: 연결된 프론트엔드(대시보드) 클라이언트들에게 주기적(약 2~5초)으로 갱신되는 환자 바이탈 데이터를 브로드캐스트합니다.
    *   **동작 방식**:
        1. 클라이언트(프론트엔드)가 로드 시 해당 주소로 WebSocket 연결을 맺습니다.
        2. 백엔드(FastAPI)는 내부의 'Random Walk Generator' 백그라운드 태스크를 통해 새 바이탈 수치를 계산합니다.
        3. 백엔드는 생성된 수치를 Supabase DB(`vitals` 테이블)에 Insert함과 동시에 활성화된 WebSocket 세션들을 통해 JSON 포맷으로 클라이언트에게 Push합니다.
        4. 클라이언트는 `onmessage` 이벤트를 통해 상태(Zustand)를 업데이트하고 그래프를 리렌더링합니다.

## 3. 상세 구현 프로세스 (Phase 1 연계)

### Step 1: 백엔드 커넥션 매니저 (Connection Manager) 구현
*   FastAPI에 `WebSocket` 라우터를 추가하고, 접속 중인 클라이언트 세션들을 배열 혹은 딕셔너리 형태로 중앙 관리하는 매니저 클래스를 생성합니다.
*   연결(Connect), 해제(Disconnect), 전체 발송(Broadcast) 기능을 포함합니다.

### Step 2: 백엔드 데이터 생성기 (Random Walk Generator) 개발
*   FastAPI의 백그라운드 프로세스(`asyncio.create_task` 등)를 이용해 멈추지 않고 돌아가는 루프(Loop)를 구현합니다.
*   주기마다 현재 활성화된 환자들의 바이탈 데이터를 Random Walk 알고리즘으로 미세 조정하여 생성합니다.

### Step 3: 데이터 파이프라인 연결 (Generator -> DB & WebSocket)
*   Step 2에서 생성된 데이터를 Supabase `vitals` 테이블에 적재합니다.
*   적재와 동시에(또는 Supabase Realtime의 DB 변경 리스너를 통해) Step 1의 Connection Manager를 호출하여 프론트엔드로 브레이드캐스트합니다.

### Step 4: 프론트엔드 웹소켓 연동 및 기존 로직 걷어내기
*   프론트엔드에 `useWebSocket` 커스텀 훅을 만들어 재연결(Auto Reconnect) 등 안정성 보강 래퍼(Wrapper)를 구축합니다.
*   기존 `vitals-store.ts`에 있던 프론트엔드 자체 타이머(`setInterval`) 로직을 모두 지우고, WebSocket 수신부에서 스토어의 `updateVitals` 액션을 호출하도록 개편합니다.
*   데이터 수신 지연이나 소켓 연결 해제 시 보여줄 UI(Skeleton이나 "재연결 중..." 배지)를 추가합니다.
