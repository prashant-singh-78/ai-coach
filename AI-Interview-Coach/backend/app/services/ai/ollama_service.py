import google.generativeai as genai
import json
from app.core.config import settings
import re
import random
from app.core.question_bank import QUESTION_BANK

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

MODEL_NAME = "gemini-1.5-flash-latest"

def get_model():
    return genai.GenerativeModel(MODEL_NAME)

def extract_json(text: str):
    # Try to extract JSON from markdown code blocks or plain text
    try:
        json_match = re.search(r'\[.*\]|\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(0))
        return json.loads(text)
    except:
        return None

def generate_interview_questions(category_name: str, difficulty: str, count: int = 10):
    matched_questions = []
    category_lower = category_name.lower()
    
    for domain, questions in QUESTION_BANK.items():
        if domain.lower() in category_lower:
            matched_questions.extend(questions)
            
    if matched_questions:
        actual_count = min(count, len(matched_questions))
        selected = random.sample(matched_questions, actual_count)
        return selected
        
    prompt = f"""
    You are an expert technical interviewer. Generate {count} interview questions for the following topic(s): '{category_name}' at a '{difficulty}' difficulty level.
    Return ONLY a JSON array of objects, where each object has "text" (the question) and "ideal_answer" (a brief summary of a good answer).
    Do not include markdown blocks or any other text.
    """
    
    try:
        model = get_model()
        response = model.generate_content(prompt)
        parsed = extract_json(response.text)
        if parsed and isinstance(parsed, list):
            return parsed
        raise Exception("Invalid JSON")
    except Exception as e:
        print(f"Gemini generation error: {e}")
        return [
            {"text": f"Can you explain a core concept of {category_name}?", "ideal_answer": "A clear, concise explanation demonstrating understanding."},
            {"text": f"What is a common challenge in {category_name} and how do you solve it?", "ideal_answer": "Practical problem-solving approach."}
        ]

def evaluate_answer(question: str, ideal_answer: str, user_answer: str):
    prompt = f"""
    You are an expert technical interviewer. Evaluate the user's answer to the following question.
    
    Question: {question}
    Ideal Answer context: {ideal_answer}
    User Answer: {user_answer}
    
    Provide an evaluation returning ONLY a JSON object with two keys:
    1. "feedback": A short string providing constructive feedback.
    2. "score": An integer from 1 to 10 rating the answer.
    """
    
    try:
        model = get_model()
        response = model.generate_content(prompt)
        parsed = extract_json(response.text)
        if parsed and isinstance(parsed, dict):
            return {
                "feedback": parsed.get("feedback", "Good effort."),
                "score": parsed.get("score", 5)
            }
        raise Exception("Invalid JSON")
    except Exception as e:
        print(f"Gemini evaluation error: {e}")
        return {"feedback": "Could not generate feedback.", "score": 5}

def generate_final_report(questions_and_answers: list):
    prompt = f"""
    You are an expert technical interviewer. Based on the following Q&A transcript, provide a final evaluation report.
    Transcript:
    {json.dumps(questions_and_answers)}
    
    Return ONLY a JSON object with these exact keys, all numeric values out of 10 except the text fields:
    "overall_score" (float),
    "grammar_score" (float),
    "communication_score" (float),
    "confidence_score" (float),
    "technical_score" (float),
    "star_method_score" (float),
    "feedback_summary" (string),
    "improvement_suggestions" (string),
    "next_learning_path" (string)
    """
    
    try:
        model = get_model()
        response = model.generate_content(prompt)
        parsed = extract_json(response.text)
        if parsed and isinstance(parsed, dict):
            return parsed
        raise Exception("Invalid JSON")
    except Exception as e:
        print(f"Gemini report error: {e}")
        return {
            "overall_score": 7.0,
            "grammar_score": 7.0,
            "communication_score": 7.0,
            "confidence_score": 7.0,
            "technical_score": 7.0,
            "star_method_score": 7.0,
            "feedback_summary": "Good overall performance, but there is room for improvement.",
            "improvement_suggestions": "Practice more technical problems and explain your thought process clearly.",
            "next_learning_path": "Focus on advanced system design concepts."
        }

def analyze_resume(text: str, job_description: str = None):
    job_desc_context = f"\nJob Description (if any):\n{job_description}\n" if job_description else ""
    
    prompt = f"""
    You are an expert technical recruiter and AI Coach. Analyze the following resume text.
    Resume Text:
    {text}
    {job_desc_context}
    
    Return ONLY a JSON object with the following structure exactly (all keys are required):
    {{
        "ai_analysis": "A final paragraph (3-4 sentences) providing constructive, professional overall feedback on the resume.",
        "topics": ["Array of up to 5 strings representing key technical skills or topics found in the resume. IMPORTANT: Map the candidate's skills to one or more of the following core domains if applicable: 'Software Engineering', 'AI', 'ML', 'Deep Learning', 'Data Science'."],
        "ats_score": 65,
        "section_scores": {{
            "contact_info": 80,
            "summary": 70,
            "skills": 90,
            "education": 100,
            "experience": 75,
            "projects": 60,
            "certifications": 50,
            "formatting": 85,
            "grammar": 95
        }},
        "missing_keywords": ["Array of strings (missing keywords based on the job description or standard industry expectations)"],
        "missing_skills": ["Array of strings (missing technical skills)"],
        "strengths": ["Array of strings highlighting strong points"],
        "weaknesses": ["Array of strings highlighting weak points"],
        "suggestions": ["Array of strings with actionable improvement suggestions"],
        "keyword_match_percentage": 50
    }}
    IMPORTANT: Ensure the response is strict JSON without any markdown formatting wrappers.
    """
    
    try:
        model = get_model()
        response = model.generate_content(prompt)
        parsed = extract_json(response.text)
        if parsed and isinstance(parsed, dict):
            ats_details = {
                "section_scores": parsed.get("section_scores", {}),
                "missing_keywords": parsed.get("missing_keywords", []),
                "missing_skills": parsed.get("missing_skills", []),
                "strengths": parsed.get("strengths", []),
                "weaknesses": parsed.get("weaknesses", []),
                "suggestions": parsed.get("suggestions", []),
                "keyword_match_percentage": parsed.get("keyword_match_percentage", 0)
            }
            
            return {
                "ai_analysis": parsed.get("ai_analysis", "Your resume highlights some good experience, but could benefit from more quantifiable achievements."),
                "topics": parsed.get("topics", ["General Tech", "Software Engineering"]),
                "ats_score": int(parsed.get("ats_score", 65)),
                "ats_details": ats_details
            }
        raise Exception("Invalid JSON")
    except Exception as e:
        print(f"Gemini resume analysis error: {e}")
        return {
            "ai_analysis": "Could not generate detailed AI feedback at this time. Ensure your resume highlights your key achievements clearly.",
            "topics": ["General Tech", "Software Engineering"],
            "ats_score": 50,
            "ats_details": None
        }
