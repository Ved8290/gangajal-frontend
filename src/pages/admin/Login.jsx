import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/common/SEO';
export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/admin" replace />;
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { await login(email, password); nav('/admin'); } catch (x) { setErr(x.userMessage); setBusy(false); }
  };
  return (
    <div className="login-wrap">
      <SEO title="Admin Login" noindex />
      <form className="card pad login" onSubmit={submit}>
        <h1>🪔 Admin Login</h1>
        <label className="field"><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" /></label>
        <label className="field"><span>Password</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></label>
        {err && <p className="error-text">{err}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
