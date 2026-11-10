import { FaWhatsapp } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import { waLink } from '../../utils/whatsapp';
export default function WhatsAppFloat() {
  const { settings } = useSettings();
  if (!settings.whatsappNumber) return null;
  return <a className="wa-float" href={waLink(settings.whatsappNumber, 'Namaskar')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><FaWhatsapp /></a>;
}
