"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import { supabase } from "@/lib/supabase/client";
import { MapPin, Navigation, Hospital, Droplet, Phone } from "lucide-react";

interface Location {
  id: string;
  name: string;
  type: "hospital" | "blood_bank" | "donor";
  blood_types?: string[];
  address: string;
  lat: number;
  lng: number;
  phone?: string;
}

const mockLocations: Location[] = [
  { id: "1", name: "City Hospital Blood Bank", type: "blood_bank", blood_types: ["A+", "O-", "B+"], address: "123 Main St, Mumbai", lat: 19.076, lng: 72.877, phone: "9876543210" },
  { id: "2", name: "Apollo Hospital", type: "hospital", address: "456 Park Ave, Delhi", lat: 28.704, lng: 77.102, phone: "9123456789" },
  { id: "3", name: "Red Cross Center", type: "blood_bank", blood_types: ["O+", "AB+", "A-"], address: "789 Gandhi Rd, Bangalore", lat: 12.971, lng: 77.594, phone: "9988776655" },
  { id: "4", name: "Fortis Healthcare", type: "hospital", address: "321 Health Blvd, Chennai", lat: 13.082, lng: 80.270, phone: "9112233445" },
  { id: "5", name: "Rahul Sharma (Donor)", type: "donor", address: "Sector 15, Gurgaon", lat: 28.459, lng: 77.026, blood_types: ["B+"], phone: "9812345678" },
];

export default function MapPage() {
  const [locations] = useState<Location[]>(mockLocations);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filter, setFilter] = useState<"all" | "hospital" | "blood_bank" | "donor">("all");

  const filteredLocations = locations.filter(
    (loc) => filter === "all" || loc.type === filter
  );

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Map Tracking</h1>
            <p className="text-sm text-gray-500">Find nearby blood banks and hospitals</p>
          </div>
          <div className="flex gap-2">
            {[
              { value: "all", label: "All" },
              { value: "hospital", label: "Hospitals" },
              { value: "blood_bank", label: "Blood Banks" },
              { value: "donor", label: "Donors" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === opt.value
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </header>

        <div className="flex h-[calc(100vh-64px)]">
          <div className="w-[400px] border-r border-gray-200 overflow-y-auto bg-white">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                />
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedLocation?.id === loc.id ? "bg-red-50 border-l-4 border-red-600" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      loc.type === "hospital" ? "bg-blue-100" : 
                      loc.type === "donor" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {loc.type === "hospital" ? (
                        <Hospital className="h-5 w-5 text-blue-600" />
                      ) : loc.type === "donor" ? (
                        <MapPin className="h-5 w-5 text-green-600" />
                      ) : (
                        <Droplet className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{loc.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{loc.address}</p>
                      {loc.blood_types && (
                        <div className="flex gap-1 mt-2">
                          {loc.blood_types.map((bt) => (
                            <span key={bt} className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded-full font-medium">
                              {bt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-gray-100 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="h-24 w-24 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4">
                  <Navigation className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Map</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Select a location from the list to view details. In production, this would display an interactive map with real-time tracking.
                </p>
              </div>
            </div>

            {selectedLocation && (
              <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      selectedLocation.type === "hospital" ? "bg-blue-100" : 
                      selectedLocation.type === "donor" ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {selectedLocation.type === "hospital" ? (
                        <Hospital className="h-6 w-6 text-blue-600" />
                      ) : selectedLocation.type === "donor" ? (
                        <MapPin className="h-6 w-6 text-green-600" />
                      ) : (
                        <Droplet className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{selectedLocation.name}</h3>
                      <p className="text-sm text-gray-500">{selectedLocation.address}</p>
                    </div>
                  </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`;
                          window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
                        }}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <Navigation className="h-4 w-4" /> Directions
                      </button>
                      {selectedLocation.phone && (
                        <button
                          onClick={() => {
                            const url = `tel:${selectedLocation.phone}`;
                            window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url } }, "*");
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" /> Call
                        </button>
                      )}
                    </div>
                </div>
                {selectedLocation.blood_types && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-2">Available Blood Types:</p>
                    <div className="flex gap-2">
                      {selectedLocation.blood_types.map((bt) => (
                        <span key={bt} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg font-bold text-sm">
                          {bt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ChatBotTrigger />
    </div>
  );
}
