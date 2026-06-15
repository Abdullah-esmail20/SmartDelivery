import api from '../api/axiosConfig';

// ✅ إنشاء شكوى جديدة
export const createTicket = async (ticketData) => {
  const response = await api.post('/tickets', ticketData);
  return response.data;
};

// ✅ جلب شكاوي العميل
export const getCustomerTickets = async (customerId) => {
  const response = await api.get(`/tickets/customer/${customerId}`);
  return response.data;
};

// ✅ جلب كل الشكاوي (للأدمن)
export const getAllTickets = async () => {
  const response = await api.get('/tickets/all');
  return response.data;
};

// ✅ الرد على شكوى
export const replyToTicket = async (ticketId, replyData) => {
  const response = await api.post(`/tickets/${ticketId}/reply`, replyData);
  return response.data;
};

// ✅ تحديث حالة الشكوى
export const updateTicketStatus = async (ticketId, newStatus) => {
  const response = await api.put(
    `/tickets/${ticketId}/status`,
    JSON.stringify(newStatus),
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};