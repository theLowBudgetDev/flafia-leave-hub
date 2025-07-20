// Mock API service for leave management system

export interface LeaveRequest {
  id: number;
  staffId: string;
  staffName: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectedReason?: string;
}

// Mock data
const leaveRequests: LeaveRequest[] = [
  {
    id: 1,
    staffId: "staff-1",
    staffName: "Dr. Sarah Johnson",
    department: "Computer Science",
    type: "Annual Leave",
    startDate: "2024-12-23",
    endDate: "2024-12-30",
    days: 7,
    reason: "Family vacation",
    status: "Approved",
    appliedDate: "2024-11-15",
    approvedBy: "Admin User",
    approvedDate: "2024-11-20"
  },
  {
    id: 2,
    staffId: "staff-1",
    staffName: "Dr. Sarah Johnson",
    department: "Computer Science",
    type: "Sick Leave",
    startDate: "2024-11-15",
    endDate: "2024-11-15",
    days: 1,
    reason: "Medical appointment",
    status: "Pending",
    appliedDate: "2024-11-10"
  },
  {
    id: 3,
    staffId: "staff-1",
    staffName: "Dr. Sarah Johnson",
    department: "Computer Science",
    type: "Personal Leave",
    startDate: "2024-10-20",
    endDate: "2024-10-21",
    days: 2,
    reason: "Family emergency",
    status: "Approved",
    appliedDate: "2024-10-15",
    approvedBy: "Admin User",
    approvedDate: "2024-10-16"
  }
];

// Staff data
export interface Staff {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  totalLeave: number;
  usedLeave: number;
  pendingLeave: number;
}

const staffMembers: Staff[] = [
  {
    id: "staff-1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@fulafia.edu.ng",
    department: "Computer Science",
    position: "Senior Lecturer",
    totalLeave: 25,
    usedLeave: 8,
    pendingLeave: 2
  },
  {
    id: "staff-2",
    name: "Prof. Michael Adams",
    email: "michael.adams@fulafia.edu.ng",
    department: "Mathematics",
    position: "Professor",
    totalLeave: 30,
    usedLeave: 12,
    pendingLeave: 3
  },
  {
    id: "staff-3",
    name: "Dr. Fatima Ali",
    email: "fatima.ali@fulafia.edu.ng",
    department: "Physics",
    position: "Associate Professor",
    totalLeave: 25,
    usedLeave: 5,
    pendingLeave: 0
  }
];

// API functions
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  // Leave requests
  getLeaveRequests: async (staffId?: string): Promise<LeaveRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (staffId) {
      return leaveRequests.filter(request => request.staffId === staffId);
    }
    return leaveRequests;
  },

  getLeaveRequestById: async (id: number): Promise<LeaveRequest | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return leaveRequests.find(request => request.id === id);
  },

  createLeaveRequest: async (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>): Promise<LeaveRequest> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRequest: LeaveRequest = {
      ...request,
      id: leaveRequests.length + 1,
      appliedDate: new Date().toISOString().split('T')[0],
      status: "Pending"
    };
    leaveRequests.push(newRequest);
    return newRequest;
  },

  updateLeaveRequestStatus: async (id: number, status: "Approved" | "Rejected", approvedBy?: string, rejectedReason?: string): Promise<LeaveRequest | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const request = leaveRequests.find(req => req.id === id);
    if (request) {
      request.status = status;
      if (status === "Approved") {
        request.approvedBy = approvedBy;
        request.approvedDate = new Date().toISOString().split('T')[0];
      } else if (status === "Rejected") {
        request.rejectedReason = rejectedReason;
      }
      return request;
    }
    return undefined;
  },

  // Staff
  getStaffMembers: async (): Promise<Staff[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return staffMembers;
  },

  getStaffById: async (id: string): Promise<Staff | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return staffMembers.find(staff => staff.id === id);
  },

  // Stats
  getLeaveStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      totalApplications: 1247,
      pendingApproval: 23,
      approvedThisMonth: 189,
      processingTime: "2.3 days"
    };
  },

  getStaffStats: async (staffId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const staff = staffMembers.find(s => s.id === staffId);
    if (!staff) {
      throw new Error("Staff not found");
    }
    return {
      totalLeave: staff.totalLeave,
      usedLeave: staff.usedLeave,
      pendingLeave: staff.pendingLeave,
      remainingLeave: staff.totalLeave - staff.usedLeave
    };
  }
};