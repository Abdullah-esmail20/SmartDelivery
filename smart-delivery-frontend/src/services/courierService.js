import api from '../api/axiosConfig';

// ✅ جلب طلبات الكورير
export const getCourierOrders = async (courierId) => {
  const response = await api.get(`/couriers/${courierId}/orders`);
  return response.data;
};

// ✅ تحديث حالة الطلب
export const updateOrderStatus = async (orderId, newStatus) => {
  const response = await api.put(
    `/couriers/orders/${orderId}/status`,
    { newStatus }
  );
  return response.data;
};