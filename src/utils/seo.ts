import { PageSEOMetadata, SEOMetadataMap } from '../types';

export const DEFAULT_SEO_CONFIGS: SEOMetadataMap = {
  about: {
    pageKey: 'about',
    pageName: 'About Us',
    title: 'About Us | Richmount Metallic & Allied Exporters - Richexim Group',
    description: 'Discover Richmount Exim, premier export subsidiary of Richexim Group since 1994. Global suppliers of high-calorific industrial biomass briquettes, torrefied pellets, and coconut shell carbon.',
    keywords: 'biomass exporter India, Richexim Group subsidiary, industrial biofuel exporter, torrefied bio-coal, coconut shell charcoal, ISO 9001 certified exporter',
    ogTitle: 'About Us - Richmount Metallic & Allied Exporters (Richexim Group)',
    ogDescription: 'Trusted supplier of industrial biomass solid fuels to 28+ countries with ISO 9001:2015 accreditation, deep-water port processing, and ASTM/SGS certified quality.',
    ogImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://www.richmount-exim.com/about',
    updatedAt: new Date().toISOString()
  },
  blog: {
    pageKey: 'blog',
    pageName: 'Industry Intelligence & Blog',
    title: 'Biomass & Carbon Intelligence Whitepapers | Richmount Exim',
    description: 'Read authoritative engineering whitepapers on EU CBAM 2026 directives, boiler slagging mitigation chemistry, ocean freight hedging, and GCV vs NCV calorific trade economics.',
    keywords: 'biomass trade blog, EU CBAM compliance, industrial boiler slagging, agro-biomass briquettes, CIF FOB maritime logistics, bio-coal research',
    ogTitle: 'Biomass Fuels, Carbon Tariffs & Global Trade Whitepapers | Richmount',
    ogDescription: 'Technical combustion analyses, regulatory forecasts (CBAM & EUDR), ocean logistics benchmarks, and commodity pricing intelligence by Richexim trade engineering.',
    ogImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://www.richmount-exim.com/blog',
    updatedAt: new Date().toISOString()
  },
  product: {
    pageKey: 'product',
    pageName: 'Export Commodity Catalog',
    title: 'Export Commodity Catalog & Technical Specifications | Richmount Exim',
    description: 'Explore high-density industrial biomass briquettes, torrefied bio-coal pellets (7,500+ kcal/kg), and metallurgical coconut shell charcoal. Direct bulk export from JNPT Mumbai.',
    keywords: 'sawdust briquettes 90mm, groundnut shell briquettes, torrefied wood pellets, coconut charcoal lumps, mustard husk biomass, industrial solid fuel export',
    ogTitle: 'Export Commodity Catalog & Technical Specifications | Richmount Exim',
    ogDescription: 'Engineered high-calorific solid fuels with proximate analysis, SGS inspection reports, moisture < 8%, and flexible FCL container packaging.',
    ogImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://www.richmount-exim.com/products',
    updatedAt: new Date().toISOString()
  },
  home: {
    pageKey: 'home',
    pageName: 'Home Page',
    title: 'Richmount Metallic & Allied Exporters | Global Industrial Biomass Solutions',
    description: 'Leading Indian exporter of densified agro-biomass briquettes, torrefied pellets, and carbonized coconut charcoal. Certified for EU CBAM compliance and ASTM standards.',
    keywords: 'industrial biomass exporters, bio-coal briquettes, coconut shell charcoal, Richexim Group, CIF Rotterdam biomass, JNPT Mumbai export',
    ogTitle: 'Richmount Metallic & Allied Exporters - Renewable Energy & Solid Fuels',
    ogDescription: 'Supplying high-efficiency biomass solid fuels to thermal power plants, cement kilns, and foundries across Europe, Middle East, and Asia.',
    ogImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://www.richmount-exim.com/',
    updatedAt: new Date().toISOString()
  },
  careers: {
    pageKey: 'careers',
    pageName: 'Careers & Opportunities',
    title: 'Careers & Global Trade Opportunities | Richmount Exim - Richexim Group',
    description: 'Explore career openings in international commodity merchandising, maritime logistics, and biomass combustion engineering at Richmount Exim.',
    keywords: 'biomass export jobs, commodity trader careers, maritime logistics jobs, renewable energy careers, Richexim careers',
    ogTitle: 'Careers at Richmount Exim - Fueling the Global Energy Transition',
    ogDescription: 'Join our international trade and engineering desks in Mumbai and Cochin. Competitive packages, international trade exposure, and high impact.',
    ogImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://www.richmount-exim.com/careers',
    updatedAt: new Date().toISOString()
  },
  faq: {
    pageKey: 'faq',
    pageName: 'Frequently Asked Questions',
    title: 'Frequently Asked Questions (FAQ) | Richmount Exim International Trade',
    description: 'Comprehensive answers to international buyer questions regarding Incoterms 2020 (CIF/FOB), minimum order quantities, ASTM COA inspection certifications, and payment instruments.',
    keywords: 'biomass trade FAQ, Incoterms CIF FOB Nhava Sheva, export MOQ biomass, SGS inspection certificate, letter of credit payment terms',
    ogTitle: 'Export Trade FAQ - Richmount Exim Global Operations',
    ogDescription: 'Clear guidance on ocean shipping schedules, container stuffing limits, ash fusion analysis, and letter of credit trade finance protocols.',
    ogImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    twitterCard: 'summary_large_image',
    canonicalUrl: 'https://www.richmount-exim.com/faq',
    updatedAt: new Date().toISOString()
  }
};

/**
 * Dynamically applies SEO metadata to the browser's document head.
 * Synchronizes title, meta descriptions, Open Graph, Twitter cards, and canonical links.
 */
export function applyDocumentSEO(seo: PageSEOMetadata): void {
  if (typeof document === 'undefined') return;

  // 1. Document Title
  if (seo.title) {
    document.title = seo.title;
  }

  // Helper to update or append a meta element
  const setMeta = (attributeName: 'name' | 'property', attrValue: string, content: string) => {
    if (!content && content !== '') return;
    let el = document.querySelector(`meta[${attributeName}="${attrValue}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attributeName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 2. Standard Search Engine Meta Tags
  if (seo.description) {
    setMeta('name', 'description', seo.description);
  }
  if (seo.keywords) {
    setMeta('name', 'keywords', seo.keywords);
  }

  // 3. Open Graph (Facebook, LinkedIn, Slack, WhatsApp)
  setMeta('property', 'og:title', seo.ogTitle || seo.title);
  setMeta('property', 'og:description', seo.ogDescription || seo.description);
  setMeta('property', 'og:type', 'website');
  if (seo.ogImage) {
    setMeta('property', 'og:image', seo.ogImage);
  }
  if (seo.canonicalUrl) {
    setMeta('property', 'og:url', seo.canonicalUrl);
  }

  // 4. Twitter / X Cards
  setMeta('name', 'twitter:card', seo.twitterCard || 'summary_large_image');
  setMeta('name', 'twitter:title', seo.ogTitle || seo.title);
  setMeta('name', 'twitter:description', seo.ogDescription || seo.description);
  if (seo.ogImage) {
    setMeta('name', 'twitter:image', seo.ogImage);
  }

  // 5. Canonical Link
  if (seo.canonicalUrl) {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', seo.canonicalUrl);
  }
}

/**
 * Returns current snapshot of relevant meta tags from the live DOM for inspection.
 */
export function getLiveDocumentSEOSnapshot() {
  if (typeof document === 'undefined') return null;

  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '(not set)',
    keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '(not set)',
    ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '(not set)',
    ogDescription: document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '(not set)',
    ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '(not set)',
    twitterCard: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '(not set)',
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '(not set)'
  };
}
