// API functions calling the new backend API server endpoints

const API_BASE_URL = 'http://localhost:4000/api';

export interface LeaveRequest {
  id: number;
  staffId: string;
  staffName?: string;
  department?: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  status: "Pending" | "Approved" | "Rejected";
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectedReason?: string;
}

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

export const api = {
  login: async (email: string, password: string) => {
    // Implement login API call if needed
    return { success: true };
  },

  getLeaveRequests: async (staffId?: string): Promise<LeaveRequest[]> => {
    if (!staffId) return [];
    const response = await fetch(`${API_BASE_URL}/leave-requests?staffId=${staffId}`);
    if (!response.ok) throw new Error('Failed to fetch leave requests');
    return response.json();
  },

  getLeaveRequestById: async (id: number): Promise<LeaveRequest | undefined> => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${id}`);
    if (!response.ok) return undefined;
    return response.json();
  },

  createLeaveRequest: async (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>): Promise<LeaveRequest> => {
    const response = await fetch(`${API_BASE_URL}/leave-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to create leave request');
    return response.json();
  },

  updateLeaveRequestStatus: async (id: number, status: "Approved" | "Rejected", approvedBy?: string, rejectedReason?: string): Promise<LeaveRequest | undefined> => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, approvedBy, rejectedReason }),
    });
    if (!response.ok) return undefined;
    return response.json();
  },

  getStaffMembers: async (): Promise<Staff[]> => {
    const response = await fetch(`${API_BASE_URL}/staff`);
    if (!response.ok) throw new Error('Failed to fetch staff members');
    return response.json();
  },

  getStaffById: async (id: string): Promise<Staff | undefined> => {
    const response = await fetch(`${API_BASE_URL}/staff/${id}`);
    if (!response.ok) return undefined;
    return response.json();
  },

  getLeaveStats: async () => {
    // Implement if backend endpoint available
    return {
      totalApplications: 1247,
      pendingApproval: 23,
      approvedThisMonth: 189,
      processingTime: "2.3 days"
    };
  },

  getStaffStats: async (staffId: string) => {
    const staff = await api.getStaffById(staffId);
    if (!staff) throw new Error("Staff not found");
    return {
      totalLeave: staff.totalLeave,
      usedLeave: staff.usedLeave,
      pendingLeave: staff.pendingLeave,
      remainingLeave: staff.totalLeave - staff.usedLeave
    };
  }
};
