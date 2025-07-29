import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('https://insightflow-api.onrender.com/api/metrics');
        setMetrics(res.data);
      } catch (err) {
        console.error('Error fetching metrics:', err.message);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📊 InsightFlow Dashboard</h1>

      {metrics.length === 0 ? (
        <p>No metrics yet...</p>
      ) : (
        <>
          <ul>
            {metrics.map((metric) => (
              <li key={metric._id}>
                <strong>{metric.name}</strong>: {metric.value}
              </li>
            ))}
          </ul>

          <div style={{ width: '100%', height: 300, marginTop: '2rem' }}>
            <ResponsiveContainer>
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
