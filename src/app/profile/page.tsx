"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import { supabase } from "@/lib/supabase/client";
import { User, Droplet, MapPin, Phone, Mail, Calendar, Award, Edit2, Save } from "lucide-react";
import { toast, Toaster } from "sonner";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  blood_type: string;
  location: string;
  total_donations: number;
  last_donation: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Profile>>({});

  useEffect(() => {
    async function fetchProfile() {
      const storedEmail = localStorage.getItem("donor_email");
      if (!storedEmail) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", storedEmail)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setProfile(data[0]);
        setEditData(data[0]);
      }
      setLoading(false);
    }

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update(editData)
      .eq("id", profile.id);

    if (!error) {
      if (editData.email) {
        localStorage.setItem("donor_email", editData.email);
      }
      setProfile({ ...profile, ...editData } as Profile);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <Sidebar />
        <div className="flex-1 ml-[280px] flex items-center justify-center">
          <div className="animate-pulse text-gray-400 font-medium">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <Sidebar />
        <div className="flex-1 ml-[280px] flex flex-col items-center justify-center p-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-md">
            <div className="h-20 w-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Profile Found</h2>
            <p className="text-gray-500 mb-8">
              It looks like you haven't registered as a donor yet. Register now to start saving lives!
            </p>
            <a
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Toaster position="top-center" />
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Donor Profile</h1>
            <p className="text-sm text-gray-500">Manage your donor information</p>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" /> Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> Save Changes
            </button>
          )}
        </header>

        <div className="p-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 bg-white rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-red-600">
                  {profile?.name.split(" ").map((n) => n[0]).join("") || "JD"}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold">{profile?.name || "John Doe"}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Droplet className="h-4 w-4" /> {profile?.blood_type || "A+"}
                  </span>
                  <span className="text-red-100">Life Saver</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{profile?.total_donations || 0}</div>
              <p className="text-sm text-gray-500">Total Donations</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">
                {profile?.last_donation
                  ? new Date(profile.last_donation).toLocaleDateString()
                  : "N/A"}
              </div>
              <p className="text-sm text-gray-500">Last Donation</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">
                {(profile?.total_donations || 0) * 3}
              </div>
              <p className="text-sm text-gray-500">Lives Saved</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={editData.name || ""}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900">
                    <User className="h-5 w-5 text-gray-400" />
                    {profile?.name || "Not set"}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Blood Type</label>
                {editing ? (
                  <select
                    value={editData.blood_type || ""}
                    onChange={(e) => setEditData({ ...editData, blood_type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                  >
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-3 text-gray-900">
                    <Droplet className="h-5 w-5 text-red-500" />
                    {profile?.blood_type || "Not set"}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={editData.email || ""}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900">
                    <Mail className="h-5 w-5 text-gray-400" />
                    {profile?.email || "Not set"}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Phone</label>
                {editing ? (
                  <input
                    type="tel"
                    value={editData.phone || ""}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900">
                    <Phone className="h-5 w-5 text-gray-400" />
                    {profile?.phone || "Not set"}
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-2">Location</label>
                {editing ? (
                  <input
                    type="text"
                    value={editData.location || ""}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-3 text-gray-900">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    {profile?.location || "Not set"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatBotTrigger />
    </div>
  );
}
