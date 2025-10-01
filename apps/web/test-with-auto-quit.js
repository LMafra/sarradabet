#!/usr/bin/env node

const { spawn } = require('child_process');
const readline = require('readline');

console.log('Starting tests with auto-quit after 10 seconds...');

// Start the vitest process
const testProcess = spawn('npx', ['vitest'], {
  stdio: ['pipe', 'inherit', 'inherit'],
  shell: true
});

// Set up a timer to send 'q' after 10 seconds
const timer = setTimeout(() => {
  console.log('\n⏰ Auto-quitting tests after 10 seconds...');
  testProcess.stdin.write('q\n');
  testProcess.stdin.end();
}, 10000);

// Handle process exit
testProcess.on('exit', (code) => {
  clearTimeout(timer);
  process.exit(code);
});

// Handle process errors
testProcess.on('error', (error) => {
  clearTimeout(timer);
  console.error('Test process error:', error);
  process.exit(1);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  clearTimeout(timer);
  testProcess.kill('SIGINT');
  process.exit(0);
});
