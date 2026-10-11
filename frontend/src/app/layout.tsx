import React from "react";
import "./globals.css";

export const metadata = {
  title: "LinkPulse_AI - Universal Sentiment Analytics",
  description: "AI-powered social media and web sentiment analysis dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}