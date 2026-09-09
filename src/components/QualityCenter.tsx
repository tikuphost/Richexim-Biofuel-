import React from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Eye,
  Ship,
  Box,
  Truck,
  Layers,
  Flame,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Certification } from '../types';

export const QualityCenter: React.FC = () => {
  const {
    certifications,
    selectedCert,
    setSelectedCert,
    activeModal,
    setActiveModal
  } = useApp();

  const handleInspectCert = (cert: Certification) => {
    setSelectedCert(cert);
    setActiveModal('cert-detail');
  };

  return (
    <section id="quality-center" className="py-16 bg-[#f4f7ee]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2a6e3a] uppercase tracking-wider bg-white px-3.5 py-1 rounded-full border border-[#cbe1c3] mb-3 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#2a6e3a]" />
            <span>Trust, Compliance &amp; Standards</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1b4d27] tracking-tight">
            Accreditation &amp; Quality Assurance Center
          </h2>
          <p className="text-gray-700 text-sm sm:text-base mt-2">
            Every export lot undergoes bomb calorimetry and proximate testing at accredited laboratory facilities prior to container stuffing.
          </p>
        </div>

        {/* Accreditation Wall */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-[#e8f3e2] text-[#1b4d27] text-[10px] font-extrabold px-3 py-1 rounded-full tracking-wider">
                    {cert.badgeCode}
                  </span>
                  <span className="text-xs text-gray-400 font-mono font-semibold">
                    {cert.code}
                  </span>
                </div>

                <h3 className="font-heading text-base font-bold text-[#1b4d27] group-hover:text-[#2a6e3a] transition line-clamp-2">
                  {cert.name}
                </h3>

                <p className="text-xs text-gray-500 font-medium mt-1">
                  Issuing Body: {cert.issuer}
                </p>

                <p className="text-xs text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                  {cert.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  Valid Until: <strong>{cert.validUntil}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => handleInspectCert(cert)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#2a6e3a] hover:text-[#1b4d27] hover:underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Audit Record</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Specifications Benchmark Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e3ede0] shadow-md mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="font-heading text-2xl font-bold text-[#1b4d27]">
                📊 Standard Biomass Technical Specifications
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Comparative proximate analysis tolerances across primary industrial fuel commodities.
              </p>
            </div>
            <span className="bg-[#f0f7eb] text-[#2a6e3a] text-xs font-bold px-3 py-1 rounded-full border border-[#cbe1c3]">
              ASTM D5865 &amp; ISO 17225 Tested
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#1b4d27] text-white">
                  <th className="py-3 px-4 rounded-l-xl font-bold">Commodity</th>
                  <th className="py-3 px-4 font-bold">Calorific Yield (kcal/kg)</th>
                  <th className="py-3 px-4 font-bold">Moisture (% wt)</th>
                  <th className="py-3 px-4 font-bold">Ash Content (% wt)</th>
                  <th className="py-3 px-4 font-bold">Bulk Density</th>
                  <th className="py-3 px-4 rounded-r-xl font-bold">Target Industry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {[
                  { prod: 'Wood Chips (Screened G30/G50)', cal: '3,800 – 4,500', moi: '15% – 25%', ash: '1% – 3%', den: '280 – 350 kg/m³', ind: 'Biomass Cogeneration / Paper Mills' },
                  { prod: 'Biomass Briquettes (90mm High Density)', cal: '7,500 – 8,000 (Charcoal) / 4,500 (Agro)', moi: '< 8%', ash: '2% – 5%', den: '600 – 750 kg/m³', ind: 'Stoker Boilers & Heavy Steam' },
                  { prod: 'Wood Pellets (6mm / 8mm ENplus-A1)', cal: '4,200 – 4,800', moi: '< 8.5%', ash: '< 1.5%', den: '650 – 750 kg/m³', ind: 'Automated Hopper Boilers / Food Units' },
                  { prod: 'Coconut Shell Charcoal (Smokeless)', cal: '7,000 – 7,500', moi: '< 8%', ash: '1% – 3%', den: '550 – 650 kg/m³', ind: 'Foundry Casting / BBQ / Shisha' },
                  { prod: 'Groundnut Shell Fuel (Raw & Processed)', cal: '4,000 – 4,500', moi: '8% – 12%', ash: '3% – 5%', den: '300 – 400 kg/m³', ind: 'Solvent Extraction / Kilns' },
                  { prod: 'Coffee Shell & Husk (High Thermal)', cal: '4,200 – 4,800', moi: '8% – 12%', ash: '2% – 4%', den: '320 – 420 kg/m³', ind: 'Textile Dyeing / Tea Estates' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#f9fbf7]">
                    <td className="py-3.5 px-4 font-bold text-[#1b4d27]">{row.prod}</td>
                    <td className="py-3.5 px-4 font-extrabold text-[#e09f30]">{row.cal}</td>
                    <td className="py-3.5 px-4">{row.moi}</td>
                    <td className="py-3.5 px-4">{row.ash}</td>
                    <td className="py-3.5 px-4">{row.den}</td>
                    <td className="py-3.5 px-4 text-gray-500 font-medium">{row.ind}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activated Carbon & Foundry Consumption Capacity Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e3ede0] shadow-md mb-16">
          <div className="mb-6">
            <h3 className="font-heading text-2xl font-bold text-[#1b4d27]">
              🔬 Activated Carbon &amp; Coconut Charcoal Metallurgical Chips
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Industrial production and export allocation matrices by sector and end-use application.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#172e18] text-white">
                  <th className="py-3 px-4 rounded-l-xl font-bold">Grade &amp; Particle Structure</th>
                  <th className="py-3 px-4 font-bold">Primary Sector &amp; Application</th>
                  <th className="py-3 px-4 rounded-r-xl font-bold text-right">Annual Export Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {[
                  { grade: 'Coconut Charcoal Chips (10–25mm)', app: 'Foundries for Cast Iron (C.I.) Castings, Automobile Parts, Engine Casings & Recarburization', cap: '25,000 MT / Annum' },
                  { grade: 'Powdered Grade PAC (200–325 Mesh)', app: 'Liquid Systems, Edible Vegetable Oils, Fats Decolorization, Sugar Refining, Water Treatment, Fine Chemicals', cap: '32,500 MT / Annum' },
                  { grade: 'Granular Grade GAC (4x8 to 12x40 Mesh)', app: 'Automotive Canisters, Air Purification, Vapor Recovery, Gold Cyanidation Extraction Systems', cap: '5,000 MT / Annum' },
                  { grade: 'Pelletized Extruded Grade (4mm / 6mm)', app: 'Industrial Solvent Recovery, Catalyst Carrier Applications & Biogas Desulfurization', cap: '3,000 MT / Annum' }
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#f9fbf7]">
                    <td className="py-3.5 px-4 font-bold text-[#1b4d27]">{item.grade}</td>
                    <td className="py-3.5 px-4 text-gray-600">{item.app}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-[#2a6e3a]">{item.cap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Logistics & Packaging Grid */}
        <div>
          <h3 className="font-heading text-2xl font-bold text-[#1b4d27] mb-6 text-center">
            🚚 Packaging &amp; Ocean Freight Capabilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center shrink-0">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-[#1b4d27]">
                  Corrugated Carton Boxes
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Ideal for retail BBQ briquettes and restaurant-grade products with custom color inner boxes.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-[#1b4d27]">
                  Kraft Multiwall Paper Bags
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Multi-ply kraft bags (2.5 kg, 5.0 kg, 10 kg, 25 kg) for clean distribution and retail storage.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-xs flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center shrink-0">
                <Ship className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-[#1b4d27]">
                  PP Jumbo Bags &amp; Bulk FCL
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Heavy 500kg &amp; 1000kg FIBC jumbo bags on heat-treated ISPM-15 export wooden pallets.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1b4d27] text-white rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <h4 className="font-heading text-lg font-bold text-[#f5b342]">
                Need a Custom Packaging or Container Stuffing Specification?
              </h4>
              <p className="text-xs text-white/80 max-w-2xl">
                Our export logistics division handles full container stuffing (FCL), fumigation certificates, bill of lading (B/L) issuance, and Certificate of Origin with official chamber legalization.
              </p>
            </div>
            <a
              href="#contact"
              className="bg-[#f5b342] hover:bg-[#e09f30] text-[#172e18] font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition shadow-md whitespace-nowrap"
            >
              Consult Logistics Desk
            </a>
          </div>
        </div>
      </div>

      {/* Certificate Inspection Modal */}
      {activeModal === 'cert-detail' && selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg p-5 sm:p-8 shadow-2xl border border-[#e3ede0] animate-in zoom-in-95 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#2a6e3a] shrink-0" />
                <span className="font-heading font-bold text-sm sm:text-base text-[#1b4d27] truncate">
                  Official Accreditation Inspection
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Certificate Title</span>
                <h4 className="font-bold text-base text-[#1b4d27]">{selectedCert.name}</h4>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#f9fbf7] p-3.5 rounded-2xl border border-[#e3ede0]">
                <div>
                  <span className="text-gray-400 block">Document ID:</span>
                  <span className="font-mono font-bold text-[#1b4d27]">{selectedCert.documentNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Accreditation Code:</span>
                  <span className="font-mono font-bold text-[#1b4d27]">{selectedCert.code}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Issue Date:</span>
                  <span className="font-semibold text-gray-800">{selectedCert.issueDate}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Valid Until:</span>
                  <span className="font-semibold text-[#2a6e3a]">{selectedCert.validUntil}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Audited Scope &amp; Compliance</span>
                <p className="text-gray-700 leading-relaxed mt-1">
                  {selectedCert.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-gray-400 block">Auditing Body</span>
                <p className="font-semibold text-gray-800 mt-0.5">{selectedCert.issuer} ({selectedCert.accreditedBody})</p>
              </div>

              <div className="bg-[#e8f3e2] p-3 rounded-xl border border-[#cbe1c3] flex items-center gap-2 text-[#1b4d27] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#2a6e3a]" />
                <span>Verified in Good Standing with Regulatory Registry</span>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="bg-[#2a6e3a] hover:bg-[#1b4d27] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
