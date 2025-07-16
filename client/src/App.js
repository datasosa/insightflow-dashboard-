import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';

function App() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/metrics');
        console.log('Fetched data:', res.data);
        const formatted = res.data.map(item => ({
          name: item.name,
          value: item.value,
        }));
        setMetrics(formatted);
      } catch (err) {
        console.error('Error fetching metrics:', err.message);
        setError('Failed to load metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h1>📊 InsightFlow Dashboard</h1>
      </header>

      {loading && <p>Loading metrics...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && <Dashboard metrics={metrics} />}
    </div>
  );
}

const styles = {
  wrapper: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
};

export default App;
