from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ResumeBase(BaseModel):
    file_url: str
    parsed_text: Optional[str] = None
    ai_analysis: Optional[str] = None
    topics: Optional[List[str]] = []
    ats_score: Optional[int] = 0
    job_description: Optional[str] = None
    ats_details: Optional[dict] = None

class ResumeCreate(ResumeBase):
    pass

class ResumeOut(ResumeBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
