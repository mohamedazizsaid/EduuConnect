import random

def evaluate_submission(submission: str, context: str = None):
    # Simulation: Length heuristic + Simulated feedback
    # In production: Use LLM or Semantic Similarity
    
    word_count = len(submission.split())
    
    if word_count < 10:
        return {
            "score": 40.0,
            "feedback": "Your answer is too short. Please elaborate.",
            "status": "graded"
        }
    
    # Simulate nuanced feedback
    score = min(100, 50 + (word_count * 0.5)) + (random.random() * 10)
    score = min(score, 100) # Cap at 100
    
    return {
        "score": round(score, 2),
        "feedback": "Good effort. Your submission covers the main points.",
        "status": "graded"
    }
