from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as endpoint_router

app = FastAPI(
    title="실시간 대시보드 API",
    description="환자 상태 모니터링 및 바이탈 데이터 분석을 위한 API 서버",
    version="0.1.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for local network development
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a central API router
api_router = APIRouter(prefix="/api")

# Include all endpoints into the main API router
api_router.include_router(endpoint_router)

# Include the central API router into the main app
app.include_router(api_router)

@app.get("/", summary="API 루트")
def read_root():
    """API 서버의 작동 여부를 확인하는 기본 루트 엔드포인트입니다."""
    return {"message": "Hello World from FastAPI!"}


@app.get("/health", summary="상태 체크")
def health_check():
    """서버 상태가 정상인지 확인합니다."""
    return {"status": "healthy"}
