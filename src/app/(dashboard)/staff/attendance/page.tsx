"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Timer,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_ATTENDANCES } from "@/lib/mock-data";

export default function StaffAttendancePage() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(true);
  const [checkInTime, setCheckInTime] = useState<string>("09:05 AM");
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [attendances, setAttendances] = useState(MOCK_ATTENDANCES);

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePunch = () => {
    if (!isCheckedIn) {
      const nowStr = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setIsCheckedIn(true);
      setCheckInTime(nowStr);
      setCheckOutTime(null);
      toast.success(`Punch-in recorded at ${nowStr} (GPS Geofence Verified)`);
    } else {
      const nowStr = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setIsCheckedIn(false);
      setCheckOutTime(nowStr);
      toast.info(`Punch-out recorded at ${nowStr}. Have a great evening!`);
    }
  };

  const filteredLogs = attendances.filter((att) => {
    if (statusFilter === "ALL") return true;
    return att.status === statusFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="mb-3 bg-white/20 text-white hover:bg-white/30 border-none">
              Attendance Tracker
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">My Attendance Log</h1>
            <p className="mt-2 text-slate-300 text-sm max-w-xl">
              Real-time biometric & geofence punch clock, monthly working hour statistics, and compliance records.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15">
            <span className="text-xs text-indigo-200 font-medium uppercase tracking-wider">Current Time</span>
            <span className="text-3xl font-mono font-bold tracking-tight text-white mt-1">
              {currentTime || "09:15:00 AM"}
            </span>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              HQ Office Geofence Active
            </span>
          </div>
        </div>
      </div>

      {/* Daily Punch Card & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Punch Card */}
        <Card className="lg:col-span-2 border-primary/20 bg-card/70 backdrop-blur-sm shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  Today&apos;s Timecard
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </CardDescription>
              </div>
              <Badge variant={isCheckedIn ? "success" : "secondary"} className="gap-1.5 py-1 px-3">
                <span className={`w-2 h-2 rounded-full ${isCheckedIn ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                {isCheckedIn ? "Checked In" : "Not Checked In"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-muted/40 border border-border/70 gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">San Francisco Headquarters</div>
                  <div className="text-xs text-muted-foreground mt-0.5">37.7749° N, 122.4194° W • Within 50m radius</div>
                </div>
              </div>
              <Button
                onClick={handlePunch}
                className={`w-full sm:w-auto px-6 py-2.5 font-semibold text-white shadow-lg transition-all active:scale-95 ${
                  isCheckedIn
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/25"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25"
                }`}
              >
                {isCheckedIn ? (
                  <>
                    <Timer className="w-4 h-4 mr-2" />
                    Punch Out
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Punch In
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-background border border-border/60 text-center">
                <div className="text-xs text-muted-foreground font-medium">First Check In</div>
                <div className="text-lg font-bold text-foreground mt-1">{checkInTime || "--"}</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">On Schedule</div>
              </div>
              <div className="p-4 rounded-xl bg-background border border-border/60 text-center">
                <div className="text-xs text-muted-foreground font-medium">Last Check Out</div>
                <div className="text-lg font-bold text-foreground mt-1">{checkOutTime || "--"}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{isCheckedIn ? "Active" : "Completed"}</div>
              </div>
              <div className="p-4 rounded-xl bg-background border border-border/60 text-center">
                <div className="text-xs text-muted-foreground font-medium">Total Duration</div>
                <div className="text-lg font-bold text-foreground mt-1">{isCheckedIn ? "6h 42m" : "8h 00m"}</div>
                <div className="text-[11px] text-primary font-medium mt-0.5">+15m Break deducted</div>
              </div>
              <div className="p-4 rounded-xl bg-background border border-border/60 text-center">
                <div className="text-xs text-muted-foreground font-medium">Day Status</div>
                <div className="text-lg font-bold text-emerald-600 mt-1">PRESENT</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-0.5">100% credit</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Summary Statistics */}
        <Card className="flex flex-col justify-between border-border/70">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Monthly Overview
            </CardTitle>
            <CardDescription>September 2026 performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">Workdays Logged</span>
                <div className="text-xl font-bold text-foreground mt-0.5">10 / 10</div>
              </div>
              <Badge variant="success" className="h-6">100% Rate</Badge>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">Average Daily Hours</span>
                <div className="text-xl font-bold text-foreground mt-0.5">8.4 hrs</div>
              </div>
              <span className="text-xs font-semibold text-emerald-600">+0.4h vs target</span>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">Leaves Taken</span>
                <div className="text-xl font-bold text-foreground mt-0.5">1 day</div>
              </div>
              <span className="text-xs text-muted-foreground">Sick leave (Sep 10)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-primary" />
                Attendance History
              </CardTitle>
              <CardDescription>Past check-ins, punch logs, and compliance notes</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {["ALL", "PRESENT", "ON_LEAVE"].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition ${
                    statusFilter === f
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "ALL" ? "All Logs" : f.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4">Work Duration</th>
                  <th className="py-3 px-4">Verification / Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">{log.date}</td>
                    <td className="py-3.5 px-4 text-foreground">{log.checkIn || "--"}</td>
                    <td className="py-3.5 px-4 text-foreground">{log.checkOut || "--"}</td>
                    <td className="py-3.5 px-4 font-mono font-medium">{log.workHours}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{log.location}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          log.status === "PRESENT"
                            ? "success"
                            : log.status === "ON_LEAVE"
                            ? "info"
                            : "destructive"
                        }
                      >
                        {log.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{log.notes || "Standard workday"}</td>
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
