"use client";

import { usePathname } from "next/navigation";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "Employee Profile",
  "/gaps": "Skill Gap Analysis",
  "/courses": "Course Recommendations",
  "/quiz": "Quiz Generator",
  "/about": "About",
};

export function TopBar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="h-full px-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-xs text-muted-foreground">
            AI-Powered Learning for Government Officials
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}