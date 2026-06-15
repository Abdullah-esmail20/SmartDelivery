import api from '../api/axiosConfig';

// ✅ تسجيل حساب جديد
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// ✅ تسجيل الدخول
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// ✅ تغيير كلمة المرور
export const forgotPassword = async (data) => {
  const response = await api.post('/auth/forgot-password', data);
  return response.data;
};