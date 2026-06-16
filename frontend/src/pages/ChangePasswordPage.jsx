import { useState } from 'react';
import API from '../utils/api';
import { validatePassword } from '../utils/validate';

const ChangePasswordPage = () => {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      newPassword: validatePassword(form.newPassword),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(e => e)) return;

    try {
      await API.put('/auth/update-password', form);
      setSuccess('Password updated successfully!');
      setForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Failed to update password' });
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Change Password</h2>
      <div style={cardStyle}>
        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label>Old Password</label>
            <input style={inputStyle} type="password" name="oldPassword"
              value={form.oldPassword} onChange={handleChange} required />
          </div>
          <div style={fieldStyle}>
            <label>New Password</label>
            <input style={inputStyle} type="password" name="newPassword"
              value={form.newPassword} onChange={handleChange} required />
            {errors.newPassword && <p className="error">{errors.newPassword}</p>}
          </div>
          {errors.api && <p className="error">{errors.api}</p>}
          {success && <p className="success">{success}</p>}
          <button type="submit" style={btnStyle}>Update Password</button>
        </form>
      </div>
    </div>
  );
};

const cardStyle = { background: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const fieldStyle = { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px' };
const btnStyle = { width: '100%', padding: '12px', background: '#1e1e2f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', marginTop: '8px' };

export default ChangePasswordPage;