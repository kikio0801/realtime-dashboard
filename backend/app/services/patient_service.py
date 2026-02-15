"""
Patient data service using Pandas
Replaces localStorage logic from frontend
"""
import pandas as pd
import random
from datetime import datetime, timedelta
from typing import Optional
from app.models import Patient, PatientStatus
from app.data.mock_data import SURNAMES, GIVEN_NAMES, DIAGNOSES


class PatientService:
    """Service for managing patient data using Pandas DataFrame"""
    
    def __init__(self):
        self.df: pd.DataFrame = pd.DataFrame()
        
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
        
        # Convert to DataFrame
        self.df = pd.DataFrame([p.model_dump() for p in patients])
        return patients
    
    def get_all(self) -> list[Patient]:
        """Get all patients"""
        if self.df.empty:
            return []
        return [Patient(**row) for row in self.df.to_dict('records')]
    
    def get_by_id(self, patient_id: str) -> Optional[Patient]:
        """Get patient by ID"""
        if self.df.empty:
            return None
        
        result = self.df[self.df['id'] == patient_id]
        if result.empty:
            return None
        
        return Patient(**result.iloc[0].to_dict())
    
    def get_by_nurse(self, nurse_key: str) -> list[Patient]:
        """Get patients assigned to a specific nurse"""
        if self.df.empty:
            return []
        
        result = self.df[self.df['assignedNurse'] == nurse_key]
        return [Patient(**row) for row in result.to_dict('records')]
    
    def update_status(self, patient_id: str, status: PatientStatus) -> Optional[Patient]:
        """Update patient status"""
        if self.df.empty:
            return None
        
        mask = self.df['id'] == patient_id
        if not mask.any():
            return None
        
        self.df.loc[mask, 'status'] = status
        return self.get_by_id(patient_id)


# Global instance (in-memory storage)
patient_service = PatientService()
