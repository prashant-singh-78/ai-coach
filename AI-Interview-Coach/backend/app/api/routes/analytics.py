from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.models.user import User
from app.models.interview import Interview, Report
from app.api.dependencies.auth import get_current_active_user
from app.models.resume import Resume

router = APIRouter()

@router.get("")
def get_dashboard(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    interviews = db.query(Interview).filter(Interview.user_id == current_user.id).order_by(Interview.created_at.desc()).limit(5).all()
    total_interviews = db.query(Interview).filter(Interview.user_id == current_user.id).count()
    
    avg_score = db.query(func.avg(Report.overall_score)).join(Interview).filter(Interview.user_id == current_user.id).scalar()
    
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    
    return {
        "recent_interviews": interviews,
        "total_interviews": total_interviews,
        "average_score": avg_score or 0.0,
        "resume_uploaded": bool(resume)
    }

@router.get("/analytics")
def get_analytics(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Dummy analytics aggregation
    reports = db.query(Report).join(Interview).filter(Interview.user_id == current_user.id).all()
    
    if not reports:
        return {"message": "No data yet"}
        
    return {
        "total_reports": len(reports),
        "scores_over_time": [r.overall_score for r in reports],
        "grammar_avg": sum(r.grammar_score for r in reports) / len(reports),
        "technical_avg": sum(r.technical_score for r in reports) / len(reports),
    }
