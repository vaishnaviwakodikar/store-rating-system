import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '220px', background: '#1e1e2f', color: 'white',
        padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '16px'
      }}>
        <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>⭐ StoreRater</h2>

        {user?.role === 'admin' && (
          <>
            <Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link>
          </>
        )}

        {user?.role === 'user' && (
          <Link to="/stores" style={linkStyle}>Browse Stores</Link>
        )}

        {user?.role === 'store_owner' && (
          <Link to="/owner/dashboard" style={linkStyle}>My Store</Link>
        )}

        <Link to="/change-password" style={linkStyle}>Change Password</Link>

        <button onClick={handleLogout} style={{
          marginTop: 'auto', background: '#e74c3c', color: 'white',
          border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
};

const linkStyle = {
  color: 'white', textDecoration: 'none', padding: '10px',
  borderRadius: '6px', background: '#2d2d44', display: 'block'
};

export default Layout;