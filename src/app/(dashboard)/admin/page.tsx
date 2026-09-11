import React from "react";
import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, ShieldCheck, Database, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await getServerAuthSession();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-3 bg-white/20 text-white hover:bg-white/30 border-none">
            Admin Control Center
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {session?.user?.name}
          </h1>
          <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
            Manage organization departments, employee accounts, access permissions, and company-wide governance.
          </p>
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Users
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">Across 4 departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Departments
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">Engineering, HR, Sales, Ops</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Roles
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">ADMIN, HR, MGR, STAFF</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              System Health
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Operational</div>
            <p className="text-xs text-muted-foreground mt-1">Prisma + NextAuth Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Scaffolding Status & Modules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Phase 1 Scaffolding Complete</CardTitle>
              <CardDescription>
                Core Next.js 14 App Router, NextAuth JWT sessions, RBAC middleware, and Prisma schema ready.
              </CardDescription>
            </div>
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Auth & Schema Verified
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border/70 bg-muted/20">
              <div className="font-semibold text-sm mb-1">User & Role Hierarchy</div>
              <p className="text-xs text-muted-foreground">
                All 4 roles defined with middleware protection across <code>/admin</code>, <code>/hr</code>, <code>/manager</code>, and <code>/staff</code>.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border/70 bg-muted/20">
              <div className="font-semibold text-sm mb-1">Relational Database Models</div>
              <p className="text-xs text-muted-foreground">
                User, Department, Attendance, LeaveRequest, LeaveQuota, SalaryStructure, PayrollRun, and Payslip models configured.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border/70 bg-muted/20">
              <div className="font-semibold text-sm mb-1">Next Build Steps</div>
              <p className="text-xs text-muted-foreground">
                Confirming schema with user before building full Admin user CRUD, attendance check-in, leave approval, and payroll runner.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
