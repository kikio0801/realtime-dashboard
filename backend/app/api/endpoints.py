"""
API endpoints for patient management
"""
from fastapi import APIRouter, HTTPException
from app.models import Patient, PatientStatusUpdate
from app.services.patient_service import patient_service


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
    """Get system information including local IP"""
    import socket
    try:
        # Get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
    except Exception:
        local_ip = "localhost"
        
    return {
        "local_ip": local_ip,
        "port": 8000
    }
