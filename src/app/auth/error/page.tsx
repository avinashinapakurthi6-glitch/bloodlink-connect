"use client"

import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-white pl-72 p-8 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6 border border-red-100">
          <span className="text-4xl">⚠️</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Authentication Failed</h1>
        <p className="text-slate-600 mb-6">
          There was an error signing you in. Please try again.
        </p>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}
