import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// Per-page meta tags + JSON-LD. Removes the server-injected duplicates once React takes over.
export default function SEO({ title, description, image, path, type = 'website', schema = [], noindex = false }) {
  useEffect(() => { document.querySelectorAll('[data-server-seo]').forEach((n) => n.remove()); }, []);
  const origin = window.location.origin;
  const url = origin + (path ?? window.location.pathname);
  const img = image ? (image.startsWith('http') ? image : origin + image) : `${origin}/og-image.png`;
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {schema.map((s, i) => <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>)}
    </Helmet>
  );
}
export const breadcrumb = (items) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: window.location.origin + it.path })) });
