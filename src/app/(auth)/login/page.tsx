"use client";

export const dynamic = "force-dynamic";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
  Briefcase,
  Laptop,
} from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      toast.error("Please provide both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setErrorMessage(result.error);
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      toast.success("Welcome back! Redirecting...");
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage("An unexpected authentication error occurred.");
      toast.error("Authentication failed.");
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (roleEmail: string, rolePass: string, roleName: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    toast.info(`Filled credentials for ${roleName}`);
  };

  return (
    <div className="glass-panel p-8 rounded-2xl shadow-xl shadow-indigo-950/5 relative">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Sign In</h2>
          <p className="text-xs text-muted-foreground">Enter your workplace credentials</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="w-3.5 h-3.5" />
          Role Guarded
        </span>
      </div>

      {errorMessage && (
        <div className="mb-5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-input bg-background/80 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-foreground mb-1.5" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-input bg-background/80 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-md shadow-primary/25 hover:bg-primary/95 active:scale-[0.99] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Fill Buttons */}
      <div className="mt-7 pt-6 border-t border-border/60">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Test Logins (Click to autofill)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              setDemoCredentials("admin@company.com", "Admin@123456", "System Administrator")
            }
            className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-border/80 bg-background/50 hover:bg-muted/70 hover:border-border text-foreground transition text-left"
          >
            <div className="w-6 h-6 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center flex-shrink-0">
              👑
            </div>
            <div className="truncate">
              <div className="font-semibold leading-tight">Admin</div>
              <div className="text-[10px] text-muted-foreground truncate">admin@company.com</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setDemoCredentials("hr@company.com", "Hr@123456", "HR Manager")
            }
            className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-border/80 bg-background/50 hover:bg-muted/70 hover:border-border text-foreground transition text-left"
          >
            <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 flex items-center justify-center flex-shrink-0">
              <Users className="w-3 h-3" />
            </div>
            <div className="truncate">
              <div className="font-semibold leading-tight">HR Manager</div>
              <div className="text-[10px] text-muted-foreground truncate">hr@company.com</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setDemoCredentials("manager@company.com", "Manager@123456", "Team Manager")
            }
            className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-border/80 bg-background/50 hover:bg-muted/70 hover:border-border text-foreground transition text-left"
          >
            <div className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-3 h-3" />
            </div>
            <div className="truncate">
              <div className="font-semibold leading-tight">Manager</div>
              <div className="text-[10px] text-muted-foreground truncate">manager@company.com</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              setDemoCredentials("staff@company.com", "Staff@123456", "Staff Employee")
            }
            className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-border/80 bg-background/50 hover:bg-muted/70 hover:border-border text-foreground transition text-left"
          >
            <div className="w-6 h-6 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center flex-shrink-0">
              <Laptop className="w-3 h-3" />
            </div>
            <div className="truncate">
              <div className="font-semibold leading-tight">Staff</div>
              <div className="text-[10px] text-muted-foreground truncate">staff@company.com</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen mesh-gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">PulseHR</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enterprise Workforce, Attendance & Payroll Management
          </p>
        </div>

        <Suspense
          fallback={
            <div className="glass-panel p-8 rounded-2xl flex items-center justify-center min-h-[300px]">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Protected by Role-Based Access Control & NextAuth.js
        </p>
      </div>
    </main>
  );
}
