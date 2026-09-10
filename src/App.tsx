import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroShowcase } from './components/HeroShowcase';
import { ProductCatalog } from './components/ProductCatalog';
import { CustomBlendsSection } from './components/CustomBlendsSection';
import { QualityCenter } from './components/QualityCenter';
import { SupportSection } from './components/SupportSection';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutUs } from './components/AboutUs';
import { Blog } from './components/Blog';
import { CareersPage } from './components/CareersPage';
import { FAQPage } from './components/FAQPage';
import { RFQModal } from './components/RFQModal';
import { ProformaInvoiceView } from './components/ProformaInvoiceView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentUser, currentPage, isAdminOpen, setIsAdminOpen, setCurrentPage } = useApp();

  // Determine if the user is in Admin Management mode
  const isAdminView = Boolean(isAdminOpen || currentPage === 'admin');

  // Dedicated Admin Portal View: Completely isolated from public header, footer, and storefront sections
  if (isAdminView) {
    return (
      <div className="min-h-screen bg-[#edf3ea] text-[#172e18] flex flex-col font-sans">
        {/* Dedicated Admin Portal */}
        <AdminDashboard />

        {/* Essential Modals used by Admin (e.g. Proforma generator, product details) */}
        <ProformaInvoiceView />
        <ProductDetailModal />
      </div>
    );
  }

  // Public Corporate Website View
  return (
    <div className="min-h-screen flex flex-col bg-[#f9fbf7] text-[#172e18]">
      {/* Administrator Preview Bar when viewing public storefront */}
      {currentUser.role === 'Admin' && (
        <div className="bg-[#172e18] text-[#edf3ea] px-4 py-2 text-xs flex items-center justify-between border-b border-[#2a4d2c] z-50 sticky top-0 shadow-md">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#f5b342] animate-pulse" />
            <span className="font-bold text-white">Administrator Preview Mode</span>
            <span className="hidden sm:inline text-[#a6caa8]">• You are previewing the live public storefront</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsAdminOpen(true);
              setCurrentPage('admin');
            }}
            className="bg-[#f5b342] hover:bg-[#e2a230] text-[#172e18] px-3.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-xs"
          >
            <span>Return to Admin Console</span>
          </button>
        </div>
      )}

      {/* Global Public Enterprise Navigation */}
      <Header />

      {/* Main Corporate Presentation & Modules */}
      <main className="flex-1">
        {/* Dedicated Page Views */}
        {currentPage === 'about' && <AboutUs />}
        {currentPage === 'blog' && <Blog />}
        {currentPage === 'careers' && <CareersPage />}
        {currentPage === 'faq' && <FAQPage />}

        {/* Home Page View */}
        {currentPage !== 'about' && currentPage !== 'blog' && currentPage !== 'careers' && currentPage !== 'faq' && (
          <>
            {/* Hero & International Operations Showcase */}
            <HeroShowcase />

            {/* Export Commodity Catalog & Faceted Search */}
            <ProductCatalog />

            {/* Customized Biomass Fuel Formulation & Boiler Configurator */}
            <CustomBlendsSection />

            {/* Accreditation, ASTM Technical Standards & Logistics */}
            <QualityCenter />

            {/* Commercial Inquiries & Trade Desk */}
            <SupportSection />
          </>
        )}
      </main>

      {/* Corporate Letterhead & Navigation Footer */}
      <Footer />

      {/* Public Modals & Dialogs */}
      <RFQModal />
      <ProformaInvoiceView />
      <ProductDetailModal />

      {/* Live AI Commercial Chat Widget (Only on public storefront) */}
      <LiveChatWidget />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
