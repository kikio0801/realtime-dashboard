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

## 🚀 프로젝트 목적

실시간 환자 모니터링을 위한 **의료용 대시보드 시스템**으로, 직관적인 데이터 시각화로 의료진의 의사결정을 지원합니다.

- **환자 중심 모니터링**
- **업무 효율 극대화**
- **데이터 흐름 검증**
- **시스템 통합 사례**

👉 [프로젝트 목적 상세 보기](./document/project-purpose.md)

## ✨ 핵심 기능

- **QR 로그인 (Concept)**: QR 스캔을 통한 익명 로그인 및 스마트 세션 연동
- **실시간 환자 모니터링**: WebSocket 기반의 끊김 없는 활력 징후 시각화
- **실시간 미래 상태 예측**: Pandas(Random Walk) 기반 위험 징후 조기 탐지 (EWS)
- **담당 간호사 배정**: 간호사별 담당 환자 필터링 및 최적화 관리
- **데이터 파이프라인**: Pandas와 Supabase를 결합한 효율적인 바이탈 데이터 처리

👉 [핵심 기능 상세 보기](./document/features.md)

## 🛠 기술 스택

### Frontend

| 분류 | 기술 |
| :--- | :--- |
| **Core Stack** | Next.js 16 (App Router) + React 19 + TypeScript |
| **Optimization** | **React Compiler** 활성화 |
| **Styling** | Tailwind CSS 4 + Shadcn UI |
| **State Mgt** | Zustand |

### Backend

| 분류 | 기술 |
| :--- | :--- |
| **Core Stack** | FastAPI |
| **Database** | Supabase |

### Data Analytics

| 분류 | 기술 |
| :--- | :--- |
| **Processing** | Pandas |
| **Server** | Uvicorn |

### Code Quality

| 분류 | 기술 |
| :--- | :--- |
| **Code Review** | CodeRabbit |

## 🎨 타이포그래피 (Typography)

본 프로젝트는 **'A2z' (에이투지체)** 폰트를 기본 서체로 사용합니다. <br/> 👉 [자세히 보기](./document/typography.md)

### 📊 데이터 관리 (Data Management)
본 프로젝트는 **Supabase**와 **Pandas**를 결합하여 전문적인 실시간 데이터 관리 시스템을 구축했습니다.

👉 [자세히 보기](./document/data-management.md)


### 🌐 실시간 아키텍처 (Hybrid Realtime Strategy)
본 프로젝트는 단일 실시간 기술의 한계를 극복하고 효율성을 극대화하기 위해, **Supabase Realtime**과 **FastAPI WebSockets**를 병행하여 사용하는 하이브리드 전략을 채택했습니다. 

👉 [자세히 보기](./document/architecture.md)

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

> **📢 중요: 모바일 접속 주의사항**
> 
> 현재 프로젝트는 로컬 개발 서버에서 실행되므로, QR 코드를 통해 모바일 기기에서 접속하려면 **PC와 모바일 기기가 반드시 동일한 Wi-Fi 네트워크에 연결되어 있어야 합니다.**

## 📂 프로젝트 구조

```text
realtime-dashboard/
├── frontend/             # Next.js 프론트엔드 (React 19, Tailwind CSS)
├── backend/              # FastAPI 백엔드
├── supabase/             # Supabase 설정 및 스키마 버전 동기화 관리
├── analytics/            # Pandas 기반 데이터 처리 및 분석 모듈
├── document/             # 상세 기술 문서
├── ui-flow-assets/       # README용 UI 스크린샷 리소스
└── task/                 # 프로젝트 진행 상황 및 잔여 작업 현황 관리
```

## 🚀 시작하기

### 1. 백엔드(Server) 실행
고속 파이썬 패키지 매니저인 `uv`를 사용해 환경을 구성하고 서버를 실행합니다. 

👉 [백엔드 설정 및 실행 상세 가이드 바로가기](./document/setup.md)


### 2. 프론트엔드 실행
새로운 터미널을 열고 다음을 실행합니다.

```bash
cd frontend
pnpm install
pnpm dev
```

### 💡 모바일 접속 관련 참고
1. PC와 핸드폰이 같은 WIFI를 사용해야 합니다.
2. **공공장소 네트워크**에서는 기기 간 통신이 차단되어 QR 로그인이 작동하지 않을 수 있습니다. 이 경우 **모바일 핫스팟** 사용을 권장하며, 연결이 불안정할 경우 PC 브라우저에서 직접 테스트해 주세요.

## 📄 라이선스 (License)

Copyright (c) 2026 **Yoon SangHwan** All Rights Reserved.

### ⚠️ 저작권 및 이용 안내

👉 [자세히 보기](./LICENSE)
