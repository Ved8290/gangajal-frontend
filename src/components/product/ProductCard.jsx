import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useLocalized from '../../hooks/useLocalized';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { money } from '../../utils/format';
import placeholder from '../../assets/placeholder.svg';

export const Price = ({ p }) => (
  <div className="price">
    <strong>{money(p.effectivePrice ?? p.price)}</strong>
    {p.effectivePrice < p.price && <s>{money(p.price)}</s>}
  </div>
);
export const StockBadge = ({ stock }) => {
  const { t } = useTranslation();
  if (stock <= 0) return <span className="tag tag-out">{t('common.outOfStock')}</span>;
  if (stock <= 5) return <span className="tag tag-low">{t('common.onlyLeft', { count: stock })}</span>;
  return <span className="tag tag-in">{t('common.inStock')}</span>;
};
function ProductCard({ product: p }) {
  const { t } = useTranslation();
  const l = useLocalized();
  const { add } = useCart();
  const toast = useToast();
  const img = p.images?.[0];
  return (
    <article className="card product-card">
      <Link to={`/product/${p.slug}`} className="card-img">
        <img src={img?.thumb || img?.url || placeholder} alt={`${l(p.name)} ${p.size || ''}`} loading="lazy" width="400" height="400" />
        {p.effectivePrice < p.price && <span className="ribbon">-{Math.round((1 - p.effectivePrice / p.price) * 100)}%</span>}
      </Link>
      <div className="card-body">
        <h3><Link to={`/product/${p.slug}`}>{l(p.name)}</Link></h3>
        <p className="muted">{p.size}</p>
        <Price p={p} />
        <StockBadge stock={p.stock} />
        <button className="btn btn-primary btn-block" disabled={p.stock <= 0} onClick={() => { add(p, 1); toast(t('common.added')); }}>{t('common.addToCart')}</button>
      </div>
    </article>
  );
}
export default memo(ProductCard);
