from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, users, interviews, resumes, analytics

app = FastAPI(
    title="AI Interview Coach API",
    description="Backend API for the AI Interview Coach platform",
    version="1.0.0"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Interview Coach API"}

# Add route routers here later
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(interviews.router, prefix="/api/interview", tags=["interviews"])
app.include_router(resumes.router, prefix="/api/resume", tags=["resumes"])
app.include_router(analytics.router, prefix="/api/dashboard", tags=["dashboard"])
