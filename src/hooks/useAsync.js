import { useCallback, useEffect, useRef, useState } from 'react';
// Runs an async loader whenever deps change; ignores stale responses
export default function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const id = useRef(0);
  const run = useCallback(() => {
    const my = ++id.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn().then((data) => my === id.current && setState({ data, loading: false, error: null }), (e) => my === id.current && setState({ data: null, loading: false, error: e.userMessage || e.message }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(() => { run(); }, [run]);
  return { ...state, reload: run };
}
