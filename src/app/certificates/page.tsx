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
    const dateStr = new Date(cert.donation_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const svgContent = `
<svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="white"/>
  <rect x="20" y="20" width="760" height="560" stroke="#E5E7EB" stroke-width="2"/>
  <rect x="30" y="30" width="740" height="540" stroke="#FEE2E2" stroke-width="4"/>
  
  <path d="M400 60L420 100H380L400 60Z" fill="#DC2626"/>
  <circle cx="400" cy="110" r="15" fill="#DC2626"/>
  
  <text x="400" y="160" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#111827">CERTIFICATE OF DONATION</text>
  <text x="400" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6B7280">This is to certify that</text>
  
  <text x="400" y="260" text-anchor="middle" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#DC2626">${cert.donor_name}</text>
  
  <line x1="200" y1="280" x2="600" y2="280" stroke="#E5E7EB" stroke-width="1"/>
  
  <text x="400" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#374151">has successfully donated blood of type <tspan font-weight="bold">${cert.blood_type}</tspan></text>
  <text x="400" y="350" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#374151">helping to save lives in our community.</text>
  
  <g transform="translate(100, 420)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="14" fill="#6B7280">Donation Date</text>
    <text x="0" y="25" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#111827">${dateStr}</text>
  </g>
  
  <g transform="translate(400, 420)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="14" fill="#6B7280">Hospital / Center</text>
    <text x="0" y="25" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#111827">${cert.hospital}</text>
  </g>
  
  <g transform="translate(100, 520)">
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="12" fill="#9CA3AF">Certificate ID: ${cert.certificate_number}</text>
  </g>
  
  <g transform="translate(600, 520)">
    <text x="100" y="0" text-anchor="end" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#DC2626">BLOODLINK TEAM</text>
  </g>
  
  <circle cx="700" cy="100" r="40" fill="#FEF2F2"/>
  <path d="M700 80C690 80 685 88 685 88C685 88 680 80 670 80C660 80 655 90 660 105C665 120 700 145 700 145C700 145 735 120 740 105C745 90 740 80 730 80C720 80 715 88 715 88C715 88 710 80 700 80Z" fill="#DC2626" transform="translate(0, -10) scale(0.3) translate(1633, 233)"/>
</svg>
    `.trim();

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blood-donation-certificate-${cert.certificate_number}.svg`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    // Also provide a way to download as HTML for better printing if they prefer
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Blood Donation Certificate - ${cert.donor_name}</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f3f4f6; font-family: sans-serif; }
          .cert { background: white; padding: 40px; border: 20px solid #fecaca; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); max-width: 800px; text-align: center; }
          h1 { color: #111827; font-size: 36px; margin-bottom: 10px; }
          .name { color: #dc2626; font-size: 48px; font-weight: bold; margin: 30px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
          .detail { font-size: 20px; color: #374151; margin: 10px 0; }
          .footer { margin-top: 50px; display: flex; justify-content: space-between; text-align: left; color: #6b7280; }
          .stamp { color: #dc2626; font-weight: bold; border: 4px solid #dc2626; padding: 10px; transform: rotate(-10deg); display: inline-block; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="cert">
          <h1>CERTIFICATE OF DONATION</h1>
          <p>This is to certify that</p>
          <div class="name">${cert.donor_name}</div>
          <p class="detail">has successfully donated blood of type <strong>${cert.blood_type}</strong></p>
          <p class="detail">at <strong>${cert.hospital}</strong></p>
          <p class="detail">on <strong>${dateStr}</strong></p>
          <div class="stamp">OFFICIAL SEAL</div>
          <div class="footer">
            <div>Certificate ID: ${cert.certificate_number}</div>
            <div style="text-align: right">BLOODLINK TEAM<br>Save Lives Together</div>
          </div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;
    // We stick to SVG as the primary "original" looking file as requested.
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
