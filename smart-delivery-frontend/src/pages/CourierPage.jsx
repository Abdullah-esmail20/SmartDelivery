import { useState, useEffect } from 'react';
import { getCourierOrders, updateOrderStatus } from '../services/courierService';
import { getUser } from '../utils/auth';

const CourierPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [message, setMessage] = useState('');

  const user = getUser();
  const courierId = user?.courierId;

  useEffect(() => {
    if (courierId) fetchOrders();
  }, [courierId]);

  const fetchOrders = async () => {
    try {
      const data = await getCourierOrders(courierId);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setMessage(`Durum güncellendi: ${getStatusInfo(newStatus).label} ✅`);
      setTimeout(() => setMessage(''), 3000);
      fetchOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const getNextStatuses = (status) => {
    const flow = {
      Assigned:  [{ key: 'PickedUp',  label: '📦 Kargo Teslim Alındı' }],
      PickedUp:  [{ key: 'InTransit', label: '🚴 Yola Çıkıldı'        }],
      InTransit: [{ key: 'Delivered', label: '✅ Teslim Edildi'        }],
    };
    return flow[status] || [];
  };

  const getStatusInfo = (status) => {
    const map = {
      Pending:   { label: 'Beklemede',        color: '#BA7517', bg: '#FAEEDA' },
      Assigned:  { label: 'Atandı',           color: '#534AB7', bg: '#EEEDFE' },
      PickedUp:  { label: 'Teslim Alındı',    color: '#1D9E75', bg: '#E1F5EE' },
      InTransit: { label: 'Yolda',            color: '#2980b9', bg: '#EAF2FF' },
      Delivered: { label: 'Teslim Edildi',    color: '#1D9E75', bg: '#E1F5EE' },
      Cancelled: { label: 'İptal',            color: '#E24B4A', bg: '#FAECE7' },
    };
    return map[status] || { label: status, color: '#888780', bg: '#f5f5f5' };
  };

  // Stats
  const stats = {
    total:     orders.length,
    active:    orders.filter(o =>
      ['Assigned','PickedUp','InTransit'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
  };

  if (!courierId) {
    return (
      <div style={styles.page}>
        <div style={styles.errorCard}>
          <p style={{ fontSize: '32px' }}>⚠️</p>
          <h3 style={styles.errorTitle}>Erişim Reddedildi</h3>
          <p style={styles.errorDesc}>
            Bu sayfa yalnızca kuryeler için geçerlidir.
            Kurye hesabıyla giriş yapın.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Kurye Paneli 🚴</h2>
          <p style={styles.sub}>
            Merhaba, {user?.fullName || 'Kurye'} 👋
          </p>
        </div>
        <button style={styles.refreshBtn} onClick={fetchOrders}>
          🔄 Yenile
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statNum}>{stats.total}</p>
          <p style={styles.statLabel}>Toplam Sipariş</p>
        </div>
        <div style={{ ...styles.statCard, borderColor: '#534AB7' }}>
          <p style={{ ...styles.statNum, color: '#534AB7' }}>
            {stats.active}
          </p>
          <p style={styles.statLabel}>Aktif</p>
        </div>
        <div style={{ ...styles.statCard, borderColor: '#1D9E75' }}>
          <p style={{ ...styles.statNum, color: '#1D9E75' }}>
            {stats.delivered}
          </p>
          <p style={styles.statLabel}>Teslim Edildi</p>
        </div>
      </div>

      {/* Mesaj */}
      {message && (
        <div style={styles.successMsg}>{message}</div>
      )}

      {/* Sipariş listesi */}
      {loading ? (
        <div style={styles.loadingCard}>
          <p style={{ color: '#888780' }}>Yükleniyor...</p>
        </div>
      ) : orders.length === 0 ? (
        <div style={styles.emptyCard}>
          <p style={{ fontSize: '40px', marginBottom: '12px' }}>📭</p>
          <p style={styles.emptyTitle}>
            Atanmış sipariş bulunmuyor
          </p>
          <p style={styles.emptyDesc}>
            Yeni siparişler otomatik olarak atanacaktır.
          </p>
        </div>
      ) : (
        <>
          <p style={styles.listLabel}>
            {orders.length} sipariş bulundu
          </p>
          {orders.map(order => {
            const statusInfo  = getStatusInfo(order.status);
            const nextSteps   = getNextStatuses(order.status);
            const isUpdating  = updating === order.id;

            return (
              <div key={order.id} style={styles.orderCard}>

                {/* Kart başlığı */}
                <div style={styles.cardTop}>
                  <div>
                    <span style={styles.orderId}>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span style={styles.orderDate}>
                      {new Date(order.createdAt)
                        .toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <span style={{
                    ...styles.badge,
                    color:      statusInfo.color,
                    background: statusInfo.bg
                  }}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Açıklama */}
                <p style={styles.orderDesc}>{order.description}</p>

                {/* Adresler */}
                <div style={styles.addressBox}>
                  <div style={styles.addressRow}>
                    <span style={styles.addressDot} />
                    <div>
                      <p style={styles.addressLabel}>Alınacak Adres</p>
                      <p style={styles.addressVal}>
                        {order.pickupAddress}
                      </p>
                    </div>
                  </div>
                  <div style={styles.addressLine} />
                  <div style={styles.addressRow}>
                    <span style={{
                      ...styles.addressDot,
                      background: '#1D9E75'
                    }} />
                    <div>
                      <p style={styles.addressLabel}>Teslim Adresi</p>
                      <p style={styles.addressVal}>
                        {order.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Aksiyon butonları */}
                <div style={styles.actions}>
                  {nextSteps.map(step => (
                    <button
                      key={step.key}
                      style={{
                        ...styles.actionBtn,
                        opacity: isUpdating ? 0.7 : 1
                      }}
                      disabled={isUpdating}
                      onClick={() =>
                        handleStatusUpdate(order.id, step.key)}
                    >
                      {isUpdating ? 'Güncelleniyor...' : step.label}
                    </button>
                  ))}

                  {order.status === 'Delivered' && (
                    <div style={styles.deliveredBadge}>
                      🎉 Teslim Edildi
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '2rem 0', maxWidth: '800px', margin: '0 auto' },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '1.5rem'
  },
  title: {
    fontSize: '22px', fontWeight: '500', color: '#26215C', margin: 0
  },
  sub: { fontSize: '14px', color: '#888780', marginTop: '4px' },
  refreshBtn: {
    background: '#F5F4FF', color: '#534AB7',
    border: '0.5px solid #534AB7', padding: '8px 16px',
    borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
  },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
    gap: '12px', marginBottom: '1.5rem'
  },
  statCard: {
    background: '#fff', borderRadius: '12px',
    padding: '1.25rem', textAlign: 'center',
    border: '0.5px solid rgba(83,74,183,0.2)',
    borderTop: '3px solid #26215C'
  },
  statNum: {
    fontSize: '28px', fontWeight: '600',
    color: '#26215C', margin: 0
  },
  statLabel: {
    fontSize: '13px', color: '#888780', marginTop: '4px'
  },
  successMsg: {
    background: '#E1F5EE', color: '#1D9E75',
    padding: '10px 16px', borderRadius: '8px',
    marginBottom: '1rem', fontSize: '14px',
    border: '0.5px solid #1D9E75'
  },
  loadingCard: {
    background: '#fff', borderRadius: '12px',
    padding: '3rem', textAlign: 'center'
  },
  emptyCard: {
    background: '#fff', borderRadius: '12px',
    padding: '3rem', textAlign: 'center',
    border: '0.5px solid rgba(83,74,183,0.1)'
  },
  emptyTitle: {
    fontSize: '16px', fontWeight: '500',
    color: '#26215C', marginBottom: '8px'
  },
  emptyDesc: { fontSize: '14px', color: '#888780' },
  listLabel: {
    fontSize: '13px', color: '#888780', marginBottom: '1rem'
  },
  orderCard: {
    background: '#fff', borderRadius: '12px',
    padding: '1.25rem', marginBottom: '1rem',
    border: '0.5px solid rgba(83,74,183,0.15)',
    boxShadow: '0 2px 8px rgba(83,74,183,0.06)'
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '0.75rem'
  },
  orderId: {
    fontSize: '13px', fontWeight: '600',
    color: '#534AB7', marginRight: '8px'
  },
  orderDate: { fontSize: '12px', color: '#888780' },
  badge: {
    fontSize: '12px', fontWeight: '500',
    padding: '4px 10px', borderRadius: '20px'
  },
  orderDesc: {
    fontSize: '14px', fontWeight: '500',
    color: '#26215C', marginBottom: '1rem'
  },
  addressBox: {
    background: '#F5F4FF', borderRadius: '10px',
    padding: '1rem', marginBottom: '1rem'
  },
  addressRow: {
    display: 'flex', alignItems: 'flex-start', gap: '10px'
  },
  addressDot: {
    width: '10px', height: '10px', borderRadius: '50%',
    background: '#534AB7', marginTop: '4px', flexShrink: 0
  },
  addressLine: {
    width: '2px', height: '20px', background: '#D0CFF0',
    marginLeft: '4px', margin: '4px 0 4px 4px'
  },
  addressLabel: {
    fontSize: '11px', color: '#888780', margin: 0
  },
  addressVal: {
    fontSize: '14px', color: '#26215C',
    fontWeight: '500', margin: '2px 0 0'
  },
  actions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  actionBtn: {
    padding: '9px 18px', background: '#534AB7',
    color: '#fff', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '500'
  },
  deliveredBadge: {
    padding: '8px 16px', background: '#E1F5EE',
    color: '#1D9E75', borderRadius: '8px',
    fontSize: '14px', fontWeight: '500'
  },
  errorCard: {
    background: '#FAECE7', borderRadius: '12px',
    padding: '3rem', textAlign: 'center',
    border: '0.5px solid #E24B4A', maxWidth: '400px', margin: '0 auto'
  },
  errorTitle: {
    fontSize: '18px', color: '#E24B4A', marginBottom: '8px'
  },
  errorDesc: { fontSize: '14px', color: '#888780' }
};

export default CourierPage;