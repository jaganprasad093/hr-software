import React from "react";
import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  CalendarDays,
  FileSpreadsheet,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";

export default async function StaffDashboardPage() {
  const session = await getServerAuthSession();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Employee Greeting Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-3 bg-white/20 text-white hover:bg-white/30 border-none">
            Staff Portal
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            Hello, {session?.user?.name}
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            {session?.user?.designation || "Employee"} • Track your daily attendance, apply for leaves, and download payslips.
          </p>
        </div>
      </div>

      {/* Attendance Punch Card & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-primary/20 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Today's Attendance
                </CardTitle>
                <CardDescription>Capture your daily check-in with GPS verification</CardDescription>
              </div>
              <Badge variant="outline" className="gap-1.5 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Workday Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border/70 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">Location Verification</div>
                  <div className="text-[11px] text-muted-foreground">Office Geofence Ready (GPS enabled)</div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                  <Clock className="w-4 h-4" />
                  Check In
                </Button>
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  Check Out
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="text-[11px] text-muted-foreground">Punch In</div>
                <div className="text-sm font-semibold mt-0.5">09:15 AM</div>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="text-[11px] text-muted-foreground">Punch Out</div>
                <div className="text-sm font-semibold mt-0.5">-</div>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="text-[11px] text-muted-foreground">Status</div>
                <div className="text-sm font-semibold text-emerald-600 mt-0.5">PRESENT</div>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="text-[11px] text-muted-foreground">Working Hours</div>
                <div className="text-sm font-semibold mt-0.5">6.5 hrs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Balances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="w-4 h-4 text-primary" />
              Leave Balances
            </CardTitle>
            <CardDescription>Annual available quotas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/50">
              <span className="text-xs font-medium">Casual Leave</span>
              <span className="text-xs font-bold text-primary">11 / 12 days</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/50">
              <span className="text-xs font-medium">Sick Leave</span>
              <span className="text-xs font-bold text-primary">10 / 10 days</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/50">
              <span className="text-xs font-medium">Paid Vacation</span>
              <span className="text-xs font-bold text-primary">18 / 18 days</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
