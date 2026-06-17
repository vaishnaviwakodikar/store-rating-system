import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../utils/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validate';

const fields = [
  { name: 'name', label: 'Full name', type: 'text', placeholder: 'Rohit Kumar' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'rohit@example.com' },
  { name: 'address', label: 'Address', type: 'text', placeholder: '12, MG Road, Nagpur' },
  { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
];

const validators = {
  name: validateName,
  email: validateEmail,
  password: validatePassword,
  address: validateAddress,
};

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = Object.fromEntries(
      Object.entries(validators).map(([key, fn]) => [key, fn(form[key])])
    );
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      await API.post('/auth/register', form);
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Registration failed. Please try again.' });
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo} />
        <h2 style={styles.heading}>Create an account</h2>
        <p style={styles.sub}>Fill in your details to get started.</p>

        <form onSubmit={handleSubmit} noValidate>
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                style={{
                  ...styles.input,
                  borderColor: errors[name] ? '#e24b4a' : undefined,
                }}
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                autoComplete={name === 'password' ? 'new-password' : 'off'}
              />
              {errors[name] && <p style={styles.errorText}>{errors[name]}</p>}
            </div>
          ))}

          {errors.api && <p style={{ ...styles.errorText, marginBottom: 8 }}>{errors.api}</p>}
          {success && <p style={styles.successText}>{success}</p>}

          <button type="submit" style={styles.btn}>Create account</button>
        </form>

        <div style={styles.divider} />
        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f7f7f8',
    padding: '32px 16px',
  },
  card: {
    background: '#fff',
    border: '0.5px solid #e5e5e5',
    borderRadius: 14,
    padding: '36px 32px',
    width: '100%',
    maxWidth: 400,
  },
  logo: {
    width: 36,
    height: 36,
    background: '#1e1e2f',
    borderRadius: 10,
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: 500,
    color: '#111',
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    color: '#888',
    marginBottom: 28,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: '#555',
    letterSpacing: '0.02em',
  },
  input: {
    padding: '9px 12px',
    border: '0.5px solid #d4d4d4',
    borderRadius: 8,
    fontSize: 14,
    color: '#111',
    outline: 'none',
    background: '#fff',
  },
  errorText: {
    fontSize: 11,
    color: '#e24b4a',
    marginTop: 2,
  },
  successText: {
    fontSize: 13,
    color: '#3b7c3b',
    marginBottom: 8,
  },
  btn: {
    width: '100%',
    padding: 11,
    background: '#1e1e2f',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: 8,
  },
  divider: {
    height: '0.5px',
    background: '#ebebeb',
    margin: '20px 0',
  },
  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: '#888',
  },
  link: {
    color: '#1e1e2f',
    fontWeight: 500,
    textDecoration: 'none',
  },
};

export default RegisterPage;