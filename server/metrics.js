const express = require('express');
const router = express.Router();

// Sample endpoint: GET /api/metrics
router.get('/', (req, res) => {
  const sampleMetrics = [
    { name: 'Users', value: 1240 },
    { name: 'Sessions', value: 876 },
    { name: 'Bounce Rate', value: '43%' },
    { name: 'Conversions', value: 78 }
  ];
  
  res.json(sampleMetrics);
});

module.exports = router;
