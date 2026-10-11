"use client";
import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";

interface LinkInputProps {
  onAnalyze: (url: string) => void;
  loading: boolean;
}

export default function LinkInput({ onAnalyze, loading }: LinkInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto my-6">
      <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden bg-white border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500">
        <input
          type="url"
          required
          placeholder="Paste YouTube, Instagram, X (Twitter), or Web Article link..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full py-4 pl-6 pr-32 text-gray-800 placeholder-gray-400 focus:outline-none text-base"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Analyze
            </>
          )}
        </button>
      </div>
    </form>
  );
}