import api from '../api/axiosConfig';

// ✅ جلب كل الطلبات
export const getAllOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

// ✅ إنشاء طلب جديد
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};
// جلب طلب واحد بالـ Id
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};
// جلب طلبات العميل فقط
// ✅ طلبات العميل فقط
export const getCustomerOrders = async (customerId) => {
  const response = await api.get(`/orders/customer/${customerId}`);
  return response.data;
};

// ✅ تعديل طلب موجود
export const updateOrder = async (orderId, orderData) => {
  const response = await api.put(`/orders/${orderId}`, orderData);
  return response.data;
};