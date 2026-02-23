# 🏥 Realtime Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Pandas](https://img.shields.io/badge/Pandas-2.2-150458?logo=pandas&logoColor=white)](https://pandas.pydata.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Realtime-010101?logo=socket.io&logoColor=white)](#실시간-아키텍처-hybrid-realtime-strategy)
[![CodeRabbit](https://img.shields.io/badge/CodeRabbit-FF5A00?logoColor=white)](https://coderabbit.ai/)
[![License: All Rights Reserved](https://img.shields.io/badge/License-All_Rights_Reserved-red.svg)](#-라이선스-license)

실시간 환자 모니터링을 위한 **의료용 대시보드 시스템**입니다.
프론트엔드는 Next.js(App Router) 기반으로 구축되었으며, 백엔드는 FastAPI, 데이터 처리 및 분석 로직은 모듈화된 Pandas(Analytics) 기반으로 구성되어 있습니다.

## 🚀 프로젝트 목적

> **"직관적인 데이터 시각화로 의료진의 의사결정을 지원합니다."**
>
> 본 프로젝트는 병실 내 환자들의 상태를 실시간으로 모니터링하고, 담당 간호사가 효율적으로 환자를 관리할 수 있도록 돕는 것을 목표로 합니다.
> 빠르고 안정적인 데이터 통신과 직관적인 UI/UX를 제공합니다.
>
> **💡 개발 취지**
>
> 본 프로젝트는 실제 데이터베이스를 구축하는 대신 **Next.js(Frontend) - FastAPI(Backend) - Pandas(Data Processing)** 간의 유기적인 데이터 흐름을 실험하고 검증하는 데에 초점을 맞추었습니다.
> 특히 헬스케어 데이터(환자 정보)를 다루는 로직을 구현함에 있어, **Supabase**와 **Pandas**를 연동하여 실제 서비스 환경에 최적화된 데이터 파이프라인 구축에 집중했습니다.

## ✨ 핵심 기능

- **QR 로그인 (Concept)**:
  - 의료진이 분주한 현장에서 모바일 기기나 스마트 밴드로 QR 코드를 스캔하여 빠르게 시스템에 접속할 수 있는 간편 로그인 기능을 제공합니다.
  - **Supabase 익명 로그인(Anonymous Auth)**을 활용하여 QR 스캔 시 즉시 **임시 신분증(세션)**을 발급받아 복잡한 가입 절차 없이 안전하게 시스템을 이용할 수 있습니다.
  - 보안을 위해 로그인한 의료진에게 배정된 담당 환자 목록만 선별적으로 노출합니다.
- **실시간 환자 모니터링**:
  - 활력 징후(Vital Signs) 실시간 조회 및 WebSocket 기반의 끊김 없는 실시간 그래프 시각화.
- **Pandas 기반 실시간 미래 상태 예측 (Predictive Analytics)**:
  - **골든타임 확보를 위한 시계열 예측 (Random Walk)**: 단순 현재 수치 조회를 넘어, Pandas의 시계열 분석 알고리즘을 통해 환자의 바이탈 변화 추이를 계산합니다. 데이터의 기울기와 변동성을 분석하여 향후 5~10분 내 위험 수치 도달 가능성을 선제적으로 예측합니다.
  - **지능형 위험 징후 조기 탐지 (Early Warning System)**: 이동 평균(Moving Average) 및 비정상 패턴 감지 로직을 적용하여, 육안으로 확인하기 어려운 미세한 상태 악화 흐름을 포착하고 의료진에게 즉각적인 예보 알림을 제공합니다.
  - **데이터 기반 의사결정 지원**: 과거 패턴과 현재 흐름을 결합하여 '단순 알람'이 아닌 '예측 기반 가이드'를 제시함으로써 의료진의 신속하고 정확한 판단을 돕습니다.
- **담당 간호사 배정 시스템**:
  - 간호사별 담당 환자 필터링 및 관리 최적화.
- **데이터 기반 백엔드**:
  - Pandas DataFrame과 Supabase 시계열 데이터를 결합한 효율적인 헬스케어 데이터 파이프라인.

## 🛠 기술 스택

### Frontend

| 분류 | 기술 |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Optimization** | **[React Compiler](https://react.dev/learn/react-compiler)** 활성화 (코드 최적화 자동화) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + Shadcn UI (Customized) |
| **State Mgt** | [Zustand](https://zustand-demo.pmnd.rs/) |

### Infrastructure & Tools

| 분류 | 기술 |
| :--- | :--- |
| **Database** | [Supabase](https://supabase.com/) (추후 연동 예정) |
| **Code Review** | [CodeRabbit](https://coderabbit.ai/) (AI 자동 코드 리뷰) |

### Backend

| 분류 | 기술 |
| :--- | :--- |
| **Framework** | [FastAPI](https://fastapi.tiangolo.com/) |
| **Data Processing** | [Pandas](https://pandas.pydata.org/) (Analytics 모듈) |
| **Server(Execution Engine)** | [Uvicorn](https://www.uvicorn.org/) |

## 🎨 타이포그래피 (Typography)

본 프로젝트는 **'A2z' (에이투지체)** 폰트를 기본 서체로 사용합니다.

- **Licensing**: 상업적 이용이 가능한 무료 폰트입니다. (출처: [눈누 A2z](https://noonnu.cc/font_page/1778))
- **Design Philosophy**: 한글은 현대적이고 도회적인 인상의 **A2z**를, 영문과 숫자는 기하학적 산세리프 서체인 **Outfit**을 사용하여 완벽한 조화를 이룹니다.
  > **Note**: A2z 폰트는 Outfit 폰트를 기반으로 설계되었으며, 두 서체를 혼용해도 이질감 없이 하나의 서체처럼 자연스러운 시각적 흐름을 제공합니다.
- **Switching**: `frontend/src/app/globals.css` 파일에서 주석을 해제하여 **Pretendard**로 손쉽게 전환할 수 있습니다.

```css
/* frontend/src/app/globals.css - :root 블록에서 --root-font-sans 변수를 수정하여 폰트를 전환하세요 */
:root {
  --root-font-sans: 'A2z', 'Pretendard', sans-serif; /* 기본 서체 (Default) */
  /* --root-font-sans: 'Pretendard', sans-serif; */ /* 주석 해제 시 프리텐다드로 전환 */
}
```

> [!TIP]
> **폰트 전환 방법**: `frontend/src/app/globals.css` 파일의 `:root` 블록 내에 정의된 `--root-font-sans` 변수에서 원하는 설정의 주석을 해제하거나 수정하여 프로젝트 전체의 폰트를 손쉽게 변경할 수 있습니다. @theme 블록은 이 변수를 참조하여 시스템 서체를 결정합니다.

### 📊 데이터 관리
이 프로젝트는 **Supabase**를 연동하여 실시간 데이터를 관리합니다. 단순히 정적인 정보를 저장하는 것을 넘어, 다음과 같은 고도화된 방식을 적용합니다.

- **Realtime DB**: Supabase의 실시간 구성을 통해 환자의 바이탈 상태를 즉각적으로 반영합니다.
- **가상 역사 데이터 생성 (Random Walk)**: Pandas를 활용하여 단순 난수가 아닌, 실제 의료 상황과 추세(Trend)를 반영한 임상적 역사 데이터(Random Walk 모델)를 생성하여 Supabase에 적재합니다.
- **Analytics 모듈**: `analytics/pandas_logic.py`에서 Pandas DataFrame을 활용해 통계적 추론 및 미래 추세 예측(Forecasting) 로직을 수행합니다.

### 🌐 실시간 아키텍처 (Hybrid Realtime Strategy)
본 프로젝트는 단일 실시간 기술의 한계를 극복하고 효율성을 극대화하기 위해, **Supabase Realtime**과 **FastAPI WebSockets**를 병행하여 사용하는 하이브리드 전략을 채택했습니다. 

> **💡 왜 두 가지 기술을 병행할까요?**
> **Supabase Realtime**은 데이터베이스에 변화가 생기면 그걸 브라우저에 띄워주는 역할을 아주 잘합니다. 하지만 DB에 넣기 전에 데이터를 가공하거나 Pandas로 분석해야 할 때는 백엔드 서버(**FastAPI**)가 필수적으로 개입해야 합니다.
> 
> 즉, **복잡한 계산(AI 예측 분석)과 엄청난 양의 실시간 센서 데이터 전달은 FastAPI가 도맡고**, **분석이 끝난 데이터의 안정적인 저장과 클라이언트 상태 동기화는 Supabase가 나누어 맡는 분업 방식**입니다.

- **FastAPI WebSockets (전처리 및 초고속 통신 담당)**: 
  - **고주파 데이터 처리**: 심박수 센서와 같이 매초 수회 발생하는 초고속 바이탈 데이터를 DB 부하 없이 안정적으로 전달합니다.
  - **데이터 전처리 & AI 분석**: 데이터를 DB에 저장하기 전, Pandas를 이용한 위험도 예측 및 필터링 등 복잡한 비즈니스 로직을 즉각적으로 수행합니다.
- **Supabase Realtime (상태 동기화 및 영속성 담당)**:
  - **상태 동기화**: 환자 마스터 정보, 담당 배정 등 DB에 저장된 정적 데이터의 변경 사항을 별도의 서버 로직 없이 클라이언트에 즉각 반영하여 코드를 간소화합니다.
  - **데이터 영속성**: 필터링 및 분석이 완료된 유의미한 결과(예: 급격한 혈압 저하 알림 등)만의 안정적인 저장과 동기화를 담당합니다.

## 📱 UI 플로우

상태 변화에 따른 직관적인 UI 흐름을 제공합니다.

<div align="center">
  <table style="width: 100%; border-collapse: collapse; border: none;">
    <tr style="border: none;">
      <td style="width: 50%; border: none; padding: 10px; text-align: center; vertical-align: top;">
        <strong>1. QR 접속</strong><br><br>
        <img src="./ui-flow-assets/screenshot-1.png" width="600" title="Step 1" alt="Step 1">
      </td>
      <td style="width: 50%; border: none; padding: 10px; text-align: center; vertical-align: top;">
        <strong>2. 간편 로그인</strong><br><br>
        <img src="./ui-flow-assets/screenshot-2.png" width="600" title="Step 2" alt="Step 2">
      </td>
    </tr>
    <tr style="border: none;">
      <td style="width: 50%; border: none; padding: 10px; text-align: center; vertical-align: top;">
        <br><strong>3. 실시간 모니터링</strong><br><br>
        <img src="./ui-flow-assets/screenshot-3.png" width="340" title="Step 3" alt="Step 3">
      </td>
      <td style="width: 50%; border: none; padding: 10px; text-align: center; vertical-align: top;">
        <br><strong>4. 환자 상세 정보</strong><br><br>
        <img src="./ui-flow-assets/screenshot-4.png" width="340" title="Step 4" alt="Step 4">
      </td>
    </tr>
  </table>
</div>

> [!IMPORTANT]
> **모바일 접속 주의사항**
> 
> 현재 프로젝트는 로컬 개발 서버에서 실행되므로, QR 코드를 통해 모바일 기기에서 접속하려면 **PC와 모바일 기기가 반드시 동일한 Wi-Fi 네트워크에 연결되어 있어야 합니다.**

## 📂 프로젝트 구조

```text
realtime-dashboard/
├── frontend/             # Next.js 프론트엔드 (React 19, Tailwind CSS)
├── backend/              # FastAPI 백엔드
├── supabase/             # Supabase 설정 및 스키마 버전 동기화 관리
├── analytics/            # Pandas 기반 데이터 처리 및 분석 모듈
└── ui-flow-assets/       # README용 UI 스크린샷 리소스
```

## 🚀 시작하기

### 1. 백엔드 실행
최초 실행 시 고속 파이썬 패키지 매니저인 `uv`를 사용해 환경을 구성합니다. 

> **💡 `uv` 설치 방법 (Git Bash)**
> 만약 `uv` 가 설치되어 있지 않다면, 터미널에서 아래 명령어를 입력하여 설치하세요.
> ```bash
> curl -LsSf https://astral.sh/uv/install.sh | sh
> ```

```bash
cd backend
# 가상환경 생성 (uv 사용, 최초 1회)
uv venv
# 패키지 설치 (최초 1회)
uv pip install -r requirements.txt
# 서버 실행
uv run uvicorn main:app --reload
```

> **API 문서 (Swagger UI)**: 서버가 실행 중일 때 [http://localhost:8000/docs](http://localhost:8000/docs)에서 스웨거 API 문서를 확인할 수 있습니다. FastAPI는 Pydantic 모델을 기반으로 이 문서를 자동으로 생성합니다.
>
> **단축 스크립트 실행 (선택)**: `backend` 폴더 내의 `run_server.bat` 파일을 더블 클릭하면 간편하게 서버를 띄울 수 있습니다.

### 2. 프론트엔드 실행
새로운 터미널을 열고 다음을 실행합니다.

```bash
cd frontend
pnpm install
pnpm dev
```

### 💡 모바일 접속 관련 참고
1. PC와 핸드폰이 같은 WIFI를 사용해야 합니다.
2. **공격적인 방화벽 환경(공용 Wi-Fi, 기업 네트워크)**에서는 기기 간 통신이 차단되어 QR 로그인이 작동하지 않을 수 있습니다. 이 경우 **모바일 핫스팟** 사용을 권장하며, 연결이 불안정할 경우 PC 브라우저에서 직접 테스트해 주세요.

## 📄 라이선스 (License)

Copyright (c) 2026 **Yoon SangHwan** All Rights Reserved.

### ⚠️ 저작권 및 이용 안내

본 프로젝트의 `package.json`에 명시된 `"license": "UNLICENSED"`는 별도의 오픈소스 라이선스가 부여되지 않았음을 의미합니다. 이는 라이선스가 없어 자유롭게 이용 가능하다는 뜻이 아니라, **해당 소프트웨어에 대한 모든 권리가 저작권자에게 귀속되어 있음**을 나타냅니다.

- **무단 복제 및 배포 금지**: 저작권자의 서면 동의 없이 본 코드의 전체 또는 일부를 무단으로 복제, 배포, 수정하는 행위는 엄격히 금지됩니다.
- **브랜드 자산 보호**: 서비스 명칭 및 관련 **로고(이미지, 아이콘)**는 저작권자의 독자적인 브랜드 자산입니다. 소스 코드의 이용 여부와 관계없이 서비스 명칭 및 로고의 무단 도용, 복제, 배포 및 유사 명칭 사용은 엄격히 금지됩니다.
- **학습 목적의 참조**: 교육 및 학습 목적의 단순 코드 참조는 환영하나, 이를 활용한 상업적 이용이나 2차 저작물 생성은 불가능합니다.
- **이용 문의**: 상업적 활용 또는 프로젝트 협업에 관한 문의는 아래의 연락처를 통해 협의해 주시기 바랍니다.

> **Note**: 본 프로젝트는 저작권법의 보호를 받는 독자적인 저작물이며, 무단 사용 시 법적 책임을 물을 수 있습니다.
