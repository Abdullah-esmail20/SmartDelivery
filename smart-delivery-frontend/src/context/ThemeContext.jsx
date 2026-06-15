import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // ✅ نقرأ التفضيل المحفوظ
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // ✅ نحفظ عند كل تغيير
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.body.style.background = isDark ? '#0F172A' : '#fff';
    document.body.style.transition = 'background 0.3s ease';
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // ✅ ألوان حسب الوضع
  const theme = isDark ? {
    bg:        '#0F172A',
    card:      '#1E293B',
    border:    '#334155',
    text:      '#F8FAFC',
    textMuted: '#CBD5E1',
    primary:   '#534AB7',
    inputBg:   '#0F172A',
  } : {
    bg:        '#F5F4FF',
    card:      '#FFFFFF',
    border:    'rgba(83,74,183,0.15)',
    text:      '#26215C',
    textMuted: '#888780',
    primary:   '#534AB7',
    inputBg:   '#FFFFFF',
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);