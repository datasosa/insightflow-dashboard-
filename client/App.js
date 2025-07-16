import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function App() {
  const [metrics] = useState([
    { name: 'Page Views', value: 1500 },
    { name: 'Signups', value: 300 },
    { name: 'Downloads', value: 850 },
  ]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📊 InsightFlow Dashboard</h1>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={metrics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
