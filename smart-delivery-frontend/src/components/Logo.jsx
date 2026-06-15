const Logo = ({ size = 36, color = '#26215C', showText = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#7F77DD" />
          <stop offset="100%" stopColor="#534AB7" />
        </linearGradient>
      </defs>
      {/* درع = الأمان */}
      <path d="M24 3L42 10V24C42 35 34 43 24 46C14 43 6 35 6 24V10L24 3Z"
            fill="url(#lg)" />
      {/* صندoق = التوصيل */}
      <path d="M16 19L24 15L32 19V27L24 31L16 27V19Z"
            fill="white" fillOpacity="0.95" />
      <path d="M16 19L24 23L32 19" stroke="#534AB7"
            strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 23V31" stroke="#534AB7" strokeWidth="1.5" />
      {/* سهم = السرعة */}
      <path d="M30 33L36 33L36 39" stroke="#1D9E75"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            fill="none" />
      <path d="M36 33L29 40" stroke="#1D9E75"
            strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
    {showText && (
      <span style={{
        fontSize: `${size * 0.46}px`, fontWeight: '700',
        color, letterSpacing: '-0.02em', fontFamily: 'system-ui'
      }}>
        Smart<span style={{ fontWeight: '400', opacity: 0.85 }}>Delivery</span>
      </span>
    )}
  </div>
);

export default Logo;