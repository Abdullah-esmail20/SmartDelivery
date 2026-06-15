import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/authService';
import { saveUser } from '../utils/auth';
import Logo from '../components/Logo';

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullName: '', email: '', password: '',
    phone: '', address: '', role: 'Customer'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  // ✅ مؤشر قوة كلمة المرور
  const getPasswordStrength = (pass) => {
    if (!pass) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { level: 1, label: 'Zayıf', color: '#E24B4A' };
    if (score <= 3) return { level: 2, label: 'Orta',  color: '#BA7517' };
    return { level: 3, label: 'Güçlü', color: '#1D9E75' };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const result = await register(form);
      if (result.message === 'الإيميل مستخدم مسبقاً') {
        setIsError(true);
        setMessage('Bu e-posta zaten kullanılıyor.');
        return;
      }
      saveUser(result);
      setIsError(false);
      setMessage('Hesap başarıyla oluşturuldu!');
      setTimeout(() => {
        window.location.href =
          result.role === 'Courier' ? '/courier' : '/orders';
      }, 800);
    } catch {
      setIsError(true);
      setMessage('Bir hata oluştu. Tekrar deneyin.');
    } finally {
      setLoading(false);
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

        <h2 style={styles.title}>Hesap Oluştur</h2>
        <p style={styles.sub}>SmartDelivery'e hoş geldiniz</p>

        {/* Role Selection */}
        <div style={styles.roleRow}>
          {[
            { value: 'Customer', icon: '🛍️', label: 'Müşteri', desc: 'Sipariş ver' },
            { value: 'Courier',  icon: '🚴', label: 'Kurye',   desc: 'Teslimat yap' },
          ].map(r => (
            <div
              key={r.value}
              className="role-card"
              style={{
                ...styles.roleCard,
                ...(form.role === r.value ? styles.roleActive : {})
              }}
              onClick={() => setForm({ ...form, role: r.value })}
            >
              <span style={styles.roleIcon}>{r.icon}</span>
              <span style={styles.roleLabel}>{r.label}</span>
              <span style={styles.roleDesc}>{r.desc}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Ad Soyad</label>
          <input
            style={inputStyle('name')}
            type="text" placeholder="Adınız Soyadınız"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField('')}
            required
          />

          <label style={styles.label}>E-posta</label>
          <input
            style={inputStyle('email')}
            type="email" placeholder="ornek@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
            required
          />

          <label style={styles.label}>Şifre</label>
          <input
            style={inputStyle('pass')}
            type="password" placeholder="En az 6 karakter"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onFocus={() => setFocusedField('pass')}
            onBlur={() => setFocusedField('')}
            required
          />

          {/* مؤشر قوة كلمة المرور */}
          {form.password && (
            <div style={styles.strengthWrap}>
              <div style={styles.strengthBars}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    ...styles.strengthBar,
                    background: i <= strength.level
                      ? strength.color : '#EEEDFE'
                  }} />
                ))}
              </div>
              <span style={{ ...styles.strengthLabel, color: strength.color }}>
                {strength.label}
              </span>
            </div>
          )}

          <label style={styles.label}>Telefon</label>
          <input
            style={inputStyle('phone')}
            type="text" placeholder="05xx xxx xx xx"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField('')}
            required
          />

          {form.role === 'Customer' && (
            <>
              <label style={styles.label}>Adres</label>
              <input
                style={inputStyle('addr')}
                type="text" placeholder="İstanbul - Taksim"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                onFocus={() => setFocusedField('addr')}
                onBlur={() => setFocusedField('')}
                required
              />
            </>
          )}

          <button
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            className="register-btn"
            type="submit" disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol →'}
          </button>
        </form>

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

        <p style={styles.bottomText}>
          Zaten hesabınız var mı?{' '}
          <Link to="/login" style={styles.link} className="text-link">
            Giriş yap
          </Link>
        </p>
      </div>

      <style>{`
        .back-link { transition: all 0.3s ease; }
        .back-link:hover { color: #534AB7 !important; transform: translateX(-3px); }
        .register-btn { transition: all 0.3s ease; }
        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(83,74,183,0.35) !important;
        }
        .role-card { transition: all 0.3s ease; }
        .role-card:hover { transform: translateY(-2px); }
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
    background: 'radial-gradient(circle at 70% 20%, #EEEDFE 0%, #F5F4FF 50%, #fff 100%)',
    padding: '2rem', position: 'relative', overflow: 'hidden'
  },
  bgPattern: {
    position: 'absolute', bottom: '-10%', left: '-5%',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(83,74,183,0.04), transparent)',
    pointerEvents: 'none'
  },
  card: {
    background: '#fff', borderRadius: '20px',
    padding: '2.5rem', width: '100%', maxWidth: '500px',
    boxShadow: '0 10px 30px rgba(83,74,183,0.10)',
    border: '0.5px solid rgba(83,74,183,0.1)',
    position: 'relative', zIndex: 1, margin: '2rem 0'
  },
  backLink: {
    display: 'inline-block', color: '#888780',
    textDecoration: 'none', fontSize: '13px', marginBottom: '1.25rem'
  },
  logoWrap: { display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' },
  title: {
    fontSize: '24px', fontWeight: '700', color: '#26215C',
    textAlign: 'center', marginBottom: '6px', letterSpacing: '-0.02em'
  },
  sub: {
    fontSize: '14px', color: '#888780',
    textAlign: 'center', marginBottom: '1.5rem'
  },
  roleRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '12px', marginBottom: '1.5rem'
  },
  roleCard: {
    border: '1px solid rgba(83,74,183,0.2)', borderRadius: '12px',
    padding: '14px', cursor: 'pointer', textAlign: 'center',
    display: 'flex', flexDirection: 'column', gap: '4px'
  },
  roleActive: {
    background: '#EEEDFE', border: '2px solid #534AB7',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(83,74,183,0.15)'
  },
  roleIcon: { fontSize: '22px' },
  roleLabel: { fontSize: '14px', fontWeight: '600', color: '#26215C' },
  roleDesc: { fontSize: '11px', color: '#888780' },
  label: {
    display: 'block', fontSize: '13px', fontWeight: '500',
    color: '#26215C', marginBottom: '6px'
  },
  input: {
    width: '100%', padding: '11px 14px', marginBottom: '1rem',
    borderRadius: '10px', border: '1px solid rgba(83,74,183,0.2)',
    fontSize: '14px', boxSizing: 'border-box', outline: 'none',
    color: '#26215C', transition: 'all 0.3s ease'
  },
  strengthWrap: {
    display: 'flex', alignItems: 'center', gap: '10px',
    marginTop: '-4px', marginBottom: '1rem'
  },
  strengthBars: { display: 'flex', gap: '4px', flex: 1 },
  strengthBar: {
    height: '4px', flex: 1, borderRadius: '2px',
    transition: 'background 0.3s ease'
  },
  strengthLabel: { fontSize: '12px', fontWeight: '500', minWidth: '40px' },
  btn: {
    width: '100%', padding: '12px',
    background: '#534AB7', color: '#fff', border: 'none',
    borderRadius: '10px', fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', marginTop: '4px'
  },
  alert: {
    marginTop: '1rem', padding: '11px 14px', borderRadius: '10px',
    fontSize: '13px', border: '1px solid', textAlign: 'center'
  },
  bottomText: {
    textAlign: 'center', fontSize: '14px',
    color: '#888780', marginTop: '1.5rem'
  },
  link: { color: '#534AB7', fontWeight: '600', textDecoration: 'none' }
};

export default RegisterPage;