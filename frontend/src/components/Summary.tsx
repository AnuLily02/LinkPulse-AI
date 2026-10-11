"use client";
import React from "react";
import { CheckCircle2, AlertCircle, FileText } from "lucide-react";

interface SummaryProps {
  metadata: { title: string; author: string; platform: string; url: string };
  analysis: {
    summary: string;
    overall_score: number;
    key_insights: string[];
  };
}

export default function Summary({ metadata, analysis }: SummaryProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 my-6">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
            {metadata.platform}
          </span>
          <h2 className="text-xl font-bold text-gray-900 mt-2">{metadata.title}</h2>
          <p className="text-sm text-gray-500">By {metadata.author}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-indigo-600">{analysis.overall_score}%</span>
          <p className="text-xs text-gray-400">Positive Score</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="flex items-center gap-2 text-md font-semibold text-gray-800 mb-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          Content Executive Summary
        </h4>
        <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">
          {analysis.summary}
        </p>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-800 mb-3">Key Community Takeaways</h4>
        <div className="grid md:grid-cols-2 gap-3">
          {analysis.key_insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg text-sm text-gray-700 border border-slate-100">
              {idx % 2 === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              )}
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}