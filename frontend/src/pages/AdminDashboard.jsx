import { useState, useEffect } from 'react';
import API from '../utils/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validate';

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

  const handleAddUser = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(userForm.name),
      email: validateEmail(userForm.email),
      password: validatePassword(userForm.password),
      address: validateAddress(userForm.address),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(e => e)) return;

    try {
      await API.post('/admin/users', userForm);
      setSuccess('User added successfully!');
      setUserForm({ name: '', email: '', address: '', password: '', role: 'user' });
      fetchUsers();
      fetchStats();
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Failed to add user' });
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/stores', storeForm);
      setSuccess('Store added successfully!');
      setStoreForm({ name: '', email: '', address: '', ownerId: '' });
      fetchStores();
      fetchStats();
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Failed to add store' });
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sorted = (arr) => [...arr].sort((a, b) => {
    const val = sortConfig.dir === 'asc' ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? val : -val;
  });

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Admin Dashboard</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        {['dashboard', 'users', 'stores', 'addUser', 'addStore'].map(tab => (
          <button key={tab} onClick={() => { setActiveTab(tab); setSuccess(''); setErrors({}); }}
            style={{ ...tabBtn, background: activeTab === tab ? '#1e1e2f' : '#ddd', color: activeTab === tab ? 'white' : '#333' }}>
            {tab === 'addUser' ? 'Add User' : tab === 'addStore' ? 'Add Store' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Dashboard Stats */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { label: 'Total Users', value: stats.totalUsers },
            { label: 'Total Stores', value: stats.totalStores },
            { label: 'Total Ratings', value: stats.totalRatings },
          ].map(s => (
            <div key={s.label} style={statCard}>
              <h3 style={{ fontSize: '32px' }}>{s.value}</h3>
              <p style={{ color: '#666' }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Users Table */}
      {activeTab === 'users' && (
        <div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            {['name', 'email', 'address'].map(f => (
              <input key={f} style={inputStyle} placeholder={`Filter by ${f}`}
                value={filters[f]} onChange={e => setFilters({ ...filters, [f]: e.target.value })} />
            ))}
            <select style={inputStyle} value={filters.role}
              onChange={e => setFilters({ ...filters, role: e.target.value })}>
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
            <button style={btnStyle} onClick={fetchUsers}>Filter</button>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: '#1e1e2f', color: 'white' }}>
                {['name', 'email', 'address', 'role'].map(col => (
                  <th key={col} style={thStyle} onClick={() => handleSort(col)}>
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                    {sortConfig.key === col ? (sortConfig.dir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted(users).map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>{u.address}</td>
                  <td style={tdStyle}>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stores Table */}
      {activeTab === 'stores' && (
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#1e1e2f', color: 'white' }}>
              {['name', 'email', 'address', 'averageRating'].map(col => (
                <th key={col} style={thStyle} onClick={() => handleSort(col)}>
                  {col === 'averageRating' ? 'Avg Rating' : col.charAt(0).toUpperCase() + col.slice(1)}
                  {sortConfig.key === col ? (sortConfig.dir === 'asc' ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted(stores).map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>{s.name}</td>
                <td style={tdStyle}>{s.email}</td>
                <td style={tdStyle}>{s.address}</td>
                <td style={tdStyle}>⭐ {s.averageRating || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add User Form */}
      {activeTab === 'addUser' && (
        <div style={formCard}>
          <h3 style={{ marginBottom: '20px' }}>Add New User</h3>
          <form onSubmit={handleAddUser}>
            {['name', 'email', 'address', 'password'].map(field => (
              <div key={field} style={fieldStyle}>
                <label style={{ textTransform: 'capitalize' }}>{field}</label>
                <input style={inputStyle}
                  type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                  value={userForm[field]}
                  onChange={e => setUserForm({ ...userForm, [field]: e.target.value })} />
                {errors[field] && <p className="error">{errors[field]}</p>}
              </div>
            ))}
            <div style={fieldStyle}>
              <label>Role</label>
              <select style={inputStyle} value={userForm.role}
                onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                <option value="user">Normal User</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>
            {errors.api && <p className="error">{errors.api}</p>}
            {success && <p className="success">{success}</p>}
            <button type="submit" style={btnStyle}>Add User</button>
          </form>
        </div>
      )}

      {/* Add Store Form */}
      {activeTab === 'addStore' && (
        <div style={formCard}>
          <h3 style={{ marginBottom: '20px' }}>Add New Store</h3>
          <form onSubmit={handleAddStore}>
            {['name', 'email', 'address'].map(field => (
              <div key={field} style={fieldStyle}>
                <label style={{ textTransform: 'capitalize' }}>{field}</label>
                <input style={inputStyle}
                  type={field === 'email' ? 'email' : 'text'}
                  value={storeForm[field]}
                  onChange={e => setStoreForm({ ...storeForm, [field]: e.target.value })} />
              </div>
            ))}
            <div style={fieldStyle}>
              <label>Owner ID (optional)</label>
              <input style={inputStyle} type="number" value={storeForm.ownerId}
                onChange={e => setStoreForm({ ...storeForm, ownerId: e.target.value })} />
            </div>
            {errors.api && <p className="error">{errors.api}</p>}
            {success && <p className="success">{success}</p>}
            <button type="submit" style={btnStyle}>Add Store</button>
          </form>
        </div>
      )}
    </div>
  );
};

const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', flex: 1 };
const btnStyle = { padding: '10px 20px', background: '#1e1e2f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const thStyle = { padding: '14px 16px', textAlign: 'left', cursor: 'pointer' };
const tdStyle = { padding: '14px 16px' };
const tabBtn = { padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' };
const statCard = { background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', textAlign: 'center', flex: 1 };
const formCard = { background: 'white', padding: '30px', borderRadius: '12px', width: '450px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const fieldStyle = { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' };

export default AdminDashboard;