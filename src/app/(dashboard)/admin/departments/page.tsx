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
  Mail,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  X,
  Briefcase,
  UserMinus,
  CheckCircle2,
  Calendar,
  Search,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_DEPARTMENTS, MOCK_USERS, MockDepartment, MockUser } from "@/lib/mock-data";
import { Role, UserStatus } from "@prisma/client";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<MockDepartment[]>(MOCK_DEPARTMENTS);
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);
  const [isAddingDept, setIsAddingDept] = useState(false);

  // Selected department for viewing details & members
  const [selectedDept, setSelectedDept] = useState<MockDepartment | null>(null);

  // Department selected for deletion
  const [deptToDelete, setDeptToDelete] = useState<MockDepartment | null>(null);

  // Add staff modal state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffMode, setStaffMode] = useState<"ASSIGN_EXISTING" | "CREATE_NEW">("ASSIGN_EXISTING");
  const [selectedExistingUserId, setSelectedExistingUserId] = useState<string>("");

  // New employee inline form
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffDesignation, setNewStaffDesignation] = useState("");
  const [newStaffRole, setNewStaffRole] = useState<Role>(Role.STAFF);

  // Add department form state
  const [deptName, setDeptName] = useState("");
  const [deptManagerName, setDeptManagerName] = useState("");
  const [deptManagerEmail, setDeptManagerEmail] = useState("");
  const [deptBudget, setDeptBudget] = useState("");
  const [deptDescription, setDeptDescription] = useState("");

  // Roster search filter
  const [rosterSearch, setRosterSearch] = useState("");

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName || !deptManagerName || !deptManagerEmail) {
      toast.error("Please fill in department name and lead details.");
      return;
    }

    const newDept: MockDepartment = {
      id: `dept-${Date.now()}`,
      name: deptName,
      description: deptDescription,
      managerName: deptManagerName,
      managerEmail: deptManagerEmail,
      memberCount: 0,
      budget: deptBudget || "$120,000 / yr",
    };

    setDepartments([...departments, newDept]);
    toast.success(`Department "${deptName}" created successfully!`);
    setIsAddingDept(false);
    setDeptName("");
    setDeptManagerName("");
    setDeptManagerEmail("");
    setDeptBudget("");
    setDeptDescription("");
  };

  // Get active members of the currently selected department
  const currentDeptMembers = selectedDept
    ? users.filter((u) => u.departmentName === selectedDept.name)
    : [];

  const filteredRoster = currentDeptMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(rosterSearch.toLowerCase()) ||
      m.designation.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  // Candidates who can be reassigned to this department
  const eligibleExistingUsers = selectedDept
    ? users.filter((u) => u.departmentName !== selectedDept.name)
    : [];

  // Assign existing staff member
  const handleAssignExistingStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept || !selectedExistingUserId) {
      toast.error("Please select an employee to assign.");
      return;
    }

    const targetUser = users.find((u) => u.id === selectedExistingUserId);
    if (!targetUser) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedExistingUserId
          ? {
              ...u,
              departmentName: selectedDept.name,
              departmentId: selectedDept.id,
            }
          : u
      )
    );

    // Update memberCount
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === selectedDept.id ? { ...d, memberCount: d.memberCount + 1 } : d
      )
    );

    toast.success(`Assigned ${targetUser.name} to ${selectedDept.name}!`);
    setIsAddStaffOpen(false);
    setSelectedExistingUserId("");
  };

  // Create & assign a brand new employee
  const handleCreateNewStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept || !newStaffName || !newStaffEmail || !newStaffDesignation) {
      toast.error("Please fill in all required employee fields.");
      return;
    }

    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      designation: newStaffDesignation,
      status: UserStatus.ACTIVE,
      departmentId: selectedDept.id,
      departmentName: selectedDept.name,
      joinDate: new Date().toISOString().split("T")[0],
    };

    setUsers([newUser, ...users]);

    setDepartments((prev) =>
      prev.map((d) =>
        d.id === selectedDept.id ? { ...d, memberCount: d.memberCount + 1 } : d
      )
    );

    toast.success(`Created and added ${newStaffName} to ${selectedDept.name}!`);
    setIsAddStaffOpen(false);
    setNewStaffName("");
    setNewStaffEmail("");
    setNewStaffDesignation("");
    setNewStaffRole(Role.STAFF);
  };

  // Remove / Reassign member out of department
  const handleRemoveMember = (userId: string, userName: string) => {
    if (!selectedDept) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              departmentName: "Unassigned",
              departmentId: "unassigned",
            }
          : u
      )
    );

    setDepartments((prev) =>
      prev.map((d) =>
        d.id === selectedDept.id
          ? { ...d, memberCount: Math.max(0, d.memberCount - 1) }
          : d
      )
    );

    toast.info(`Removed ${userName} from ${selectedDept.name} (moved to Unassigned)`);
  };

  // Delete department permanently
  const handleConfirmDelete = () => {
    if (!deptToDelete) return;

    const targetId = deptToDelete.id;
    const targetName = deptToDelete.name;

    // 1. Remove department from state
    setDepartments((prev) => prev.filter((d) => d.id !== targetId));

    // 2. Reassign members of this department to Unassigned
    setUsers((prev) =>
      prev.map((u) =>
        u.departmentName === targetName
          ? {
              ...u,
              departmentName: "Unassigned",
              departmentId: "unassigned",
            }
          : u
      )
    );

    // 3. If currently viewing this department in the roster modal, close it
    if (selectedDept?.id === targetId) {
      setSelectedDept(null);
      setIsAddStaffOpen(false);
    }

    toast.success(`Department "${targetName}" deleted successfully.`);
    setDeptToDelete(null);
  };

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return "destructive";
      case Role.HR_MANAGER:
        return "info";
      case Role.MANAGER:
        return "success";
      case Role.STAFF:
      default:
        return "secondary";
    }
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
              Configure organizational business units, inspect departmental teams, allocate budgets, and assign personnel.
            </p>
          </div>
          <Button
            onClick={() => setIsAddingDept(!isAddingDept)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/25 gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {isAddingDept ? "Close Form" : "Add Department"}
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
              Assigned Department Heads
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
              {users.filter((u) => u.departmentName !== "Unassigned").length} Employees
            </div>
            <p className="text-xs text-muted-foreground mt-1">Mapped to business divisions</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Department Drawer */}
      {isAddingDept && (
        <Card className="border-primary/40 bg-card shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Create New Department
            </CardTitle>
            <CardDescription>Setup an organizational unit and designate reporting structure</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Department Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Legal & Compliance"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Annual Budget</label>
                  <input
                    type="text"
                    placeholder="e.g. $180,000 / yr"
                    value={deptBudget}
                    onChange={(e) => setDeptBudget(e.target.value)}
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
                    value={deptManagerName}
                    onChange={(e) => setDeptManagerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Head Email</label>
                  <input
                    type="email"
                    required
                    placeholder="christine@company.com"
                    value={deptManagerEmail}
                    onChange={(e) => setDeptManagerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Description & Scope</label>
                <textarea
                  rows={2}
                  placeholder="Primary mission, functional responsibilities, and team objectives..."
                  value={deptDescription}
                  onChange={(e) => setDeptDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddingDept(false)}>
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
        {departments.map((dept) => {
          const liveMemberCount = users.filter((u) => u.departmentName === dept.name).length;

          return (
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
                    {liveMemberCount} Members
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

                <div className="flex items-center justify-between pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeptToDelete(dept)}
                    className="text-xs h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedDept(dept);
                      setRosterSearch("");
                    }}
                    className="text-xs h-8 gap-1.5 hover:bg-primary hover:text-primary-foreground transition group"
                  >
                    <span>View Details & Roster</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* DEPARTMENT DETAILS & ROSTER MODAL */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-border/70 flex items-start justify-between bg-muted/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold text-foreground">{selectedDept.name}</h2>
                    <Badge variant="secondary" className="text-xs font-mono">
                      {currentDeptMembers.length} Employees
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                    {selectedDept.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      Head: <strong className="text-foreground">{selectedDept.managerName}</strong> ({selectedDept.managerEmail})
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      Budget: <strong className="text-foreground font-mono">{selectedDept.budget}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedDept(null);
                  setIsAddStaffOpen(false);
                }}
                className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Actions & Search Bar */}
            <div className="p-5 border-b border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 bg-background">
              <div className="relative flex-1 w-full max-w-xs">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter team roster..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <Button
                size="sm"
                onClick={() => setIsAddStaffOpen(true)}
                className="w-full sm:w-auto gap-1.5 text-xs bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm shadow-primary/20"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add Staff to {selectedDept.name}
              </Button>
            </div>

            {/* Roster Table */}
            <div className="flex-1 overflow-y-auto p-6">
              {filteredRoster.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-border/70 rounded-2xl">
                  <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-foreground">No Staff Members Found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {rosterSearch
                      ? "No department members match your search filter."
                      : `No employees currently assigned to the ${selectedDept.name} department.`}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddStaffOpen(true)}
                    className="mt-4 text-xs gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Assign First Staff Member
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Employee</th>
                        <th className="py-2.5 px-3">Designation</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Joined Date</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {filteredRoster.map((member) => (
                        <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                {member.name[0]}
                              </div>
                              <div>
                                <div className="font-semibold text-foreground">{member.name}</div>
                                <div className="text-[11px] text-muted-foreground">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-foreground font-medium">{member.designation}</td>
                          <td className="py-3 px-3">
                            <Badge variant={getRoleBadgeVariant(member.role)} className="text-[10px]">
                              {member.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-3">
                            <Badge
                              variant={member.status === UserStatus.ACTIVE ? "success" : "secondary"}
                              className="text-[10px]"
                            >
                              {member.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground font-mono">{member.joinDate}</td>
                          <td className="py-3 px-3 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveMember(member.id, member.name)}
                              className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 gap-1"
                            >
                              <UserMinus className="w-3 h-3" />
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border/70 flex items-center justify-between bg-muted/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeptToDelete(selectedDept)}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Department</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDept(null);
                  setIsAddStaffOpen(false);
                }}
              >
                Close Roster
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD STAFF MODAL (Assign existing OR create new employee) */}
      {isAddStaffOpen && selectedDept && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-7 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Add Staff to {selectedDept.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">Assign existing or create new employee</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddStaffOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-muted/50 rounded-xl">
              <button
                type="button"
                onClick={() => setStaffMode("ASSIGN_EXISTING")}
                className={`text-xs py-1.5 font-medium rounded-lg transition ${
                  staffMode === "ASSIGN_EXISTING"
                    ? "bg-card text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Assign Existing Employee
              </button>
              <button
                type="button"
                onClick={() => setStaffMode("CREATE_NEW")}
                className={`text-xs py-1.5 font-medium rounded-lg transition ${
                  staffMode === "CREATE_NEW"
                    ? "bg-card text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Create New Employee
              </button>
            </div>

            {staffMode === "ASSIGN_EXISTING" ? (
              <form onSubmit={handleAssignExistingStaff} className="space-y-4 mt-5">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Select Employee
                  </label>
                  {eligibleExistingUsers.length === 0 ? (
                    <p className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-xl border border-border/60">
                      All employees are already assigned to {selectedDept.name}.
                    </p>
                  ) : (
                    <select
                      value={selectedExistingUserId}
                      onChange={(e) => setSelectedExistingUserId(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value="">-- Choose an employee --</option>
                      {eligibleExistingUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} — {u.designation} (Current: {u.departmentName})
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    This will reassign their primary department to <strong>{selectedDept.name}</strong>.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsAddStaffOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!selectedExistingUserId || eligibleExistingUsers.length === 0}
                  >
                    Assign to Department
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateNewStaff} className="space-y-3 mt-5">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nathan Drake"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Company Email</label>
                  <input
                    type="email"
                    required
                    placeholder="nathan@company.com"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Designation</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Staff Specialist"
                      value={newStaffDesignation}
                      onChange={(e) => setNewStaffDesignation(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Access Role</label>
                    <select
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value as Role)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                    >
                      <option value={Role.STAFF}>STAFF</option>
                      <option value={Role.MANAGER}>MANAGER</option>
                      <option value={Role.HR_MANAGER}>HR_MANAGER</option>
                      <option value={Role.ADMIN}>ADMIN</option>
                    </select>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-[11px] text-foreground">
                  Department will automatically be set to <strong>{selectedDept.name}</strong>.
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsAddStaffOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Create & Assign
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deptToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-3xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4 border border-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-foreground">
              Delete Department &quot;{deptToDelete.name}&quot;?
            </h3>

            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Are you sure you want to delete this organizational department? This action will permanently remove the department from the organization directory.
            </p>

            {users.filter((u) => u.departmentName === deptToDelete.name).length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs">
                ⚠️ <strong>Notice:</strong> There are currently{" "}
                <strong>{users.filter((u) => u.departmentName === deptToDelete.name).length} employee(s)</strong> assigned to this department. Deleting it will safely reassign them to <strong>Unassigned</strong> so their user accounts and records remain preserved.
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-5 border-t border-border/60 mt-5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeptToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white gap-1.5 shadow-sm shadow-rose-600/25"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Yes, Delete Department
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
