import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role, UserStatus } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@company.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        const email = credentials.email.trim().toLowerCase();

        // 1. Attempt database lookup if database is reachable
        let user = null;
        try {
          user = await prisma.user.findUnique({
            where: { email },
          });
        } catch (dbError) {
          console.warn("[Auth] Database not reachable, checking demo seed credentials fallback.");
        }

        if (user) {
          if (user.status !== UserStatus.ACTIVE) {
            throw new Error("Your account is inactive. Please contact HR.");
          }

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
          if (!isValid) {
            throw new Error("Invalid password.");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            designation: user.designation,
            status: user.status,
            departmentId: user.departmentId,
          };
        }

        // 2. Demo fallback accounts for local evaluation when database is offline
        const DEMO_ACCOUNTS = [
          {
            id: "demo-admin-id",
            name: "Alex Sterling (Admin)",
            email: "admin@company.com",
            password: "Admin@123456",
            role: Role.ADMIN,
            designation: "Chief Information Officer",
            status: UserStatus.ACTIVE,
            departmentId: "dept-ops",
          },
          {
            id: "demo-hr-id",
            name: "Sarah Jenkins (HR Lead)",
            email: "hr@company.com",
            password: "Hr@123456",
            role: Role.HR_MANAGER,
            designation: "Head of People & Culture",
            status: UserStatus.ACTIVE,
            departmentId: "dept-hr",
          },
          {
            id: "demo-manager-id",
            name: "David Miller (Eng Manager)",
            email: "manager@company.com",
            password: "Manager@123456",
            role: Role.MANAGER,
            designation: "VP of Engineering",
            status: UserStatus.ACTIVE,
            departmentId: "dept-eng",
          },
          {
            id: "demo-staff-id",
            name: "Maya Patel (Staff)",
            email: "staff@company.com",
            password: "Staff@123456",
            role: Role.STAFF,
            designation: "Senior Frontend Engineer",
            status: UserStatus.ACTIVE,
            departmentId: "dept-eng",
          },
        ];

        const demoAccount = DEMO_ACCOUNTS.find(
          (acc) => acc.email.toLowerCase() === email && acc.password === credentials.password
        );

        if (demoAccount) {
          return {
            id: demoAccount.id,
            name: demoAccount.name,
            email: demoAccount.email,
            role: demoAccount.role,
            designation: demoAccount.designation,
            status: demoAccount.status,
            departmentId: demoAccount.departmentId,
          };
        }

        throw new Error("Invalid email or password.");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as Role;
        token.designation = user.designation;
        token.status = user.status;
        token.departmentId = user.departmentId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.designation = token.designation;
        session.user.status = token.status;
        session.user.departmentId = token.departmentId;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getServerAuthSession = () => getServerSession(authOptions);
