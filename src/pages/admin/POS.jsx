import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';
import { orders, order as getOrder } from '../../services/adminService';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { DOCS } from '../../components/print/PrintDoc';
import { StatusBadge } from '../../components/common/AdminBits';
import { get } from '../../services/api';

const PAGE_CSS = { '58mm': '@page { size: 58mm auto; margin: 2mm; }', '80mm': '@page { size: 80mm auto; margin: 3mm; }', A4: '@page { size: A4; margin: 12mm; }' };

export default function POS() {
  const { settings: pub } = useSettings();
  const toast = useToast();
  const [sp, setSp] = useSearchParams();
  const [settings, setSettings] = useState(pub);
  const [q, setQ] = useState('');
  const dq = useDebounce(q);
  const [results, setResults] = useState([]);
  const [order, setOrder] = useState(null);
  const [doc, setDoc] = useState(sp.get('doc') || 'label');
  const [paper, setPaper] = useState('');

  useEffect(() => { get('/settings').then((r) => { setSettings(r.settings); setPaper((p) => p || r.settings.pos?.paperSize || '80mm'); }); }, []);
  useEffect(() => { const id = sp.get('order'); if (id) getOrder(id).then((r) => setOrder(r.order)).catch((e) => toast(e.userMessage, 'error')); /* eslint-disable-next-line */ }, [sp.get('order')]);
  useEffect(() => {
    if (dq.trim().length < 2) return setResults([]);
    orders({ q: dq, limit: 8 }).then((r) => setResults(r.items)).catch(() => {});
  }, [dq]);

  // @page size must be set at print time, so inject a style element and then call window.print()
  const print = () => {
    const el = document.createElement('style');
    el.id = 'page-size-style';
    el.textContent = PAGE_CSS[paper];
    document.head.appendChild(el);
    const done = () => { el.remove(); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  };
  const Doc = DOCS[doc];
  const w = paper === 'A4' ? 'a4' : paper === '58mm' ? 'p58' : 'p80';
  return (
    <>
      <h1 className="no-print">POS – Print Labels & Invoices</h1>
      <div className="pos no-print card pad">
        <label className="field"><span>Search order (Order ID, name, mobile)</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="GJ-2026-0001" autoFocus /></label>
        {results.length > 0 && <ul className="results">{results.map((o) => <li key={o._id}><button onClick={() => { setOrder(o); setResults([]); setQ(''); setSp({ order: o.orderId, doc }); }}>{o.orderId} · {o.customer.fullName} · {o.customer.mobile} <StatusBadge status={o.orderStatus} /></button></li>)}</ul>}
        <div className="form-grid">
          <label className="field"><span>Document</span><select value={doc} onChange={(e) => setDoc(e.target.value)}><option value="label">Shipping Label</option><option value="invoice">Invoice</option><option value="slip">Packing Slip</option></select></label>
          <label className="field"><span>Paper size</span><select value={paper} onChange={(e) => setPaper(e.target.value)}><option value="58mm">58 mm thermal</option><option value="80mm">80 mm thermal</option><option value="A4">A4</option></select></label>
        </div>
        <div className="btn-row">
          <button className="btn btn-primary" disabled={!order} onClick={print}>🖨 Print {doc === 'label' ? 'Shipping Label' : doc === 'invoice' ? 'Invoice' : 'Packing Slip'}</button>
        </div>
        <p className="muted">Choose your thermal printer in the print dialog and set the paper size to match. See README → "Thermal printer setup".</p>
      </div>
      {order ? <div className="print-area"><div className={`paper ${w}`}><Doc order={order} settings={settings} /></div></div> : <p className="muted no-print">Search and select an order to preview it.</p>}
    </>
  );
}
