"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  Play,
  Download,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_PAYSLIPS, MockPayslip } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { PayrollStatus } from "@prisma/client";

export default function HrPayrollPage() {
  const [payslips, setPayslips] = useState<MockPayslip[]>(MOCK_PAYSLIPS);
  const [isRunning, setIsRunning] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  const totalGross = payslips.reduce((acc, p) => acc + p.grossPay, 0);
  const totalNet = payslips.reduce((acc, p) => acc + p.netPay, 0);
  const totalDeductions = payslips.reduce((acc, p) => acc + p.deductions, 0);

  const handleRunPayroll = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setIsProcessed(true);
      toast.success("September 2026 Payroll Run executed successfully! Generated 5 payslips.");
    }, 1200);
  };

  const handleDownloadAll = () => {
    toast.success("Exported master payroll batch report and bank wire transfer instructions (ZIP/CSV)");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="mb-3 bg-white/20 text-white hover:bg-white/30 border-none">
              HR Payroll Operations
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">Enterprise Payroll Engine</h1>
            <p className="mt-2 text-purple-200 text-sm max-w-xl">
              Automatic CTC breakdown, attendance-linked pro-rata calculations, statutory PF/Tax withholdings, and bulk PDF generation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleDownloadAll}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2 rounded-xl"
            >
              <Download className="w-4 h-4" />
              Bank File
            </Button>
            <Button
              onClick={handleRunPayroll}
              disabled={isRunning}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 rounded-xl shadow-lg shadow-emerald-600/25 px-6"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Run Payroll
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Payroll Outflow
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(totalNet)}</div>
            <p className="text-xs text-muted-foreground mt-1">Net payable to employees</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Gross Wages
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(totalGross)}</div>
            <p className="text-xs text-muted-foreground mt-1">Pre-deduction earnings</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Statutory Withholdings
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{formatCurrency(totalDeductions)}</div>
            <p className="text-xs text-muted-foreground mt-1">PF, TDS & Health Ins.</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cycle Status
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {isProcessed ? "PROCESSED" : "READY"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">September 2026 Cycle</p>
          </CardContent>
        </Card>
      </div>

      {/* Salary Structures Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-primary" />
                Employee Payroll Ledger
              </CardTitle>
              <CardDescription>Individual breakdown for the active monthly billing cycle</CardDescription>
            </div>
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Formula Auto-Linked
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Cycle</th>
                  <th className="py-3 px-4">Basic Pay</th>
                  <th className="py-3 px-4">HRA + Allowances</th>
                  <th className="py-3 px-4">Gross Earnings</th>
                  <th className="py-3 px-4">Deductions</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {payslips.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {p.userName[0]}
                        </div>
                        <span>{p.userName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {p.month} {p.year}
                    </td>
                    <td className="py-3.5 px-4 font-mono">{formatCurrency(p.basic)}</td>
                    <td className="py-3.5 px-4 font-mono">{formatCurrency(p.hra + p.allowances)}</td>
                    <td className="py-3.5 px-4 font-semibold font-mono text-foreground">
                      {formatCurrency(p.grossPay)}
                    </td>
                    <td className="py-3.5 px-4 text-rose-600 font-mono">-{formatCurrency(p.deductions)}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 font-mono text-sm">
                      {formatCurrency(p.netPay)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success">{p.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success(`Downloaded payslip PDF for ${p.userName}`)}
                        className="h-7 text-xs gap-1"
                      >
                        <Download className="w-3 h-3" />
                        PDF
                      </Button>
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
