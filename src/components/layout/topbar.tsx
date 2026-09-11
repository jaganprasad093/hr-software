"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { Bell, User, LogOut, Shield, Briefcase, Users, Laptop } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  const { data: session } = useSession();
  const role = session?.user?.role || "STAFF";

  const RoleIcon = {
    ADMIN: Shield,
    HR_MANAGER: Users,
    MANAGER: Briefcase,
    STAFF: Laptop,
  }[role] || User;

  return (
    <header className="h-16 border-b border-border/70 bg-card/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Portal:</span>
          <span className="text-sm font-semibold text-foreground capitalize">
            {role.toLowerCase().replace("_", " ")} Workspace
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="w-9 h-9 rounded-xl border border-border/60 hover:bg-muted/70 flex items-center justify-center text-muted-foreground hover:text-foreground transition relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
        </button>

        <div className="h-5 w-px bg-border/80" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-foreground">
              {session?.user?.name || "User"}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {session?.user?.designation || session?.user?.email}
            </div>
          </div>

          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs">
            <RoleIcon className="w-4 h-4" />
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign Out"
            className="w-9 h-9 rounded-xl border border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 flex items-center justify-center text-muted-foreground transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
