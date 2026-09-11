"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Building2,
  Users,
  CalendarCheck,
  CalendarDays,
  FileSpreadsheet,
  BarChart3,
  CheckSquare,
  Clock,
  Briefcase,
  Home,
  UserCheck,
  Shield,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  badge?: string;
}

const navItems: NavItem[] = [
  // Staff Portal (All authenticated roles)
  {
    label: "My Workplace",
    href: "/staff",
    icon: Home,
    roles: ["STAFF", "MANAGER", "HR_MANAGER", "ADMIN"],
  },
  {
    label: "My Attendance",
    href: "/staff/attendance",
    icon: Clock,
    roles: ["STAFF", "MANAGER", "HR_MANAGER", "ADMIN"],
  },
  {
    label: "My Leaves",
    href: "/staff/leaves",
    icon: CalendarDays,
    roles: ["STAFF", "MANAGER", "HR_MANAGER", "ADMIN"],
  },
  {
    label: "My Payslips",
    href: "/staff/payslips",
    icon: FileSpreadsheet,
    roles: ["STAFF", "MANAGER", "HR_MANAGER", "ADMIN"],
  },

  // Manager Section
  {
    label: "Manager Portal",
    href: "/manager",
    icon: Briefcase,
    roles: ["MANAGER", "ADMIN", "HR_MANAGER"],
  },
  {
    label: "Team Members",
    href: "/manager/team",
    icon: Users,
    roles: ["MANAGER", "ADMIN", "HR_MANAGER"],
  },
  {
    label: "Leave Approvals",
    href: "/manager/approvals",
    icon: CheckSquare,
    roles: ["MANAGER", "ADMIN", "HR_MANAGER"],
  },

  // HR Section
  {
    label: "HR Dashboard",
    href: "/hr",
    icon: UserCheck,
    roles: ["HR_MANAGER", "ADMIN"],
  },
  {
    label: "Team Attendance",
    href: "/hr/attendance",
    icon: CalendarCheck,
    roles: ["HR_MANAGER", "ADMIN"],
  },
  {
    label: "Leave Management",
    href: "/hr/leaves",
    icon: CalendarDays,
    roles: ["HR_MANAGER", "ADMIN"],
  },
  {
    label: "Payroll Engine",
    href: "/hr/payroll",
    icon: FileSpreadsheet,
    roles: ["HR_MANAGER", "ADMIN"],
  },

  // Admin Section
  {
    label: "Admin Center",
    href: "/admin",
    icon: Shield,
    roles: ["ADMIN"],
  },
  {
    label: "User Accounts",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    label: "Departments",
    href: "/admin/departments",
    icon: Building2,
    roles: ["ADMIN"],
  },
  {
    label: "Company Reports",
    href: "/admin/reports",
    icon: BarChart3,
    roles: ["ADMIN"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role || "STAFF";

  const accessibleItems = navItems.filter((item) => item.roles.includes(role));

  const roleLabel = {
    ADMIN: "Administrator",
    HR_MANAGER: "HR Manager",
    MANAGER: "Manager",
    STAFF: "Staff Member",
  }[role] || role;

  const roleBadgeVariant = {
    ADMIN: "destructive" as const,
    HR_MANAGER: "info" as const,
    MANAGER: "success" as const,
    STAFF: "secondary" as const,
  }[role] || "secondary";

  return (
    <aside className="w-64 border-r border-border/70 bg-card/90 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 border-b border-border/60 flex items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-foreground">
          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/25">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base tracking-tight leading-tight">PulseHR</span>
            <span className="text-[10px] text-muted-foreground font-normal tracking-wide uppercase">
              Workforce Suite
            </span>
          </div>
        </Link>
      </div>

      {/* User Mini Profile */}
      <div className="p-4 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs uppercase">
            {session?.user?.name?.[0] || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-foreground truncate">
              {session?.user?.name || "Loading..."}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant={roleBadgeVariant} className="text-[9px] px-1.5 py-0 h-4 uppercase">
                {roleLabel}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {accessibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" &&
              item.href !== "/hr" &&
              item.href !== "/manager" &&
              item.href !== "/staff" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-primary-foreground/20 text-inherit px-1.5 py-0.5 rounded-md">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout Footer */}
      <div className="p-3 border-t border-border/60">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-xl transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
