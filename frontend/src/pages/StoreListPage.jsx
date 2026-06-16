import { useState, useEffect } from 'react';
import API from '../utils/api';

const StoreListPage = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', dir: 'asc' });

  const fetchStores = async () => {
    try {
      const res = await API.get('/stores', { params: search });
      setStores(res.data);
    } catch (err) {
      setError('Failed to load stores');
    }
  };

  useEffect(() => { fetchStores(); }, []);

  const handleRating = async (storeId, rating) => {
    try {
      await API.post('/ratings', { storeId, rating });
      fetchStores();
    } catch (err) {
      setError('Failed to submit rating');
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sorted = [...stores].sort((a, b) => {
    const val = sortConfig.dir === 'asc' ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? val : -val;
  });

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Browse Stores</h2>

      {/* Search */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input style={inputStyle} placeholder="Search by name..."
          value={search.name} onChange={e => setSearch({ ...search, name: e.target.value })} />
        <input style={inputStyle} placeholder="Search by address..."
          value={search.address} onChange={e => setSearch({ ...search, address: e.target.value })} />
        <button style={btnStyle} onClick={fetchStores}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {/* Table */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ background: '#1e1e2f', color: 'white' }}>
            {['name', 'address', 'averageRating'].map(col => (
              <th key={col} style={thStyle} onClick={() => handleSort(col)}>
                {col === 'averageRating' ? 'Avg Rating' : col.charAt(0).toUpperCase() + col.slice(1)}
                {sortConfig.key === col ? (sortConfig.dir === 'asc' ? ' ▲' : ' ▼') : ''}
              </th>
            ))}
            <th style={thStyle}>Your Rating</th>
            <th style={thStyle}>Submit Rating</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(store => (
            <tr key={store.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{store.name}</td>
              <td style={tdStyle}>{store.address}</td>
              <td style={tdStyle}>⭐ {store.averageRating || 'N/A'}</td>
              <td style={tdStyle}>{store.userRating ? `⭐ ${store.userRating}` : 'Not rated'}</td>
              <td style={tdStyle}>
                <select style={selectStyle}
                  defaultValue={store.userRating || ''}
                  onChange={e => handleRating(store.id, parseInt(e.target.value))}>
                  <option value="" disabled>Rate</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', flex: 1 };
const btnStyle = { padding: '10px 20px', background: '#1e1e2f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const thStyle = { padding: '14px 16px', textAlign: 'left', cursor: 'pointer' };
const tdStyle = { padding: '14px 16px' };
const selectStyle = { padding: '6px', borderRadius: '4px', border: '1px solid #ddd' };

export default StoreListPage;