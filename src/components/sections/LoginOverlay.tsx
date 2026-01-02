"use client";

import React from "react";
import { Heart, Bot } from "lucide-react";

/**
 * LoginOverlay Component
 * 
 * A pixel-perfect clone of the centered authentication card based on the 
 * provided HTML structure and computed styles.
 */
const LoginOverlay: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4 font-sans">
      {/* Auth Card Container */}
      <div 
        className="bg-white text-[#111827] flex flex-col gap-6 rounded-xl border border-[#E5E7EB] py-6 shadow-sm max-w-md w-full"
        style={{
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
          borderRadius: "14px"
        }}
      >
        {/* Card Header */}
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 text-center">
          {/* Main Rounded Red Heart Icon */}
          <div 
            className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "oklch(0.936 0.032 17.717)" }}
          >
            <Heart 
              size={32} 
              className="text-[#DC2626]" 
              fill="currentColor"
              style={{ color: "oklch(0.577 0.245 27.325)" }}
            />
          </div>
          
          <h1 className="font-semibold text-2xl tracking-tight text-[#111827]">
            Welcome Back
          </h1>
          <p className="text-[#6B7280] text-sm leading-tight">
            Sign in to access the blood donation system
          </p>
        </div>

        {/* Card Content / Form Area */}
        <div className="px-6">
          <form 
            className="space-y-4" 
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Email Field */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="flex items-center gap-2 text-sm leading-none font-medium select-none text-[#111827]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="flex h-9 w-full rounded-md border border-[#E5E7EB] bg-transparent px-3 py-2 text-sm shadow-xs transition-shadow outline-none focus-visible:border-[#DC2626] focus-visible:ring-[#DC2626]/50 focus-visible:ring-[3px] placeholder:text-[#6B7280]"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="flex items-center gap-2 text-sm leading-none font-medium select-none text-[#111827]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="flex h-9 w-full rounded-md border border-[#E5E7EB] bg-transparent px-3 py-2 text-sm shadow-xs transition-shadow outline-none focus-visible:border-[#DC2626] focus-visible:ring-[#DC2626]/50 focus-visible:ring-[3px]"
                required
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2 pb-2">
              <div className="relative flex items-center h-4 w-4">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="peer size-4 shrink-0 rounded-[4px] border border-[#E5E7EB] appearance-none checked:bg-[#DC2626] checked:border-[#DC2626] focus-visible:ring-[3px] focus-visible:ring-[#DC2626]/50 transition-all cursor-pointer"
                />
                <svg
                  className="absolute pointer-events-none hidden peer-checked:block w-3 h-3 text-white left-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <label 
                htmlFor="rememberMe" 
                className="text-sm font-normal cursor-pointer select-none text-[#111827]"
              >
                Remember me
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#DC2626]/50"
              style={{ backgroundColor: "oklch(0.577 0.245 27.325)" }}
            >
              Sign In
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-[#6B7280]">Don't have an account? </span>
            <a 
              href="/register" 
              className="text-[#DC2626] hover:underline font-medium transition-standard"
            >
              Register now
            </a>
          </div>
        </div>
      </div>

      {/* Persistent AI Helper Button */}
      <button 
        className="inline-flex items-center justify-center size-16 fixed bottom-6 right-6 rounded-full shadow-floating bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-50 animate-bounce transition-all text-white focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-blue-600/50"
        aria-label="AI Helper"
      >
        <Bot size={32} />
      </button>
    </div>
  );
};

export default LoginOverlay;