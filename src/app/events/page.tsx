"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import { supabase } from "@/lib/supabase/client";
import { CalendarDays, MapPin, Clock, Users, ChevronRight } from "lucide-react";
import { toast, Toaster } from "sonner";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  organizer: string;
  status: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date");

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    }

    fetchEvents();
  }, []);

  const registerForEvent = (event: Event) => {
    toast.success(`Registered for "${event.title}"! You'll receive a confirmation email.`);
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Toaster position="top-center" />
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Donation Events</h1>
            <p className="text-sm text-gray-500">Find and register for blood donation camps</p>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <CalendarDays className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <p className="text-pink-100">
                  {events.filter((e) => e.status === "upcoming").length} events scheduled in your area
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex">
                    <div className="w-32 bg-gradient-to-br from-red-500 to-pink-500 flex flex-col items-center justify-center text-white p-4">
                      <span className="text-3xl font-bold">
                        {new Date(event.event_date).getDate()}
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(event.event_date).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-xs opacity-80">
                        {new Date(event.event_date).getFullYear()}
                      </span>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.start_time} - {event.end_time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {event.organizer}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => registerForEvent(event)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-1 shrink-0"
                        >
                          Register <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && events.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">No Events Scheduled</h3>
              <p className="text-sm text-gray-500">Check back later for upcoming donation events.</p>
            </div>
          )}
        </div>
      </div>
      <ChatBotTrigger />
    </div>
  );
}
