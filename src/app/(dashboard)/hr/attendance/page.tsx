"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  Search,
  Filter,
  Download,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_ATTENDANCES, MockAttendance } from "@/lib/mock-data";
import { AttendanceStatus } from "@prisma/client";

export default function HrAttendancePage() {
  const [attendances, setAttendances] = useState<MockAttendance[]>(MOCK_ATTENDANCES);
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredLogs = attendances.filter((att) => {
    const matchesDept = selectedDept === "ALL" || att.departmentName === selectedDept;
    const matchesSearch =
      att.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleExport = () => {
    toast.success("Exported company daily attendance report (CSV)");
  };

  const handleMarkPresent = (id: string, name: string) => {
    setAttendances((prev) =>
      prev.map((att) =>
        att.id === id
          ? {
              ...att,
              status: AttendanceStatus.PRESENT,
              checkIn: "09:00 AM (HR Overridden)",
              notes: "HR Manual status update",
            }
          : att
      )
    );
    toast.info(`Updated attendance for ${name} to PRESENT`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="mb-3 bg-white/20 text-white hover:bg-white/30 border-none">
              HR Workforce Operations
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">Company-Wide Attendance</h1>
            <p className="mt-2 text-blue-100 text-sm max-w-xl">
              Monitor real-time employee check-ins across all departments, track shift anomalies, and oversee time tracking compliance.
            </p>
          </div>
          <Button
            onClick={handleExport}
            className="bg-white/15 hover:bg-white/25 text-white border border-white/20 gap-2 backdrop-blur-md rounded-xl"
          >
            <Download className="w-4 h-4" />
            Export Daily CSV
          </Button>
        </div>
      </div>

      {/* Organization Attendance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Headcount
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">7 Active</div>
            <p className="text-xs text-muted-foreground mt-1">4 Functional departments</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Present Today
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">6 (86%)</div>
            <p className="text-xs text-muted-foreground mt-1">Biometric/GPS confirmed</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              On Authorized Leave
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1 Employee</div>
            <p className="text-xs text-amber-600 mt-1">Sick leave sanctioned</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Anomalies / Late
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1 Late</div>
            <p className="text-xs text-muted-foreground mt-1">Jonathan Reyes (&gt;30m)</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employee or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "Engineering", "Human Resources", "Sales & Marketing"].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`text-xs px-3 py-2 rounded-xl font-medium whitespace-nowrap transition ${
                selectedDept === dept
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              {dept === "ALL" ? "All Departments" : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Master Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-primary" />
            Today&apos;s Master Attendance Ledger
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Punch In</th>
                  <th className="py-3 px-4">Punch Out</th>
                  <th className="py-3 px-4">Location / Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">HR Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredLogs.map((att) => (
                  <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {att.userName[0]}
                        </div>
                        <span>{att.userName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{att.departmentName}</td>
                    <td className="py-3.5 px-4 font-medium text-foreground">{att.checkIn || "--"}</td>
                    <td className="py-3.5 px-4 font-medium text-foreground">{att.checkOut || "--"}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{att.location}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          att.status === AttendanceStatus.PRESENT
                            ? "success"
                            : att.status === AttendanceStatus.ON_LEAVE
                            ? "info"
                            : "destructive"
                        }
                      >
                        {att.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{att.notes || "Normal"}</td>
                    <td className="py-3.5 px-4 text-right">
                      {att.status !== AttendanceStatus.PRESENT && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkPresent(att.id, att.userName)}
                          className="h-7 text-[11px]"
                        >
                          Override
                        </Button>
                      )}
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
