# 🚀 서버 환경 구성 및 실행 가이드

## 1. 백엔드(Server) 실행 환경 구축

최초 실행 시 고속 파이썬 패키지 매니저인 `uv`를 사용해 환경을 구성합니다. 

### 💡 `uv` 설치 방법 (Git Bash)
만약 `uv` 가 설치되어 있지 않다면, 터미널에서 아래 명령어를 입력하여 설치하세요.
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 실행 순서
```bash
cd backend

# 가상환경 생성 (uv 사용, 최초 1회)
uv venv

# 패키지 설치 (최초 1회)
uv pip install -r requirements.txt

# 서버 실행
uv run uvicorn main:app --reload
```

---

## 2. 부가 기능 및 도구

### 📘 API 문서 (Swagger UI)
서버가 실행 중일 때 스웨거 API 문서를 확인할 수 있습니다. FastAPI는 Pydantic 모델을 기반으로 이 문서를 자동으로 생성합니다.
- 접속 주소: `http://localhost:8000/docs` (기본값 기준)

### ⚡ 단축 스크립트 실행 (선택)
`backend` 폴더 내의 `run_server.bat` 파일을 더블 클릭하면 터미널을 열지 않고도 간편하게 서버를 띄울 수 있습니다.
