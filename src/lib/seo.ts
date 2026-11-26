import { useEffect } from 'react';

export interface PageMetaOptions {
  title: string;
  description?: string;
  image?: string;
  canonicalPath?: string;
  jsonLd?: Record<string, unknown>;
  enabled?: boolean;
}

const DEFAULT_DESCRIPTION =
  'A world of extraordinary moments, captured by nature photographers everywhere. Explore landscapes, wildlife, oceans, and astronomical photography.';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Updates document title, Open Graph / Twitter meta tags, canonical link, and optional JSON-LD per route.
 */
export function usePageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  canonicalPath,
  jsonLd,
  enabled = true,
}: PageMetaOptions) {
  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    if (image) {
      upsertMeta('property', 'og:image', image);
      upsertMeta('name', 'twitter:image', image);
    }

    if (canonicalPath && typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${canonicalPath}`;
      upsertMeta('property', 'og:url', fullUrl);
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = fullUrl;
    }

    const scriptId = 'nl-route-jsonld';
    const existingScript = document.getElementById(scriptId);
    if (jsonLd) {
      const script = existingScript || document.createElement('script');
      script.id = scriptId;
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(jsonLd);
      if (!existingScript) {
        document.head.appendChild(script);
      }
    } else if (existingScript) {
      existingScript.remove();
    }
  }, [enabled, title, description, image, canonicalPath, jsonLd]);
}
