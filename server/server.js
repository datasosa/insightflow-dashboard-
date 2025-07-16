const express = require('express');
const cors = require('cors'); // This line enables CORS
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// This configures CORS to allow requests ONLY from your Netlify dashboard
app.use(cors({
    origin: 'https://magnificent-basbousa-a20436.netlify.app' // This is your specific Netlify URL
}));
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('InsightFlow backend is live 🚀');
});

// API Routes
const metricsRoutes = require('./routes/metrics');
app.use('/api/metrics', metricsRoutes);

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

