"use client";

import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import { CheckCircle, XCircle, AlertCircle, Stethoscope } from "lucide-react";

const questions = [
  { id: 1, question: "Are you between 18-65 years old?", critical: true },
  { id: 2, question: "Do you weigh at least 50 kg (110 lbs)?", critical: true },
  { id: 3, question: "Have you had any illness in the past 2 weeks?", critical: true, invert: true },
  { id: 4, question: "Are you currently taking any medications?", critical: false, invert: true },
  { id: 5, question: "Have you donated blood in the last 3 months?", critical: true, invert: true },
  { id: 6, question: "Do you have any chronic diseases (diabetes, heart disease)?", critical: true, invert: true },
  { id: 7, question: "Have you had any tattoos or piercings in the last 6 months?", critical: false, invert: true },
  { id: 8, question: "Is your blood pressure within normal range?", critical: true },
  { id: 9, question: "Have you consumed alcohol in the last 24 hours?", critical: false, invert: true },
  { id: 10, question: "Are you feeling healthy and well today?", critical: true },
];

export default function EligibilityPage() {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (id: number, answer: boolean) => {
    setAnswers({ ...answers, [id]: answer });
  };

  const calculateEligibility = () => {
    let eligible = true;
    let warnings: string[] = [];

    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer === null || answer === undefined) return;

      const isGood = q.invert ? !answer : answer;
      if (q.critical && !isGood) {
        eligible = false;
      } else if (!q.critical && !isGood) {
        warnings.push(q.question);
      }
    });

    return { eligible, warnings };
  };

  const checkEligibility = () => {
    setShowResult(true);
  };

  const { eligible, warnings } = calculateEligibility();
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Health Eligibility Check</h1>
            <p className="text-sm text-gray-500">Check if you're eligible to donate blood</p>
          </div>
        </header>

        <div className="p-8 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Stethoscope className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Quick Eligibility Assessment</h2>
                <p className="text-blue-100">Answer these questions to check your donation eligibility</p>
              </div>
            </div>
          </div>

          {!showResult ? (
            <>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                {questions.map((q, index) => (
                  <div key={q.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <p className="text-gray-900 font-medium mb-4">
                      {index + 1}. {q.question}
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleAnswer(q.id, true)}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                          answers[q.id] === true
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleAnswer(q.id, false)}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                          answers[q.id] === false
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={checkEligibility}
                disabled={!allAnswered}
                className="w-full mt-6 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check My Eligibility
              </button>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              {eligible ? (
                <>
                  <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">You're Eligible!</h3>
                  <p className="text-gray-600 mb-6">
                    Based on your answers, you appear to be eligible to donate blood. Please visit a blood bank for final confirmation.
                  </p>
                  {warnings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left mb-6">
                      <div className="flex items-center gap-2 text-yellow-800 font-semibold mb-2">
                        <AlertCircle className="h-5 w-5" />
                        Minor Concerns
                      </div>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {warnings.map((w, i) => (
                          <li key={i}>• {w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-600 mb-2">Not Eligible Currently</h3>
                  <p className="text-gray-600 mb-6">
                    Based on your answers, you may not be eligible to donate blood at this time. Please consult with a healthcare professional.
                  </p>
                </>
              )}
              <button
                onClick={() => {
                  setShowResult(false);
                  setAnswers({});
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Take Again
              </button>
            </div>
          )}
        </div>
      </div>
      <ChatBotTrigger />
    </div>
  );
}
