"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  UserCircle,
  Stethoscope,
  HeartPulse,
  Syringe,
  MapPin,
  WifiOff,
  BellRing,
  CalendarDays,
  FileCheck,
  Building2,
  Clock,
  Heart,
    Languages,
  } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "Features",
    items: [
      { name: "Impact Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Respond to Emergencies", href: "/emergencies", icon: HeartPulse },
      { name: "Emergency SOS", href: "/sos", icon: AlertTriangle },
      { name: "Donor Matching", href: "/matching", icon: Users },
      { name: "Blood Bank Inventory", href: "/inventory", icon: Building2 },
      { name: "Hospital Queue", href: "/queue", icon: Clock },
      { name: "Health Eligibility", href: "/eligibility", icon: Stethoscope },
      { name: "AI Medical Report Check", href: "/ai-check", icon: FileCheck },
      { name: "Donation Certificates", href: "/certificates", icon: Syringe },
      { name: "Map Tracking", href: "/map", icon: MapPin },
      { name: "Offline Mode", href: "/offline", icon: WifiOff },
      { name: "Shortage Alerts", href: "/alerts", icon: BellRing },
      { name: "Donation Events", href: "/events", icon: CalendarDays },
    ],
  },
  {
    title: "Quick Actions",
    items: [
      { name: "Donor Profile", href: "/profile", icon: UserCircle },
      { name: "Register as Donor", href: "/register", icon: HeartPulse },
    ],
  },
];

const languages = [
  { name: "English", code: "en" },
  { name: "Español", code: "es" },
  { name: "Français", code: "fr" },
  { name: "हिन्दी", code: "hi" },
  { name: "বাংলা", code: "bn" },
  { name: "తెలుగు", code: "te" },
  { name: "मराठी", code: "mr" },
  { name: "தமிழ்", code: "ta" },
  { name: "ગુજરાતી", code: "gu" },
  { name: "ಕನ್ನಡ", code: "kn" },
  { name: "മലയാളം", code: "ml" },
  { name: "ਪੰਜਾਬੀ", code: "pa" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    setUserEmail(localStorage.getItem("donor_email"));
  }, []);

  const changeLanguage = (code: string) => {
    // 1. Try to set cookie for persistence
    document.cookie = `googtrans=/en/${code}; path=/`;
    document.cookie = `googtrans=/en/${code}; path=/; domain=.${window.location.hostname}`;
    
    // 2. Try to trigger the widget if it exists
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event("change"));
    } else {
      // 3. Fallback: reload if widget isn't ready but cookie is set
      window.location.reload();
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[280px] border-r border-[#E5E7EB] bg-white transition-transform">
      <div className="flex h-full flex-col overflow-y-auto px-0 py-0">
        {/* Header/Logo Section */}
        <div className="sticky top-0 z-10 flex h-[64px] items-center justify-between border-b border-[#E5E7EB] bg-white px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50">
              <Heart className="h-5 w-5 fill-red-600 text-red-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[1.125rem] font-bold leading-tight text-[#111827]">
                BloodLink
              </span>
              <span className="text-[0.75rem] text-[#6B7280]">
                Save Lives Together
              </span>
            </div>
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-md p-1.5 text-[#6B7280] hover:bg-gray-100 transition-standard outline-none">
                <Languages className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 max-h-80 overflow-y-auto">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="cursor-pointer"
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 space-y-8 p-4">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-[0.75rem] font-semibold uppercase tracking-wider text-[#6B7280]">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-3 py-2 text-[0.875rem] font-medium transition-standard",
                        isActive
                          ? "bg-[#FEE2E2] text-[#DC2626]"
                          : "text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827]"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0 transition-standard",
                          isActive
                            ? "text-[#DC2626]"
                            : "text-[#6B7280] group-hover:text-[#111827]"
                        )}
                      />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Area - Potential for User/Settings */}
        <div className="mt-auto border-t border-[#E5E7EB] p-4">
          {userEmail && (
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <UserCircle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-gray-900 truncate">Registered Donor</span>
                <span className="text-[10px] text-gray-500 truncate">{userEmail}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}