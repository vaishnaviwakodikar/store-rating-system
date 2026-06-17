import { useState, useEffect } from 'react';
import API from '../utils/api';

const getInitials = (name = '') =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

const StarBar = ({ rating }) => {
  return (
    <span style={{ color: '#f5a623', fontSize: 13 }}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
    </span>
  );
};

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/owner/dashboard')
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load dashboard data.'));
  }, []);

  if (error) return <p style={{ color: 'red', fontSize: 14, padding: 24 }}>{error}</p>;
  if (!data) return <p style={{ color: '#aaa', fontSize: 14, padding: 24 }}>Loading...</p>;

  return (
    <div style={{ padding: '28px 24px', maxWidth: 780, fontFamily: 'inherit' }}>
      <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>My Store</h2>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Here's how your store is doing.</p>

      {/* Store card */}
      <div style={{
        background: '#fff',
        border: '0.5px solid #e5e5e5',
        borderRadius: 14,
        padding: '20px 22px',
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 500 }}>{data.store.name}</p>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{data.store.address}</p>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: '#fdf6e3', border: '0.5px solid #f0d070',
            borderRadius: 20, padding: '3px 12px',
            fontSize: 12, color: '#8a6b00', marginTop: 12,
          }}>
            📍 Verified store
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 36, fontWeight: 500, lineHeight: 1 }}>{data.averageRating}</p>
          <StarBar rating={data.averageRating} />
          <p style={{ fontSize: 12, color: '#aaa', marginTop: 3 }}>avg rating</p>
        </div>
      </div>

      {/* Table */}
      <p style={{ fontSize: 11, fontWeight: 500, color: '#aaa', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
        Ratings received
      </p>

      <div style={{ background: '#fff', border: '0.5px solid #e5e5e5', borderRadius: 14, overflow: 'hidden' }}>
        {data.ratings.length === 0 ? (
          <p style={{ fontSize: 13, color: '#aaa', padding: '20px 16px' }}>No ratings yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '0.5px solid #e5e5e5' }}>
                {['User', 'Email', 'Rating'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: '#aaa', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.ratings.map((r, i) => (
                <tr key={r.id} style={{ borderBottom: i < data.ratings.length - 1 ? '0.5px solid #f0f0f0' : 'none' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: '#e8f0fe', color: '#3b5bdb',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 500, flexShrink: 0,
                      }}>
                        {getInitials(r.User?.name)}
                      </span>
                      {r.User?.name ?? '—'}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#888' }}>{r.User?.email ?? '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: '#fdf6e3', border: '0.5px solid #f0d070',
                      borderRadius: 20, padding: '3px 10px', fontSize: 12, color: '#8a6b00',
                    }}>
                      ★ {r.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;