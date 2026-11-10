import { createContext, useContext, useEffect, useState } from 'react';
import { getSettings } from '../services/shopService';
const DEFAULTS = { businessName: 'Gangajal & Trambakeshwar Jal', logo: '', whatsappNumber: '', contactNumber: '', email: '', address: '', shippingCharges: 50, freeShippingThreshold: 1000, gst: { enabled: false, rate: 5 }, invoice: {}, pos: { paperSize: '80mm', showLogo: true, showQr: true } };
const Ctx = createContext({ settings: DEFAULTS, refresh: () => {} });
export const useSettings = () => useContext(Ctx);
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const refresh = () => getSettings().then((r) => setSettings({ ...DEFAULTS, ...r.settings })).catch(() => {});
  useEffect(() => { refresh(); }, []);
  return <Ctx.Provider value={{ settings, refresh }}>{children}</Ctx.Provider>;
}
