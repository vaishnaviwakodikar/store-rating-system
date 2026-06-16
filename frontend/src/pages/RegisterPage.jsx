import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validate';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      address: validateAddress(form.address),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(e => e)) return;

    try {
      await API.post('/auth/register', form);
      setSuccess('Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Registration failed' });
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          {['name', 'email', 'address', 'password'].map(field => (
            <div key={field} style={fieldStyle}>
              <label style={{ textTransform: 'capitalize' }}>{field}</label>
              <input
                style={inputStyle}
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                name={field}
                value={form[field]}
                onChange={handleChange}
              />
              {errors[field] && <p className="error">{errors[field]}</p>}
            </div>
          ))}
          {errors.api && <p className="error">{errors.api}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" style={btnStyle}>Register</button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f5f5' };
const cardStyle = { background: 'white', padding: '40px', borderRadius: '12px', width: '420px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const fieldStyle = { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' };
const btnStyle = { width: '100%', padding: '12px', background: '#1e1e2f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', marginTop: '8px' };

export default RegisterPage;