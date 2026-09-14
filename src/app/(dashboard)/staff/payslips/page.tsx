"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  Download,
  Eye,
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  X,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_PAYSLIPS, MockPayslip } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function StaffPayslipsPage() {
  const [payslips] = useState<MockPayslip[]>(MOCK_PAYSLIPS.filter(p => p.userName === "Maya Patel"));
  const [selectedPayslip, setSelectedPayslip] = useState<MockPayslip | null>(null);

  const handleDownload = (payslip: MockPayslip) => {
    toast.success(`Generated and downloaded payslip PDF for ${payslip.month} ${payslip.year}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="mb-3 bg-white/20 text-white hover:bg-white/30 border-none">
              Compensation & Earnings
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">My Payslips</h1>
            <p className="mt-2 text-slate-300 text-sm max-w-xl">
              Access monthly electronic salary statements, statutory deductions, tax breakdowns, and payment proofs.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15">
            <div className="text-xs text-emerald-200 font-medium uppercase tracking-wider">Next Disbursal</div>
            <div className="text-2xl font-bold text-white mt-1">September 30, 2026</div>
            <div className="text-xs text-emerald-400 mt-0.5">Direct Bank Wire Transfer</div>
          </div>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Last Net Disbursed
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(9450)}</div>
            <p className="text-xs text-muted-foreground mt-1">August 2026 cycle</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Annual Base CTC
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(123600)}</div>
            <p className="text-xs text-muted-foreground mt-1">Senior Frontend Engineer</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              YTD Deductions
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(6800)}</div>
            <p className="text-xs text-muted-foreground mt-1">PF, Health & Statutory Tax</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Tax Regime
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">Standard</div>
            <p className="text-xs text-muted-foreground mt-1">Form 16 verified</p>
          </CardContent>
        </Card>
      </div>

      {/* Payslips Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Payslip Statements
          </CardTitle>
          <CardDescription>Verified salary slips generated by the HR Payroll Engine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Cycle</th>
                  <th className="py-3 px-4">Basic Pay</th>
                  <th className="py-3 px-4">HRA + Allowances</th>
                  <th className="py-3 px-4">Gross Total</th>
                  <th className="py-3 px-4">Deductions</th>
                  <th className="py-3 px-4">Net Salary</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {payslips.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      {p.month} {p.year}
                    </td>
                    <td className="py-3.5 px-4 text-foreground font-mono">{formatCurrency(p.basic)}</td>
                    <td className="py-3.5 px-4 text-foreground font-mono">
                      {formatCurrency(p.hra + p.allowances)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground font-mono">
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
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPayslip(p)}
                          className="h-8 text-xs gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(p)}
                          className="h-8 text-xs gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Payslip Preview Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-6 border-b border-border/70">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    P
                  </div>
                  <span className="text-xl font-bold">PulseHR</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Official Salary Disbursal Slip</p>
              </div>
              <button
                onClick={() => setSelectedPayslip(null)}
                className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Employee & Pay Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-border/70 text-xs">
              <div>
                <span className="text-muted-foreground">Employee Name</span>
                <div className="font-semibold text-foreground mt-0.5">{selectedPayslip.userName}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Period</span>
                <div className="font-semibold text-foreground mt-0.5">
                  {selectedPayslip.month} {selectedPayslip.year}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Designation</span>
                <div className="font-semibold text-foreground mt-0.5">Senior Frontend Engineer</div>
              </div>
              <div>
                <span className="text-muted-foreground">Working Days</span>
                <div className="font-semibold text-foreground mt-0.5">
                  {selectedPayslip.presentDays} / {selectedPayslip.totalWorkingDays} days
                </div>
              </div>
            </div>

            {/* Salary Breakdown */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earnings */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Earnings</h4>
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Basic Pay</span>
                    <span className="font-mono font-medium">{formatCurrency(selectedPayslip.basic)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">House Rent Allowance (HRA)</span>
                    <span className="font-mono font-medium">{formatCurrency(selectedPayslip.hra)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Special & Transit Allowance</span>
                    <span className="font-mono font-medium">{formatCurrency(selectedPayslip.allowances)}</span>
                  </div>
                  <div className="pt-2 border-t border-border/60 flex justify-between font-bold">
                    <span>Total Gross Earnings</span>
                    <span className="text-foreground">{formatCurrency(selectedPayslip.grossPay)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider">Deductions</h4>
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provident Fund (PF)</span>
                    <span className="font-mono font-medium">{formatCurrency(450)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Professional Tax & TDS</span>
                    <span className="font-mono font-medium">{formatCurrency(300)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Health Insurance Premium</span>
                    <span className="font-mono font-medium">{formatCurrency(100)}</span>
                  </div>
                  <div className="pt-2 border-t border-border/60 flex justify-between font-bold">
                    <span>Total Deductions</span>
                    <span className="text-rose-600">-{formatCurrency(selectedPayslip.deductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Total Card */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">Net Disbursed Amount</span>
                <div className="text-2xl font-extrabold text-emerald-600 mt-0.5">
                  {formatCurrency(selectedPayslip.netPay)}
                </div>
              </div>
              <Badge variant="success" className="px-3 py-1">Disbursed on {selectedPayslip.paymentDate}</Badge>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-border/70 mt-6">
              <Button variant="outline" onClick={() => setSelectedPayslip(null)}>
                Close
              </Button>
              <Button onClick={() => handleDownload(selectedPayslip)} className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
