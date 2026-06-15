import api from '../api/axiosConfig';

// ✅ RabbitMQ mesaj göndermek için frontend wrapper.
// Backend üzerinde bir RabbitMQ yayın endpoint'i olmalıdır.
export const sendRabbitMessage = async (queueName, payload) => {
  const response = await api.post('/rabbitmq/send', {
    queueName,
    payload,
  });
  return response.data;
};
