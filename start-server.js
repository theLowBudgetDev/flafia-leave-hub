const { spawn } = require('child_process');
const path = require('path');

// Start the backend server
console.log('Starting backend server...');

const serverProcess = spawn('npx', ['tsx', 'src/server.ts'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  serverProcess.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  serverProcess.kill('SIGTERM');
  process.exit();
});
