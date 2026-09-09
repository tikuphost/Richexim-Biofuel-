import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  Share2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  ExternalLink,
  Image as ImageIcon,
  Copy,
  Layers,
  FileCode,
  Info,
  Check,
  Save,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageSEOMetadata } from '../../types';
import { DEFAULT_SEO_CONFIGS, getLiveDocumentSEOSnapshot } from '../../utils/seo';

// Curated high-res imagery for 1-click social card selection
const CURATED_SHARE_IMAGES = [
  {
    name: 'JNPT Deep-Water Port & Logistics',
    category: 'Logistics',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Torrefied Bio-Coal Pellets',
    category: 'Commodity',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Biomass Briquettes Manufacturing',
    category: 'Production',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Biomass Engineering & Research Desk',
    category: 'Intelligence',
    url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Industrial Combustion & Clean Energy',
    category: 'Energy',
    url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Ocean Cargo Vessel & Global Shipping',
    category: 'Maritime',
    url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Careers & Talent Operations Desk',
    category: 'Careers',
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Quality Assurance & Lab Assays',
    category: 'Assurance',
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80'
  }
];

export type SupportedRouteKey = 'home' | 'about' | 'product' | 'careers' | 'faq' | 'blog';

interface MetadataJsonState {
  name: string;
  description: string;
  requestFramePermissions?: string[];
  majorCapabilities?: string[];
  loadedAt?: string;
  source?: string;
}

export const SEOMetadataManagement: React.FC = () => {
  const {
    seoMetadata,
    updateSEOMetadata,
    resetSEOMetadata,
    currentPage,
    setCurrentPage
  } = useApp();

  // Route selector
  const [selectedRoute, setSelectedRoute] = useState<SupportedRouteKey>('home');

  // metadata.json fetched state
  const [metadataJson, setMetadataJson] = useState<MetadataJsonState | null>(null);
  const [isFetchingMetadataJson, setIsFetchingMetadataJson] = useState(false);
  const [metadataJsonError, setMetadataJsonError] = useState<string | null>(null);

  // Form data for the currently selected route
  const [formData, setFormData] = useState<PageSEOMetadata>(() => {
    return seoMetadata['home'] || DEFAULT_SEO_CONFIGS['home'];
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [socialPlatform, setSocialPlatform] = useState<'linkedin' | 'twitter' | 'whatsapp'>('linkedin');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [syncWithMetadataJson, setSyncWithMetadataJson] = useState(true);

  // Fetch metadata.json on component mount
  const fetchMetadataJson = async () => {
    setIsFetchingMetadataJson(true);
    setMetadataJsonError(null);
    try {
      // First attempt /api/metadata
      const res = await fetch('/api/metadata');
      if (res.ok) {
        const data = await res.json();
        setMetadataJson({
          ...data,
          loadedAt: new Date().toLocaleTimeString(),
          source: '/metadata.json'
        });
        return;
      }

      // Fallback attempt to root metadata.json directly
      const rawRes = await fetch('/metadata.json');
      if (rawRes.ok) {
        const rawData = await rawRes.json();
        setMetadataJson({
          ...rawData,
          loadedAt: new Date().toLocaleTimeString(),
          source: '/metadata.json'
        });
      } else {
        throw new Error(`Failed to load metadata.json: HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn('Could not fetch metadata.json:', err);
      setMetadataJsonError(err.message || 'Failed to fetch metadata.json');
      // Set sensible fallback state
      setMetadataJson({
        name: 'Richmount Exim',
        description: 'Enterprise export and supply chain portal for Richmount Exim (Richexim Group) specializing in industrial biomass, green fuels, and activated carbon with proforma RFQ calculator.',
        loadedAt: new Date().toLocaleTimeString(),
        source: 'local fallback'
      });
    } finally {
      setIsFetchingMetadataJson(false);
    }
  };

  useEffect(() => {
    fetchMetadataJson();
  }, []);

  // Sync form data when route changes or when global seoMetadata updates
  useEffect(() => {
    const config = seoMetadata[selectedRoute] || DEFAULT_SEO_CONFIGS[selectedRoute];
    setFormData({ ...config });
  }, [selectedRoute, seoMetadata]);

  const handleFieldChange = (field: keyof PageSEOMetadata, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto sync OG Title if page title was edited and OG wasn't custom-deviated
      if (field === 'title' && (!prev.ogTitle || prev.ogTitle === prev.title)) {
        updated.ogTitle = value;
      }
      // Auto sync OG Description if description was edited
      if (field === 'description' && (!prev.ogDescription || prev.ogDescription === prev.description)) {
        updated.ogDescription = value;
      }
      return updated;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveFeedback(null);
    try {
      // 1. Update database & AppContext SEO state for the route
      const success = await updateSEOMetadata(selectedRoute, formData);

      // 2. If editing 'home' route and sync is enabled, sync to metadata.json
      if (selectedRoute === 'home' && syncWithMetadataJson) {
        try {
          await fetch('/api/metadata', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.title.split('|')[0].trim() || formData.title,
              description: formData.description
            })
          });
          // Re-fetch metadata.json to show updated timestamp
          await fetchMetadataJson();
        } catch (mErr) {
          console.error('Error syncing to metadata.json:', mErr);
        }
      }

      if (success) {
        setSaveFeedback({
          type: 'success',
          message: `SEO metadata for route /${selectedRoute === 'home' ? '' : selectedRoute} successfully saved and deployed live!`
        });
      } else {
        setSaveFeedback({
          type: 'error',
          message: 'Saved locally, but backend sync encountered a delay.'
        });
      }
    } catch (err: any) {
      setSaveFeedback({
        type: 'error',
        message: `Failed to save metadata: ${err.message}`
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        setSaveFeedback(null);
      }, 5000);
    }
  };

  const handleReset = async () => {
    if (confirm(`Reset metadata for route '/${selectedRoute}' back to factory verified defaults?`)) {
      await resetSEOMetadata(selectedRoute);
      const resetConfig = DEFAULT_SEO_CONFIGS[selectedRoute];
      setFormData({ ...resetConfig });
      setSaveFeedback({
        type: 'success',
        message: `Route /${selectedRoute} restored to factory verified standards.`
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const routeOptions: { key: SupportedRouteKey; label: string; slug: string; desc: string }[] = [
    { key: 'home', label: 'Home Portal', slug: '/', desc: 'Main landing page & RFQ calculator' },
    { key: 'about', label: 'About Us', slug: '/about', desc: 'Group profile & certifications' },
    { key: 'product', label: 'Product Catalog', slug: '/products', desc: 'Biomass & carbon specifications' },
    { key: 'careers', label: 'Careers Desk', slug: '/careers', desc: 'Job openings & candidate portal' },
    { key: 'faq', label: 'Buyer FAQ', slug: '/faq', desc: 'International trade & logistics FAQ' },
    { key: 'blog', label: 'Intelligence Blog', slug: '/blog', desc: 'Whitepapers & market analyses' }
  ];

  return (
    <div className="space-y-6">
      {/* Header & metadata.json Status Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#e8f3e2] text-[#1b4d27] text-xs font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                SEO Metadata Management
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#2a6e3a] font-semibold bg-[#f0f7eb] px-2 py-0.5 rounded-md border border-[#cbe1c3]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                metadata.json Connected
              </span>
            </div>
            <h3 className="font-heading text-xl font-extrabold text-[#172e18] mt-1.5">
              Route-by-Route SEO &amp; Open Graph Architecture
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Synchronize search engine titles, meta descriptions, and Open Graph card imagery across all active portal routes.
            </p>
          </div>

          {/* metadata.json fetch control */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchMetadataJson}
              disabled={isFetchingMetadataJson}
              className="flex items-center gap-2 bg-[#f4f7ee] hover:bg-[#e8f3e2] text-[#1b4d27] text-xs font-bold px-3.5 py-2 rounded-xl border border-[#e3ede0] transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingMetadataJson ? 'animate-spin' : ''}`} />
              <span>{isFetchingMetadataJson ? 'Reading metadata.json...' : 'Refresh metadata.json'}</span>
            </button>
          </div>
        </div>

        {/* metadata.json Current Snapshot Card */}
        {metadataJson && (
          <div className="mt-4 p-4 bg-[#f9fbf7] rounded-2xl border border-[#e3ede0] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">metadata.json Application Name:</span>
                <strong className="text-[#172e18] font-bold">{metadataJson.name}</strong>
                {metadataJson.loadedAt && (
                  <span className="text-[10px] text-gray-400">
                    (Loaded at {metadataJson.loadedAt})
                  </span>
                )}
              </div>
              <p className="text-gray-600 line-clamp-1">
                <span className="text-gray-400 font-medium">Root Description: </span>
                {metadataJson.description}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600 font-mono">
                /metadata.json
              </span>
            </div>
          </div>
        )}

        {metadataJsonError && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{metadataJsonError} (Using cached defaults)</span>
          </div>
        )}
      </div>

      {/* Route Selector Tabs */}
      <div className="bg-white rounded-3xl p-4 border border-[#e3ede0] shadow-sm">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Select Portal Route to Configure:
          </span>
          <span className="text-xs text-[#2a6e3a] font-semibold">
            6 Routes Configurable
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {routeOptions.map((route) => {
            const isSelected = selectedRoute === route.key;
            return (
              <button
                key={route.key}
                type="button"
                onClick={() => setSelectedRoute(route.key)}
                className={`p-3 rounded-2xl text-left transition border cursor-pointer ${
                  isSelected
                    ? 'bg-[#1b4d27] text-white border-[#1b4d27] shadow-md ring-2 ring-[#f5b342]/40'
                    : 'bg-[#f9fbf7] hover:bg-[#f0f7eb] text-[#172e18] border-[#e3ede0]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{route.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-[#f5b342]' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {route.slug}
                  </span>
                </div>
                <p className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                  {route.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Metadata Editor Grid: Form & Live Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h4 className="font-heading text-lg font-bold text-[#1b4d27] flex items-center gap-2">
                <span>Route Metadata:</span>
                <span className="text-[#f5b342] font-mono font-extrabold">
                  /{selectedRoute === 'home' ? '' : selectedRoute}
                </span>
              </h4>
              <p className="text-xs text-gray-500">
                Update document title, description, and Open Graph image tags.
              </p>
            </div>

            {selectedRoute === 'home' && (
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none bg-[#f9fbf7] px-2.5 py-1.5 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  checked={syncWithMetadataJson}
                  onChange={(e) => setSyncWithMetadataJson(e.target.checked)}
                  className="rounded text-[#2a6e3a] focus:ring-[#2a6e3a]"
                />
                <span>Sync with metadata.json</span>
              </label>
            )}
          </div>

          {/* Feedback banner */}
          {saveFeedback && (
            <div
              className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
                saveFeedback.type === 'success'
                  ? 'bg-[#e8f3e2] text-[#1b4d27] border border-[#cbe1c3]'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {saveFeedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-[#2a6e3a] shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{saveFeedback.message}</span>
            </div>
          )}

          {/* Input 1: Page Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="seo-title-input" className="text-xs font-bold text-gray-700">
                Page Title (`&lt;title&gt;` &amp; `og:title`)
              </label>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  formData.title.length >= 50 && formData.title.length <= 65
                    ? 'bg-[#e8f3e2] text-[#1b4d27]'
                    : formData.title.length > 70
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {formData.title.length} / 60 chars (Optimal: 50–65)
              </span>
            </div>
            <input
              id="seo-title-input"
              type="text"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. Richmount Exim | Industrial Biomass & Biofuel Exporters"
              className="w-full bg-[#f9fbf7] text-sm text-[#172e18] px-3.5 py-2.5 rounded-xl border border-[#e3ede0] focus:outline-hidden focus:border-[#2a6e3a] focus:bg-white font-medium"
            />
            <p className="text-[11px] text-gray-400">
              Appears in browser tab, search engine listings, and social link previews.
            </p>
          </div>

          {/* Input 2: Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="seo-desc-input" className="text-xs font-bold text-gray-700">
                Meta Description (`&lt;meta name="description"&gt;` &amp; `og:description`)
              </label>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  formData.description.length >= 130 && formData.description.length <= 165
                    ? 'bg-[#e8f3e2] text-[#1b4d27]'
                    : formData.description.length > 175
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {formData.description.length} / 160 chars (Optimal: 130–160)
              </span>
            </div>
            <textarea
              id="seo-desc-input"
              rows={3}
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Provide a concise, commercial summary of the route content..."
              className="w-full bg-[#f9fbf7] text-xs text-[#172e18] px-3.5 py-2.5 rounded-xl border border-[#e3ede0] focus:outline-hidden focus:border-[#2a6e3a] focus:bg-white font-medium leading-relaxed"
            />
            <p className="text-[11px] text-gray-400">
              Displayed as search snippet in Google and description in social media cards.
            </p>
          </div>

          {/* Input 3: OG Image URL & Image Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="seo-ogimage-input" className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#2a6e3a]" />
                <span>Open Graph Image URL (`og:image`)</span>
              </label>
              <span className="text-[10px] text-gray-400">Recommended: 1200 × 630 px</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="seo-ogimage-input"
                type="url"
                value={formData.ogImage}
                onChange={(e) => handleFieldChange('ogImage', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 bg-[#f9fbf7] text-xs text-[#172e18] px-3.5 py-2.5 rounded-xl border border-[#e3ede0] focus:outline-hidden focus:border-[#2a6e3a] focus:bg-white font-mono"
              />
              {formData.ogImage && (
                <a
                  href={formData.ogImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition"
                  title="Open image in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Quick 1-Click Curated Image Selection Gallery */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-gray-500">
                Or select from Curated Trade &amp; Biomass Image Library:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CURATED_SHARE_IMAGES.map((img, i) => {
                  const isCurrent = formData.ogImage === img.url;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleFieldChange('ogImage', img.url)}
                      className={`group relative overflow-hidden rounded-xl border text-left p-1.5 transition cursor-pointer ${
                        isCurrent
                          ? 'border-[#2a6e3a] bg-[#e8f3e2] ring-2 ring-[#2a6e3a]/30'
                          : 'border-gray-200 bg-[#f9fbf7] hover:border-gray-300'
                      }`}
                    >
                      <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100 relative mb-1.5">
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        {isCurrent && (
                          <div className="absolute top-1 right-1 bg-[#2a6e3a] text-white p-0.5 rounded-full">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-[#172e18] truncate">{img.name}</p>
                      <span className="text-[9px] text-gray-400 uppercase font-medium">{img.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Canonical URL & Keywords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div className="space-y-1">
              <label htmlFor="seo-canonical-input" className="text-xs font-bold text-gray-700">
                Canonical URL
              </label>
              <input
                id="seo-canonical-input"
                type="text"
                value={formData.canonicalUrl || ''}
                onChange={(e) => handleFieldChange('canonicalUrl', e.target.value)}
                placeholder="https://www.richmount-exim.com/..."
                className="w-full bg-[#f9fbf7] text-xs text-[#172e18] px-3 py-2 rounded-xl border border-[#e3ede0] font-mono text-[11px]"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="seo-keywords-input" className="text-xs font-bold text-gray-700">
                Keywords (Comma Separated)
              </label>
              <input
                id="seo-keywords-input"
                type="text"
                value={formData.keywords || ''}
                onChange={(e) => handleFieldChange('keywords', e.target.value)}
                placeholder="biomass, pellets, export..."
                className="w-full bg-[#f9fbf7] text-xs text-[#172e18] px-3 py-2 rounded-xl border border-[#e3ede0] text-[11px]"
              />
            </div>
          </div>

          {/* Actions: Save & Reset */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs text-gray-500 hover:text-gray-800 font-semibold px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Route to Defaults</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2a6e3a] hover:bg-[#1b4d27] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#f5b342]" />
              ) : (
                <Save className="w-4 h-4 text-[#f5b342]" />
              )}
              <span>{isSaving ? 'Saving & Deploying...' : 'Save & Deploy Route Metadata'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Real-Time Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Google Search Snippet Preview */}
          <div className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#1b4d27] uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#2a6e3a]" />
                <span>Google SERP Preview</span>
              </span>
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-mono">
                Desktop / Mobile Snippet
              </span>
            </div>

            <div className="bg-[#fcfdfa] p-4 rounded-2xl border border-gray-200 font-sans space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-[#202124]">
                <div className="w-4 h-4 rounded-full bg-[#2a6e3a] flex items-center justify-center text-[9px] text-white font-bold">
                  R
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] text-[#202124] font-medium">Richmount Exim</span>
                  <span className="text-[10px] text-[#5f6368] truncate max-w-xs">
                    {formData.canonicalUrl || `https://www.richmount-exim.com/${selectedRoute === 'home' ? '' : selectedRoute}`}
                  </span>
                </div>
              </div>

              <h5 className="text-[#1a0dab] hover:underline font-normal text-base leading-snug line-clamp-1 cursor-pointer">
                {formData.title || 'Richmount Exim | Industrial Biomass & Biofuel Exporters'}
              </h5>

              <p className="text-[#4d5156] text-xs leading-relaxed line-clamp-2">
                {formData.description || 'Global supplier of high-calorific industrial biomass briquettes, torrefied pellets, and coconut shell carbon.'}
              </p>
            </div>
          </div>

          {/* Live Social Media Share Card Preview */}
          <div className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#1b4d27] uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#2a6e3a]" />
                <span>Social Open Graph Card</span>
              </span>

              {/* Platform Selector Tabs */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setSocialPlatform('linkedin')}
                  className={`px-2 py-1 rounded-lg transition ${
                    socialPlatform === 'linkedin' ? 'bg-white text-[#1b4d27] shadow-xs' : 'text-gray-500'
                  }`}
                >
                  LinkedIn
                </button>
                <button
                  type="button"
                  onClick={() => setSocialPlatform('twitter')}
                  className={`px-2 py-1 rounded-lg transition ${
                    socialPlatform === 'twitter' ? 'bg-white text-[#1b4d27] shadow-xs' : 'text-gray-500'
                  }`}
                >
                  X / Twitter
                </button>
                <button
                  type="button"
                  onClick={() => setSocialPlatform('whatsapp')}
                  className={`px-2 py-1 rounded-lg transition ${
                    socialPlatform === 'whatsapp' ? 'bg-white text-[#1b4d27] shadow-xs' : 'text-gray-500'
                  }`}
                >
                  WhatsApp
                </button>
              </div>
            </div>

            {/* Social Card Preview Container */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              {/* Card Image */}
              <div className="aspect-video w-full bg-gray-100 relative overflow-hidden">
                {formData.ogImage ? (
                  <img
                    src={formData.ogImage}
                    alt={formData.ogTitle || formData.title}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                    <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                    <span>No OG Image Configured</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded">
                  og:image
                </div>
              </div>

              {/* Card Text Content */}
              <div className="p-3.5 bg-[#fbfcf9] border-t border-gray-100 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
                  richmount-exim.com
                </span>
                <h6 className="font-bold text-xs text-[#172e18] line-clamp-1 leading-snug">
                  {formData.ogTitle || formData.title}
                </h6>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                  {formData.ogDescription || formData.description}
                </p>
              </div>
            </div>

            {/* Live Document Head Status Card */}
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>Active Page in Browser:</span>
                <span className="font-mono font-bold text-[#1b4d27]">/{currentPage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Live Browser Tab Title:</span>
                <span className="font-bold text-[#172e18] truncate max-w-[200px]" title={document.title}>
                  {document.title}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
