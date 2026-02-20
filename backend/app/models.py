"""
Pydantic models for Patient data
Mirrors TypeScript types from frontend/src/types/patient.ts
"""
from typing import Literal
from pydantic import BaseModel, Field


# Type aliases
PatientStatus = Literal["stable", "warning", "critical"]


class VitalSign(BaseModel):
    """Single vital sign reading with timestamp"""
    timestamp: int = Field(..., description="Unix timestamp in milliseconds")
    value: float = Field(..., description="Measured value")


class VitalSigns(BaseModel):
    """Collection of all vital signs for a patient"""
    heartRate: list[VitalSign] = Field(default_factory=list, description="심박수 (BPM)")
    systolic: list[VitalSign] = Field(default_factory=list, description="수축기 혈압 (mmHg)")
    diastolic: list[VitalSign] = Field(default_factory=list, description="이완기 혈압 (mmHg)")
    spo2: list[VitalSign] = Field(default_factory=list, description="산소포화도 (%)")
    temperature: list[VitalSign] = Field(default_factory=list, description="체온 (°C)")


class Patient(BaseModel):
    """Patient base information"""
    id: str = Field(..., description="UUID")
    name: str = Field(..., description="환자명")
    age: int = Field(..., ge=0, le=150, description="나이")
    bedNumber: str = Field(..., description="병상 번호 (e.g., '301-A')")
    assignedNurse: str = Field(..., description="담당 간호사 (matches user.key from QR auth)")
    status: PatientStatus = Field(..., description="현재 상태")
    admissionDate: str = Field(..., description="입원일 (ISO string)")
    diagnosis: str = Field(..., description="진단명")
    createdAt: str = Field(..., description="생성일시 (ISO string)")


class PatientWithVitals(Patient):
    """Patient with real-time vital signs"""
    vitals: VitalSigns = Field(..., description="실시간 바이탈 사인")
    lastUpdated: int = Field(..., description="마지막 업데이트 시간 (Unix timestamp)")


class PatientStatusUpdate(BaseModel):
    """Request model for updating patient status"""
    status: PatientStatus
