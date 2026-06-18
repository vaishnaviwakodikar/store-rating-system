import { useState } from 'react';
import { LayoutGrid, Store, KeyRound, LogOut, Menu, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

/* ---------------------------------------------------------------------- */
/*  Nav config — one place to add/remove items per role                   */
/* ---------------------------------------------------------------------- */
const ROLE_NAV = {
  admin: [{ to: '/admin/dashboard', label: 'Dashboard', icon: 'grid' }],
  user: [{ to: '/stores', label: 'Browse Stores', icon: 'store' }],
  store_owner: [{ to: '/owner/dashboard', label: 'My Store', icon: 'store' }],
};

/* ---------------------------------------------------------------------- */
/*  Icon lookup — maps nav item icon keys to lucide-react components      */
/* ---------------------------------------------------------------------- */
const ICONS = {
  grid: LayoutGrid,
  store: Store,
};

const NavIcon = ({ name, ...props }) => {
  const Component = ICONS[name];
  return Component ? <Component {...props} /> : null;
};

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = ROLE_NAV[user?.role] || [];
  const initials = (user?.name || user?.email || '?').trim().charAt(0).toUpperCase();
  const roleLabel = user?.role ? user.role.replace('_', ' ') : null;

  return (
    <div className="sr-shell">
      <style>{`
        /* NOTE: move this @import to your global stylesheet/index.html in production */
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@500&display=swap');

        .sr-shell {
          --ink: #15291f;
          --ink-soft: #1d3527;
          --ink-line: #2c4636;
          --muted: #8fa396;
          --paper: #f6f1e7;
          --gold: #d9a440;
          --gold-deep: #b8852b;
          --danger: #c1502f;
          display: flex;
          min-height: 100vh;
          background: var(--paper);
          font-family: 'Space Grotesk', system-ui, sans-serif;
        }

        .sr-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: var(--ink);
          color: var(--paper);
          display: flex;
          flex-direction: column;
          padding: 22px 16px 18px;
          position: relative;
          transition: width 0.22s ease;
        }
        .sr-sidebar.is-collapsed { width: 76px; }

        .sr-toggle {
          align-self: flex-end;
          background: transparent;
          border: 1px solid var(--ink-line);
          color: var(--muted);
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          margin-bottom: 14px;
          transition: border-color 0.15s ease, color 0.15s ease;
        }
        .sr-toggle:hover { color: var(--gold); border-color: var(--gold); }

        .sr-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 4px 18px;
          overflow: hidden;
        }
        .sr-brand-mark {
          flex-shrink: 0;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--gold);
          color: var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sr-brand-name {
          font-weight: 700;
          font-size: 17px;
          letter-spacing: 0.2px;
          white-space: nowrap;
        }
        .sr-sidebar.is-collapsed .sr-brand-name { display: none; }

        .sr-account {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--ink-soft);
          border: 1px solid var(--ink-line);
          border-radius: 10px;
          padding: 9px 10px;
          margin-bottom: 18px;
          overflow: hidden;
        }
        .sr-avatar {
          flex-shrink: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--ink-line);
          color: var(--paper);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sr-account-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }
        .sr-sidebar.is-collapsed .sr-account-info { display: none; }
        .sr-account-name {
          font-size: 12.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sr-role-pill {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--gold);
          width: fit-content;
        }

        .sr-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sr-link {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 10px;
          border-radius: 8px;
          color: var(--muted);
          text-decoration: none;
          font-size: 13.5px;
          font-weight: 500;
          transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
          white-space: nowrap;
          overflow: hidden;
        }
        .sr-link:hover { background: var(--ink-soft); color: var(--paper); transform: translateX(2px); }
        .sr-link.is-active { background: var(--ink-soft); color: var(--paper); }
        .sr-link-icon { display: flex; flex-shrink: 0; }
        .sr-link-icon svg { stroke: currentColor; fill: none; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
        .sr-link-label { flex: 1; }
        .sr-sidebar.is-collapsed .sr-link-label { display: none; }

        .sr-link-mark {
          flex-shrink: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          transform: scale(0);
          transition: transform 0.18s ease;
        }
        .sr-link.is-active .sr-link-mark { transform: scale(1); }

        .sr-tear {
          position: relative;
          height: 1px;
          margin: 16px 4px 14px;
          background: repeating-linear-gradient(to right, var(--ink-line) 0 6px, transparent 6px 11px);
        }
        .sr-tear::before, .sr-tear::after {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, rgba(0,0,0,0.4), rgba(0,0,0,0.12) 60%, transparent 72%);
        }
        .sr-tear::before { left: -16px; }
        .sr-tear::after { right: -16px; }

        .sr-logout {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          justify-content: center;
          background: var(--danger);
          color: var(--paper);
          border: none;
          padding: 11px 10px;
          border-radius: 8px;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: filter 0.15s ease, transform 0.1s ease;
        }
        .sr-logout:hover { filter: brightness(1.08); }
        .sr-logout:active { transform: scale(0.97); }
        .sr-sidebar.is-collapsed .sr-logout span:last-child { display: none; }

        .sr-link:focus-visible,
        .sr-logout:focus-visible,
        .sr-toggle:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 2px;
        }

        .sr-main {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .sr-main { padding: 20px 16px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .sr-sidebar, .sr-link, .sr-link-mark, .sr-logout, .sr-toggle { transition: none !important; }
        }
      `}</style>

      <aside className={`sr-sidebar${collapsed ? ' is-collapsed' : ''}`}>
        <button
          className="sr-toggle"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu size={18} strokeWidth={1.8} strokeLinecap="round" />
        </button>

        <div className="sr-brand">
          <span className="sr-brand-mark">
            <Star size={20} fill="currentColor" />
          </span>
          <span className="sr-brand-name">StoreRater</span>
        </div>

        <div className="sr-account">
          <span className="sr-avatar">{initials}</span>
          <div className="sr-account-info">
            <span className="sr-account-name">{user?.name || user?.email || 'Guest'}</span>
            {roleLabel && <span className="sr-role-pill">{roleLabel}</span>}
          </div>
        </div>

        <nav className="sr-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sr-link${isActive ? ' is-active' : ''}`}
            >
              <span className="sr-link-icon">
                <NavIcon
                  name={item.icon}
                  style={{ stroke: 'currentColor', fill: 'none', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }}
                />
              </span>
              <span className="sr-link-label">{item.label}</span>
              <span className="sr-link-mark" />
            </NavLink>
          ))}

          <NavLink
            to="/change-password"
            className={({ isActive }) => `sr-link${isActive ? ' is-active' : ''}`}
          >
            <span className="sr-link-icon">
              <KeyRound style={{ stroke: 'currentColor', fill: 'none', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
            </span>
            <span className="sr-link-label">Change Password</span>
            <span className="sr-link-mark" />
          </NavLink>
        </nav>

        <div className="sr-tear" aria-hidden="true" />

        <button className="sr-logout" onClick={handleLogout}>
          <LogOut style={{ stroke: 'currentColor', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }} />
          <span>Log out</span>
        </button>
      </aside>

      <main className="sr-main">{children}</main>
    </div>
  );
};

export default Layout;