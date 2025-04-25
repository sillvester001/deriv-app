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

// Special handling for /bot route
app.get('/bot', (req, res) => {
  // Send the bot/index.html file
  res.sendFile(path.join(staticDir, 'bot/index.html'));
});

// Also handle /bot/ (with trailing slash)
app.get('/bot/', (req, res) => {
  // Send the bot/index.html file
  res.sendFile(path.join(staticDir, 'bot/index.html'));
});

// Only handle non-file routes with the catch-all
app.get('*', (req, res) => {
  // Check if request is for a file
  const filePath = path.join(staticDir, req.path);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File doesn't exist, serve index.html
      res.sendFile(path.join(staticDir, 'index.html'));
    } else {
      // File exists, express.static should have handled it
      // If we get here, it might be a content-type issue
      res.sendFile(filePath);
    }
  });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
}); 