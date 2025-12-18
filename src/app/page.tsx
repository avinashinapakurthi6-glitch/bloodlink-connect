import SidebarNavigation from "@/components/sections/sidebar-navigation";
import MainContentArea from "@/components/sections/main-content-area";
import FloatingChatButton from "@/components/sections/floating-chat-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNavigation />
      <MainContentArea />
      <FloatingChatButton />
    </div>
  );
}
