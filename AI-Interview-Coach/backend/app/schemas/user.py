from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str
    first_name: str
    last_name: str
    role: str = "student"

class UserLogin(UserBase):
    password: str

class ProfileBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

class UserOut(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    role_id: int
    role: str = Field(alias="role_name")
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProfileOut(ProfileBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
