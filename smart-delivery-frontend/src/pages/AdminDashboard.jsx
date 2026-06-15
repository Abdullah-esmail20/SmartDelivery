import { useState, useEffect } from 'react';
import { getAdminStats, getAllOrdersAdmin,
         getAllUsers, deleteUser } from '../services/adminService';
import { getAllTickets, replyToTicket,
         updateTicketStatus } from '../services/ticketService';
import { getUser } from '../utils/auth';

import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats]               = useState(null);
  const [orders, setOrders]             = useState([]);
  const [users, setUsers]               = useState([]);
  const [tickets, setTickets]           = useState([]);
  const [activeTab, setActiveTab]       = useState('overview');
  const [loading, setLoading]           = useState(true);
  const [adminReply, setAdminReply]     = useState('');
  const [selectedTicket, setSelected]   = useState(null);
  const [message, setMessage]           = useState('');

  const user = getUser();

  // ✅ Grafik verisi: Siparişleri durumlarına göre gruplar
  const getOrdersByStatus = () => {
    const statusCount = {};

    orders.forEach(o => {
      statusCount[o.status] = (statusCount[o.status] || 0) + 1;
    });

    const labels = {
      Pending:   'Beklemede',
      Assigned:  'Atandı',
      PickedUp:  'Alındı',
      InTransit: 'Yolda',
      Delivered: 'Teslim Edildi',
      Cancelled: 'İptal',
    };

    const colors = {
      Pending:   '#BA7517',
      Assigned:  '#534AB7',
      PickedUp:  '#1D9E75',
      InTransit: '#2980b9',
      Delivered: '#27ae60',
      Cancelled: '#E24B4A',
    };

    return Object.keys(statusCount).map(status => ({
      name:  labels[status] || status,
      value: statusCount[status],
      color: colors[status] || '#888780'
    }));
  };

  // ✅ Grafik verisi: Kullanıcıları rollerine göre gruplar
  const getUsersByRole = () => {
    const roleCount = { Customer: 0, Courier: 0, Admin: 0 };

    users.forEach(u => {
      roleCount[u.role] = (roleCount[u.role] || 0) + 1;
    });

    return [
      { name: 'Müşteri', value: roleCount.Customer, color: '#534AB7' },
      { name: 'Kurye',   value: roleCount.Courier,  color: '#1D9E75' },
      { name: 'Admin',   value: roleCount.Admin,    color: '#8e44ad' },
    ];
  };


  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [s, o, u, t] = await Promise.all([
        getAdminStats(),
        getAllOrdersAdmin(),
        getAllUsers(),
        getAllTickets()
      ]);
      setStats(s);
      setOrders(o);
      setUsers(u);
      setTickets(t);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?'))
      return;
    try {
      await deleteUser(userId);
      setMessage('Kullanıcı başarıyla silindi ✅');
      setTimeout(() => setMessage(''), 3000);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminReply = async (ticketId) => {
    if (!adminReply.trim()) return;
    try {
      await replyToTicket(ticketId, {
        ticketId,
        message:    adminReply,
        senderRole: 'Admin',
        senderName: 'Destek Ekibi'
      });
      setAdminReply('');
      setSelected(null);
      setMessage('Yanıt gönderildi ✅');
      setTimeout(() => setMessage(''), 3000);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTicketStatus = async (ticketId, newStatus) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusInfo = (status) => {
    const map = {
      Pending:   { label: 'Beklemede',     color: '#BA7517', bg: '#FAEEDA' },
      Assigned:  { label: 'Atandı',        color: '#534AB7', bg: '#EEEDFE' },
      PickedUp:  { label: 'Alındı',        color: '#1D9E75', bg: '#E1F5EE' },
      InTransit: { label: 'Yolda',         color: '#2980b9', bg: '#EAF2FF' },
      Delivered: { label: 'Teslim Edildi', color: '#1D9E75', bg: '#E1F5EE' },
      Cancelled: { label: 'İptal',         color: '#E24B4A', bg: '#FAECE7' },
    };
    return map[status] || { label: status, color: '#888780', bg: '#f5f5f5' };
  };

  const getTicketStatusInfo = (status) => {
    const map = {
      Open:       { label: 'Açık',         color: '#E24B4A', bg: '#FAECE7' },
      InProgress: { label: 'İşlemde',      color: '#BA7517', bg: '#FAEEDA' },
      Resolved:   { label: 'Çözüldü',      color: '#1D9E75', bg: '#E1F5EE' },
    };
    return map[status] || { label: status, color: '#888780', bg: '#f5f5f5' };
  };

  const getRoleInfo = (role) => {
    const map = {
      Admin:    { label: 'Admin',   icon: '🛡️', color: '#8e44ad', bg: '#F3E8FF' },
      Customer: { label: 'Müşteri', icon: '🛍️', color: '#534AB7', bg: '#EEEDFE' },
      Courier:  { label: 'Kurye',   icon: '🚴', color: '#1D9E75', bg: '#E1F5EE' },
    };
    return map[role] || { label: role, icon: '👤', color: '#888780', bg: '#f5f5f5' };
  };

  const tabs = [
    { key: 'overview', label: '📊 Genel Bakış' },
    { key: 'orders',   label: '📦 Siparişler'  },
    { key: 'users',    label: '👥 Kullanıcılar' },
    { key: 'tickets',  label: '🎫 Destek'       },
  ];

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <p style={styles.loadingText}>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🛡️ Admin Paneli</h2>
          <p style={styles.sub}>
            Hoş geldiniz, {user?.fullName || 'Admin'} 👋
          </p>
        </div>
        <button style={styles.refreshBtn} onClick={fetchAll}>
          🔄 Yenile
        </button>
      </div>

      {/* Mesaj */}
      {message && (
        <div style={styles.successMsg}>{message}</div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            style={{
              ...styles.tab,
              ...(activeTab === tab.key ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.key === 'tickets' && tickets.filter(
              t => t.status === 'Open').length > 0 && (
              <span style={styles.tabBadge}>
                {tickets.filter(t => t.status === 'Open').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && stats && (
        <div>
          <div style={styles.statsGrid}>
            {[
              { num: stats.totalOrders,     label: 'Toplam Sipariş',      color: '#26215C' },
              { num: stats.pendingOrders,   label: 'Bekleyen Sipariş',    color: '#BA7517' },
              { num: stats.deliveredOrders, label: 'Teslim Edilen',       color: '#1D9E75' },
              { num: stats.totalCustomers,  label: 'Toplam Müşteri',      color: '#534AB7' },
              { num: stats.totalCouriers,   label: 'Toplam Kurye',        color: '#2980b9' },
              { num: stats.activeCouriers,  label: 'Müsait Kurye',        color: '#1D9E75' },
            ].map((s, i) => (
              <div key={i} style={{
                ...styles.statCard,
                borderTopColor: s.color
              }}>
                <p style={{ ...styles.statNum, color: s.color }}>
                  {s.num}
                </p>
                <p style={styles.statLabel}>{s.label}</p>
              </div>
            ))}
          </div>



          {/* ✅ Grafikler: Sipariş durumları ve kullanıcı rolleri */}
          <div style={styles.chartsRow}>

            {/* Siparişlerin durumlara göre dağılımı */}
            <div style={styles.chartCard}>
              <p style={styles.chartTitle}>📊 Siparişler (Duruma Göre)</p>
              {orders.length === 0 ? (
                <p style={styles.chartEmpty}>Henüz veri yok</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={getOrdersByStatus()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      labelLine={false}
                    >
                      {getOrdersByStatus().map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Kullanıcıların role göre dağılımı */}
            <div style={styles.chartCard}>
              <p style={styles.chartTitle}>👥 Kullanıcılar (Role Göre)</p>
              {users.length === 0 ? (
                <p style={styles.chartEmpty}>Henüz veri yok</p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={getUsersByRole()}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: '#888780' }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: '#888780' }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {getUsersByRole().map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

          </div>

          {/* Son 5 sipariş */}
          <div style={styles.section}>
            <p style={styles.sectionTitle}>Son Siparişler</p>
            {orders.slice(0, 5).map(order => {
              const si = getStatusInfo(order.status);
              return (
                <div key={order.id} style={styles.miniCard}>
                  <div style={styles.miniLeft}>
                    <span style={styles.miniId}>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span style={styles.miniDesc}>
                      {order.description}
                    </span>
                  </div>
                  <span style={{
                    ...styles.badge,
                    color: si.color, background: si.bg
                  }}>
                    {si.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Açık ticketlar */}
          {tickets.filter(t => t.status === 'Open').length > 0 && (
            <div style={styles.section}>
              <p style={styles.sectionTitle}>
                ⚠️ Bekleyen Destek Talepleri
              </p>
              {tickets.filter(t => t.status === 'Open').map(t => (
                <div key={t.id} style={{
                  ...styles.miniCard,
                  borderLeft: '3px solid #E24B4A'
                }}>
                  <div style={styles.miniLeft}>
                    <span style={styles.miniId}>{t.subject}</span>
                    <span style={styles.miniDesc}>
                      {t.message.slice(0, 60)}...
                    </span>
                  </div>
                  <button
                    style={styles.replyQuickBtn}
                    onClick={() => {
                      setActiveTab('tickets');
                      setSelected(t.id);
                    }}
                  >
                    Yanıtla →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {activeTab === 'orders' && (
        <div>
          <p style={styles.listLabel}>
            {orders.length} sipariş bulundu
          </p>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Sipariş ID</th>
                  <th style={styles.th}>Açıklama</th>
                  <th style={styles.th}>Alınacak</th>
                  <th style={styles.th}>Teslim</th>
                  <th style={styles.th}>Kurye</th>

                  <th style={styles.th}>Durum</th>
                  <th style={styles.th}>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => {
                  const si = getStatusInfo(order.status);
                  return (
                    <tr key={order.id} style={{
                      ...styles.tr,
                      background: i % 2 === 0 ? '#fff' : '#FAFAFA'
                    }}>
                      <td style={styles.td}>
                        <span style={styles.tableId}>
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td style={styles.td}>{order.description}</td>
                      <td style={styles.td}>{order.pickupAddress}</td>
                        <td style={styles.td}>{order.deliveryAddress}</td>
{/* ✅ عمود الكورير */}
<td style={styles.td}>
  {order.courierName
    ? <span style={{ color: '#1D9E75', fontWeight: '500' }}>
        🚴 {order.courierName}
      </span>
    : <span style={{ color: '#BA7517' }}>Henüz atanmadı</span>}
</td>
<td style={styles.td}>
  <span style={{
    ...styles.badge,
    color: si.color, background: si.bg
  }}>
    {si.label}
  </span>
</td>
                      <td style={styles.td}>
                        {new Date(order.createdAt)
                          .toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── USERS TAB ── */}
      {activeTab === 'users' && (
        <div>
          <p style={styles.listLabel}>
            {users.length} kullanıcı bulundu
          </p>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Ad Soyad</th>
                  <th style={styles.th}>E-posta</th>
                  <th style={styles.th}>Rol</th>
                  <th style={styles.th}>Kayıt Tarihi</th>
                  <th style={styles.th}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => {
                  const ri = getRoleInfo(u.role);
                  return (
                    <tr key={u.id} style={{
                      ...styles.tr,
                      background: i % 2 === 0 ? '#fff' : '#FAFAFA'
                    }}>
                      <td style={styles.td}>
                        <div style={styles.userCell}>
                          <div style={{
                            ...styles.userAvatar,
                            background: ri.bg, color: ri.color
                          }}>
                            {ri.icon}
                          </div>
                          {u.fullName}
                        </div>
                      </td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          color: ri.color, background: ri.bg
                        }}>
                          {ri.label}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {new Date(u.createdAt)
                          .toLocaleDateString('tr-TR')}
                      </td>
                      <td style={styles.td}>
                        {u.role !== 'Admin' && (
                          <button
                            style={styles.deleteBtn}
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            🗑️ Sil
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TICKETS TAB ── */}
      {activeTab === 'tickets' && (
        <div>
          <p style={styles.listLabel}>
            {tickets.length} destek talebi •{' '}
            <span style={{ color: '#E24B4A' }}>
              {tickets.filter(t => t.status === 'Open').length} açık
            </span>
          </p>

          {tickets.length === 0 ? (
            <div style={styles.emptyCard}>
              <p style={{ fontSize: '40px' }}>🎫</p>
              <p style={styles.emptyTitle}>
                Henüz destek talebi yok
              </p>
            </div>
          ) : (
            tickets.map(ticket => {
              const ti = getTicketStatusInfo(ticket.status);
              return (
                <div key={ticket.id} style={{
                  ...styles.ticketCard,
                  borderLeft: ticket.status === 'Open'
                    ? '3px solid #E24B4A' : '3px solid #D0CFF0'
                }}>
                  {/* Ticket başlığı */}
                  <div style={styles.ticketTop}>
                    <div>
                      <p style={styles.ticketSubject}>
                        {ticket.subject}
                      </p>
                      <p style={styles.ticketMeta}>
                        {new Date(ticket.createdAt)
                          .toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div style={styles.ticketTopRight}>
                      <span style={{
                        ...styles.badge,
                        color: ti.color, background: ti.bg
                      }}>
                        {ti.label}
                      </span>
                      <select
                        style={styles.statusSelect}
                        value={ticket.status}
                        onChange={(e) =>
                          handleTicketStatus(ticket.id, e.target.value)}
                      >
                        <option value="Open">Açık</option>
                        <option value="InProgress">İşlemde</option>
                        <option value="Resolved">Çözüldü</option>
                      </select>
                    </div>
                  </div>

                  {/* Ticket mesajı */}
                  <p style={styles.ticketMsg}>{ticket.message}</p>

                  {/* Yanıtlar */}
                  {ticket.replies?.length > 0 && (
                    <div style={styles.repliesBox}>
                      {ticket.replies.map(reply => (
                        <div key={reply.id} style={{
                          ...styles.replyBubble,
                          background: reply.senderRole === 'Admin'
                            ? '#EEEDFE' : '#F5F4FF',
                          borderLeft: reply.senderRole === 'Admin'
                            ? '2px solid #534AB7' : '2px solid #D0CFF0'
                        }}>
                          <div style={styles.replyHeader}>
                            <span style={styles.replyName}>
                              {reply.senderRole === 'Admin'
                                ? '🛡️ Destek Ekibi'
                                : '👤 Müşteri'}
                            </span>
                            <span style={styles.replyDate}>
                              {new Date(reply.createdAt)
                                .toLocaleTimeString('tr-TR',
                                  { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p style={styles.replyMsg}>{reply.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Admin yanıt formu */}
                  {ticket.status !== 'Resolved' && (
                    <div style={styles.replyForm}>
                      <input
                        style={styles.replyInput}
                        placeholder="Yanıtınızı yazın..."
                        value={selectedTicket === ticket.id
                          ? adminReply : ''}
                        onFocus={() => setSelected(ticket.id)}
                        onChange={(e) => setAdminReply(e.target.value)}
                      />
                      <button
                        style={styles.replyBtn}
                        onClick={() => handleAdminReply(ticket.id)}
                      >
                        Gönder
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '2rem 0', maxWidth: '1100px', margin: '0 auto' },
  loadingPage: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh'
  },
  loadingText: { color: '#888780', fontSize: '14px' },
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
  successMsg: {
    background: '#E1F5EE', color: '#1D9E75',
    padding: '10px 16px', borderRadius: '8px',
    marginBottom: '1rem', fontSize: '14px',
    border: '0.5px solid #1D9E75'
  },
  tabs: {
    display: 'flex', gap: '8px',
    marginBottom: '1.5rem', flexWrap: 'wrap'
  },
  tab: {
    padding: '8px 18px', border: '0.5px solid rgba(83,74,183,0.3)',
    borderRadius: '8px', cursor: 'pointer',
    background: '#fff', color: '#534AB7',
    fontSize: '14px', fontWeight: '500',
    display: 'flex', alignItems: 'center', gap: '6px'
  },
  tabActive: { background: '#534AB7', color: '#fff', border: 'none' },
  tabBadge: {
    background: '#E24B4A', color: '#fff',
    fontSize: '11px', padding: '1px 6px',
    borderRadius: '10px', fontWeight: '600'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px', marginBottom: '1.5rem'
  },
  statCard: {
    background: '#fff', borderRadius: '12px',
    padding: '1.25rem', textAlign: 'center',
    border: '0.5px solid rgba(83,74,183,0.15)',
    borderTop: '3px solid #26215C',
    boxShadow: '0 2px 8px rgba(83,74,183,0.06)'
  },
  statNum: {
    fontSize: '28px', fontWeight: '600', margin: 0
  },
  statLabel: {
    fontSize: '13px', color: '#888780', marginTop: '6px'
  },

  chartsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  chartCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '0.5px solid rgba(83,74,183,0.15)',
    boxShadow: '0 2px 8px rgba(83,74,183,0.06)'
  },
  chartTitle: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#26215C',
    marginBottom: '1rem'
  },
  chartEmpty: {
    textAlign: 'center',
    color: '#888780',
    fontSize: '14px',
    padding: '3rem 0'
  },
  section: { marginBottom: '1.5rem' },
  sectionTitle: {
    fontSize: '15px', fontWeight: '500',
    color: '#26215C', marginBottom: '12px'
  },
  miniCard: {
    background: '#fff', borderRadius: '10px',
    padding: '12px 16px', marginBottom: '8px',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', gap: '12px',
    border: '0.5px solid rgba(83,74,183,0.1)'
  },
  miniLeft: { display: 'flex', flexDirection: 'column', gap: '3px' },
  miniId: { fontSize: '13px', fontWeight: '600', color: '#534AB7' },
  miniDesc: { fontSize: '13px', color: '#888780' },
  replyQuickBtn: {
    background: '#EEEDFE', color: '#534AB7',
    border: 'none', padding: '6px 12px',
    borderRadius: '6px', cursor: 'pointer',
    fontSize: '13px', whiteSpace: 'nowrap'
  },
  listLabel: {
    fontSize: '13px', color: '#888780', marginBottom: '1rem'
  },
  tableWrapper: {
    background: '#fff', borderRadius: '12px',
    overflow: 'hidden', border: '0.5px solid rgba(83,74,183,0.15)',
    boxShadow: '0 2px 8px rgba(83,74,183,0.06)'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#F5F4FF' },
  th: {
    padding: '12px 16px', textAlign: 'left',
    fontSize: '13px', fontWeight: '600',
    color: '#534AB7', borderBottom: '0.5px solid rgba(83,74,183,0.15)'
  },
  tr: { borderBottom: '0.5px solid rgba(83,74,183,0.08)' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#26215C' },
  tableId: { fontWeight: '600', color: '#534AB7' },
  badge: {
    fontSize: '12px', fontWeight: '500',
    padding: '4px 10px', borderRadius: '20px'
  },
  userCell: { display: 'flex', alignItems: 'center', gap: '8px' },
  userAvatar: {
    width: '28px', height: '28px', borderRadius: '50%',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '14px'
  },
  deleteBtn: {
    background: '#FAECE7', color: '#E24B4A',
    border: 'none', padding: '6px 12px',
    borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
  },
  emptyCard: {
    background: '#fff', borderRadius: '12px',
    padding: '3rem', textAlign: 'center'
  },
  emptyTitle: {
    fontSize: '16px', color: '#26215C', fontWeight: '500'
  },
  ticketCard: {
    background: '#fff', borderRadius: '12px',
    padding: '1.25rem', marginBottom: '1rem',
    border: '0.5px solid rgba(83,74,183,0.15)',
    boxShadow: '0 2px 8px rgba(83,74,183,0.06)'
  },
  ticketTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '10px'
  },
  ticketSubject: {
    fontSize: '15px', fontWeight: '500',
    color: '#26215C', margin: 0
  },
  ticketMeta: {
    fontSize: '12px', color: '#888780', marginTop: '3px'
  },
  ticketTopRight: { display: 'flex', gap: '8px', alignItems: 'center' },
  ticketMsg: {
    fontSize: '14px', color: '#555',
    lineHeight: '1.6', marginBottom: '1rem'
  },
  statusSelect: {
    padding: '4px 8px', borderRadius: '6px',
    border: '0.5px solid rgba(83,74,183,0.3)',
    fontSize: '13px', cursor: 'pointer', color: '#26215C'
  },
  repliesBox: {
    borderTop: '0.5px solid rgba(83,74,183,0.1)',
    paddingTop: '12px', marginBottom: '12px',
    display: 'flex', flexDirection: 'column', gap: '8px'
  },
  replyBubble: {
    padding: '10px 14px', borderRadius: '8px'
  },
  replyHeader: {
    display: 'flex', justifyContent: 'space-between',
    marginBottom: '4px'
  },
  replyName: {
    fontSize: '13px', fontWeight: '500', color: '#26215C'
  },
  replyDate: { fontSize: '12px', color: '#888780' },
  replyMsg: { fontSize: '14px', color: '#444', margin: 0 },
  replyForm: { display: 'flex', gap: '8px' },
  replyInput: {
    flex: 1, padding: '9px 12px', borderRadius: '8px',
    border: '0.5px solid rgba(83,74,183,0.3)',
    fontSize: '14px', color: '#26215C'
  },
  replyBtn: {
    padding: '9px 18px', background: '#534AB7',
    color: '#fff', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '500'
  }
};

export default AdminDashboard;