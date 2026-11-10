import { useState } from 'react';
import useAsync from '../../hooks/useAsync';
import useDebounce from '../../hooks/useDebounce';
import { customers, customer as getCustomer } from '../../services/adminService';
import { Msg, Pager, StatusBadge } from '../../components/common/AdminBits';
import { money, dateTime } from '../../utils/format';

export default function Customers() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState(null);
  const dq = useDebounce(q);
  const { data, loading, error, reload } = useAsync(() => customers({ q: dq, page }), [dq, page]);
  const open = async (id) => setSel((await getCustomer(id)));
  return (
    <>
      <h1>Customers</h1>
      <div className="filters"><input placeholder="Search name, mobile, PIN" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} /></div>
      <Msg loading={loading && !data} error={error} onRetry={reload} />
      {data && <div className="table-wrap"><table className="table"><thead><tr><th>Name</th><th>Mobile</th><th>WhatsApp</th><th>Address</th><th>Orders</th><th>Total spent</th><th /></tr></thead>
        <tbody>{data.items.map((c) => <tr key={c._id}><td>{c.fullName}</td><td>{c.mobile}</td><td>{c.whatsapp}</td><td>{[c.address, c.city, c.district, c.pincode].filter(Boolean).join(', ')}</td><td>{c.totalOrders}</td><td>{money(c.totalAmount)}</td><td><button className="link-btn" onClick={() => open(c._id)}>History</button></td></tr>)}</tbody></table>
        {data.items.length === 0 && <p className="muted pad">No customers yet.</p>}</div>}
      {data && <Pager page={data.page} pages={data.pages} onChange={setPage} />}
      {sel && <div className="modal" onClick={() => setSel(null)}><div className="card pad modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>{sel.customer.fullName} – order history</h2>
        <table className="table"><tbody>{sel.orders.map((o) => <tr key={o._id}><td>{o.orderId}</td><td>{dateTime(o.createdAt)}</td><td>{money(o.totalAmount)}</td><td><StatusBadge status={o.orderStatus} /></td></tr>)}</tbody></table>
        <button className="btn btn-outline btn-sm" onClick={() => setSel(null)}>Close</button></div></div>}
    </>
  );
}
