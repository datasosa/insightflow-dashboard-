import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [theme, setTheme] = useState('light');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newMetric, setNewMetric] = useState({ name: '', value: '' });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('https://insightflow-api.onrender.com/api/metrics');
        const formatted = res.data.map((item) => ({
          name: item.name,
          value: item.value,
          date: item.createdAt,
        }));
        setMetrics(formatted);
        setFiltered(formatted);
      } catch (err) {
        console.error('Error fetching metrics:', err.message);
      }
    };
    fetchMetrics();
  }, []);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const handleChartChange = (e) => setChartType(e.target.value);

  const filterMetrics = (date, query) => {
    let data = [...metrics];
    if (date) {
      data = data.filter(m => m.date && m.date.startsWith(date));
    }
    if (query) {
      data = data.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
    }
    setFiltered(data);
  };

  const handleDateFilter = (e) => {
    const date = e.target.value;
    setDateFilter(date);
    filterMetrics(date, searchQuery);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterMetrics(dateFilter, query);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMetric(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitMetric = async (e) => {
    e.preventDefault();
    if (!newMetric.name || !newMetric.value) return;

    try {
      const res = await axios.post('https://insightflow-api.onrender.com/api/metrics', {
        name: newMetric.name,
        value: parseFloat(newMetric.value),
      });

      const newEntry = {
        name: res.data.name,
        value: res.data.value,
        date: res.data.createdAt,
      };

      const updated = [newEntry, ...metrics];
      setMetrics(updated);
      filterMetrics(dateFilter, searchQuery);
      setNewMetric({ name: '', value: '' });
    } catch (err) {
      console.error('Error submitting metric:', err.message);
    }
  };

  const exportToCSV = () => {
    if (!filtered.length) return;

    const headers = Object.keys(filtered[0]).join(',');
    const rows = filtered.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `insightflow_metrics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cardStyle = {
    flex: '1',
    minWidth: '180px',
    padding: '1rem',
    borderRadius: '10px',
    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  };

  const ChartDisplay = () => {
    if (filtered.length === 0) return <p>No data available for selected filter.</p>;

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filtered}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filtered}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />
              <Pie
                data={filtered}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {filtered.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`dashboard ${theme}`}
      style={{
        padding: '2rem',
        backgroundColor: theme === 'dark' ? '#121212' : '#f7f7f7',
        color: theme === 'dark' ? '#fff' : '#000',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h2>📊 InsightFlow Dashboard</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={toggleTheme} style={buttonStyle(theme)}>
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button onClick={exportToCSV} style={buttonStyle(theme)}>
            📤 Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h4>Total Items</h4>
          <p>{filtered.length}</p>
        </div>
        <div style={cardStyle}>
          <h4>Max Value</h4>
          <p>{filtered.length > 0 ? Math.max(...filtered.map(m => m.value)) : 0}</p>
        </div>
        <div style={cardStyle}>
          <h4>Min Value</h4>
          <p>{filtered.length > 0 ? Math.min(...filtered.map(m => m.value)) : 0}</p>
        </div>
        <div style={cardStyle}>
          <h4>Average Value</h4>
          <p>{(filtered.reduce((acc, m) => acc + m.value, 0) / filtered.length || 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <select onChange={handleChartChange} value={chartType}>
          <option value="bar">📊 Bar Chart</option>
          <option value="line">📈 Line Chart</option>
          <option value="pie">🥧 Pie Chart</option>
        </select>
        <input type="date" value={dateFilter} onChange={handleDateFilter} />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="🔍 Search metric name..."
          style={{
            padding: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
            flex: '1',
            minWidth: '200px',
          }}
        />
      </div>

      {/* Chart */}
      {ChartDisplay()}

      {/* New Metric Form */}
      <form onSubmit={handleSubmitMetric} style={{ marginTop: '2rem' }}>
        <h3>Add New Metric</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="name"
            placeholder="Metric Name"
            value={newMetric.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="value"
            placeholder="Metric Value"
            value={newMetric.value}
            onChange={handleInputChange}
            required
          />
          <button type="submit" style={{
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#4CAF50',
            color: '#fff',
            cursor: 'pointer',
          }}>
            ➕ Submit
          </button>
        </div>
      </form>
    </div>
  );
}

const buttonStyle = (theme) => ({
  background: 'none',
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  color: theme === 'dark' ? '#fff' : '#000',
});

export default Dashboard;
