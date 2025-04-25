const express = require('express');
const path = require('path');
const port = process.env.PORT || 8000;
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'packages/core/dist')));

// Redirect root to bot
app.get('/', (req, res) => {
  res.redirect('/bot');
});

// Handle all routes by serving index.html and letting client-side routing handle it
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'packages/core/dist/index.html'));
});

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
}); 