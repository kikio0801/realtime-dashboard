from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as patient_router

app = FastAPI(title="Realtime Dashboard API", version="0.1.0")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for local network development
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include patient API routes
app.include_router(patient_router)

@app.get("/")
def read_root():
    return {"message": "Hello World from FastAPI!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
