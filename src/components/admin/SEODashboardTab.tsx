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
  Link as LinkIcon,
  Layers,
  FileText,
  Info,
  Check,
  Code
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
  }
];

export const SEODashboardTab: React.FC = () => {
  const {
    seoMetadata,
    updateSEOMetadata,
    resetSEOMetadata,
    currentPage,
    setCurrentPage
  } = useApp();

  const [selectedPageKey, setSelectedPageKey] = useState<'about' | 'blog' | 'product' | 'home' | 'careers' | 'faq'>('about');
  const [formData, setFormData] = useState<PageSEOMetadata>(() => {
    return seoMetadata['about'] || DEFAULT_SEO_CONFIGS['about'];
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [socialPlatform, setSocialPlatform] = useState<'linkedin' | 'twitter' | 'whatsapp'>('linkedin');
  const [isCustomOg, setIsCustomOg] = useState(false);
  const [showLiveInspector, setShowLiveInspector] = useState(false);
  const [liveSnapshot, setLiveSnapshot] = useState<any>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Sync form data when switching page tabs or when seoMetadata updates
  useEffect(() => {
    const data = seoMetadata[selectedPageKey] || DEFAULT_SEO_CONFIGS[selectedPageKey];
    setFormData({ ...data });
    setIsCustomOg(Boolean(data.ogTitle && data.ogTitle !== data.title));
  }, [selectedPageKey, seoMetadata]);

  // Keep live snapshot updated
  const refreshSnapshot = () => {
    setLiveSnapshot(getLiveDocumentSEOSnapshot());
  };

  const handleInputChange = (field: keyof PageSEOMetadata, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    const payload: Partial<PageSEOMetadata> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      keywords: formData.keywords.trim(),
      ogTitle: isCustomOg ? formData.ogTitle.trim() : formData.title.trim(),
      ogDescription: isCustomOg ? formData.ogDescription.trim() : formData.description.trim(),
      ogImage: formData.ogImage.trim(),
      twitterCard: formData.twitterCard || 'summary_large_image',
      canonicalUrl: formData.canonicalUrl.trim()
    };

    const success = await updateSEOMetadata(selectedPageKey, payload);

    setIsSaving(false);
    if (success) {
      setSaveMessage({
        type: 'success',
        text: `Live SEO metadata for "${formData.pageName}" updated and synchronized across document head & SQLite storage.`
      });
      refreshSnapshot();
      setTimeout(() => setSaveMessage(null), 4000);
    } else {
      setSaveMessage({
        type: 'error',
        text: 'Failed to update metadata. Please check network connection.'
      });
    }
  };

  const handleResetToDefault = async () => {
    if (window.confirm(`Reset SEO metadata for ${formData.pageName} to default recommended settings?`)) {
      setIsSaving(true);
      await resetSEOMetadata(selectedPageKey);
      const def = DEFAULT_SEO_CONFIGS[selectedPageKey];
      setFormData({ ...def });
      setIsSaving(false);
      setSaveMessage({
        type: 'success',
        text: `Reset ${formData.pageName} metadata to default factory specifications.`
      });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // AI-inspired SEO Keyword Enrichment Assistant
  const handleOptimizeKeywords = () => {
    let additions = '';
    if (selectedPageKey === 'about') {
      additions = ', Richexim subsidiary, export trade credentials, ISO 9001:2015 biomass, bulk container chartering, JNPT FOB suppliers';
    } else if (selectedPageKey === 'blog') {
      additions = ', EU CBAM carbon tariffs, boiler clinker prevention, biomass ocean freight hedging, GCV calorific economics, agro-pellet whitepapers';
    } else if (selectedPageKey === 'product') {
      additions = ', ASTM D5865 calorific testing, moisture < 8%, 90mm sawdust briquettes, torrefied bio-coal, coconut shell charcoal lumps';
    } else {
      additions = ', renewable energy exporters India, commercial biomass supply contracts, CIF Rotterdam, Nhava Sheva origin';
    }

    const currentKw = formData.keywords || '';
    if (!currentKw.includes('EU CBAM') && !currentKw.includes('ISO 9001')) {
      handleInputChange('keywords', currentKw + additions);
      setSaveMessage({
        type: 'success',
        text: 'Enriched keywords with high-intent industrial export search terms.'
      });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const copyLiveTitle = () => {
    navigator.clipboard.writeText(formData.title);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Character counter calculations
  const titleLen = formData.title.length;
  const descLen = formData.description.length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e3ede0] shadow-sm">
      {/* Tab Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#e3ede0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#e8f3e2] text-[#1b4d27] text-[11px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#2a6e3a]" />
              SEO &amp; Open Graph Management
            </span>
            <span className="text-xs text-gray-500">Live Document Head Sync</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#172e18] mt-1">
            Centralized Search Engine &amp; Social Metadata Console
          </h2>
          <p className="text-xs text-gray-600 mt-1 max-w-2xl">
            Dynamically update browser document titles, meta search descriptions, and Open Graph social share image cards for the About, Blog, and Product pages. All modifications instantly update the active DOM and persist to the SQLite database.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              refreshSnapshot();
              setShowLiveInspector(true);
            }}
            className="flex items-center gap-2 bg-[#f4f7ee] hover:bg-[#e4eee0] text-[#1b4d27] border border-[#d8e6d3] text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <Code className="w-4 h-4 text-[#2a6e3a]" />
            <span>Inspect Live DOM Head</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={isSaving}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#c43a3a] border border-gray-200 hover:border-red-200 px-3 py-2 rounded-xl transition cursor-pointer"
            title="Reset current page to factory presets"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Save Message Notification */}
      {saveMessage && (
        <div
          className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 text-xs font-medium transition ${
            saveMessage.type === 'success'
              ? 'bg-[#edf7ed] text-[#1e4620] border-[#c7e5c9]'
              : 'bg-[#fdf2f2] text-[#9b1c1c] border-[#f8b4b4]'
          }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#2e7d32] shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#c43a3a] shrink-0" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Page Selector Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { key: 'about', label: 'About Us Page', badge: 'Company & Group' },
          { key: 'blog', label: 'Industry Blog Page', badge: 'Whitepapers' },
          { key: 'careers', label: 'Careers Page', badge: 'Talent & Jobs' },
          { key: 'faq', label: 'FAQ Page', badge: 'Knowledge Base' },
          { key: 'product', label: 'Product Catalog', badge: 'Specifications' },
          { key: 'home', label: 'Home Page', badge: 'Main Portal' }
        ].map((p) => {
          const isSelected = selectedPageKey === p.key;
          const isCurrentlyActiveInApp =
            currentPage === p.key || (p.key === 'product' && currentPage === 'products');
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setSelectedPageKey(p.key as any)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer whitespace-nowrap border ${
                isSelected
                  ? 'bg-[#1b4d27] text-white border-[#1b4d27] shadow-sm'
                  : 'bg-[#f8faf6] text-gray-700 hover:bg-[#ebf3e8] border-[#e0ebd9]'
              }`}
            >
              <span>{p.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                {p.badge}
              </span>
              {isCurrentlyActiveInApp && (
                <span
                  className="w-2 h-2 rounded-full bg-[#f5b342]"
                  title="Currently active in user viewport"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Form Controls (Left) + Real-Time Previews (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Document Title */}
          <div className="bg-[#fcfdfa] p-5 rounded-2xl border border-[#e3ede0]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold text-[#172e18] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#2a6e3a]" />
                Document Title (&lt;title&gt;)
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    titleLen >= 45 && titleLen <= 65
                      ? 'bg-emerald-100 text-emerald-800'
                      : titleLen > 65
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {titleLen} / 60 chars
                </span>
              </div>
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter comprehensive, keyword-focused title..."
              className="w-full bg-white text-xs text-[#172e18] p-3 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a] focus:ring-1 focus:ring-[#2a6e3a]"
            />
            <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2">
              <span>Google SERP optimal: 50 – 60 characters.</span>
              <button
                type="button"
                onClick={copyLiveTitle}
                className="text-[#2a6e3a] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedUrl ? 'Copied' : 'Copy Title'}</span>
              </button>
            </div>
          </div>

          {/* Meta Description */}
          <div className="bg-[#fcfdfa] p-5 rounded-2xl border border-[#e3ede0]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold text-[#172e18] flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#2a6e3a]" />
                Meta Search Description (&lt;meta name="description"&gt;)
              </label>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  descLen >= 120 && descLen <= 160
                    ? 'bg-emerald-100 text-emerald-800'
                    : descLen > 160
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {descLen} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Summarize page content for Google snippets and social preview cards..."
              className="w-full bg-white text-xs text-[#172e18] p-3 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a] focus:ring-1 focus:ring-[#2a6e3a]"
            />
            <p className="text-[11px] text-gray-500 mt-1.5">
              Include primary target keywords, calorific/specification highlights, and a commercial call to action.
            </p>
          </div>

          {/* Social Share Image URL & Quick Gallery */}
          <div className="bg-[#fcfdfa] p-5 rounded-2xl border border-[#e3ede0]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold text-[#172e18] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#2a6e3a]" />
                Social Share Image URL (og:image &amp; twitter:image)
              </label>
              <span className="text-[11px] text-gray-500 font-medium">Recommended: 1200 × 630 px</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.ogImage}
                onChange={(e) => handleInputChange('ogImage', e.target.value)}
                placeholder="https://images.unsplash.com/... or custom CDN image URL"
                className="flex-1 bg-white text-xs text-[#172e18] p-3 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
              />
            </div>

            {/* Quick 1-Click Curated Presets */}
            <div className="mt-4">
              <div className="text-[11px] font-bold text-gray-700 mb-2 flex items-center justify-between">
                <span>1-Click Curated Commercial Presets:</span>
                <span className="text-[10px] text-gray-400 font-normal">Click to apply image</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CURATED_SHARE_IMAGES.map((img) => (
                  <button
                    key={img.name}
                    type="button"
                    onClick={() => handleInputChange('ogImage', img.url)}
                    className={`text-left p-2 rounded-xl border transition cursor-pointer flex flex-col gap-1.5 group ${
                      formData.ogImage === img.url
                        ? 'border-[#2a6e3a] bg-[#f0f7eb] ring-2 ring-[#2a6e3a]/20'
                        : 'border-gray-200 bg-white hover:border-[#2a6e3a]/40 hover:bg-[#fcfdfa]'
                    }`}
                  >
                    <div className="h-16 w-full rounded-lg overflow-hidden bg-gray-100 relative">
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 text-[9px] bg-black/60 text-white px-1.5 py-0.5 rounded-sm">
                        {img.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-gray-800 line-clamp-1">
                      {img.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Target Meta Keywords */}
          <div className="bg-[#fcfdfa] p-5 rounded-2xl border border-[#e3ede0]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold text-[#172e18] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#2a6e3a]" />
                Target Meta Keywords (Comma Separated)
              </label>
              <button
                type="button"
                onClick={handleOptimizeKeywords}
                className="text-[11px] font-bold text-[#2a6e3a] hover:text-[#1b4d27] flex items-center gap-1 bg-[#e8f3e2] px-2.5 py-1 rounded-lg cursor-pointer transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enrich with Biomass Keywords</span>
              </button>
            </div>
            <textarea
              rows={2}
              value={formData.keywords}
              onChange={(e) => handleInputChange('keywords', e.target.value)}
              placeholder="e.g. biomass exporter India, torrefied pellets, bio-coal briquettes..."
              className="w-full bg-white text-xs text-[#172e18] p-3 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
            />
            {/* Keyword chips */}
            {formData.keywords && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {formData.keywords
                  .split(',')
                  .map((k) => k.trim())
                  .filter(Boolean)
                  .map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs"
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Social Graph Overrides & Canonical URL */}
          <div className="bg-[#fcfdfa] p-5 rounded-2xl border border-[#e3ede0] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#172e18]">Open Graph &amp; Twitter Card Overrides</h4>
                <p className="text-[11px] text-gray-500">Fine-tune social card appearance independently from search title</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomOg(!isCustomOg)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                  isCustomOg
                    ? 'bg-[#1b4d27] text-white border-[#1b4d27]'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {isCustomOg ? 'Custom Social Copy: ON' : 'Mirroring Document Title'}
              </button>
            </div>

            {isCustomOg && (
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <div>
                  <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
                    Custom Open Graph Title (og:title)
                  </label>
                  <input
                    type="text"
                    value={formData.ogTitle}
                    onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                    className="w-full bg-white text-xs text-[#172e18] p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-700 mb-1 block">
                    Custom Open Graph Description (og:description)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.ogDescription}
                    onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                    className="w-full bg-white text-xs text-[#172e18] p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-gray-700 mb-1 block flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                  Canonical URL (&lt;link rel="canonical"&gt;)
                </label>
                <input
                  type="text"
                  value={formData.canonicalUrl}
                  onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                  className="w-full bg-white text-xs text-[#172e18] p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-700 mb-1 block flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-gray-400" />
                  Twitter Card Format
                </label>
                <select
                  value={formData.twitterCard}
                  onChange={(e) => handleInputChange('twitterCard', e.target.value as any)}
                  className="w-full bg-white text-xs text-[#172e18] p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                >
                  <option value="summary_large_image">summary_large_image (16:9 Hero Banner)</option>
                  <option value="summary">summary (Compact Square Card)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-[#1b4d27] hover:bg-[#246734] text-white text-xs font-extrabold px-6 py-3.5 rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#f5b342]" />
                  <span>Synchronizing Live DOM &amp; Storage...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#f5b342]" />
                  <span>Publish &amp; Update Live {formData.pageName} Metadata</span>
                </>
              )}
            </button>

            {/* Switch to page button */}
            <button
              type="button"
              onClick={() => {
                if (selectedPageKey === 'about') setCurrentPage('about');
                else if (selectedPageKey === 'blog') setCurrentPage('blog');
                else if (selectedPageKey === 'product') setCurrentPage('home');
                else setCurrentPage('home');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-gray-700 hover:bg-[#f4f7ee] border border-gray-300 text-xs font-bold px-4 py-3.5 rounded-xl transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#2a6e3a]" />
              <span>Preview Live Page in Viewport</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Real-Time SERP & Social Previews */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live SERP Snippet Preview */}
          <div className="bg-[#fcfdfa] p-5 rounded-2xl border border-[#e3ede0]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#172e18]">
                <Globe className="w-4 h-4 text-[#2a6e3a]" />
                <span>Google SERP Preview</span>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-md border border-blue-200">
                Desktop &amp; Mobile
              </span>
            </div>

            {/* Google Search Card Mockup */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs font-sans">
              <div className="flex items-center gap-2 mb-1 text-[12px] text-[#202124]">
                <div className="w-4 h-4 rounded-full bg-[#1b4d27] flex items-center justify-center text-white text-[9px] font-bold">
                  R
                </div>
                <div className="truncate">
                  <span className="text-[#202124] font-medium">Richmount Exim</span>
                  <span className="text-gray-400 mx-1">•</span>
                  <span className="text-gray-500 text-[11px] truncate">
                    {formData.canonicalUrl || `https://www.richmount-exim.com/${selectedPageKey}`}
                  </span>
                </div>
              </div>

              <h3 className="text-[#1a0dab] hover:underline text-[16px] leading-snug font-normal cursor-pointer line-clamp-2 mt-0.5">
                {formData.title || 'Page Document Title'}
              </h3>

              <p className="text-[#4d5156] text-[13px] leading-relaxed line-clamp-3 mt-1">
                {formData.description || 'Page meta description snippet will appear here...'}
              </p>

              {/* Sitelinks Simulation */}
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-[#1a0dab]">
                <span className="hover:underline cursor-pointer">Technical Specifications</span>
                <span className="hover:underline cursor-pointer">Incoterm CIF Port Pricing</span>
                <span className="hover:underline cursor-pointer">EU CBAM Compliance</span>
                <span className="hover:underline cursor-pointer">Request Lab Samples</span>
              </div>
            </div>
          </div>

          {/* Social Graph Card Preview */}
          <div className="bg-[#fcfdfa] p-5 rounded-2xl border border-[#e3ede0]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#172e18]">
                <Share2 className="w-4 h-4 text-[#2a6e3a]" />
                <span>Social Share Card Preview</span>
              </div>
              {/* Platform Switcher */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-gray-200">
                {(['linkedin', 'twitter', 'whatsapp'] as const).map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setSocialPlatform(plat)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition cursor-pointer capitalize ${
                      socialPlatform === plat
                        ? 'bg-[#1b4d27] text-white'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
            </div>

            {/* Social Card Mockup */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              {/* Image Banner */}
              <div className="w-full h-44 bg-gray-100 relative overflow-hidden">
                {formData.ogImage ? (
                  <img
                    src={formData.ogImage}
                    alt="Social Card Banner"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    <span className="text-xs">No Social Image Configured</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {formData.twitterCard || 'summary_large_image'}
                </div>
              </div>

              {/* Text Body */}
              <div className="p-4 bg-[#fbfdfa]">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  RICHMOUNT-EXIM.COM • {selectedPageKey.toUpperCase()}
                </div>
                <h4 className="font-heading text-sm font-bold text-[#172e18] leading-tight line-clamp-2">
                  {isCustomOg ? (formData.ogTitle || formData.title) : formData.title}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2 mt-1.5 leading-normal">
                  {isCustomOg
                    ? (formData.ogDescription || formData.description)
                    : formData.description}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
              <span>Verified for LinkedIn, Facebook, WhatsApp &amp; Slack sharing</span>
              <span className="text-emerald-700 font-medium">Ratio: 1.91 : 1</span>
            </div>
          </div>

          {/* Quick Technical Specs Summary */}
          <div className="bg-[#f0f7eb] p-4 rounded-2xl border border-[#cbe1c3] text-xs">
            <h4 className="font-bold text-[#1b4d27] mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#2a6e3a]" />
              Search &amp; Social Engine Directives
            </h4>
            <ul className="space-y-1.5 text-gray-700 text-[11px]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2a6e3a]" />
                <span>Open Graph schema: <code className="text-xs text-[#1b4d27] font-semibold">og:title, og:description, og:image</code></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2a6e3a]" />
                <span>Twitter Player &amp; Card markup: <code className="text-xs text-[#1b4d27] font-semibold">twitter:card, twitter:image</code></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2a6e3a]" />
                <span>Robots directive: <code className="text-xs text-[#1b4d27] font-semibold">index, follow, max-image-preview:large</code></span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Live DOM Inspector Modal / Drawer */}
      {showLiveInspector && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#e8f3e2] flex items-center justify-center text-[#1b4d27]">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-[#172e18]">
                    Live Document &lt;head&gt; Inspector
                  </h3>
                  <p className="text-xs text-gray-500">Real-time tags currently parsed by the browser</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLiveInspector(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-3 flex-1 text-xs">
              <div className="bg-[#172e18] text-[#a3e635] p-4 rounded-2xl font-mono text-[11px] space-y-2 overflow-x-auto">
                <div>
                  <span className="text-white/50">&lt;!-- Active Document Title --&gt;</span>
                  <br />
                  &lt;title&gt;{liveSnapshot?.title || document.title}&lt;/title&gt;
                </div>

                <div>
                  <span className="text-white/50">&lt;!-- Search Meta Description --&gt;</span>
                  <br />
                  &lt;meta name="description" content="{liveSnapshot?.description}" /&gt;
                </div>

                <div>
                  <span className="text-white/50">&lt;!-- Target Keywords --&gt;</span>
                  <br />
                  &lt;meta name="keywords" content="{liveSnapshot?.keywords}" /&gt;
                </div>

                <div>
                  <span className="text-white/50">&lt;!-- Open Graph Tags --&gt;</span>
                  <br />
                  &lt;meta property="og:title" content="{liveSnapshot?.ogTitle}" /&gt;
                  <br />
                  &lt;meta property="og:description" content="{liveSnapshot?.ogDescription}" /&gt;
                  <br />
                  &lt;meta property="og:image" content="{liveSnapshot?.ogImage}" /&gt;
                  <br />
                  &lt;meta property="og:type" content="website" /&gt;
                </div>

                <div>
                  <span className="text-white/50">&lt;!-- Twitter Cards --&gt;</span>
                  <br />
                  &lt;meta name="twitter:card" content="{liveSnapshot?.twitterCard}" /&gt;
                  <br />
                  &lt;meta name="twitter:title" content="{liveSnapshot?.ogTitle}" /&gt;
                  <br />
                  &lt;meta name="twitter:image" content="{liveSnapshot?.ogImage}" /&gt;
                </div>

                <div>
                  <span className="text-white/50">&lt;!-- Canonical Link --&gt;</span>
                  <br />
                  &lt;link rel="canonical" href="{liveSnapshot?.canonical}" /&gt;
                </div>
              </div>

              <div className="p-3 bg-[#f0f7eb] rounded-xl text-[11px] text-gray-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2a6e3a] shrink-0" />
                <span>All tags are dynamically connected to state and synchronized via `applyDocumentSEO`.</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLiveInspector(false)}
                className="bg-[#1b4d27] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
