import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAsync from '../../hooks/useAsync';
import useDebounce from '../../hooks/useDebounce';
import { orders, exportOrders } from '../../services/adminService';
import { Msg, Pager, StatusBadge } from '../../components/common/AdminBits';
import { ORDER_STATUSES, money, dateTime } from '../../utils/format';
import { useToast } from '../../context/ToastContext';

export default function Orders() {
  const toast = useToast();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const dq = useDebounce(q);
  const params = { q: dq, status, from, to };
  const { data, loading, error, reload } = useAsync(() => orders({ ...params, page, limit: 20 }), [dq, status, from, to, page]);
  const reset = (fn) => (e) => { fn(e.target.value); setPage(1); };
  return (
    <>
      <div className="page-head"><h1>Orders</h1><button className="btn btn-outline" onClick={() => exportOrders(params).catch((e) => toast(e.userMessage, 'error'))}>Export CSV</button></div>
      <div className="filters">
        <input placeholder="Search Order ID, name, mobile, PIN" value={q} onChange={reset(setQ)} />
        <select value={status} onChange={reset(setStatus)}><option value="">All statuses</option>{ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <input type="date" value={from} onChange={reset(setFrom)} aria-label="From" />
        <input type="date" value={to} onChange={reset(setTo)} aria-label="To" />
      </div>
      <Msg loading={loading && !data} error={error} onRetry={reload} />
      {data && (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Mobile</th><th>PIN</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
          <tbody>{data.items.map((o) => (
            <tr key={o._id}><td><Link to={`/admin/orders/${o.orderId}`}>{o.orderId}</Link></td><td>{dateTime(o.createdAt)}</td><td>{o.customer.fullName}</td><td>{o.customer.mobile}</td><td>{o.customer.pincode}</td><td>{money(o.totalAmount)}</td><td>{o.paymentStatus}</td><td><StatusBadge status={o.orderStatus} /></td></tr>
          ))}</tbody></table>
          {data.items.length === 0 && <p className="muted pad">No orders found.</p>}
        </div>
      )}
      {data && <Pager page={data.page} pages={data.pages} onChange={setPage} />}
    </>
  );
}
