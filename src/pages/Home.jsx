import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/common/SEO';
import ProductCard from '../components/product/ProductCard';
import { Skeleton } from '../components/common/Bits';
import useAsync from '../hooks/useAsync';
import { getProducts } from '../services/shopService';
import { useSettings } from '../context/SettingsContext';
import { waLink } from '../utils/whatsapp';

const CATS = [['gangajal', '💧'], ['trambakeshwar', '🛕'], ['kumbh', '🪔'], ['gift', '🎁']];

export default function Home() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const { data, loading } = useAsync(() => getProducts({ featured: true, limit: 4 }), []);
  const faqs = t('faqs', { returnObjects: true });
  const schema = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: settings.businessName, url: window.location.origin, email: settings.email || undefined, telephone: settings.contactNumber || undefined },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ];
  return (
    <>
      <SEO title={t('seo.homeTitle')} description={t('seo.homeDesc')} path="/" schema={schema} />
      <section className="hero">
        <div className="container hero-inner">
          <span className="hero-badge">🪔 {t('hero.badge')}</span>
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.subtitle')}</p>
          <div className="hero-cta">
            <Link to="/products" className="btn btn-primary btn-lg">{t('common.shopNow')}</Link>
            {settings.whatsappNumber && <a className="btn btn-wa btn-lg" href={waLink(settings.whatsappNumber, 'Namaskar')} target="_blank" rel="noopener noreferrer"><FaWhatsapp /> {t('common.whatsappOrder')}</a>}
          </div>
          <ul className="hero-trust"><li>✔ {t('hero.trust1')}</li><li>✔ {t('hero.trust2')}</li><li>✔ {t('hero.trust3')}</li></ul>
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">{t('home.categories')}</h2>
        <div className="cat-grid">{CATS.map(([c, icon]) => <Link key={c} to={`/products?category=${c}`} className="cat-card"><span>{icon}</span>{t(`categories.${c}`)}</Link>)}</div>
      </section>

      <section className="section container">
        <h2 className="section-title">{t('home.featured')}</h2>
        {loading ? <Skeleton count={4} /> : <div className="grid">{data?.items.map((p) => <ProductCard key={p._id} product={p} />)}</div>}
        <div className="center"><Link to="/products" className="btn btn-outline">{t('common.viewAll')}</Link></div>
      </section>

      <section className="section cream"><div className="container">
        <h2 className="section-title">{t('home.benefitsTitle')}</h2>
        <div className="feature-grid">{t('home.benefits', { returnObjects: true }).map((b, i) => <div className="feature" key={i}><h3>{b.t}</h3><p>{b.d}</p></div>)}</div>
      </div></section>

      <section className="section container">
        <h2 className="section-title">{t('home.whyTitle')}</h2>
        <div className="feature-grid">{t('home.why', { returnObjects: true }).map((b, i) => <div className="feature" key={i}><h3>✔ {b.t}</h3><p>{b.d}</p></div>)}</div>
      </section>

      <section className="section cream"><div className="container">
        <h2 className="section-title">{t('home.testimonialsTitle')}</h2>
        <div className="feature-grid three">{t('home.testimonials', { returnObjects: true }).map((x, i) => <blockquote className="feature" key={i}><p>“{x.t}”</p><footer>— {x.n}</footer></blockquote>)}</div>
      </div></section>

      <section className="section container narrow">
        <h2 className="section-title">{t('home.faqTitle')}</h2>
        {faqs.map((f, i) => <details className="faq" key={i}><summary>{f.q}</summary><p>{f.a}</p></details>)}
      </section>

      <section className="cta-band"><div className="container"><h2>{t('home.ctaTitle')}</h2><p>{t('home.ctaText')}</p><Link to="/products" className="btn btn-light btn-lg">{t('common.shopNow')}</Link></div></section>
    </>
  );
}
