import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'store_owner') navigate('/owner/dashboard');
      else navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>⭐ StoreRater Login</h2>
        <form onSubmit={handleLogin}>
          <div style={fieldStyle}>
            <label>Email</label>
            <input style={inputStyle} type="email" value={email}
              onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={fieldStyle}>
            <label>Password</label>
            <input style={inputStyle} type="password" value={password}
              onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" style={btnStyle}>Login</button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const fieldStyle = { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' };
const btnStyle = { width: '100%', padding: '12px', background: '#1e1e2f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', marginTop: '8px' };

export default LoginPage;