import db from '../database';
import { LeaveRequest, Staff } from './api';

// Staff queries
export const getStaffById = (id: string): Staff | undefined => {
  const stmt = db.prepare('SELECT * FROM staff WHERE id = ?');
  const staff = stmt.get(id);
  return staff as Staff | undefined;
};

export const getAllStaff = (): Staff[] => {
  const stmt = db.prepare('SELECT * FROM staff');
  return stmt.all() as Staff[];
};

export const getStaffByEmail = (email: string): Staff | undefined => {
  const stmt = db.prepare('SELECT * FROM staff WHERE email = ?');
  const staff = stmt.get(email);
  return staff as Staff | undefined;
};

export const createStaff = (staff: Omit<Staff, 'id'> & { id?: string }): Staff => {
  // Generate a unique ID if not provided
  const id = staff.id || `staff-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  
  // Check if staff with this ID already exists
  const existing = getStaffById(id);
  if (existing) {
    return existing;
  }
  
  const stmt = db.prepare(`
    INSERT INTO staff (
      id, name, email, department, position, totalLeave, usedLeave, pendingLeave,
      phone, annualLeave, sickLeave, maternityLeave, paternityLeave, emergencyLeave
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    staff.name,
    staff.email,
    staff.department,
    staff.position,
    staff.totalLeave,
    staff.usedLeave ?? 0,
    staff.pendingLeave ?? 0,
    staff.phone ?? '',
    staff.annualLeave ?? 0,
    staff.sickLeave ?? 0,
    staff.maternityLeave ?? 0,
    staff.paternityLeave ?? 0,
    staff.emergencyLeave ?? 0
  );
  return getStaffById(id)!;
};

export const deleteStaff = (id: string): boolean => {
  const transaction = db.transaction(() => {
    // Delete related records first
    db.prepare('DELETE FROM leave_requests WHERE staffId = ?').run(id);
    db.prepare('DELETE FROM notifications WHERE staffId = ?').run(id);
    db.prepare('DELETE FROM settings WHERE staffId = ?').run(id);
    
    // Then delete the staff member
    const stmt = db.prepare('DELETE FROM staff WHERE id = ?');
    return stmt.run(id);
  });
  
  const info = transaction();
  return info.changes > 0;
};

// Notification queries
export interface Notification {
  id: string;
  staffId: string;
  type: string; // e.g., 'leave', 'system', etc.
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

export const getNotificationsByStaffId = (staffId: string): Notification[] => {
  const stmt = db.prepare('SELECT * FROM notifications WHERE staffId = ? ORDER BY createdAt DESC');
  const notifications = stmt.all(staffId) as Notification[];
  // Map to richer notification type
  return notifications.map((notif) => ({
    ...notif,
    title: notif.type === 'leave' ? 'Leave Notification' : notif.type === 'system' ? 'System Notification' : 'Notification',
    time: notif.createdAt,
    unread: !notif.read,
    link: notif.type === 'leave' ? '/history' : notif.type === 'system' ? '/profile' : undefined,
    relatedRequestId: undefined // You can set this if you have request linkage
  }));
};

export const createNotification = (notification: Omit<Notification, 'id' | 'createdAt'>): Notification => {
  const id = `notif-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const createdAt = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO notifications (id, staffId, type, message, createdAt, read)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(id, notification.staffId, notification.type, notification.message, createdAt, notification.read ? 1 : 0);
  return { ...notification, id, createdAt };
};

export const markNotificationRead = (id: string, read: boolean): boolean => {
  const stmt = db.prepare('UPDATE notifications SET read = ? WHERE id = ?');
  const info = stmt.run(read ? 1 : 0, id);
  return info.changes > 0;
};

export const deleteNotification = (id: string): boolean => {
  const stmt = db.prepare('DELETE FROM notifications WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
};

// LeaveRequest queries
export const getLeaveRequestsByStaffId = (staffId: string): LeaveRequest[] => {
  const stmt = db.prepare('SELECT * FROM leave_requests WHERE staffId = ? ORDER BY appliedDate DESC');
  return stmt.all(staffId) as LeaveRequest[];
};

export const getAllLeaveRequests = (): LeaveRequest[] => {
  const stmt = db.prepare(`
    SELECT lr.*, s.name as staffName, s.department 
    FROM leave_requests lr 
    JOIN staff s ON lr.staffId = s.id 
    ORDER BY lr.appliedDate DESC
  `);
  return stmt.all() as LeaveRequest[];
};

export const getLeaveRequestById = (id: number): LeaveRequest | undefined => {
  const stmt = db.prepare('SELECT * FROM leave_requests WHERE id = ?');
  return stmt.get(id) as LeaveRequest | undefined;
};

export const createLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>): LeaveRequest => {
  const appliedDate = new Date().toISOString().split('T')[0];
  const status = 'Pending';
  const stmt = db.prepare(`
    INSERT INTO leave_requests (staffId, type, startDate, endDate, days, reason, status, appliedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    request.staffId,
    request.type,
    request.startDate,
    request.endDate,
    request.days,
    request.reason,
    status,
    appliedDate
  );
  return {
    id: info.lastInsertRowid as number,
    ...request,
    status,
    appliedDate
  } as LeaveRequest;
};

export const updateLeaveRequestStatus = (
  id: number,
  status: "Approved" | "Rejected",
  approvedBy?: string,
  rejectedReason?: string
): LeaveRequest | undefined => {
  const approvedDate = status === "Approved" ? new Date().toISOString().split('T')[0] : null;
  const stmt = db.prepare(`
    UPDATE leave_requests
    SET status = ?, approvedBy = ?, approvedDate = ?, rejectedReason = ?
    WHERE id = ?
  `);
  stmt.run(status, approvedBy || null, approvedDate, rejectedReason || null, id);
  return getLeaveRequestById(id);
};

// Settings queries
export interface Settings {
  staffId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  leaveUpdates: boolean;
  systemAlerts: boolean;
}

export const getSettingsByStaffId = (staffId: string): Settings => {
  const stmt = db.prepare('SELECT * FROM settings WHERE staffId = ?');
  const row = stmt.get(staffId) as Settings | undefined;
  if (row) {
    return {
      staffId: row.staffId,
      emailNotifications: !!row.emailNotifications,
      pushNotifications: !!row.pushNotifications,
      leaveUpdates: !!row.leaveUpdates,
      systemAlerts: !!row.systemAlerts,
    };
  } else {
    // Return defaults if not set
    return {
      staffId,
      emailNotifications: true,
      pushNotifications: true,
      leaveUpdates: true,
      systemAlerts: true,
    };
  }
};

export const saveSettings = (settings: Settings): Settings => {
  const stmt = db.prepare(`
    INSERT INTO settings (staffId, emailNotifications, pushNotifications, leaveUpdates, systemAlerts)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(staffId) DO UPDATE SET
      emailNotifications=excluded.emailNotifications,
      pushNotifications=excluded.pushNotifications,
      leaveUpdates=excluded.leaveUpdates,
      systemAlerts=excluded.systemAlerts
  `);
  stmt.run(
    settings.staffId,
    settings.emailNotifications ? 1 : 0,
    settings.pushNotifications ? 1 : 0,
    settings.leaveUpdates ? 1 : 0,
    settings.systemAlerts ? 1 : 0
  );
  return getSettingsByStaffId(settings.staffId);
};
