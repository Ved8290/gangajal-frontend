import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import QuantitySelector from '../components/product/QuantitySelector';
import { EmptyState } from '../components/common/Bits';
import useLocalized from '../hooks/useLocalized';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { calcTotals, money } from '../utils/format';
import placeholder from '../assets/placeholder.svg';

export function Summary({ items, settings }) {
  const { t } = useTranslation();
  const x = calcTotals(items, settings);
  return (
    <div className="summary">
      <div className="row"><span>{t('common.subtotal')}</span><span>{money(x.subtotal)}</span></div>
      <div className="row"><span>{t('common.shipping')}</span><span>{x.shipping ? money(x.shipping) : t('common.free')}</span></div>
      {x.toFree > 0 && <p className="hint">{t('cart.freeHint', { amount: x.toFree })}</p>}
      <div className="row total"><span>{t('common.total')}</span><span>{money(x.total)}</span></div>
    </div>
  );
}

export default function Cart() {
  const { t } = useTranslation();
  const l = useLocalized();
  const nav = useNavigate();
  const { items, setQty, remove } = useCart();
  const { settings } = useSettings();
  return (
    <div className="container section">
      <SEO title={`${t('cart.title')} – ${t('brand')}`} noindex />
      <h1>{t('cart.title')}</h1>
      {items.length === 0 ? <EmptyState icon="🛒" title={t('cart.empty')} text={t('cart.emptyText')} to="/products" cta={t('common.shopNow')} /> : (
        <div className="cart-layout">
          <div>
            {items.map((i) => (
              <div className="cart-item" key={i.id}>
                <img src={i.image || placeholder} alt={l(i.name)} loading="lazy" />
                <div className="cart-info">
                  <Link to={`/product/${i.slug}`}><strong>{l(i.name)}</strong></Link>
                  <span className="muted">{i.size}</span>
                  <span>{money(i.price)}</span>
                </div>
                <QuantitySelector value={i.qty} max={i.stock} onChange={(q) => setQty(i.id, q)} />
                <strong className="line">{money(i.price * i.qty)}</strong>
                <button className="link-btn danger" onClick={() => remove(i.id)}>{t('common.remove')}</button>
              </div>
            ))}
            <Link to="/products" className="btn btn-outline">← {t('common.continueShopping')}</Link>
          </div>
          <aside className="card pad">
            <Summary items={items} settings={settings} />
            <button className="btn btn-primary btn-block btn-lg" onClick={() => nav('/checkout')}>{t('cart.checkout')}</button>
          </aside>
        </div>
      )}
    </div>
  );
}
