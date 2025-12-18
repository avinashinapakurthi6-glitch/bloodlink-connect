"use client"

import { useEffect, useState } from 'react'

interface Certificate {
  id: string
  certificate_number: string
  issued_date: string
  blood_type: string
  units_donated: number
  hospital_name: string
  donations: { donation_date: string } | null
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const res = await fetch('/api/certificates')
      const data = await res.json()
      setCertificates(data.certificates || [])
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 pl-72 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Donation Certificates</h1>
          <p className="text-slate-400">View and download your blood donation certificates</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-red-400">Loading certificates...</div>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-800 mb-6">
              <span className="text-5xl">📜</span>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No Certificates Yet</h2>
            <p className="text-slate-400 max-w-md mx-auto">
              Complete a blood donation to receive your certificate. Every donation counts!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map(cert => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <div className="bg-gradient-to-br from-amber-900/30 to-amber-950/50 rounded-2xl p-6 border border-amber-500/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-500/10 rounded-full translate-y-12 -translate-x-12" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl">🏆</span>
          <span className="text-amber-400 text-sm font-mono">{certificate.certificate_number}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-1">Certificate of Appreciation</h3>
        <p className="text-amber-200/70 text-sm mb-4">Blood Donation Achievement</p>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-slate-400">Blood Type</span>
            <span className="text-white font-medium">{certificate.blood_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Units Donated</span>
            <span className="text-white font-medium">{certificate.units_donated}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Hospital</span>
            <span className="text-white font-medium">{certificate.hospital_name || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Issued Date</span>
            <span className="text-white font-medium">{new Date(certificate.issued_date).toLocaleDateString()}</span>
          </div>
        </div>

        <button className="w-full py-2 rounded-xl bg-amber-500/20 text-amber-400 font-medium hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-2">
          <span>📥</span>
          Download PDF
        </button>
      </div>
    </div>
  )
}
