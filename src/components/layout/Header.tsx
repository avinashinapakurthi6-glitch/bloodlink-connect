"use client";

import React from "react";
import { PanelLeft } from "lucide-react";

/**
 * Header Component
 *
 * This component clones the top navigation header bar as specified.
 * Features:
 * - Layout toggle icon on the left (Sidebar toggle).
 * - Clean, minimal border-bottom separator.
 * - Adheres to the light theme and design tokens from the design system.
 */
const Header = () => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
      {/* 
        The design features a simple bar containing a sidebar-toggle icon.
        The icon used is a PanelLeft (lucide-react) which matches the layout toggle 
        visual seen in the screenshots.
      */}
      <div className="flex items-center gap-4">
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-standard"
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* 
        The original header in the screenshot is very minimal, acting as a clean 
        separator. We maintain the flex layout for consistent future scalability 
        (e.g., adding user profiles or breadcrumbs as mentioned in the site sections).
      */}
      <div className="flex-1" />

      {/* 
        Note: The screenshot shows a very clean right side in the current state.
        According to "Top Header" in site sections: "Simple bar containing a 
        breadcrumb/sidebar-toggle icon and user profile options." 
      */}
    </header>
  );
};

export default Header;