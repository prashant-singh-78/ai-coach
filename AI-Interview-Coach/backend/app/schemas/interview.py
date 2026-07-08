from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class QuestionBase(BaseModel):
    text: str
    ideal_answer: Optional[str] = None

class QuestionOut(QuestionBase):
    id: int
    interview_id: int
    
    class Config:
        from_attributes = True

class AnswerBase(BaseModel):
    text: str

class AnswerCreate(AnswerBase):
    question_id: int

class AnswerOut(AnswerBase):
    id: int
    question_id: int
    ai_feedback: Optional[str] = None
    score: Optional[float] = None
    
    class Config:
        from_attributes = True

class InterviewBase(BaseModel):
    category_id: Optional[int] = None
    difficulty: str
    resume_topics: Optional[List[str]] = None

class InterviewCreate(InterviewBase):
    pass

class InterviewOut(InterviewBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    questions: List[QuestionOut] = []
    
    class Config:
        from_attributes = True

class ReportOut(BaseModel):
    id: int
    interview_id: int
    overall_score: float
    grammar_score: float
    communication_score: float
    confidence_score: float
    technical_score: float
    star_method_score: float
    feedback_summary: str
    improvement_suggestions: str
    next_learning_path: str
    created_at: datetime

    class Config:
        from_attributes = True
