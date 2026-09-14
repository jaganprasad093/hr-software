"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Settings2,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_LEAVES, MockLeaveRequest } from "@/lib/mock-data";
import { LeaveStatus, LeaveType } from "@prisma/client";

export default function HrLeavesPage() {
  const [leaves, setLeaves] = useState<MockLeaveRequest[]>(MOCK_LEAVES);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleStatusChange = (id: string, newStatus: LeaveStatus, employee: string) => {
    setLeaves((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: newStatus,
              approvedBy: "Sarah Jenkins (HR Lead)",
            }
          : l
      )
    );
    toast.success(`Updated leave status for ${employee} to ${newStatus}`);
  };

  const filteredLeaves = leaves.filter((l) => {
    const matchesStatus = filterStatus === "ALL" || l.status === filterStatus;
    const matchesSearch =
      l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <Badge className="mb-3 bg-white/20 text-white hover:bg-white/30 border-none">
            HR Leave Operations
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">Organization Leave Management</h1>
          <p className="mt-2 text-blue-100 text-sm leading-relaxed">
            Configure statutory leave quotas, oversee cross-department requests, audit absence patterns, and enforce compliance policies.
          </p>
        </div>
      </div>

      {/* Statutory Quotas Policy Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Casual Leave Quota
            </CardTitle>
            <Badge variant="secondary">12 Days / Yr</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12 Days</div>
            <p className="text-xs text-muted-foreground mt-1">1 day accumulated per month</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sick Leave Quota
            </CardTitle>
            <Badge variant="info">10 Days / Yr</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">10 Days</div>
            <p className="text-xs text-muted-foreground mt-1">Medical certificate &gt; 2 days</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Earned Vacation
            </CardTitle>
            <Badge variant="success">18 Days / Yr</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">18 Days</div>
            <p className="text-xs text-muted-foreground mt-1">Carryover limit: 10 days</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Approvals
            </CardTitle>
            <Badge variant="warning">Action Req</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {leaves.filter((l) => l.status === LeaveStatus.PENDING).length} Requests
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across 2 departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by employee name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`text-xs px-3.5 py-2 rounded-xl font-medium transition ${
                filterStatus === st
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* All Employee Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            Company Leave Applications Registry
          </CardTitle>
          <CardDescription>Master administrative record of employee time-off requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">HR Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredLeaves.map((l) => (
                  <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      <div>
                        <span>{l.userName}</span>
                        <div className="text-[11px] text-muted-foreground font-normal">{l.userRole}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{l.departmentName}</td>
                    <td className="py-3.5 px-4 font-medium">{l.type}</td>
                    <td className="py-3.5 px-4 font-mono">
                      {l.startDate} → {l.endDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold">{l.days} days</td>
                    <td className="py-3.5 px-4 text-muted-foreground max-w-xs truncate">{l.reason}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          l.status === LeaveStatus.APPROVED
                            ? "success"
                            : l.status === LeaveStatus.PENDING
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {l.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {l.status === LeaveStatus.PENDING ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(l.id, LeaveStatus.REJECTED, l.userName)}
                            className="h-7 text-xs text-rose-600 hover:text-rose-700"
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(l.id, LeaveStatus.APPROVED, l.userName)}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">
                          {l.approvedBy ? `Reviewed by ${l.approvedBy}` : "Completed"}
                        </span>
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
