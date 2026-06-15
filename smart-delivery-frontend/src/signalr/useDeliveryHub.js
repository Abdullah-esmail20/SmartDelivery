import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const useDeliveryHub = (orderId) => {
  const [orderStatus, setOrderStatus] = useState('');
  const [courierLocation, setCourierLocation] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    // ✅ شرط 10: إنشاء اتصال SignalR
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7047/hubs/delivery')
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => {
        console.log('[SignalR] متصل ✅');

        // ✅ الاشتراك في متابعة هذا الطلب
        connection.invoke('SubscribeToOrder', orderId)
          .catch(err => console.error('[SignalR] خطأ:', err));

        // ✅ استقبال تغيير الحالة فوراً
        connection.on('OrderStatusChanged', (data) => {
          console.log('[SignalR] تغيرت الحالة:', data);
          setOrderStatus(data.newStatus);
        });

        // ✅ استقبال موقع الكورير فوراً
        connection.on('CourierLocationUpdated', (data) => {
          setCourierLocation({ lat: data.latitude, lng: data.longitude });
        });
      })
      .catch(err => console.error('[SignalR] فشل الاتصال:', err));

    // ✅ قطع الاتصال عند مغادرة الصفحة
    return () => { connection.stop(); };
  }, [orderId]);

  return { orderStatus, courierLocation };
};

export default useDeliveryHub;