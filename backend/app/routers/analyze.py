from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.scraper import extract_link_data
from app.services.llm import analyze_sentiment_with_llm

router = APIRouter()

class AnalyzeRequest(BaseModel):
    url: str

@router.post("/analyze")
async def analyze_url(payload: AnalyzeRequest):
    if not payload.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty.")
    
    # Step 1: Extract data from URL
    extracted_data = extract_link_data(payload.url)
    
    # Step 2: Analyze sentiment via Gemini LLM
    analysis_result = analyze_sentiment_with_llm(extracted_data)
    
    return {
        "metadata": {
            "title": extracted_data.get("title"),
            "author": extracted_data.get("author"),
            "platform": extracted_data.get("platform"),
            "url": extracted_data.get("url")
        },
        "analysis": analysis_result
    }