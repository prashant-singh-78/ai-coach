from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.models.interview import Interview, Category, Question, Answer, Report
from app.schemas.interview import InterviewCreate, InterviewOut, QuestionOut, AnswerCreate, AnswerOut, ReportOut
from app.api.dependencies.auth import get_current_active_user
from app.services.ai.ollama_service import generate_interview_questions, evaluate_answer, generate_final_report

router = APIRouter()

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.post("/start", response_model=InterviewOut)
def start_interview(
    interview_in: InterviewCreate, 
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if interview_in.resume_topics and len(interview_in.resume_topics) > 0:
        # Resume-based interview
        topic_string = ", ".join(interview_in.resume_topics)
        category_name = topic_string
        
        # Ensure a "Resume Skills" category exists in DB for the foreign key
        category = db.query(Category).filter(Category.name == "Resume Skills").first()
        if not category:
            category = Category(name="Resume Skills", description="Dynamic category for resume-based interviews")
            db.add(category)
            db.commit()
            db.refresh(category)
    else:
        # Normal interview
        if not interview_in.category_id:
            raise HTTPException(status_code=400, detail="category_id is required if resume_topics are not provided")
            
        category = db.query(Category).filter(Category.id == interview_in.category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        category_name = category.name
        
    interview = Interview(
        user_id=current_user.id,
        category_id=category.id,
        difficulty=interview_in.difficulty,
        status="in_progress"
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    
    # Generate questions via AI (it will generate 10 by default as updated in ollama_service)
    generated = generate_interview_questions(category_name, interview_in.difficulty, count=10)
    for q in generated:
        question = Question(
            interview_id=interview.id,
            text=q.get("text", "Default Question"),
            ideal_answer=q.get("ideal_answer", "")
        )
        db.add(question)
        
    db.commit()
    db.refresh(interview)
    return interview

@router.post("/answer", response_model=AnswerOut)
def submit_answer(
    answer_in: AnswerCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    question = db.query(Question).filter(Question.id == answer_in.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
        
    # Check if answer already exists
    existing_answer = db.query(Answer).filter(Answer.question_id == question.id).first()
    if existing_answer:
        raise HTTPException(status_code=400, detail="Answer already submitted for this question")
        
    # Evaluate via AI
    evaluation = evaluate_answer(question.text, question.ideal_answer, answer_in.text)
    
    answer = Answer(
        question_id=question.id,
        text=answer_in.text,
        ai_feedback=evaluation.get("feedback"),
        score=evaluation.get("score")
    )
    db.add(answer)
    db.commit()
    db.refresh(answer)
    return answer

@router.post("/{interview_id}/finish", response_model=ReportOut)
def finish_interview(
    interview_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    interview = db.query(Interview).filter(Interview.id == interview_id, Interview.user_id == current_user.id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
        
    interview.status = "completed"
    
    # Gather all Q&A
    qa_list = []
    for q in interview.questions:
        if q.answer:
            qa_list.append({
                "question": q.text,
                "answer": q.answer.text,
                "score": q.answer.score
            })
            
    if not qa_list:
         raise HTTPException(status_code=400, detail="No answers submitted")
         
    report_data = generate_final_report(qa_list)
    
    report = Report(
        interview_id=interview.id,
        **report_data
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    return report

@router.get("/{interview_id}/report", response_model=ReportOut)
def get_report(
    interview_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    report = db.query(Report).join(Interview).filter(
        Report.interview_id == interview_id,
        Interview.user_id == current_user.id
    ).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
        
    return report
