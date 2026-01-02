"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import { supabase } from "@/lib/supabase/client";
import { Droplet, Plus, Minus, MapPin, AlertTriangle } from "lucide-react";
import { toast, Toaster } from "sonner";

interface InventoryItem {
  id: string;
  blood_type: string;
  units: number;
  location: string;
  updated_at: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("blood_type");

    if (!error && data) {
      setInventory(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const updateUnits = async (id: string, change: number) => {
    const item = inventory.find((i) => i.id === id);
    if (!item) return;
    
    const newUnits = Math.max(0, item.units + change);
    const { error } = await supabase
      .from("inventory")
      .update({ units: newUnits, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      fetchInventory();
      toast.success(`Inventory updated: ${item.blood_type} now has ${newUnits} units`);
    }
  };

  const getStatusColor = (units: number) => {
    if (units <= 5) return "bg-red-500";
    if (units <= 15) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusText = (units: number) => {
    if (units <= 5) return "Critical";
    if (units <= 15) return "Low";
    return "Adequate";
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Toaster position="top-center" />
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Blood Bank Inventory</h1>
            <p className="text-sm text-gray-500">Manage blood unit stocks across locations</p>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => {
              const total = inventory
                .filter((i) => i.blood_type === type)
                .reduce((sum, i) => sum + i.units, 0);
              return (
                <div key={type} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-5 w-5 text-red-600 fill-red-600" />
                      <span className="font-bold text-lg text-gray-900">{type}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${getStatusColor(total)}`}>
                      {getStatusText(total)}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{total}</div>
                  <p className="text-sm text-gray-500">units available</p>
                </div>
              );
            })}
          </div>

          {inventory.some((i) => i.units <= 5) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">Low Stock Alert</h3>
                <p className="text-sm text-red-700">
                  Some blood types are critically low. Please consider requesting donations.
                </p>
              </div>
            </div>
          )}

          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Location</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Blood Type</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Units</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Droplet className="h-4 w-4 text-red-600 fill-red-600" />
                          <span className="font-bold text-gray-900">{item.blood_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {item.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xl font-bold text-gray-900">{item.units}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full text-white ${getStatusColor(item.units)}`}>
                          {getStatusText(item.units)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateUnits(item.id, -1)}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => updateUnits(item.id, 1)}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <ChatBotTrigger />
    </div>
  );
}
