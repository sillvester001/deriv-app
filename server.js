const express = require('express');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 8000;
const app = express();

// Directory where static files are located
const staticDir = path.join(__dirname, 'packages/core/dist');

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`Request for: ${req.path}`);
  next();
});

// Helper function to check if the directory exists
const dirExists = (dir) => {
  try {
    return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
  } catch (err) {
    console.error(`Error checking directory ${dir}:`, err);
    return false;
  }
};

// Log static directory info
console.log(`Static directory: ${staticDir}`);
console.log(`Static directory exists: ${dirExists(staticDir)}`);

// Bot JS directory
const botJsDir = path.join(staticDir, 'bot/js');
console.log(`Bot JS directory exists: ${dirExists(botJsDir)}`);
if (dirExists(botJsDir)) {
  try {
    const files = fs.readdirSync(botJsDir);
    console.log('Files in bot/js directory:', files);
  } catch (err) {
    console.error('Error reading bot/js directory:', err);
  }
}

// Bot CSS directory
const botCssDir = path.join(staticDir, 'bot/css');
console.log(`Bot CSS directory exists: ${dirExists(botCssDir)}`);
if (dirExists(botCssDir)) {
  try {
    const files = fs.readdirSync(botCssDir);
    console.log('Files in bot/css directory:', files);
  } catch (err) {
    console.error('Error reading bot/css directory:', err);
  }
}

// Improved handler for bot JavaScript files with or without hashes
app.get('/bot/js/bot.bot-web-ui-app.js', (req, res) => {
  // Look for any file matching the pattern
  const jsDir = path.join(staticDir, 'bot/js');
  fs.readdir(jsDir, (err, files) => {
    if (err) {
      console.error('Error reading js directory:', err);
      return res.status(404).send('Not found');
    }
    
    // Find file matching the pattern
    const matchingFile = files.find(file => file.startsWith('bot.bot-web-ui-app') && file.endsWith('.js'));
    
    if (matchingFile) {
      console.log(`Serving bot script: ${matchingFile}`);
      res.setHeader('Content-Type', 'application/javascript');
      res.sendFile(path.join(jsDir, matchingFile));
    } else {
      console.error('Bot script file not found');
      res.status(404).send('File not found');
    }
  });
});

// Similar handler for vendor scripts
app.get('/bot/js/bot.787.js', (req, res) => {
  const jsDir = path.join(staticDir, 'bot/js');
  fs.readdir(jsDir, (err, files) => {
    if (err) {
      console.error('Error reading js directory:', err);
      return res.status(404).send('Not found');
    }
    
    const matchingFile = files.find(file => file.startsWith('bot.787') && file.endsWith('.js'));
    
    if (matchingFile) {
      console.log(`Serving vendor script: ${matchingFile}`);
      res.setHeader('Content-Type', 'application/javascript');
      res.sendFile(path.join(jsDir, matchingFile));
    } else {
      console.error('Vendor script file not found');
      res.status(404).send('File not found');
    }
  });
});

// Handler for CSS files
app.get('/bot/css/bot.bot-web-ui-app.css', (req, res) => {
  const cssDir = path.join(staticDir, 'bot/css');
  fs.readdir(cssDir, (err, files) => {
    if (err) {
      console.error('Error reading css directory:', err);
      return res.status(404).send('Not found');
    }
    
    const matchingFile = files.find(file => file.startsWith('bot.bot-web-ui-app') && file.endsWith('.css'));
    
    if (matchingFile) {
      console.log(`Serving CSS file: ${matchingFile}`);
      res.setHeader('Content-Type', 'text/css');
      res.sendFile(path.join(cssDir, matchingFile));
    } else {
      console.error('CSS file not found');
      res.status(404).send('File not found');
    }
  });
});

// Serve static files with correct content types
app.use(express.static(staticDir, {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

// Redirect root to bot page
app.get('/', (req, res) => {
  res.redirect('/bot');
});

// Special handling for /bot route with debugging
app.get('/bot', (req, res) => {
  // Send the bot/index.html file
  const indexPath = path.join(staticDir, 'bot/index.html');
  console.log(`Serving bot index from: ${indexPath}`);
  console.log(`File exists: ${fs.existsSync(indexPath)}`);

  // Check if the file exists and log its content
  if (fs.existsSync(indexPath)) {
    try {
      const content = fs.readFileSync(indexPath, 'utf8');
      console.log('First 200 chars of bot/index.html:', content.substring(0, 200));
    } catch (err) {
      console.error('Error reading bot/index.html:', err);
    }
  }

  res.sendFile(indexPath);
});

// Also handle /bot/ (with trailing slash)
app.get('/bot/', (req, res) => {
  // Send the bot/index.html file
  const indexPath = path.join(staticDir, 'bot/index.html');
  console.log(`Serving bot index from: ${indexPath} (trailing slash route)`);
  res.sendFile(indexPath);
});

// Modify the catch-all to better handle bot-related routes
app.get('*', (req, res) => {
  // Check if it's a bot-related path that might need special handling
  if (req.path.startsWith('/bot/') && !req.path.includes('.')) {
    console.log('Bot-related path detected, serving bot/index.html');
    return res.sendFile(path.join(staticDir, 'bot/index.html'));
  }

  // Normal path handling
  const filePath = path.join(staticDir, req.path);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist, but check if it's a versioned bot file
      if (req.path.startsWith('/bot/')) {
        console.log('Bot file not found directly, checking for matching files');
        const basePath = path.dirname(filePath);
        const fileName = path.basename(filePath);
        
        // Try to find a matching file without the version hash
        if (dirExists(basePath)) {
          try {
            const files = fs.readdirSync(basePath);
            const pattern = fileName.split('.')[0]; // Get the base name without extension
            const matchingFile = files.find(file => file.startsWith(pattern));
            
            if (matchingFile) {
              console.log(`Found matching file: ${matchingFile} for request: ${req.path}`);
              return res.sendFile(path.join(basePath, matchingFile));
            }
          } catch (err) {
            console.error(`Error searching for matching files in ${basePath}:`, err);
          }
        }
        
        // If we get here, no matching file was found
        console.log(`No matching file found for ${req.path}, serving bot/index.html`);
        return res.sendFile(path.join(staticDir, 'bot/index.html'));
      }
      
      // Not a bot file, serve index.html
      console.log(`File not found: ${filePath}, serving index.html`);
      res.sendFile(path.join(staticDir, 'index.html'));
    } else {
      // File exists, express.static should have handled it
      // If we get here, it might be a content-type issue
      console.log(`File exists but reached catch-all: ${filePath}`);
      res.sendFile(filePath);
    }
  });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
}); 