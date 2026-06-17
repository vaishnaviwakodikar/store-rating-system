import { useState, useEffect } from 'react';
import API from '../utils/api';

const COLUMNS = [
  { key: 'name', label: 'Store' },
  { key: 'averageRating', label: 'Avg rating' },
];

const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value || 0;

  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          style={{ fontSize: 18, cursor: 'pointer', color: n <= active ? '#f5a623' : '#ddd', lineHeight: 1 }}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const StoreListPage = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', dir: 'asc' });

  const fetchStores = async () => {
    try {
      const res = await API.get('/stores', { params: search });
      setStores(res.data);
    } catch {
      setError('Failed to load stores.');
    }
  };

  useEffect(() => { fetchStores(); }, []);

  const handleRating = async (storeId, rating) => {
    try {
      await API.post('/ratings', { storeId, rating });
      fetchStores();
    } catch {
      setError('Failed to submit rating.');
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sorted = [...stores].sort((a, b) => {
    const dir = sortConfig.dir === 'asc' ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? dir : -dir;
  });

  const arrow = (key) => {
    if (sortConfig.key !== key) return <span style={{ opacity: 0.3, fontSize: 10, marginLeft: 3 }}>↕</span>;
    return <span style={{ fontSize: 10, marginLeft: 3 }}>{sortConfig.dir === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div style={s.page}>
      <div style={s.top}>
        <h2 style={s.heading}>Browse Stores</h2>
        <span style={s.count}>{stores.length} store{stores.length !== 1 ? 's' : ''}</span>
      </div>

      <div style={s.searchRow}>
        <input
          style={s.input}
          placeholder="Search by name…"
          value={search.name}
          onChange={e => setSearch(p => ({ ...p, name: e.target.value }))}
        />
        <input
          style={s.input}
          placeholder="Search by address…"
          value={search.address}
          onChange={e => setSearch(p => ({ ...p, address: e.target.value }))}
        />
        <button style={s.btn} onClick={fetchStores}>Search</button>
      </div>

      {error && <p style={s.error}>{error}</p>}

      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr style={{ borderBottom: '0.5px solid #e5e5e5' }}>
              {COLUMNS.map(({ key, label }) => (
                <th key={key} style={s.th} onClick={() => handleSort(key)}>
                  {label}{arrow(key)}
                </th>
              ))}
              <th style={s.th}>Your rating</th>
              <th style={s.th}>Rate</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((store, i) => (
              <tr key={store.id} style={{ borderBottom: i < sorted.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}>
                <td style={s.td}>
                  <p style={{ fontWeight: 500, color: '#111' }}>{store.name}</p>
                  <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{store.address}</p>
                </td>
                <td style={s.td}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: '#f5a623' }}>★</span>
                    {store.averageRating ?? 'N/A'}
                  </span>
                </td>
                <td style={s.td}>
                  {store.userRating ? (
                    <span style={s.badge}>★ {store.userRating}</span>
                  ) : (
                    <span style={{ fontSize: 12, color: '#aaa' }}>Not rated yet</span>
                  )}
                </td>
                <td style={s.td}>
                  <StarPicker
                    value={store.userRating}
                    onChange={rating => handleRating(store.id, rating)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const s = {
  page: { padding: '28px 24px', maxWidth: 900 },
  top: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 },
  heading: { fontSize: 20, fontWeight: 500, color: '#111' },
  count: { fontSize: 13, color: '#aaa' },
  searchRow: { display: 'flex', gap: 8, marginBottom: 20 },
  input: { flex: 1, padding: '8px 12px', border: '0.5px solid #d4d4d4', borderRadius: 8, fontSize: 13, outline: 'none' },
  btn: { padding: '8px 18px', background: '#1e1e2f', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  error: { fontSize: 13, color: '#e24b4a', marginBottom: 12 },
  tableWrap: { background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 14, overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#aaa', letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' },
  td: { padding: '13px 16px', verticalAlign: 'middle' },
  badge: { display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fdf6e3', border: '0.5px solid #f0d070', borderRadius: 20, padding: '3px 10px', fontSize: 12, color: '#8a6b00' },
};

export default StoreListPage;