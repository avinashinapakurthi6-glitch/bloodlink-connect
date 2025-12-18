"use client"

import { useEffect, useState } from 'react'

interface Event {
  id: string
  title: string
  description: string
  event_type: string
  address: string
  city: string
  start_date: string
  end_date: string | null
  max_participants: number | null
  current_participants: number
  is_active: boolean
  hospitals: { name: string } | null
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [filter])

  const fetchEvents = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter) params.append('event_type', filter)

    try {
      const res = await fetch(`/api/events?${params}`)
      const data = await res.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'donation_camp': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'emergency_drive': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'special_event': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'donation_camp': return 'Donation Camp'
      case 'emergency_drive': return 'Emergency Drive'
      case 'special_event': return 'Special Event'
      default: return type
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 pl-72 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Events & Camps</h1>
          <p className="text-slate-400">Discover blood donation events in your area</p>
        </div>

        <div className="flex gap-3 mb-6">
          {['', 'donation_camp', 'emergency_drive', 'special_event'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                filter === type 
                  ? 'bg-red-500 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {type === '' ? 'All Events' : getEventTypeLabel(type)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-red-400">Loading events...</div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-800 mb-6">
              <span className="text-5xl">📅</span>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No Events Found</h2>
            <p className="text-slate-400">Check back soon for upcoming blood donation events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} getTypeColor={getEventTypeColor} getTypeLabel={getEventTypeLabel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EventCard({ 
  event, 
  getTypeColor, 
  getTypeLabel 
}: { 
  event: Event
  getTypeColor: (type: string) => string
  getTypeLabel: (type: string) => string
}) {
  const startDate = new Date(event.start_date)
  const spotsLeft = event.max_participants ? event.max_participants - event.current_participants : null

  return (
    <div className="bg-slate-900/80 backdrop-blur rounded-2xl overflow-hidden border border-slate-800 hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-500/10">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(event.event_type)}`}>
            {getTypeLabel(event.event_type)}
          </span>
          {event.event_type === 'emergency_drive' && (
            <span className="animate-pulse text-red-400">🚨</span>
          )}
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">{event.title}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <span>📍</span>
            <span>{event.address}, {event.city}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>📅</span>
            <span>{startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          {spotsLeft !== null && (
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span className={spotsLeft < 20 ? 'text-yellow-400' : 'text-slate-400'}>
                {spotsLeft} spots left
              </span>
            </div>
          )}
        </div>

        <button className="mt-6 w-full py-3 rounded-xl bg-red-500/20 text-red-400 font-medium hover:bg-red-500/30 transition-colors">
          Register Now
        </button>
      </div>
    </div>
  )
}
