import { createContext, useContext, useEffect, useState } from 'react';
import * as admin from '../services/adminService';
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // Only probe the session on admin URLs so shoppers never trigger a 401
    if (!location.pathname.startsWith('/admin')) return setReady(true);
    admin.me().then((r) => setUser(r.admin)).catch(() => {}).finally(() => setReady(true));
  }, []);
  const login = async (email, password) => { const r = await admin.login({ email, password }); setUser(r.admin); };
  const logout = async () => { await admin.logout().catch(() => {}); setUser(null); };
  return <Ctx.Provider value={{ user, ready, login, logout }}>{children}</Ctx.Provider>;
}
