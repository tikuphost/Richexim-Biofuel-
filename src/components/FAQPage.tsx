import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ShieldCheck,
  Globe2,
  FileCheck2,
  Anchor,
  Flame,
  CreditCard,
  Package,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FAQItem {
  id: string;
  category: 'Incoterms & Shipping' | 'Quality & Lab COA' | 'Payment & L/C' | 'Custom Formulations' | 'Packaging & MOQ' | 'EU Regulations';
  question: string;
  answer: string;
  tags: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Incoterms & Shipping',
    question: 'Which international trade Incoterms do you support for export contracts?',
    answer: 'We routinely issue commercial contracts under Incoterms 2020 including CIF (Cost, Insurance & Freight), CFR (Cost & Freight), FOB (Free On Board Nhava Sheva / Cochin / Mundra ports), EXW (Ex-Works factory gate), and DAP (Delivered at Place) for select European and GCC industrial terminals. Our maritime chartering desk manages containerized FCL and breakbulk vessel fixtures.',
    tags: ['Incoterms', 'CIF', 'FOB', 'Maritime', 'JNPT']
  },
  {
    id: 'faq-2',
    category: 'Packaging & MOQ',
    question: 'What is the Minimum Order Quantity (MOQ) for international container shipments?',
    answer: 'Our standard export MOQ is 1 x 20ft FCL (approximately 18 to 22 Metric Tons depending on commodity density and bag specification) or 1 x 40ft HC FCL (approx. 25 to 28 MT). For trial industrial boiler testing and laboratory evaluations, palletized LCL air/sea sample consignments can be arranged upon commercial request.',
    tags: ['MOQ', 'FCL', 'Container', 'Tonnage', 'Samples']
  },
  {
    id: 'faq-3',
    category: 'Quality & Lab COA',
    question: 'What laboratory testing and inspection certificates accompany every export shipment?',
    answer: 'Every export container lot is provided with an official Certificate of Analysis (COA) containing bomb calorimetry (ASTM D5865), proximate analysis (moisture, ash content, volatile matter, fixed carbon), and ultimate elemental analysis (C, H, N, S, O). We offer independent pre-shipment sampling and testing by globally recognized surveyors (SGS, Bureau Veritas, or Intertek), accompanied by Phytosanitary Fumigation certificates and Chamber of Commerce Legalized Certificates of Origin.',
    tags: ['COA', 'ASTM', 'SGS', 'Calorific', 'Fumigation']
  },
  {
    id: 'faq-4',
    category: 'Custom Formulations',
    question: 'Can you formulate custom biomass fuel blends for specific industrial boiler designs?',
    answer: 'Yes. Our specialized blending facility calibrates particle sizes (5mm to 90mm), gross calorific value (3,800 to 7,500 kcal/kg), and high ash fusion temperatures (>1280°C) tailored specifically for FBC (Fluidized Bed Combustion), AFBC, CFBC, and Stoker industrial boilers. Blending saw-dust, groundnut husk, and torrefied bio-coal prevents clinkering and boiler tube slagging.',
    tags: ['Boilers', 'AFBC', 'CFBC', 'Slagging', 'Calorific']
  },
  {
    id: 'faq-5',
    category: 'Payment & L/C',
    question: 'What are standard international commercial payment terms for export orders?',
    answer: 'Our primary export payment structures are: 1) 30% Advance T/T upon contract signing with 70% against emailed non-negotiable Bill of Lading (B/L) and SGS inspection certificate, or 2) 100% Irrevocable Confirmed Letter of Credit (L/C) at Sight from prime international tier-1 banks conforming to ICC UCP 600 regulations.',
    tags: ['Payment', 'Letter of Credit', 'T/T', 'Trade Finance', 'UCP 600']
  },
  {
    id: 'faq-6',
    category: 'Packaging & MOQ',
    question: 'What export packaging configurations are available for pellets and briquettes?',
    answer: 'We provide heavy-duty export packaging designed to withstand oceanic humidity: 1) 1,000 kg UV-stabilized PP Jumbo Bags with bottom discharge spouts and moisture barrier liners, 2) 25 kg / 50 kg multi-wall PP woven bags on heat-treated ISPM-15 wooden pallets, 3) 15 kg PE retail-ready transparent bags with barcode labelling, and 4) Full container bulk liner bags for mechanized pneumatic discharge.',
    tags: ['Packaging', 'Jumbo Bags', 'ISPM-15', 'Pallets', 'Bulk']
  },
  {
    id: 'faq-7',
    category: 'EU Regulations',
    question: 'Are your biomass fuels compliant with EU CBAM (Carbon Border Adjustment Mechanism) & EUDR?',
    answer: 'Yes. All Richmount Exim solid biofuels are sourced from certified agricultural residuals and sawmill co-products without deforestation risk. We provide comprehensive carbon accounting dossiers specifying embedded emissions data per Metric Ton, ensuring seamless compliance with European Union CBAM transitional registries and EUDR timber traceability standards.',
    tags: ['CBAM', 'EUDR', 'Carbon Footprint', 'Decarbonization', 'Europe']
  },
  {
    id: 'faq-8',
    category: 'Incoterms & Shipping',
    question: 'What is the standard production lead time and maritime transit duration?',
    answer: 'Standard manufacturing and port staging lead time is 7 to 12 business days from confirmed order / operative L/C. Ocean transit from Nhava Sheva (JNPT Mumbai) is approximately 18–24 days to Western European ports (Rotterdam, Antwerp, Hamburg), 4–6 days to GCC ports (Jebel Ali, Dammam), and 10–14 days to Southeast Asian terminals (Singapore, Port Klang).',
    tags: ['Lead Time', 'Transit', 'Shipping', 'Rotterdam', 'Jebel Ali']
  }
];

export const FAQPage: React.FC = () => {
  const { setCurrentPage, setActiveModal } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const categories = [
    'All',
    'Incoterms & Shipping',
    'Quality & Lab COA',
    'Payment & L/C',
    'Custom Formulations',
    'Packaging & MOQ',
    'EU Regulations'
  ];

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#f9fbf7] text-[#172e18]">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#112415] via-[#172e18] to-[#1e3c20] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f5b342_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#f5b342] font-semibold mb-4">
            <button
              type="button"
              onClick={() => setCurrentPage('home')}
              className="hover:underline cursor-pointer"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-white/80">Frequently Asked Questions</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#2a6e3a]/50 text-[#f5b342] text-xs font-extrabold px-3 py-1 rounded-full border border-[#2a6e3a] mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>International Trade Knowledge Base</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Frequently Asked Questions (FAQ)
            </h1>
            <p className="text-white/85 text-sm sm:text-base mt-4 leading-relaxed">
              Clear technical guidelines, maritime shipping protocols, ASTM laboratory inspection standards, and payment instruments for international buyers importing solid fuels and activated carbon.
            </p>

            {/* Live Search Bar */}
            <div className="mt-8 relative max-w-xl">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Incoterms, MOQ, ASTM lab COA, payment terms..."
                className="w-full bg-white text-xs sm:text-sm text-[#172e18] placeholder-gray-500 pl-11 pr-4 py-3.5 rounded-2xl shadow-xl border-2 border-[#f5b342] focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-700 bg-gray-100 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main FAQ Content Section */}
      <section className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap border ${
                selectedCategory === cat
                  ? 'bg-[#1b4d27] text-white border-[#1b4d27] shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-[#f4f7ee] border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
          <span>
            Showing <strong>{filteredFaqs.length}</strong> questions
            {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </span>
          {selectedCategory !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="text-[#2a6e3a] hover:underline cursor-pointer"
            >
              Reset Category
            </button>
          )}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 max-w-4xl">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#e3ede0] space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-[#172e18]">No matching questions found</h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                We couldn’t find an answer for "{searchQuery}". Send your specific inquiry to our international trade engineering desk.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="bg-[#1b4d27] text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                View All Questions
              </button>
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#e3ede0] overflow-hidden shadow-2xs hover:shadow-xs transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 font-heading font-bold text-sm sm:text-base text-[#172e18] hover:bg-[#fbfdfa] transition cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#e8f3e2] text-[#2a6e3a] flex items-center justify-center shrink-0 mt-0.5">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span>{item.question}</span>
                        <div className="flex items-center gap-2 mt-1 text-[11px] font-normal text-gray-500">
                          <span className="text-[#2a6e3a] font-semibold">{item.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                      <ChevronDown
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#2a6e3a]' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-2 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-gray-100 bg-[#f9fbf7]/60">
                      <p>{item.answer}</p>
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-200">
                          {item.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] bg-white text-gray-600 px-2 py-0.5 rounded-md border border-gray-200"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Commercial Inquiry Callout Card */}
        <div className="mt-16 bg-gradient-to-r from-[#172e18] to-[#244b26] rounded-3xl p-6 sm:p-10 text-white shadow-xl max-w-4xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#f5b342] text-[#172e18] text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider mb-2">
                Commercial Trade Desk
              </div>
              <h3 className="font-heading text-lg sm:text-2xl font-black text-white">
                Have a customized commodity or logistics requirement?
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-xl">
                Our export managers provide formal proforma quotations, container allocation schedules, and laboratory technical data sheets within 24 hours.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveModal('rfq')}
                className="bg-[#f5b342] hover:bg-[#e5a432] text-[#112415] text-xs font-extrabold px-6 py-3 rounded-xl transition shadow-md cursor-pointer whitespace-nowrap text-center"
              >
                Request Quotation (RFQ)
              </button>
              <a
                href="mailto:info@richexim.com?subject=Export%20FAQ%20Inquiry%20-%20Richmount%20Exim"
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-5 py-3 rounded-xl transition border border-white/20 whitespace-nowrap text-center"
              >
                Email Sales Desk
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
