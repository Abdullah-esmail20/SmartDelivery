import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerOrders, createOrder, updateOrder } from '../services/orderService';import { getUser } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';

const OrdersPage = () => {
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const user = getUser();
  const [form, setForm] = useState({
    description: '', pickupAddress: '', deliveryAddress: '',
    customerId: user?.customerId || ''
  });

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
  try {
    // ✅ نجلب طلبات هذا العميل فقط
    if (!user?.customerId) {
      setOrders([]);
      return;
    }
    const data = await getCustomerOrders(user.customerId);
    setOrders(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
   const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user?.customerId) {
    setMessage('Sipariş oluşturmak için müşteri hesabıyla giriş yapın.');
    return;
  }
  setSubmitting(true);
  try {
    const newOrder = await createOrder(form);

    setForm({ ...form, description: '', pickupAddress: '', deliveryAddress: '' });
    setShowForm(false);

    // ✅ إذا لا يوجد كورير متاح — نعرض رسالة الانتظار
    if (newOrder.infoMessage) {
      setMessage('⏳ ' + newOrder.infoMessage);
    } else {
      setMessage('Sipariş başarıyla oluşturuldu! ✅');
    }
    setTimeout(() => setMessage(''), 5000);

    await fetchOrders();
  } catch (err) {
    console.error('Sipariş hatası:', err);
    setMessage('Sipariş oluşturulamadı. Tekrar deneyin.');
  } finally {
    setSubmitting(false);
  }
};

  const handleEditSave = async (orderId) => {
    try {
      await updateOrder(orderId, editForm);
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusInfo = (status) => {
    const map = {
      Pending:   { label: 'Beklemede',     icon: '⏳', color: '#BA7517', bg: '#FAEEDA' },
      Assigned:  { label: 'Atandı',        icon: '👤', color: '#534AB7', bg: '#EEEDFE' },
      PickedUp:  { label: 'Teslim Alındı', icon: '📦', color: '#1D9E75', bg: '#E1F5EE' },
      InTransit: { label: 'Yolda',         icon: '🚚', color: '#2980b9', bg: '#EAF2FF' },
      Delivered: { label: 'Teslim Edildi', icon: '✅', color: '#1D9E75', bg: '#E1F5EE' },
      Cancelled: { label: 'İptal',         icon: '❌', color: '#E24B4A', bg: '#FAECE7' },
    };
    return map[status] || { label: status, icon: '•', color: theme.textMuted, bg: theme.border };
  };

  // ✅ إحصائيات
  const stats = [
    { icon: '📦', label: 'Toplam Sipariş', count: orders.length, color: '#534AB7' },
    { icon: '⏳', label: 'Beklemede',
      count: orders.filter(o => o.status === 'Pending').length, color: '#BA7517' },
    { icon: '🚚', label: 'Yolda',
      count: orders.filter(o => ['Assigned','PickedUp','InTransit'].includes(o.status)).length,
      color: '#2980b9' },
    { icon: '✅', label: 'Teslim Edildi',
      count: orders.filter(o => o.status === 'Delivered').length, color: '#1D9E75' },
    { icon: '❌', label: 'İptal',
      count: orders.filter(o => o.status === 'Cancelled').length, color: '#E24B4A' },
  ];

  const s = makeStyles(theme);

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Siparişlerim</h2>
          <p style={s.sub}>Merhaba, {user?.fullName || 'Müşteri'} 👋</p>
        </div>
        <button style={s.newBtn} className="hover-lift"
                onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ İptal' : '+ Yeni Sipariş'}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={s.statsGrid}>
        {stats.map(st => (
          <div key={st.label} className="stat-card" style={{
            ...s.statCard, borderTop: `3px solid ${st.color}`
          }}>
            <span style={s.statIcon}>{st.icon}</span>
            <span style={{ ...s.statCount, color: st.color }}>{st.count}</span>
            <span style={s.statLabel}>{st.label}</span>
          </div>
        ))}
      </div>

      {/* Message */}
      {message && <div style={s.successMsg}>{message}</div>}

      {/* New order form */}
      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>Yeni Sipariş Oluştur</h3>
          <form onSubmit={handleSubmit}>
            <label style={s.label}>Açıklama</label>
            <input style={s.input} className="ipt" placeholder="Ürün açıklaması..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required />
            <div style={s.row}>
              <div style={{ flex: 1 }}>
                <label style={s.label}>Alınacak Adres</label>
                <input style={s.input} className="ipt" placeholder="İstanbul - Taksim"
                  value={form.pickupAddress}
                  onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                  required />
              </div>
              <div style={{ flex: 1 }}>
                <label style={s.label}>Teslim Adresi</label>
                <input style={s.input} className="ipt" placeholder="İstanbul - Beşiktaş"
                  value={form.deliveryAddress}
                  onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                  required />
              </div>
            </div>
            <button style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1 }}
                    className="hover-lift" type="submit" disabled={submitting}>
              {submitting ? 'Oluşturuluyor...' : 'Sipariş Oluştur →'}
            </button>
          </form>
        </div>
      )}

      {/* Orders list */}
      {loading ? (
        <div style={s.loadingBox}><p style={s.muted}>Yükleniyor...</p></div>
      ) : orders.length === 0 ? (
        <div style={s.emptyBox}>
          <p style={s.emptyIcon}>📦</p>
          <p style={s.emptyTitle}>Henüz sipariş bulunmuyor</p>
          <p style={s.emptyDesc}>Yeni siparişleriniz burada görünecek.</p>
          <button style={{ ...s.submitBtn, marginTop: '1.25rem' }}
                  className="hover-lift" onClick={() => setShowForm(true)}>
            Yeni Sipariş Oluştur
          </button>
        </div>
      ) : (
        <div>
          <p style={s.listLabel}>{orders.length} sipariş bulundu</p>
          {orders.map(order => {
            const si = getStatusInfo(order.status);
            const isEditing = editingOrder === order.id;
            const canEdit = order.status === 'Pending' || order.status === 'Assigned';

            return (
              <div key={order.id} className="order-card" style={s.orderCard}>
                {isEditing ? (
                  <div>
                    <p style={s.editTitle}>✏️ Siparişi Düzenle</p>
                    <input style={s.input} className="ipt" value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
                    <div style={s.row}>
                      <input style={s.input} className="ipt" value={editForm.pickupAddress}
                        onChange={(e) => setEditForm({ ...editForm, pickupAddress: e.target.value })} />
                      <input style={s.input} className="ipt" value={editForm.deliveryAddress}
                        onChange={(e) => setEditForm({ ...editForm, deliveryAddress: e.target.value })} />
                    </div>
                    <div style={s.editBtns}>
                      <button style={s.saveBtn} onClick={() => handleEditSave(order.id)}>
                        💾 Kaydet
                      </button>
                      <button style={s.cancelBtn} onClick={() => setEditingOrder(null)}>
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={s.cardTop}>
                      <div>
                        <span style={s.orderId}>#{order.id.slice(0, 8).toUpperCase()}</span>
                        <span style={s.orderDate}>
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <span style={{ ...s.badge, color: si.color, background: si.bg }}>
                        {si.icon} {si.label}
                      </span>
                    </div>

                    <p style={s.orderDesc}>{order.description}</p>

                    <div style={s.addressBox}>
                      <div style={s.addressItem}>
                        <span>📍</span>
                        <div>
                          <p style={s.addressLabel}>Alınacak</p>
                          <p style={s.addressVal}>{order.pickupAddress}</p>
                        </div>
                      </div>
                      <span style={s.arrow}>➡️</span>
                      <div style={s.addressItem}>
                        <span>🏁</span>
                        <div>
                          <p style={s.addressLabel}>Teslim</p>
                          <p style={s.addressVal}>{order.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div style={s.cardActions}>
                      <Link to={`/track/${order.id}`} style={s.trackBtn} className="hover-lift">
                        📍 Takip Et
                      </Link>
                      {canEdit && (
                        <button style={s.editBtn} className="hover-lift"
                          onClick={() => {
                            setEditingOrder(order.id);
                            setEditForm({
                              description: order.description,
                              pickupAddress: order.pickupAddress,
                              deliveryAddress: order.deliveryAddress
                            });
                          }}>
                          ✏️ Düzenle
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(83,74,183,0.12);
        }
        .order-card { transition: all 0.3s ease; }
        .order-card:hover { transform: translateY(-2px); }
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(83,74,183,0.15);
        }
        .ipt { transition: all 0.3s ease; }
        .ipt:focus {
          border-color: #534AB7 !important;
          box-shadow: 0 0 0 3px rgba(83,74,183,0.1);
        }
      `}</style>
    </div>
  );
};

// ✅ styles كدالة تأخذ theme
const makeStyles = (t) => ({
  page: { padding: '2rem 1.5rem', maxWidth: '800px', margin: '0 auto' },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '1.5rem'
  },
  title: { fontSize: '22px', fontWeight: '600', color: t.text, margin: 0 },
  sub: { fontSize: '14px', color: t.textMuted, marginTop: '4px' },
  muted: { color: t.textMuted },
  newBtn: {
    background: t.primary, color: '#fff', border: 'none',
    padding: '9px 18px', borderRadius: '10px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '500'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '12px', marginBottom: '1.5rem'
  },
  statCard: {
    background: t.card, borderRadius: '12px', padding: '1.25rem 1rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '4px', border: `0.5px solid ${t.border}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  statIcon: { fontSize: '22px' },
  statCount: { fontSize: '26px', fontWeight: '700' },
  statLabel: { fontSize: '12px', color: t.textMuted, textAlign: 'center' },
  successMsg: {
    background: '#E1F5EE', color: '#1D9E75', padding: '10px 16px',
    borderRadius: '10px', marginBottom: '1rem', fontSize: '14px',
    border: '0.5px solid #1D9E75'
  },
  formCard: {
    background: t.card, borderRadius: '12px', padding: '1.5rem',
    marginBottom: '1.5rem', border: `0.5px solid ${t.border}`,
    boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
  },
  formTitle: { fontSize: '16px', fontWeight: '600', color: t.text, marginBottom: '1.25rem' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: t.text, marginBottom: '6px' },
  input: {
    width: '100%', padding: '10px 12px', marginBottom: '1rem',
    borderRadius: '10px', border: `1px solid ${t.border}`,
    fontSize: '14px', boxSizing: 'border-box',
    background: t.inputBg, color: t.text, outline: 'none'
  },
  row: { display: 'flex', gap: '12px' },
  submitBtn: {
    background: t.primary, color: '#fff', border: 'none',
    padding: '11px 24px', borderRadius: '10px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600'
  },
  loadingBox: { textAlign: 'center', padding: '3rem' },
  emptyBox: {
    background: t.card, borderRadius: '16px', padding: '3.5rem 2rem',
    textAlign: 'center', border: `0.5px solid ${t.border}`
  },
  emptyIcon: { fontSize: '48px', marginBottom: '12px' },
  emptyTitle: { fontSize: '17px', fontWeight: '600', color: t.text, marginBottom: '8px' },
  emptyDesc: { fontSize: '14px', color: t.textMuted },
  listLabel: { fontSize: '13px', color: t.textMuted, marginBottom: '1rem' },
  orderCard: {
    background: t.card, borderRadius: '14px', padding: '1.25rem',
    marginBottom: '1rem', border: `0.5px solid ${t.border}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  cardTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '0.75rem'
  },
  orderId: { fontSize: '13px', fontWeight: '600', color: t.primary, marginRight: '8px' },
  orderDate: { fontSize: '12px', color: t.textMuted },
  badge: { fontSize: '12px', fontWeight: '500', padding: '4px 12px', borderRadius: '20px' },
  orderDesc: { fontSize: '15px', color: t.text, fontWeight: '500', marginBottom: '1rem' },
  addressBox: {
    display: 'flex', alignItems: 'center', gap: '12px',
    background: t.bg, borderRadius: '10px', padding: '12px',
    marginBottom: '1rem', flexWrap: 'wrap'
  },
  addressItem: { display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '120px' },
  addressLabel: { fontSize: '11px', color: t.textMuted, margin: 0 },
  addressVal: { fontSize: '13px', color: t.text, margin: '2px 0 0', fontWeight: '500' },
  arrow: { fontSize: '14px' },
  cardActions: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  trackBtn: {
    padding: '8px 16px', background: t.primary, color: '#fff',
    borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: '500'
  },
  editBtn: {
    padding: '8px 16px', background: '#FAEEDA', color: '#BA7517',
    border: 'none', borderRadius: '10px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '500'
  },
  editTitle: { fontSize: '15px', fontWeight: '600', color: t.text, marginBottom: '1rem' },
  editBtns: { display: 'flex', gap: '8px', marginTop: '4px' },
  saveBtn: {
    padding: '8px 18px', background: '#1D9E75', color: '#fff',
    border: 'none', borderRadius: '10px', cursor: 'pointer'
  },
  cancelBtn: {
    padding: '8px 18px', background: t.border, color: t.text,
    border: 'none', borderRadius: '10px', cursor: 'pointer'
  }
});

export default OrdersPage;