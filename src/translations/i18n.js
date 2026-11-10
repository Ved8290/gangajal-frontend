import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import mr from './mr.json';
import hi from './hi.json';
import en from './en.json';

export const LANGS = [{ code: 'mr', label: 'मराठी' }, { code: 'hi', label: 'हिंदी' }, { code: 'en', label: 'English' }];
const saved = typeof localStorage !== 'undefined' && localStorage.getItem('lang');
i18n.use(initReactI18next).init({
  resources: { mr: { translation: mr }, hi: { translation: hi }, en: { translation: en } },
  lng: LANGS.some((l) => l.code === saved) ? saved : 'mr', // default Marathi
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});
i18n.on('languageChanged', (lng) => {
  try { localStorage.setItem('lang', lng); } catch { /* ignore */ }
  document.documentElement.lang = lng;
});
document.documentElement.lang = i18n.language;
export default i18n;
