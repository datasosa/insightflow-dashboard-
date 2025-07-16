const mongoose = require('mongoose');

const MetricSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // Allows string, number, or percentage
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Metric', MetricSchema);
