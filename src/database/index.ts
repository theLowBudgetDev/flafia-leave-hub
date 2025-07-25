import Database from 'better-sqlite3';
import path from 'path';

// Fix the database path to work correctly
const dbPath = path.resolve(process.cwd(), 'data/database.sqlite');
const db = new Database(dbPath);

// Initialize tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    department TEXT NOT NULL,
    position TEXT NOT NULL,
    totalLeave INTEGER NOT NULL,
    usedLeave INTEGER NOT NULL,
    pendingLeave INTEGER NOT NULL,
    phone TEXT,
    annualLeave INTEGER NOT NULL DEFAULT 0,
    sickLeave INTEGER NOT NULL DEFAULT 0,
    maternityLeave INTEGER NOT NULL DEFAULT 0,
    paternityLeave INTEGER NOT NULL DEFAULT 0,
    emergencyLeave INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS leave_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staffId TEXT NOT NULL,
    type TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    days INTEGER NOT NULL,
    reason TEXT,
    status TEXT NOT NULL,
    appliedDate TEXT NOT NULL,
    approvedBy TEXT,
    approvedDate TEXT,
    rejectedReason TEXT,
    FOREIGN KEY (staffId) REFERENCES staff(id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    staffId TEXT NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    read INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (staffId) REFERENCES staff(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    staffId TEXT PRIMARY KEY,
    emailNotifications INTEGER NOT NULL DEFAULT 1,
    pushNotifications INTEGER NOT NULL DEFAULT 1,
    leaveUpdates INTEGER NOT NULL DEFAULT 1,
    systemAlerts INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (staffId) REFERENCES staff(id)
  );
`);

// --- MIGRATION: Add missing columns to staff table if they do not exist ---
const staffColumns = db.prepare("PRAGMA table_info(staff)").all().map((col: any) => col.name);
const addColumnIfMissing = (col: string, type: string) => {
  if (!staffColumns.includes(col)) {
    db.prepare(`ALTER TABLE staff ADD COLUMN ${col} ${type}`).run();
  }
};
addColumnIfMissing('phone', 'TEXT');
addColumnIfMissing('annualLeave', 'INTEGER NOT NULL DEFAULT 0');
addColumnIfMissing('sickLeave', 'INTEGER NOT NULL DEFAULT 0');
addColumnIfMissing('maternityLeave', 'INTEGER NOT NULL DEFAULT 0');
addColumnIfMissing('paternityLeave', 'INTEGER NOT NULL DEFAULT 0');
addColumnIfMissing('emergencyLeave', 'INTEGER NOT NULL DEFAULT 0');
// --- END MIGRATION ---

// Check if we need to seed the database with sample data
const staffCount = db.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number };

if (staffCount.count === 0) {
  console.log('Seeding database with sample data...');
  
  // Insert sample staff members
  const insertStaff = db.prepare(`
    INSERT INTO staff (id, name, email, department, position, totalLeave, usedLeave, pendingLeave, phone, annualLeave, sickLeave, maternityLeave, paternityLeave, emergencyLeave)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const staffData = [
    ['staff-1', 'John Doe', 'john.doe@fulafia.edu.ng', 'Computer Science', 'Lecturer', 30, 5, 0, '08031234567', 20, 5, 0, 0, 0],
    ['staff-2', 'Jane Smith', 'jane.smith@fulafia.edu.ng', 'Mathematics', 'Senior Lecturer', 30, 8, 2, '08039876543', 18, 3, 0, 0, 0],
    ['staff-3', 'Mike Johnson', 'mike.johnson@fulafia.edu.ng', 'Physics', 'Professor', 35, 12, 0, '08037654321', 25, 2, 0, 0, 0],
    ['staff-4', 'Sarah Wilson', 'sarah.wilson@fulafia.edu.ng', 'Chemistry', 'Associate Professor', 32, 6, 1, '08035554444', 20, 4, 0, 0, 0],
    ['staff-5', 'David Brown', 'david.brown@fulafia.edu.ng', 'Biology', 'Lecturer', 30, 3, 0, '08032221111', 15, 2, 0, 0, 0],
    ['admin-1', 'Admin User', 'admin@fulafia.edu.ng', 'Human Resources', 'HR Manager', 25, 2, 0, '08030001111', 10, 1, 0, 0, 0]
  ];
  
  const insertMany = db.transaction((staffList) => {
    for (const staff of staffList) {
      insertStaff.run(...staff);
    }
  });
  
  insertMany(staffData);
  
  // Insert sample leave requests
  const insertLeaveRequest = db.prepare(`
    INSERT INTO leave_requests (staffId, type, startDate, endDate, days, reason, status, appliedDate, approvedBy, approvedDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const leaveData = [
    ['staff-1', 'Annual Leave', '2024-02-15', '2024-02-19', 5, 'Family vacation', 'Approved', '2024-02-01', 'admin-1', '2024-02-02'],
    ['staff-2', 'Sick Leave', '2024-01-20', '2024-01-22', 3, 'Medical appointment', 'Approved', '2024-01-19', 'admin-1', '2024-01-19'],
    ['staff-2', 'Personal Leave', '2024-03-10', '2024-03-12', 3, 'Personal matters', 'Pending', '2024-03-01', null, null],
    ['staff-3', 'Annual Leave', '2024-01-05', '2024-01-15', 10, 'Holiday break', 'Approved', '2023-12-20', 'admin-1', '2023-12-21'],
    ['staff-4', 'Study Leave', '2024-04-01', '2024-04-03', 3, 'Conference attendance', 'Pending', '2024-03-15', null, null]
  ];
  
  const insertManyLeaves = db.transaction((leaveList) => {
    for (const leave of leaveList) {
      insertLeaveRequest.run(...leave);
    }
  });
  
  insertManyLeaves(leaveData);
  
  console.log('Database seeded successfully!');
}

// Seed notifications if empty
const notifCount = db.prepare('SELECT COUNT(*) as count FROM notifications').get() as { count: number };

if (notifCount.count === 0) {
  console.log('Seeding notifications table...');
  const insertNotif = db.prepare(`
    INSERT INTO notifications (id, staffId, type, message, createdAt, read)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const notifData = [
    [`notif-1`, 'staff-1', 'leave', 'Your leave request has been approved!', new Date().toISOString(), 0],
    [`notif-2`, 'staff-2', 'system', 'System maintenance scheduled for tomorrow.', new Date().toISOString(), 0],
    [`notif-3`, 'admin-1', 'system', 'A new staff member has joined your department.', new Date().toISOString(), 0]
  ];
  const insertManyNotif = db.transaction((notifList) => {
    for (const notif of notifList) {
      insertNotif.run(...notif);
    }
  });
  insertManyNotif(notifData);
  console.log('Notifications seeded successfully!');
}

export default db;
