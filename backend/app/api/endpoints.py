"""
API endpoints for patient management
"""
from fastapi import APIRouter, HTTPException
from app.models import Patient, PatientStatusUpdate
from app.services.patient_service import patient_service
import socket
import psutil


router = APIRouter(prefix="/api", tags=["환자 관리"])


@router.get("/patients", response_model=list[Patient], summary="전체 환자 목록 조회")
async def get_all_patients():
    """모든 환자의 기본 정보를 조회합니다."""
    return patient_service.get_all()


@router.get("/patients/{patient_id}", response_model=Patient, summary="특정 환자 상세 상세 정보 조회")
async def get_patient(patient_id: str):
    """환자 ID를 통해 특정 환자의 상세 정보를 조회합니다."""
    patient = patient_service.get_by_id(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.get("/nurses/{nurse_key}/patients", response_model=list[Patient], summary="담당 간호사별 환자 목록 조회")
async def get_nurse_patients(nurse_key: str):
    """특정 간호사에게 배정된 환자 목록을 조회합니다. 데이터가 없으면 초기 데이터를 생성합니다."""
    patients = patient_service.get_by_nurse(nurse_key)
    
    # Initialize patients if empty
    if not patients:
        patients = patient_service.seed_patients(nurse_key)
    
    return patients


@router.patch("/patients/{patient_id}/status", response_model=Patient, summary="환자 상태 업데이트")
async def update_patient_status(patient_id: str, update: PatientStatusUpdate):
    """환자의 현재 상태(stable, warning, critical)를 수동으로 업데이트합니다."""
    patient = patient_service.update_status(patient_id, update.status)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.get("/system/info", summary="시스템 상태 및 접속 정보 조회")
async def get_system_info():
    """서버의 로컬 IP 주소와 포트 정보를 조회합니다. 모바일 접속 시 IP 확인용으로 사용됩니다."""
    ips = []
    try:
        # Get all network interfaces
        for interface, snics in psutil.net_if_addrs().items():
            for snic in snics:
                if snic.family == socket.AF_INET and not snic.address.startswith("127."):
                    ips.append({
                        "interface": interface,
                        "ip": snic.address
                    })
        
        # Primary IP (the one used for internet access)
        primary_ip = None
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.settimeout(0.1)
            try:
                s.connect(("8.8.8.8", 80))
                primary_ip = s.getsockname()[0]
            except OSError:
                primary_ip = ips[0]["ip"] if ips else "localhost"
    except OSError:
        primary_ip = "localhost"
        
    return {
        "local_ip": primary_ip,
        "all_ips": ips,
        "port": 8000
    }
