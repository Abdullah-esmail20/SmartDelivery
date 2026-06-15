import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useDeliveryHub from '../signalr/useDeliveryHub';
import { getOrderById } from '../services/orderService';

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const { orderStatus: realtimeStatus, courierLocation } =
    useDeliveryHub(orderId);
  const [currentStatus, setCurrentStatus] = useState('');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId)
        .then(data => {
          setOrder(data);
          setCurrentStatus(data.status);
        })
        .catch(console.error);
    }
  }, [orderId]);

  const orderStatus = realtimeStatus || currentStatus;

  const steps = [
    { key: 'Pending',   icon: '⏳', label: 'Sipariş Alındı'    },
    { key: 'Assigned',  icon: '👤', label: 'Kurye Atandı'       },
    { key: 'PickedUp',  icon: '📦', label: 'Kargo Teslim Alındı'},
    { key: 'InTransit', icon: '🚴', label: 'Yolda'              },
    { key: 'Delivered', icon: '✅', label: 'Teslim Edildi'      },
  ];

  const currentIndex = steps.findIndex(s => s.key === orderStatus);

  const getStatusColor = (status) => {
    const map = {
      Pending:   '#BA7517',
      Assigned:  '#534AB7',
      PickedUp:  '#1D9E75',
      InTransit: '#2980b9',
      Delivered: '#1D9E75',
    };
    return map[status] || '#888780';
  };

  return (
    <div style={styles.page}>

      {/* Geri butonu */}
      <Link to="/orders" style={styles.backBtn}>
        ← Siparişlere Dön
      </Link>

      {/* Başlık */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>📡 Sipariş Takibi</h2>
          <p style={styles.orderId}>
            #{orderId?.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <div style={styles.liveIndicator}>
          <span style={styles.liveDot}></span>
          Canlı takip
        </div>
      </div>

      {/* Sipariş bilgileri */}
      {order && (
        <div style={styles.infoCard}>
          <div style={styles.infoRow}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Açıklama</span>
              <span style={styles.infoVal}>{order.description}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Tarih</span>
              <span style={styles.infoVal}>
                {new Date(order.createdAt).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>📍 Alınacak</span>
              <span style={styles.infoVal}>{order.pickupAddress}</span>
            </div>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>🏁 Teslim</span>
              <span style={styles.infoVal}>{order.deliveryAddress}</span>
            </div>
          </div>
        </div>
      )}

      {/* Durum kartı */}
      {orderStatus && (
        <div style={{
          ...styles.statusCard,
          borderColor: getStatusColor(orderStatus),
          background:  getStatusColor(orderStatus) + '12'
        }}>
          <p style={styles.statusLabel}>Güncel Durum</p>
          <p style={{
            ...styles.statusValue,
            color: getStatusColor(orderStatus)
          }}>
            {steps.find(s => s.key === orderStatus)?.icon}{' '}
            {steps.find(s => s.key === orderStatus)?.label}
          </p>
        </div>
      )}

      {/* İlerleme adımları */}
      <div style={styles.stepsCard}>
        <p style={styles.stepsTitle}>Sipariş Durumu</p>
        <div style={styles.stepsWrapper}>
          {steps.map((step, index) => {
            const isDone    = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;

            const color = isDone    ? '#1D9E75' :
                          isCurrent ? getStatusColor(step.key) :
                                      '#D0CFF0';

            return (
              <div key={step.key} style={styles.stepItem}>
                {/* Daire */}
                <div style={{
                  ...styles.stepCircle,
                  background:  color,
                  transform:   isCurrent ? 'scale(1.15)' : 'scale(1)',
                  boxShadow:   isCurrent
                    ? `0 0 0 4px ${color}22` : 'none'
                }}>
                  {isDone ? '✓' : step.icon}
                </div>

                {/* Çizgi */}
                {index < steps.length - 1 && (
                  <div style={{
                    ...styles.stepLine,
                    background: isDone ? '#1D9E75' : '#EEEDFE'
                  }} />
                )}

                {/* Etiket */}
                <p style={{
                  ...styles.stepLabel,
                  color:      isCurrent ? color : isPending ? '#C0BEE0' : '#888780',
                  fontWeight: isCurrent ? '600' : '400'
                }}>
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kurye konumu */}
      {courierLocation && (
        <div style={styles.locationCard}>
          <p style={styles.locationTitle}>🗺️ Kurye Konumu</p>
          <div style={styles.locationGrid}>
            <div style={styles.locationItem}>
              <span style={styles.locationLabel}>Enlem</span>
              <span style={styles.locationVal}>
                {courierLocation.lat.toFixed(4)}
              </span>
            </div>
            <div style={styles.locationItem}>
              <span style={styles.locationLabel}>Boylam</span>
              <span style={styles.locationVal}>
                {courierLocation.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Teslim edildi mesajı */}
      {orderStatus === 'Delivered' && (
        <div style={styles.deliveredCard}>
          <p style={styles.deliveredIcon}>🎉</p>
          <p style={styles.deliveredTitle}>Siparişiniz Teslim Edildi!</p>
          <p style={styles.deliveredSub}>
            Teşekkür ederiz. İyi günler dileriz.
          </p>
        </div>
      )}

      {/* Bekleme mesajı */}
      {!orderStatus && (
        <div style={styles.waitingCard}>
          <p style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</p>
          <p style={styles.waitingText}>
            Sipariş bilgileri yükleniyor...
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '2rem 0', maxWidth: '700px', margin: '0 auto' },
  backBtn: {
    display: 'inline-block', color: '#534AB7',
    textDecoration: 'none', fontSize: '14px', marginBottom: '1.5rem'
  },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '1.5rem'
  },
  title: {
    fontSize: '22px', fontWeight: '500', color: '#26215C', margin: 0
  },
  orderId: { fontSize: '13px', color: '#888780', marginTop: '4px' },
  liveIndicator: {
    display: 'flex', alignItems: 'center', gap: '6px',
    color: '#1D9E75', fontSize: '13px', fontWeight: '500'
  },
  liveDot: {
    width: '8px', height: '8px', borderRadius: '50%',
    background: '#1D9E75', display: 'inline-block',
    animation: 'pulse 1.5s infinite'
  },
  infoCard: {
    background: '#fff', borderRadius: '12px',
    padding: '1.25rem', marginBottom: '1rem',
    border: '0.5px solid rgba(83,74,183,0.15)',
    boxShadow: '0 2px 8px rgba(83,74,183,0.06)'
  },
  infoRow: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: '1rem', marginBottom: '0.75rem'
  },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  infoLabel: { fontSize: '12px', color: '#888780' },
  infoVal: { fontSize: '14px', color: '#26215C', fontWeight: '500' },
  statusCard: {
    borderRadius: '12px', padding: '1.25rem',
    border: '1.5px solid', textAlign: 'center',
    marginBottom: '1rem'
  },
  statusLabel: { fontSize: '12px', color: '#888780', margin: 0 },
  statusValue: {
    fontSize: '22px', fontWeight: '600',
    margin: '6px 0 0'
  },
  stepsCard: {
    background: '#fff', borderRadius: '12px',
    padding: '1.5rem', marginBottom: '1rem',
    border: '0.5px solid rgba(83,74,183,0.15)',
    boxShadow: '0 2px 8px rgba(83,74,183,0.06)'
  },
  stepsTitle: {
    fontSize: '14px', fontWeight: '500',
    color: '#26215C', marginBottom: '1.5rem'
  },
  stepsWrapper: {
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', position: 'relative'
  },
  stepItem: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', position: 'relative',
    flex: 1
  },
  stepCircle: {
    width: '36px', height: '36px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: '14px', fontWeight: '600',
    transition: 'all 0.3s', zIndex: 1, marginBottom: '8px'
  },
  stepLine: {
    position: 'absolute', top: '18px', left: '50%',
    width: '100%', height: '2px', zIndex: 0,
    transition: 'background 0.3s'
  },
  stepLabel: {
    fontSize: '11px', textAlign: 'center',
    lineHeight: '1.3', maxWidth: '70px', transition: 'all 0.3s'
  },
  locationCard: {
    background: '#fff', borderRadius: '12px',
    padding: '1.25rem', marginBottom: '1rem',
    border: '0.5px solid rgba(83,74,183,0.15)'
  },
  locationTitle: {
    fontSize: '14px', fontWeight: '500',
    color: '#26215C', marginBottom: '12px'
  },
  locationGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  locationItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  locationLabel: { fontSize: '12px', color: '#888780' },
  locationVal: { fontSize: '14px', color: '#26215C', fontWeight: '500' },
  deliveredCard: {
    background: '#E1F5EE', borderRadius: '12px',
    padding: '2rem', textAlign: 'center',
    border: '0.5px solid #1D9E75'
  },
  deliveredIcon: { fontSize: '32px', marginBottom: '8px' },
  deliveredTitle: {
    fontSize: '16px', fontWeight: '600',
    color: '#1D9E75', marginBottom: '6px'
  },
  deliveredSub: { fontSize: '14px', color: '#888780' },
  waitingCard: {
    background: '#F5F4FF', borderRadius: '12px',
    padding: '2rem', textAlign: 'center'
  },
  waitingText: { fontSize: '14px', color: '#888780' }
};

export default TrackOrderPage;