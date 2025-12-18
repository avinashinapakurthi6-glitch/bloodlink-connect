"use client"

import { useEffect, useState } from 'react'

interface QueueEntry {
  id: string
  queue_number: number
  appointment_date: string
  appointment_time: string | null
  status: string
  check_in_time: string | null
  completed_time: string | null
  users: { full_name: string; blood_type: string; phone: string } | null
  hospitals: { name: string } | null
}

interface QueueStats {
  total: number
  waiting: number
  in_progress: number
  completed: number
}

interface Hospital {
  id: string
  name: string
  city: string
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueEntry[]>([])
  const [stats, setStats] = useState<QueueStats>({ total: 0, waiting: 0, in_progress: 0, completed: 0 })
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [selectedHospital, setSelectedHospital] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHospitals()
  }, [])

  useEffect(() => {
    fetchQueue()
  }, [selectedHospital, selectedDate])

  const fetchHospitals = async () => {
    try {
      const res = await fetch('/api/hospitals?has_blood_bank=true')
      const data = await res.json()
      setHospitals(data.hospitals || [])
    } catch (error) {
      console.error('Failed to fetch hospitals:', error)
    }
  }

  const fetchQueue = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (selectedHospital) params.append('hospital_id', selectedHospital)
    params.append('date', selectedDate)

    try {
      const res = await fetch(`/api/queue?${params}`)
      const data = await res.json()
      setQueue(data.queue || [])
      setStats(data.stats || { total: 0, waiting: 0, in_progress: 0, completed: 0 })
    } catch (error) {
      console.error('Failed to fetch queue:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/queue', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      fetchQueue()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'waiting': return 'bg-yellow-50 text-yellow-600 border-yellow-200'
        case 'in_progress': return 'bg-blue-50 text-blue-600 border-blue-200'
        case 'completed': return 'bg-green-50 text-green-600 border-green-200'
        default: return 'bg-slate-50 text-slate-600 border-slate-200'
      }
    }

    return (
      <div className="min-h-screen bg-white pl-72 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Hospital Queue</h1>
            <p className="text-slate-600">Manage and track donor appointments at blood banks</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-slate-500 text-sm">Total Today</div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600">{stats.waiting}</div>
              <div className="text-yellow-600/70 text-sm font-medium">Waiting</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{stats.in_progress}</div>
              <div className="text-blue-600/70 text-sm font-medium">In Progress</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-green-600/70 text-sm font-medium">Completed</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 mb-6 shadow-sm">
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedHospital}
                onChange={e => setSelectedHospital(e.target.value)}
                className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 outline-none min-w-[200px] transition-colors"
              >
                <option value="">All Hospitals</option>
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name} - {h.city}</option>
                ))}
              </select>

              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-red-500 outline-none transition-colors"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-pulse text-red-500">Loading queue...</div>
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map(entry => (
                <div key={entry.id} className="bg-white rounded-xl p-6 border border-slate-200 flex items-center justify-between shadow-sm hover:border-slate-300 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
                      <span className="text-2xl font-bold text-red-600">#{entry.queue_number}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{entry.users?.full_name || 'Unknown'}</h3>
                      <p className="text-slate-600 text-sm">
                        {entry.users?.blood_type} • {entry.hospitals?.name}
                      </p>
                      {entry.appointment_time && (
                        <p className="text-slate-500 text-xs mt-1">Scheduled: {entry.appointment_time}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(entry.status)}`}>
                      {entry.status.replace('_', ' ').toUpperCase()}
                    </span>

                    {entry.status === 'waiting' && (
                      <button
                        onClick={() => updateStatus(entry.id, 'in_progress')}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
                      >
                        Start
                      </button>
                    )}
                    {entry.status === 'in_progress' && (
                      <button
                        onClick={() => updateStatus(entry.id, 'completed')}
                        className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors shadow-sm"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {queue.length === 0 && (
                <div className="text-center py-20 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                  No appointments for this date
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
