# Deployment Guide

## Frontend (Vercel)
The frontend is built with React and Vite. It is configured to be easily deployed to Vercel.
1. Connect your GitHub repository to Vercel.
2. Ensure the Framework Preset is set to **Vite**.
3. Set the `VITE_API_URL` environment variable to your deployed backend URL.
4. Deploy!

## Backend (Render)
The backend is a FastAPI application. We provide a `render.yaml` file for Infrastructure as Code deployment on Render.
1. Connect your repository to Render.
2. Render will automatically detect the `render.yaml` blueprint.
3. Configure the required environment variables (e.g., `DATABASE_URL`, `SECRET_KEY`, `OLLAMA_BASE_URL`).

## Database
We recommend using Render's managed PostgreSQL database or Supabase. Provide the connection string as `DATABASE_URL` in the backend environment.
