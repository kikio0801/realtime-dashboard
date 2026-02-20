"""
Patient data service using Python & Pandas (SOA Architecture)
Delegates pandas processing to analytics module
"""
import random
from datetime import datetime, timedelta
from typing import Optional
import sys
import os

# Add root directory to python path for cross-module importing
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from app.models import Patient, PatientStatus
from app.data.mock_data import SURNAMES, GIVEN_NAMES, DIAGNOSES
from analytics.pandas_logic import PatientDataProcessor

class PatientService:
    """Service for managing patient data, integrated with SOA analytics module"""
    
    def __init__(self):
        self.processor = PatientDataProcessor()
        
    def seed_patients(self, nurse_key: str, count: int = 5) -> list[Patient]:
        """Generate seed data for patients"""
        
        now = datetime.now()
        patients = []
        
        for i in range(count):
            surname = SURNAMES[i % len(SURNAMES)]
            given_name = GIVEN_NAMES[i % len(GIVEN_NAMES)]
            name = f"{surname}{given_name}"
            
            bed_floor = 3  # ICU on 3rd floor
            bed_number = f"{bed_floor}{str(i + 1).zfill(2)}-{'A' if i % 2 == 0 else 'B'}"
            
            admission_date = now - timedelta(days=random.randint(1, 7))
            
            patient = Patient(
                id=f"patient-{int(now.timestamp() * 1000)}-{i}-{random.randint(100000, 999999)}",
                name=name,
                age=random.randint(45, 80),
                bedNumber=bed_number,
                assignedNurse=nurse_key,
                status="stable",
                admissionDate=admission_date.isoformat(),
                diagnosis=DIAGNOSES[i % len(DIAGNOSES)],
                createdAt=now.isoformat()
            )
            patients.append(patient)
        
        # Load into Analytics processor
        self.processor.load_data([p.model_dump() for p in patients])
        return patients
    
    def get_all(self) -> list[Patient]:
        """Get all patients"""
        records = self.processor.get_all_records()
        return [Patient(**row) for row in records]
    
    def get_by_id(self, patient_id: str) -> Optional[Patient]:
        """Get patient by ID"""
        record = self.processor.find_by_id(patient_id)
        if not record:
            return None
        return Patient(**record)
    
    def get_by_nurse(self, nurse_key: str) -> list[Patient]:
        """Get patients assigned to a specific nurse"""
        records = self.processor.find_by_nurse(nurse_key)
        return [Patient(**row) for row in records]
    
    def update_status(self, patient_id: str, status: PatientStatus) -> Optional[Patient]:
        """Update patient status"""
        record = self.processor.update_field(patient_id, 'status', status)
        if not record:
            return None
        return Patient(**record)


# Global instance (in-memory storage)
patient_service = PatientService()
