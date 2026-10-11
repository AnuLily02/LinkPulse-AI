from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.scraper import extract_link_data
from app.services.llm import analyze_sentiment_with_llm

router = APIRouter()

class AnalyzeRequest(BaseModel):
    url: str

@router.post("/analyze")
def analyze_url(payload: AnalyzeRequest):
    if not payload.url.strip():
        raise HTTPException(status_code=400, detail="URL cannot be empty.")
    
    print("\n--- NEW REQUEST RECEIVED ---")
    print(f"[1/3] Extracting data for URL: {payload.url}")
    extracted_data = extract_link_data(payload.url)
    print(f"[2/3] Extraction complete! Title: {extracted_data.get('title')}")
    
    print("[3/3] Sending payload to Gemini LLM...")
    analysis_result = analyze_sentiment_with_llm(extracted_data)
    print("--- ANALYSIS COMPLETE ---\n")
    
    return {
        "metadata": {
            "title": extracted_data.get("title"),
            "author": extracted_data.get("author"),
            "platform": extracted_data.get("platform"),
            "url": extracted_data.get("url")
        },
        "analysis": analysis_result
    }