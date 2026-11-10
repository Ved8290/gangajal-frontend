import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import { waLink } from '../../utils/whatsapp';
export default function Footer() {
  const { t } = useTranslation();
  const { settings: s } = useSettings();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div><h4>{t('brand')}</h4><p>{t('footer.about')}</p></div>
        <div><h4>{t('footer.quick')}</h4><Link to="/products">{t('nav.products')}</Link><Link to="/about">{t('nav.about')}</Link><Link to="/faq">{t('nav.faq')}</Link><Link to="/track-order">{t('nav.track')}</Link><Link to="/contact">{t('nav.contact')}</Link></div>
        <div><h4>{t('footer.policies')}</h4><Link to="/shipping-policy">{t('pages.shipping.title')}</Link><Link to="/privacy-policy">{t('pages.privacy.title')}</Link><Link to="/terms">{t('pages.terms.title')}</Link><Link to="/refund-policy">{t('pages.refund.title')}</Link></div>
        <div><h4>{t('footer.contact')}</h4>
          {s.contactNumber && <a href={`tel:${s.contactNumber}`}>{s.contactNumber}</a>}
          {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
          {s.address && <span>{s.address}</span>}
          {s.whatsappNumber && <a href={waLink(s.whatsappNumber)} target="_blank" rel="noopener noreferrer"><FaWhatsapp /> WhatsApp</a>}
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} {s.businessName}. {t('footer.rights')}</div>
    </footer>
  );
}
