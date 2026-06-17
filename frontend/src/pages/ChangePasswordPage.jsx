import { useState } from 'react';
import API from '../utils/api';
import { validatePassword } from '../utils/validate';

const Icon = {
  key: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <circle cx="8" cy="14.5" r="4" />
      <path d="M11 11.5 19 3.5" />
      <path d="M16 6.5l2.5 2.5" />
      <path d="M13.5 9l2 2" />
    </svg>
  ),
  eye: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M4 4l16 16" />
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

const getStrength = (pw) => {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
const STRENGTH_META = [
  { label: '', color: 'var(--ink-line)' },
  { label: 'Weak', color: 'var(--danger)' },
  { label: 'Fair', color: 'var(--gold)' },
  { label: 'Good', color: '#7d9c4f' },
  { label: 'Strong', color: 'var(--ok)' },
];

const ChangePasswordPage = () => {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      newPassword: validatePassword(form.newPassword),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e)) return;

    setIsSubmitting(true);
    try {
      await API.put('/auth/update-password', form);
      setSuccess('Password updated successfully!');
      setForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setErrors({ api: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const strength = getStrength(form.newPassword);

  return (
    <div className="cp-shell">
      <style>{`
        .cp-shell {
          --ink: #15291f;
          --ink-soft: #1d3527;
          --ink-line: #2c4636;
          --muted: #7d8f83;
          --card: #fffdf8;
          --gold: #d9a440;
          --danger: #c1502f;
          --ok: #3f7d58;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          color: var(--ink);
        }
        .cp-head { margin-bottom: 22px; }
        .cp-head h2 { margin: 0 0 4px; font-size: 22px; font-weight: 700; }
        .cp-head p { margin: 0; color: var(--muted); font-size: 13.5px; }

        .cp-card {
          background: var(--card); border: 1px solid #e9e1cd; border-radius: 12px;
          padding: 28px; width: 380px; box-shadow: 0 2px 10px rgba(21,41,31,0.06);
        }
        .cp-badge {
          width: 38px; height: 38px; border-radius: 50%; background: var(--ink);
          color: var(--gold); display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
        }
        .cp-badge svg { stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }

        .cp-field { margin-bottom: 16px; display: flex; flex-direction: column; gap: 6px; }
        .cp-field label {
          font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--muted);
        }
        .cp-input-wrap { position: relative; display: flex; }
        .cp-input {
          width: 100%; padding: 10px 38px 10px 11px; border-radius: 7px;
          border: 1px solid #ddd3b8; font-size: 14px; font-family: inherit;
          background: white; color: var(--ink);
        }
        .cp-input:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 3px rgba(217,164,64,0.25); }
        .cp-eye {
          position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--muted);
          padding: 4px; display: flex; align-items: center;
        }
        .cp-eye svg { stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
        .cp-eye:hover { color: var(--ink); }

        .cp-strength { display: flex; align-items: center; gap: 8px; margin-top: 2px; }
        .cp-strength-track { display: flex; gap: 3px; flex: 1; }
        .cp-strength-seg { height: 4px; flex: 1; border-radius: 2px; background: #e9e1cd; transition: background 0.15s ease; }
        .cp-strength-label { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: var(--muted); width: 42px; text-align: right; }

        .cp-field-error { margin: 0; color: var(--danger); font-size: 12px; }

        .cp-btn {
          width: 100%; padding: 12px; border-radius: 7px; border: 1px solid var(--ink);
          background: var(--ink); color: #f6f1e7; font-family: inherit;
          font-size: 14.5px; font-weight: 600; cursor: pointer; margin-top: 6px;
          transition: filter 0.15s ease, transform 0.1s ease, opacity 0.15s ease;
        }
        .cp-btn:hover:not(:disabled) { filter: brightness(1.15); }
        .cp-btn:active:not(:disabled) { transform: scale(0.98); }
        .cp-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .cp-banner {
          display: flex; align-items: center; gap: 8px; padding: 10px 13px;
          border-radius: 8px; font-size: 13px; margin-bottom: 14px;
        }
        .cp-banner svg { stroke: currentColor; fill: none; stroke-width: 1.8; flex-shrink: 0; }
        .cp-banner-error { background: #fbeae3; color: var(--danger); }
        .cp-banner-success { background: #e9f3ec; color: var(--ok); }
        .cp-banner p { margin: 0; }

        @media (prefers-reduced-motion: reduce) {
          .cp-btn, .cp-strength-seg { transition: none !important; }
        }
      `}</style>

      <div className="cp-head">
        <h2>Change Password</h2>
        <p>Update the password used to sign in to your account.</p>
      </div>

      <div className="cp-card">
        <span className="cp-badge"><Icon.key /></span>

        {errors.api && (
          <div className="cp-banner cp-banner-error"><Icon.alert /><p className="error">{errors.api}</p></div>
        )}
        {success && (
          <div className="cp-banner cp-banner-success"><Icon.check /><p className="success">{success}</p></div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="cp-field">
            <label>Old password</label>
            <div className="cp-input-wrap">
              <input
                className="cp-input"
                type={showOld ? 'text' : 'password'}
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="cp-eye"
                onClick={() => setShowOld((v) => !v)}
                aria-label={showOld ? 'Hide old password' : 'Show old password'}
              >
                {showOld ? <Icon.eyeOff /> : <Icon.eye />}
              </button>
            </div>
          </div>

          <div className="cp-field">
            <label>New password</label>
            <div className="cp-input-wrap">
              <input
                className="cp-input"
                type={showNew ? 'text' : 'password'}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="cp-eye"
                onClick={() => setShowNew((v) => !v)}
                aria-label={showNew ? 'Hide new password' : 'Show new password'}
              >
                {showNew ? <Icon.eyeOff /> : <Icon.eye />}
              </button>
            </div>

            {form.newPassword && (
              <div className="cp-strength">
                <div className="cp-strength-track">
                  {[1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="cp-strength-seg"
                      style={{ background: i <= strength ? STRENGTH_META[strength].color : '#e9e1cd' }}
                    />
                  ))}
                </div>
                <span className="cp-strength-label" style={{ color: STRENGTH_META[strength].color }}>
                  {STRENGTH_META[strength].label}
                </span>
              </div>
            )}

            {errors.newPassword && <p className="cp-field-error error">{errors.newPassword}</p>}
          </div>

          <button type="submit" className="cp-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;