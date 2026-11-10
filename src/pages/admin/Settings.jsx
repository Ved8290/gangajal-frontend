import { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { saveSettings, uploadImages } from '../../services/adminService';
import { get } from '../../services/api';

export default function Settings() {
  const { refresh } = useSettings();
  const { user } = useAuth();
  const toast = useToast();
  const [s, setS] = useState(null);
  useEffect(() => { get('/settings').then((r) => setS(r.settings)); }, []);
  if (!s) return <p className="muted">Loading…</p>;
  const set = (k, v) => setS((x) => ({ ...x, [k]: v }));
  const nest = (g, k, v) => setS((x) => ({ ...x, [g]: { ...x[g], [k]: v } }));
  const ro = user.role !== 'admin';
  const logo = async (e) => { try { set('logo', (await uploadImages(e.target.files)).images[0].url); } catch (x) { toast(x.userMessage, 'error'); } };
  const submit = async (e) => {
    e.preventDefault();
    try { await saveSettings({ ...s, shippingCharges: Number(s.shippingCharges), freeShippingThreshold: Number(s.freeShippingThreshold), lowStockThreshold: Number(s.lowStockThreshold) }); toast('Settings saved'); refresh(); } catch (x) { toast(x.userMessage, 'error'); }
  };
  const F = ({ label, k, type = 'text', ...r }) => <label className="field"><span>{label}</span><input type={type} value={s[k] ?? ''} onChange={(e) => set(k, e.target.value)} disabled={ro} {...r} /></label>;
  return (
    <form onSubmit={submit}>
      <h1>Settings</h1>
      {ro && <p className="muted">Only admins can change settings.</p>}
      <div className="card pad"><h2>Business</h2><div className="form-grid">
        <F label="Business name" k="businessName" /><F label="WhatsApp number (with country code, digits only, e.g. 919876543210)" k="whatsappNumber" inputMode="numeric" />
        <F label="Contact number" k="contactNumber" /><F label="Email" k="email" type="email" />
        <label className="field full"><span>Business address</span><textarea rows="2" value={s.address || ''} onChange={(e) => set('address', e.target.value)} disabled={ro} /></label>
        <div className="field"><span>Logo</span>{s.logo && <img className="mini" src={s.logo} alt="logo" />}<input type="file" accept="image/*" onChange={logo} disabled={ro} /></div>
      </div></div>
      <div className="card pad"><h2>Shipping & stock</h2><div className="form-grid">
        <F label="Shipping charges (₹)" k="shippingCharges" type="number" min="0" /><F label="Free shipping above (₹, 0 = never free)" k="freeShippingThreshold" type="number" min="0" /><F label="Low stock threshold" k="lowStockThreshold" type="number" min="0" />
      </div></div>
      <div className="card pad"><h2>GST & invoice</h2><div className="form-grid">
        <label className="check"><input type="checkbox" checked={!!s.gst?.enabled} onChange={(e) => nest('gst', 'enabled', e.target.checked)} disabled={ro} /> Show GST on invoice (prices are GST-inclusive)</label>
        <label className="field"><span>GSTIN</span><input value={s.gst?.number || ''} onChange={(e) => nest('gst', 'number', e.target.value)} disabled={ro} /></label>
        <label className="field"><span>GST rate %</span><input type="number" min="0" max="100" value={s.gst?.rate ?? 5} onChange={(e) => nest('gst', 'rate', e.target.value)} disabled={ro} /></label>
        <label className="field"><span>Invoice prefix</span><input value={s.invoice?.prefix || ''} onChange={(e) => nest('invoice', 'prefix', e.target.value)} disabled={ro} /></label>
        <label className="field full"><span>Invoice footer note</span><input value={s.invoice?.footerNote || ''} onChange={(e) => nest('invoice', 'footerNote', e.target.value)} disabled={ro} /></label>
        <label className="field full"><span>Invoice terms</span><textarea rows="2" value={s.invoice?.terms || ''} onChange={(e) => nest('invoice', 'terms', e.target.value)} disabled={ro} /></label>
      </div></div>
      <div className="card pad"><h2>POS printer</h2><div className="form-grid">
        <label className="field"><span>Default paper size</span><select value={s.pos?.paperSize || '80mm'} onChange={(e) => nest('pos', 'paperSize', e.target.value)} disabled={ro}><option>58mm</option><option>80mm</option><option>A4</option></select></label>
        <label className="check"><input type="checkbox" checked={!!s.pos?.showLogo} onChange={(e) => nest('pos', 'showLogo', e.target.checked)} disabled={ro} /> Print logo</label>
        <label className="check"><input type="checkbox" checked={!!s.pos?.showQr} onChange={(e) => nest('pos', 'showQr', e.target.checked)} disabled={ro} /> Print QR code on label</label>
      </div></div>
      {!ro && <button className="btn btn-primary">Save settings</button>}
    </form>
  );
}
