# Flafia Leave Hub - Database Fix Documentation

## Issues Fixed

### 1. Database Connection Problems
- ✅ **Fixed database path**: Changed from `__dirname` to `process.cwd()` for correct SQLite file location
- ✅ **Added database seeding**: Automatically populates database with sample data on first run
- ✅ **Improved error handling**: Added comprehensive error logging and handling

### 2. API Endpoint Issues
- ✅ **Enhanced server error handling**: Added try-catch blocks to all endpoints
- ✅ **Added missing endpoints**: Created `getAllLeaveRequests` for admin functionality
- ✅ **Improved logging**: Added detailed console logging for debugging

### 3. Frontend-Backend Synchronization
- ✅ **Fixed API service**: Enhanced error handling and response parsing
- ✅ **Updated authentication**: Mapped real staff IDs to login system
- ✅ **Added proper data flow**: Ensured data flows correctly between frontend and backend

## How to Run the Fixed Application

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Backend Server (Terminal 1)
```bash
npm run server
```
This will:
- Initialize the SQLite database
- Seed it with sample data (if empty)
- Start the API server on port 4000

### Step 3: Start the Frontend (Terminal 2)
```bash
npm run dev
```
This starts the React development server on port 8080

### Alternative: Run Both Together
```bash
npm run dev:full
```
This runs both frontend and backend concurrently

## Sample Login Credentials

### Staff Users
- **Email**: `john.doe@fulafia.edu.ng` | **Password**: `any` | **Role**: Staff
- **Email**: `jane.smith@fulafia.edu.ng` | **Password**: `any` | **Role**: Staff
- **Email**: `mike.johnson@fulafia.edu.ng` | **Password**: `any` | **Role**: Staff
- **Email**: `sarah.wilson@fulafia.edu.ng` | **Password**: `any` | **Role**: Staff
- **Email**: `david.brown@fulafia.edu.ng` | **Password**: `any` | **Role**: Staff

### Admin User
- **Email**: `admin@fulafia.edu.ng` | **Password**: `any` | **Role**: Admin

## Database Structure

### Staff Table
- `id`: Unique staff identifier
- `name`: Staff member name
- `email`: Email address
- `department`: Department name
- `position`: Job position
- `totalLeave`: Total leave days allocated
- `usedLeave`: Leave days already used
- `pendingLeave`: Leave days pending approval

### Leave Requests Table
- `id`: Auto-increment request ID
- `staffId`: Foreign key to staff table
- `type`: Type of leave (Annual, Sick, Personal, etc.)
- `startDate`: Leave start date
- `endDate`: Leave end date
- `days`: Number of days requested
- `reason`: Reason for leave
- `status`: Pending/Approved/Rejected
- `appliedDate`: Date when request was submitted
- `approvedBy`: Admin who approved/rejected
- `approvedDate`: Date of approval/rejection
- `rejectedReason`: Reason for rejection (if applicable)

## Testing the Fix

### 1. Test Leave Request Submission
1. Login as a staff member
2. Navigate to "Apply Leave"
3. Fill out the form with valid dates
4. Submit the request
5. ✅ Should see success message instead of error

### 2. Test Admin Dashboard
1. Login as admin
2. Navigate to Admin Dashboard
3. ✅ Should see real pending requests from database
4. ✅ Should see actual staff statistics

### 3. Test Leave History
1. Login as staff member
2. Navigate to "History"
3. ✅ Should see actual leave requests from database

## API Endpoints

- `GET /api/staff` - Get all staff members
- `GET /api/staff/:id` - Get specific staff member
- `GET /api/leave-requests` - Get all leave requests (admin) or by staffId
- `GET /api/leave-requests/:id` - Get specific leave request
- `POST /api/leave-requests` - Create new leave request
- `PUT /api/leave-requests/:id/status` - Update request status

## Troubleshooting

### If server won't start:
```bash
# Check if port 4000 is available
netstat -an | findstr :4000

# Kill any process using port 4000
taskkill /f /im node.exe
```

### If database issues persist:
```bash
# Delete and recreate database
del data\database.sqlite
npm run server
```

### If frontend can't connect to backend:
- Ensure backend is running on port 4000
- Check browser console for CORS errors
- Verify API_BASE_URL in `src/services/api.ts`

## Files Modified

1. `src/database/index.ts` - Fixed path and added seeding
2. `src/server.ts` - Enhanced error handling and logging
3. `src/services/databaseService.ts` - Added getAllLeaveRequests function
4. `src/services/api.ts` - Improved error handling
5. `src/contexts/AuthContext.tsx` - Updated to work with real staff data
6. `package.json` - Added server scripts and dependencies

The application should now work correctly with proper database synchronization between frontend and backend!
