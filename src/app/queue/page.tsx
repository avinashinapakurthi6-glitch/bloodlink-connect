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
      case 'waiting': return 'bg-yellow-500/20 text-yellow-400'
      case 'in_progress': return 'bg-blue-500/20 text-blue-400'
      case 'completed': return 'bg-green-500/20 text-green-400'
      default: return 'bg-slate-500/20 text-slate-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 pl-72 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Hospital Queue</h1>
          <p className="text-slate-400">Manage and track donor appointments at blood banks</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-slate-400">Total Today</div>
          </div>
          <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
            <div className="text-3xl font-bold text-yellow-400">{stats.waiting}</div>
            <div className="text-yellow-400/70">Waiting</div>
          </div>
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
            <div className="text-3xl font-bold text-blue-400">{stats.in_progress}</div>
            <div className="text-blue-400/70">In Progress</div>
          </div>
          <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
            <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
            <div className="text-green-400/70">Completed</div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-6 border border-slate-800 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedHospital}
              onChange={e => setSelectedHospital(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none min-w-[200px]"
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
              className="px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-red-500 outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-red-400">Loading queue...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map(entry => (
              <div key={entry.id} className="bg-slate-900/80 backdrop-blur rounded-xl p-6 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-red-400">#{entry.queue_number}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{entry.users?.full_name || 'Unknown'}</h3>
                    <p className="text-slate-400 text-sm">
                      {entry.users?.blood_type} • {entry.hospitals?.name}
                    </p>
                    {entry.appointment_time && (
                      <p className="text-slate-500 text-sm">Scheduled: {entry.appointment_time}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(entry.status)}`}>
                    {entry.status.replace('_', ' ').toUpperCase()}
                  </span>

                  {entry.status === 'waiting' && (
                    <button
                      onClick={() => updateStatus(entry.id, 'in_progress')}
                      className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                    >
                      Start
                    </button>
                  )}
                  {entry.status === 'in_progress' && (
                    <button
                      onClick={() => updateStatus(entry.id, 'completed')}
                      className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
            {queue.length === 0 && (
              <div className="text-center py-20 text-slate-500">
                No appointments for this date
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
