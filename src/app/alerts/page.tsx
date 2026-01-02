"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import { BellRing, AlertTriangle, Droplet, MapPin, TrendingDown } from "lucide-react";
import { useDataFetch } from "@/hooks/useDataFetch";
import { alertService, Alert } from "@/services/api";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-500";
    case "low":
      return "bg-yellow-500";
    default:
      return "bg-green-500";
  }
};

const getSeverityBg = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-50 border-red-200";
    case "low":
      return "bg-yellow-50 border-yellow-200";
    default:
      return "bg-green-50 border-green-200";
  }
};

export default function AlertsPage() {
  const { data: alerts = [], loading, error, refetch } = useDataFetch(() =>
    alertService.fetchAlerts()
  );

  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const lowAlerts = alerts.filter((a) => a.severity === "low");

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Shortage Alerts</h1>
            <p className="text-sm text-gray-500">Monitor blood type shortages in real-time</p>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <BellRing className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Blood Shortage Monitor</h2>
                <p className="text-orange-100">
                  {criticalAlerts.length} critical alerts, {lowAlerts.length} low stock warnings
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {BLOOD_TYPES.map((type) => {
              const alert = alerts.find((a) => a.blood_type === type);
              const severity = alert?.severity || "normal";
              return (
                <div key={type} className={`rounded-xl border p-4 ${getSeverityBg(severity)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-red-600 fill-red-600" />
                      <span className="font-bold text-lg">{type}</span>
                    </div>
                    <span className={`h-3 w-3 rounded-full ${getSeverityColor(severity)}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{alert?.units || 20}+</div>
                  <p className="text-xs text-gray-500 capitalize">{severity} stock</p>
                </div>
              );
            })}
          </div>

          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Active Alerts
          </h3>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <p className="text-sm text-red-600">Failed to load alerts: {error.message}</p>
              <button
                onClick={refetch}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : alerts.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplet className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">All Clear!</h3>
              <p className="text-sm text-green-600">All blood types have adequate stock levels.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border p-6 ${getSeverityBg(alert.severity)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                        alert.severity === "critical" ? "bg-red-100" : "bg-yellow-100"
                      }`}>
                        <TrendingDown className={`h-7 w-7 ${
                          alert.severity === "critical" ? "text-red-600" : "text-yellow-600"
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-lg text-gray-900">{alert.blood_type}</span>
                          <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                            alert.severity === "critical" 
                              ? "bg-red-600 text-white" 
                              : "bg-yellow-500 text-white"
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Only {alert.units} units remaining</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {alert.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                      Request Donation
                    </button>
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
