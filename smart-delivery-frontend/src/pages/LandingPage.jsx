import { Link } from 'react-router-dom';
import { getUser } from '../utils/auth';
import Logo from '../components/Logo';
import truckImage from '../assets/logo.png';

const LandingPage = () => {
  const user = getUser();

  return (
    <div style={styles.wrapper}>

      {/* ═══ HERO ═══ */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroLeft}>
            <span style={styles.badge}>
              ⚡ Akıllı Kargo ve Teslimat Sistemi
            </span>
            <h1 style={styles.heroTitle}>
              Daha akıllı teslimat,<br />
              <span style={styles.heroAccent}>gerçek zamanlı takip</span>
            </h1>
            <p style={styles.heroSub}>
              Müşterileri, kuryeleri ve yöneticileri tek platformda
              buluşturan modern teslimat sistemi.
            </p>
            <div style={styles.heroBtns}>
              {user ? (
                <Link style={styles.btnPrimary} to={
                  user.role === 'Admin' ? '/admin' :
                  user.role === 'Courier' ? '/courier' : '/orders'
                }>Panele Git →</Link>
              ) : (
                <>
                  <Link style={styles.btnPrimary} to="/register">
                    Kayıt Ol →
                  </Link>
                  <Link style={styles.btnSecondary} to="/login">
                    Giriş Yap
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* رسم توضيحي */}
          <div style={styles.heroRight}>
            <div style={styles.illustration}>
              <div style={{...styles.floatCard, ...styles.card1}}>
                <span style={styles.cardIcon}>📦</span>
                <span style={styles.cardText}>Paket Hazır</span>
              </div>
              <div style={{...styles.floatCard, ...styles.card2}}>
                <span style={styles.cardIcon}>🚴</span>
                <span style={styles.cardText}>Kurye Yolda</span>
              </div>
              <div style={{...styles.floatCard, ...styles.card3}}>
                <span style={styles.liveDot}></span>
                <span style={styles.cardText}>Canlı Takip</span>
              </div>
              <div style={{...styles.floatCard, ...styles.card4}}>
                <span style={styles.cardIcon}>🛡️</span>
                <span style={styles.cardText}>Güvenli</span>
              </div>
              <div style={styles.centerOrb}>
 <div style={styles.centerOrb}>
  <img
    src={truckImage}
    alt="Teslimat"
    style={{
      width: '100%', height: '100%',
      objectFit: 'cover', borderRadius: '50%'
    }}
  />
</div>
</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={styles.statsSection}>
        {[
          { icon: '📡', title: 'Canlı Takip',
            desc: 'Siparişleri anlık izleyin' },
          { icon: '👥', title: '3 Kullanıcı Rolü',
            desc: 'Müşteri, Kurye, Yönetici' },
          { icon: '⚡', title: 'Otomatik Atama',
            desc: 'Kuryeler otomatik atanır' },
        ].map(s => (
          <div key={s.title} style={styles.statCard}>
            <div style={styles.statIcon}>{s.icon}</div>
            <div>
              <p style={styles.statTitle}>{s.title}</p>
              <p style={styles.statDesc}>{s.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" style={styles.section}>
        <div style={styles.sectionHead}>
          <span style={styles.sectionLabel}>ÖZELLİKLER</span>
          <h2 style={styles.sectionTitle}>İhtiyacınız olan her şey</h2>
          <p style={styles.sectionSub}>
            Modern mimari ve gerçek zamanlı teknolojiler ile güçlendirildi.
          </p>
        </div>
        <div style={styles.featuresGrid}>
          {[
            { icon: '📡', title: 'Canlı Takip',
              desc: 'Siparişler SignalR ile gerçek zamanlı güncellenir.',
              bg: '#EEEDFE' },
            { icon: '⚡', title: 'Otomatik Atama',
              desc: 'Sistem en uygun kuryeyi otomatik seçer.',
              bg: '#E1F5EE' },
            { icon: '🎫', title: 'Destek Talepleri',
              desc: 'Müşteriler şikayet gönderir, yöneticiler yanıtlar.',
              bg: '#FAEEDA' },
            { icon: '🛡️', title: 'Yönetici Paneli',
              desc: 'Siparişler ve kullanıcılar üzerinde tam kontrol.',
              bg: '#FAECE7' },
          ].map(f => (
            <div key={f.title} className="feature-card" style={styles.featureCard}>
              <div style={{...styles.featureIcon, background: f.bg}}>
                {f.icon}
              </div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how" style={styles.section}>
        <div style={styles.sectionHead}>
          <span style={styles.sectionLabel}>NASIL ÇALIŞIR</span>
          <h2 style={styles.sectionTitle}>Üç basit adım</h2>
        </div>
        <div style={styles.timeline}>
          {[
            { num: '1', title: 'Sipariş Ver',
              desc: 'Müşteri olarak teslimat siparişi oluşturun.' },
            { num: '2', title: 'Otomatik Atama',
              desc: 'Sistem siparişinizi uygun kuryeye atar.' },
            { num: '3', title: 'Canlı Takip',
              desc: 'Siparişinizi her adımda anlık takip edin.' },
          ].map((s, i) => (
            <div key={s.num} style={styles.timelineItem}>
              <div style={styles.timelineCircle}>{s.num}</div>
              {i < 2 && <div style={styles.timelineLine} />}
              <h3 style={styles.timelineTitle}>{s.title}</h3>
              <p style={styles.timelineDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ROLES ═══ */}
      <section id="roles" style={{...styles.section, ...styles.rolesSection}}>
        <div style={styles.sectionHead}>
          <span style={styles.sectionLabel}>ROLLER</span>
          <h2 style={styles.sectionTitle}>Üç rol, tek platform</h2>
        </div>
        <div style={styles.rolesGrid}>
          {[
            { icon: '🛍️', role: 'Müşteri',
              desc: 'Teslimat siparişleri oluşturur ve canlı takip eder.',
              bg: '#EEEDFE', link: '/register' },
            { icon: '🚴', role: 'Kurye',
              desc: 'Atanan siparişleri alır ve durumu günceller.',
              bg: '#E1F5EE', link: '/register' },
            { icon: '🛡️', role: 'Yönetici',
              desc: 'Kullanıcıları, siparişleri ve destek taleplerini yönetir.',
              bg: '#FAECE7', link: '/login' },
          ].map(r => (
            <div key={r.role} className="role-card" style={styles.roleCard}>
              <div style={{...styles.roleAvatar, background: r.bg}}>
                {r.icon}
              </div>
              <h3 style={styles.roleTitle}>{r.role}</h3>
              <p style={styles.roleDesc}>{r.desc}</p>
              <Link to={r.link} style={styles.roleLink}>Başla →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaInner}>
          <h2 style={styles.ctaTitle}>Başlamaya hazır mısınız?</h2>
          <p style={styles.ctaSub}>
            SmartDelivery'e katılın ve hızlı, güvenli teslimatın
            keyfini çıkarın.
          </p>
          <div style={styles.heroBtns}>
            <Link style={styles.ctaBtnPrimary} to="/register">
              Hesap Oluştur
            </Link>
            <Link style={styles.ctaBtnSecondary} to="/login">
              Giriş Yap
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer id="contact" style={styles.footer}>
        <div style={styles.footerGrid}>
          <div style={styles.footerCol}>
            <Logo size={32} color="#26215C" />
            <p style={styles.footerDesc}>
              Modern kargo ve teslimat yönetim sistemi.
            </p>
          </div>
          <div style={styles.footerCol}>
            <p style={styles.footerColTitle}>Hızlı Bağlantılar</p>
            <Link style={styles.footerLink} to="/register">Kayıt Ol</Link>
            <Link style={styles.footerLink} to="/login">Giriş Yap</Link>
          </div>
          <div style={styles.footerCol}>
            <p style={styles.footerColTitle}>İletişim</p>
            <p style={styles.footerText}>📧 info@smartdelivery.com</p>
            <p style={styles.footerText}>📍 Isparta, Türkiye</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.copyright}>
            © 2025 SmartDelivery — Isparta Uygulamalı Bilimler Üniversitesi
            <br />
            Yazılım Tasarım ve Mimarisi Projesi
          </p>
        </div>
      </footer>

      {/* CSS animations + hover */}
      <style>{`
        .feature-card { transition: all 0.3s ease; }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 32px rgba(83,74,183,0.15);
        }
        .role-card { transition: all 0.3s ease; }
        .role-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 32px rgba(83,74,183,0.15);
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (max-width: 900px) {
          .hero-content { flex-direction: column !important; }
          .hero-right { display: none !important; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  wrapper: { background: '#fff' },

  // HERO
  hero: {
    background: 'linear-gradient(135deg, #F5F4FF 0%, #EEEDFE 100%)',
    padding: '4rem 1.5rem 5rem'
  },
  heroContent: {
    maxWidth: '1200px', margin: '0 auto',
    display: 'flex', alignItems: 'center', gap: '3rem'
  },
  heroLeft: { flex: 1 },
  badge: {
    display: 'inline-block', background: '#fff', color: '#534AB7',
    fontSize: '13px', padding: '6px 16px', borderRadius: '20px',
    marginBottom: '1.5rem', fontWeight: '500',
    boxShadow: '0 2px 8px rgba(83,74,183,0.1)'
  },
  heroTitle: {
    fontSize: '44px', fontWeight: '700', color: '#26215C',
    lineHeight: '1.15', marginBottom: '1.25rem', letterSpacing: '-0.02em'
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #534AB7, #7F77DD)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  heroSub: {
    fontSize: '17px', color: '#6B6885',
    lineHeight: '1.7', marginBottom: '2rem', maxWidth: '440px'
  },
  heroBtns: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  btnPrimary: {
    background: '#534AB7', color: '#fff', padding: '13px 28px',
    borderRadius: '10px', textDecoration: 'none',
    fontSize: '15px', fontWeight: '600',
    boxShadow: '0 4px 16px rgba(83,74,183,0.3)'
  },
  btnSecondary: {
    background: '#fff', color: '#534AB7', padding: '13px 28px',
    borderRadius: '10px', textDecoration: 'none',
    fontSize: '15px', fontWeight: '600',
    border: '1px solid rgba(83,74,183,0.2)'
  },

  // Hero illustration
  heroRight: { flex: 1, display: 'flex', justifyContent: 'center' },
  illustration: {
    position: 'relative', width: '320px', height: '320px'
  },
  centerOrb: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%,-50%)',
    width: '120px', height: '120px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #534AB7, #7F77DD)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '48px', boxShadow: '0 8px 32px rgba(83,74,183,0.4)'
  },
  floatCard: {
    position: 'absolute', background: '#fff',
    padding: '10px 16px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 20px rgba(38,33,92,0.12)',
    animation: 'float 3s ease-in-out infinite'
  },
  card1: { top: '0', left: '10px', animationDelay: '0s' },
  card2: { top: '30px', right: '0', animationDelay: '0.5s' },
  card3: { bottom: '40px', left: '0', animationDelay: '1s' },
  card4: { bottom: '0', right: '20px', animationDelay: '1.5s' },
  cardIcon: { fontSize: '18px' },
  cardText: { fontSize: '13px', fontWeight: '500', color: '#26215C' },
  liveDot: {
    width: '10px', height: '10px', borderRadius: '50%',
    background: '#1D9E75', display: 'inline-block'
  },

  // STATS
  statsSection: {
    maxWidth: '1100px', margin: '-3rem auto 0', padding: '0 1.5rem',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1rem', position: 'relative', zIndex: 2
  },
  statCard: {
    background: '#fff', borderRadius: '16px', padding: '1.5rem',
    display: 'flex', alignItems: 'center', gap: '16px',
    boxShadow: '0 4px 24px rgba(38,33,92,0.08)',
    border: '0.5px solid rgba(83,74,183,0.1)'
  },
  statIcon: {
    width: '52px', height: '52px', borderRadius: '14px',
    background: '#EEEDFE', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '24px', flexShrink: 0
  },
  statTitle: { fontSize: '16px', fontWeight: '600', color: '#26215C', margin: 0 },
  statDesc: { fontSize: '13px', color: '#888780', margin: '2px 0 0' },

  // SECTIONS
  section: { maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem' },
  sectionHead: { textAlign: 'center', marginBottom: '2.5rem' },
  sectionLabel: {
    fontSize: '12px', fontWeight: '700', color: '#534AB7',
    letterSpacing: '0.1em'
  },
  sectionTitle: {
    fontSize: '30px', fontWeight: '700', color: '#26215C',
    margin: '8px 0', letterSpacing: '-0.02em'
  },
  sectionSub: {
    fontSize: '16px', color: '#6B6885', maxWidth: '480px',
    margin: '0 auto', lineHeight: '1.6'
  },

  // FEATURES
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem'
  },
  featureCard: {
    background: '#fff', borderRadius: '16px', padding: '1.75rem',
    border: '0.5px solid rgba(83,74,183,0.12)',
    boxShadow: '0 2px 12px rgba(38,33,92,0.04)'
  },
  featureIcon: {
    width: '48px', height: '48px', borderRadius: '14px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', marginBottom: '1rem'
  },
  featureTitle: {
    fontSize: '17px', fontWeight: '600', color: '#26215C', marginBottom: '8px'
  },
  featureDesc: { fontSize: '14px', color: '#6B6885', lineHeight: '1.6' },

  // TIMELINE
  timeline: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem'
  },
  timelineItem: { textAlign: 'center', position: 'relative' },
  timelineCircle: {
    width: '56px', height: '56px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #534AB7, #7F77DD)',
    color: '#fff', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '22px', fontWeight: '700',
    margin: '0 auto 1rem', boxShadow: '0 4px 16px rgba(83,74,183,0.3)'
  },
  timelineLine: {
    position: 'absolute', top: '28px', left: '50%',
    width: '100%', height: '2px',
    background: 'linear-gradient(90deg, #534AB7, transparent)',
    zIndex: -1
  },
  timelineTitle: {
    fontSize: '17px', fontWeight: '600', color: '#26215C', marginBottom: '6px'
  },
  timelineDesc: {
    fontSize: '14px', color: '#6B6885', lineHeight: '1.6',
    maxWidth: '220px', margin: '0 auto'
  },

  // ROLES
  rolesSection: {
    background: '#F5F4FF', maxWidth: '100%', borderRadius: '0'
  },
  rolesGrid: {
    maxWidth: '1000px', margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem'
  },
  roleCard: {
    background: '#fff', borderRadius: '16px', padding: '2rem',
    textAlign: 'center', border: '0.5px solid rgba(83,74,183,0.12)',
    boxShadow: '0 2px 12px rgba(38,33,92,0.04)'
  },
  roleAvatar: {
    width: '64px', height: '64px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '28px', margin: '0 auto 1rem'
  },
  roleTitle: {
    fontSize: '18px', fontWeight: '600', color: '#26215C', marginBottom: '8px'
  },
  roleDesc: {
    fontSize: '14px', color: '#6B6885', lineHeight: '1.6', marginBottom: '1rem'
  },
  roleLink: {
    color: '#534AB7', fontSize: '14px', fontWeight: '600',
    textDecoration: 'none'
  },

  // CTA
  ctaSection: { padding: '4rem 1.5rem' },
  ctaInner: {
    maxWidth: '900px', margin: '0 auto',
    background: 'linear-gradient(135deg, #26215C 0%, #534AB7 60%, #7F77DD 100%)',
    borderRadius: '24px', padding: '3.5rem 2rem', textAlign: 'center',
    boxShadow: '0 12px 40px rgba(83,74,183,0.25)'
  },
  ctaTitle: {
    fontSize: '32px', fontWeight: '700', color: '#fff',
    marginBottom: '12px', letterSpacing: '-0.02em'
  },
  ctaSub: {
    fontSize: '16px', color: '#CECBF6', marginBottom: '2rem',
    maxWidth: '420px', margin: '0 auto 2rem', lineHeight: '1.6'
  },
  ctaBtnPrimary: {
    background: '#fff', color: '#534AB7', padding: '13px 32px',
    borderRadius: '10px', textDecoration: 'none',
    fontSize: '15px', fontWeight: '600'
  },
  ctaBtnSecondary: {
    background: 'rgba(255,255,255,0.15)', color: '#fff',
    padding: '13px 32px', borderRadius: '10px', textDecoration: 'none',
    fontSize: '15px', fontWeight: '600',
    border: '1px solid rgba(255,255,255,0.3)'
  },

  // FOOTER
  footer: {
    background: '#F5F4FF', borderTop: '0.5px solid rgba(83,74,183,0.12)',
    padding: '3rem 1.5rem 1.5rem'
  },
  footerGrid: {
    maxWidth: '1100px', margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem', marginBottom: '2rem'
  },
  footerCol: { display: 'flex', flexDirection: 'column', gap: '10px' },
  footerDesc: { fontSize: '14px', color: '#6B6885', lineHeight: '1.6' },
  footerColTitle: {
    fontSize: '14px', fontWeight: '600', color: '#26215C', marginBottom: '4px'
  },
  footerLink: {
    fontSize: '14px', color: '#6B6885', textDecoration: 'none'
  },
  footerText: { fontSize: '14px', color: '#6B6885', margin: 0 },
  footerBottom: {
    maxWidth: '1100px', margin: '0 auto',
    borderTop: '0.5px solid rgba(83,74,183,0.12)', paddingTop: '1.5rem'
  },
  copyright: {
    fontSize: '13px', color: '#888780',
    textAlign: 'center', lineHeight: '1.6'
  }
};

export default LandingPage;