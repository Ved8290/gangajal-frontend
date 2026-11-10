import { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/common/SEO';
import { Summary } from './Cart';
import useLocalized from '../hooks/useLocalized';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../services/shopService';
import { buildOrderMessage, waLink } from '../utils/whatsapp';
import { money } from '../utils/format';

const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
const EMPTY = { fullName: '', mobile: '', whatsapp: '', address: '', city: '', district: '', state: 'Maharashtra', pincode: '', landmark: '', notes: '' };

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const l = useLocalized();
  const nav = useNavigate();
  const toast = useToast();
  const { items, clear } = useCart();
  const { settings } = useSettings();
  const [f, setF] = useState(EMPTY);
  const [sameWa, setSameWa] = useState(true);
  const [lang, setLang] = useState(i18n.language);
  const [payment, setPayment] = useState('UPI');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  // One idempotency key per cart content: double clicks / retries return the same order instead of a duplicate
  const sig = items.map((i) => `${i.id}:${i.qty}`).join('|');
  const keyRef = useRef({ sig: '', key: '' });
  if (keyRef.current.sig !== sig) keyRef.current = { sig, key: uuid() };

  if (items.length === 0 && !busy) return <Navigate to="/cart" replace />;
  const up = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    ['fullName', 'mobile', 'address', 'city', 'district', 'state', 'pincode'].forEach((k) => { if (!f[k].trim()) e[k] = t('checkout.required'); });
    if (f.mobile && !/^[6-9]\d{9}$/.test(f.mobile)) e.mobile = t('checkout.mobileInvalid');
    if (!sameWa && f.whatsapp && !/^[6-9]\d{9}$/.test(f.whatsapp)) e.whatsapp = t('checkout.mobileInvalid');
    if (f.pincode && !/^\d{6}$/.test(f.pincode)) e.pincode = t('checkout.pincodeInvalid');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (busy || !validate()) return;
    setBusy(true);
    try {
      const res = await createOrder({
        idempotencyKey: keyRef.current.key,
        paymentMethod: payment,
        customer: { ...f, whatsapp: sameWa ? f.mobile : f.whatsapp, preferredLanguage: lang },
        items: items.map((i) => ({ productId: i.id, quantity: i.qty })),
      });
      const order = res.order;
      sessionStorage.setItem('lastOrder', JSON.stringify(order));
      const url = waLink(settings.whatsappNumber, buildOrderMessage(order, lang));
      clear();
      // Open WhatsApp now that the order is safely stored. If the browser blocks the pop-up, the success page has a button.
      window.open(url, '_blank', 'noopener');
      nav(`/order-success/${order.orderId}`, { replace: true });
    } catch (err) {
      toast(err.userMessage || t('common.error'), 'error');
      setBusy(false);
    }
  };

  const field = (k, label, props = {}) => (
    <label className={`field ${errors[k] ? 'has-error' : ''}`}>
      <span>{label}</span>
      <input value={f[k]} onChange={up(k)} {...props} />
      {errors[k] && <em>{errors[k]}</em>}
    </label>
  );

  return (
    <div className="container section">
      <SEO title={`${t('checkout.title')} – ${t('brand')}`} noindex />
      <h1>{t('checkout.title')}</h1>
      <form className="cart-layout" onSubmit={submit} noValidate>
        <div className="card pad">
          <h2>{t('checkout.details')}</h2>
          <div className="form-grid">
            {field('fullName', t('checkout.fullName'), { autoComplete: 'name', maxLength: 100 })}
            {field('mobile', t('checkout.mobile'), { inputMode: 'numeric', maxLength: 10, autoComplete: 'tel' })}
            <div className="field">
              <label className="check"><input type="checkbox" checked={sameWa} onChange={(e) => setSameWa(e.target.checked)} /> {t('checkout.whatsapp')}: {t('checkout.sameAsMobile')}</label>
              {!sameWa && <><input value={f.whatsapp} onChange={up('whatsapp')} inputMode="numeric" maxLength={10} aria-label={t('checkout.whatsapp')} />{errors.whatsapp && <em>{errors.whatsapp}</em>}</>}
            </div>
            <label className={`field full ${errors.address ? 'has-error' : ''}`}><span>{t('checkout.address')}</span><textarea rows="3" value={f.address} onChange={up('address')} maxLength={300} autoComplete="street-address" />{errors.address && <em>{errors.address}</em>}</label>
            {field('city', t('checkout.city'))}
            {field('district', t('checkout.district'))}
            {field('state', t('checkout.state'))}
            {field('pincode', t('checkout.pincode'), { inputMode: 'numeric', maxLength: 6, autoComplete: 'postal-code' })}
            {field('landmark', t('checkout.landmark'), { maxLength: 150 })}
            <label className="field"><span>{t('checkout.language')}</span>
              <select value={lang} onChange={(e) => setLang(e.target.value)}><option value="mr">मराठी</option><option value="hi">हिंदी</option><option value="en">English</option></select></label>
            <label className="field"><span>{t('checkout.payment')}</span>
              <select value={payment} onChange={(e) => setPayment(e.target.value)}>
                {[['UPI on Delivery', 'upi'], ['Bank Transfer', 'bank']].map(([v, k]) => <option key={v} value={v}>{t(`payment.${k}`)}</option>)}
              </select></label>
            <label className="field full"><span>{t('checkout.notes')}</span><textarea rows="2" value={f.notes} onChange={up('notes')} maxLength={500} /></label>
          </div>
        </div>
        <aside className="card pad">
          <h2>{t('checkout.summary')}</h2>
          {items.map((i) => <div className="row small" key={i.id}><span>{l(i.name)} × {i.qty}</span><span>{money(i.price * i.qty)}</span></div>)}
          <Summary items={items} settings={settings} />
          <p className="note">{t('checkout.note')}</p>
          <button className="btn btn-wa btn-block btn-lg" disabled={busy}><FaWhatsapp /> {busy ? t('checkout.saving') : t('checkout.confirm')}</button>
        </aside>
      </form>
    </div>
  );
}
