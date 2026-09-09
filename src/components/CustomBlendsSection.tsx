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
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomBlendsSection: React.FC = () => {
  const { addToRFQ, products } = useApp();

  // Interactive formulation builder state
  const [boilerType, setBoilerType] = useState('Fluidized Bed Combustion (FBC)');
  const [particleSize, setParticleSize] = useState('10 – 25 mm (Standard)');
  const [targetCalorific, setTargetCalorific] = useState('4,500 – 5,000 kcal/kg');
  const [moistureTolerance, setMoistureTolerance] = useState('< 10%');
  const [packagingType, setPackagingType] = useState('1000 kg Jumbo Bags (FIBC)');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([
    'Wood Chips',
    'Coconut Shell Granules',
    'Agricultural Fibres'
  ]);

  const rawMaterialsList = [
    'Wood Chips',
    'Agricultural Fibres',
    'Coconut Shell Granules',
    'Charcoal Fines',
    'Biomass Pellets',
    'Bamboo Chips',
    'Tamarind Shells',
    'Cashew Shell',
    'Rice Husk',
    'Bagasse',
    'Coffee Husk'
  ];

  const boilerOptions = [
    'Fluidized Bed Combustion (FBC)',
    'Atmospheric Fluidized Bed (AFBC)',
    'Circulating Fluidized Bed (CFBC)',
    'Traveling Grate Stoker Fired',
    'Pneumatic Spreader Stoker',
    'Industrial Rotary Kiln',
    'Thermic Fluid Heater'
  ];

  const handleToggleMaterial = (mat: string) => {
    if (selectedMaterials.includes(mat)) {
      if (selectedMaterials.length > 1) {
        setSelectedMaterials(selectedMaterials.filter((m) => m !== mat));
      }
    } else {
      setSelectedMaterials([...selectedMaterials, mat]);
    }
  };

  const handleRequestFormulationQuote = () => {
    // Find custom blend template product or create item
    const template = products.find((p) => p.category === 'Customized Biomass Blends') || products[0];
    addToRFQ({
      ...template,
      name: `Custom Blend Formulation (${boilerType.split(' ')[0]} - ${targetCalorific})`,
      description: `Engineered boiler fuel blend for ${boilerType}. Particle size: ${particleSize}. Moisture target: ${moistureTolerance}. Composite materials: ${selectedMaterials.join(', ')}.`
    }, 50, 'MT');
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
            { label: 'Blend Composition', val: 'Customer Specified' },
            { label: 'Particle Size', val: '5–10, 10–25, 25–50 mm' },
            { label: 'Moisture Content', val: '8% – 18% Target' },
            { label: 'Calorific Yield', val: '3,500 – 5,500 kcal/kg' },
            { label: 'Ash Content', val: '< 2.5% Low-Slag' },
            { label: 'Bulk Density', val: 'Feed Matched' },
            { label: 'Packaging', val: 'Bulk / FIBC Bags' }
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
          <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#1b4d27]">
                Interactive Boiler Formulation Configurator
              </h3>
              <p className="text-xs text-gray-500">
                Configure your operating parameters to receive a tailor-made stoichiometric quotation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Inputs */}
            <div className="lg:col-span-8 space-y-6">
              {/* Boiler Type */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  1. Target Combustion &amp; Boiler System
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {boilerOptions.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBoilerType(b)}
                      className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                        boilerType === b
                          ? 'bg-[#eaf3e4] border-[#2a6e3a] text-[#1b4d27] font-bold shadow-2xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Particle Size & Target Energy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    2. Particle Size Sizing
                  </label>
                  <select
                    value={particleSize}
                    onChange={(e) => setParticleSize(e.target.value)}
                    className="w-full bg-[#f9fbf7] text-xs font-semibold text-[#172e18] px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  >
                    <option>5 – 10 mm (Fine Screened)</option>
                    <option>10 – 25 mm (Standard)</option>
                    <option>25 – 50 mm (Heavy Stoker)</option>
                    <option>90 mm Extruded Cylindrical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    3. Target Calorific Density
                  </label>
                  <select
                    value={targetCalorific}
                    onChange={(e) => setTargetCalorific(e.target.value)}
                    className="w-full bg-[#f9fbf7] text-xs font-semibold text-[#172e18] px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#2a6e3a]"
                  >
                    <option>3,800 – 4,200 kcal/kg (Standard Agro)</option>
                    <option>4,200 – 4,800 kcal/kg (High Thermal)</option>
                    <option>4,800 – 5,400 kcal/kg (Coal Equivalent)</option>
                    <option>5,500+ kcal/kg (Enriched Carbon Blend)</option>
                  </select>
                </div>
              </div>

              {/* Raw Materials Multiselect */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  4. Desired Feedstock Biomass Ingredients
                </label>
                <div className="flex flex-wrap gap-2">
                  {rawMaterialsList.map((mat) => {
                    const isSelected = selectedMaterials.includes(mat);
                    return (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => handleToggleMaterial(mat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#1b4d27] text-white shadow-xs'
                            : 'bg-[#f4f7ee] text-gray-700 hover:bg-[#e8f0e5] border border-gray-200'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#f5b342]" />}
                        <span>{mat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Formulation Summary Card */}
            <div className="lg:col-span-4 bg-[#f9fbf7] rounded-2xl p-6 border border-[#e3ede0] flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#2a6e3a] uppercase tracking-wider block mb-1">
                  Engineered Specification
                </span>
                <h4 className="font-heading text-lg font-bold text-[#1b4d27] mb-4">
                  Custom Blend Specification
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500">Boiler Target:</span>
                    <span className="font-bold text-[#1b4d27] text-right truncate max-w-[150px]">
                      {boilerType.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500">Particle Size:</span>
                    <span className="font-bold text-[#1b4d27]">{particleSize.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500">Energy Yield:</span>
                    <span className="font-bold text-[#e09f30]">{targetCalorific.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/60 pb-1.5">
                    <span className="text-gray-500">Ash Fusion Temp:</span>
                    <span className="font-bold text-[#2a6e3a]">&gt; 1,280 °C (Anti-Clinker)</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-gray-500 block mb-1">Composite Ingredients ({selectedMaterials.length}):</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedMaterials.map((m) => (
                        <span key={m} className="bg-white border border-gray-200 text-[10px] px-2 py-0.5 rounded-md font-medium text-gray-700">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
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
                  Includes full technical data sheet &amp; bomb calorimetry certificate.
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
            'Optimized for Specific Boiler Parameters & Fluidization',
            'Higher Thermal Combustion Efficiency with Zero Sulfur',
            'Stable Flame Length & Sustained Radiant Heat Release',
            'Significant Reduction in Refractory Ash Clinkering',
            'Lower Fuel Consumption per Metric Ton of Steam',
            'Long-Term Guaranteed Quantity Annual Supply Contracts'
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
