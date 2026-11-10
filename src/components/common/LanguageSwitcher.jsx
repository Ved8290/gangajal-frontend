import { useTranslation } from 'react-i18next';
import { LANGS } from '../../translations/i18n';
export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  return (
    <div className="lang" role="group" aria-label={t('common.language')}>
      {LANGS.map((l) => <button key={l.code} className={i18n.language === l.code ? 'active' : ''} onClick={() => i18n.changeLanguage(l.code)} lang={l.code}>{l.label}</button>)}
    </div>
  );
}
