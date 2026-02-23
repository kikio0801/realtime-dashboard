const { spawn } = require('child_process');
const path = require('path');

const apiKey = process.argv[2] || process.env.FIGMA_API_KEY;

if (!apiKey) {
  console.error('API Key is required');
  process.exit(1);
}

// Ensure clean execution without cmd wrapper output
const figmaMcpPath = path.join(process.env.APPDATA, 'npm', 'node_modules', 'figma-developer-mcp', 'dist', 'bin.js');

const child = spawn(process.execPath, [figmaMcpPath, '--figma-api-key', apiKey], {
  stdio: ['inherit', 'inherit', 'inherit'],
  env: { 
    ...process.env, 
    FIGMA_API_KEY: apiKey,
    // By convention in many MCP servers, specifying stdio transport or overriding port stops EADDRINUSE
    PORT: '0', 
    MCP_TRANSPORT: 'stdio' 
  } 
});

child.on('error', (err) => {
  console.error('Failed to start child process.', err);
});

