import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Tag,
  Share2,
  CheckCircle2,
  FileText,
  TrendingUp,
  Flame,
  Ship,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: 'Energy Transition' | 'Technical Combustion' | 'Maritime Logistics' | 'Carbon Markets' | 'Quality Standards';
  readTime: string;
  publishDate: string;
  author: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  featured?: boolean;
  content: string[];
  keyTakeaways: string[];
  relatedCommodity?: string;
}

export const Blog: React.FC = () => {
  const { setCurrentPage, setActiveModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [subscribedEmail, setSubscribedEmail] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const categories = [
    'All',
    'Energy Transition',
    'Technical Combustion',
    'Maritime Logistics',
    'Carbon Markets',
    'Quality Standards'
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 'cbam-2026-biomass-transition',
      title: 'Navigating the 2026 EU CBAM Directive: How Heavy Industry is Replacing Fossil Coal with Torrefied Biomass',
      slug: 'cbam-2026-biomass-transition',
      excerpt: 'As the European Union Carbon Border Adjustment Mechanism enters full enforcement, steel mills and cement kilns face unprecedented carbon tariffs. Learn why densified agro-biomass briquettes offer the most cost-effective compliance pathway.',
      category: 'Carbon Markets',
      readTime: '6 min read',
      publishDate: 'September 2026',
      author: {
        name: 'Sunita Mehra',
        role: 'Director of ESG & Sustainability Compliance',
        avatarInitials: 'SM'
      },
      featured: true,
      relatedCommodity: 'Torrefied Bio-Coal Briquettes (7,500 kcal/kg)',
      keyTakeaways: [
        'CBAM certificates will equalize the carbon price paid for EU domestic production and imported industrial goods.',
        'Substituting 20% of thermal coal with torrefied biomass can decrease direct Scope-1 emissions by up to 22%.',
        'Certified high-density briquettes avoid costly boiler retrofits compared to raw wood chips.'
      ],
      content: [
        'The transition towards low-carbon industrial thermal energy is no longer an optional ESG milestone; it has become a hard fiscal mandate under the European Union Carbon Border Adjustment Mechanism (CBAM). For heavy energy consumers in metals, ceramics, paper, and chemicals, direct thermal coal combustion is incurring mounting financial penalties.',
        'Industrial briquettes produced from agricultural residues—such as groundnut shell, mustard crop stalks, and sawdust—exhibit near-zero net fossil carbon emissions when audited under the EU Renewable Energy Directive (RED II & III). Because biomass absorbs atmospheric carbon dioxide during photosynthetic growth, emissions released upon combustion are categorized as biogenic carbon.',
        'Crucially, torrefied biomass briquettes possess an energy density exceeding 7,200 to 7,600 kcal/kg, approaching the performance parameters of Russian and South African thermal coal. Furthermore, their hydrophobic properties ensure that bulk maritime shipping across 20-30 day ocean routes does not result in moisture reabsorption or fungal degradation in cargo holds.'
      ]
    },
    {
      id: 'boiler-clinker-slagging-mitigation',
      title: 'Mitigating Boiler Clinker & Slagging: The Chemistry of Biomass Ash Melting Temperatures',
      slug: 'boiler-clinker-slagging-mitigation',
      excerpt: 'High alkali content in low-grade biomass often leads to severe furnace slagging. Discover how engineered blending of sawdust with low-silica mustard husk stabilizes the ash fusion temperature above 1,250°C.',
      category: 'Technical Combustion',
      readTime: '8 min read',
      publishDate: 'August 2026',
      author: {
        name: 'Dr. Evelyn Martinez-Dass',
        role: 'Chief Quality Officer',
        avatarInitials: 'EM'
      },
      relatedCommodity: 'Industrial Sawdust Briquettes (75mm)',
      keyTakeaways: [
        'Alkali metals (potassium and sodium) reduce ash fusion temperature, causing refractory fouling.',
        'Engineered briquetting maintains potassium oxide (K2O) concentrations strictly below 12% in total ash.',
        'Periodic proximate analysis ensures consistent volatile matter release and prevents localized hot spots.'
      ],
      content: [
        'When industrial plant managers evaluate substituting coal with biomass, their primary apprehension is boiler tube fouling, sintering, and clinker formation. Uncontrolled clinker deposits severely restrict heat transfer efficiency and can force emergency plant shutdowns costing hundreds of thousands of dollars.',
        'The root chemical cause is the presence of volatile alkali metals—principally potassium (K) and sodium (Na)—which react with silica (SiO2) in the ash matrix to form low-melting-point eutectic silicates that soften at temperatures as low as 850°C.',
        'At Richmount Metallic & Allied Exporters, our manufacturing formulation counteracts this phenomenon by strictly maintaining a high Calcium-to-Potassium ratio and blending agro-substrates with woody hardwood lignins. By measuring Ash Fusion Temperatures (AFT) via automated ASTM D1857 testing, our exported briquettes guarantee deformation temperatures exceeding 1,250°C, ensuring clean fluidized-bed and grate-fired boiler operation.'
      ]
    },
    {
      id: 'cif-vs-fob-ocean-freight-hedging',
      title: 'CIF vs. FOB Incoterms in Bulk Maritime Trade: Managing Freight Volatility on Asian & European Shipping Lanes',
      slug: 'cif-vs-fob-ocean-freight-hedging',
      excerpt: 'Ocean container and bulk vessel charter rates have experienced dramatic volatility. An in-depth analysis of when international buyers should purchase on FOB Nhava Sheva vs. CIF Rotterdam or Jebel Ali terms.',
      category: 'Maritime Logistics',
      readTime: '5 min read',
      publishDate: 'July 2026',
      author: {
        name: 'Alok N. Varma',
        role: 'Head of Global Supply Chain',
        avatarInitials: 'AV'
      },
      relatedCommodity: 'Groundnut Shell Briquettes (Export Grade)',
      keyTakeaways: [
        'FOB allows global buyers to integrate cargo into existing enterprise master freight agreements.',
        'CIF shifts detention, demurrage, and marine voyage risk to the exporter until vessel discharge.',
        'Pre-booking FCL container space 45 days in advance locks in maritime tariff predictability.'
      ],
      content: [
        'In cross-border commodity procurement, the choice of Incoterm governs not merely who pays the ocean carrier, but who bears the financial risk of vessel congestion, bunker fuel surcharges (BAF), and geopolitical route diversions.',
        'Under FOB (Free on Board) Nhava Sheva or Cochin Port terms, our commercial desk handles inland transport, phytosanitary fumigation, port customs clearance, and container stuffing. Once cargo crosses the vessel ship rail, the buyer’s freight forwarder assumes control. This is favored by multinational trading houses with contracted global container allocations.',
        'Conversely, for end-user industrial plants that prefer predictable landed costs at their destination terminal (such as Port of Rotterdam, Hamburg, or Jebel Ali), our CIF (Cost, Insurance, and Freight) contracts provide turnkey certainty. We secure Institute Cargo Clauses (ICC A) all-risk marine cover and maintain long-term contract rates with tier-one carriers like Maersk and MSC.'
      ]
    },
    {
      id: 'coconut-shell-charcoal-metallurgical-specs',
      title: 'High-Density Coconut Shell Charcoal: Why Metallurgical Smelters & Filter Media Manufacturers Prefer It',
      slug: 'coconut-shell-charcoal-metallurgical-specs',
      excerpt: 'With fixed carbon exceeding 78% and ash content below 3%, carbonized coconut shell is the world gold-standard for specialty steel recarburizers and ultra-high-surface-area activated carbon manufacturing.',
      category: 'Quality Standards',
      readTime: '7 min read',
      publishDate: 'July 2026',
      author: {
        name: 'Rajiv C. Kulkarni',
        role: 'Managing Director',
        avatarInitials: 'RK'
      },
      relatedCommodity: 'Coconut Shell Carbonized Charcoal',
      keyTakeaways: [
        'Coconut shell carbon possesses superior mechanical hardness (over 95%), minimizing crushing fines during transit.',
        'Low sulfur content (< 0.1%) prevents sulfur embrittlement in specialty alloy steel manufacturing.',
        'The natural microporous structure achieves iodine absorption numbers upwards of 1,000 mg/g when activated.'
      ],
      content: [
        'Unlike mineral coal or petroleum-derived coke, pyrolyzed coconut shell charcoal is characterized by an extraordinarily dense microporous structure, minimal volatile matter, and virtually zero sulfur contamination.',
        'In induction furnace steel manufacturing and non-ferrous foundry melting, our coconut shell charcoal is employed as an ultra-pure carbon raiser. Its rapid dissolution rate in molten iron guarantees homogenous carbon assimilation without introducing phosphorus or sulfur impurities that degrade tensile strength.',
        'Furthermore, for water and gas purification corporations, our raw carbonized coconut shell provides the optimal starting material for steam activation. When processed into granular activated carbon, it yields internal surface areas ranging between 950 and 1,200 m²/g, capable of stripping complex volatile organic compounds (VOCs) and heavy metals.'
      ]
    },
    {
      id: 'eudr-deforestation-compliance-2026',
      title: 'Complying with the EU Deforestation Regulation (EUDR): Geolocation & Traceability in Biomass Supply Chains',
      slug: 'eudr-deforestation-compliance-2026',
      excerpt: 'From polygon geolocation mapping to FSC Chain of Custody records, discover how Richmount certifies that every metric ton of exported biomass is 100% compliant with mandatory European timber & crop regulations.',
      category: 'Energy Transition',
      readTime: '6 min read',
      publishDate: 'June 2026',
      author: {
        name: 'Sunita Mehra',
        role: 'Director of ESG & Sustainability',
        avatarInitials: 'SM'
      },
      relatedCommodity: 'Torrefied Wood Pellets (6mm)',
      keyTakeaways: [
        'EUDR requires GPS coordinate mapping of all land parcels where forest or agricultural residues originated.',
        'Strict due diligence statements must be registered on the European Commission TRACES-NT portal.',
        'Richmount maintains fully audited chain-of-custody documentation tracing each lot to verified agro-cooperatives.'
      ],
      content: [
        'The enactment of Regulation (EU) 2023/1115 (EUDR) has fundamentally reshaped commodity imports into the European Single Market. Importers and traders can no longer rely on self-declarations or vague regional sourcing claims.',
        'Under EUDR, every consignment of wood pellets, charcoal, or cellulose-derived solid fuel must be linked to precise geographic coordinates of the plots of land where the biomass was cultivated or harvested after December 31, 2020.',
        'At Richmount Metallic & Allied Exporters, our upstream agro-aggregation network is digitally integrated with GPS polygon boundaries across 45 verified agricultural farmer producer organizations (FPOs). Every export bill of lading is accompanied by a verifiable TRACES reference number, ensuring frictionless customs clearance across all European ports.'
      ]
    },
    {
      id: 'gcv-vs-ncv-in-biomass-contracts',
      title: 'Deciphering GCV vs. NCV: The Commercial Buyer’s Guide to Biomass Calorific Value Calculations',
      slug: 'gcv-vs-ncv-in-biomass-contracts',
      excerpt: 'Do not overpay for latent moisture! Learn the mathematical difference between Gross Calorific Value (Higher Heating Value) and Net Calorific Value (Lower Heating Value) when evaluating international export proformas.',
      category: 'Quality Standards',
      readTime: '5 min read',
      publishDate: 'May 2026',
      author: {
        name: 'Dr. Evelyn Martinez-Dass',
        role: 'Chief Quality Officer',
        avatarInitials: 'EM'
      },
      relatedCommodity: 'Mustard Husk Biomass Briquettes (90mm)',
      keyTakeaways: [
        'Gross Calorific Value (GCV) assumes that moisture in flue gas is condensed back to liquid water.',
        'Net Calorific Value (NCV) accounts for the heat lost in evaporating moisture and water formed from hydrogen combustion.',
        'Always demand ASTM D5865 or ISO 1928 bomb calorimetry reports on an “As-Received” (ARB) basis.'
      ],
      content: [
        'In the commercial negotiation of bulk solid fuels, a frequent source of misunderstanding between procurement managers and commodity brokers is the distinction between Gross Calorific Value (GCV / HHV) and Net Calorific Value (NCV / LHV).',
        'When a laboratory combusts a test sample inside an oxygen bomb calorimeter, the water vapor produced by combustion is condensed back to room temperature. This releases the latent heat of vaporization (~586 kcal/kg of water), resulting in the higher GCV figure.',
        'However, in real-world industrial boilers, flue gases exit the stack at temperatures between 130°C and 180°C. That water vapor never condenses, and that latent heat is lost to the atmosphere. Therefore, the actual useful heat delivered to the steam cycle is the NCV.',
        'At Richmount, our standard proformas and Certificate of Analysis (COA) transparently declare both GCV and NCV on both Air-Dried (ADB) and As-Received (ARB) bases, allowing your plant engineering team to verify exact gigajoule-per-dollar energy economics.'
      ]
    },
    {
      id: 'gac-gold-recovery-cil-cip-specs',
      title: 'Granular Activated Carbon (GAC) in Precious Metal Recovery: Gold Leaching (CIL/CIP) & Iodine Rating Benchmarks',
      slug: 'gac-gold-recovery-cil-cip-specs',
      excerpt: 'High-attrition slurry agitation in gold cyanidation circuits destroys low-grade carbon, causing severe gold slippage into tailings. Discover why steam-activated coconut shell carbon with >98.5% ball-pan hardness is the metallurgical benchmark.',
      category: 'Quality Standards',
      readTime: '7 min read',
      publishDate: 'September 2026',
      author: {
        name: 'Dr. Evelyn Martinez-Dass',
        role: 'Chief Quality Officer',
        avatarInitials: 'EM'
      },
      featured: true,
      relatedCommodity: 'Coconut Charcoal Chips for Iron & Auto Castings',
      keyTakeaways: [
        'Coconut shell activated carbon achieves supreme ball-pan hardness (>98.5%), mitigating costly attrition gold losses in CIP/CIL tanks.',
        'Iodine values between 1,050 and 1,150 mg/g provide optimal micro-pore distribution for aurocyanide [Au(CN)2]− complex adsorption.',
        'Strict pre-attrition de-dusting removes micro-platelets that cause carbon fouling in elution and electrowinning cells.'
      ],
      content: [
        'In modern hydrometallurgical gold extraction—predominantly Carbon-in-Pulp (CIP), Carbon-in-Leach (CIL), and Carbon-in-Column (CIC) circuits—the financial performance of the entire milling operation hinges on the mechanical durability and kinetic adsorption capacity of the activated carbon matrix.',
        'Unlike coal-derived carbons or peat, pyrolyzed high-density coconut shell delivers an exceptional combination of natural micro-porosity (pore diameters < 2 nm) and immense structural resistance to shearing forces exerted by high-speed slurry impellers. When inferior carbons disintegrate under heavy ore pulp agitation, gold-loaded micro-fines wash through 20-mesh interstage screens into tailings ponds, causing unrecoverable revenue losses exceeding tens of thousands of dollars per month.',
        'At Richmount Metallic & Allied Exporters, our export-grade 6x12 mesh and 8x16 mesh gold recovery carbons undergo specialized de-dusted air-classification and high-temperature rotary kiln steam activation. Each export consignment is certified under ASTM D3802 for ball-pan hardness exceeding 98.5% and rapid gold loading kinetics (R-value > 45%), providing gold mining operations across Western Australia, Ghana, and Latin America with dependable, high-yield metallurgical recoveries.'
      ]
    },
    {
      id: 'groundnut-shell-vs-mustard-husk-combustion',
      title: 'Agro-Residue Briquette Selection: Comparing Groundnut Shell vs. Mustard Husk for High-Pressure Steam Boilers',
      slug: 'groundnut-shell-vs-mustard-husk-combustion',
      excerpt: 'Evaluating the proximate analysis, volatile release curves, and ash deformation temperatures of groundnut shell versus mustard crop briquettes for traveling grates and bubbling fluidized bed boilers.',
      category: 'Technical Combustion',
      readTime: '6 min read',
      publishDate: 'August 2026',
      author: {
        name: 'R. Balakrishnan',
        role: 'Technical Services Director',
        avatarInitials: 'RB'
      },
      relatedCommodity: 'Groundnut Shell Briquettes (Export Grade)',
      keyTakeaways: [
        'Groundnut shell briquettes provide superior calorific punch (4,250 - 4,450 kcal/kg) and rapid volatile ignition for pulsating steam demands.',
        'Mustard husk briquettes exhibit higher ash softening temperatures (>1,260°C) and lower clinker propensity in continuous grate stokers.',
        'A 60:40 composite blend creates an optimized thermal equilibrium, reducing unburned carbon losses below 2.5%.'
      ],
      content: [
        'Industrial plant engineers in textile processing, paper manufacturing, and solvent extraction plants frequently debate the operational merits of groundnut (peanut) shell briquettes versus mustard crop husk briquettes. While both are densified agro-residues, their chemical proximate and ultimate compositions lead to distinct combustion behavior inside industrial furnace chambers.',
        'Groundnut shells possess natural residual vegetable lipids and high cellulose content, translating into an instantaneous volatile ignition front and higher gross calorific value (4,250 to 4,450 kcal/kg). This makes groundnut briquettes exceptionally responsive for plants with fluctuating steam loads. However, rapid volatile release requires careful secondary air (over-fire air) velocity tuning to avoid unburned hydrocarbon smoke.',
        'Conversely, mustard crop residues feature higher bulk lignin density and an alkaline ash matrix rich in calcium and magnesium rather than potassium. This natural chemistry elevates the initial ash deformation temperature past 1,260°C, drastically minimizing refractory wall clinkering during prolonged high-firing cycles. By formulating a calibrated 60:40 hybrid blend of groundnut and mustard stalks, Richmount delivers a stable, non-slagging solid biofuel optimized for automated chain-grate and reciprocating stoker boilers.'
      ]
    },
    {
      id: 'maritime-moisture-container-sweat-prevention',
      title: 'Maritime Moisture Control & Container Sweat Prevention: Safeguarding 40ft High-Cube Biomass Shipments',
      slug: 'maritime-moisture-container-sweat-prevention',
      excerpt: 'Trans-oceanic shipping through equatorial waters causes steep temperature shifts and cargo sweat. Review the desiccant protocols, container liners, and ISPM-15 packaging that guarantee dry arrival in European and Middle Eastern ports.',
      category: 'Maritime Logistics',
      readTime: '5 min read',
      publishDate: 'August 2026',
      author: {
        name: 'Alok N. Varma',
        role: 'Head of Global Supply Chain',
        avatarInitials: 'AV'
      },
      relatedCommodity: 'Industrial Sawdust Briquettes (75mm)',
      keyTakeaways: [
        'Crossing tropical equatorial zones to northern winter ports causes internal container temperature differentials of over 30°C.',
        'High-capacity calcium chloride container desiccants absorb 300% of their weight in moisture, preventing condensation cargo rain.',
        'Breathable woven polypropylene bags combined with ISPM-15 heat-treated maritime pallets ensure mold-free cargo delivery.'
      ],
      content: [
        'Transporting hygroscopic biomass fuels across 25 to 35-day ocean voyages—originating in tropical ports such as Nhava Sheva or Cochin and terminating in cold European or East Asian harbors like Rotterdam, Antwerp, or Busan—presents serious cargo preservation challenges.',
        'When ocean container vessels navigate through the Red Sea and Mediterranean during autumn and winter, external ambient temperatures plummet rapidly. The air inside the tightly sealed shipping container cools against the steel ceiling and corrugated walls. Because colder air cannot retain the same dew-point moisture volume, condensation forms and drips onto the top cargo layer—a destructive phenomenon known as container sweat or cargo rain.',
        'To safeguard multi-ton consignments, Richmount implements a rigorous triple-barrier moisture protocol: strictly packing solid fuels at under 8.0% moisture content, installing heavy-duty hung calcium chloride desiccant blankets along container wall ribs, and lining container floors with moisture-barrier corrugated decking. Every lot arrives at destination discharge ports dry, solid, and ready for immediate boiler bin charging.'
      ]
    },
    {
      id: 'iso-17225-wood-chips-boiler-feeding',
      title: 'Standardizing Industrial Wood Chips: Why ENplus & ISO 17225-4 Size Fractions Dictate Boiler Feeding Reliability',
      slug: 'iso-17225-wood-chips-boiler-feeding',
      excerpt: 'Un-screened wood chips with fibrous slivers cause severe bridging in fuel chutes and screw conveyors. Learn how precision mechanical screening to G30 and G50 specs ensures continuous boiler automation.',
      category: 'Energy Transition',
      readTime: '6 min read',
      publishDate: 'July 2026',
      author: {
        name: 'Dr. K. S. Rajasekharan',
        role: 'Chief Combustion Engineer',
        avatarInitials: 'KR'
      },
      relatedCommodity: 'Wood Chips (Screened G30/G50)',
      keyTakeaways: [
        'Oversized wood slivers (>85mm) are the primary culprit behind screw conveyor jamming and rotary airlock bridging.',
        'Automated vibratory screening guarantees strict compliance with G30 (<31.5mm) and G50 (<50mm) particle distribution envelopes.',
        'Debarked hardwood and softwood chips limit mineral soil ash to under 1.2%, extending continuous boiler operational runs.'
      ],
      content: [
        'In modern biomass-fired combined heat and power (CHP) stations and district heating complexes, mechanical fuel handling represents the single most frequent point of unscheduled operational downtime. Rotary airlocks, screw augers, and drag-chain conveyors are engineered for predictable particle flow; when un-screened wood chips with fibrous overs or slivers enter the feed chute, bridging and shear pin failures occur.',
        'International standard ISO 17225-4 categorizes wood chips into strict dimensional classes, notably P31S (formerly G30, where 60-100% of particles measure between 3.15mm and 31.5mm) and P45S (formerly G50, particles up to 45-50mm). Maintaining strict sizing envelopes prevents mechanical interlocking in silo funnels while ensuring uniform aerated combustion without localized starvation zones.',
        'Richmount Exim’s primary processing yards utilize twin-deck rotary trommel screens and magnetic separator belts to eliminate dust fines, oversized slivers, and tramp ferrous metal. Backed by rigorous moisture grading (M25 to M35), our screened chips deliver maximum thermal kWh per cubic meter of cargo volume with zero boiler feed interruptions.'
      ]
    },
    {
      id: 'decarbonizing-cement-kilns-bio-coal-petcoke',
      title: 'Decarbonizing Cement Kilns & Precalciners: Replacing Fossil Petcoke with Low-Chlorine Bio-Coal',
      slug: 'decarbonizing-cement-kilns-bio-coal-petcoke',
      excerpt: 'Achieving 30-50% Thermal Substitution Rates (TSR) in cement manufacturing without risking kiln duct clogging or refractory deterioration by utilizing torrefied bio-coal with <0.03% chlorine.',
      category: 'Carbon Markets',
      readTime: '8 min read',
      publishDate: 'July 2026',
      author: {
        name: 'Sunita Mehra',
        role: 'Director of ESG & Sustainability Compliance',
        avatarInitials: 'SM'
      },
      relatedCommodity: 'Torrefied Bio-Coal Briquettes (7,500 kcal/kg)',
      keyTakeaways: [
        'High Thermal Substitution Rates (TSR) in cement precalciner towers require fuels with calorific values exceeding 6,500 kcal/kg.',
        'Chlorine content must strictly remain under 0.05% to avoid volatile chloride ring formations in rotary kiln inlet chambers.',
        'Replacing 25% of petcoke with certified biogenic solid carbon directly reduces clinker Scope-1 carbon liability by 180 kg CO2/ton.'
      ],
      content: [
        'Global cement manufacturers produce roughly 7% of worldwide industrial greenhouse gas emissions. Under the Science Based Targets initiative (SBTi) and European Emission Trading System (EU ETS), cement conglomerates face aggressive mandates to elevate their Thermal Substitution Rate (TSR) to over 30-50% by 2030.',
        'Traditionally, cement kilns relied on petroleum coke (petcoke) due to its extreme heat value (>7,500 kcal/kg). However, conventional raw agricultural biomass fuels suffer from low energy density and high moisture, which suppresses flame temperatures below the 1,450°C necessary for alite (C3S) clinker formation. Moreover, agro-biomass with high chlorine or alkali levels triggers alkali-chloride build-ups that choke kiln cyclone preheater stages.',
        'To overcome these metallurgical limits, Richmount manufactures specialized torrefied bio-coal pellets and briquettes. Through inert thermal roasting, the biomass volatile profile is transformed into high fixed-carbon hydro-char (7,200 - 7,600 kcal/kg) with total chlorine strictly maintained below 0.03% and sulfur below 0.05%. Cement plants can safely co-fire our bio-coal directly in calciner burners without risk of duct ring clogging, achieving verified Scope-1 decarbonization at competitive gigajoule parity.'
      ]
    }
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch =
      !query ||
      (post.title || '').toLowerCase().includes(query) ||
      (post.excerpt || '').toLowerCase().includes(query) ||
      (post.author?.name || '').toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribedEmail) return;
    setSubscribeSuccess(true);
    setTimeout(() => {
      setSubscribedEmail('');
    }, 3000);
  };

  return (
    <div className="bg-[#f9fbf7] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e3ede0]">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#e8f3e2] text-[#2a6e3a] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              Industry Intelligence &amp; Market Insights
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1b4d27] tracking-tight">
              Biomass Fuels, Carbon Tariffs &amp; Global Trade Whitepapers
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Technical combustion analyses, regulatory forecasts (CBAM &amp; EUDR), ocean logistics benchmarks, and commodity pricing intelligence curated by the commercial engineering desk at Richmount Exim.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, topics, authors..."
              className="w-full bg-white text-xs text-gray-800 placeholder-gray-400 pl-9 pr-3 py-2.5 rounded-xl border border-[#e3ede0] focus:outline-hidden focus:border-[#2a6e3a] shadow-2xs"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1b4d27] text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-[#e8f3e2] hover:text-[#1b4d27] border border-[#e3ede0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Article Hero (When viewing All and no search) */}
        {selectedCategory === 'All' && !searchQuery && featuredPost && (
          <div className="bg-white rounded-3xl border border-[#cbe1c3] p-6 sm:p-10 shadow-sm hover:shadow-md transition">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="bg-[#f5b342]/20 text-[#9e6d15] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    Featured Analysis
                  </span>
                  <span className="bg-[#e8f3e2] text-[#2a6e3a] font-bold px-2 py-0.5 rounded-md">
                    {featuredPost.category}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readTime}
                  </span>
                </div>

                <h2
                  onClick={() => setActiveArticle(featuredPost)}
                  className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1b4d27] hover:text-[#2a6e3a] transition cursor-pointer leading-tight"
                >
                  {featuredPost.title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1b4d27] text-white flex items-center justify-center font-bold text-xs">
                      {featuredPost.author.avatarInitials}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">{featuredPost.author.name}</span>
                      <span className="text-[10px] text-gray-500">{featuredPost.author.role}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveArticle(featuredPost)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2a6e3a] hover:text-[#1b4d27] bg-[#e8f3e2] hover:bg-[#d8ebd0] px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    <span>Read Full Whitepaper</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Key Takeaways Sidebar Box */}
              <div className="lg:col-span-4 bg-[#f9fbf7] p-5 rounded-2xl border border-[#e3ede0] space-y-3">
                <span className="text-[11px] uppercase font-bold text-[#1b4d27] tracking-wider block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#f5b342]" />
                  Executive Takeaways:
                </span>
                <ul className="space-y-2 text-xs text-gray-600">
                  {featuredPost.keyTakeaways.map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2a6e3a] shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl p-6 border border-[#e3ede0] shadow-2xs hover:shadow-md hover:border-[#2a6e3a] transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="bg-[#f0f7eb] text-[#2a6e3a] font-bold px-2 py-0.5 rounded-md border border-[#cbe1c3]">
                    {post.category}
                  </span>
                  <span className="text-gray-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>

                <h3
                  onClick={() => setActiveArticle(post)}
                  className="font-heading text-lg font-bold text-[#1b4d27] group-hover:text-[#2a6e3a] transition cursor-pointer leading-snug line-clamp-2"
                >
                  {post.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#e8f3e2] text-[#1b4d27] flex items-center justify-center font-bold text-[10px]">
                    {post.author.avatarInitials}
                  </div>
                  <div>
                    <span className="font-bold text-[11px] text-gray-800 block">{post.author.name}</span>
                    <span className="text-[9px] text-gray-400">{post.publishDate}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveArticle(post)}
                  className="p-1.5 rounded-lg text-[#2a6e3a] hover:bg-[#e8f3e2] transition cursor-pointer"
                  title="Read Article"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-300 space-y-3">
            <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-bold text-gray-700">No articles matched your criteria</h3>
            <p className="text-xs text-gray-500">
              Try searching with a different term or reset your category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-bold text-[#2a6e3a] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Newsletter & Market Intelligence Subscription Box */}
        <div className="bg-gradient-to-br from-[#1b4d27] to-[#12361b] rounded-3xl p-8 sm:p-12 text-white shadow-xl border border-[#2e6d3c] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <span className="text-[10px] text-[#f5b342] uppercase font-bold tracking-wider block">
              Bi-Weekly Market Briefings
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold">
              Subscribe to Global Biomass &amp; Solid Fuel Market Reports
            </h3>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Receive FOB price benchmark indices, container shipping rate updates, regulatory alerts (CBAM &amp; EUDR), and proximate analysis case studies directly to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex-1 max-w-md space-y-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={subscribedEmail}
                onChange={(e) => setSubscribedEmail(e.target.value)}
                placeholder="Enter corporate email address..."
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-white/60 focus:outline-hidden focus:bg-white/20 focus:border-[#f5b342]"
              />
              <button
                type="submit"
                className="bg-[#f5b342] hover:bg-[#e09f2e] text-[#172e18] px-5 py-3 rounded-xl font-bold text-xs transition shadow-md whitespace-nowrap cursor-pointer"
              >
                Join 4,200+ Subscribers
              </button>
            </div>
            {subscribeSuccess && (
              <p className="text-[11px] text-[#f5b342] font-semibold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Thank you! Your email has been added to our trade desk bulletin distribution list.
              </p>
            )}
          </form>
        </div>

        {/* Full Article Reader Modal */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full border border-[#cbe1c3] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="bg-[#1b4d27] px-6 sm:px-8 py-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-[#f5b342] text-[#172e18] font-bold px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider">
                    {activeArticle.category}
                  </span>
                  <span className="text-white/60">•</span>
                  <span className="text-white/80">{activeArticle.readTime}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="text-white/70 hover:text-white p-1 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
                <div>
                  <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#1b4d27] leading-tight mb-3">
                    {activeArticle.title}
                  </h2>

                  <div className="flex items-center gap-3 py-3 border-y border-gray-100 text-xs text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-[#e8f3e2] text-[#1b4d27] flex items-center justify-center font-bold text-xs">
                      {activeArticle.author.avatarInitials}
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 block">{activeArticle.author.name}</span>
                      <span className="text-[10px] text-gray-500">
                        {activeArticle.author.role} • {activeArticle.publishDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Takeaways Callout */}
                <div className="bg-[#f9fbf7] p-5 rounded-2xl border border-[#e3ede0] space-y-2">
                  <h4 className="font-bold text-xs text-[#1b4d27] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#f5b342]" />
                    Key Executive Findings &amp; Commercial Recommendations:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {activeArticle.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2a6e3a] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Article Narrative Paragraphs */}
                <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {activeArticle.content.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Associated Export Commodity CTA */}
                {activeArticle.relatedCommodity && (
                  <div className="bg-[#f0f7eb] p-5 rounded-2xl border border-[#cbe1c3] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-[#2a6e3a] uppercase font-bold tracking-wider block">
                        Related Export Commodity
                      </span>
                      <strong className="text-sm font-bold text-[#1b4d27]">
                        {activeArticle.relatedCommodity}
                      </strong>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        In-stock with pre-shipment SGS inspection reports ready for prompt ocean container stuffing.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveArticle(null);
                        setActiveModal('rfq');
                      }}
                      className="bg-[#2a6e3a] hover:bg-[#1b4d27] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs whitespace-nowrap cursor-pointer"
                    >
                      Request Quote Tariff
                    </button>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
                <span className="text-gray-500 text-[11px]">
                  Published by Richmount Metallic &amp; Allied Exporters Pvt. Ltd. (Richexim Group)
                </span>
                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-800 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
