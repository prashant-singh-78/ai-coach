# AI Interview Coach

A complete, production-ready AI Interview Platform built with React, FastAPI, and PostgreSQL.

## Features
- **Student Portal**: Upload resumes, take AI mock interviews, get detailed reports and analytics.
- **Admin Dashboard**: Manage users, interview questions, and view platform metrics.
- **AI Evaluation**: Integrates with Ollama for intelligent interview answer assessment, feedback, and scoring.
- **Subscription**: Role-based access with Pro plans.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, React Router, Framer Motion, Chart.js.
- **Backend**: Python, FastAPI, SQLAlchemy, Alembic, JWT, Passlib.
- **Database**: PostgreSQL.
- **Storage**: Cloudinary (for resumes).

## Setup Instructions

### 1. Database Setup
Ensure PostgreSQL is running and create a database named `aicoach`.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Activate venv (Windows: .\venv\Scripts\activate, Linux/Mac: source venv/bin/activate)
pip install -r requirements.txt
cp .env.example .env # Update with your DB credentials
alembic upgrade head
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env # Set VITE_API_URL
npm run dev
```

For full documentation, see the `docs/` folder.
