import db from '../database';

export interface AdminSettings {
  institutionName: string;
  systemEmail: string;
  maxLeaveDays: number;
  minAdvanceNotice: number;
  fiscalYearStart: string;
  maxCarryOverDays: number;
  autoApproval: boolean;
  emailNotifications: boolean;
  minPasswordLength: number;
  passwordExpiry: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
}

const defaultSettings: AdminSettings = {
  institutionName: "Federal University, Lafia",
  systemEmail: "hr@fulafia.edu.ng",
  maxLeaveDays: 25,
  minAdvanceNotice: 7,
  fiscalYearStart: "january",
  maxCarryOverDays: 5,
  autoApproval: false,
  emailNotifications: true,
  minPasswordLength: 8,
  passwordExpiry: 90,
  sessionTimeout: 30,
  maxLoginAttempts: 5
};

// Initialize admin_settings table
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export const getAdminSettings = (): AdminSettings => {
  const stmt = db.prepare('SELECT key, value FROM admin_settings');
  const rows = stmt.all() as { key: string; value: string }[];
  
  const settings = { ...defaultSettings };
  rows.forEach(row => {
    const key = row.key as keyof AdminSettings;
    if (key in settings) {
      const value = row.value;
      if (typeof settings[key] === 'number') {
        (settings as any)[key] = parseInt(value);
      } else if (typeof settings[key] === 'boolean') {
        (settings as any)[key] = value === 'true';
      } else {
        (settings as any)[key] = value;
      }
    }
  });
  
  return settings;
};

export const saveAdminSettings = (settings: Partial<AdminSettings>): void => {
  const stmt = db.prepare(`
    INSERT INTO admin_settings (key, value) 
    VALUES (?, ?) 
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `);
  
  Object.entries(settings).forEach(([key, value]) => {
    stmt.run(key, String(value));
  });
};

export const resetAdminSettings = (): void => {
  db.prepare('DELETE FROM admin_settings WHERE key != "adminPassword"').run();
};

export const updateAdminPassword = (newPassword: string): void => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO admin_settings (key, value) 
    VALUES ('adminPassword', ?)
  `);
  stmt.run(newPassword);
};

export const getAdminPassword = (): string | null => {
  const stmt = db.prepare('SELECT value FROM admin_settings WHERE key = ?');
  const row = stmt.get('adminPassword') as { value: string } | undefined;
  return row?.value || null;
};