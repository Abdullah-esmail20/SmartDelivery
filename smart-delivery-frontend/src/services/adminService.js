import api from '../api/axiosConfig';

// ✅ جلب الإحصائيات
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

// ✅ جلب كل الطلبات
export const getAllOrdersAdmin = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

// ✅ جلب كل المستخدمين
export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

// ✅ حذف مستخدم
export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};