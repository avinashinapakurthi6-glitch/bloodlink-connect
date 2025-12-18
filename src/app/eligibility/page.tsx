"use client"

import { useState } from 'react'

interface EligibilityResult {
  eligible: boolean
  reasons: string[]
}

export default function EligibilityPage() {
  const [formData, setFormData] = useState({
    age: '',
    weight_kg: '',
    hemoglobin: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    pulse_rate: '',
    temperature: '',
    has_recent_illness: false,
    has_recent_surgery: false,
    has_tattoo_recently: false,
    is_pregnant: false,
    is_breastfeeding: false,
    on_medication: false
  })
  const [result, setResult] = useState<EligibilityResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : undefined,
      hemoglobin: formData.hemoglobin ? parseFloat(formData.hemoglobin) : undefined,
      blood_pressure_systolic: formData.blood_pressure_systolic ? parseInt(formData.blood_pressure_systolic) : undefined,
      blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseInt(formData.blood_pressure_diastolic) : undefined,
      pulse_rate: formData.pulse_rate ? parseInt(formData.pulse_rate) : undefined,
      temperature: formData.temperature ? parseFloat(formData.temperature) : undefined
    }

    try {
      const res = await fetch('/api/health-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      setResult({ eligible: data.eligible, reasons: data.reasons })
    } catch {
      setResult({ eligible: false, reasons: ['Failed to check eligibility. Please try again.'] })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckboxChange = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }))
  }

    return (
      <div className="min-h-screen bg-white pl-72 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-4">
              <span className="text-5xl">✓</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Eligibility Checker</h1>
            <p className="text-slate-600">Check if you&apos;re eligible to donate blood based on health criteria</p>
          </div>

          {result && (
            <div className={`mb-8 p-6 rounded-2xl border ${result.eligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{result.eligible ? '✅' : '❌'}</span>
                <div>
                  <h2 className={`text-2xl font-bold ${result.eligible ? 'text-green-600' : 'text-red-600'}`}>
                    {result.eligible ? 'You Are Eligible!' : 'Not Eligible Currently'}
                  </h2>
                  <p className="text-slate-600">
                    {result.eligible ? 'You meet all the criteria to donate blood.' : 'Please review the issues below.'}
                  </p>
                </div>
              </div>
              {result.reasons.length > 0 && !result.eligible && (
                <ul className="space-y-2">
                  {result.reasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-red-600">
                      <span className="text-red-400">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Age (years)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={e => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 outline-none transition-colors"
                  placeholder="e.g., 25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight_kg}
                  onChange={e => setFormData({ ...formData, weight_kg: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 outline-none transition-colors"
                  placeholder="e.g., 65"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-2">Health Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hemoglobin (g/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.hemoglobin}
                  onChange={e => setFormData({ ...formData, hemoglobin: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 outline-none transition-colors"
                  placeholder="e.g., 14.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Blood Pressure (Systolic)</label>
                <input
                  type="number"
                  value={formData.blood_pressure_systolic}
                  onChange={e => setFormData({ ...formData, blood_pressure_systolic: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 outline-none transition-colors"
                  placeholder="e.g., 120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Blood Pressure (Diastolic)</label>
                <input
                  type="number"
                  value={formData.blood_pressure_diastolic}
                  onChange={e => setFormData({ ...formData, blood_pressure_diastolic: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 outline-none transition-colors"
                  placeholder="e.g., 80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pulse Rate (bpm)</label>
                <input
                  type="number"
                  value={formData.pulse_rate}
                  onChange={e => setFormData({ ...formData, pulse_rate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 outline-none transition-colors"
                  placeholder="e.g., 72"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={e => setFormData({ ...formData, temperature: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 outline-none transition-colors"
                  placeholder="e.g., 36.8"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-2">Health Conditions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { key: 'has_recent_illness', label: 'Recent illness (past 2 weeks)' },
                { key: 'has_recent_surgery', label: 'Recent surgery (past 6 months)' },
                { key: 'has_tattoo_recently', label: 'Got tattoo recently (past 6 months)' },
                { key: 'is_pregnant', label: 'Currently pregnant' },
                { key: 'is_breastfeeding', label: 'Currently breastfeeding' },
                { key: 'on_medication', label: 'Currently on medication' }
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:border-red-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData[item.key as keyof typeof formData] as boolean}
                    onChange={() => handleCheckboxChange(item.key)}
                    className="w-5 h-5 rounded border-slate-300 text-red-500 focus:ring-red-500 bg-white"
                  />
                  <span className="text-slate-700 font-medium">{item.label}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Eligibility'}
            </button>
          </form>
        </div>
      </div>
    )
  }
