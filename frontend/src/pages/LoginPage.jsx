import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'store_owner') navigate('/owner/dashboard');
      else navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lp-shell">
      <style>{`
        .lp-shell {
          --ink: #15291f;
          --ink-deep: #0e1d15;
          --ink-soft: #1d3527;
          --ink-line: #2c4636;
          --muted: #7d8f83;
          --paper: #fffdf8;
          --gold: #d9a440;
          --gold-soft: #f1d9a2;
          --gold-deep: #b8852b;
          --danger: #c1502f;
          --ease: cubic-bezier(0.22, 1, 0.36, 1);
          --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'Space Grotesk', system-ui, sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--ink-deep);
          background-image: radial-gradient(circle, rgba(217,164,64,0.16) 1px, transparent 1.6px);
          background-size: 24px 24px;
          padding: 24px;
        }

        @keyframes lp-rise {
          0% { opacity: 0; transform: translateY(20px) scale(0.97); }
          70% { opacity: 1; transform: translateY(-3px) scale(1.004); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes lp-stamp {
          0% { transform: scale(1.7) rotate(-10deg); opacity: 0; }
          60% { transform: scale(0.9) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes lp-punch-pop {
          from { opacity: 0; transform: scale(0.3); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes lp-shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        @keyframes lp-icon-pop {
          from { opacity: 0; transform: scale(0.6) rotate(-8deg); }
          to { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        .lp-card {
          display: flex;
          width: 640px;
          max-width: 100%;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 18px 50px rgba(0,0,0,0.35);
          animation: lp-rise 0.55s var(--ease-bounce) both;
        }

        .lp-stub {
          flex-shrink: 0;
          width: 130px;
          background: var(--ink);
          color: var(--gold);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          position: relative;
          padding: 24px 10px;
        }
        .lp-seal {
          width: 42px; height: 42px; border-radius: 50%;
          background: var(--gold); color: var(--ink);
          display: flex; align-items: center; justify-content: center;
          animation: lp-stamp 0.45s var(--ease-bounce) 0.4s both;
        }
        .lp-stub-text {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px; letter-spacing: 0.22em;
          text-transform: uppercase;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          color: var(--gold-soft);
        }
        .lp-stub::after {
          content: '';
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 0;
          border-right: 2px dashed rgba(217,164,64,0.35);
        }
        .lp-punch {
          position: absolute; right: -9px; width: 18px; height: 18px;
          border-radius: 50%; background: var(--ink-deep);
          animation: lp-punch-pop 0.3s var(--ease-bounce) both;
        }
        .lp-punch.top { top: -9px; animation-delay: 0.55s; }
        .lp-punch.bottom { bottom: -9px; animation-delay: 0.62s; }

        .lp-main {
          flex: 1;
          background: var(--paper);
          padding: 38px 36px;
          display: flex;
          flex-direction: column;
        }
        .lp-eyebrow {
          margin: 0 0 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--gold-deep);
        }
        .lp-title { margin: 0 0 4px; font-size: 23px; font-weight: 700; color: var(--ink); }
        .lp-sub { margin: 0 0 22px; font-size: 13.5px; color: var(--muted); }

        .lp-field { margin-bottom: 15px; display: flex; flex-direction: column; gap: 6px; }
        .lp-field label {
          font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.07em;
          text-transform: uppercase; color: var(--muted);
        }
        .lp-input-wrap { position: relative; display: flex; }
        .lp-input {
          width: 100%; padding: 10px 11px; border-radius: 7px;
          border: 1px solid #ddd3b8; font-size: 14px; font-family: inherit;
          background: white; color: var(--ink);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .lp-input-wrap .lp-input { padding-right: 38px; }
        .lp-input:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 3px rgba(217,164,64,0.25); }
        .lp-eye {
          position: absolute; right: 6px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--muted);
          padding: 4px; display: flex; align-items: center;
        }
        .lp-eye-icon { display: flex; animation: lp-icon-pop 0.25s var(--ease-bounce) both; }
        .lp-eye svg { stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
        .lp-eye:hover { color: var(--ink); }
        .lp-eye:active svg { transform: scale(0.85); }

        .lp-banner {
          display: flex; align-items: center; gap: 8px; padding: 9px 12px;
          border-radius: 8px; font-size: 13px; margin-bottom: 14px;
          background: #fbeae3; color: var(--danger);
          animation: lp-shake 0.4s var(--ease);
        }
        .lp-banner svg { stroke: currentColor; fill: none; stroke-width: 1.8; flex-shrink: 0; }
        .lp-banner p { margin: 0; }

        .lp-btn {
          width: 100%; padding: 12px; border-radius: 7px; border: 1px solid var(--ink);
          background: var(--ink); color: var(--paper); font-family: inherit;
          font-size: 14.5px; font-weight: 600; cursor: pointer; margin-top: 6px;
          transition: filter 0.15s ease, transform 0.15s var(--ease-bounce), opacity 0.15s ease;
        }
        .lp-btn:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-1px); }
        .lp-btn:active:not(:disabled) { transform: scale(0.98); }
        .lp-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .lp-footer { margin: 18px 0 0; text-align: center; font-size: 13px; color: var(--muted); }
        .lp-footer a { color: var(--gold-deep); font-weight: 600; text-decoration: none; }
        .lp-footer a:hover { text-decoration: underline; }

        @media (max-width: 560px) {
          .lp-card { flex-direction: column; width: 100%; max-width: 380px; }
          .lp-stub { width: 100%; flex-direction: row; padding: 16px; }
          .lp-stub::after { right: auto; left: 0; bottom: 0; top: auto; width: auto; height: 0; border-right: none; border-bottom: 2px dashed rgba(217,164,64,0.35); }
          .lp-stub-text { writing-mode: horizontal-tb; transform: none; letter-spacing: 0.16em; }
          .lp-punch { right: auto; }
          .lp-punch.top { top: auto; left: -9px; bottom: -9px; }
          .lp-punch.bottom { bottom: -9px; left: auto; right: -9px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .lp-card, .lp-seal, .lp-punch, .lp-banner, .lp-btn, .lp-eye-icon {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="lp-card">
        <div className="lp-stub">
          <span className="lp-seal"><Star size={20} fill="currentColor" /></span>
          <span className="lp-stub-text">StoreRater</span>
          <span className="lp-punch top" />
          <span className="lp-punch bottom" />
        </div>

        <div className="lp-main">
          <p className="lp-eyebrow">Member Access</p>
          <h2 className="lp-title">Sign in</h2>
          <p className="lp-sub">Rate, manage, or browse stores from your account.</p>

          {error && (
            <div key={error} className="lp-banner"><AlertCircle size={15} /><p className="error">{error}</p></div>
          )}

          <form onSubmit={handleLogin}>
            <div className="lp-field">
              <label>Email</label>
              <input
                className="lp-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="lp-field">
              <label>Password</label>
              <div className="lp-input-wrap">
                <input
                  className="lp-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="lp-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span key={showPassword ? 'off' : 'on'} className="lp-eye-icon">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </span>
                </button>
              </div>
            </div>

            <button type="submit" className="lp-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="lp-footer">New here? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;