import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../data/database.sqlite');
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
    pendingLeave INTEGER NOT NULL
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
`);

export default db;
