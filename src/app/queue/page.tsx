"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import { supabase } from "@/lib/supabase/client";
import { Clock, User, Droplet, CheckCircle, Circle, Loader2 } from "lucide-react";

interface QueueItem {
  id: string;
  patient_name: string;
  blood_type: string;
  hospital: string;
  position: number;
  status: string;
  created_at: string;
}

export default function QueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = async () => {
    const { data, error } = await supabase
      .from("queue")
      .select("*")
      .order("position");

    if (!error && data) {
      setQueue(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700";
      case "in_progress":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Hospital Queue</h1>
            <p className="text-sm text-gray-500">Track blood request processing order</p>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Loader2 className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">In Progress</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {queue.filter((q) => q.status === "in_progress").length}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <span className="text-sm text-gray-500">Waiting</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {queue.filter((q) => q.status === "waiting").length}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">Completed</span>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {queue.filter((q) => q.status === "completed").length}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map((item, index) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-6 ${
                    item.status === "in_progress" ? "border-blue-200 bg-blue-50/30" : "border-gray-100"
                  }`}
                >
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xl text-gray-600">
                    {item.position}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{item.patient_name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Droplet className="h-3 w-3 text-red-500 fill-red-500" />
                        {item.blood_type}
                      </span>
                      <span>{item.hospital}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                      {item.status === "in_progress" ? "In Progress" : item.status === "completed" ? "Completed" : "Waiting"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <ChatBotTrigger />
    </div>
  );
}
