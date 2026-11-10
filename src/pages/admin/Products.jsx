import { useState } from 'react';
import useAsync from '../../hooks/useAsync';
import { adminProducts, saveProduct, deleteProduct, uploadImages } from '../../services/adminService';
import { Msg, Pager } from '../../components/common/AdminBits';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { money } from '../../utils/format';
import placeholder from '../../assets/placeholder.svg';

const BLANK = { name: { mr: '', hi: '', en: '' }, description: { mr: '', hi: '', en: '' }, sku: '', category: 'gangajal', price: '', discountPrice: '', stock: 0, size: '', images: [], featured: false, active: true };
const CATS = ['gangajal', 'trambakeshwar', 'kumbh', 'gift'];

function Form({ initial, onClose, onSaved }) {
  const toast = useToast();
  const [p, setP] = useState({ ...BLANK, ...initial, discountPrice: initial?.discountPrice ?? '' });
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setP((s) => ({ ...s, [k]: v }));
  const setL = (k, l, v) => setP((s) => ({ ...s, [k]: { ...s[k], [l]: v } }));
  const upload = async (e) => {
    try { const r = await uploadImages(e.target.files); set('images', [...p.images, ...r.images]); } catch (x) { toast(x.userMessage, 'error'); }
    e.target.value = '';
  };
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try {
      await saveProduct(initial?._id, { ...p, price: Number(p.price), discountPrice: p.discountPrice === '' ? null : Number(p.discountPrice), stock: Number(p.stock) });
      toast('Product saved'); onSaved();
    } catch (x) { toast(x.userMessage, 'error'); setBusy(false); }
  };
  return (
    <div className="modal"><form className="card pad modal-box wide" onSubmit={submit}>
      <h2>{initial ? 'Edit product' : 'Add product'}</h2>
      <div className="form-grid">
        {[['en', 'English'], ['mr', 'मराठी'], ['hi', 'हिंदी']].map(([l, n]) => <label className="field" key={l}><span>Name ({n})</span><input required value={p.name[l]} onChange={(e) => setL('name', l, e.target.value)} lang={l} /></label>)}
        {[['en', 'English'], ['mr', 'मराठी'], ['hi', 'हिंदी']].map(([l, n]) => <label className="field full" key={l}><span>Description ({n})</span><textarea rows="2" value={p.description[l]} onChange={(e) => setL('description', l, e.target.value)} lang={l} /></label>)}
        <label className="field"><span>SKU</span><input required value={p.sku} onChange={(e) => set('sku', e.target.value)} /></label>
        <label className="field"><span>Category</span><select value={p.category} onChange={(e) => set('category', e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="field"><span>Price (₹)</span><input required type="number" min="0" step="0.01" value={p.price} onChange={(e) => set('price', e.target.value)} /></label>
        <label className="field"><span>Discounted price (₹)</span><input type="number" min="0" step="0.01" value={p.discountPrice} onChange={(e) => set('discountPrice', e.target.value)} /></label>
        <label className="field"><span>Stock</span><input required type="number" min="0" value={p.stock} onChange={(e) => set('stock', e.target.value)} /></label>
        <label className="field"><span>Size (e.g. 500 ml)</span><input value={p.size} onChange={(e) => set('size', e.target.value)} /></label>
        <label className="check"><input type="checkbox" checked={p.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
        <label className="check"><input type="checkbox" checked={p.active} onChange={(e) => set('active', e.target.checked)} /> Active (visible in shop)</label>
      </div>
      <div className="field"><span>Images (JPG/PNG/WebP, max 5 MB each)</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={upload} />
        <div className="thumbs">{p.images.map((im, i) => <div key={i} className="thumb-edit"><img src={im.thumb || im.url} alt="" /><button type="button" onClick={() => set('images', p.images.filter((_, j) => j !== i))}>✕</button></div>)}</div></div>
      <div className="btn-row"><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button><button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button></div>
    </form></div>
  );
}

export default function Products() {
  const toast = useToast();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState(null);
  const { data, loading, error, reload } = useAsync(() => adminProducts({ page, limit: 20 }), [page]);
  const remove = async (p) => { if (!window.confirm(`Delete "${p.name.en}"?`)) return; try { await deleteProduct(p._id); toast('Deleted'); reload(); } catch (e) { toast(e.userMessage, 'error'); } };
  return (
    <>
      <div className="page-head"><h1>Products</h1><button className="btn btn-primary" onClick={() => setEdit({})}>+ Add product</button></div>
      <Msg loading={loading && !data} error={error} onRetry={reload} />
      {data && <div className="table-wrap"><table className="table"><thead><tr><th /><th>Name</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr></thead>
        <tbody>{data.items.map((p) => <tr key={p._id}><td><img className="mini" src={p.images?.[0]?.thumb || placeholder} alt="" /></td><td>{p.name.en}<br /><small>{p.name.mr}</small></td><td>{p.sku}</td><td>{p.category}</td><td>{money(p.effectivePrice)}{p.effectivePrice < p.price && <small> <s>{money(p.price)}</s></small>}</td><td>{p.stock}</td><td>{p.active ? 'Active' : 'Hidden'}{p.featured && ' ★'}</td>
          <td className="inline"><button className="link-btn" onClick={() => setEdit(p)}>Edit</button>{user.role === 'admin' && <button className="link-btn danger" onClick={() => remove(p)}>Delete</button>}</td></tr>)}</tbody></table></div>}
      {data && <Pager page={data.page} pages={data.pages} onChange={setPage} />}
      {edit && <Form initial={edit._id ? edit : null} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); reload(); }} />}
    </>
  );
}
