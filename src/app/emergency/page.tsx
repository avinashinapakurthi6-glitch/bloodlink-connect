"use client"

import { useState } from 'react'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function EmergencyPage() {
  const [formData, setFormData] = useState({
    blood_type: '',
    units_needed: 1,
    patient_name: '',
    patient_age: '',
    reason: '',
    city: '',
    contact_phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; notified?: number } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/blood-requests/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          patient_age: formData.patient_age ? parseInt(formData.patient_age) : null
        })
      })

      const data = await res.json()
      
      if (res.ok) {
        setResult({
          success: true,
          message: 'Emergency request submitted successfully!',
          notified: data.notified_donors
        })
        setFormData({
          blood_type: '',
          units_needed: 1,
          patient_name: '',
          patient_age: '',
          reason: '',
          city: '',
          contact_phone: ''
        })
      } else {
        setResult({ success: false, message: data.error || 'Failed to submit request' })
      }
    } catch {
      setResult({ success: false, message: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

      return (
        <div className="h-screen bg-white lg:pl-64 p-4 sm:p-8 pt-20 lg:pt-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-4 animate-pulse">
              <span className="text-5xl">🚨</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Emergency SOS</h1>
            <p className="text-slate-600">Submit an urgent blood request - compatible donors will be notified immediately</p>
          </div>

          {result && (
            <div className={`mb-6 p-4 rounded-xl ${result.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              <p className="font-medium">{result.message}</p>
              {result.notified !== undefined && (
                <p className="mt-1 text-sm">{result.notified} compatible donors have been notified.</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-red-100 shadow-xl shadow-red-500/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Blood Type Required *</label>
                <select
                  required
                  value={formData.blood_type}
                  onChange={e => setFormData({ ...formData, blood_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors"
                >
                  <option value="">Select blood type</option>
                  {BLOOD_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Units Needed *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={10}
                  value={formData.units_needed}
                  onChange={e => setFormData({ ...formData, units_needed: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Patient Name</label>
                <input
                  type="text"
                  value={formData.patient_name}
                  onChange={e => setFormData({ ...formData, patient_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors"
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Patient Age</label>
                <input
                  type="number"
                  value={formData.patient_age}
                  onChange={e => setFormData({ ...formData, patient_age: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors"
                  placeholder="Enter patient age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.contact_phone}
                  onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors"
                  placeholder="+91-XXXXXXXXXX"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Reason / Details</label>
                <textarea
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors resize-none"
                  placeholder="Describe the emergency situation..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <span className="text-xl">🚨</span>
                  Submit Emergency Request
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }
