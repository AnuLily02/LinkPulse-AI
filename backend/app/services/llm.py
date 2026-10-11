import json
import os
from google import genai
from google.genai import types

def analyze_sentiment_with_llm(extracted_data: dict) -> dict:
    """Passes scraped content to Gemini 1.5/2.0 Flash to generate structured sentiment JSON."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "error": "GEMINI_API_KEY environment variable is not configured."
        }

    client = genai.Client(api_key=api_key)

    prompt = f"""
    You are an expert social media and sentiment analysis engine.
    Analyze the following scraped content and audience feedback:

    Platform: {extracted_data.get('platform')}
    Title/Subject: {extracted_data.get('title')}
    Author/Creator: {extracted_data.get('author')}
    Extracted Text / Comments:
    {json.dumps(extracted_data.get('comments', []), indent=2)}

    Return ONLY a valid JSON object matching this exact structure:
    {{
      "summary": "2-3 concise sentences summarizing what the post/video is about and general audience sentiment.",
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
        "Top positive driver or praise",
        "Top concern, criticism, or complaint"
      ]
    }}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        return json.loads(response.text)
    except Exception as e:
        return {"error": f"LLM Processing Failed: {str(e)}"}
    