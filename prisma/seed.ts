import { PrismaClient, Role, UserStatus, AttendanceStatus, LeaveType, LeaveStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Clear existing records in reverse dependency order
  await prisma.payslip.deleteMany();
  await prisma.payrollRun.deleteMany();
  await prisma.salaryStructure.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.leaveQuota.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  console.log("🧹 Cleared existing data.");

  // 2. Hash default passwords
  const adminPassword = await bcrypt.hash("Admin@123456", 10);
  const hrPassword = await bcrypt.hash("Hr@123456", 10);
  const managerPassword = await bcrypt.hash("Manager@123456", 10);
  const staffPassword = await bcrypt.hash("Staff@123456", 10);

  // 3. Create Departments first (unassigned manager initially)
  const engDept = await prisma.department.create({
    data: {
      name: "Engineering",
      description: "Software engineering, product development, and technical infrastructure",
    },
  });

  const hrDept = await prisma.department.create({
    data: {
      name: "Human Resources",
      description: "Talent acquisition, employee relations, culture, and compliance",
    },
  });

  const salesDept = await prisma.department.create({
    data: {
      name: "Sales & Marketing",
      description: "Customer acquisition, digital marketing, and client accounts",
    },
  });

  const opsDept = await prisma.department.create({
    data: {
      name: "Operations",
      description: "Business operations, facilities, logistics, and IT support",
    },
  });

  console.log("🏢 Created departments.");

  // 4. Create Core Users
  const adminUser = await prisma.user.create({
    data: {
      name: "Alex Sterling (Admin)",
      email: "admin@company.com",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      designation: "Chief Information Officer",
      status: UserStatus.ACTIVE,
      departmentId: opsDept.id,
    },
  });

  const hrUser = await prisma.user.create({
    data: {
      name: "Sarah Jenkins (HR Lead)",
      email: "hr@company.com",
      passwordHash: hrPassword,
      role: Role.HR_MANAGER,
      designation: "Head of People & Culture",
      status: UserStatus.ACTIVE,
      departmentId: hrDept.id,
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      name: "David Miller (Eng Manager)",
      email: "manager@company.com",
      passwordHash: managerPassword,
      role: Role.MANAGER,
      designation: "VP of Engineering",
      status: UserStatus.ACTIVE,
      departmentId: engDept.id,
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      name: "Maya Patel (Staff)",
      email: "staff@company.com",
      passwordHash: staffPassword,
      role: Role.STAFF,
      designation: "Senior Frontend Engineer",
      status: UserStatus.ACTIVE,
      departmentId: engDept.id,
      managerId: managerUser.id,
    },
  });

  const staffUser2 = await prisma.user.create({
    data: {
      name: "Marcus Brody (Staff)",
      email: "marcus@company.com",
      passwordHash: staffPassword,
      role: Role.STAFF,
      designation: "Backend Systems Engineer",
      status: UserStatus.ACTIVE,
      departmentId: engDept.id,
      managerId: managerUser.id,
    },
  });

  // Assign department managers
  await prisma.department.update({
    where: { id: hrDept.id },
    data: { managerId: hrUser.id },
  });
  await prisma.department.update({
    where: { id: engDept.id },
    data: { managerId: managerUser.id },
  });

  console.log("👥 Created users and assigned managers.");

  // 5. Seed Leave Quotas for current year
  const currentYear = new Date().getFullYear();
  await prisma.leaveQuota.createMany({
    data: [
      { year: currentYear, type: LeaveType.CASUAL, totalDays: 12 },
      { year: currentYear, type: LeaveType.SICK, totalDays: 10 },
      { year: currentYear, type: LeaveType.PAID, totalDays: 18 },
      { year: currentYear, type: LeaveType.UNPAID, totalDays: 30 },
    ],
  });

  // 6. Seed Salary Structures
  await prisma.salaryStructure.createMany({
    data: [
      {
        userId: adminUser.id,
        basic: 120000,
        hra: 48000,
        allowances: 25000,
        deductions: 8000,
      },
      {
        userId: hrUser.id,
        basic: 85000,
        hra: 34000,
        allowances: 15000,
        deductions: 5000,
      },
      {
        userId: managerUser.id,
        basic: 95000,
        hra: 38000,
        allowances: 18000,
        deductions: 6000,
      },
      {
        userId: staffUser.id,
        basic: 65000,
        hra: 26000,
        allowances: 12000,
        deductions: 4000,
      },
      {
        userId: staffUser2.id,
        basic: 60000,
        hra: 24000,
        allowances: 10000,
        deductions: 3500,
      },
    ],
  });

  // 7. Seed Sample Attendance records for this week
  const today = new Date();
  const day1 = new Date(today);
  day1.setDate(today.getDate() - 2);
  const day2 = new Date(today);
  day2.setDate(today.getDate() - 1);

  await prisma.attendance.createMany({
    data: [
      {
        userId: staffUser.id,
        date: new Date(day1.toISOString().split("T")[0]),
        checkIn: new Date(day1.setHours(9, 5, 0, 0)),
        checkOut: new Date(day1.setHours(17, 35, 0, 0)),
        status: AttendanceStatus.PRESENT,
        notes: "On-time arrival",
      },
      {
        userId: staffUser.id,
        date: new Date(day2.toISOString().split("T")[0]),
        checkIn: new Date(day2.setHours(9, 15, 0, 0)),
        checkOut: new Date(day2.setHours(18, 0, 0, 0)),
        status: AttendanceStatus.PRESENT,
      },
      {
        userId: staffUser2.id,
        date: new Date(day1.toISOString().split("T")[0]),
        checkIn: new Date(day1.setHours(9, 30, 0, 0)),
        checkOut: new Date(day1.setHours(18, 15, 0, 0)),
        status: AttendanceStatus.PRESENT,
      },
      {
        userId: staffUser2.id,
        date: new Date(day2.toISOString().split("T")[0]),
        status: AttendanceStatus.ABSENT,
        notes: "Marked absent by end-of-day scheduler",
      },
    ],
  });

  // 8. Seed Sample Leave Request
  const nextWeekStart = new Date(today);
  nextWeekStart.setDate(today.getDate() + 5);
  const nextWeekEnd = new Date(today);
  nextWeekEnd.setDate(today.getDate() + 7);

  await prisma.leaveRequest.create({
    data: {
      userId: staffUser.id,
      startDate: new Date(nextWeekStart.toISOString().split("T")[0]),
      endDate: new Date(nextWeekEnd.toISOString().split("T")[0]),
      type: LeaveType.CASUAL,
      reason: "Family gathering and personal commitments",
      status: LeaveStatus.PENDING,
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("-----------------------------------------");
  console.log("Demo Credentials:");
  console.log("Admin:      admin@company.com   / Admin@123456");
  console.log("HR Manager: hr@company.com      / Hr@123456");
  console.log("Manager:    manager@company.com / Manager@123456");
  console.log("Staff:      staff@company.com   / Staff@123456");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
