import { getServerAuthSession } from "@/lib/auth";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export const ROLE_GROUPS = {
  ADMIN_ONLY: [Role.ADMIN],
  HR_AND_ADMIN: [Role.ADMIN, Role.HR_MANAGER],
  MANAGERS_AND_ABOVE: [Role.ADMIN, Role.HR_MANAGER, Role.MANAGER],
  ALL_ROLES: [Role.ADMIN, Role.HR_MANAGER, Role.MANAGER, Role.STAFF],
} as const;

export interface AuthorizedContext {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    role: Role;
    designation?: string | null;
    departmentId?: string | null;
  };
}

/**
 * Server-side authorization check for API Route Handlers.
 * Returns either an error response (401 or 403) or the authorized session user context.
 */
export async function requireApiAuth(
  allowedRoles?: Role[]
): Promise<{ error: NextResponse | null; user: AuthorizedContext["user"] | null }> {
  const session = await getServerAuthSession();

  if (!session || !session.user || !session.user.id) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized: Please log in to access this resource." },
        { status: 401 }
      ),
      user: null,
    };
  }

  const user = session.user;

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return {
      error: NextResponse.json(
        {
          error: `Forbidden: Your role (${user.role}) does not have permission for this operation.`,
        },
        { status: 403 }
      ),
      user: null,
    };
  }

  return { error: null, user };
}

/**
 * Helper to determine default redirect path based on user role.
 */
export function getDefaultDashboardPath(role: Role): string {
  switch (role) {
    case Role.ADMIN:
      return "/admin";
    case Role.HR_MANAGER:
      return "/hr";
    case Role.MANAGER:
      return "/manager";
    case Role.STAFF:
    default:
      return "/staff";
  }
}
