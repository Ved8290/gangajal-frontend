import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO, { breadcrumb } from '../components/common/SEO';
import ProductCard from '../components/product/ProductCard';
import { Skeleton, EmptyState, ErrorBox } from '../components/common/Bits';
import useAsync from '../hooks/useAsync';
import useDebounce from '../hooks/useDebounce';
import { getProducts } from '../services/shopService';

const CATS = ['gangajal', 'trambakeshwar', 'kumbh', 'gift'];
export default function Products() {
  const { t } = useTranslation();
  const [sp, setSp] = useSearchParams();
  const [search, setSearch] = useState(sp.get('search') || '');
  const debounced = useDebounce(search);
  const category = sp.get('category') || '';
  const sort = sp.get('sort') || 'newest';
  const minPrice = sp.get('minPrice') || '';
  const maxPrice = sp.get('maxPrice') || '';
  const page = Number(sp.get('page')) || 1;

  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); if (k !== 'page') n.delete('page'); setSp(n, { replace: true }); };
  useEffect(() => { if (debounced !== (sp.get('search') || '')) set('search', debounced); /* eslint-disable-next-line */ }, [debounced]);

  const { data, loading, error, reload } = useAsync(() => getProducts({ search: debounced, category, sort, minPrice, maxPrice, page, limit: 12 }), [debounced, category, sort, minPrice, maxPrice, page]);
  const clear = () => { setSearch(''); setSp({}); };

  return (
    <div className="container section">
      <SEO title={t('seo.productsTitle')} description={t('seo.productsDesc')} path="/products" schema={[breadcrumb([{ name: t('nav.home'), path: '/' }, { name: t('nav.products'), path: '/products' }])]} />
      <h1>{t('shop.title')}</h1>
      <p className="muted">{t('shop.subtitle')}</p>
      <div className="filters">
        <input type="search" placeholder={t('common.search')} value={search} onChange={(e) => setSearch(e.target.value)} aria-label={t('common.search')} />
        <select value={category} onChange={(e) => set('category', e.target.value)} aria-label={t('shop.category')}>
          <option value="">{t('common.all')}</option>
          {CATS.map((c) => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
        </select>
        <input type="number" min="0" placeholder={t('shop.min')} value={minPrice} onChange={(e) => set('minPrice', e.target.value)} />
        <input type="number" min="0" placeholder={t('shop.max')} value={maxPrice} onChange={(e) => set('maxPrice', e.target.value)} />
        <select value={sort} onChange={(e) => set('sort', e.target.value)} aria-label={t('shop.sort')}>
          <option value="newest">{t('shop.sortNew')}</option><option value="price_asc">{t('shop.sortLow')}</option><option value="price_desc">{t('shop.sortHigh')}</option>
        </select>
      </div>
      {loading ? <Skeleton count={8} /> : error ? <ErrorBox message={error} onRetry={reload} retryLabel={t('common.retry')} /> : data.items.length === 0 ? (
        <div><EmptyState icon="🔍" title={t('shop.noResults')} text={t('shop.noResultsText')} /><div className="center"><button className="btn btn-outline" onClick={clear}>{t('shop.clear')}</button></div></div>
      ) : (
        <>
          <div className="grid">{data.items.map((p) => <ProductCard key={p._id} product={p} />)}</div>
          {data.pages > 1 && (
            <div className="pager">
              <button className="btn btn-outline" disabled={page <= 1} onClick={() => set('page', String(page - 1))}>{t('shop.prev')}</button>
              <span>{page} / {data.pages}</span>
              <button className="btn btn-outline" disabled={page >= data.pages} onClick={() => set('page', String(page + 1))}>{t('shop.next')}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
