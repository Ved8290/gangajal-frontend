import { QRCodeSVG } from 'qrcode.react';
import { dateTime, money } from '../../utils/format';

const addrLines = (c) => [c.address, c.landmark && `Landmark: ${c.landmark}`];
const codAmount = (o) => (o.paymentMethod === 'Cash on Delivery' && o.paymentStatus !== 'Paid' ? o.totalAmount : null);
const Head = ({ s, o, title }) => (
  <div className="p-head">
    {s.pos?.showLogo && s.logo && <img src={s.logo} alt="" className="p-logo" />}
    <div className="p-biz">{s.businessName}</div>
    {title && <div className="p-title">{title}</div>}
  </div>
);

export function ShippingLabel({ order: o, settings: s }) {
  const c = o.customer;
  const cod = codAmount(o);
  return (
    <div className="doc label">
      <Head s={s} />
      <div className="p-id">ORDER ID: {o.orderId}</div>
      <hr />
      <div className="p-sec">SHIP TO:</div>
      <div><strong>{c.fullName}</strong></div>
      <div>Mobile: {c.mobile}</div>
      <div className="p-addr">{addrLines(c).filter(Boolean).map((l, i) => <div key={i}>{l}</div>)}</div>
      <div>City: {c.city}</div><div>District: {c.district}</div><div>State: {c.state}</div>
      <div className="p-pin">PIN: {c.pincode}</div>
      <hr />
      {o.items.map((i, n) => <div key={n}>Product: {i.name.en}{i.size ? ` (${i.size})` : ''}<br />Quantity: {i.quantity}</div>)}
      {cod !== null && <div className="p-cod">COD AMOUNT: {money(cod)}</div>}
      {s.pos?.showQr && <div className="p-qr"><QRCodeSVG value={o.orderId} size={90} /></div>}
    </div>
  );
}

export function Invoice({ order: o, settings: s }) {
  const c = o.customer;
  const rate = s.gst?.enabled ? s.gst.rate : 0;
  const gst = rate ? (o.totalAmount * rate) / (100 + rate) : 0; // prices are GST-inclusive
  const invNo = `${s.invoice?.prefix || 'INV'}-${o.orderId}`;
  return (
    <div className="doc invoice">
      <Head s={s} title="INVOICE" />
      <div className="p-small">{s.address}{s.contactNumber && ` | ${s.contactNumber}`}{s.gst?.enabled && s.gst.number && ` | GSTIN: ${s.gst.number}`}</div>
      <hr />
      <div className="p-two"><div>Invoice: {invNo}<br />Order: {o.orderId}<br />Date: {dateTime(o.createdAt)}</div><div><strong>Bill To:</strong><br />{c.fullName}<br />{c.mobile}<br />{c.address}, {c.city}, {c.district}, {c.state} - {c.pincode}</div></div>
      <table className="p-table"><thead><tr><th>#</th><th>Item</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
        <tbody>{o.items.map((i, n) => <tr key={n}><td>{n + 1}</td><td>{i.name.en}{i.size ? ` (${i.size})` : ''}</td><td>{i.quantity}</td><td>{money(i.price)}</td><td>{money(i.price * i.quantity)}</td></tr>)}</tbody></table>
      <div className="p-totals">
        <div><span>Subtotal</span><span>{money(o.subtotal)}</span></div>
        <div><span>Delivery</span><span>{money(o.shippingCharges)}</span></div>
        {o.discount > 0 && <div><span>Discount</span><span>-{money(o.discount)}</span></div>}
        {rate > 0 && <div><span>Incl. GST @{rate}%</span><span>{money(gst.toFixed(2))}</span></div>}
        <div className="p-grand"><span>TOTAL</span><span>{money(o.totalAmount)}</span></div>
        <div><span>Payment</span><span>{o.paymentMethod} ({o.paymentStatus})</span></div>
      </div>
      {s.invoice?.footerNote && <div className="p-small center">{s.invoice.footerNote}</div>}
      {s.invoice?.terms && <div className="p-small">{s.invoice.terms}</div>}
    </div>
  );
}

export function PackingSlip({ order: o, settings: s }) {
  const c = o.customer;
  return (
    <div className="doc slip">
      <Head s={s} title="PACKING SLIP" />
      <div className="p-id">{o.orderId}</div>
      <div className="p-small">{dateTime(o.createdAt)}</div>
      <hr />
      <div><strong>{c.fullName}</strong> – {c.mobile}</div>
      <div>{c.city}, {c.district} - {c.pincode}</div>
      <hr />
      {o.items.map((i, n) => <div key={n} className="p-check">☐ {i.quantity} × {i.name.en}{i.size ? ` (${i.size})` : ''} <span className="p-small">[{i.sku}]</span></div>)}
      {o.customer.notes && <><hr /><div>Note: {o.customer.notes}</div></>}
      {o.adminNotes && <div>Internal: {o.adminNotes}</div>}
    </div>
  );
}
export const DOCS = { label: ShippingLabel, invoice: Invoice, slip: PackingSlip };
