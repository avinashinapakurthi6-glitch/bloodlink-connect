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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 pt-6">
        <Link href="/dashboard" className="flex flex-col items-center justify-center pb-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-red-50">
            <Heart className="size-6 text-red-500" />
          </div>
          <div className="mt-2 text-lg font-bold text-slate-900">BloodLink</div>
          <p className="mt-0.5 text-xs text-slate-500">Save Lives Together</p>
        </Link>

        <nav className="flex flex-col gap-1">
          <h4 className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">Features</h4>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-red-50 text-red-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`size-5 ${isActive ? 'text-red-600' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <nav className="mt-8 flex flex-col gap-1">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Actions</h4>
          <Link
            href="/profile"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              pathname === '/profile'
                ? 'bg-red-50 text-red-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <UserCircle className={`size-5 ${pathname === '/profile' ? 'text-red-600' : ''}`} />
            Donor Profile
          </Link>
        </nav>

        <div className="mt-12 pb-6">
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
            <p className="text-sm font-medium text-slate-900 mb-1">Ready to save lives?</p>
            <p className="text-xs text-slate-500 mb-3">Register as a donor today</p>
            <Link
              href="/donors"
              className="block w-full py-2 text-center rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Donate Now
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
