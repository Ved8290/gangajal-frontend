import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/common/SEO';
import { useSettings } from '../context/SettingsContext';
import { buildOrderMessage, waLink } from '../utils/whatsapp';
import { money } from '../utils/format';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [copied, setCopied] = useState(false);
  let order = null;
  try { const o = JSON.parse(sessionStorage.getItem('lastOrder')); if (o?.orderId === orderId) order = o; } catch { /* ignore */ }

  const lang = order?.customer.preferredLanguage || 'mr';
  const text = order ? buildOrderMessage(order, lang) : '';
  const url = order ? waLink(settings.whatsappNumber, text) : '';
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  };
  return (
    <div className="container section narrow center-text">
      <SEO title={`${t('success.title')} – ${t('brand')}`} noindex />
      <div className="success-icon">✔</div>
      <h1>{t('success.title')}</h1>
      <p>{t('success.body', { id: orderId })}</p>
      {order ? (
        <>
          <p><strong>{t('common.total')}: {money(order.totalAmount)}</strong></p>
          <a className="btn btn-wa btn-lg" href={url} target="_blank" rel="noopener noreferrer"><FaWhatsapp /> {t('success.open')}</a>
          <div className="card pad fallback">
            <h3>{t('success.noWhatsapp')}</h3>
            <p className="muted">{t('success.copyHint', { number: `+${settings.whatsappNumber}` })}</p>
            <pre className="msg">{text}</pre>
            <button className="btn btn-outline" onClick={copy}>{copied ? t('common.copied') : t('common.copy')}</button>
            <div className="qr"><QRCodeSVG value={url} size={150} /></div>
          </div>
        </>
      ) : null}
      <p><Link to="/track-order" className="btn btn-primary">{t('success.track')}</Link></p>
    </div>
  );
}
