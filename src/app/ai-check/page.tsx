"use client";

import React, { useState, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import { FileCheck, Upload, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

export default function AICheckPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    eligible: boolean;
    confidence: number;
    findings: string[];
    recommendations: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const analyzeReport = async () => {
    if (!file) return;
    setAnalyzing(true);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const mockResults = [
      {
        eligible: true,
        confidence: 92,
        findings: [
          "Hemoglobin levels: 14.2 g/dL (Normal range: 12-17 g/dL)",
          "Blood pressure: 120/80 mmHg (Normal)",
          "No infectious disease markers detected",
          "Platelet count: 250,000/μL (Normal range: 150,000-400,000/μL)",
        ],
        recommendations: [
          "You are eligible to donate blood",
          "Next eligible donation date: 3 months from last donation",
          "Maintain healthy diet before donation",
        ],
      },
      {
        eligible: false,
        confidence: 88,
        findings: [
          "Hemoglobin levels: 10.5 g/dL (Below normal range)",
          "Iron deficiency indicators present",
          "Recent medication traces detected",
        ],
        recommendations: [
          "Consult with a healthcare provider about iron supplements",
          "Wait at least 4 weeks after completing medication",
          "Retest hemoglobin levels before donation attempt",
        ],
      },
    ];

    setResult(mockResults[Math.random() > 0.5 ? 0 : 1]);
    setAnalyzing(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Medical Report Check</h1>
            <p className="text-sm text-gray-500">Upload your medical report for AI analysis</p>
          </div>
        </header>

        <div className="p-8 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileCheck className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI-Powered Analysis</h2>
                <p className="text-purple-100">Get instant eligibility assessment from your medical reports</p>
              </div>
            </div>
          </div>

          {!result ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {file ? file.name : "Upload Medical Report"}
                </h3>
                <p className="text-sm text-gray-500">
                  Drag and drop or click to upload (PDF, JPG, PNG)
                </p>
              </div>

              {file && (
                <button
                  onClick={analyzeReport}
                  disabled={analyzing}
                  className="w-full mt-6 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Analyzing Report...
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-5 w-5" />
                      Analyze with AI
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`p-6 ${result.eligible ? "bg-green-50" : "bg-red-50"}`}>
                <div className="flex items-center gap-4">
                  {result.eligible ? (
                    <CheckCircle className="h-12 w-12 text-green-600" />
                  ) : (
                    <XCircle className="h-12 w-12 text-red-600" />
                  )}
                  <div>
                    <h3 className={`text-2xl font-bold ${result.eligible ? "text-green-700" : "text-red-700"}`}>
                      {result.eligible ? "Likely Eligible" : "May Not Be Eligible"}
                    </h3>
                    <p className="text-sm text-gray-600">AI Confidence: {result.confidence}%</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-b border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Key Findings
                </h4>
                <ul className="space-y-2">
                  {result.findings.map((finding, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-4">
                  Note: This AI analysis is for informational purposes only. Please consult with a healthcare professional for final eligibility determination.
                </p>
                <button
                  onClick={() => {
                    setFile(null);
                    setResult(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Analyze Another Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ChatBotTrigger />
    </div>
  );
}
