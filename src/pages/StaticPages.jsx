import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import SEO, { breadcrumb } from '../components/common/SEO';
import { useSettings } from '../context/SettingsContext';
import { waLink } from '../utils/whatsapp';

const POLICY = { 'shipping-policy': 'shipping', 'privacy-policy': 'privacy', terms: 'terms', 'refund-policy': 'refund' };

export default function StaticPage({ page }) {
  const { t } = useTranslation();
  const { settings: s } = useSettings();
  const path = `/${page}`;
  let title; let body;

  if (page === 'about') {
    title = t('pages.about.title');
    body = <><p>{t('pages.about.p1')}</p><p>{t('pages.about.p2')}</p></>;
  } else if (page === 'contact') {
    title = t('pages.contact.title');
    body = (
      <>
        <p>{t('pages.contact.intro')}</p>
        <ul className="contact-list">
          {s.whatsappNumber && <li><a className="btn btn-wa" href={waLink(s.whatsappNumber, 'Namaskar')} target="_blank" rel="noopener noreferrer"><FaWhatsapp /> WhatsApp</a></li>}
          {s.contactNumber && <li><strong>{t('pages.contact.call')}:</strong> <a href={`tel:${s.contactNumber}`}>{s.contactNumber}</a></li>}
          {s.email && <li><strong>{t('pages.contact.email')}:</strong> <a href={`mailto:${s.email}`}>{s.email}</a></li>}
          {s.address && <li><strong>{t('pages.contact.address')}:</strong> {s.address}</li>}
        </ul>
        {s.address && <iframe title="Map" className="map" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`} />}
      </>
    );
  } else if (page === 'faq') {
    title = t('nav.faq');
    const faqs = t('faqs', { returnObjects: true });
    body = faqs.map((f, i) => <details className="faq" key={i} open={i === 0}><summary>{f.q}</summary><p>{f.a}</p></details>);
  } else {
    const k = POLICY[page];
    title = t(`pages.${k}.title`);
    body = <><p>{t(`pages.${k}.body`)}</p><p className="muted">{t('pages.placeholder')}</p></>;
  }
  const schema = [breadcrumb([{ name: t('nav.home'), path: '/' }, { name: title, path }])];
  if (page === 'faq') schema.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: t('faqs', { returnObjects: true }).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  return (
    <div className="container section narrow">
      <SEO title={`${title} – ${t('brand')}`} description={t('seo.homeDesc')} path={path} schema={schema} />
      <h1>{title}</h1>
      {body}
    </div>
  );
}
