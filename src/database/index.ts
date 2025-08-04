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
addColumnIfMissing('password', 'TEXT');
// --- END MIGRATION ---

// Create admin_settings table
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Check if we need to seed the database with admin data
const staffCount = db.prepare('SELECT COUNT(*) as count FROM staff').get() as { count: number };

if (staffCount.count === 0) {
  console.log('Seeding database with admin only...');
  
  // Insert admin user
  const insertStaff = db.prepare(`
    INSERT INTO staff (id, name, email, department, position, totalLeave, usedLeave, pendingLeave, phone, annualLeave, sickLeave, maternityLeave, paternityLeave, emergencyLeave, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insertStaff.run('admin-1', 'Admin User', 'admin@fulafia.edu.ng', 'Human Resources', 'Administrator', 25, 0, 0, '08030001111', 0, 0, 0, 0, 0, null);
  
  // Set admin password
  const insertPassword = db.prepare(`
    INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('adminPassword', ?)
  `);
  insertPassword.run('qwertyuiop');
  
  console.log('Database seeded with admin user and password qwertyuiop');
}



export default db;
