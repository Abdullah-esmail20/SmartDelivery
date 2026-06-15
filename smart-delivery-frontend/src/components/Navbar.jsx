import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUser } from '../utils/auth';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const user = getUser();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Theme context
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isLanding = location.pathname === '/';

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register';

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Özellikler', id: 'features' },
    { label: 'Nasıl Çalışır', id: 'how' },
    { label: 'Roller', id: 'roles' },
    { label: 'İletişim', id: 'contact' },
  ];

  return (
    <nav style={{
      ...styles.nav,
      boxShadow: scrolled
        ? '0 2px 16px rgba(38,33,92,0.12)'
        : 'none',
      background: isDark
        ? 'rgba(15,23,42,0.95)'
        : scrolled
          ? 'rgba(255,255,255,0.95)'
          : '#fff',
      backdropFilter: scrolled ? 'blur(8px)' : 'none',
      borderBottom: isDark
        ? '0.5px solid rgba(255,255,255,0.08)'
        : '0.5px solid rgba(83,74,183,0.08)'
    }}>
      <div style={styles.inner}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo size={34} color={isDark ? '#F8FAFC' : '#26215C'} />
        </Link>

        {isLanding && !user && (
          <div style={styles.desktopLinks} className="nav-desktop">
            {navLinks.map(l => (
              <span
                key={l.id}
                style={{
                  ...styles.navLink,
                  color: isDark ? '#F8FAFC' : '#26215C'
                }}
                onClick={() => scrollTo(l.id)}
              >
                {l.label}
              </span>
            ))}
          </div>
        )}

        <div style={styles.actions} className="nav-desktop">
          {/* Light / Dark Button */}
          <button
            onClick={toggleTheme}
            style={{
              ...styles.themeBtn,
              color: isDark ? '#F8FAFC' : '#26215C',
              background: isDark ? '#1E293B' : '#F5F4FF'
            }}
            className="theme-btn"
            title={isDark ? 'Açık Mod' : 'Koyu Mod'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <>
              <span style={{
                ...styles.userBadge,
                background: isDark ? '#1E293B' : '#EEEDFE',
                color: isDark ? '#F8FAFC' : '#534AB7'
              }}>
                {user.role === 'Admin' && '🛡️'}
                {user.role === 'Customer' && '🛍️'}
                {user.role === 'Courier' && '🚴'}
                {' '}{user.fullName || user.email}
              </span>

                 {user.role === 'Customer' && (
  <>
    <Link style={{
        ...styles.ghostBtn,
        color: isDark ? '#F8FAFC' : '#534AB7'
      }}
      to="/orders"
    >
      Siparişler
    </Link>
    <Link style={{
        ...styles.ghostBtn,
        color: isDark ? '#F8FAFC' : '#534AB7'
      }}
      to="/tickets"
    >
      Destek
    </Link>
  </>
)}

              {user.role === 'Courier' && (
                <Link
                  style={{
                    ...styles.ghostBtn,
                    color: isDark ? '#F8FAFC' : '#534AB7'
                  }}
                  to="/courier"
                >
                  Teslimatlar
                </Link>
              )}

              {user.role === 'Admin' && (
                <Link
                  style={{
                    ...styles.ghostBtn,
                    color: isDark ? '#F8FAFC' : '#534AB7'
                  }}
                  to="/admin"
                >
                  Dashboard
                </Link>
              )}

              <button
                style={styles.logoutBtn}
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              {isAuthPage && (
                <Link style={styles.backNavLink} className="back-nav" to="/">
                  ← Ana Sayfaya Dön
                </Link>
              )}

              <Link
                style={{
                  ...styles.ghostBtn,
                  color: isDark ? '#F8FAFC' : '#534AB7'
                }}
                to="/login"
              >
                Giriş Yap
              </Link>

              <Link style={styles.primaryBtn} to="/register">
                Kayıt Ol
              </Link>
            </>
          )}
        </div>

        <button
          style={{
            ...styles.hamburger,
            color: isDark ? '#F8FAFC' : '#26215C'
          }}
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div style={{
          ...styles.mobileMenu,
          background: isDark ? '#0F172A' : '#fff',
          borderTop: isDark
            ? '0.5px solid rgba(255,255,255,0.08)'
            : '0.5px solid rgba(83,74,183,0.1)'
        }}>
          {/* Mobile Theme Button */}
          <button
            onClick={toggleTheme}
            style={{
              ...styles.mobileThemeBtn,
              color: isDark ? '#F8FAFC' : '#26215C',
              background: isDark ? '#1E293B' : '#F5F4FF'
            }}
          >
            {isDark ? '☀️ Açık Mod' : '🌙 Koyu Mod'}
          </button>

          {isLanding && !user && navLinks.map(l => (
            <span
              key={l.id}
              style={{
                ...styles.mobileLink,
                color: isDark ? '#F8FAFC' : '#26215C'
              }}
              onClick={() => scrollTo(l.id)}
            >
              {l.label}
            </span>
          ))}

          {user ? (
            <>
            {user.role === 'Customer' && (
  <>
    <Link
      style={{
        ...styles.mobileLink,
        color: isDark ? '#F8FAFC' : '#26215C'
      }}
      to="/orders"
      onClick={() => setMenuOpen(false)}
    >
      Siparişler
    </Link>
    <Link
      style={{
        ...styles.mobileLink,
        color: isDark ? '#F8FAFC' : '#26215C'
      }}
      to="/tickets"
      onClick={() => setMenuOpen(false)}
    >
      Destek
    </Link>
  </>
)}

              {user.role === 'Courier' && (
                <Link
                  style={{
                    ...styles.mobileLink,
                    color: isDark ? '#F8FAFC' : '#26215C'
                  }}
                  to="/courier"
                  onClick={() => setMenuOpen(false)}
                >
                  Teslimatlar
                </Link>
              )}

              {user.role === 'Admin' && (
                <Link
                  style={{
                    ...styles.mobileLink,
                    color: isDark ? '#F8FAFC' : '#26215C'
                  }}
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}

              <button
                style={styles.mobileLogout}
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
              >
                Çıkış
              </button>
            </>
          ) : (
            <>
              {isAuthPage && (
                <Link
                  style={{
                    ...styles.mobileLink,
                    color: isDark ? '#F8FAFC' : '#26215C'
                  }}
                  to="/"
                  onClick={() => setMenuOpen(false)}
                >
                  ← Ana Sayfaya Dön
                </Link>
              )}

              <Link
                style={{
                  ...styles.mobileLink,
                  color: isDark ? '#F8FAFC' : '#26215C'
                }}
                to="/login"
                onClick={() => setMenuOpen(false)}
              >
                Giriş Yap
              </Link>

              <Link
                style={styles.mobilePrimary}
                to="/register"
                onClick={() => setMenuOpen(false)}
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }

        @media (min-width: 769px) {
          .nav-hamburger { display: none !important; }
        }

        .back-nav {
          transition: all 0.3s ease;
        }

        .back-nav:hover {
          color: #534AB7 !important;
          transform: translateX(-3px);
        }

        .theme-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(83,74,183,0.12);
        }
      `}</style>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
    transition: 'all 0.3s ease'
  },

  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  desktopLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center'
  },

  navLink: {
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'color 0.2s'
  },

  actions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },

  themeBtn: {
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '7px 9px',
    borderRadius: '10px',
    transition: 'all 0.3s ease'
  },

  userBadge: {
    fontSize: '13px',
    padding: '6px 12px',
    borderRadius: '20px'
  },

  ghostBtn: {
    fontSize: '14px',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500'
  },

  primaryBtn: {
    fontSize: '14px',
    color: '#fff',
    textDecoration: 'none',
    background: '#534AB7',
    padding: '8px 18px',
    borderRadius: '8px',
    fontWeight: '500'
  },

  logoutBtn: {
    fontSize: '14px',
    color: '#E24B4A',
    background: 'transparent',
    border: '1px solid rgba(226,75,74,0.3)',
    padding: '7px 14px',
    borderRadius: '8px',
    cursor: 'pointer'
  },

  backNavLink: {
    fontSize: '14px',
    color: '#888780',
    textDecoration: 'none',
    padding: '8px 12px',
    transition: 'all 0.3s ease'
  },

  hamburger: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer'
  },

  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '1rem 1.5rem'
  },

  mobileThemeBtn: {
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    textAlign: 'left',
    marginBottom: '4px'
  },

  mobileLink: {
    fontSize: '15px',
    cursor: 'pointer',
    padding: '10px',
    textDecoration: 'none',
    borderRadius: '8px'
  },

  mobilePrimary: {
    fontSize: '15px',
    color: '#fff',
    background: '#534AB7',
    padding: '10px',
    textDecoration: 'none',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: '500'
  },

  mobileLogout: {
    fontSize: '15px',
    color: '#E24B4A',
    background: 'transparent',
    border: '1px solid rgba(226,75,74,0.3)',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer'
  }
};

export default Navbar;