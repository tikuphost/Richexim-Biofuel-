import React, { useState } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  Sliders,
  Settings,
  Flame,
  ArrowRight,
  ShieldCheck,
  Factory,
  Package,
  Sparkles,
  Droplets,
  Layers,
  Box,
  RotateCcw,
  Check,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomBlendsSection: React.FC = () => {
  const { addToRFQ, products, setActiveModal } = useApp();

  // 6 Client-Configured Formulation Parameters
  const [calorificValue, setCalorificValue] = useState('4,800 kcal/kg');
  const [moistureContent, setMoistureContent] = useState('< 10%');
  const [ashContent, setAshContent] = useState('< 2.5%');
  const [particleSize, setParticleSize] = useState('10 – 25 mm');
  const [density, setDensity] = useState('650 kg/m³');
  const [applicationArea, setApplicationArea] = useState('Fluidized Bed Boiler (CFBC/AFBC)');

  // Commercial ordering parameters
  const [volume, setVolume] = useState<number>(50);
  const [packagingType, setPackagingType] = useState('1000 kg Jumbo Bags (FIBC)');
  const [isAddedToast, setIsAddedToast] = useState(false);

  // Presets for client quick-selection
  const calorificPresets = ['4,200 kcal/kg', '4,600 kcal/kg', '4,800 kcal/kg', '5,200 kcal/kg', '5,600+ kcal/kg'];
  const moisturePresets = ['< 8%', '< 10%', '< 12%', '< 15% Max'];
  const ashPresets = ['< 1.5% (Low-Slag)', '< 2.0%', '< 2.5%', '< 3.5%'];
  const particleSizePresets = ['6 – 8 mm (Pellets)', '10 – 25 mm (Chips)', '25 – 50 mm (Stoker)', '90 mm (Briquettes)'];
  const densityPresets = ['550 – 650 kg/m³', '650 – 750 kg/m³', '> 1,100 kg/m³ (Extruded)'];
  const applicationPresets = [
    'Fluidized Bed (CFBC/AFBC)',
    'Traveling Grate Stoker',
    'Cement Rotary Kiln',
    'Steel & Metallurgical',
    'Paper & Pulp Co-Gen',
    'District Heating'
  ];

  const handleResetDefaults = () => {
    setCalorificValue('4,800 kcal/kg');
    setMoistureContent('< 10%');
    setAshContent('< 2.5%');
    setParticleSize('10 – 25 mm');
    setDensity('650 kg/m³');
    setApplicationArea('Fluidized Bed Boiler (CFBC/AFBC)');
    setVolume(50);
    setPackagingType('1000 kg Jumbo Bags (FIBC)');
  };

  const handleRequestFormulationQuote = () => {
    const template = products.find((p) => p.category === 'Customized Biomass Blends') || products[0];
    addToRFQ(
      {
        ...template,
        id: `custom-blend-${Date.now()}`,
        name: `Custom Boiler Formulation (${applicationArea.trim() || 'Industrial Boiler'})`,
        description: `Client-Engineered Fuel Specification — 1. Calorific Value: ${calorificValue}; 2. Moisture Content: ${moistureContent}; 3. Ash Content: ${ashContent}; 4. Particle Size: ${particleSize}; 5. Density: ${density}; 6. Application Area: ${applicationArea}. Packaging: ${packagingType}.`,
        calorificMin: parseInt(calorificValue.replace(/[^0-9]/g, '')) || 4800,
        calorificMax: parseInt(calorificValue.replace(/[^0-9]/g, '')) || 5200,
        moisture: moistureContent || '< 10%',
        ashContent: ashContent || '< 2.5%',
        bulkDensity: density || '650 kg/m³',
        particleSize: particleSize || '10 – 25 mm',
        applications: [applicationArea || 'Industrial Boiler'],
        packagingOptions: [packagingType, '1000 kg Jumbo Bags (FIBC)', 'Loose Bulk Vessel Discharge'],
        basePriceUSD: 145
      },
      volume,
      'MT'
    );

    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 4000);
  };

  return (
    <section id="custom-blends" className="py-10 sm:py-16 bg-[#f0f7eb] border-y border-[#e3ede0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2a6e3a] uppercase tracking-wider bg-white px-3.5 py-1 rounded-full border border-[#cbe1c3] mb-3 shadow-2xs">
            <FlaskConical className="w-3.5 h-3.5 text-[#2a6e3a]" />
            <span>Combustion Optimization Engineering</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#1b4d27] tracking-tight">
            Customized Biomass Fuel Blends
          </h2>
          <p className="text-gray-700 text-xs sm:text-base mt-2 sm:mt-3 leading-relaxed">
            At <strong>Richmount Exim (Richexim Group)</strong>, we engineer tailored biomass formulations calibrated to match your exact boiler grate design, feeding pneumatic systems, combustion temperatures, and local environmental emission caps.
          </p>
        </div>

        {/* Customization Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 mb-8 sm:mb-10">
          {[
            { label: 'Calorific Yield', val: '3,500 – 5,500 kcal/kg' },
            { label: 'Moisture Target', val: '8% – 18% Calibrated' },
            { label: 'Ash Content', val: '< 2.5% Low-Slag' },
            { label: 'Particle Sizing', val: '5–10, 10–25, 25–50 mm' },
            { label: 'Bulk Density', val: 'Feed Matched' },
            { label: 'Application Area', val: 'Custom Boilers / Kilns' },
            { label: 'Export Packaging', val: 'Bulk / FIBC Bags' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-3 sm:p-4 border border-[#d8e6d3] shadow-xs text-center">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase text-gray-500 block mb-1">
                {item.label}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#1b4d27]">
                {item.val}
              </span>
            </div>
          ))}
        </div>

        {/* Interactive Formulation Builder Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-[#cbe1c3] shadow-lg mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-[#1b4d27]">
                  Interactive Boiler Formulation Configurator
                </h3>
                <p className="text-xs text-gray-500">
                  Insert your custom operating values to formulate a tailor-made stoichiometric fuel specification.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#1b4d27] px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#2a6e3a] bg-white transition cursor-pointer self-start sm:self-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Inputs (6 Custom Client Parameters) */}
            <div className="lg:col-span-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 1. Calorific Value */}
                <div className="bg-[#fcfdfa] p-4 rounded-2xl border border-[#e3ede0] hover:border-[#2a6e3a] transition">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#e09f30]" />
                      <span>1. Calorific Value</span>
                    </label>
                    <span className="text-[10px] font-mono font-bold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                      kcal/kg
                    </span>
                  </div>
                  <input
                    type="text"
                    value={calorificValue}
                    onChange={(e) => setCalorificValue(e.target.value)}
                    placeholder="e.g. 4,800 kcal/kg (or 4,200 – 5,200)"
                    className="w-full bg-white text-xs font-semibold text-[#172e18] px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a] focus:ring-1 focus:ring-[#2a6e3a]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {calorificPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCalorificValue(preset)}
                        className={`text-[10px] font-medium px-2 py-1 rounded-md border transition cursor-pointer ${
                          calorificValue === preset
                            ? 'bg-[#1b4d27] text-white border-[#1b4d27]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Moisture Content */}
                <div className="bg-[#fcfdfa] p-4 rounded-2xl border border-[#e3ede0] hover:border-[#2a6e3a] transition">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span>2. Moisture Content</span>
                    </label>
                    <span className="text-[10px] font-mono font-bold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                      % Target
                    </span>
                  </div>
                  <input
                    type="text"
                    value={moistureContent}
                    onChange={(e) => setMoistureContent(e.target.value)}
                    placeholder="e.g. < 10% (or 8% – 12%)"
                    className="w-full bg-white text-xs font-semibold text-[#172e18] px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a] focus:ring-1 focus:ring-[#2a6e3a]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {moisturePresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setMoistureContent(preset)}
                        className={`text-[10px] font-medium px-2 py-1 rounded-md border transition cursor-pointer ${
                          moistureContent === preset
                            ? 'bg-[#1b4d27] text-white border-[#1b4d27]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Ash Content */}
                <div className="bg-[#fcfdfa] p-4 rounded-2xl border border-[#e3ede0] hover:border-[#2a6e3a] transition">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-600" />
                      <span>3. Ash Content</span>
                    </label>
                    <span className="text-[10px] font-mono font-bold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                      % Max
                    </span>
                  </div>
                  <input
                    type="text"
                    value={ashContent}
                    onChange={(e) => setAshContent(e.target.value)}
                    placeholder="e.g. < 2.5% (or < 1.5%)"
                    className="w-full bg-white text-xs font-semibold text-[#172e18] px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a] focus:ring-1 focus:ring-[#2a6e3a]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {ashPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAshContent(preset)}
                        className={`text-[10px] font-medium px-2 py-1 rounded-md border transition cursor-pointer ${
                          ashContent === preset
                            ? 'bg-[#1b4d27] text-white border-[#1b4d27]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Particle Size */}
                <div className="bg-[#fcfdfa] p-4 rounded-2xl border border-[#e3ede0] hover:border-[#2a6e3a] transition">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-[#2a6e3a]" />
                      <span>4. Particle Size</span>
                    </label>
                    <span className="text-[10px] font-mono font-bold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                      mm Sizing
                    </span>
                  </div>
                  <input
                    type="text"
                    value={particleSize}
                    onChange={(e) => setParticleSize(e.target.value)}
                    placeholder="e.g. 10 – 25 mm (or 6–8 mm, 25–50 mm)"
                    className="w-full bg-white text-xs font-semibold text-[#172e18] px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a] focus:ring-1 focus:ring-[#2a6e3a]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {particleSizePresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setParticleSize(preset)}
                        className={`text-[10px] font-medium px-2 py-1 rounded-md border transition cursor-pointer ${
                          particleSize === preset
                            ? 'bg-[#1b4d27] text-white border-[#1b4d27]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Density */}
                <div className="bg-[#fcfdfa] p-4 rounded-2xl border border-[#e3ede0] hover:border-[#2a6e3a] transition">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Box className="w-4 h-4 text-emerald-700" />
                      <span>5. Density</span>
                    </label>
                    <span className="text-[10px] font-mono font-bold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                      kg/m³ Bulk
                    </span>
                  </div>
                  <input
                    type="text"
                    value={density}
                    onChange={(e) => setDensity(e.target.value)}
                    placeholder="e.g. 650 kg/m³ (or 1.1 – 1.3 g/cm³)"
                    className="w-full bg-white text-xs font-semibold text-[#172e18] px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a] focus:ring-1 focus:ring-[#2a6e3a]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {densityPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setDensity(preset)}
                        className={`text-[10px] font-medium px-2 py-1 rounded-md border transition cursor-pointer ${
                          density === preset
                            ? 'bg-[#1b4d27] text-white border-[#1b4d27]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Application Area */}
                <div className="bg-[#fcfdfa] p-4 rounded-2xl border border-[#e3ede0] hover:border-[#2a6e3a] transition">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Factory className="w-4 h-4 text-[#1b4d27]" />
                      <span>6. Application Area</span>
                    </label>
                    <span className="text-[10px] font-mono font-bold text-gray-400 bg-white px-2 py-0.5 rounded border border-gray-200">
                      Industrial
                    </span>
                  </div>
                  <input
                    type="text"
                    value={applicationArea}
                    onChange={(e) => setApplicationArea(e.target.value)}
                    placeholder="e.g. CFBC / AFBC Boiler, Cement Kiln, Steel Plant..."
                    className="w-full bg-white text-xs font-semibold text-[#172e18] px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a] focus:ring-1 focus:ring-[#2a6e3a]"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {applicationPresets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setApplicationArea(preset)}
                        className={`text-[10px] font-medium px-2 py-1 rounded-md border transition cursor-pointer ${
                          applicationArea === preset
                            ? 'bg-[#1b4d27] text-white border-[#1b4d27]'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Volume & Packaging Requirements */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#f4f7ee] p-3.5 rounded-xl border border-[#dce8d6] flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-gray-800 block">Target Order Quantity</label>
                    <span className="text-[11px] text-gray-500">Minimum 25 MT FCL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={25}
                      step={25}
                      value={volume}
                      onChange={(e) => setVolume(Math.max(25, Number(e.target.value) || 25))}
                      className="w-20 bg-white text-xs font-bold text-[#1b4d27] px-2.5 py-1.5 rounded-lg border border-gray-300 text-center"
                    />
                    <span className="text-xs font-bold text-gray-600">MT</span>
                  </div>
                </div>

                <div className="bg-[#f4f7ee] p-3.5 rounded-xl border border-[#dce8d6] flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-gray-800 block">Preferred Packaging</label>
                    <span className="text-[11px] text-gray-500">Container / FIBC standard</span>
                  </div>
                  <select
                    value={packagingType}
                    onChange={(e) => setPackagingType(e.target.value)}
                    className="bg-white text-xs font-semibold text-[#172e18] px-2.5 py-1.5 rounded-lg border border-gray-300"
                  >
                    <option>1000 kg Jumbo Bags (FIBC)</option>
                    <option>Loose Bulk Vessel Discharge</option>
                    <option>25 kg Woven Poly Bags</option>
                    <option>50 kg Heavy Duty Sacks</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Formulation Summary Card */}
            <div className="lg:col-span-4 bg-[#f9fbf7] rounded-2xl p-6 border border-[#e3ede0] flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-[#2a6e3a] uppercase tracking-wider">
                    Engineered Specification
                  </span>
                  <span className="bg-[#e8f3e2] text-[#1b4d27] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#cbe1c3]">
                    Client Configured
                  </span>
                </div>
                <h4 className="font-heading text-lg font-bold text-[#1b4d27] mb-4">
                  Custom Blend Specification
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#e09f30]" />
                      <span>1. Calorific Value:</span>
                    </span>
                    <span className="font-bold text-[#e09f30]">{calorificValue || 'Not specified'}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      <span>2. Moisture Content:</span>
                    </span>
                    <span className="font-bold text-[#1b4d27]">{moistureContent || 'Not specified'}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      <span>3. Ash Content:</span>
                    </span>
                    <span className="font-bold text-[#1b4d27]">{ashContent || 'Not specified'}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#2a6e3a]" />
                      <span>4. Particle Size:</span>
                    </span>
                    <span className="font-bold text-[#1b4d27]">{particleSize || 'Not specified'}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Box className="w-3.5 h-3.5 text-emerald-700" />
                      <span>5. Density:</span>
                    </span>
                    <span className="font-bold text-[#1b4d27]">{density || 'Not specified'}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Factory className="w-3.5 h-3.5 text-[#1b4d27]" />
                      <span>6. Application Area:</span>
                    </span>
                    <span className="font-bold text-[#1b4d27] text-right truncate max-w-[140px]" title={applicationArea}>
                      {applicationArea || 'Not specified'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500">Order Volume:</span>
                    <span className="font-bold text-[#1b4d27]">{volume} Metric Tons</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500">Ash Fusion Temp:</span>
                    <span className="font-bold text-[#2a6e3a]">&gt; 1,280 °C (Anti-Clinker)</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                {isAddedToast && (
                  <div className="mb-3 p-2.5 bg-[#e8f3e2] border border-[#2a6e3a] text-[#1b4d27] rounded-xl text-xs flex items-center justify-between animate-fadeIn">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4 text-[#2a6e3a]" />
                      Added to RFQ ({volume} MT)!
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveModal('rfq')}
                      className="text-[10px] font-extrabold text-[#2a6e3a] hover:underline cursor-pointer"
                    >
                      Open RFQ →
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRequestFormulationQuote}
                  className="w-full flex items-center justify-center gap-2 bg-[#2a6e3a] hover:bg-[#1b4d27] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition cursor-pointer"
                >
                  <FlaskConical className="w-4 h-4 text-[#f5b342]" />
                  <span>Add Formulation to RFQ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-gray-400 text-center mt-2">
                  Includes full technical assay report &amp; stoichiometric combustion certificate.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <h4 className="font-heading text-xl font-bold text-[#1b4d27] text-center mb-6">
          Key Engineering &amp; Operational Benefits
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'Calibrated to Client-Specified Calorific, Moisture & Ash Limits',
            'Sized for Optimal Stoker, Pneumatic & Fluidized Grate Feeding',
            'High Thermal Combustion Efficiency with Zero Additives',
            'Significant Reduction in Refractory Clinkering & Slag Formation',
            'Guaranteed Lower Fuel Cost per Metric Ton of Generated Steam',
            'Full Laboratory Assay & Bomb Calorimetry Certificate Provided'
          ].map((benefit, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-[#e3ede0] shadow-2xs flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#172e18]">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
