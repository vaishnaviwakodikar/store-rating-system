import { useState, useEffect } from 'react';
import API from '../utils/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validate';

/* ---------------------------------------------------------------------- */
/*  Tiny inline icon set — kept local so this file stays drop-in portable */
/* ---------------------------------------------------------------------- */
const Icon = {
  grid: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.4" />
    </svg>
  ),
  user: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c.8-3.8 3.6-5.8 7-5.8s6.2 2 7 5.8" />
    </svg>
  ),
  store: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path d="M4 9.5 5.2 4h13.6l1.2 5.5" />
      <path d="M4 9.5a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
      <path d="M5.5 9.8V20h13V9.8" />
    </svg>
  ),
  plusCircle: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8.5v7M8.5 12h7" />
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" {...p}>
      <path d="M12 3.5l2.4 5.1 5.5.6-4.1 3.8 1.1 5.5L12 15.7l-4.9 2.8 1.1-5.5-4.1-3.8 5.5-.6L12 3.5z" />
    </svg>
  ),
  check: (p) => (
    <svg viewBox="0 0 24 24" width="15" height="15" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.8 2.8L16.5 9" />
    </svg>
  ),
  alert: (p) => (
    <svg viewBox="0 0 24 24" width="15" height="15" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5.2" />
      <circle cx="12" cy="16" r="0.6" fill="currentColor" />
    </svg>
  ),
};

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { key: 'users', label: 'Users', icon: 'user' },
  { key: 'stores', label: 'Stores', icon: 'store' },
  { key: 'addUser', label: 'Add User', icon: 'plusCircle' },
  { key: 'addStore', label: 'Add Store', icon: 'plusCircle' },
];

const ROLE_OPTIONS = [
  { value: '', label: 'All roles' },
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'store_owner', label: 'Store owner' },
];

/* Small star-rating readout, ties visually back to the "StoreRater" brand */
const Stars = ({ value }) => {
  const n = Number(value);
  if (!n || Number.isNaN(n)) {
    return <span className="ad-norating">Not yet rated</span>;
  }
  const filled = Math.round(n);
  return (
    <span className="ad-stars">
      <span className="ad-stars-icons">
        {[1, 2, 3, 4, 5].map((i) => (
          <Icon.star
            key={i}
            style={{
              fill: i <= filled ? 'var(--gold)' : 'none',
              stroke: i <= filled ? 'var(--gold)' : 'var(--ink-line)',
              strokeWidth: 1.6,
            }}
          />
        ))}
      </span>
      <span className="ad-stars-value">{n.toFixed(1)}</span>
    </span>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'name', dir: 'asc' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userForm, setUserForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, []);

  // Auto-dismiss a success banner instead of letting it sit indefinitely
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(''), 3500);
    return () => clearTimeout(t);
  }, [success]);

  const fetchStats = async () => {
    const res = await API.get('/admin/dashboard');
    setStats(res.data);
  };

  const fetchUsers = async () => {
    const res = await API.get('/admin/users', { params: filters });
    setUsers(res.data);
  };

  const fetchStores = async () => {
    const res = await API.get('/admin/stores');
    setStores(res.data);
  };

  const handleFilterKeyDown = (e) => {
    if (e.key === 'Enter') fetchUsers();
  };

  const clearFilters = () => {
    setFilters({ name: '', email: '', address: '', role: '' });
    fetchUsers();
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(userForm.name),
      email: validateEmail(userForm.email),
      password: validatePassword(userForm.password),
      address: validateAddress(userForm.address),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e)) return;

    try {
      await API.post('/admin/users', userForm);
      setSuccess('User added successfully!');
      setErrors({});
      setUserForm({ name: '', email: '', address: '', password: '', role: 'user' });
      fetchUsers();
      fetchStats();
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Failed to add user' });
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(storeForm.name),
      email: validateEmail(storeForm.email),
      address: validateAddress(storeForm.address),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e)) return;

    try {
      await API.post('/admin/stores', storeForm);
      setSuccess('Store added successfully!');
      setErrors({});
      setStoreForm({ name: '', email: '', address: '', ownerId: '' });
      fetchStores();
      fetchStats();
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Failed to add store' });
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sorted = (arr) => [...arr].sort((a, b) => {
    const val = sortConfig.dir === 'asc' ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? val : -val;
  });

  const sortArrow = (col) => (sortConfig.key === col ? (sortConfig.dir === 'asc' ? '▲' : '▼') : '');

  const sortedUsers = sorted(users);
  const sortedStores = sorted(stores);

  return (
    <div className="ad-shell">
      <style>{`
        .ad-shell {
          --ink: #15291f;
          --ink-soft: #1d3527;
          --ink-line: #2c4636;
          --muted: #7d8f83;
          --paper: #f6f1e7;
          --card: #fffdf8;
          --gold: #d9a440;
          --gold-soft: #f1d9a2;
          --danger: #c1502f;
          --ok: #3f7d58;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          color: var(--ink);
        }
        .ad-head { margin-bottom: 22px; }
        .ad-head h2 { margin: 0 0 4px; font-size: 22px; font-weight: 700; letter-spacing: 0.1px; }
        .ad-head p { margin: 0; color: var(--muted); font-size: 13.5px; }

        .ad-tabs { display: flex; gap: 22px; border-bottom: 1px solid #e4dcc8; }
        .ad-tab {
          display: flex; align-items: center; gap: 7px;
          background: none; border: none; cursor: pointer;
          padding: 0 2px 12px;
          font-family: inherit; font-size: 13.5px; font-weight: 600;
          color: var(--muted);
          border-bottom: 2px solid transparent;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .ad-tab svg { stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
        .ad-tab:hover { color: var(--ink-soft); }
        .ad-tab.is-active { color: var(--ink); border-color: var(--gold); }

        .ad-tear {
          position: relative; height: 1px; margin: 0 0 24px;
          background: repeating-linear-gradient(to right, #e4dcc8 0 6px, transparent 6px 11px);
        }

        .ad-stats { display: flex; gap: 18px; flex-wrap: wrap; }
        .ad-stat-card {
          background: var(--card); border: 1px solid #e9e1cd; border-radius: 12px;
          padding: 18px 20px; flex: 1; min-width: 170px;
          box-shadow: 0 2px 10px rgba(21,41,31,0.06);
          display: flex; flex-direction: column; gap: 10px;
        }
        .ad-stat-icon {
          width: 30px; height: 30px; border-radius: 50%; background: var(--ink);
          color: var(--gold); display: flex; align-items: center; justify-content: center;
        }
        .ad-stat-icon svg { stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .ad-stat-value { font-family: 'IBM Plex Mono', monospace; font-size: 30px; font-weight: 500; line-height: 1; }
        .ad-stat-label { color: var(--muted); font-size: 12.5px; }

        .ad-toolbar { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
        .ad-input, .ad-select {
          padding: 9px 11px; border-radius: 7px; border: 1px solid #ddd3b8;
          font-size: 13.5px; font-family: inherit; background: var(--card); color: var(--ink);
          min-width: 140px;
        }
        .ad-input:focus, .ad-select:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 3px rgba(217,164,64,0.25); }
        .ad-btn {
          padding: 9px 18px; border-radius: 7px; border: 1px solid var(--ink);
          background: var(--ink); color: var(--paper); font-family: inherit;
          font-size: 13.5px; font-weight: 600; cursor: pointer;
          transition: filter 0.15s ease, transform 0.1s ease;
        }
        .ad-btn:hover { filter: brightness(1.15); }
        .ad-btn:active { transform: scale(0.97); }
        .ad-btn-ghost {
          padding: 9px 14px; border-radius: 7px; border: 1px dashed #c9bd9b;
          background: transparent; color: var(--muted); font-family: inherit;
          font-size: 13px; cursor: pointer;
        }
        .ad-btn-ghost:hover { color: var(--ink); border-color: var(--ink-line); }

        .ad-table-wrap {
          background: var(--card); border: 1px solid #e9e1cd; border-radius: 12px;
          overflow: hidden; box-shadow: 0 2px 10px rgba(21,41,31,0.06);
        }
        .ad-table { width: 100%; border-collapse: collapse; }
        .ad-table thead tr { background: var(--ink); }
        .ad-table th {
          padding: 12px 16px; text-align: left; cursor: pointer; user-select: none;
          color: var(--gold-soft); font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .ad-table th span { color: var(--gold); margin-left: 4px; }
        .ad-table td { padding: 13px 16px; font-size: 13.5px; border-bottom: 1px solid #f0eada; }
        .ad-table tbody tr:last-child td { border-bottom: none; }
        .ad-table tbody tr:hover { background: #fbf4e2; }

        .ad-role-pill {
          font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.06em;
          text-transform: uppercase; padding: 3px 8px; border-radius: 20px;
          background: #eef1ec; color: var(--ink-soft); width: fit-content;
        }
        .ad-role-pill.role-admin { background: var(--gold-soft); color: #6b4d10; }
        .ad-role-pill.role-store_owner { background: #e4dcc8; color: var(--ink); }

        .ad-stars { display: inline-flex; align-items: center; gap: 8px; }
        .ad-stars-icons { display: inline-flex; gap: 1px; }
        .ad-stars-value { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: var(--muted); }
        .ad-norating { color: var(--muted); font-size: 12.5px; font-style: italic; }

        .ad-empty { padding: 36px 16px; text-align: center; color: var(--muted); font-size: 13.5px; }

        .ad-form-card {
          background: var(--card); border: 1px solid #e9e1cd; border-radius: 12px;
          padding: 28px; width: 440px; box-shadow: 0 2px 10px rgba(21,41,31,0.06);
        }
        .ad-form-card h3 { margin: 0 0 18px; font-size: 16px; font-weight: 700; }
        .ad-field { margin-bottom: 15px; display: flex; flex-direction: column; gap: 6px; }
        .ad-field label {
          font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--muted);
        }
        .ad-field .ad-input { width: 100%; }
        .ad-field-error { margin: 0; color: var(--danger); font-size: 12px; }

        .ad-banner {
          display: flex; align-items: center; gap: 8px; padding: 10px 13px;
          border-radius: 8px; font-size: 13px; margin-bottom: 14px;
        }
        .ad-banner svg { stroke: currentColor; fill: none; stroke-width: 1.8; flex-shrink: 0; }
        .ad-banner-error { background: #fbeae3; color: var(--danger); }
        .ad-banner-success { background: #e9f3ec; color: var(--ok); }
        .ad-banner p { margin: 0; }
      `}</style>

      <div className="ad-head">
        <h2>Admin Dashboard</h2>
        <p>Manage accounts, storefronts, and platform activity.</p>
      </div>

      <div className="ad-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`ad-tab${activeTab === tab.key ? ' is-active' : ''}`}
            onClick={() => { setActiveTab(tab.key); setSuccess(''); setErrors({}); }}
          >
            {Icon[tab.icon] && Icon[tab.icon]()}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="ad-tear" aria-hidden="true" />

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="ad-stats">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: 'user' },
            { label: 'Total Stores', value: stats.totalStores, icon: 'store' },
            { label: 'Total Ratings', value: stats.totalRatings, icon: 'star' },
          ].map((s) => (
            <div key={s.label} className="ad-stat-card">
              <span className="ad-stat-icon">{Icon[s.icon]({ style: { fill: s.icon === 'star' ? 'currentColor' : 'none' } })}</span>
              <span className="ad-stat-value">{s.value ?? '—'}</span>
              <span className="ad-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div>
          <div className="ad-toolbar">
            {['name', 'email', 'address'].map((f) => (
              <input
                key={f}
                className="ad-input"
                placeholder={`Filter by ${f}`}
                value={filters[f]}
                onChange={(e) => setFilters({ ...filters, [f]: e.target.value })}
                onKeyDown={handleFilterKeyDown}
              />
            ))}
            <select
              className="ad-select"
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
              {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <button className="ad-btn" onClick={fetchUsers}>Filter</button>
            {hasActiveFilters && (
              <button className="ad-btn-ghost" onClick={clearFilters}>Clear filters</button>
            )}
          </div>

          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  {['name', 'email', 'address', 'role'].map((col) => (
                    <th key={col} onClick={() => handleSort(col)}>
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                      <span>{sortArrow(col)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedUsers.length === 0 ? (
                  <tr><td colSpan={4} className="ad-empty">No matching accounts — try adjusting your filters.</td></tr>
                ) : sortedUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.address}</td>
                    <td><span className={`ad-role-pill role-${u.role}`}>{u.role?.replace('_', ' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stores */}
      {activeTab === 'stores' && (
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead>
              <tr>
                {['name', 'email', 'address', 'averageRating'].map((col) => (
                  <th key={col} onClick={() => handleSort(col)}>
                    {col === 'averageRating' ? 'Avg Rating' : col.charAt(0).toUpperCase() + col.slice(1)}
                    <span>{sortArrow(col)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedStores.length === 0 ? (
                <tr><td colSpan={4} className="ad-empty">No stores registered yet.</td></tr>
              ) : sortedStores.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td><Stars value={s.averageRating} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add User */}
      {activeTab === 'addUser' && (
        <div className="ad-form-card">
          <h3>Add New User</h3>
          {errors.api && (
            <div className="ad-banner ad-banner-error"><Icon.alert />{' '}<p className="error">{errors.api}</p></div>
          )}
          {success && (
            <div className="ad-banner ad-banner-success"><Icon.check />{' '}<p className="success">{success}</p></div>
          )}
          <form onSubmit={handleAddUser}>
            {['name', 'email', 'address', 'password'].map((field) => (
              <div key={field} className="ad-field">
                <label>{field}</label>
                <input
                  className="ad-input"
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  value={userForm[field]}
                  onChange={(e) => setUserForm({ ...userForm, [field]: e.target.value })}
                />
                {errors[field] && <p className="ad-field-error error">{errors[field]}</p>}
              </div>
            ))}
            <div className="ad-field">
              <label>Role</label>
              <select
                className="ad-select"
                style={{ width: '100%' }}
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              >
                <option value="user">Normal user</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store owner</option>
              </select>
            </div>
            <button type="submit" className="ad-btn">Add User</button>
          </form>
        </div>
      )}

      {/* Add Store */}
      {activeTab === 'addStore' && (
        <div className="ad-form-card">
          <h3>Add New Store</h3>
          {errors.api && (
            <div className="ad-banner ad-banner-error"><Icon.alert />{' '}<p className="error">{errors.api}</p></div>
          )}
          {success && (
            <div className="ad-banner ad-banner-success"><Icon.check />{' '}<p className="success">{success}</p></div>
          )}
          <form onSubmit={handleAddStore}>
            {['name', 'email', 'address'].map((field) => (
              <div key={field} className="ad-field">
                <label>{field}</label>
                <input
                  className="ad-input"
                  type={field === 'email' ? 'email' : 'text'}
                  value={storeForm[field]}
                  onChange={(e) => setStoreForm({ ...storeForm, [field]: e.target.value })}
                />
                {errors[field] && <p className="ad-field-error error">{errors[field]}</p>}
              </div>
            ))}
            <div className="ad-field">
              <label>Owner ID (optional)</label>
              <input
                className="ad-input"
                type="number"
                value={storeForm.ownerId}
                onChange={(e) => setStoreForm({ ...storeForm, ownerId: e.target.value })}
              />
            </div>
            <button type="submit" className="ad-btn">Add Store</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;