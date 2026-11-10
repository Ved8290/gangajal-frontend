import { STATUS_KEY } from '../../utils/format';
export const StatusBadge = ({ status }) => <span className={`status s-${STATUS_KEY[status] || 'pending'}`}>{status}</span>;
export const Pager = ({ page, pages, onChange }) => pages > 1 ? (
  <div className="pager"><button className="btn btn-outline btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Prev</button><span>{page} / {pages}</span><button className="btn btn-outline btn-sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</button></div>
) : null;
export const Msg = ({ loading, error, onRetry }) => loading ? <p className="muted">Loading…</p> : error ? <p className="error-text">{error} {onRetry && <button className="link-btn" onClick={onRetry}>Retry</button>}</p> : null;
