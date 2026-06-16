import { useState, useEffect } from 'react';
import API from '../utils/api';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/owner/dashboard');
        setData(res.data);
      } catch (err) {
        setError('Failed to load dashboard');
      }
    };
    fetchData();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>My Store Dashboard</h2>

      <div style={cardStyle}>
        <h3>{data.store.name}</h3>
        <p style={{ color: '#666', marginTop: '8px' }}>{data.store.address}</p>
        <p style={{ marginTop: '12px', fontSize: '20px' }}>
          Average Rating: <strong>⭐ {data.averageRating}</strong>
        </p>
      </div>

      <h3 style={{ margin: '24px 0 16px' }}>Users Who Rated</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ background: '#1e1e2f', color: 'white' }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {data.ratings.map(r => (
            <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{r.User?.name}</td>
              <td style={tdStyle}>{r.User?.email}</td>
              <td style={tdStyle}>⭐ {r.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const cardStyle = { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '24px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const thStyle = { padding: '14px 16px', textAlign: 'left' };
const tdStyle = { padding: '14px 16px' };

export default OwnerDashboard;