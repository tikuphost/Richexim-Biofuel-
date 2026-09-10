import React, { useState, useEffect } from 'react';
import {
  Flame,
  Globe2,
  TrendingUp,
  ShieldCheck,
  Award,
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2,
  TreePine,
  Layers,
  Sparkles,
  FlaskConical,
  Sprout,
  Ship,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroShowcase: React.FC = () => {
  const { setActiveModal, metrics, siteContent } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultSlides = [
    {
      badge: 'Powering Industries with Sustainable Energy',
      title: 'Industrial Biomass & Green Bio-Fuels',
      sub: 'Manufacturers, Processors, Suppliers & Exporters of High-Calorific Clean Energy Alternatives.',
      highlight: 'Replace Indonesian thermal coal cleanly with 4,200 – 8,000 kcal/kg energy density and zero sulfur emissions.',
      ctaText: 'Build Proforma RFQ',
      ctaAction: () => setActiveModal('rfq'),
      secondaryText: 'Explore Commodity Catalog',
      secondaryLink: '#products',
      bgGradient: 'from-[#173e21] via-[#1b4d27] to-[#255e34]'
    },
    {
      badge: 'Tailored Combustion Engineering',
      title: 'Customized Biomass Fuel Blends',
      sub: 'Calibrated formulations engineered specifically for your boiler combustion parameters.',
      highlight: 'Optimized for FBC, AFBC, CFBC, Stoker & Rotary Kilns. High ash fusion temperature (>1280°C) prevents bed clinkering.',
      ctaText: 'Formulate Custom Blend',
      ctaAction: () => {
        const el = document.getElementById('custom-blends');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
      secondaryText: 'View Boiler Specs',
      secondaryLink: '#custom-blends',
      bgGradient: 'from-[#1a3826] via-[#234e32] to-[#1e522d]'
    },
    {
      badge: 'Metallurgical & Filtration Grade',
      title: 'Coconut Charcoal & Activated Carbon',
      sub: '7,500 – 8,000 kcal/kg Smokeless Briquettes & Steam-Activated Adsorption Media.',
      highlight: 'Supplying 25,000 MT foundry chips for automotive castings and iodine 1,150+ PAC for water & sugar refining.',
      ctaText: 'Inspect Technical Specs',
      ctaAction: () => {
        const el = document.getElementById('quality-center');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
      secondaryText: 'Request Bulk Sample',
      secondaryLink: '#contact',
      bgGradient: 'from-[#132c18] via-[#1b4324] to-[#275d34]'
    }
  ];

  const slides = (siteContent?.heroSlides && siteContent.heroSlides.length > 0)
    ? siteContent.heroSlides.map((s, idx) => ({
        ...s,
        ctaAction: () => setActiveModal('rfq'),
        bgGradient: idx === 0 ? 'from-[#173e21] via-[#1b4d27] to-[#255e34]' : idx === 1 ? 'from-[#1a3826] via-[#234e32] to-[#1e522d]' : 'from-[#132c18] via-[#1b4324] to-[#275d34]'
      }))
    : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section id="home" className="relative bg-[#f3f9ef] pt-6 pb-12 overflow-hidden border-b border-[#e3ede0]">
      {/* Decorative ambient background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2a6e3a]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#f5b342]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Hero Card with Slider */}
        <div className={`rounded-3xl bg-gradient-to-br ${slide.bgGradient} text-white p-5 sm:p-10 lg:p-14 shadow-2xl relative transition-all duration-700`}>
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none rounded-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
            {/* Left Content Area */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#f5b342]/20 text-[#f5b342] px-3 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wide uppercase border border-[#f5b342]/30">
                <Sprout className="w-3.5 h-3.5 text-[#f5b342]" />
                <span>{slide.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
                {slide.title}
              </h1>

              {/* Subtitle */}
              <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
                {slide.sub}
              </p>

              {/* Engineering Highlight Box */}
              <div className="bg-black/25 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/10 flex items-start gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#f5b342] text-[#172e18] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#172e18]" />
                </div>
                <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
                  {slide.highlight}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                <button
                  type="button"
                  onClick={slide.ctaAction}
                  className="flex items-center justify-center gap-2 bg-[#f5b342] hover:bg-[#e09f30] text-[#172e18] font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#172e18]" />
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 text-[#172e18]" />
                </button>

                <a
                  href={slide.secondaryLink}
                  className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-5 py-3.5 rounded-2xl text-xs sm:text-sm transition border border-white/20 w-full sm:w-auto text-center"
                >
                  <span>{slide.secondaryText}</span>
                </a>
              </div>
            </div>

            {/* Right Visual Grid of Commodities */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-white/15 shadow-inner">
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 mb-3 sm:mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#f5b342]" />
                    Core Product Matrix
                  </span>
                  <span className="text-[11px] text-[#f5b342] font-semibold">15+ Fuel Types</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {[
                    { icon: TreePine, name: 'Wood Chips', desc: '3800-4500 kcal' },
                    { icon: Layers, name: 'Briquettes', desc: '4500-5000 kcal' },
                    { icon: Sparkles, name: 'Wood Pellets', desc: 'ENplus-A1 Grade' },
                    { icon: Flame, name: 'Coconut Charcoal', desc: '7500-8000 kcal' },
                    { icon: Sprout, name: 'Agri-Residues', desc: 'Husk, Shell, Flakes' },
                    { icon: FlaskConical, name: 'Custom Blends', desc: 'Boiler Matched' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white/15 hover:bg-white/25 rounded-2xl p-3.5 text-center transition flex flex-col items-center justify-center gap-1 border border-white/10"
                    >
                      <item.icon className="w-6 h-6 text-[#f5b342] mb-1" />
                      <span className="text-xs font-bold text-white leading-tight">{item.name}</span>
                      <span className="text-[10px] text-white/70">{item.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Ocean freight indicator */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/80">
                  <span className="flex items-center gap-1.5">
                    <Ship className="w-4 h-4 text-[#f5b342]" />
                    FCL &amp; Breakbulk Charters
                  </span>
                  <span className="font-semibold text-white">Global Ocean Transit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Slide Controls */}
          <div className="flex items-center justify-between pt-8 mt-6 border-t border-white/15">
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? 'w-8 bg-[#f5b342]' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live International Metrics Ticker */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e3ede0] shadow-xs flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center shrink-0">
              <Globe2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-heading text-xl sm:text-2xl font-extrabold text-[#1b4d27]">
                {metrics.countriesExported}+
              </div>
              <div className="text-xs font-semibold text-gray-500">Destination Countries</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e3ede0] shadow-xs flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-heading text-xl sm:text-2xl font-extrabold text-[#1b4d27]">
                {(metrics.annualTonnageMT / 1000).toFixed(0)}k+ MT
              </div>
              <div className="text-xs font-semibold text-gray-500">Annual Shipped Tonnage</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e3ede0] shadow-xs flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#fdf5e6] text-[#e09f30] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-heading text-xl sm:text-2xl font-extrabold text-[#1b4d27]">
                {metrics.qualityAccreditations}+
              </div>
              <div className="text-xs font-semibold text-gray-500">Quality Accreditations</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e3ede0] shadow-xs flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-heading text-xl sm:text-2xl font-extrabold text-[#1b4d27]">
                {(metrics.co2OffsetMT / 1000).toFixed(0)}k MT
              </div>
              <div className="text-xs font-semibold text-gray-500">CO2 Emissions Displaced</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
