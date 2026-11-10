import { Link } from 'react-router-dom';
import useAsync from '../../hooks/useAsync';
import { stats } from '../../services/adminService';
import { Msg, StatusBadge } from '../../components/common/AdminBits';
import { money, dateTime } from '../../utils/format';

export default function Dashboard() {
  const { data, loading, error, reload } = useAsync(stats, []);
  if (!data) return <Msg loading={loading} error={error} onRetry={reload} />;
  const s = data.stats;
  const cards = [['Total Orders', s.totalOrders], ['Pending', s.pending], ['Confirmed', s.confirmed], ['In Progress', s.processing], ['Delivered', s.delivered], ['Cancelled', s.cancelled], ['Revenue (delivered)', money(s.revenue)], ['Products', s.totalProducts], ['Low Stock', s.lowStockCount]];
  return (
    <>
      <h1>Dashboard</h1>
      <div className="stat-grid">{cards.map(([l, v]) => <div className="stat" key={l}><span>{l}</span><strong>{v}</strong></div>)}</div>
      <div className="two-col">
        <div className="card pad"><h2>Recent Orders</h2>
          <table className="table"><tbody>{s.recent.map((o) => <tr key={o._id}><td><Link to={`/admin/orders/${o.orderId}`}>{o.orderId}</Link></td><td>{o.customer.fullName}</td><td>{money(o.totalAmount)}</td><td><StatusBadge status={o.orderStatus} /></td><td>{dateTime(o.createdAt)}</td></tr>)}</tbody></table>
          {s.recent.length === 0 && <p className="muted">No orders yet.</p>}
        </div>
        <div className="card pad"><h2>Low Stock</h2>
          {s.lowStock.length === 0 ? <p className="muted">All products are well stocked.</p> : <table className="table"><tbody>{s.lowStock.map((p) => <tr key={p._id}><td>{p.name.en}</td><td>{p.sku}</td><td><strong className="danger">{p.stock}</strong></td></tr>)}</tbody></table>}
          <Link to="/admin/inventory" className="btn btn-outline btn-sm">Manage inventory</Link>
        </div>
      </div>
    </>
  );
}
