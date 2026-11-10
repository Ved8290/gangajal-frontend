import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useAsync from '../../hooks/useAsync';
import { order as getOrder, setStatus, updateOrder, deleteOrder } from '../../services/adminService';
import { Msg, StatusBadge } from '../../components/common/AdminBits';
import { ORDER_STATUSES, money, dateTime } from '../../utils/format';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { buildStatusMessage, waLink } from '../../utils/whatsapp';

const QUICK = ['Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
export default function OrderView() {
  const { id } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const { data, loading, error, reload } = useAsync(() => getOrder(id), [id]);
  const [o, setO] = useState(null);
  const [note, setNote] = useState('');
  const [tracking, setTracking] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  useEffect(() => { if (data) { setO(data.order); setTracking(data.order.trackingNumber || ''); setAdminNotes(data.order.adminNotes || ''); } }, [data]);
  if (!o) return <Msg loading={loading} error={error} onRetry={reload} />;
  const c = o.customer;
  const wrap = (p, ok) => p.then((r) => { setO(r.order); toast(ok); }).catch((e) => toast(e.userMessage, 'error'));
  const changeStatus = (status) => {
    if (status === 'Cancelled' && !window.confirm('Cancel this order? Stock will be restored if it was deducted.')) return;
    wrap(setStatus(o.orderId, { status, note, trackingNumber: tracking }), `Status: ${status}`).then(() => setNote(''));
  };
  const msg = buildStatusMessage(o);
  const closed = o.orderStatus === 'Cancelled';
  return (
    <>
      <div className="page-head"><h1>{o.orderId} <StatusBadge status={o.orderStatus} /></h1>
        <div className="btn-row no-print">
          {[['label', 'Shipping Label'], ['invoice', 'Invoice'], ['slip', 'Packing Slip']].map(([d, l]) => <Link key={d} className="btn btn-outline btn-sm" to={`/admin/pos?order=${o.orderId}&doc=${d}`}>🖨 {l}</Link>)}
        </div></div>
      <div className="two-col">
        <div className="card pad">
          <h2>Customer</h2>
          <p><strong>{c.fullName}</strong><br />Mobile: {c.mobile} | WhatsApp: {c.whatsapp}<br />{c.address}<br />{c.city}, {c.district}, {c.state} - {c.pincode}{c.landmark && <><br />Landmark: {c.landmark}</>}</p>
          {c.notes && <p><strong>Customer note:</strong> {c.notes}</p>}
          <p className="muted">Preferred language: {c.preferredLanguage} | Placed: {dateTime(o.createdAt)}</p>
          <p>WhatsApp confirmed: <strong>{o.whatsappConfirmed ? 'Yes' : 'No'}</strong>
            <button className="link-btn" onClick={() => wrap(updateOrder(o.orderId, { whatsappConfirmed: !o.whatsappConfirmed }), 'Updated')}> toggle</button></p>
          <h2>Items</h2>
          <table className="table"><tbody>{o.items.map((i, n) => <tr key={n}><td>{i.name.en} {i.size && `(${i.size})`}</td><td>{i.quantity} × {money(i.price)}</td><td>{money(i.price * i.quantity)}</td></tr>)}</tbody></table>
          <p>Subtotal {money(o.subtotal)} | Delivery {money(o.shippingCharges)} | Discount {money(o.discount)}<br /><strong>Total {money(o.totalAmount)}</strong></p>
          <p className="muted">Stock deducted: {o.stockDeducted ? 'Yes' : 'No'}</p>
        </div>
        <div className="card pad">
          <h2>Update order</h2>
          <label className="field"><span>Status</span>
            <select value={o.orderStatus} disabled={closed} onChange={(e) => changeStatus(e.target.value)}>{ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
          <div className="btn-row">{QUICK.filter((s) => s !== o.orderStatus).map((s) => <button key={s} className={`btn btn-sm ${s === 'Cancelled' ? 'btn-danger' : 'btn-outline'}`} disabled={closed} onClick={() => changeStatus(s)}>{s}</button>)}</div>
          <label className="field"><span>Status note (saved in history)</span><input value={note} onChange={(e) => setNote(e.target.value)} maxLength={300} /></label>
          <label className="field"><span>Tracking number</span><input value={tracking} onChange={(e) => setTracking(e.target.value)} maxLength={80} /></label>
          <div className="form-grid">
            <label className="field"><span>Payment method</span><select value={o.paymentMethod} onChange={(e) => wrap(updateOrder(o.orderId, { paymentMethod: e.target.value }), 'Saved')}>{[ 'UPI on Delivery', 'Bank Transfer', 'Manual Payment'].map((m) => <option key={m}>{m}</option>)}</select></label>
            <label className="field"><span>Payment status</span><select value={o.paymentStatus} onChange={(e) => wrap(updateOrder(o.orderId, { paymentStatus: e.target.value }), 'Saved')}>{['Pending', 'Paid', 'Failed', 'Refunded'].map((m) => <option key={m}>{m}</option>)}</select></label>
          </div>
          <label className="field"><span>Internal notes (never shown to customer)</span><textarea rows="3" value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} /></label>
          <button className="btn btn-primary btn-sm" onClick={() => wrap(updateOrder(o.orderId, { adminNotes, trackingNumber: tracking }), 'Saved')}>Save notes & tracking</button>
          {msg && c.whatsapp && <p><a className="btn btn-wa btn-sm" target="_blank" rel="noopener noreferrer" href={waLink(c.whatsapp, msg)}>Send "{o.orderStatus}" update on WhatsApp</a></p>}
          {user.role === 'admin' && <p><button className="btn btn-danger btn-sm" onClick={async () => { if (window.confirm('Permanently delete this order?')) { await deleteOrder(o.orderId); nav('/admin/orders'); } }}>Delete order</button></p>}
        </div>
      </div>
      <div className="card pad"><h2>Status history</h2>
        <ol className="timeline">{o.statusHistory.map((h, i) => <li key={i}><strong>{h.status}</strong><span>{dateTime(h.at)} · {h.by}{h.note && ` · ${h.note}`}</span></li>)}</ol></div>
    </>
  );
}
