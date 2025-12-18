import Link from 'next/link';
import {
  Heart,
  LayoutDashboard,
  AlertCircle,
  Bell,
  Users,
  Package,
  Clock,
  CheckCircle2,
  FileText,
  Award,
  MapPin,
  WifiOff,
  AlertTriangle,
  Calendar,
  UserCircle,
} from 'lucide-react';

export default function SidebarNavigation() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-48 border-r border-sidebar-border bg-sidebar p-4 pt-6">
      <div className="flex flex-col items-center justify-center pb-6">
        <div className="flex size-10 items-center justify-center rounded-full bg-red-light-background">
          <Heart className="size-5 text-primary" />
        </div>
        <div className="mt-2 text-base font-semibold text-sidebar-foreground">BloodLink</div>
        <p className="mt-0.5 text-xs text-text-secondary">Save Lives Together</p>
      </div>

      <nav className="flex flex-col gap-1">
        <h4 className="mb-2 mt-5 text-xs font-semibold text-text-secondary">Features</h4>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <LayoutDashboard className="size-4" />
          Impact Dashboard
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <AlertCircle className="size-4" />
          Respond to Emergencies
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <Bell className="size-4" />
          Emergency SOS
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <Users className="size-4" />
          Donor Matching
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <Package className="size-4" />
          Blood Bank Inventory
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <Clock className="size-4" />
          Hospital Queue
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <CheckCircle2 className="size-4" />
          Health Eligibility
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <FileText className="size-4" />
          AI Medical Report Check
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <Award className="size-4" />
          Donation Certificates
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <MapPin className="size-4" />
          Map Tracking
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <WifiOff className="size-4" />
          Offline Mode
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <AlertTriangle className="size-4" />
          Shortage Alerts
        </Link>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <Calendar className="size-4" />
          Donation Events
        </Link>
      </nav>

      <nav className="mt-8 flex flex-col gap-1">
        <h4 className="mb-2 text-xs font-semibold text-text-secondary">Quick Actions</h4>
        <Link
          href="#"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-normal text-sidebar-foreground transition-colors hover:bg-muted"
        >
          <UserCircle className="size-4" />
          Donor Profile
        </Link>
      </nav>
    </aside>
  );
}