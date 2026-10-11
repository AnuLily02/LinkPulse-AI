import json
import os
import requests
import time

def analyze_sentiment_with_llm(extracted_data: dict) -> dict:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {"error": "GEMINI_API_KEY environment variable is not configured in .env"}

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={api_key}"

    prompt = prompt = f"""
    You are an expert web content analyst and sentiment intelligence engine.
    Analyze the following scraped page metadata and audience feedback:

    Platform: {extracted_data.get('platform')}
    Title/Subject: {extracted_data.get('title')}
    Author/Creator: {extracted_data.get('author')}
    Extracted Text / Comments:
    {json.dumps(extracted_data.get('comments', []), indent=2)}

    Return ONLY a raw, valid JSON object matching this exact structure:
    {{
      "page_overview": {{
        "core_topic": "1 short sentence identifying the exact subject or purpose of the page/video.",
        "content_summary": "A comprehensive paragraph summarizing the core text, message, or content presented on the page.",
        "key_topics_covered": [
          "Key topic or takeaway 1",
          "Key topic or takeaway 2",
          "Key topic or takeaway 3"
        ]
      }},
      "sentiment_analysis": {{
        "summary": "2-3 concise sentences summarizing audience reaction and feedback.",
        "overall_score": 75,
        "sentiment_percentages": {{
          "positive": 65,
          "neutral": 20,
          "negative": 15
        }},
        "emotions": {{
          "joy": 40,
          "frustration": 10,
          "excitement": 30,
          "skepticism": 20
        }},
        "key_insights": [
          "Top praise or positive audience feedback",
          "Top criticism or concern raised by audience"
        ]
      }}
    }}
    """

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "response_mime_type": "application/json"
        }
    }

    # Retry up to 3 times for 503 high-demand spikes
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = requests.post(url, json=payload, timeout=30)
            
            if response.status_code == 200:
                result_json = response.json()
                raw_text = result_json["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(raw_text)
            
            # If 503 high-demand spike, wait and retry
            if response.status_code == 503 and attempt < max_retries - 1:
                time.sleep(2 * (attempt + 1))  # Wait 2s, then 4s
                continue
                
            return {"error": f"Gemini API returned status {response.status_code}: {response.text}"}

        except Exception as e:
            if attempt == max_retries - 1:
                return {"error": f"LLM Processing Failed: {str(e)}"}
            time.sleep(2)