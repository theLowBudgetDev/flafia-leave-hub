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
  phone: string;
  annualLeave: number;
  sickLeave: number;
  maternityLeave: number;
  paternityLeave: number;
  emergencyLeave: number;
}

export interface Notification {
  id: string;
  staffId: string;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
  // Rich notification fields for frontend
  title?: string;
  time?: string;
  unread?: boolean;
  link?: string;
  relatedRequestId?: number;
}

export interface Settings {
  staffId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  leaveUpdates: boolean;
  systemAlerts: boolean;
}


export const api = {
  getNotifications: async (staffId: string): Promise<Notification[]> => {
    const response = await fetch(`${API_BASE_URL}/notifications?staffId=${staffId}`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },

  markNotificationRead: async (id: string, read: boolean): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read })
    });
    return response.ok;
  },

  deleteNotification: async (id: string): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  },

  getSettings: async (staffId: string): Promise<Settings> => {
    const response = await fetch(`${API_BASE_URL}/settings?staffId=${staffId}`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  saveSettings: async (settings: Settings): Promise<Settings> => {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to save settings');
    return response.json();
  },

  login: async (email: string, password: string) => {
    // Implement login API call if needed
    return { success: true };
  },

  getLeaveRequests: async (staffId?: string): Promise<LeaveRequest[]> => {
    try {
      const url = staffId 
        ? `${API_BASE_URL}/leave-requests?staffId=${staffId}`
        : `${API_BASE_URL}/leave-requests`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch leave requests: ${errorText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }
  },

  getLeaveRequestById: async (id: number): Promise<LeaveRequest | undefined> => {
    const response = await fetch(`${API_BASE_URL}/leave-requests/${id}`);
    if (!response.ok) return undefined;
    return response.json();
  },

  createLeaveRequest: async (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>): Promise<LeaveRequest> => {
    try {
      console.log('Sending leave request:', request);
      const response = await fetch(`${API_BASE_URL}/leave-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to create leave request: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Leave request created successfully:', result);
      return result;
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw error;
    }
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
  },

  createStaff: async (staffData: Omit<Staff, 'id' | 'usedLeave' | 'pendingLeave'>): Promise<Staff> => {
    try {
      const response = await fetch(`${API_BASE_URL}/staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...staffData,
          usedLeave: 0,
          pendingLeave: 0
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create staff: ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  },

  updateStaff: async (id: string, staffData: Partial<Omit<Staff, 'id'>>): Promise<Staff> => {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update staff: ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  },

  deleteStaff: async (id: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete staff: ${errorText}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }
  }
};
