"use client";

import Sidebar from "@/components/layout/Sidebar";
import DashboardContent from "@/components/sections/DashboardContent";
import ChatBotTrigger from "@/components/ui/ChatBotTrigger";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 ml-[280px]">
        <DashboardContent />
      </div>
      <ChatBotTrigger />
    </div>
  );
}
