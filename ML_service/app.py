from fastapi import FastAPI, UploadFile, File
import shutil
import os
from resume_parser import parse_resume_data
from job_matcher import get_recommendations
from pydantic import BaseModel
from typing import List

app = FastAPI()

class JobItem(BaseModel):
    id: str
    description: str

class RecommendRequest(BaseModel):
    skills: List[str]
    jobs: List[JobItem]

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    # Save file temporarily
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        data = parse_resume_data(temp_path)
        return data
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/recommend-jobs")
async def recommend(req: RecommendRequest):
    recommendations = get_recommendations(req.skills, [job.dict() for job in req.jobs])
    return recommendations

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
