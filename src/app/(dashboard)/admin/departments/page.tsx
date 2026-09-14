"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  PlusCircle,
  Users,
  DollarSign,
  Briefcase,
  Mail,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_DEPARTMENTS, MockDepartment } from "@/lib/mock-data";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<MockDepartment[]>(MOCK_DEPARTMENTS);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !managerName || !managerEmail) {
      toast.error("Please fill in department name and lead details.");
      return;
    }

    const newDept: MockDepartment = {
      id: `dept-${Date.now()}`,
      name,
      description,
      managerName,
      managerEmail,
      memberCount: 1,
      budget: budget || "$100,000 / yr",
    };

    setDepartments([...departments, newDept]);
    toast.success(`Department "${name}" created successfully!`);
    setIsAdding(false);
    setName("");
    setManagerName("");
    setManagerEmail("");
    setBudget("");
    setDescription("");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="mb-3 bg-white/20 text-white hover:bg-white/30 border-none">
              Organization Structure
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">Company Departments</h1>
            <p className="mt-2 text-indigo-200 text-sm max-w-xl">
              Configure organizational business units, assign department heads, monitor operating headcount, and allocate operational budgets.
            </p>
          </div>
          <Button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/25 gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {isAdding ? "Close Form" : "Add Department"}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Units
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{departments.length} Departments</div>
            <p className="text-xs text-muted-foreground mt-1">Across all business domains</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Assigned Managers
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{departments.length} Leads</div>
            <p className="text-xs text-muted-foreground mt-1">100% leadership assigned</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Staff Distributed
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {departments.reduce((acc, d) => acc + d.memberCount, 0)} Employees
            </div>
            <p className="text-xs text-muted-foreground mt-1">All members mapped</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Department Drawer */}
      {isAdding && (
        <Card className="border-primary/40 bg-card shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Create New Department
            </CardTitle>
            <CardDescription>Setup an organizational unit and designate reporting structure</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Department Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Legal & Compliance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Annual Budget</label>
                  <input
                    type="text"
                    placeholder="e.g. $180,000 / yr"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Department Head Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christine Vance"
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Head Email</label>
                  <input
                    type="email"
                    required
                    placeholder="christine@company.com"
                    value={managerEmail}
                    onChange={(e) => setManagerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Description & Scope</label>
                <textarea
                  rows={2}
                  placeholder="Primary mission, functional responsibilities, and team objectives..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Unit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id} className="border-border/80 shadow-sm hover:shadow-md transition">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    {dept.name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1 leading-relaxed">
                    {dept.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  {dept.memberCount} Members
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    Department Head
                  </span>
                  <span className="font-semibold text-foreground">{dept.managerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    Contact
                  </span>
                  <a href={`mailto:${dept.managerEmail}`} className="text-primary hover:underline">
                    {dept.managerEmail}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    Operating Budget
                  </span>
                  <span className="font-semibold text-foreground font-mono">{dept.budget}</span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info(`Viewing roster for ${dept.name}`)}
                  className="text-xs h-8 gap-1"
                >
                  View Details
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
