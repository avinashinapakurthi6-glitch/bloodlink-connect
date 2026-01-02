"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";
import { supabase } from "@/lib/supabase/client";
import { Award, Download, Droplet, Calendar, Hospital } from "lucide-react";

interface Certificate {
  id: string;
  donor_name: string;
  blood_type: string;
  donation_date: string;
  hospital: string;
  certificate_number: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("donation_date", { ascending: false });

      if (!error && data) {
        setCertificates(data);
      }
      setLoading(false);
    }

    fetchCertificates();
  }, []);

  const downloadCertificate = (cert: Certificate) => {
    const content = `
BLOOD DONATION CERTIFICATE

Certificate Number: ${cert.certificate_number}

This is to certify that

${cert.donor_name}

has generously donated blood (Type: ${cert.blood_type})
on ${new Date(cert.donation_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
at ${cert.hospital}

Your selfless act of kindness helps save lives.
Thank you for being a hero!

BloodLink - Save Lives Together
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificate-${cert.certificate_number}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <header className="h-16 border-b border-gray-200 bg-white flex items-center px-8 sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Donation Certificates</h1>
            <p className="text-sm text-gray-500">Download your blood donation certificates</p>
          </div>
        </header>

        <div className="p-8">
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Award className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Your Donation History</h2>
                <p className="text-amber-100">
                  You've made {certificates.length} donations. Thank you for saving lives!
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Award className="h-8 w-8 text-amber-500" />
                        <div>
                          <h3 className="font-bold text-gray-900">Blood Donation Certificate</h3>
                          <p className="text-xs text-gray-500">{cert.certificate_number}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1 bg-red-100 rounded-lg">
                        <Droplet className="h-4 w-4 text-red-600 fill-red-600" />
                        <span className="text-sm font-bold text-red-600">{cert.blood_type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(cert.donation_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Hospital className="h-4 w-4" />
                        <span className="text-sm">{cert.hospital}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadCertificate(cert)}
                      className="w-full py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download Certificate
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
