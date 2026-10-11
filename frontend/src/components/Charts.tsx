"use client";
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface ChartsProps {
  sentiment: { positive: number; neutral: number; negative: number };
  emotions: { joy: number; frustration: number; excitement: number; skepticism: number };
}

export default function Charts({ sentiment, emotions }: ChartsProps) {
  const donutData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [sentiment.positive, sentiment.neutral, sentiment.negative],
        backgroundColor: ["#10B981", "#6B7280", "#EF4444"],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: Object.keys(emotions).map((e) => e.toUpperCase()),
    datasets: [
      {
        label: "Intensity Score (%)",
        data: Object.values(emotions),
        backgroundColor: ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 my-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sentiment Breakdown</h3>
        <div className="w-64 h-64">
          <Doughnut data={donutData} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Audience Emotion Spectrum</h3>
        <div className="w-full h-64">
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}