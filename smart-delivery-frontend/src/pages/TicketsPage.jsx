import { useState, useEffect } from 'react';
import {
  createTicket,
  getCustomerTickets,
  replyToTicket
} from '../services/ticketService';
import { getUser } from '../utils/auth';

const TicketsPage = () => {
  const [tickets, setTickets]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [selected, setSelected]   = useState(null);
  const [message, setMessage]     = useState('');
  const [form, setForm]           = useState({
    subject: '', message: ''
  });

  const user = getUser();

  useEffect(() => {
    if (user?.customerId) fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await getCustomerTickets(user.customerId);
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTicket({
        subject:    form.subject,
        message:    form.message,
        customerId: user.customerId,
        orderId:    null
      });
      setForm({ subject: '', message: '' });
      setShowForm(false);
      setMessage('Destek talebiniz başarıyla gönderildi ✅');
      setTimeout(() => setMessage(''), 4000);
      fetchTickets();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (ticketId) => {
    if (!replyText.trim()) return;
    try {
      await replyToTicket(ticketId, {
        ticketId,
        message:    replyText,
        senderRole: 'Customer',
        senderName: user.fullName || user.email
      });
      setReplyText('');
      setSelected(null);
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusInfo = (status) => {
    const map = {
      Open:       { label: 'Açık',     color: '#E24B4A', bg: '#FAECE7', dot: '#E24B4A' },
      InProgress: { label: 'İşlemde',  color: '#BA7517', bg: '#FAEEDA', dot: '#BA7517' },
      Resolved:   { label: 'Çözüldü', color: '#1D9E75', bg: '#E1F5EE', dot: '#1D9E75' },
    };
    return map[status] || { label: status, color: '#888780', bg: '#f5f5f5' };
  };

  // Stats
  const stats = {
    total:    tickets.length,
    open:     tickets.filter(t => t.status === 'Open').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
  };

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🎫 Destek Talepleri</h2>
          <p style={styles.sub}>
            Sorunlarınızı bildirin, destek ekibimiz size yardımcı olsun.
          </p>
        </div>
        <button
          style={styles.newBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ İptal' : '+ Yeni Talep'}
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statItem}>
          <p style={styles.statNum}>{stats.total}</p>
          <p style={styles.statLabel}>Toplam</p>
        </div>
        <div style={{ ...styles.statItem, borderColor: '#E24B4A' }}>
          <p style={{ ...styles.statNum, color: '#E24B4A' }}>
            {stats.open}
          </p>
          <p style={styles.statLabel}>Açık</p>
        </div>
        <div style={{ ...styles.statItem, borderColor: '#1D9E75' }}>
          <p style={{ ...styles.statNum, color: '#1D9E75' }}>
            {stats.resolved}
          </p>
          <p style={styles.statLabel}>Çözüldü</p>
        </div>
      </div>

      {/* Başarı mesajı */}
      {message && (
        <div style={styles.successMsg}>{message}</div>
      )}

      {/* Yeni talep formu */}
      {showForm && (
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Yeni Destek Talebi</h3>
          <p style={styles.formDesc}>
            Sorununuzu detaylı açıklayın, en kısa sürede yanıt vereceğiz.
          </p>
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Konu</label>
            <input
              style={styles.input}
              placeholder="Örn: Siparişim teslim edilmedi"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })}
              required
            />
            <label style={styles.label}>Açıklama</label>
            <textarea
              style={styles.textarea}
              placeholder="Sorununuzu detaylı olarak açıklayın..."
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })}
              required
              rows={5}
            />
            <div style={styles.formActions}>
              <button
                style={{
                  ...styles.submitBtn,
                  opacity: submitting ? 0.7 : 1
                }}
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Gönderiliyor...' : '📤 Talebi Gönder'}
              </button>
              <button
                style={styles.cancelBtn}
                type="button"
                onClick={() => setShowForm(false)}
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ticket listesi */}
      {loading ? (
        <div style={styles.loadingCard}>
          <p style={{ color: '#888780' }}>Yükleniyor...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div style={styles.emptyCard}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>🎫</p>
          <p style={styles.emptyTitle}>Henüz destek talebiniz yok</p>
          <p style={styles.emptyDesc}>
            Bir sorunla karşılaştığınızda "Yeni Talep" butonunu kullanın.
          </p>
          <button
            style={{ ...styles.submitBtn, marginTop: '1rem' }}
            onClick={() => setShowForm(true)}
          >
            + İlk Talebimi Oluştur
          </button>
        </div>
      ) : (
        <div>
          <p style={styles.listLabel}>
            {tickets.length} destek talebi
          </p>
          {tickets.map(ticket => {
            const si = getStatusInfo(ticket.status);
            const isResolved = ticket.status === 'Resolved';

            return (
              <div key={ticket.id} style={{
                ...styles.ticketCard,
                borderLeft: `3px solid ${si.dot}`
              }}>

                {/* Ticket başlığı */}
                <div style={styles.ticketTop}>
                  <div style={styles.ticketTopLeft}>
                    <div style={styles.ticketTitleRow}>
                      <h3 style={styles.ticketSubject}>
                        {ticket.subject}
                      </h3>
                      <span style={{
                        ...styles.badge,
                        color: si.color, background: si.bg
                      }}>
                        {si.label}
                      </span>
                    </div>
                    <p style={styles.ticketDate}>
                      📅{' '}
                      {new Date(ticket.createdAt)
                        .toLocaleDateString('tr-TR', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                    </p>
                  </div>
                </div>

                {/* İlk mesaj */}
                <div style={styles.firstMsg}>
                  <p style={styles.firstMsgText}>{ticket.message}</p>
                </div>

                {/* Yanıtlar */}
                {ticket.replies?.length > 0 && (
                  <div style={styles.repliesBox}>
                    <p style={styles.repliesTitle}>
                      💬 {ticket.replies.length} yanıt
                    </p>
                    {ticket.replies.map(reply => {
                      const isAdmin = reply.senderRole === 'Admin';
                      return (
                        <div key={reply.id} style={{
                          ...styles.replyBubble,
                          background:  isAdmin ? '#EEEDFE' : '#F5F4FF',
                          borderLeft:  isAdmin
                            ? '2px solid #534AB7'
                            : '2px solid #D0CFF0',
                          marginLeft:  isAdmin ? '0' : '1rem'
                        }}>
                          <div style={styles.replyHeader}>
                            <span style={{
                              ...styles.replyName,
                              color: isAdmin ? '#534AB7' : '#26215C'
                            }}>
                              {isAdmin ? '🛡️ Destek Ekibi' : '👤 Siz'}
                            </span>
                            <span style={styles.replyTime}>
                              {new Date(reply.createdAt)
                                .toLocaleTimeString('tr-TR', {
                                  hour: '2-digit', minute: '2-digit'
                                })}
                              {' — '}
                              {new Date(reply.createdAt)
                                .toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                          <p style={styles.replyMsg}>{reply.message}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Yanıt formu */}
                {!isResolved ? (
                  <div style={styles.replyForm}>
                    <input
                      style={styles.replyInput}
                      placeholder="Yanıtınızı yazın..."
                      value={selected === ticket.id ? replyText : ''}
                      onFocus={() => setSelected(ticket.id)}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter')
                          handleReply(ticket.id);
                      }}
                    />
                    <button
                      style={styles.replyBtn}
                      onClick={() => handleReply(ticket.id)}
                    >
                      Gönder →
                    </button>
                  </div>
                ) : (
                  <div style={styles.resolvedMsg}>
                    ✅ Bu talep çözüldü olarak işaretlendi
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
  newBtn: {
    background: '#534AB7', color: '#fff', border: 'none',
    padding: '9px 18px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px', marginBottom: '1.5rem'
  },
  statItem: {
    background: '#fff', borderRadius: '12px',
    padding: '1rem', textAlign: 'center',
    border: '0.5px solid rgba(83,74,183,0.2)',
    borderTop: '3px solid #26215C'
  },
  statNum: {
    fontSize: '24px', fontWeight: '600',
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
  formCard: {
    background: '#fff', borderRadius: '12px',
    padding: '1.5rem', marginBottom: '1.5rem',
    border: '0.5px solid rgba(83,74,183,0.2)',
    boxShadow: '0 2px 12px rgba(83,74,183,0.08)'
  },
  formTitle: {
    fontSize: '16px', fontWeight: '500',
    color: '#26215C', marginBottom: '4px'
  },
  formDesc: {
    fontSize: '13px', color: '#888780', marginBottom: '1.25rem'
  },
  label: {
    display: 'block', fontSize: '13px',
    fontWeight: '500', color: '#26215C', marginBottom: '6px'
  },
  input: {
    width: '100%', padding: '9px 12px', marginBottom: '1rem',
    borderRadius: '8px', border: '0.5px solid rgba(83,74,183,0.3)',
    fontSize: '14px', boxSizing: 'border-box', color: '#26215C'
  },
  textarea: {
    width: '100%', padding: '9px 12px', marginBottom: '1rem',
    borderRadius: '8px', border: '0.5px solid rgba(83,74,183,0.3)',
    fontSize: '14px', boxSizing: 'border-box',
    resize: 'vertical', color: '#26215C', fontFamily: 'inherit'
  },
  formActions: { display: 'flex', gap: '8px' },
  submitBtn: {
    background: '#534AB7', color: '#fff', border: 'none',
    padding: '10px 20px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '500'
  },
  cancelBtn: {
    background: '#f5f5f5', color: '#555', border: 'none',
    padding: '10px 20px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px'
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
  ticketCard: {
    background: '#fff', borderRadius: '12px',
    padding: '1.25rem', marginBottom: '1rem',
    border: '0.5px solid rgba(83,74,183,0.15)',
    boxShadow: '0 2px 8px rgba(83,74,183,0.06)'
  },
  ticketTop: { marginBottom: '12px' },
  ticketTopLeft: {},
  ticketTitleRow: {
    display: 'flex', alignItems: 'center',
    gap: '10px', marginBottom: '6px', flexWrap: 'wrap'
  },
  ticketSubject: {
    fontSize: '15px', fontWeight: '500',
    color: '#26215C', margin: 0
  },
  badge: {
    fontSize: '12px', fontWeight: '500',
    padding: '3px 10px', borderRadius: '20px'
  },
  ticketDate: { fontSize: '12px', color: '#888780' },
  firstMsg: {
    background: '#F5F4FF', borderRadius: '8px',
    padding: '10px 14px', marginBottom: '1rem'
  },
  firstMsgText: {
    fontSize: '14px', color: '#444',
    lineHeight: '1.6', margin: 0
  },
  repliesBox: { marginBottom: '1rem' },
  repliesTitle: {
    fontSize: '13px', fontWeight: '500',
    color: '#888780', marginBottom: '8px'
  },
  replyBubble: {
    padding: '10px 14px', borderRadius: '8px',
    marginBottom: '8px'
  },
  replyHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '5px'
  },
  replyName: { fontSize: '13px', fontWeight: '500' },
  replyTime: { fontSize: '11px', color: '#888780' },
  replyMsg: {
    fontSize: '14px', color: '#444',
    margin: 0, lineHeight: '1.5'
  },
  replyForm: { display: 'flex', gap: '8px', marginTop: '4px' },
  replyInput: {
    flex: 1, padding: '9px 12px', borderRadius: '8px',
    border: '0.5px solid rgba(83,74,183,0.3)',
    fontSize: '14px', color: '#26215C'
  },
  replyBtn: {
    padding: '9px 18px', background: '#534AB7',
    color: '#fff', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px', fontWeight: '500'
  },
  resolvedMsg: {
    fontSize: '13px', color: '#1D9E75',
    background: '#E1F5EE', padding: '8px 12px',
    borderRadius: '8px', marginTop: '8px'
  }
};

export default TicketsPage;