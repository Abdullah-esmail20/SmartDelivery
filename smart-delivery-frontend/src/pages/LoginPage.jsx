import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../services/authService';
import { saveUser } from '../utils/auth';
import Logo from '../components/Logo';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [focusedField, setFocusedField] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const result = await login(form);
      if (!result.userId ||
          result.message === 'الإيميل أو كلمة المرور غير صحيحة') {
        setIsError(true);
        setMessage('E-posta veya şifre hatalı');
        return;
      }
      saveUser(result);
      setIsError(false);
      setMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => {
        window.location.href =
          result.role === 'Admin'   ? '/admin'   :
          result.role === 'Courier' ? '/courier' : '/orders';
      }, 800);
    } catch {
      setIsError(true);
      setMessage('Bir hata oluştu. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    try {
      const { forgotPassword } = await import('../services/authService');
      await forgotPassword({ email: forgotEmail, newPassword });
      setMessage('Şifre başarıyla güncellendi!');
      setIsError(false);
      setShowForgot(false);
    } catch {
      setIsError(true);
      setMessage('Bir hata oluştu.');
    }
  };

  const inputStyle = (field) => ({
    ...styles.input,
    borderColor: focusedField === field ? '#534AB7' : 'rgba(83,74,183,0.2)',
    boxShadow: focusedField === field
      ? '0 0 0 3px rgba(83,74,183,0.1)' : 'none'
  });

  return (
    <div style={styles.page}>
      <div style={styles.bgPattern} />

      <div style={styles.card}>
        

        <div style={styles.logoWrap}>
          <Logo size={42} color="#26215C" />
        </div>

        {!showForgot ? (
          <>
            <h2 style={styles.title}>Giriş Yap</h2>
            <p style={styles.sub}>Hesabınıza giriş yapın</p>

            <form onSubmit={handleSubmit}>
              <label style={styles.label}>E-posta</label>
              <input
                style={inputStyle('email')}
                type="email"
                placeholder="ornek@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                required
              />

              <label style={styles.label}>Şifre</label>
              <input
                style={inputStyle('password')}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField('')}
                required
              />

              <button
                style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
                className="login-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
              </button>
            </form>

            <p style={styles.forgotLink} className="text-link"
               onClick={() => setShowForgot(true)}>
              Şifremi unuttum
            </p>

            <div style={styles.divider}><span style={styles.dividerText}>veya</span></div>

            <p style={styles.bottomText}>
              Hesabınız yok mu?{' '}
              <Link to="/register" style={styles.link} className="text-link">
                Kayıt ol
              </Link>
            </p>
          </>
        ) : (
          <>
            <h2 style={styles.title}>Şifre Sıfırlama</h2>
            <p style={styles.sub}>Yeni şifrenizi belirleyin</p>

            <label style={styles.label}>E-posta</label>
            <input
              style={inputStyle('femail')}
              type="email"
              placeholder="ornek@email.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              onFocus={() => setFocusedField('femail')}
              onBlur={() => setFocusedField('')}
            />

            <label style={styles.label}>Yeni Şifre</label>
            <input
              style={inputStyle('fpass')}
              type="password"
              placeholder="Yeni şifreniz"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => setFocusedField('fpass')}
              onBlur={() => setFocusedField('')}
            />

            <button style={styles.btn} className="login-btn"
                    onClick={handleForgot}>
              Şifreyi Güncelle
            </button>

            <p style={styles.forgotLink} className="text-link"
               onClick={() => setShowForgot(false)}>
              ← Giriş sayfasına dön
            </p>
          </>
        )}

        {message && (
          <div style={{
            ...styles.alert,
            background:  isError ? '#FAECE7' : '#E1F5EE',
            color:       isError ? '#E24B4A' : '#1D9E75',
            borderColor: isError ? 'rgba(226,75,74,0.3)' : 'rgba(29,158,117,0.3)'
          }}>
            {message}
          </div>
        )}
      </div>

      <style>{`
        .back-link { transition: all 0.3s ease; }
        .back-link:hover { color: #534AB7 !important; transform: translateX(-3px); }
        .login-btn { transition: all 0.3s ease; }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(83,74,183,0.35) !important;
        }
        .text-link { transition: all 0.3s ease; }
        .text-link:hover { opacity: 0.7; }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: 'radial-gradient(circle at 30% 20%, #EEEDFE 0%, #F5F4FF 50%, #fff 100%)',
    padding: '2rem', position: 'relative', overflow: 'hidden'
  },
  bgPattern: {
    position: 'absolute', top: '-10%', right: '-5%',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(83,74,183,0.04), transparent)',
    pointerEvents: 'none'
  },
  card: {
    background: '#fff', borderRadius: '20px',
    padding: '2.5rem', width: '100%', maxWidth: '440px',
    boxShadow: '0 10px 30px rgba(83,74,183,0.10)',
    border: '0.5px solid rgba(83,74,183,0.1)',
    position: 'relative', zIndex: 1
  },
  backLink: {
    display: 'inline-block', color: '#888780',
    textDecoration: 'none', fontSize: '13px', marginBottom: '1.25rem'
  },
  logoWrap: { display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' },
  title: {
    fontSize: '24px', fontWeight: '700', color: '#26215C',
    textAlign: 'center', marginBottom: '6px', letterSpacing: '-0.02em'
  },
  sub: {
    fontSize: '14px', color: '#888780',
    textAlign: 'center', marginBottom: '1.75rem'
  },
  label: {
    display: 'block', fontSize: '13px', fontWeight: '500',
    color: '#26215C', marginBottom: '6px'
  },
  input: {
    width: '100%', padding: '11px 14px', marginBottom: '1.1rem',
    borderRadius: '10px', border: '1px solid rgba(83,74,183,0.2)',
    fontSize: '14px', boxSizing: 'border-box', outline: 'none',
    color: '#26215C', transition: 'all 0.3s ease'
  },
  btn: {
    width: '100%', padding: '12px',
    background: '#534AB7', color: '#fff', border: 'none',
    borderRadius: '10px', fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', marginTop: '4px'
  },
  forgotLink: {
    textAlign: 'center', fontSize: '13px', color: '#534AB7',
    cursor: 'pointer', marginTop: '1rem'
  },
  divider: {
    display: 'flex', alignItems: 'center', textAlign: 'center',
    margin: '1.5rem 0', color: '#C0BEE0'
  },
  dividerText: {
    fontSize: '12px', color: '#888780', padding: '0 12px',
    position: 'relative', background: '#fff', margin: '0 auto'
  },
  bottomText: { textAlign: 'center', fontSize: '14px', color: '#888780' },
  link: { color: '#534AB7', fontWeight: '600', textDecoration: 'none' },
  alert: {
    marginTop: '1rem', padding: '11px 14px', borderRadius: '10px',
    fontSize: '13px', border: '1px solid', textAlign: 'center'
  }
};

export default LoginPage;