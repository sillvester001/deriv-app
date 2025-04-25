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

// Check if directories exist and log info
const coreDist = path.join(__dirname, 'packages/core/dist');
const botDist = path.join(__dirname, 'packages/bot-web-ui/dist');
const botDistBot = path.join(__dirname, 'packages/bot-web-ui/dist/bot');
const nodeModulesBotDist = path.join(__dirname, 'node_modules/@deriv/bot-web-ui/dist');
const nodeModulesBotDistBot = path.join(__dirname, 'node_modules/@deriv/bot-web-ui/dist/bot');

console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Core dist exists:', directoryExists(coreDist));
console.log('Bot dist exists:', directoryExists(botDist));
console.log('Bot dist/bot exists:', directoryExists(botDistBot));
console.log('node_modules Bot dist exists:', directoryExists(nodeModulesBotDist));
console.log('node_modules Bot dist/bot exists:', directoryExists(nodeModulesBotDistBot));

// Log directory contents for debugging
logDirectoryContents(__dirname);
logDirectoryContents(path.join(__dirname, 'packages'));
if (directoryExists(botDist)) {
  logDirectoryContents(botDist);
}
if (directoryExists(nodeModulesBotDist)) {
  logDirectoryContents(nodeModulesBotDist);
}

// Set main static directory
app.use(express.static(path.join(__dirname, 'packages/core/dist')));

// Handle bot static files - try both possible locations
app.use('/bot', express.static(path.join(__dirname, 'packages/bot-web-ui/dist')));
app.use('/bot', express.static(path.join(__dirname, 'packages/bot-web-ui/dist/bot')));
app.use('/bot', express.static(path.join(__dirname, 'node_modules/@deriv/bot-web-ui/dist')));
app.use('/bot', express.static(path.join(__dirname, 'node_modules/@deriv/bot-web-ui/dist/bot')));

// For non-hashed JS files, find the corresponding hashed file
app.get('/bot/js/:filename', (req, res, next) => {
  const filename = req.params.filename;
  console.log(`Request for JS file: ${filename}`);
  
  // Try multiple possible locations
  const jsDirs = [
    path.join(__dirname, 'packages/bot-web-ui/dist/js'),
    path.join(__dirname, 'packages/bot-web-ui/dist/bot/js'),
    path.join(__dirname, 'node_modules/@deriv/bot-web-ui/dist/js'),
    path.join(__dirname, 'node_modules/@deriv/bot-web-ui/dist/bot/js')
  ];
  
  for (const jsDir of jsDirs) {
    if (directoryExists(jsDir)) {
      console.log(`Checking in directory: ${jsDir}`);
      try {
        const files = fs.readdirSync(jsDir);
        
        if (!filename.includes('.hash.')) {
          const baseName = path.basename(filename, '.js');
          const hashedFile = files.find(file => file.startsWith(`${baseName}.`) && file.includes('.hash.'));
          
          if (hashedFile) {
            console.log(`Found hashed file: ${hashedFile}`);
            return res.sendFile(path.join(jsDir, hashedFile));
          }
        } else if (files.includes(filename)) {
          console.log(`Found exact file: ${filename}`);
          return res.sendFile(path.join(jsDir, filename));
        }
      } catch (err) {
        console.error(`Error reading directory ${jsDir}:`, err);
      }
    }
  }
  
  console.log(`JS file not found: ${filename}`);
  next();
});

// For non-hashed CSS files, find the corresponding hashed file
app.get('/bot/css/:filename', (req, res, next) => {
  const filename = req.params.filename;
  console.log(`Request for CSS file: ${filename}`);
  
  // Try multiple possible locations
  const cssDirs = [
    path.join(__dirname, 'packages/bot-web-ui/dist/css'),
    path.join(__dirname, 'packages/bot-web-ui/dist/bot/css'),
    path.join(__dirname, 'node_modules/@deriv/bot-web-ui/dist/css'),
    path.join(__dirname, 'node_modules/@deriv/bot-web-ui/dist/bot/css')
  ];
  
  for (const cssDir of cssDirs) {
    if (directoryExists(cssDir)) {
      console.log(`Checking in directory: ${cssDir}`);
      try {
        const files = fs.readdirSync(cssDir);
        
        if (!filename.includes('.hash.')) {
          const baseName = path.basename(filename, '.css');
          const hashedFile = files.find(file => file.startsWith(`${baseName}.`) && file.includes('.hash.'));
          
          if (hashedFile) {
            console.log(`Found hashed file: ${hashedFile}`);
            return res.sendFile(path.join(cssDir, hashedFile));
          }
        } else if (files.includes(filename)) {
          console.log(`Found exact file: ${filename}`);
          return res.sendFile(path.join(cssDir, filename));
        }
      } catch (err) {
        console.error(`Error reading directory ${cssDir}:`, err);
      }
    }
  }
  
  console.log(`CSS file not found: ${filename}`);
  next();
});

// Redirect root to bot
app.get('/', (req, res) => {
  res.redirect('/bot');
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  const url = req.url;
  console.log(`Catch-all route handling: ${url}`);
  
  // For bot routes
  if (url.startsWith('/bot')) {
    // Try multiple possible index.html locations
    const botIndexPaths = [
      path.join(__dirname, 'packages/bot-web-ui/dist/index.html'),
      path.join(__dirname, 'packages/bot-web-ui/dist/bot/index.html'),
      path.join(__dirname, 'node_modules/@deriv/bot-web-ui/dist/index.html'),
      path.join(__dirname, 'node_modules/@deriv/bot-web-ui/dist/bot/index.html')
    ];
    
    for (const botIndexPath of botIndexPaths) {
      console.log(`Checking for index.html at: ${botIndexPath}`);
      if (fileExists(botIndexPath)) {
        console.log(`Found index.html at: ${botIndexPath}`);
        return res.sendFile(botIndexPath);
      }
    }
    
    console.log('No bot index.html found');
  }
  
  // For other routes, serve the main index.html
  const indexPath = path.join(__dirname, 'packages/core/dist/index.html');
  if (fileExists(indexPath)) {
    console.log(`Serving core index.html from: ${indexPath}`);
    return res.sendFile(indexPath);
  }
  
  console.log('No index.html found at all, returning 404');
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