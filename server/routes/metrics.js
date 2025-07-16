const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Ensure mongoose is imported

// Define the schema for your metrics.
// This explicitly tells Mongoose to use the 'metrics' collection.
const metricSchema = new mongoose.Schema({
    metric_name: String,
    metric_value: Number
}, { collection: 'metrics' }); 

// Define the Metric model.
// Use mongoose.models.Metric to avoid re-defining if it exists (e.g., from server.js).
const Metric = mongoose.models.Metric || mongoose.model('Metric', metricSchema);

// GET all metrics
router.get('/', async (req, res) => {
    console.log('API /api/metrics endpoint hit!'); // Log when this API is accessed
    try {
        const metrics = await Metric.find({}); // Fetch all documents from the 'metrics' collection
        console.log('Metrics fetched from DB:', metrics); // Log what data was found from MongoDB
        if (metrics.length === 0) {
            console.log('MongoDB: No documents found in the metrics collection.'); // Log if no data
        }
        res.json(metrics); // Send the found documents as JSON
    } catch (err) {
        console.error('Error fetching metrics from database:', err); // Log any database errors
        res.status(500).json({ message: 'Error fetching metrics from database' });
    }
});

// POST a new metric (for future use or if you add an "Add Metric" feature)
router.post('/', async (req, res) => {
    const { metric_name, metric_value } = req.body;
    if (!metric_name || metric_value === undefined) {
        return res.status(400).json({ message: 'Metric name and value are required' });
    }
    try {
        const newMetric = new Metric({ metric_name, metric_value });
        await newMetric.save();
        res.status(201).json(newMetric);
        console.log('New metric added to DB:', newMetric);
    } catch (err) {
        console.error('Error adding new metric:', err);
        res.status(500).json({ message: 'Error adding new metric' });
    }
});

module.exports = router;

