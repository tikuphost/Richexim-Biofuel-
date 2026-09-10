import React, { useState } from 'react';
import {
  Leaf,
  Globe,
  Search,
  FileText,
  ShieldCheck,
  Phone,
  SlidersHorizontal,
  ChevronDown,
  Lock,
  Menu,
  X,
  Building2,
  CheckCircle2,
  Sparkles,
  Mail
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole, AppPage } from '../types';

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    rfqItems,
    setActiveModal,
    currentUser,
    switchRole,
    setIsAdminOpen,
    isAdminOpen,
    currentPage,
    setCurrentPage
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateTo = (page: AppPage, anchorId?: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    if (page === 'home' && anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const availableRoles: UserRole[] = [
    'Verified Buyer',
    'Admin',
    'Sales Manager',
    'Logistics Coordinator',
    'Guest'
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e3ede0] shadow-xs">
      {/* Top micro-bar */}
      <div className="bg-[#1b4d27] text-white text-xs py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          {/* Subsidiary & Group Branding */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 font-semibold text-[#f5b342] tracking-wider uppercase text-[10px] sm:text-[11px] shrink-0 truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">
              <Building2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0" />
              <span>A Subsidiary of the Richexim Group</span>
            </span>
            <span className="hidden md:inline text-white/40">•</span>
            <span className="hidden md:inline text-white/85 text-[11px] truncate">
              International Export &amp; Supply Chain Division: Richmount Metallic &amp; Allied Exporters Pvt. Ltd.
            </span>
          </div>

          {/* Top Bar Actions: Contact, Hotline, Role Switcher & Admin */}
          <div className="flex items-center gap-1.5 sm:gap-3 text-xs shrink-0">
            {/* Contact Button in Topbar */}
            <button
              type="button"
              onClick={() => navigateTo('home', 'contact')}
              className="flex items-center gap-1 sm:gap-1.5 bg-[#f5b342] hover:bg-[#e2a230] text-[#172e18] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold transition shadow-xs cursor-pointer select-none"
              title="Contact Commercial Trade Desk"
            >
              <Phone className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-[#172e18]" />
              <span>Contact Us</span>
            </button>

            {/* Direct Telephone Hotline */}
            <a
              href="tel:+918921517645"
              className="hidden lg:inline-flex items-center gap-1 text-white/90 hover:text-white transition text-[11px] font-medium"
              title="Direct Export Trade Hotline"
            >
              <span>+91 8921517645</span>
            </a>

            {/* User Role Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1 sm:gap-1.5 bg-[#255e34] hover:bg-[#2e703f] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-white font-medium transition cursor-pointer text-[10px] sm:text-[11px]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5b342]"></span>
                <span className="truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[120px]">{currentUser.role}</span>
                <ChevronDown className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white/70" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white text-[#172e18] rounded-xl shadow-xl border border-[#e3ede0] py-1 z-50">
                  <div className="px-3 py-1.5 border-b border-gray-100">
                    <p className="text-[11px] font-bold text-[#1b4d27]">{currentUser.name}</p>
                    <p className="text-[10px] text-gray-500">{currentUser.email}</p>
                  </div>
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400">Switch Access Role</div>
                  {availableRoles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        switchRole(role);
                        setIsRoleDropdownOpen(false);
                        if (role === 'Admin') {
                          setIsAdminOpen(true);
                        }
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#f4f7ee] ${currentUser.role === role ? 'font-bold text-[#1b4d27] bg-[#eaf3e4]' : ''}`}
                    >
                      <span>{role}</span>
                      {currentUser.role === role && <CheckCircle2 className="w-3.5 h-3.5 text-[#2a6e3a]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Admin Console Trigger */}
            <button
              type="button"
              onClick={() => {
                switchRole('Admin');
                setIsAdminOpen(true);
                setCurrentPage('admin');
              }}
              className="flex items-center gap-1 text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full font-bold transition cursor-pointer bg-[#f5b342] hover:bg-[#e2a230] text-[#172e18] shadow-xs select-none"
            >
              <Lock className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
              <span className="hidden sm:inline">Admin Console</span>
              <span className="sm:hidden">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand Identity */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 sm:gap-3 group text-left cursor-pointer shrink min-w-0"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#e8f3e2] text-[#1b4d27] flex items-center justify-center shadow-xs group-hover:scale-105 transition shrink-0">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-[#2a6e3a]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-heading font-extrabold text-lg sm:text-2xl text-[#1b4d27] tracking-tight leading-none truncate">
                  RICHMOUNT EXIM
                </span>
                <span className="bg-[#f0f7eb] text-[#2a6e3a] text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-[#cbe1c3] shrink-0">
                  BIOFUELS
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#3e8e50] font-medium tracking-wide truncate">
                Green Fuels • Industrial Biomass • Carbon Solutions
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-semibold text-[#1f2e1c]">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className={`hover:text-[#2a6e3a] transition py-1 border-b-2 cursor-pointer ${
                currentPage === 'home'
                  ? 'text-[#1b4d27] border-[#f5b342] font-bold'
                  : 'border-transparent text-gray-700'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => navigateTo('about')}
              className={`hover:text-[#2a6e3a] transition py-1 border-b-2 cursor-pointer ${
                currentPage === 'about'
                  ? 'text-[#1b4d27] border-[#f5b342] font-bold'
                  : 'border-transparent text-gray-700'
              }`}
            >
              About us
            </button>
            <button
              type="button"
              onClick={() => navigateTo('home', 'products')}
              className="hover:text-[#2a6e3a] transition py-1 border-b-2 border-transparent hover:border-[#f5b342] text-gray-700 cursor-pointer"
            >
              Product
            </button>
            <button
              type="button"
              onClick={() => navigateTo('careers')}
              className={`hover:text-[#2a6e3a] transition py-1 border-b-2 cursor-pointer ${
                currentPage === 'careers'
                  ? 'text-[#1b4d27] border-[#f5b342] font-bold'
                  : 'border-transparent text-gray-700'
              }`}
            >
              Careers
            </button>
            <button
              type="button"
              onClick={() => navigateTo('faq')}
              className={`hover:text-[#2a6e3a] transition py-1 border-b-2 cursor-pointer ${
                currentPage === 'faq'
                  ? 'text-[#1b4d27] border-[#f5b342] font-bold'
                  : 'border-transparent text-gray-700'
              }`}
            >
              FaQ
            </button>
            <button
              type="button"
              onClick={() => navigateTo('blog')}
              className={`hover:text-[#2a6e3a] transition py-1 border-b-2 cursor-pointer ${
                currentPage === 'blog'
                  ? 'text-[#1b4d27] border-[#f5b342] font-bold'
                  : 'border-transparent text-gray-700'
              }`}
            >
              Blog
            </button>

            {/* Search section - positioned after Blog */}
            <div className="flex items-center ml-1">
              <div className="relative w-44 xl:w-56 2xl:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search commodities, specs..."
                  className="w-full bg-[#f4f7ee] text-xs text-[#172e18] placeholder-gray-400 pl-8 pr-7 py-1.5 rounded-xl border border-[#e3ede0] focus:outline-hidden focus:border-[#2a6e3a] focus:bg-white transition"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1.5 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </nav>

          {/* Actions & RFQ Cart */}
          <div className="flex items-center gap-2.5">
            {/* RFQ Quote Builder Drawer Trigger */}
            <button
              type="button"
              onClick={() => setActiveModal('rfq')}
              className="flex items-center gap-2 bg-[#2a6e3a] hover:bg-[#1b4d27] text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">RFQ Calculator</span>
              <span className="sm:hidden">RFQ</span>
              <span className="bg-[#f5b342] text-[#172e18] text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                {rfqItems.length}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-[#2a6e3a] rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#e3ede0] px-4 py-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-2 text-sm font-medium">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className={`text-left px-3 py-2 rounded-lg cursor-pointer ${
                currentPage === 'home' ? 'bg-[#f4f7ee] text-[#1b4d27] font-bold' : 'text-gray-700 hover:bg-[#f4f7ee]'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => navigateTo('about')}
              className={`text-left px-3 py-2 rounded-lg cursor-pointer ${
                currentPage === 'about' ? 'bg-[#f4f7ee] text-[#1b4d27] font-bold' : 'text-gray-700 hover:bg-[#f4f7ee]'
              }`}
            >
              About us
            </button>
            <button
              type="button"
              onClick={() => navigateTo('home', 'products')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#f4f7ee] text-gray-700 cursor-pointer"
            >
              Product
            </button>
            <button
              type="button"
              onClick={() => navigateTo('careers')}
              className={`text-left px-3 py-2 rounded-lg cursor-pointer ${
                currentPage === 'careers' ? 'bg-[#f4f7ee] text-[#1b4d27] font-bold' : 'text-gray-700 hover:bg-[#f4f7ee]'
              }`}
            >
              Careers
            </button>
            <button
              type="button"
              onClick={() => navigateTo('faq')}
              className={`text-left px-3 py-2 rounded-lg cursor-pointer ${
                currentPage === 'faq' ? 'bg-[#f4f7ee] text-[#1b4d27] font-bold' : 'text-gray-700 hover:bg-[#f4f7ee]'
              }`}
            >
              FaQ
            </button>
            <button
              type="button"
              onClick={() => navigateTo('blog')}
              className={`text-left px-3 py-2 rounded-lg cursor-pointer ${
                currentPage === 'blog' ? 'bg-[#f4f7ee] text-[#1b4d27] font-bold' : 'text-gray-700 hover:bg-[#f4f7ee]'
              }`}
            >
              Blog
            </button>

            {/* Mobile Contact Link */}
            <button
              type="button"
              onClick={() => navigateTo('home', 'contact')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#f4f7ee] text-[#2a6e3a] font-bold flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Contact Commercial Team</span>
            </button>

            {/* Mobile Search section placed directly after Blog */}
            <div className="pt-2 pb-1 border-t border-gray-100">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search biomass commodities, HS codes..."
                  className="w-full bg-[#f4f7ee] text-xs text-[#172e18] placeholder-gray-400 pl-8 pr-7 py-2 rounded-xl border border-[#e3ede0] focus:outline-hidden focus:border-[#2a6e3a]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-gray-600 px-3">
                <span>Active Role:</span>
                <span className="font-bold text-[#1b4d27]">{currentUser.role}</span>
              </div>
              <a
                href="tel:+918921517645"
                className="flex items-center justify-center gap-2 bg-[#f0f7eb] text-[#2a6e3a] py-2 px-3 rounded-xl text-xs font-bold border border-[#cbe1c3]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Hotline: +91 8921517645</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
