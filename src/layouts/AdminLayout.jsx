import { useState } from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiBox, FiSettings, FiPrinter, FiLogOut, FiMenu } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Bits';
import SEO from '../components/common/SEO';

const NAV = [['/admin', FiGrid, 'Dashboard', true], ['/admin/orders', FiShoppingBag, 'Orders'], ['/admin/pos', FiPrinter, 'POS / Print'], ['/admin/products', FiPackage, 'Products'], ['/admin/customers', FiUsers, 'Customers'], ['/admin/inventory', FiBox, 'Inventory'], ['/admin/settings', FiSettings, 'Settings']];
export default function AdminLayout() {
  const { user, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  if (!ready) return <Loader />;
  if (!user) return <Navigate to="/admin/login" replace />;
  return (
    <div className="admin">
      <SEO title="Admin" noindex />
      <aside className={`sidebar no-print ${open ? 'open' : ''}`}>
        <div className="side-brand">🪔 Admin Panel</div>
        {NAV.map(([to, Icon, label, end]) => <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}><Icon /> {label}</NavLink>)}
        <button className="side-logout" onClick={async () => { await logout(); nav('/admin/login'); }}><FiLogOut /> Logout</button>
      </aside>
      <div className="admin-main">
        <div className="admin-top no-print"><button className="burger" onClick={() => setOpen(!open)} aria-label="Menu"><FiMenu /></button><span>{user.name} ({user.role})</span></div>
        <div className="admin-content"><Outlet /></div>
      </div>
    </div>
  );
}
