import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import SEO, { breadcrumb } from '../components/common/SEO';
import ProductCard, { Price, StockBadge } from '../components/product/ProductCard';
import QuantitySelector from '../components/product/QuantitySelector';
import { Loader, ErrorBox } from '../components/common/Bits';
import useAsync from '../hooks/useAsync';
import useLocalized from '../hooks/useLocalized';
import { getProduct } from '../services/shopService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';
import { buildInquiryMessage, waLink } from '../utils/whatsapp';
import placeholder from '../assets/placeholder.svg';

export default function ProductDetails() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const l = useLocalized();
  const nav = useNavigate();
  const { add } = useCart();
  const toast = useToast();
  const { settings } = useSettings();
  const { data, loading, error } = useAsync(() => getProduct(slug), [slug]);
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  if (loading) return <Loader />;
  if (error) return <div className="container section"><ErrorBox message={t('shop.notFound')} /><div className="center"><Link className="btn btn-primary" to="/products">{t('nav.products')}</Link></div></div>;
  const { product: p, related } = data;
  const out = p.stock <= 0;
  const imgs = p.images?.length ? p.images : [{ url: placeholder }];
  const name = l(p.name);
  const schema = [
    breadcrumb([{ name: t('nav.home'), path: '/' }, { name: t('nav.products'), path: '/products' }, { name, path: `/product/${p.slug}` }]),
    { '@context': 'https://schema.org', '@type': 'Product', name, description: l(p.description), sku: p.sku, image: imgs.map((i) => (i.url.startsWith('http') ? i.url : window.location.origin + i.url)), offers: { '@type': 'Offer', priceCurrency: 'INR', price: p.effectivePrice, availability: out ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock', url: window.location.href } },
  ];
  const addNow = () => { add(p, qty); return true; };

  return (
    <div className="container section">
      <SEO title={`${name} – ${t('brand')}`} description={l(p.description).slice(0, 160)} image={p.images?.[0]?.url} type="product" schema={schema} />
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">{t('nav.home')}</Link> / <Link to="/products">{t('nav.products')}</Link> / <span>{name}</span></nav>
      <div className="detail">
        <div className="gallery">
          <img className="gallery-main" src={imgs[active]?.url} alt={`${name} ${p.size || ''}`} width="800" height="800" />
          {imgs.length > 1 && <div className="thumbs">{imgs.map((im, i) => <button key={i} onClick={() => setActive(i)} className={i === active ? 'active' : ''}><img src={im.thumb || im.url} alt={`${name} ${i + 1}`} loading="lazy" /></button>)}</div>}
        </div>
        <div className="detail-info">
          <h1>{name}</h1>
          <Price p={p} />
          <StockBadge stock={p.stock} />
          <p className="desc">{l(p.description)}</p>
          {p.size && <p><strong>{t('common.size')}:</strong> <span className="chip">{p.size}</span></p>}
          <p className="muted">SKU: {p.sku}</p>
          {!out && <div className="qty-row"><strong>{t('common.quantity')}</strong><QuantitySelector value={qty} max={p.stock} onChange={setQty} /></div>}
          <div className="btn-row">
            <button className="btn btn-primary" disabled={out} onClick={() => { addNow(); toast(t('common.added')); }}>{t('common.addToCart')}</button>
            <button className="btn btn-dark" disabled={out} onClick={() => { addNow(); nav('/checkout'); }}>{t('common.buyNow')}</button>
            {settings.whatsappNumber && <a className="btn btn-wa" target="_blank" rel="noopener noreferrer" href={waLink(settings.whatsappNumber, buildInquiryMessage(`${name} (${p.sku})`, i18n.language))}><FaWhatsapp /> {t('shop.inquiry')}</a>}
          </div>
        </div>
      </div>
      {related?.length > 0 && <><h2 className="section-title">{t('shop.related')}</h2><div className="grid">{related.map((r) => <ProductCard key={r._id} product={r} />)}</div></>}
    </div>
  );
}
