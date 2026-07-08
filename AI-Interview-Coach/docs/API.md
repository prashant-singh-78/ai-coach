# API Documentation

## Authentication
- `POST /auth/register`: Register a new user (Student or Admin).
- `POST /auth/login`: Login and receive JWT access and refresh tokens.
- `POST /auth/logout`: Invalidate the current session.
- `POST /auth/refresh`: Obtain a new access token using a refresh token.

## Profile & Resumes
- `GET /profile`: Get current user's profile details.
- `PUT /profile`: Update profile information.
- `POST /resume/upload`: Upload a PDF resume for AI parsing.
- `GET /resume/report`: Get AI-generated feedback on the uploaded resume.

## Interviews
- `POST /interview/start`: Start a new interview session by selecting category and difficulty. Returns generated questions.
- `POST /interview/answer`: Submit a user's answer (text) for a specific question.
- `GET /interview/report`: Get the final AI evaluation report after interview completion.

## Dashboard & Analytics
- `GET /dashboard`: Get user's dashboard statistics (recent interviews, progress).
- `GET /analytics`: Get detailed performance analytics across different categories.
