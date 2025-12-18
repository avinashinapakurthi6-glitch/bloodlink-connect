"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  LayoutDashboard,
  AlertCircle,
  Users,
  Package,
  Clock,
  CheckCircle2,
  Award,
  Calendar,
  UserCircle,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Impact Dashboard' },
  { href: '/emergency', icon: AlertCircle, label: 'Emergency SOS' },
  { href: '/donors', icon: Users, label: 'Donor Matching' },
  { href: '/inventory', icon: Package, label: 'Blood Bank Inventory' },
  { href: '/queue', icon: Clock, label: 'Hospital Queue' },
  { href: '/eligibility', icon: CheckCircle2, label: 'Health Eligibility' },
  { href: '/certificates', icon: Award, label: 'Donation Certificates' },
  { href: '/events', icon: Calendar, label: 'Donation Events' },
];

export default function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800 bg-slate-950 p-4 pt-6">
      <Link href="/dashboard" className="flex flex-col items-center justify-center pb-6">
        <div className="flex size-12 items-center justify-center rounded-full bg-red-500/20">
          <Heart className="size-6 text-red-500" />
        </div>
        <div className="mt-2 text-lg font-bold text-white">BloodLink</div>
        <p className="mt-0.5 text-xs text-slate-500">Save Lives Together</p>
      </Link>

      <nav className="flex flex-col gap-1">
        <h4 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Features</h4>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-red-500/20 text-red-400'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <item.icon className={`size-5 ${isActive ? 'text-red-400' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <nav className="mt-8 flex flex-col gap-1">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Quick Actions</h4>
        <Link
          href="/profile"
          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
            pathname === '/profile'
              ? 'bg-red-500/20 text-red-400'
              : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
          }`}
        >
          <UserCircle className={`size-5 ${pathname === '/profile' ? 'text-red-400' : ''}`} />
          Donor Profile
        </Link>
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <div className="rounded-xl bg-gradient-to-r from-red-500/20 to-pink-500/20 p-4 border border-red-500/30">
          <p className="text-sm font-medium text-white mb-1">Ready to save lives?</p>
          <p className="text-xs text-slate-400 mb-3">Register as a donor today</p>
          <Link
            href="/emergency"
            className="block w-full py-2 text-center rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Donate Now
          </Link>
        </div>
      </div>
    </aside>
  );
}
