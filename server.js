const express = require('express');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 8000;
const app = express();

// Directory where static files are located
const staticDir = path.join(__dirname, 'packages/core/dist');

// Serve static files
app.use(express.static(staticDir));

// Redirect root to bot page
app.get('/', (req, res) => {
  res.redirect('/bot');
});

// Special handling for /bot route
app.get('/bot', (req, res) => {
  // Check if index.html exists in bot directory
  const botIndexPath = path.join(staticDir, 'bot/index.html');
  if (fs.existsSync(botIndexPath)) {
    res.sendFile(botIndexPath);
  } else {
    // If no specific bot/index.html, serve the root index.html
    res.sendFile(path.join(staticDir, 'index.html'));
  }
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
      express.static(staticDir)(req, res, () => {
        res.sendFile(path.join(staticDir, 'index.html'));
      });
    }
  });
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
}); 