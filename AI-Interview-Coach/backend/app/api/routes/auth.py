from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database.session import get_db
from app.models.user import User, Role, Profile
from app.models.auth import Token
from app.schemas.user import UserCreate, UserOut, ForgotPasswordRequest, ResetPasswordRequest
from app.schemas.token import Token as TokenSchema, TokenRefresh
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, create_password_reset_token, verify_password_reset_token
from app.api.dependencies.auth import get_current_user, get_current_active_user
from app.core.config import settings
from jose import jwt, JWTError

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
        
    role = db.query(Role).filter(Role.name == user_in.role).first()
    if not role:
        role = Role(name=user_in.role)
        db.add(role)
        db.commit()
        db.refresh(role)
        
    hashed_password = get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        role_id=role.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    profile = Profile(
        user_id=user.id,
        first_name=user_in.first_name,
        last_name=user_in.last_name
    )
    db.add(profile)
    db.commit()
    
    return user

@router.post("/login", response_model=TokenSchema)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(subject=user.id, role=user.role.name)
    refresh_token = create_refresh_token(subject=user.id, role=user.role.name)
    
    # Store refresh token in db for revocation purposes
    token_db = Token(
        user_id=user.id,
        access_token=access_token,
        refresh_token=refresh_token
    )
    db.add(token_db)
    db.commit()
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=TokenSchema)
def refresh_token(token_in: TokenRefresh, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token_in.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    token_db = db.query(Token).filter(Token.refresh_token == token_in.refresh_token).first()
    if not token_db:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    user = db.query(User).filter(User.id == token_db.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    access_token = create_access_token(subject=user.id, role=user.role.name)
    new_refresh_token = create_refresh_token(subject=user.id, role=user.role.name)
    
    token_db.access_token = access_token
    token_db.refresh_token = new_refresh_token
    db.commit()
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Invalidate tokens
    db.query(Token).filter(Token.user_id == current_user.id).delete()
    db.commit()
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserOut)
def read_user_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if user:
        reset_token = create_password_reset_token(email=user.email)
        # In a real app, send an email here with the reset_token
    return {"message": "If that email is registered, we have sent a password reset link."}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_password_reset_token(req.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.hashed_password = get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password successfully reset"}
