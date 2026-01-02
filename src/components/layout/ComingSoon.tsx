"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Hammer } from "lucide-react";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 ml-[280px] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <Hammer className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            This feature is currently under development. We're working hard to bring it to you soon!
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-8 px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
