const express = require('express');
const router = express.Router();
const Metric = require('../models/Metric');

// @route   GET /api/metrics
// @desc    Get all metrics
router.get('/', async (req, res) => {
  try {
    const metrics = await Metric.find().sort({ createdAt: -1 });
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/metrics
// @desc    Add a new metric
router.post('/', async (req, res) => {
  const { name, value } = req.body;

  try {
    const newMetric = new Metric({ name, value });
    await newMetric.save();
    res.status(201).json(newMetric);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add metric' });
  }
});

module.exports = router;
