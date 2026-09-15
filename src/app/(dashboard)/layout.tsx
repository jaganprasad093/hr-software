import React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

// Prevent static prerendering — all dashboard pages require auth session at runtime
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
