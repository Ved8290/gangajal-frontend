import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import LanguageSwitcher from './LanguageSwitcher';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

export default function Navbar() {
  const { t } = useTranslation();
  const { count } = useCart();
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const links = [['/', 'home'], ['/products', 'products'], ['/about', 'about'], ['/contact', 'contact'], ['/track-order', 'track']];
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          {settings.logo ? <img src={settings.logo} alt={settings.businessName} /> : <span className="brand-mark">🪔</span>}
          <span className="brand-text">{t('brand')}</span>
        </Link>
        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label={t('nav.menu')}>
          {links.map(([to, k]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{t(`nav.${k}`)}</NavLink>)}
          <div className="nav-lang-mobile"><LanguageSwitcher /></div>
        </nav>
        <div className="nav-actions">
          <div className="nav-lang-desktop"><LanguageSwitcher /></div>
          <Link to="/cart" className="cart-link" aria-label={t('nav.cart')}><FiShoppingCart />{count > 0 && <span className="badge">{count}</span>}</Link>
          <button className="burger" onClick={() => setOpen(!open)} aria-label={t('nav.menu')} aria-expanded={open}>{open ? <FiX /> : <FiMenu />}</button>
        </div>
      </div>
    </header>
  );
}
