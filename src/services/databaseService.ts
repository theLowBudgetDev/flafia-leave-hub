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
