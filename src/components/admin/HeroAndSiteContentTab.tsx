import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  TrendingUp,
  Globe2,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  Save,
  Flame,
  Award,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SiteHeroSlide } from '../../types';

interface NormalizedSlide extends SiteHeroSlide {
  id: string;
}

const ensureSlideIds = (slides: SiteHeroSlide[]): NormalizedSlide[] => {
  return slides.map((s, idx) => ({
    ...s,
    id: s.id || `slide-${idx + 1}-${idx}`
  }));
};

export const HeroAndSiteContentTab: React.FC = () => {
  const { siteContent, updateSiteContent, metrics } = useApp();

  // Metrics local state
  const [metricsForm, setMetricsForm] = useState({
    countriesExported: siteContent?.metrics?.countriesExported ?? metrics.countriesExported ?? 24,
    annualTonnageMT: siteContent?.metrics?.annualTonnageMT ?? metrics.annualTonnageMT ?? 145000,
    qualityAccreditations: siteContent?.metrics?.qualityAccreditations ?? metrics.qualityAccreditations ?? 8,
    co2OffsetMT: siteContent?.metrics?.co2OffsetMT ?? metrics.co2OffsetMT ?? 185000,
    totalOrdersCompleted: siteContent?.metrics?.totalOrdersCompleted ?? metrics.totalOrdersCompleted ?? 480
  });

  // Company profile local state
  const [companyForm, setCompanyForm] = useState({
    name: siteContent?.companyInfo?.name || 'Richmount Exim Group',
    tagline: siteContent?.companyInfo?.tagline || 'Leading Exporters & Manufacturers of Clean Industrial Biofuels',
    foundingYear: siteContent?.companyInfo?.foundingYear || 2012,
    headquarters: siteContent?.companyInfo?.headquarters || 'Trade Tower, Nariman Point, Mumbai 400021, India',
    phone: siteContent?.companyInfo?.phone || '+91 22 6890 4500',
    email: siteContent?.companyInfo?.email || 'exports@richmountexim.com',
    whatsapp: siteContent?.companyInfo?.whatsapp || '+91 98200 45112',
    mission: siteContent?.companyInfo?.mission || 'Decarbonizing industrial thermal utility boilers across Europe, Japan, and Southeast Asia through sustainably harvested agricultural biomass.'
  });

  // Hero Slides local state
  const defaultSlides: NormalizedSlide[] = [
    {
      id: 'slide-1',
      badge: 'Powering Industries with Sustainable Energy',
      title: 'Industrial Biomass & Green Bio-Fuels',
      sub: 'Manufacturers, Processors, Suppliers & Exporters of High-Calorific Clean Energy Alternatives.',
      highlight: 'Replace Indonesian thermal coal cleanly with 4,200 – 8,000 kcal/kg energy density and zero sulfur emissions.',
      ctaText: 'Build Proforma RFQ',
      secondaryText: 'Explore Commodity Catalog'
    },
    {
      id: 'slide-2',
      badge: 'Tailored Combustion Engineering',
      title: 'Customized Biomass Fuel Blends',
      sub: 'Calibrated formulations engineered specifically for your boiler combustion parameters.',
      highlight: 'Optimized for FBC, AFBC, CFBC, Stoker & Rotary Kilns. High ash fusion temperature (>1280°C) prevents bed clinkering.',
      ctaText: 'Formulate Custom Blend',
      secondaryText: 'View Boiler Specs'
    },
    {
      id: 'slide-3',
      badge: 'Metallurgical & Filtration Grade',
      title: 'Coconut Charcoal & Activated Carbon',
      sub: '7,500 – 8,000 kcal/kg Smokeless Briquettes & Steam-Activated Adsorption Media.',
      highlight: 'Supplying 25,000 MT foundry chips for automotive castings and iodine 1,150+ PAC for water & sugar refining.',
      ctaText: 'Inspect Technical Specs',
      secondaryText: 'Request Bulk Sample'
    }
  ];

  const [heroSlides, setHeroSlides] = useState<NormalizedSlide[]>(() => {
    const raw = siteContent?.heroSlides && siteContent.heroSlides.length > 0 ? siteContent.heroSlides : defaultSlides;
    return ensureSlideIds(raw);
  });

  // Keep slides synchronized when siteContent loads asynchronously
  useEffect(() => {
    if (siteContent?.heroSlides && siteContent.heroSlides.length > 0) {
      setHeroSlides(ensureSlideIds(siteContent.heroSlides));
    }
  }, [siteContent?.heroSlides]);

  // Keep metrics & company info synchronized when siteContent loads asynchronously
  useEffect(() => {
    if (siteContent?.metrics) {
      setMetricsForm({
        countriesExported: siteContent.metrics.countriesExported ?? 24,
        annualTonnageMT: siteContent.metrics.annualTonnageMT ?? 145000,
        qualityAccreditations: siteContent.metrics.qualityAccreditations ?? 8,
        co2OffsetMT: siteContent.metrics.co2OffsetMT ?? 185000,
        totalOrdersCompleted: siteContent.metrics.totalOrdersCompleted ?? 480
      });
    }
    if (siteContent?.companyInfo) {
      setCompanyForm({
        name: siteContent.companyInfo.name || 'Richmount Exim Group',
        tagline: siteContent.companyInfo.tagline || 'Leading Exporters & Manufacturers of Clean Industrial Biofuels',
        foundingYear: siteContent.companyInfo.foundingYear || 2012,
        headquarters: siteContent.companyInfo.headquarters || 'Trade Tower, Nariman Point, Mumbai 400021, India',
        phone: siteContent.companyInfo.phone || '+91 22 6890 4500',
        email: siteContent.companyInfo.email || 'exports@richmountexim.com',
        whatsapp: siteContent.companyInfo.whatsapp || '+91 98200 45112',
        mission: siteContent.companyInfo.mission || 'Decarbonizing industrial thermal utility boilers across Europe, Japan, and Southeast Asia through sustainably harvested agricultural biomass.'
      });
    }
  }, [siteContent?.metrics, siteContent?.companyInfo]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleUpdateSlide = (id: string, field: keyof SiteHeroSlide, value: string) => {
    setHeroSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleAddSlide = () => {
    const newSlide: NormalizedSlide = {
      id: `slide-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      badge: 'Sustainable Commodity Operations',
      title: 'New Biofuel Export Formulation',
      sub: 'Reliable cross-border maritime supply chain from prime Indian agricultural belts.',
      highlight: 'High-density certified energy pellets with ASTM/SGS lab assay certification.',
      ctaText: 'Request Export Quote',
      secondaryText: 'Download Specs'
    };
    setHeroSlides((prev) => [...prev, newSlide]);
  };

  const handleDeleteSlide = (id: string) => {
    if (heroSlides.length <= 1) return;
    setHeroSlides((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    await updateSiteContent({
      metrics: metricsForm,
      companyInfo: companyForm,
      heroSlides: heroSlides
    });

    setIsSaving(false);
    setSaveMessage('All site content, hero carousel slides, and export metrics successfully updated!');
    setTimeout(() => setSaveMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#e3ede0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-extrabold text-lg text-[#172e18] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#2a6e3a]" />
            Site Content, Hero Carousel &amp; Corporate Identity
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Modify public storefront banners, live counters, mission statements, and corporate addresses.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="bg-[#1b4d27] hover:bg-[#2a6e3a] disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-xs shrink-0"
        >
          <Save className="w-4 h-4 text-[#f5b342]" />
          <span>{isSaving ? 'Saving Changes...' : 'Publish Content Updates'}</span>
        </button>
      </div>

      {saveMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-[#1b4d27] px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* 1. Live International Export Telemetry Counters */}
      <div className="bg-white rounded-2xl p-5 border border-[#e3ede0] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <TrendingUp className="w-4 h-4 text-[#2a6e3a]" />
          <h4 className="font-heading font-bold text-sm text-gray-900">
            Live Global Export Telemetry (Homepage Ticker Counters)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-[#f9fbf7] p-3 rounded-xl border border-gray-200">
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Destination Countries</label>
            <input
              type="number"
              value={metricsForm.countriesExported}
              onChange={(e) => setMetricsForm({ ...metricsForm, countriesExported: parseInt(e.target.value) || 0 })}
              className="w-full text-sm font-extrabold text-[#1b4d27] bg-white px-2.5 py-1.5 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
            />
          </div>

          <div className="bg-[#f9fbf7] p-3 rounded-xl border border-gray-200">
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Annual Tonnage (MT)</label>
            <input
              type="number"
              value={metricsForm.annualTonnageMT}
              onChange={(e) => setMetricsForm({ ...metricsForm, annualTonnageMT: parseInt(e.target.value) || 0 })}
              className="w-full text-sm font-extrabold text-[#1b4d27] bg-white px-2.5 py-1.5 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
            />
          </div>

          <div className="bg-[#f9fbf7] p-3 rounded-xl border border-gray-200">
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Quality Accreditations</label>
            <input
              type="number"
              value={metricsForm.qualityAccreditations}
              onChange={(e) => setMetricsForm({ ...metricsForm, qualityAccreditations: parseInt(e.target.value) || 0 })}
              className="w-full text-sm font-extrabold text-[#1b4d27] bg-white px-2.5 py-1.5 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
            />
          </div>

          <div className="bg-[#f9fbf7] p-3 rounded-xl border border-gray-200">
            <label className="block text-[11px] font-bold text-gray-600 mb-1">CO2 Offset (MT)</label>
            <input
              type="number"
              value={metricsForm.co2OffsetMT}
              onChange={(e) => setMetricsForm({ ...metricsForm, co2OffsetMT: parseInt(e.target.value) || 0 })}
              className="w-full text-sm font-extrabold text-[#1b4d27] bg-white px-2.5 py-1.5 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
            />
          </div>

          <div className="bg-[#f9fbf7] p-3 rounded-xl border border-gray-200">
            <label className="block text-[11px] font-bold text-gray-600 mb-1">Total Orders Executed</label>
            <input
              type="number"
              value={metricsForm.totalOrdersCompleted}
              onChange={(e) => setMetricsForm({ ...metricsForm, totalOrdersCompleted: parseInt(e.target.value) || 0 })}
              className="w-full text-sm font-extrabold text-[#1b4d27] bg-white px-2.5 py-1.5 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
            />
          </div>
        </div>
      </div>

      {/* 2. Hero Showcase Carousel Slides Editor */}
      <div className="bg-white rounded-2xl p-5 border border-[#e3ede0] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#f5b342]" />
            <h4 className="font-heading font-bold text-sm text-gray-900">
              Hero Showcase Slides ({heroSlides.length})
            </h4>
          </div>
          <button
            type="button"
            onClick={handleAddSlide}
            className="text-xs bg-[#edf5e8] hover:bg-[#dcecd5] text-[#1b4d27] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slide</span>
          </button>
        </div>

        <div className="space-y-4">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id || `hero-slide-${index}`}
              className="p-4 bg-[#fbfdf9] rounded-2xl border border-gray-200 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1b4d27] bg-[#edf5e8] px-2.5 py-0.5 rounded-md">
                  Slide {index + 1}
                </span>
                {heroSlides.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded transition cursor-pointer"
                    title="Remove slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Badge Headline</label>
                  <input
                    type="text"
                    value={slide.badge}
                    onChange={(e) => handleUpdateSlide(slide.id, 'badge', e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Main Title</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => handleUpdateSlide(slide.id, 'title', e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-gray-300 font-bold focus:outline-hidden focus:border-[#2a6e3a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Subtitle / Proposition</label>
                  <input
                    type="text"
                    value={slide.sub}
                    onChange={(e) => handleUpdateSlide(slide.id, 'sub', e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Highlight Keyword Box</label>
                  <input
                    type="text"
                    value={slide.highlight}
                    onChange={(e) => handleUpdateSlide(slide.id, 'highlight', e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-gray-300 text-gray-700 focus:outline-hidden focus:border-[#2a6e3a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Primary CTA Button</label>
                  <input
                    type="text"
                    value={slide.ctaText}
                    onChange={(e) => handleUpdateSlide(slide.id, 'ctaText', e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Secondary Action Link Text</label>
                  <input
                    type="text"
                    value={slide.secondaryText}
                    onChange={(e) => handleUpdateSlide(slide.id, 'secondaryText', e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Corporate Information & About Us Profile */}
      <div className="bg-white rounded-2xl p-5 border border-[#e3ede0] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <Building2 className="w-4 h-4 text-[#2a6e3a]" />
          <h4 className="font-heading font-bold text-sm text-gray-900">
            Corporate Profile &amp; Contact Coordinates
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Company / Group Name</label>
            <input
              type="text"
              value={companyForm.name}
              onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a] font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Corporate Tagline</label>
            <input
              type="text"
              value={companyForm.tagline}
              onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Official Export Email</label>
            <input
              type="email"
              value={companyForm.email}
              onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Desk Telephone</label>
            <input
              type="text"
              value={companyForm.phone}
              onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-700 mb-1">Headquarters Address</label>
            <input
              type="text"
              value={companyForm.headquarters}
              onChange={(e) => setCompanyForm({ ...companyForm, headquarters: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-bold text-gray-700 mb-1">Mission Statement</label>
            <textarea
              rows={3}
              value={companyForm.mission}
              onChange={(e) => setCompanyForm({ ...companyForm, mission: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
