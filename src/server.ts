import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {
  getStaffById,
  getAllStaff,
  getStaffByEmail,
  getLeaveRequestsByStaffId,
  getAllLeaveRequests,
  getLeaveRequestById,
  createLeaveRequest,
  updateLeaveRequestStatus,
  createStaff,
  deleteStaff,
  getNotificationsByStaffId,
  createNotification,
  markNotificationRead,
  deleteNotification,
  getSettingsByStaffId,
  saveSettings
} from './services/databaseService';
import { getAdminSettings, saveAdminSettings, resetAdminSettings } from './services/adminSettingsService';

// Initialize database on server start
import './database/index';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Add error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Staff routes
app.get('/api/staff', (req, res) => {
  try {
    const staff = getAllStaff();
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff members' });
  }
});

app.get('/api/staff/:id', (req, res) => {
  try {
    const staff = getStaffById(req.params.id);
    if (staff) {
      res.json(staff);
    } else {
      res.status(404).json({ error: 'Staff not found' });
    }
  } catch (error) {
    console.error('Error fetching staff by ID:', error);
    res.status(500).json({ error: 'Failed to fetch staff member' });
  }
});

// Create staff
app.post('/api/staff', (req, res) => {
  try {
    const {
      id, name, email, department, position, totalLeave, usedLeave, pendingLeave,
      phone, annualLeave, sickLeave, maternityLeave, paternityLeave, emergencyLeave
    } = req.body;

    // Validate required fields
    if (!name || !email || !department || !position || typeof totalLeave !== 'number') {
      return res.status(400).json({ error: 'Missing required staff fields' });
    }

    // Check if staff with this email already exists
    const existingStaff = getAllStaff().find(staff => staff.email === email);
    if (existingStaff) {
      return res.status(200).json(existingStaff);
    }

    const staff = createStaff({
      id,
      name,
      email,
      department,
      position,
      totalLeave,
      usedLeave: usedLeave ?? 0,
      pendingLeave: pendingLeave ?? 0,
      phone: phone ?? '',
      annualLeave: annualLeave ?? 0,
      sickLeave: sickLeave ?? 0,
      maternityLeave: maternityLeave ?? 0,
      paternityLeave: paternityLeave ?? 0,
      emergencyLeave: emergencyLeave ?? 0
    });
    res.status(201).json(staff);
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(400).json({ error: 'Failed to create staff: ' + (error as Error).message });
  }
});

// Delete staff
app.delete('/api/staff/:id', (req, res) => {
  try {
    const deleted = deleteStaff(req.params.id);
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Staff not found' });
    }
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ error: 'Failed to delete staff' });
  }
});

// Notifications endpoint
app.get('/api/notifications', (req, res) => {
  try {
    const staffId = req.query.staffId as string;
    if (!staffId) {
      return res.status(400).json({ error: 'Missing staffId query parameter' });
    }
    const notifications = getNotificationsByStaffId(staffId);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Leave request routes
app.get('/api/leave-requests', (req, res) => {
  try {
    const staffId = req.query.staffId as string | undefined;
    if (staffId) {
      const requests = getLeaveRequestsByStaffId(staffId);
      res.json(requests);
    } else {
      // If no staffId provided, return all requests (for admin)
      const allRequests = getAllLeaveRequests();
      res.json(allRequests);
    }
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
});

app.get('/api/leave-requests/:id', (req, res) => {
  try {
    const request = getLeaveRequestById(Number(req.params.id));
    if (request) {
      res.json(request);
    } else {
      res.status(404).json({ error: 'Leave request not found' });
    }
  } catch (error) {
    console.error('Error fetching leave request by ID:', error);
    res.status(500).json({ error: 'Failed to fetch leave request' });
  }
});

app.post('/api/leave-requests', (req, res) => {
  try {
    console.log('Creating leave request:', req.body);
    const newRequest = createLeaveRequest(req.body);
    console.log('Leave request created:', newRequest);
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(400).json({ error: 'Failed to create leave request: ' + (error as Error).message });
  }
});

app.put('/api/leave-requests/:id/status', (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, approvedBy, rejectedReason } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const updatedRequest = updateLeaveRequestStatus(id, status, approvedBy, rejectedReason);
    if (updatedRequest) {
      res.json(updatedRequest);
    } else {
      res.status(404).json({ error: 'Leave request not found' });
    }
  } catch (error) {
    console.error('Error updating leave request status:', error);
    res.status(500).json({ error: 'Failed to update leave request status' });
  }
});

// Settings endpoints
app.get('/api/settings', (req, res) => {
  try {
    const staffId = req.query.staffId as string;
    if (!staffId) {
      return res.status(400).json({ error: 'Missing staffId query parameter' });
    }
    const settings = getSettingsByStaffId(staffId);
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.post('/api/settings', (req, res) => {
  try {
    const { staffId, emailNotifications, pushNotifications, leaveUpdates, systemAlerts } = req.body;
    if (!staffId) {
      return res.status(400).json({ error: 'Missing staffId' });
    }
    const updated = saveSettings({
      staffId,
      emailNotifications: !!emailNotifications,
      pushNotifications: !!pushNotifications,
      leaveUpdates: !!leaveUpdates,
      systemAlerts: !!systemAlerts,
    });
    res.json(updated);
  } catch (error) {
    console.error('Error saving settings:', error);
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

// Notification endpoints
app.get('/api/notifications/:staffId', (req, res) => {
  try {
    const staffId = req.params.staffId;
    const notifications = getNotificationsByStaffId(staffId);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.post('/api/notifications', (req, res) => {
  try {
    const notification = createNotification(req.body);
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

app.put('/api/notifications/:id/read', (req, res) => {
  try {
    const id = req.params.id;
    const { read } = req.body;
    const success = markNotificationRead(id, read);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

app.delete('/api/notifications/:id', (req, res) => {
  try {
    const id = req.params.id;
    const success = deleteNotification(id);
    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Admin settings endpoints
app.get('/api/admin/settings', (req, res) => {
  try {
    const settings = getAdminSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({ error: 'Failed to fetch admin settings' });
  }
});

app.post('/api/admin/settings', (req, res) => {
  try {
    saveAdminSettings(req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving admin settings:', error);
    res.status(500).json({ error: 'Failed to save admin settings' });
  }
});

app.post('/api/admin/settings/reset', (req, res) => {
  try {
    resetAdminSettings();
    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting admin settings:', error);
    res.status(500).json({ error: 'Failed to reset admin settings' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
