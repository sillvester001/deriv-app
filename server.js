/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8000;

// Helper functions
const directoryExists = (dirPath) => {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
};

const fileExists = (filePath) => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};

// Debug function to log directory contents
const logDirectoryContents = (dirPath) => {
  try {
    if (directoryExists(dirPath)) {
      console.log(`Contents of ${dirPath}:`);
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const isDir = directoryExists(filePath);
        console.log(`  ${file} ${isDir ? '(directory)' : '(file)'}`);
      });
    } else {
      console.log(`Directory ${dirPath} does not exist`);
    }
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err);
  }
};

// Check if we're in production/staging environment
const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';
const isDevelopment = !isProduction && !isStaging;

console.log('========== SERVER STARTUP INFO ==========');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', PORT);
console.log('Current directory:', __dirname);

// Check if directories exist and log info
const coreDist = path.join(__dirname, 'packages/core/dist');
const botSkeletonDist = path.join(__dirname, 'packages/bot-skeleton/dist');
const botDist = path.join(__dirname, 'packages/bot-web-ui/dist');
const botDistBot = path.join(__dirname, 'packages/bot-web-ui/dist/bot');
const nodeModulesBotDist = path.join(__dirname, 'node_modules/@deriv/bot-web-ui/dist');
const nodeModulesBotDistBot = path.join(__dirname, 'node_modules/@deriv/bot-web-ui/dist/bot');
// Define botDistPath early
const botDistPath = path.join(__dirname, 'packages/bot-web-ui/dist');

console.log('\n========== DIRECTORY STATUS ==========');
console.log('Core dist exists:', directoryExists(coreDist));
console.log('Bot Skeleton dist exists:', directoryExists(botSkeletonDist));
console.log('Bot dist exists:', directoryExists(botDist));
console.log('Bot dist/bot exists:', directoryExists(botDistBot));
console.log('node_modules Bot dist exists:', directoryExists(nodeModulesBotDist));
console.log('node_modules Bot dist/bot exists:', directoryExists(nodeModulesBotDistBot));

// Log packages directory contents
console.log('\n========== PACKAGES DIRECTORY ==========');
logDirectoryContents(path.join(__dirname, 'packages'));

// Log bot dist contents if it exists
if (directoryExists(botDist)) {
  console.log('\n========== BOT DIST DIRECTORY ==========');
  logDirectoryContents(botDist);
}

// Log bot-skeleton dist contents if it exists
if (directoryExists(botSkeletonDist)) {
  console.log('\n========== BOT SKELETON DIST DIRECTORY ==========');
  logDirectoryContents(botSkeletonDist);
}

// Log core dist contents if it exists
if (directoryExists(coreDist)) {
  console.log('\n========== CORE DIST DIRECTORY ==========');
  logDirectoryContents(coreDist);
}

// Log bot dist/bot contents if it exists (now uses the pre-defined botDistPath)
const botDistBotPath = path.join(botDistPath, 'bot');
if (directoryExists(botDistBotPath)) {
  console.log('\n========== BOT DIST/BOT DIRECTORY ==========');
  logDirectoryContents(botDistBotPath);
  // Also log js subdirectory
  const botJsPath = path.join(botDistBotPath, 'js');
  if (directoryExists(botJsPath)) {
    console.log('\n========== BOT DIST/BOT/JS DIRECTORY ==========');
    logDirectoryContents(botJsPath);
  }
}

// Serve static files from core first
app.use(express.static(coreDist));

// Handle bot static files specifically under /bot path, serving from the dist/bot subdir
// const botDistPath = path.join(__dirname, 'packages/bot-web-ui/dist'); // Defined earlier
// const botDistBotPath = path.join(botDistPath, 'bot'); // Defined earlier
app.use('/bot', express.static(botDistBotPath)); // Serve from dist/bot for /bot requests

// Catch-all route for SPA
app.get('*', (req, res) => {
  const url = req.url;
  console.log(`Catch-all route handling: ${url}`);

  const botIndexPath = path.join(botDistPath, 'bot/index.html');
  const coreIndexPath = path.join(coreDist, 'index.html');

  // Serve bot index.html for /bot routes OR the root path /
  if (url === '/' || url.startsWith('/bot')) {
    console.log(`Checking for bot index.html at: ${botIndexPath}`);
    if (fileExists(botIndexPath)) {
      console.log(`Found bot index.html at: ${botIndexPath}`);
      return res.sendFile(botIndexPath);
    }
    console.log('No bot index.html found, falling back...');
    // Fall through to core index if bot index is missing but URL was / or /bot
  }

  // For all other routes, or if bot index wasn't found, serve the main core index.html
  console.log(`Checking for core index.html at: ${coreIndexPath}`);
  if (fileExists(coreIndexPath)) {
    console.log(`Serving core index.html from: ${coreIndexPath}`);
    return res.sendFile(coreIndexPath);
  }

  console.log('No index.html found at all, returning 404');
  res.status(404).send('Not found');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n========== SERVER STARTED ==========');
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Only show localhost URL in development
  if (isDevelopment) {
    console.log(`Local URL: http://localhost:${PORT}`);
  } else {
    console.log(`Running in ${isProduction ? 'PRODUCTION' : 'STAGING'} mode`);
  }
}); 