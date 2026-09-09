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
  const { currentUser, currentPage } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fbf7] text-[#172e18]">
      {/* Global Enterprise Navigation */}
      <Header />

      {/* Main Corporate Presentation & Modules */}
      <main className="flex-1">
        {/* Executive Admin Telemetry & Control Panel (Visible to Admin role) */}
        {currentUser.role === 'Admin' && <AdminDashboard />}

        {/* Dedicated Page Views */}
        {currentPage === 'about' && <AboutUs />}
        {currentPage === 'blog' && <Blog />}
        {currentPage === 'careers' && <CareersPage />}
        {currentPage === 'faq' && <FAQPage />}

        {/* Home Page View (Careers, FAQ, and Blog removed from sections) */}
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

      {/* Modals & Dialogs */}
      <RFQModal />
      <ProformaInvoiceView />
      <ProductDetailModal />

      {/* Live AI Commercial Chat Widget */}
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

