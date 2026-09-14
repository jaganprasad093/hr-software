"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  User,
  AlertCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_LEAVES, MockLeaveRequest } from "@/lib/mock-data";
import { LeaveStatus } from "@prisma/client";

export default function ManagerApprovalsPage() {
  const [requests, setRequests] = useState<MockLeaveRequest[]>(MOCK_LEAVES);
  const [activeTab, setActiveTab] = useState<"PENDING" | "HISTORY">("PENDING");

  const handleAction = (id: string, newStatus: LeaveStatus, employeeName: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: newStatus,
              approvedBy: "David Miller (Eng Manager)",
            }
          : req
      )
    );

    if (newStatus === LeaveStatus.APPROVED) {
      toast.success(`Approved leave request for ${employeeName}`);
    } else {
      toast.error(`Rejected leave request for ${employeeName}`);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === LeaveStatus.PENDING);
  const historicalRequests = requests.filter((r) => r.status !== LeaveStatus.PENDING);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-3 bg-white/20 text-white hover:bg-white/30 border-none">
            Manager Approvals
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Leave Approvals Desk</h1>
          <p className="mt-2 text-emerald-100 text-sm leading-relaxed">
            Review time-off requests submitted by your engineering team, verify staffing coverage, and grant approvals.
          </p>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Queue
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires supervisor signoff</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Approved This Month
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {requests.filter((r) => r.status === LeaveStatus.APPROVED).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Coverage verified</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Avg Review Time
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">&lt; 4 Hours</div>
            <p className="text-xs text-muted-foreground mt-1">High responsiveness</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-border/70 pb-3">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`text-xs px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === "PENDING"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          }`}
        >
          Pending Review ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`text-xs px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === "HISTORY"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          }`}
        >
          Approval Archive ({historicalRequests.length})
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === "PENDING" ? (
        pendingRequests.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground">All Clear! No Pending Requests</h3>
            <p className="text-xs text-muted-foreground mt-1">
              You have reviewed all pending time-off submissions from your team members.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingRequests.map((req) => (
              <Card key={req.id} className="border-border/80 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {req.userName[0]}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">{req.userName}</CardTitle>
                        <CardDescription className="text-xs">{req.userRole}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="warning">{req.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requested Period</span>
                      <span className="font-semibold text-foreground font-mono">
                        {req.startDate} → {req.endDate} ({req.days} days)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Filing Date</span>
                      <span className="text-foreground">{req.appliedDate}</span>
                    </div>
                    <div className="pt-2 border-t border-border/50">
                      <span className="text-muted-foreground block mb-1">Reason:</span>
                      <p className="text-foreground italic bg-background p-2.5 rounded-lg border border-border/40">
                        &quot;{req.reason}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(req.id, LeaveStatus.REJECTED, req.userName)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAction(req.id, LeaveStatus.APPROVED, req.userName)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve Leave
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Past Decisions</CardTitle>
            <CardDescription>Archive of processed team requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Dates</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Decision</th>
                    <th className="py-3 px-4">Reviewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {historicalRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-foreground">{r.userName}</td>
                      <td className="py-3.5 px-4">{r.type}</td>
                      <td className="py-3.5 px-4 font-mono">
                        {r.startDate} → {r.endDate}
                      </td>
                      <td className="py-3.5 px-4">{r.days} days</td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={r.status === LeaveStatus.APPROVED ? "success" : "destructive"}
                        >
                          {r.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{r.approvedBy || "David Miller"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
