"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_LEAVES, MockLeaveRequest } from "@/lib/mock-data";
import { LeaveType, LeaveStatus } from "@prisma/client";

export default function StaffLeavesPage() {
  const [leaves, setLeaves] = useState<MockLeaveRequest[]>(MOCK_LEAVES.filter(l => l.userName === "Maya Patel"));
  const [isApplying, setIsApplying] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.CASUAL);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newRequest: MockLeaveRequest = {
      id: `leave-${Date.now()}`,
      userId: "user-4",
      userName: "Maya Patel",
      userRole: "Senior Frontend Engineer",
      departmentName: "Engineering",
      startDate,
      endDate,
      days: 3,
      type: leaveType,
      reason,
      status: LeaveStatus.PENDING,
      appliedDate: new Date().toISOString().split("T")[0],
    };

    setLeaves([newRequest, ...leaves]);
    toast.success("Leave application submitted for manager approval!");
    setIsApplying(false);
    setReason("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="mb-3 bg-white/20 text-white hover:bg-white/30 border-none">
              Time Off Management
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">My Leave Requests</h1>
            <p className="mt-2 text-slate-300 text-sm max-w-xl">
              Check quota balances, submit paid or sick time-off requests, and track supervisor approval progress.
            </p>
          </div>
          <Button
            onClick={() => setIsApplying(!isApplying)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/25 gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {isApplying ? "Cancel Form" : "Apply for Leave"}
          </Button>
        </div>
      </div>

      {/* Leave Quota Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Casual Leave
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">Annual</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">8 <span className="text-sm font-normal text-muted-foreground">/ 12 days</span></div>
            <div className="w-full bg-muted/60 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-primary h-2 rounded-full" style={{ width: "66%" }} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">4 days used this year</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Sick Leave
              </CardTitle>
              <Badge variant="info" className="text-[10px]">Medical</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">8 <span className="text-sm font-normal text-muted-foreground">/ 10 days</span></div>
            <div className="w-full bg-muted/60 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: "80%" }} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">2 days taken in August</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Paid Vacation
              </CardTitle>
              <Badge variant="success" className="text-[10px]">Vacation</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">18 <span className="text-sm font-normal text-muted-foreground">/ 18 days</span></div>
            <div className="w-full bg-muted/60 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "100%" }} />
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-2">Full quota available</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Unpaid Leave
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">Special</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">30 <span className="text-sm font-normal text-muted-foreground">days cap</span></div>
            <div className="w-full bg-muted/60 rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-slate-400 h-2 rounded-full" style={{ width: "0%" }} />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">Requires executive sanction</p>
          </CardContent>
        </Card>
      </div>

      {/* Apply Form Dropdown */}
      {isApplying && (
        <Card className="border-primary/40 bg-card shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              New Leave Application
            </CardTitle>
            <CardDescription>
              Submit request directly to your supervisor (David Miller, VP of Engineering)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleApply} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Leave Category</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value={LeaveType.CASUAL}>Casual Leave (Personal / Family)</option>
                    <option value={LeaveType.SICK}>Sick Leave (Medical / Doctor Visit)</option>
                    <option value={LeaveType.PAID}>Paid Vacation</option>
                    <option value={LeaveType.UNPAID}>Unpaid Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Reason for Absence</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide details for your team lead and workload handover arrangements..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsApplying(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <Send className="w-4 h-4" />
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Leave Request Log
          </CardTitle>
          <CardDescription>Overview of recent and historical time-off filings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">From - To</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Applied On</th>
                  <th className="py-3 px-4">Approver</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">{leave.type}</td>
                    <td className="py-3.5 px-4 text-foreground font-mono">
                      {leave.startDate} → {leave.endDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground">{leave.days} days</td>
                    <td className="py-3.5 px-4 text-muted-foreground max-w-xs truncate">{leave.reason}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{leave.appliedDate}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{leave.approvedBy || "David Miller (Pending)"}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          leave.status === LeaveStatus.APPROVED
                            ? "success"
                            : leave.status === LeaveStatus.PENDING
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {leave.status}
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
