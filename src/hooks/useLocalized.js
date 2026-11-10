import { useTranslation } from 'react-i18next';
export default function useLocalized() {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language;
  return (o) => (!o ? '' : typeof o === 'string' ? o : o[lang] || o.en || o.mr || o.hi || '');
}
