import React from 'react';
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  ArrowUp,
  FileText,
  Ship,
  TreePine,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppPage } from '../types';

export const Footer: React.FC = () => {
  const { setActiveModal, setCurrentPage } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (page: AppPage, anchorId?: string) => {
    setCurrentPage(page);
    if (page === 'home' && anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#112415] text-white border-t border-[#1b3d22]">
      {/* Top Banner / Ticker */}
      <div className="bg-[#0b170e] py-3 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f5b342] animate-pulse shrink-0" />
            <span>Official International Subsidiary of the <strong>Richexim Group</strong></span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1 text-[11px] sm:text-xs">
            <span>Primary Export Hubs: Nhava Sheva (JNPT) • Cochin Port • Mundra</span>
            <span>IEC: 0314059812</span>
            <span>GSTIN: 32AABCR8841M1ZX</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Col 1: Corporate Profile */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2a6e3a] text-white flex items-center justify-center font-bold">
                RX
              </div>
              <div>
                <span className="font-heading font-black text-xl text-white tracking-tight">
                  RICHMOUNT EXIM
                </span>
                <span className="text-[10px] block font-bold text-[#f5b342] uppercase tracking-wider">
                  Richexim Group Export Subsidiary
                </span>
              </div>
            </div>

            <p className="text-xs text-white/75 leading-relaxed max-w-sm">
              Manufacturers, Processors, Suppliers &amp; Exporters of Biofuels, Biomass Energy Alternatives, Coconut Charcoal, and Industrial Activated Carbon for high-efficiency thermal power, foundries, and water filtration worldwide.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-white/80">
              <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">ISO 9001:2015</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">APEDA Export Unit</span>
              <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">Halal &amp; Kosher Certified</span>
            </div>
          </div>

          {/* Col 2: Core Commodities */}
          <div>
            <h4 className="font-heading text-sm font-bold text-[#f5b342] uppercase tracking-wider mb-4">
              Export Commodities
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li><a href="#products" className="hover:text-white transition">Wood Chips (Screened G30/G50)</a></li>
              <li><a href="#products" className="hover:text-white transition">High-Calorific Briquettes</a></li>
              <li><a href="#products" className="hover:text-white transition">Industrial Wood Pellets (ENplus-A1)</a></li>
              <li><a href="#products" className="hover:text-white transition">Coconut Shell Charcoal (Smokeless)</a></li>
              <li><a href="#products" className="hover:text-white transition">Foundry Charcoal Chips</a></li>
              <li><a href="#products" className="hover:text-white transition">Powdered &amp; Granular Carbon (PAC/GAC)</a></li>
              <li><a href="#custom-blends" className="hover:text-white transition">Customized Boiler Fuel Blends</a></li>
            </ul>
          </div>

          {/* Col 3: Compliance & Engineering */}
          <div>
            <h4 className="font-heading text-sm font-bold text-[#f5b342] uppercase tracking-wider mb-4">
              Corporate &amp; Trade
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('about')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  About Us (Company Profile)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('blog')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Industry Blog &amp; Whitepapers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('home', 'products')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Export Commodity Catalog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('home', 'custom-blends')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Boiler Blends Formulation
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('home', 'quality-center')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Quality Center &amp; ASTM Specs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('careers')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Careers &amp; Opportunities
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigateTo('faq')}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveModal('rfq')}
                  className="text-[#f5b342] font-bold hover:underline cursor-pointer"
                >
                  Proforma RFQ Builder →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Registered Office & Contacts */}
          <div>
            <h4 className="font-heading text-sm font-bold text-[#f5b342] uppercase tracking-wider mb-4">
              Registered Office
            </h4>
            <div className="space-y-3 text-xs text-white/75">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#f5b342] shrink-0 mt-0.5" />
                <span>Door No. 14/280, Commercial Port Corridor, Cochin / Mumbai, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#f5b342] shrink-0" />
                <span>info@richexim.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#f5b342] shrink-0" />
                <span>+91 8921517645 (Direct Desk)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} Richmount Metallic &amp; Allied Exporters Pvt. Ltd. (Richmount Exim). All rights reserved. A subsidiary of the Richexim Group.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-xl transition cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#f5b342]" />
          </button>
        </div>
      </div>
    </footer>
  );
};
