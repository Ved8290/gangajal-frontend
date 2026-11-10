import { useTranslation } from 'react-i18next';
import SEO from '../components/common/SEO';
import { EmptyState } from '../components/common/Bits';
export default function NotFound() {
  const { t } = useTranslation();
  return <div className="container section"><SEO title={t('notFound.title')} noindex /><EmptyState icon="🪔" title={t('notFound.title')} text={t('notFound.text')} to="/" cta={t('notFound.cta')} /></div>;
}
