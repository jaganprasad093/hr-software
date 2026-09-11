import { Role, UserStatus } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: Role;
    designation?: string | null;
    status: UserStatus;
    departmentId?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: Role;
      designation?: string | null;
      status: UserStatus;
      departmentId?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    designation?: string | null;
    status: UserStatus;
    departmentId?: string | null;
  }
}
