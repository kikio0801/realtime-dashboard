"""
Pandas logic for healthcare data processing
"""
import pandas as pd
from typing import Optional, Any

class PatientDataProcessor:
    """Core analytics module for processing patient data using Pandas"""
    
    COL_ID = 'id'
    COL_ASSIGNED_NURSE = 'assignedNurse'
    
    def __init__(self):
        self.df: pd.DataFrame = pd.DataFrame()
        
    def load_data(self, data: list[dict]):
        """Load list of dicts into DataFrame"""
        self.df = pd.DataFrame(data)
        
    def get_all_records(self) -> list[dict]:
        """Return all data as list of dicts"""
        if self.df.empty:
            return []
        return self.df.to_dict('records')

    def find_by_id(self, patient_id: str) -> Optional[dict]:
        """Find a record by id"""
        if self.df.empty:
            return None
        result = self.df[self.df[self.COL_ID] == patient_id]
        if result.empty:
            return None
        return result.iloc[0].to_dict()

    def find_by_nurse(self, nurse_key: str) -> list[dict]:
        """Find records by assigned nurse"""
        if self.df.empty:
            return []
        result = self.df[self.df[self.COL_ASSIGNED_NURSE] == nurse_key]
        return result.to_dict('records')

    def update_field(self, patient_id: str, field: str, value: Any) -> Optional[dict]:
        """Update a specific field for a patient"""
        if self.df.empty:
            return None
        mask = self.df[self.COL_ID] == patient_id
        if not mask.any():
            return None
        self.df.loc[mask, field] = value
        return self.find_by_id(patient_id)
