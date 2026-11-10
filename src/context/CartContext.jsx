import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);
const load = () => { try { return JSON.parse(localStorage.getItem('cart_v1')) || []; } catch { return []; } };

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);
  useEffect(() => { try { localStorage.setItem('cart_v1', JSON.stringify(items)); } catch { /* ignore */ } }, [items]);
  const api = useMemo(() => ({
    items,
    count: items.reduce((a, i) => a + i.qty, 0),
    add: (p, qty = 1) => setItems((cur) => {
      const price = p.effectivePrice ?? p.price;
      const snap = { id: p._id, slug: p.slug, sku: p.sku, name: p.name, size: p.size, price, image: p.images?.[0]?.thumb || p.images?.[0]?.url || '', stock: p.stock };
      const ex = cur.find((i) => i.id === p._id);
      if (ex) return cur.map((i) => (i.id === p._id ? { ...i, ...snap, qty: Math.min(i.qty + qty, p.stock) } : i));
      return [...cur, { ...snap, qty: Math.min(qty, p.stock) }];
    }),
    setQty: (id, qty) => setItems((cur) => cur.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i))),
    remove: (id) => setItems((cur) => cur.filter((i) => i.id !== id)),
    clear: () => setItems([]),
  }), [items]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
