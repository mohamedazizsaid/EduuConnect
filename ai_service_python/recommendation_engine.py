from typing import List

def get_course_recommendations(user_id: str, interests: List[str], completed_courses: List[str]):
    # Simulation: Simple rule-based filtering
    # In production: Use TF-IDF or Cosine Similarity on Course Embeddings
    
    all_courses = [
        {"id": "1", "title": "Intro to Python", "tags": ["python", "coding"]},
        {"id": "2", "title": "Advanced React", "tags": ["react", "frontend", "web"]},
        {"id": "3", "title": "Blockchain Basics", "tags": ["blockchain", "crypto"]},
        {"id": "4", "title": "Machine Learning 101", "tags": ["ai", "python", "ml"]}
    ]
    
    recommended = []
    
    for course in all_courses:
        if course["id"] in completed_courses:
            continue
        
        # Calculate Match Score
        score = 0
        for tag in course["tags"]:
            if tag in interests:
                score += 1
        
        if score > 0:
            recommended.append({**course, "score": score, "reason": "Matches your interest in " + str(course['tags'])})
            
    # Sort by score desc
    recommended.sort(key=lambda x: x['score'], reverse=True)
    
    return {"recommendations": recommended}
