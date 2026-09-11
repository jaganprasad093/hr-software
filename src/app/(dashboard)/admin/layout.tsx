import React from "react";
import { getServerAuthSession } from "@/lib/auth";
import { getDefaultDashboardPath } from "@/lib/rbac";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== Role.ADMIN) {
    redirect(getDefaultDashboardPath(session.user.role));
  }

  return <>{children}</>;
}
