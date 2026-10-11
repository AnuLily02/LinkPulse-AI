"use client";
import React, { useState } from "react";
import axios from "axios";
import LinkInput from "../components/LinkInput";
import Charts from "../components/Charts";
import Summary from "../components/Summary";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

 const handleAnalyze = async (url: string) => {
    setLoading(true);
    setError("");
    setData(null);
    
    try {
      const response = await axios.post(
        "http://127.0.0.1:8001/api/analyze", 
        { url },
        { timeout: 30000 } // 30-second timeout safeguard
      );
      
      if (response.data.analysis?.error) {
        setError(response.data.analysis.error);
      } else {
        setData(response.data);
      }
    } catch (err: any) {
      if (err.code === "ECONNABORTED") {
        setError("Analysis timed out. Please check your backend logs or try a different link.");
      } else {
        setError(
          err.response?.data?.detail || 
          "Failed to connect to LinkPulse AI backend. Ensure uvicorn is running on port 8001."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          LinkPulse<span className="text-indigo-600">_AI</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Universal Social Media & Web Sentiment Analytics Dashboard
        </p>
      </div>

      <LinkInput onAnalyze={handleAnalyze} loading={loading} />

      {error && (
        <div className="max-w-3xl mx-auto p-4 bg-red-50 text-red-600 text-sm rounded-xl mb-6 text-center border border-red-100">
          {error}
        </div>
      )}

      {data && (
        <div>
          <Summary metadata={data.metadata} analysis={data.analysis} />
          <Charts
            sentiment={data.analysis.sentiment_percentages}
            emotions={data.analysis.emotions}
          />
        </div>
      )}
    </main>
  );
}