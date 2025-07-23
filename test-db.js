// Test script to verify database functionality
const { spawn } = require('child_process');

console.log('Testing database functionality...');

// Test the database by running a simple query
const testProcess = spawn('npx', ['tsx', '-e', `
import db from './src/database/index.js';

console.log('Database connection successful!');

// Test staff table
const staffCount = db.prepare('SELECT COUNT(*) as count FROM staff').get();
console.log('Staff count:', staffCount.count);

// Test leave_requests table  
const requestCount = db.prepare('SELECT COUNT(*) as count FROM leave_requests').get();
console.log('Leave requests count:', requestCount.count);

// Test a sample query
const sampleStaff = db.prepare('SELECT * FROM staff LIMIT 1').get();
console.log('Sample staff:', sampleStaff);

console.log('Database test completed successfully!');
process.exit(0);
`], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

testProcess.on('error', (error) => {
  console.error('Database test failed:', error);
});

testProcess.on('close', (code) => {
  console.log(`Database test exited with code ${code}`);
});
