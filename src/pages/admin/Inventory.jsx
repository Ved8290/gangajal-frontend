import { useState } from 'react';
import useAsync from '../../hooks/useAsync';
import { inventory, adjustStock } from '../../services/adminService';
import { Msg, Pager } from '../../components/common/AdminBits';
import { useToast } from '../../context/ToastContext';
import { dateTime } from '../../utils/format';

export default function Inventory() {
  const toast = useToast();
  const [tab, setTab] = useState('stock');
  const [low, setLow] = useState(false);
  const [page, setPage] = useState(1);
  const [qty, setQty] = useState({});
  const [reason, setReason] = useState('');
  const { data, loading, error, reload } = useAsync(() => inventory(tab === 'history' ? { history: true, page } : { lowOnly: low, page }), [tab, low, page]);
  const apply = async (p, mode) => {
    const quantity = Number(qty[p._id]);
    if (!Number.isInteger(quantity)) return toast('Enter a whole number', 'error');
    try { await adjustStock(p._id, { mode, quantity, reason }); toast('Stock updated'); setQty({ ...qty, [p._id]: '' }); reload(); } catch (e) { toast(e.userMessage, 'error'); }
  };
  return (
    <>
      <h1>Inventory</h1>
      <div className="btn-row"><button className={`btn btn-sm ${tab === 'stock' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setTab('stock'); setPage(1); }}>Stock</button><button className={`btn btn-sm ${tab === 'history' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setTab('history'); setPage(1); }}>Adjustment history</button>
        {tab === 'stock' && <label className="check"><input type="checkbox" checked={low} onChange={(e) => { setLow(e.target.checked); setPage(1); }} /> Low stock only</label>}</div>
      <Msg loading={loading && !data} error={error} onRetry={reload} />
      {data && tab === 'stock' && <>
        <label className="field"><span>Reason for adjustment (optional)</span><input value={reason} onChange={(e) => setReason(e.target.value)} /></label>
        <div className="table-wrap"><table className="table"><thead><tr><th>Product</th><th>SKU</th><th>Stock</th><th>Adjust</th></tr></thead>
          <tbody>{data.items.map((p) => <tr key={p._id}><td>{p.name.en}</td><td>{p.sku}</td><td><strong className={p.stock <= data.lowStockThreshold ? 'danger' : ''}>{p.stock}</strong>{p.stock <= data.lowStockThreshold && ' ⚠ low'}</td>
            <td className="inline"><input type="number" value={qty[p._id] ?? ''} onChange={(e) => setQty({ ...qty, [p._id]: e.target.value })} placeholder="qty" /><button className="btn btn-outline btn-sm" onClick={() => apply(p, 'adjust')}>± Add/Remove</button><button className="btn btn-outline btn-sm" onClick={() => apply(p, 'set')}>Set to</button></td></tr>)}</tbody></table></div></>}
      {data && tab === 'history' && <div className="table-wrap"><table className="table"><thead><tr><th>Date</th><th>Product</th><th>Change</th><th>Stock after</th><th>Reason</th><th>Order</th><th>By</th></tr></thead>
        <tbody>{data.items.map((h) => <tr key={h._id}><td>{dateTime(h.createdAt)}</td><td>{h.productName} <small>{h.sku}</small></td><td className={h.change < 0 ? 'danger' : 'ok'}>{h.change > 0 ? `+${h.change}` : h.change}</td><td>{h.stockAfter}</td><td>{h.reason}</td><td>{h.orderId}</td><td>{h.by}</td></tr>)}</tbody></table>{data.items.length === 0 && <p className="muted pad">No history yet.</p>}</div>}
      {data && <Pager page={data.page} pages={data.pages} onChange={setPage} />}
    </>
  );
}
