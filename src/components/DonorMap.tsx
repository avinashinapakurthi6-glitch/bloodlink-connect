"use client"

import { APIProvider, Map, AdvancedMarker, InfoWindow, useAdvancedMarkerRef, useMap } from '@vis.gl/react-google-maps'
import { useState, useEffect } from 'react'

interface Donor {
  id: string
  full_name: string
  blood_type: string
  city: string
  latitude: number
  longitude: number
  is_available: boolean
}

interface DonorMapProps {
  donors: Donor[]
  center?: { lat: number; lng: number }
  onMarkerClick?: (donor: Donor) => void
}

const BLOOD_COLORS: Record<string, string> = {
  'A+': '#ef4444', 'A-': '#f97316', 'B+': '#eab308', 'B-': '#22c55e',
  'AB+': '#3b82f6', 'AB-': '#8b5cf6', 'O+': '#ec4899', 'O-': '#06b6d4'
}

export default function DonorMap({ donors, center, onMarkerClick }: DonorMapProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <MapContent donors={donors} center={center} onMarkerClick={onMarkerClick} />
    </APIProvider>
  )
}

function MapContent({ donors, center, onMarkerClick }: DonorMapProps) {
  const map = useMap()
  const [selectedDonorId, setSelectedDonorId] = useState<string | null>(null)
  
  const selectedDonor = donors.find(d => d.id === selectedDonorId)
  const validDonors = donors.filter(d => d.latitude && d.longitude)
  
  const defaultCenter = { lat: 20.5937, lng: 78.9629 }
  const initialCenter = center || (validDonors.length > 0 
    ? { lat: Number(validDonors[0].latitude), lng: Number(validDonors[0].longitude) }
    : defaultCenter)

  useEffect(() => {
    if (!map) return

    if (center) {
      map.panTo(center)
      map.setZoom(13)
      return
    }

    if (validDonors.length === 0) return

    const bounds = new google.maps.LatLngBounds()
    validDonors.forEach(donor => {
      bounds.extend({ lat: Number(donor.latitude), lng: Number(donor.longitude) })
    })

    if (validDonors.length === 1) {
      map.setCenter(bounds.getCenter())
      map.setZoom(12)
    } else {
      map.fitBounds(bounds, 50)
    }
  }, [map, donors, center])

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-slate-200 mb-8 shadow-sm relative">
      <Map
        defaultCenter={initialCenter}
        defaultZoom={5}
        mapId="DONOR_MAP_ID"
        gestureHandling={'greedy'}
        disableDefaultUI={false}
      >
        {validDonors.map(donor => (
          <DonorMarker 
            key={donor.id} 
            donor={donor} 
            onClick={() => {
              setSelectedDonorId(donor.id)
              onMarkerClick?.(donor)
            }}
          />
        ))}

        {selectedDonor && (
          <InfoWindow
            position={{ lat: Number(selectedDonor.latitude), lng: Number(selectedDonor.longitude) }}
            onCloseClick={() => setSelectedDonorId(null)}
          >
            <div className="p-2 min-w-[150px]">
              <div className="flex items-center justify-between mb-2 gap-4">
                <span className="font-bold text-slate-900 whitespace-nowrap">{selectedDonor.full_name}</span>
                <span 
                  className="px-2 py-0.5 rounded text-[10px] font-bold"
                  style={{ backgroundColor: `${BLOOD_COLORS[selectedDonor.blood_type]}15`, color: BLOOD_COLORS[selectedDonor.blood_type] }}
                >
                  {selectedDonor.blood_type}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">{selectedDonor.city}</p>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${selectedDonor.is_available ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-[10px] text-slate-600">
                  {selectedDonor.is_available ? 'Available' : 'Recently Donated'}
                </span>
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>
      
      {validDonors.length === 0 && (
        <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center p-6">
            <p className="text-slate-600 font-medium">No donors with location data found</p>
            <p className="text-sm text-slate-400">Try adjusting your filters or search city</p>
          </div>
        </div>
      )}
    </div>
  )
}

function DonorMarker({ donor, onClick }: { donor: Donor, onClick: () => void }) {
  const [markerRef, marker] = useAdvancedMarkerRef()

  return (
    <AdvancedMarker
      ref={markerRef}
      position={{ lat: Number(donor.latitude), lng: Number(donor.longitude) }}
      onClick={onClick}
      title={donor.full_name}
    >
      <div className="relative flex items-center justify-center">
        <div 
          className="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs transform hover:scale-110 transition-transform cursor-pointer"
          style={{ backgroundColor: BLOOD_COLORS[donor.blood_type] || '#ef4444' }}
        >
          {donor.blood_type}
        </div>
        {donor.is_available && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
    </AdvancedMarker>
  )
}
