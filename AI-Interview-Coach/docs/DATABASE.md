# Database Schema Overview

The AI Interview Coach uses a PostgreSQL database. Below are the key tables and their relationships.

## Core Tables
- `users`: Stores authentication credentials and role assignments.
- `profiles`: Stores personal information and avatar URLs.
- `roles`: Defines user roles (e.g., student, admin).
- `tokens`: Manages JWT refresh tokens for secure sessions.

## Interview System
- `categories`: Available interview topics (HR, DSA, React, etc.).
- `interviews`: A session linking a user to a category and difficulty.
- `questions`: Specific questions generated for an interview.
- `answers`: User-submitted answers for each question, including individual AI feedback and scores.
- `reports`: The comprehensive evaluation report generated after an interview completes.

## Supplementary Tables
- `resumes`: Stores uploaded resume file references and AI-parsed text/analysis.
- `subscriptions`: Tracks user billing plans (free, pro).
- `payments`: Logs transaction history.
- `notifications`: System notifications for users.
