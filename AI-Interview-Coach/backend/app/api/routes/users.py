from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User, Profile
from app.schemas.user import UserOut, ProfileOut, ProfileBase
from app.api.dependencies.auth import get_current_active_user

router = APIRouter()


@router.get("/profile", response_model=ProfileOut)
def get_profile(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profile", response_model=ProfileOut)
def update_profile(
    profile_in: ProfileBase, 
    current_user: User = Depends(get_current_active_user), 
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    if profile_in.first_name is not None:
        profile.first_name = profile_in.first_name
    if profile_in.last_name is not None:
        profile.last_name = profile_in.last_name
    if profile_in.phone is not None:
        profile.phone = profile_in.phone
    if profile_in.avatar_url is not None:
        profile.avatar_url = profile_in.avatar_url
        
    db.commit()
    db.refresh(profile)
    return profile
