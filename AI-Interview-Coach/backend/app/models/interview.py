from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True) # e.g., HR, DSA, React
    description = Column(Text, nullable=True)
    interviews = relationship("Interview", back_populates="category")

class Interview(Base):
    __tablename__ = "interviews"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    difficulty = Column(String) # e.g., Beginner, Intermediate, Expert
    status = Column(String, default="pending") # pending, in_progress, completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="interviews")
    category = relationship("Category", back_populates="interviews")
    questions = relationship("Question", back_populates="interview")
    report = relationship("Report", back_populates="interview", uselist=False)

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))
    text = Column(Text, nullable=False)
    ideal_answer = Column(Text, nullable=True)
    
    interview = relationship("Interview", back_populates="questions")
    answer = relationship("Answer", back_populates="question", uselist=False)

class Answer(Base):
    __tablename__ = "answers"
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), unique=True)
    text = Column(Text, nullable=False)
    ai_feedback = Column(Text, nullable=True)
    score = Column(Float, nullable=True)
    
    question = relationship("Question", back_populates="answer")

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"), unique=True)
    overall_score = Column(Float)
    grammar_score = Column(Float)
    communication_score = Column(Float)
    confidence_score = Column(Float)
    technical_score = Column(Float)
    star_method_score = Column(Float)
    feedback_summary = Column(Text)
    improvement_suggestions = Column(Text)
    next_learning_path = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    interview = relationship("Interview", back_populates="report")
