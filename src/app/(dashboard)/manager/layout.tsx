import React from "react";
import { getServerAuthSession } from "@/lib/auth";
import { getDefaultDashboardPath } from "@/lib/rbac";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  const allowedRoles: Role[] = [Role.ADMIN, Role.HR_MANAGER, Role.MANAGER];
  if (!allowedRoles.includes(session.user.role)) {
    redirect(getDefaultDashboardPath(session.user.role));
  }

  return <>{children}</>;
}
