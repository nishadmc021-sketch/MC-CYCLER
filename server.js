// server.js (example backend)
const express = require('express');
const cloudinary = require('cloudinary').v2;
const app = express();

cloudinary.config({
  cloud_name: 'dx86o1uqq',
  api_key: '723982743441134',
  api_secret: 'YOUR_API_SECRET_HERE' // Keep this in environment variables
});

app.post('/api/sign-upload', (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp: timestamp },
    cloudinary.config().api_secret
  );
  
  res.json({ signature, timestamp, api_key: cloudinary.config().api_key });
});

app.listen(3000, () => console.log('Server running'));
