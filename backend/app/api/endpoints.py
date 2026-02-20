"""
API endpoints for patient management
"""
from fastapi import APIRouter, HTTPException
from app.models import Patient, PatientStatusUpdate
from app.services.patient_service import patient_service
import socket
import psutil


router = APIRouter(prefix="/api", tags=["patients"])


@router.get("/patients", response_model=list[Patient])
async def get_all_patients():
    """Get all patients"""
    return patient_service.get_all()


@router.get("/patients/{patient_id}", response_model=Patient)
async def get_patient(patient_id: str):
    """Get patient by ID"""
    patient = patient_service.get_by_id(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.get("/nurses/{nurse_key}/patients", response_model=list[Patient])
async def get_nurse_patients(nurse_key: str):
    """Get all patients assigned to a specific nurse"""
    patients = patient_service.get_by_nurse(nurse_key)
    
    # Initialize patients if empty
    if not patients:
        patients = patient_service.seed_patients(nurse_key)
    
    return patients


@router.patch("/patients/{patient_id}/status", response_model=Patient)
async def update_patient_status(patient_id: str, update: PatientStatusUpdate):
    """Update patient status"""
    patient = patient_service.update_status(patient_id, update.status)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.get("/system/info")
async def get_system_info():
    """Get system information including all local IPs"""
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
