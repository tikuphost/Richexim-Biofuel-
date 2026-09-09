import React from 'react';
import {
  Building2,
  ShieldCheck,
  Globe,
  Leaf,
  Award,
  Users,
  Factory,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Ship,
  Sparkles,
  Layers,
  Scale,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutUs: React.FC = () => {
  const { setCurrentPage, setActiveModal } = useApp();

  const leadershipTeam = [
    {
      name: 'Rajiv C. Kulkarni',
      role: 'Managing Director & CEO',
      experience: '28+ Years in Bulk Commodities & Global Trade',
      bio: 'Pioneered the Richexim Group expansion into sustainable solid fuels and cross-border maritime supply chain networks across the EMEA and Asia-Pacific corridors.'
    },
    {
      name: 'Dr. Evelyn Martinez-Dass',
      role: 'Chief Quality & Technical Officer',
      experience: 'Ph.D. in Fuel Chemistry & Combustion Engineering',
      bio: 'Oversees in-house proximate analysis laboratories and ensures every export consignment complies strictly with ISO 17225, ASTM D5865, and SGS pre-shipment standards.'
    },
    {
      name: 'Alok N. Varma',
      role: 'Head of Global Supply Chain & Ocean Logistics',
      experience: '19+ Years in Chartering & FCL/Bulk Freight',
      bio: 'Directs port logistics, automated stuffing docks at JNPT and Cochin Port, and manages chartered vessel commitments under FOB, CIF, and CFR trade rules.'
    },
    {
      name: 'Sunita Mehra',
      role: 'Director of ESG & Sustainability Compliance',
      experience: 'Specialist in EUDR, FSC CoC & Carbon Offsetting',
      bio: 'Drives the venture’s zero-deforestation upstream sourcing contracts, empowering 12,000+ agro-producers through responsible crop residue upcycling.'
    }
  ];

  const milestones = [
    {
      year: '1994',
      title: 'Foundation of Richexim Group',
      description: 'Established in Mumbai as an international trading house handling high-grade metallurgical coke and industrial mineral commodities.'
    },
    {
      year: '2008',
      title: 'Biomass & Renewable Solid Fuels Division',
      description: 'Launched dedicated biomass briquetting and agro-residue densification plants to service heavy industrial boilers seeking fossil-fuel alternatives.'
    },
    {
      year: '2016',
      title: 'ISO & Global Quality Accreditations',
      description: 'Secured ISO 9001:2015, ISO 14001:2015, and certified third-party testing partnership with SGS, Bureau Veritas, and Intertek.'
    },
    {
      year: '2021',
      title: 'Port-Side Hub Infrastructure & Expansion',
      description: 'Commissioned automated dehumidified warehouses and high-speed container stuffing operations at Nhava Sheva (JNPT) and Cochin International Seaport.'
    },
    {
      year: '2024-Present',
      title: 'Global Export Milestone & Decarbonization Hub',
      description: 'Supplying over 650,000 Metric Tons annually to cement kilns, steel mills, thermal power producers, and chemical complexes in 34 countries.'
    }
  ];

  const certifications = [
    {
      name: 'ISO 9001:2015',
      authority: 'Quality Management Systems',
      detail: 'Certified manufacturing, quality assurance, and export logistics protocols.'
    },
    {
      name: 'ISO 14001:2015',
      authority: 'Environmental Management',
      detail: 'Standardized zero-discharge production and audited ecological footprint controls.'
    },
    {
      name: 'FSC Chain of Custody',
      authority: 'Forest Stewardship Council',
      detail: '100% traceable, sustainably harvested wood residues and non-forest biomass feedstocks.'
    },
    {
      name: 'EUDR & REACH Compliant',
      authority: 'European Union Regulations',
      detail: 'Full compliance for bio-coal, pellets, and bio-carbon entering European port borders.'
    },
    {
      name: 'SGS & Intertek Warranted',
      authority: 'Independent Inspection',
      detail: 'Guaranteed independent certificate of analysis (COA) for calorific value, moisture, and ash.'
    },
    {
      name: 'ISPM-15 Export Packaging',
      authority: 'International Phytosanitary',
      detail: 'Heat-treated and fumigated pallets, jumbo bags, and anti-humidity moisture barrier liners.'
    }
  ];

  return (
    <div className="bg-[#f9fbf7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Banner / Corporate Overview */}
        <div className="relative rounded-3xl overflow-hidden bg-radial from-[#22572f] via-[#1b4d27] to-[#12361b] text-white p-5 sm:p-10 lg:p-16 shadow-xl border border-[#2e6d3c]">
          <div className="max-w-3xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#f5b342]/15 border border-[#f5b342]/30 text-[#f5b342] text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              Corporate Profile &amp; Heritage
            </div>

            <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Leading the Global Transition to Clean Industrial Biomass Solid Fuels
            </h1>

            <p className="text-xs sm:text-base text-white/90 leading-relaxed font-normal">
              Richmount Metallic &amp; Allied Exporters Pvt. Ltd. is the premier international export and supply chain subsidiary of the <strong>Richexim Group</strong>. We bridge agro-forestry biomass abundance with energy-intensive industrial powerhouses across Europe, the Middle East, Southeast Asia, and the Americas.
            </p>

            <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCurrentPage('products')}
                className="bg-[#f5b342] hover:bg-[#e09f2e] text-[#172e18] px-6 py-3 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center"
              >
                <span>Explore Export Commodity Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveModal('rfq')}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center"
              >
                <Scale className="w-4 h-4 text-[#f5b342]" />
                <span>Submit RFQ for Admin Tariff</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Float */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <span className="font-heading text-2xl sm:text-4xl font-extrabold text-[#f5b342] block">650K+</span>
              <span className="text-[11px] sm:text-xs text-white/80 font-medium">Metric Tons Annual Export</span>
            </div>
            <div>
              <span className="font-heading text-2xl sm:text-4xl font-extrabold text-[#f5b342] block">34+</span>
              <span className="text-[11px] sm:text-xs text-white/80 font-medium">Destination Port Markets</span>
            </div>
            <div>
              <span className="font-heading text-2xl sm:text-4xl font-extrabold text-[#f5b342] block">100%</span>
              <span className="text-[11px] sm:text-xs text-white/80 font-medium">SGS / COA Inspected</span>
            </div>
            <div>
              <span className="font-heading text-2xl sm:text-4xl font-extrabold text-[#f5b342] block">30+</span>
              <span className="text-[11px] sm:text-xs text-white/80 font-medium">Years of Group Integrity</span>
            </div>
          </div>
        </div>

        {/* Corporate Mission, Vision, and Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#e3ede0] shadow-xs space-y-4 hover:border-[#2a6e3a] transition">
            <div className="w-12 h-12 rounded-2xl bg-[#e8f3e2] text-[#1b4d27] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-[#2a6e3a]" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#1b4d27]">Our Mission</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              To supply heavy industry—cement kilns, steel mills, paper complexes, and thermal power plants—with certified, high-energy biomass solid fuels that slash carbon intensity, eliminate sulfur emissions, and reduce dependency on imported thermal fossil coal.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#e3ede0] shadow-xs space-y-4 hover:border-[#2a6e3a] transition">
            <div className="w-12 h-12 rounded-2xl bg-[#e8f3e2] text-[#1b4d27] flex items-center justify-center">
              <Globe className="w-6 h-6 text-[#2a6e3a]" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#1b4d27]">Global Vision</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              To be the most reliable, transparent, and technologically advanced bulk biomass export subsidiary in the global trade arena, guaranteeing consistent gross calorific value, moisture discipline, and uninterrupted ocean vessel dispatch schedules.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#e3ede0] shadow-xs space-y-4 hover:border-[#2a6e3a] transition">
            <div className="w-12 h-12 rounded-2xl bg-[#e8f3e2] text-[#1b4d27] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#2a6e3a]" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#1b4d27]">Core Philosophy</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Zero tolerance for moisture or ash deviations. We believe industrial procurement teams deserve complete predictability. Every shipment is bound by legal Certificate of Analysis warranties verified by independent maritime surveyors before bill of lading issuance.
            </p>
          </div>
        </div>

        {/* Our Heritage & Timeline */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e3ede0] shadow-xs space-y-8">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase font-bold text-[#2a6e3a] tracking-wider block mb-1">
              Decades of International Trade Excellence
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1b4d27]">
              The Richexim Group Heritage &amp; Milestone Timeline
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              From our early foundations in raw commodities to an internationally certified bio-energy export powerhouse.
            </p>
          </div>

          <div className="relative border-l-2 border-[#2a6e3a]/30 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
            {milestones.map((m, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 rounded-full bg-white border-4 border-[#2a6e3a] flex items-center justify-center group-hover:scale-110 transition"></div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-[#2a6e3a] bg-[#e8f3e2] px-2.5 py-0.5 rounded-md">
                      {m.year}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">{m.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure & Port Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#f0f7eb] p-8 sm:p-12 rounded-3xl border border-[#cbe1c3]">
          <div className="space-y-6">
            <span className="text-[11px] uppercase font-bold text-[#2a6e3a] tracking-wider block">
              Logistics Superiority
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1b4d27]">
              Port-Side Consolidation &amp; Automated Stuffing Facilities
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Logistics delays in bulk commodity trade can cripple buyer production schedules. Richmount maintains strategic multi-acre port consolidation yards immediately adjacent to India’s primary international sea terminals:
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2a6e3a] shrink-0 mt-0.5" />
                <span>
                  <strong>Nhava Sheva (JNPT Mumbai) Gateway:</strong> 85,000 MT dry storage capacity with continuous overhead conveyor stuffing into 20ft &amp; 40ft HC containers.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2a6e3a] shrink-0 mt-0.5" />
                <span>
                  <strong>Cochin Port Deep-Water Facility:</strong> Dedicated to coconut-shell bio-carbon and torrefied briquette export to the Middle East and European ports.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2a6e3a] shrink-0 mt-0.5" />
                <span>
                  <strong>In-House Testing Laboratory:</strong> Continuous Bomb Calorimetry, Moisture Analyzers, and CHNS elemental profiling for immediate batch certification.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2a6e3a] shrink-0 mt-0.5" />
                <span>
                  <strong>Container &amp; Breakbulk Flexibility:</strong> Capability to handle full container loads (FCL), 1-ton jumbo bags, or chartered breakbulk bulk carriers up to 35,000 DWT.
                </span>
              </li>
            </ul>

            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#cbe1c3] text-xs font-bold text-[#1b4d27]">
                <Ship className="w-4 h-4 text-[#2a6e3a]" />
                <span>Major Shipping Lines: Maersk, MSC, Hapag-Lloyd, CMA CGM</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#cbe1c3] shadow-sm space-y-6">
            <h3 className="font-heading text-lg font-bold text-[#1b4d27] border-b border-gray-100 pb-3 flex items-center gap-2">
              <Factory className="w-5 h-5 text-[#2a6e3a]" />
              Production &amp; Densification Quality Thresholds
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-[#f9fbf7] rounded-xl border border-[#e3ede0]">
                <div className="flex justify-between font-bold text-[#1b4d27] mb-1">
                  <span>High-Pressure Piston Press Densification</span>
                  <span>1,200 kg/cm²</span>
                </div>
                <p className="text-gray-600 text-[11px]">
                  Briquettes are hydraulically compacted without chemical binders, ensuring clean non-slagging flue gas.
                </p>
              </div>

              <div className="p-3.5 bg-[#f9fbf7] rounded-xl border border-[#e3ede0]">
                <div className="flex justify-between font-bold text-[#1b4d27] mb-1">
                  <span>Automated Rotary Drum Drying</span>
                  <span>Moisture &lt; 7.5%</span>
                </div>
                <p className="text-gray-600 text-[11px]">
                  Raw agro-biomass undergoes multi-stage thermal conditioning to lock in ultra-low moisture retention during ocean voyage.
                </p>
              </div>

              <div className="p-3.5 bg-[#f9fbf7] rounded-xl border border-[#e3ede0]">
                <div className="flex justify-between font-bold text-[#1b4d27] mb-1">
                  <span>Pyrolysis &amp; Carbonization Retorts</span>
                  <span>Fixed Carbon &gt; 75%</span>
                </div>
                <p className="text-gray-600 text-[11px]">
                  High-temperature oxygen-starved carbonization producing bio-coal briquettes equivalent to Grade-A metallurgical anthracite.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Board & Leadership Team */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-[11px] uppercase font-bold text-[#2a6e3a] tracking-wider block mb-1">
              Governance &amp; Accountability
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1b4d27]">
              Executive Management &amp; Technical Leadership
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Combining decades of bulk commodity maritime trade with cutting-edge combustion and materials engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((leader, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-xs flex flex-col justify-between hover:shadow-md transition group"
              >
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#1b4d27] text-white flex items-center justify-center font-heading font-extrabold text-xl shadow-xs group-hover:bg-[#2a6e3a] transition">
                    {leader.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-[#1b4d27] text-base">{leader.name}</h3>
                    <p className="text-xs font-semibold text-[#2a6e3a]">{leader.role}</p>
                    <span className="text-[10px] text-gray-400 font-mono block mt-0.5">{leader.experience}</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Accreditations & Compliance Grid */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e3ede0] shadow-xs space-y-8">
          <div className="max-w-2xl">
            <span className="text-[11px] uppercase font-bold text-[#2a6e3a] tracking-wider block mb-1">
              Certified Assurance
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1b4d27]">
              International Quality Standards &amp; Certifications
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Our export consignments strictly conform to international maritime, phytosanitary, and combustion testing benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#f9fbf7] border border-[#e3ede0] space-y-2 hover:border-[#2a6e3a] transition"
              >
                <div className="flex items-center gap-2 text-[#1b4d27]">
                  <Award className="w-5 h-5 text-[#2a6e3a]" />
                  <h3 className="font-bold text-sm">{cert.name}</h3>
                </div>
                <span className="text-[11px] text-gray-500 font-semibold block uppercase tracking-wider">
                  {cert.authority}
                </span>
                <p className="text-xs text-gray-600 leading-relaxed">{cert.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct CTA Bar */}
        <div className="bg-[#1b4d27] rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-heading text-xl sm:text-2xl font-bold">
              Ready to Secure High-Grade Biomass Fuel Cargo?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              Connect with our International Sales Desk to receive an official proforma quote, schedule container stuffing, or request sample dispatch.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveModal('rfq')}
              className="bg-[#f5b342] hover:bg-[#e09f2e] text-[#172e18] px-5 py-2.5 rounded-xl font-bold text-xs transition shadow-md cursor-pointer"
            >
              Request Custom RFQ
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('contact')}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-semibold text-xs border border-white/20 transition cursor-pointer"
            >
              Contact Sales Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
