import { Role, UserStatus, AttendanceStatus, LeaveType, LeaveStatus, PayrollStatus } from "@prisma/client";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  designation: string;
  status: UserStatus;
  departmentId: string;
  departmentName: string;
  managerId?: string;
  managerName?: string;
  joinDate: string;
}

export interface MockAttendance {
  id: string;
  userId: string;
  userName: string;
  departmentName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  workHours: string;
  location: string;
  notes?: string;
}

export interface MockLeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  departmentName: string;
  startDate: string;
  endDate: string;
  days: number;
  type: LeaveType;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
}

export interface MockPayslip {
  id: string;
  userId: string;
  userName: string;
  month: string;
  year: number;
  basic: number;
  hra: number;
  allowances: number;
  deductions: number;
  grossPay: number;
  netPay: number;
  presentDays: number;
  totalWorkingDays: number;
  status: PayrollStatus;
  paymentDate: string;
}

export interface MockDepartment {
  id: string;
  name: string;
  description: string;
  managerName: string;
  managerEmail: string;
  memberCount: number;
  budget: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "user-1",
    name: "Alex Sterling",
    email: "admin@company.com",
    role: Role.ADMIN,
    designation: "Chief Information Officer",
    status: UserStatus.ACTIVE,
    departmentId: "dept-ops",
    departmentName: "Operations",
    joinDate: "2023-01-15",
  },
  {
    id: "user-2",
    name: "Sarah Jenkins",
    email: "hr@company.com",
    role: Role.HR_MANAGER,
    designation: "Head of People & Culture",
    status: UserStatus.ACTIVE,
    departmentId: "dept-hr",
    departmentName: "Human Resources",
    joinDate: "2023-03-01",
  },
  {
    id: "user-3",
    name: "David Miller",
    email: "manager@company.com",
    role: Role.MANAGER,
    designation: "VP of Engineering",
    status: UserStatus.ACTIVE,
    departmentId: "dept-eng",
    departmentName: "Engineering",
    joinDate: "2023-02-10",
  },
  {
    id: "user-4",
    name: "Maya Patel",
    email: "staff@company.com",
    role: Role.STAFF,
    designation: "Senior Frontend Engineer",
    status: UserStatus.ACTIVE,
    departmentId: "dept-eng",
    departmentName: "Engineering",
    managerId: "user-3",
    managerName: "David Miller",
    joinDate: "2023-06-15",
  },
  {
    id: "user-5",
    name: "Marcus Brody",
    email: "marcus@company.com",
    role: Role.STAFF,
    designation: "Backend Systems Engineer",
    status: UserStatus.ACTIVE,
    departmentId: "dept-eng",
    departmentName: "Engineering",
    managerId: "user-3",
    managerName: "David Miller",
    joinDate: "2023-08-01",
  },
  {
    id: "user-6",
    name: "Elena Vance",
    email: "elena@company.com",
    role: Role.STAFF,
    designation: "Product Designer",
    status: UserStatus.ACTIVE,
    departmentId: "dept-eng",
    departmentName: "Engineering",
    managerId: "user-3",
    managerName: "David Miller",
    joinDate: "2023-11-20",
  },
  {
    id: "user-7",
    name: "Jonathan Reyes",
    email: "jonathan@company.com",
    role: Role.STAFF,
    designation: "Growth Marketing Specialist",
    status: UserStatus.ACTIVE,
    departmentId: "dept-sales",
    departmentName: "Sales & Marketing",
    joinDate: "2024-01-10",
  },
];

export const MOCK_DEPARTMENTS: MockDepartment[] = [
  {
    id: "dept-eng",
    name: "Engineering",
    description: "Core software engineering, cloud architecture, and UI/UX design.",
    managerName: "David Miller",
    managerEmail: "manager@company.com",
    memberCount: 4,
    budget: "$480,000 / yr",
  },
  {
    id: "dept-hr",
    name: "Human Resources",
    description: "Talent acquisition, employee retention, culture, and statutory compliance.",
    managerName: "Sarah Jenkins",
    managerEmail: "hr@company.com",
    memberCount: 2,
    budget: "$150,000 / yr",
  },
  {
    id: "dept-sales",
    name: "Sales & Marketing",
    description: "Revenue generation, client acquisitions, demand gen, and advertising.",
    managerName: "Jonathan Reyes",
    managerEmail: "jonathan@company.com",
    memberCount: 3,
    budget: "$260,000 / yr",
  },
  {
    id: "dept-ops",
    name: "Operations & IT",
    description: "Cloud infrastructure, physical workplace security, and internal systems.",
    managerName: "Alex Sterling",
    managerEmail: "admin@company.com",
    memberCount: 2,
    budget: "$200,000 / yr",
  },
];

export const MOCK_ATTENDANCES: MockAttendance[] = [
  {
    id: "att-1",
    userId: "user-4",
    userName: "Maya Patel",
    departmentName: "Engineering",
    date: "2026-09-14",
    checkIn: "09:05 AM",
    checkOut: null,
    status: AttendanceStatus.PRESENT,
    workHours: "6.5 hrs (Active)",
    location: "HQ - San Francisco (GPS Verified)",
    notes: "On-time arrival",
  },
  {
    id: "att-2",
    userId: "user-4",
    userName: "Maya Patel",
    departmentName: "Engineering",
    date: "2026-09-13",
    checkIn: "09:12 AM",
    checkOut: "06:15 PM",
    status: AttendanceStatus.PRESENT,
    workHours: "9.0 hrs",
    location: "HQ - San Francisco (GPS Verified)",
  },
  {
    id: "att-3",
    userId: "user-4",
    userName: "Maya Patel",
    departmentName: "Engineering",
    date: "2026-09-12",
    checkIn: "08:58 AM",
    checkOut: "05:45 PM",
    status: AttendanceStatus.PRESENT,
    workHours: "8.8 hrs",
    location: "HQ - San Francisco (GPS Verified)",
  },
  {
    id: "att-4",
    userId: "user-4",
    userName: "Maya Patel",
    departmentName: "Engineering",
    date: "2026-09-11",
    checkIn: "09:30 AM",
    checkOut: "06:00 PM",
    status: AttendanceStatus.PRESENT,
    workHours: "8.5 hrs",
    location: "Remote / VPN Verified",
    notes: "Approved remote day",
  },
  {
    id: "att-5",
    userId: "user-4",
    userName: "Maya Patel",
    departmentName: "Engineering",
    date: "2026-09-10",
    checkIn: null,
    checkOut: null,
    status: AttendanceStatus.ON_LEAVE,
    workHours: "0 hrs",
    location: "-",
    notes: "Approved Sick Leave",
  },
  {
    id: "att-6",
    userId: "user-5",
    userName: "Marcus Brody",
    departmentName: "Engineering",
    date: "2026-09-14",
    checkIn: "09:15 AM",
    checkOut: null,
    status: AttendanceStatus.PRESENT,
    workHours: "6.3 hrs (Active)",
    location: "HQ - San Francisco",
  },
  {
    id: "att-7",
    userId: "user-6",
    userName: "Elena Vance",
    departmentName: "Engineering",
    date: "2026-09-14",
    checkIn: "09:00 AM",
    checkOut: null,
    status: AttendanceStatus.PRESENT,
    workHours: "6.5 hrs (Active)",
    location: "HQ - San Francisco",
  },
  {
    id: "att-8",
    userId: "user-7",
    userName: "Jonathan Reyes",
    departmentName: "Sales & Marketing",
    date: "2026-09-14",
    checkIn: "09:40 AM",
    checkOut: null,
    status: AttendanceStatus.PRESENT,
    workHours: "5.8 hrs (Active)",
    location: "Remote - New York",
    notes: "Late arrival (Traffic)",
  },
  {
    id: "att-9",
    userId: "user-2",
    userName: "Sarah Jenkins",
    departmentName: "Human Resources",
    date: "2026-09-14",
    checkIn: "08:50 AM",
    checkOut: null,
    status: AttendanceStatus.PRESENT,
    workHours: "6.8 hrs (Active)",
    location: "HQ - San Francisco",
  },
  {
    id: "att-10",
    userId: "user-3",
    userName: "David Miller",
    departmentName: "Engineering",
    date: "2026-09-14",
    checkIn: "08:45 AM",
    checkOut: null,
    status: AttendanceStatus.PRESENT,
    workHours: "7.0 hrs (Active)",
    location: "HQ - San Francisco",
  },
];

export const MOCK_LEAVES: MockLeaveRequest[] = [
  {
    id: "leave-1",
    userId: "user-4",
    userName: "Maya Patel",
    userRole: "Senior Frontend Engineer",
    departmentName: "Engineering",
    startDate: "2026-09-20",
    endDate: "2026-09-23",
    days: 4,
    type: LeaveType.CASUAL,
    reason: "Attending annual family reunion and out-of-town travel",
    status: LeaveStatus.PENDING,
    appliedDate: "2026-09-12",
  },
  {
    id: "leave-2",
    userId: "user-5",
    userName: "Marcus Brody",
    userRole: "Backend Systems Engineer",
    departmentName: "Engineering",
    startDate: "2026-09-25",
    endDate: "2026-09-26",
    days: 2,
    type: LeaveType.PAID,
    reason: "Personal rest and relocation chores",
    status: LeaveStatus.PENDING,
    appliedDate: "2026-09-13",
  },
  {
    id: "leave-3",
    userId: "user-4",
    userName: "Maya Patel",
    userRole: "Senior Frontend Engineer",
    departmentName: "Engineering",
    startDate: "2026-08-14",
    endDate: "2026-08-15",
    days: 2,
    type: LeaveType.SICK,
    reason: "Severe viral fever and medical recovery",
    status: LeaveStatus.APPROVED,
    appliedDate: "2026-08-13",
    approvedBy: "David Miller",
  },
  {
    id: "leave-4",
    userId: "user-6",
    userName: "Elena Vance",
    userRole: "Product Designer",
    departmentName: "Engineering",
    startDate: "2026-07-01",
    endDate: "2026-07-05",
    days: 5,
    type: LeaveType.PAID,
    reason: "Summer vacation with family",
    status: LeaveStatus.APPROVED,
    appliedDate: "2026-06-20",
    approvedBy: "David Miller",
  },
  {
    id: "leave-5",
    userId: "user-7",
    userName: "Jonathan Reyes",
    userRole: "Growth Marketing Specialist",
    departmentName: "Sales & Marketing",
    startDate: "2026-09-18",
    endDate: "2026-09-19",
    days: 2,
    type: LeaveType.CASUAL,
    reason: "Attending client partner wedding",
    status: LeaveStatus.PENDING,
    appliedDate: "2026-09-14",
  },
];

export const MOCK_PAYSLIPS: MockPayslip[] = [
  {
    id: "ps-1",
    userId: "user-4",
    userName: "Maya Patel",
    month: "August",
    year: 2026,
    basic: 6500,
    hra: 2600,
    allowances: 1200,
    deductions: 850,
    grossPay: 10300,
    netPay: 9450,
    presentDays: 22,
    totalWorkingDays: 22,
    status: PayrollStatus.PAID,
    paymentDate: "2026-08-31",
  },
  {
    id: "ps-2",
    userId: "user-4",
    userName: "Maya Patel",
    month: "July",
    year: 2026,
    basic: 6500,
    hra: 2600,
    allowances: 1200,
    deductions: 850,
    grossPay: 10300,
    netPay: 9450,
    presentDays: 23,
    totalWorkingDays: 23,
    status: PayrollStatus.PAID,
    paymentDate: "2026-07-31",
  },
  {
    id: "ps-3",
    userId: "user-4",
    userName: "Maya Patel",
    month: "June",
    year: 2026,
    basic: 6500,
    hra: 2600,
    allowances: 1200,
    deductions: 850,
    grossPay: 10300,
    netPay: 9450,
    presentDays: 21,
    totalWorkingDays: 21,
    status: PayrollStatus.PAID,
    paymentDate: "2026-06-30",
  },
  {
    id: "ps-4",
    userId: "user-5",
    userName: "Marcus Brody",
    month: "August",
    year: 2026,
    basic: 6000,
    hra: 2400,
    allowances: 1000,
    deductions: 780,
    grossPay: 9400,
    netPay: 8620,
    presentDays: 22,
    totalWorkingDays: 22,
    status: PayrollStatus.PAID,
    paymentDate: "2026-08-31",
  },
  {
    id: "ps-5",
    userId: "user-3",
    userName: "David Miller",
    month: "August",
    year: 2026,
    basic: 9500,
    hra: 3800,
    allowances: 1800,
    deductions: 1350,
    grossPay: 15100,
    netPay: 13750,
    presentDays: 22,
    totalWorkingDays: 22,
    status: PayrollStatus.PAID,
    paymentDate: "2026-08-31",
  },
];
