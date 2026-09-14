"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  role: string;
  target: string;
  status: "SUCCESS" | "WARNING" | "CRITICAL";
}

const MOCK_AUDIT_LOGS: AuditEvent[] = [
  {
    id: "aud-1",
    timestamp: "2026-09-14 14:32",
    action: "USER_LOGIN_SUCCESS",
    actor: "Alex Sterling",
    role: "ADMIN",
    target: "Web Console (/admin)",
    status: "SUCCESS",
  },
  {
    id: "aud-2",
    timestamp: "2026-09-14 13:10",
    action: "PAYROLL_CYCLE_CALCULATE",
    actor: "Sarah Jenkins",
    role: "HR_MANAGER",
    target: "Sep 2026 Run ($58,500 total)",
    status: "SUCCESS",
  },
  {
    id: "aud-3",
    timestamp: "2026-09-14 11:05",
    action: "LEAVE_APPROVAL_GRANTED",
    actor: "David Miller",
    role: "MANAGER",
    target: "Maya Patel (Casual - 4 days)",
    status: "SUCCESS",
  },
  {
    id: "aud-4",
    timestamp: "2026-09-14 09:40",
    action: "ATTENDANCE_LATE_ALERT",
    actor: "System Geofence Engine",
    role: "SYSTEM",
    target: "Jonathan Reyes (+40m)",
    status: "WARNING",
  },
  {
    id: "aud-5",
    timestamp: "2026-09-13 18:00",
    action: "BACKUP_COMPLETED",
    actor: "Prisma Automated Scheduler",
    role: "SYSTEM",
    target: "PostgreSQL Database snapshot",
    status: "SUCCESS",
  },
];

export default function AdminReportsPage() {
  const [auditLogs] = useState<AuditEvent[]>(MOCK_AUDIT_LOGS);

  const handleExport = (reportName: string) => {
    toast.success(`Generated and exported ${reportName} report.`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="mb-3 bg-white/20 text-white hover:bg-white/30 border-none">
              Executive Analytics
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">Company Intelligence & Audits</h1>
            <p className="mt-2 text-indigo-200 text-sm max-w-xl">
              Real-time organization metrics, attendance reliability curves, payroll expenditure breakdown, and immutable security audit trails.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleExport("Payroll Audit (PDF)")}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs gap-1.5 rounded-xl"
            >
              <Download className="w-3.5 h-3.5" />
              Payroll Summary
            </Button>
            <Button
              onClick={() => handleExport("Full System Audit Log (CSV)")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs gap-1.5 rounded-xl"
            >
              <Download className="w-3.5 h-3.5" />
              Export Audit CSV
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Monthly Payroll Run
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(58500)}</div>
            <p className="text-xs text-emerald-600 mt-1">On budget (98% forecast accuracy)</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Attendance Reliability
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">96.4%</div>
            <p className="text-xs text-muted-foreground mt-1">+2.1% from previous month</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Leave Utilization
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Healthy absence distribution</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Security Posture
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">100% Compliant</div>
            <p className="text-xs text-muted-foreground mt-1">RBAC enforced on all routes</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Visual Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Headcount Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Department Headcount Distribution
            </CardTitle>
            <CardDescription>Active employee allocation across business divisions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>Engineering</span>
                <span className="font-bold">4 Members (57%)</span>
              </div>
              <div className="w-full bg-muted/60 rounded-full h-2.5 overflow-hidden">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: "57%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>Human Resources</span>
                <span className="font-bold">2 Members (28%)</span>
              </div>
              <div className="w-full bg-muted/60 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "28%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>Sales & Marketing</span>
                <span className="font-bold">1 Member (15%)</span>
              </div>
              <div className="w-full bg-muted/60 rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: "15%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operating Expenditure Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Annual Operating Budget Split
            </CardTitle>
            <CardDescription>Departmental OPEX limits and compensation allocation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>Engineering & Infrastructure</span>
                <span className="font-bold font-mono">$480,000 (44%)</span>
              </div>
              <div className="w-full bg-muted/60 rounded-full h-2.5 overflow-hidden">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "44%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>Sales & Client Marketing</span>
                <span className="font-bold font-mono">$260,000 (24%)</span>
              </div>
              <div className="w-full bg-muted/60 rounded-full h-2.5 overflow-hidden">
                <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: "24%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span>Workplace Operations & Legal</span>
                <span className="font-bold font-mono">$200,000 (18%)</span>
              </div>
              <div className="w-full bg-muted/60 rounded-full h-2.5 overflow-hidden">
                <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: "18%" }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & System Audit Trail */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Immutable System Audit Trail
              </CardTitle>
              <CardDescription>Timestamped compliance logs of sensitive operations and logins</CardDescription>
            </div>
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Audit Stream Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Event Operation</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">{log.timestamp}</td>
                    <td className="py-3.5 px-4 font-semibold text-foreground font-mono">{log.action}</td>
                    <td className="py-3.5 px-4 font-medium text-foreground">{log.actor}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="secondary" className="text-[10px]">
                        {log.role}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{log.target}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge
                        variant={
                          log.status === "SUCCESS"
                            ? "success"
                            : log.status === "WARNING"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
