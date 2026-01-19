// server.js
const express = require('express');
const axios = require('axios');
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

const serverType = process.env.RENDER_EXTERNAL_URL
  ? 'RENDER'
  : process.env.KOYEB_PUBLIC_DOMAIN
  ? 'KOYEB'
  : null;

const uptimeUrl = serverType === 'RENDER'
  ? process.env.RENDER_EXTERNAL_URL
  : serverType === 'KOYEB'
  ? 'https://' + process.env.KOYEB_PUBLIC_DOMAIN
  : null;

setInterval(() => {
  if (!uptimeUrl) return;

  axios.get(uptimeUrl, {
    timeout: 5000,
    headers: { 'User-Agent': 'Uptime-Bot' },
    validateStatus: status => status < 500
  }).then(res => {
    console.log(`[${new Date().toISOString()}] Uptime Ping Success: ${res.status}`);
  }).catch(err => {
    console.log(`[${new Date().toISOString()}] Uptime Ping Failed: ${err.message}`);
  });
}, 5 * 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

