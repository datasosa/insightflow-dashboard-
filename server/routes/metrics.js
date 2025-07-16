const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Make sure your Metric model is defined or imported here.
// If your Metric model is defined in server.js, you might need to
// ensure it's accessible or redefine it here for this route file.
// For simplicity, let's ensure it's defined here.

// Define a simple schema and model if not already defined globally or imported
// This is the schema your data in MongoDB Atlas should match
const metricSchema = new mongoose.Schema({
    metric_name: String,
    metric_value: Number
});

// Ensure the model is defined only once or fetched if already defined
const Metric = mongoose.models.Metric || mongoose.model('Metric', metricSchema);


// GET all metrics
router.get('/', async (req, res) => {
    try {
        const metrics = await Metric.find({}); // Fetch all documents from the 'metrics' collection
        res.json(metrics); // Send the found documents as JSON
    } catch (err) {
        console.error('Error fetching metrics from database:', err);
        res.status(500).json({ message: 'Error fetching metrics from database' });
    }
});

// POST a new metric (optional, but good for testing)
router.post('/', async (req, res) => {
    const { metric_name, metric_value } = req.body;
    if (!metric_name || metric_value === undefined) {
        return res.status(400).json({ message: 'Metric name and value are required' });
    }
    try {
        const newMetric = new Metric({ metric_name, metric_value });
        await newMetric.save();
        res.status(201).json(newMetric);
    } catch (err) {
        console.error('Error adding new metric:', err);
        res.status(500).json({ message: 'Error adding new metric' });
    }
});

module.exports = router;

