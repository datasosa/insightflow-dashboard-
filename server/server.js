const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://insightflow-dashboard.onrender.com' // Render static site
];

// CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed from this origin'), false);
    }
  }
}));

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('InsightFlow backend is live 🚀');
});

// API Routes
const metricsRoutes = require('./routes/metrics');
app.use('/api/metrics', metricsRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
