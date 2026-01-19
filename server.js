// server.js
const express = require('express');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const app = express();

// Cloudinary config (use env vars in real apps)
cloudinary.config({
  cloud_name: 'dx86o1uqq',
  api_key: '723982743441134',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET_HERE'
});

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// API route
app.post('/api/sign-upload', (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    cloudinary.config().api_secret
  );

  res.json({
    signature,
    timestamp,
    api_key: cloudinary.config().api_key
  });
});

// Fallback route → serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
