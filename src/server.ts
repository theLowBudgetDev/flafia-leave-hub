import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {
  getStaffById,
  getAllStaff,
  getLeaveRequestsByStaffId,
  getLeaveRequestById,
  createLeaveRequest,
  updateLeaveRequestStatus
} from './services/databaseService';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Staff routes
app.get('/api/staff', (req, res) => {
  const staff = getAllStaff();
  res.json(staff);
});

app.get('/api/staff/:id', (req, res) => {
  const staff = getStaffById(req.params.id);
  if (staff) {
    res.json(staff);
  } else {
    res.status(404).json({ error: 'Staff not found' });
  }
});

// Leave request routes
app.get('/api/leave-requests', (req, res) => {
  const staffId = req.query.staffId as string | undefined;
  if (staffId) {
    const requests = getLeaveRequestsByStaffId(staffId);
    res.json(requests);
  } else {
    res.status(400).json({ error: 'staffId query parameter is required' });
  }
});

app.get('/api/leave-requests/:id', (req, res) => {
  const request = getLeaveRequestById(Number(req.params.id));
  if (request) {
    res.json(request);
  } else {
    res.status(404).json({ error: 'Leave request not found' });
  }
});

app.post('/api/leave-requests', (req, res) => {
  try {
    const newRequest = createLeaveRequest(req.body);
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request data' });
  }
});

app.put('/api/leave-requests/:id/status', (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
