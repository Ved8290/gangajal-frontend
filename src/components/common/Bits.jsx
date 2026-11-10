import { Link } from 'react-router-dom';
export const Loader = () => <div className="loader" role="status" aria-label="Loading"><span /></div>;
export const Skeleton = ({ count = 4 }) => (
  <div className="grid">{Array.from({ length: count }).map((_, i) => <div key={i} className="skeleton-card"><div className="sk sk-img" /><div className="sk sk-line" /><div className="sk sk-line short" /></div>)}</div>
);
export const EmptyState = ({ icon = '🪔', title, text, to, cta }) => (
  <div className="empty"><div className="empty-icon">{icon}</div><h3>{title}</h3>{text && <p>{text}</p>}{to && <Link className="btn btn-primary" to={to}>{cta}</Link>}</div>
);
export const ErrorBox = ({ message, onRetry, retryLabel }) => (
  <div className="empty"><div className="empty-icon">⚠️</div><p>{message}</p>{onRetry && <button className="btn btn-outline" onClick={onRetry}>{retryLabel}</button>}</div>
);
