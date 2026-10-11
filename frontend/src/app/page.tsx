"use client";

import { useState } from "react";
import axios from "axios";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8001/api/analyze",
        { url },
        { timeout: 30000 }
      );

      if (response.data.analysis?.error) {
        setError(response.data.analysis.error);
      } else {
        setData(response.data);
      }
    } catch (err: any) {
      if (err.code === "ECONNABORTED") {
        setError("Analysis timed out. Please check backend logs or try again.");
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

  // Helper to format emotion data for Recharts
  const formatEmotionData = (emotions: Record<string, number>) => {
    if (!emotions) return [];
    return Object.entries(emotions).map(([key, value]) => ({
      emotion: key.charAt(0).toUpperCase() + key.slice(1),
      percentage: value,
    }));
  };

  const EMOTION_COLORS = ["#818cf8", "#f43f5e", "#34d399", "#fbbf24", "#a78bfa"];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      {/* 1. Header */}
      <div className="max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-3">
          LinkPulse AI
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Universal Social Media & Web Sentiment Analytics Dashboard
        </p>
      </div>

      {/* 2. Link Input Form */}
      <div className="max-w-3xl mx-auto mb-10">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube or Web URL here..."
            required
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white font-semibold px-6 py-3 rounded-xl transition duration-200 flex items-center justify-center min-w-[120px]"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>
      </div>

      {/* 3. Error State */}
      {error && (
        <div className="max-w-3xl mx-auto mb-8 bg-red-950/50 border border-red-800/80 rounded-xl p-4 text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      {/* 4. Dashboard Results */}
      {data && (
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Metadata Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold px-3 py-1 bg-indigo-950/60 rounded-full border border-indigo-800/50">
                {data.metadata?.platform || "Web Page"}
              </span>
              <a
                href={data.metadata?.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-indigo-400 underline truncate max-w-xs"
              >
                Visit Original Link ↗
              </a>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {data.metadata?.title || "Analyzed Page"}
            </h2>
            <p className="text-xs text-slate-400">
              Author / Creator: <span className="text-slate-200 font-medium">{data.metadata?.author || "Unknown"}</span>
            </p>
          </div>

          {/* CARD 1: CONTENT OVERVIEW */}
          {data?.analysis?.page_overview && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                  Content Breakdown
                </span>
                <h2 className="text-xl font-bold">What This Page Is About</h2>
              </div>

              <p className="text-lg font-medium text-indigo-200 mb-4 italic">
                "{data.analysis.page_overview.core_topic}"
              </p>

              <div className="bg-slate-800/60 rounded-xl p-4 mb-4 border border-slate-700/50">
                <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                  Executive Summary
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {data.analysis.page_overview.content_summary}
                </p>
              </div>

              {data.analysis.page_overview.key_topics_covered?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    Key Topics & Themes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.analysis.page_overview.key_topics_covered.map(
                      (topic: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg"
                        >
                          • {topic}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CARD 2: SENTIMENT ANALYTICS & VISUAL GRAPHS */}
          {data?.analysis?.sentiment_analysis && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-8 shadow-lg">
              
              {/* Header & Overall Score Gauge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-6 flex-wrap gap-4">
                <div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                    Audience Feedback
                  </span>
                  <h2 className="text-2xl font-bold mt-2">Sentiment Intelligence</h2>
                </div>

                <div className="flex items-center gap-4 bg-slate-800/80 px-6 py-3 rounded-2xl border border-slate-700">
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-emerald-400">
                      {data.analysis.sentiment_analysis.overall_score}%
                    </span>
                    <p className="text-xs text-slate-400">Positive Index</p>
                  </div>
                </div>
              </div>

              {/* Sentiment Ratio Progress Bars */}
              {data.analysis.sentiment_analysis.sentiment_percentages && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">
                    Sentiment Ratio Breakdown
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-emerald-400 font-semibold">Positive</span>
                        <span>{data.analysis.sentiment_analysis.sentiment_percentages.positive}%</span>
                      </div>
                      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${data.analysis.sentiment_analysis.sentiment_percentages.positive}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400 font-semibold">Neutral</span>
                        <span>{data.analysis.sentiment_analysis.sentiment_percentages.neutral}%</span>
                      </div>
                      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${data.analysis.sentiment_analysis.sentiment_percentages.neutral}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-rose-400 font-semibold">Negative</span>
                        <span>{data.analysis.sentiment_analysis.sentiment_percentages.negative}%</span>
                      </div>
                      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${data.analysis.sentiment_analysis.sentiment_percentages.negative}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Emotion Spectrum Bar Chart */}
              {/* Emotion Spectrum Bar Chart with Fallback Dimensions */}
{data.analysis.sentiment_analysis.emotions && (
  <div>
    <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">
      Audience Emotion Spectrum
    </h3>
    <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 min-h-[260px] w-full relative">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={formatEmotionData(data.analysis.sentiment_analysis.emotions)}>
          <XAxis dataKey="emotion" stroke="#94a3b8" fontSize={12} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
            itemStyle={{ color: "#38bdf8" }}
          />
          <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
            {formatEmotionData(data.analysis.sentiment_analysis.emotions).map((_, index) => (
              <Cell key={`cell-${index}`} fill={EMOTION_COLORS[index % EMOTION_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
                </div>
                </div>
                )}
              

              {/* Executive Summary & Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    Community Feedback Summary
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {data.analysis.sentiment_analysis.summary}
                  </p>
                </div>

                {data.analysis.sentiment_analysis.key_insights?.length > 0 && (
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                      Key Takeaways
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {data.analysis.sentiment_analysis.key_insights.map(
                        (insight: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{insight}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}
    </main>
  );
}