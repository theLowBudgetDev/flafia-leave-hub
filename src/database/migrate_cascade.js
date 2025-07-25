// Migration script to add ON DELETE CASCADE to all foreign keys referencing staff(id)
// Usage: node src/database/migrate_cascade.js

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(process.cwd(), 'data/database.sqlite');
const db = new Database(dbPath);

db.pragma('foreign_keys=off');

db.transaction(() => {
  // LEAVE REQUESTS
  db.exec(`
    CREATE TABLE IF NOT EXISTS leave_requests_new (
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
      FOREIGN KEY (staffId) REFERENCES staff(id) ON DELETE CASCADE
    );
    INSERT INTO leave_requests_new SELECT * FROM leave_requests;
    DROP TABLE leave_requests;
    ALTER TABLE leave_requests_new RENAME TO leave_requests;
  `);

  // NOTIFICATIONS
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications_new (
      id TEXT PRIMARY KEY,
      staffId TEXT NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (staffId) REFERENCES staff(id) ON DELETE CASCADE
    );
    INSERT INTO notifications_new SELECT * FROM notifications;
    DROP TABLE notifications;
    ALTER TABLE notifications_new RENAME TO notifications;
  `);

  // SETTINGS
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings_new (
      staffId TEXT PRIMARY KEY,
      emailNotifications INTEGER NOT NULL DEFAULT 1,
      pushNotifications INTEGER NOT NULL DEFAULT 1,
      leaveUpdates INTEGER NOT NULL DEFAULT 1,
      systemAlerts INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (staffId) REFERENCES staff(id) ON DELETE CASCADE
    );
    INSERT INTO settings_new SELECT * FROM settings;
    DROP TABLE settings;
    ALTER TABLE settings_new RENAME TO settings;
  `);
})();

db.pragma('foreign_keys=on');

console.log('Migration complete: ON DELETE CASCADE added to all relevant foreign keys.');
