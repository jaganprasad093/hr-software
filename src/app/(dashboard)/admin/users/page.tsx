"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserPlus,
  Search,
  Shield,
  Briefcase,
  Mail,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import { MOCK_USERS, MockUser } from "@/lib/mock-data";
import { Role, UserStatus } from "@prisma/client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAddingUser, setIsAddingUser] = useState(false);

  // New user form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>(Role.STAFF);
  const [newDesignation, setNewDesignation] = useState("");
  const [newDepartment, setNewDepartment] = useState("Engineering");

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newDesignation) {
      toast.error("Please fill in all employee fields.");
      return;
    }

    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      name: newName,
      email: newEmail,
      role: newRole,
      designation: newDesignation,
      status: UserStatus.ACTIVE,
      departmentId: "dept-eng",
      departmentName: newDepartment,
      joinDate: new Date().toISOString().split("T")[0],
    };

    setUsers([newUser, ...users]);
    toast.success(`Account created for ${newName} with role ${newRole}!`);
    setIsAddingUser(false);
    setNewName("");
    setNewEmail("");
    setNewDesignation("");
  };

  const toggleUserStatus = (id: string, currentStatus: UserStatus, name: string) => {
    const nextStatus =
      currentStatus === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u))
    );
    toast.info(`Updated status for ${name} to ${nextStatus}`);
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

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
              Identity & Governance
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">User Directory & Role RBAC</h1>
            <p className="mt-2 text-indigo-200 text-sm max-w-xl">
              Provision employee accounts, assign organizational security roles, manage password policies, and monitor active logins.
            </p>
          </div>
          <Button
            onClick={() => setIsAddingUser(!isAddingUser)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/25 gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {isAddingUser ? "Close Form" : "Add Employee"}
          </Button>
        </div>
      </div>

      {/* Role Counts Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Accounts
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{users.length} Users</div>
            <p className="text-xs text-muted-foreground mt-1">Across 4 departments</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Administrators
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {users.filter((u) => u.role === Role.ADMIN).length} Admin
            </div>
            <p className="text-xs text-muted-foreground mt-1">Full system root privileges</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              HR & People Leads
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {users.filter((u) => u.role === Role.HR_MANAGER).length} HR Lead
            </div>
            <p className="text-xs text-muted-foreground mt-1">Payroll & leave authority</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Status
            </CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {users.filter((u) => u.status === UserStatus.ACTIVE).length} Active
            </div>
            <p className="text-xs text-muted-foreground mt-1">100% login enabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Employee Form Drawer */}
      {isAddingUser && (
        <Card className="border-primary/40 bg-card shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Provision New Employee Account
            </CardTitle>
            <CardDescription>
              Create credentials and assign organizational role with NextAuth authorization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rachel Scott"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Company Email</label>
                  <input
                    type="email"
                    required
                    placeholder="rachel@company.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Role Permission</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as Role)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value={Role.STAFF}>STAFF (Workplace & Self Portal)</option>
                    <option value={Role.MANAGER}>MANAGER (Team & Leave Approvals)</option>
                    <option value={Role.HR_MANAGER}>HR_MANAGER (Payroll & Org Wide)</option>
                    <option value={Role.ADMIN}>ADMIN (Full Control Center)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Job Designation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cloud Infrastructure Engineer"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Department</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddingUser(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Account</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, designation, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", Role.ADMIN, Role.HR_MANAGER, Role.MANAGER, Role.STAFF].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`text-xs px-3.5 py-2 rounded-xl font-medium transition ${
                roleFilter === role
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              {role === "ALL" ? "All Roles" : role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Registered Accounts
          </CardTitle>
          <CardDescription>All accounts registered in the PostgreSQL / NextAuth database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/80 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Security Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {u.name[0]}
                        </div>
                        <div>
                          <div>{u.name}</div>
                          <div className="text-[11px] text-muted-foreground font-normal">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={getRoleBadgeVariant(u.role)}>{u.role}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-foreground">{u.departmentName}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{u.designation}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{u.joinDate}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={u.status === UserStatus.ACTIVE ? "success" : "secondary"}>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleUserStatus(u.id, u.status, u.name)}
                        className="h-7 text-xs"
                      >
                        {u.status === UserStatus.ACTIVE ? "Deactivate" : "Activate"}
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
