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

// Check if directories exist and log info
const coreDist = path.join(__dirname, 'packages/core/dist');
const botDist = path.join(__dirname, 'packages/bot-web-ui/dist');

console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Core dist exists:', directoryExists(coreDist));
console.log('Bot dist exists:', directoryExists(botDist));

// Set main static directory
app.use(express.static(path.join(__dirname, 'packages/core/dist')));

// Handle bot static files
app.use('/bot', express.static(path.join(__dirname, 'packages/bot-web-ui/dist')));

// For non-hashed JS files, find the corresponding hashed file
app.get('/bot/js/:filename', (req, res, next) => {
  const filename = req.params.filename;
  const jsDir = path.join(__dirname, 'packages/bot-web-ui/dist/js');
  
  if (!filename.includes('.hash.')) {
    const files = fs.readdirSync(jsDir);
    const baseName = path.basename(filename, '.js');
    const hashedFile = files.find(file => file.startsWith(`${baseName}.`) && file.includes('.hash.'));
    
    if (hashedFile) {
      return res.sendFile(path.join(jsDir, hashedFile));
    }
  }
  next();
});

// For non-hashed CSS files, find the corresponding hashed file
app.get('/bot/css/:filename', (req, res, next) => {
  const filename = req.params.filename;
  const cssDir = path.join(__dirname, 'packages/bot-web-ui/dist/css');
  
  if (!filename.includes('.hash.')) {
    const files = fs.readdirSync(cssDir);
    const baseName = path.basename(filename, '.css');
    const hashedFile = files.find(file => file.startsWith(`${baseName}.`) && file.includes('.hash.'));
    
    if (hashedFile) {
      return res.sendFile(path.join(cssDir, hashedFile));
    }
  }
  next();
});

// Redirect root to bot
app.get('/', (req, res) => {
  res.redirect('/bot');
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  const url = req.url;
  
  // For bot routes
  if (url.startsWith('/bot')) {
    const botIndexPath = path.join(__dirname, 'packages/bot-web-ui/dist/index.html');
    if (fileExists(botIndexPath)) {
      return res.sendFile(botIndexPath);
    }
  }
  
  // For other routes, serve the main index.html
  const indexPath = path.join(__dirname, 'packages/core/dist/index.html');
  if (fileExists(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  res.status(404).send('Not found');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Only show localhost URL in development
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    console.log(`Local URL: http://localhost:${PORT}`);
  }
}); 