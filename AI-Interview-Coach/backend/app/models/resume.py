from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    file_url = Column(String, nullable=False)
    parsed_text = Column(Text, nullable=True)
    ai_analysis = Column(Text, nullable=True)
    topics = Column(JSON, nullable=True)
    ats_score = Column(Integer, nullable=True, default=0)
    job_description = Column(Text, nullable=True)
    ats_details = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="resumes")
