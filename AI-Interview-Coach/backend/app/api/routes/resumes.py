from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.interview import Category
from app.schemas.resume import ResumeOut
from app.api.dependencies.auth import get_current_active_user
from app.services.ai.ollama_service import analyze_resume
import uuid
import os
import pypdf

router = APIRouter()

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=ResumeOut)
async def upload_resume(
    file: UploadFile = File(...),
    job_description: str = Form(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    # Extract text using pypdf
    parsed_text = ""
    try:
        reader = pypdf.PdfReader(file_path)
        for page in reader.pages:
            parsed_text += page.extract_text() + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
        parsed_text = "Could not parse text from PDF."
        
    # Call AI service
    ai_result = analyze_resume(parsed_text, job_description)
    topics = ai_result.get("topics", [])
    
    # Save extracted topics to global Categories if they don't exist
    for topic_name in topics:
        if not topic_name:
            continue
        existing_cat = db.query(Category).filter(Category.name.ilike(topic_name)).first()
        if not existing_cat:
            new_cat = Category(name=topic_name, description=f"Extracted from {current_user.email}'s resume")
            db.add(new_cat)
    
    resume = Resume(
        user_id=current_user.id,
        file_url=file_path,
        parsed_text=parsed_text[:2000], # Keep a reasonable length
        ai_analysis=ai_result.get("ai_analysis", ""),
        topics=topics,
        ats_score=ai_result.get("ats_score", 0),
        job_description=job_description,
        ats_details=ai_result.get("ats_details")
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    
    return resume

@router.get("/report", response_model=ResumeOut)
def get_resume_report(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume found")
    return resume
