import { getServerAuthSession } from "@/lib/auth";
import { getDefaultDashboardPath } from "@/lib/rbac";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  const destination = getDefaultDashboardPath(session.user.role);
  redirect(destination);
}
