import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import useLocalized from '../hooks/useLocalized';
import { trackOrder } from '../services/shopService';
import { STATUS_KEY, PAY_KEY, dateTime, money } from '../utils/format';

export default function TrackOrder() {
  const { t } = useTranslation();
  const l = useLocalized();
  const [orderId, setOrderId] = useState('');
  const [mobile, setMobile] = useState('');
  const [order, setOrder] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr(''); setOrder(null);
    try { setOrder((await trackOrder({ orderId: orderId.trim(), mobile: mobile.trim() })).order); }
    catch (x) { setErr(x.response?.status === 404 ? t('track.notFound') : x.userMessage || t('common.error')); }
    setBusy(false);
  };
  return (
    <div className="container section narrow">
      <SEO title={`${t('track.title')} – ${t('brand')}`} path="/track-order" />
      <h1>{t('track.title')}</h1>
      <form className="card pad form-grid" onSubmit={submit}>
        <label className="field full"><span>{t('track.orderId')}</span><input value={orderId} onChange={(e) => setOrderId(e.target.value)} required /></label>
        <label className="field full"><span>{t('track.mobile')}</span><input value={mobile} onChange={(e) => setMobile(e.target.value)} inputMode="numeric" maxLength={10} required /></label>
        <button className="btn btn-primary full" disabled={busy}>{busy ? t('common.loading') : t('track.check')}</button>
      </form>
      {err && <p className="error-text">{err}</p>}
      {order && (
        <div className="card pad track">
          <h2>{order.orderId}</h2>
          <p><span className={`status s-${STATUS_KEY[order.orderStatus]}`}>{t(`status.${STATUS_KEY[order.orderStatus]}`)}</span></p>
          {order.trackingNumber && <p><strong>{t('track.tracking')}:</strong> {order.trackingNumber}</p>}
          <p><strong>{t('track.paymentStatus')}:</strong> {t(`payment.${PAY_KEY[order.paymentMethod]}`)} – {t(`payment.${order.paymentStatus}`)}</p>
          <ul>{order.items.map((i, n) => <li key={n}>{l(i.name)} × {i.quantity} – {money(i.price * i.quantity)}</li>)}</ul>
          <p><strong>{t('common.total')}: {money(order.totalAmount)}</strong></p>
          <h3>{t('track.history')}</h3>
          <ol className="timeline">{order.statusHistory.map((h, i) => <li key={i}><strong>{t(`status.${STATUS_KEY[h.status]}`)}</strong><span>{dateTime(h.at)}</span></li>)}</ol>
        </div>
      )}
    </div>
  );
}
