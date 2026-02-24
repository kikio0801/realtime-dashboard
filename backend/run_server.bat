@echo off
echo Starting Backend Server with uv...
cd /d %~dp0
where uv >nul 2>nul
if errorlevel 1 (
  echo uv 가 설치되어 있지 않습니다. README.md 의 설치 방법을 참고하세요.
  pause
  exit /b 1
)
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
