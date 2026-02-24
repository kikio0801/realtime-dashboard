"""
Patient data service using Python & Supabase
Fetches directly from the DB so all nurses see the same patients.
"""
from typing import Optional
from datetime import datetime

from app.models import Patient, PatientStatus
from app.db.client import supabase


class PatientService:
    """Service for managing patient data directly via Supabase"""
    
    def seed_patients(self, nurse_key: str, count: int = 5) -> list[Patient]:
        """No-op: DB manages the data now. Fallback to get_all()"""
        return self.get_all()
    
    def _map_row_to_patient(self, row: dict) -> Patient:
        status_val = row.get("status", "stable")
        if status_val == "emergency":
            status_val = "critical"
            
        return Patient(
            id=str(row.get("id", "")),
            name=row.get("name", "Unknown"),
            age=row.get("age", 0) or 0,
            bedNumber=row.get("bed_number", ""),
            assignedNurse="", # No longer bound to a specific nurse log-in
            status=status_val,
            admissionDate=row.get("admission_date") or datetime.now().isoformat(),
            diagnosis=row.get("diagnosis") or "미상",
            createdAt=row.get("created_at") or datetime.now().isoformat()
        )

    def get_all(self) -> list[Patient]:
        """Get all patients from Supabase"""
        if not supabase:
            print("Supabase client not initialized")
            return []
            
        response = supabase.table("patients").select("*").execute()
        return [self._map_row_to_patient(row) for row in response.data]
    
    def get_by_id(self, patient_id: str) -> Optional[Patient]:
        """Get patient by ID"""
        if not supabase:
            return None
            
        response = supabase.table("patients").select("*").eq("id", patient_id).execute()
        if not response.data:
            return None
        return self._map_row_to_patient(response.data[0])
    
    def get_by_nurse(self, nurse_key: str) -> list[Patient]:
        """Return all patients regardless of nurse"""
        return self.get_all()
    
    def update_status(self, patient_id: str, status: PatientStatus) -> Optional[Patient]:
        """Update patient status"""
        if not supabase:
            return None
            
        response = supabase.table("patients").update({"status": status}).eq("id", patient_id).execute()
        if not response.data:
            return None
        return self._map_row_to_patient(response.data[0])


# Global instance
patient_service = PatientService()
