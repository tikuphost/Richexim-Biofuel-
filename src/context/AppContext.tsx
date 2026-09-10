import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  CommodityProduct,
  Category,
  RFQQuote,
  RFQItem,
  Certification,
  Article,
  CareerJob,
  InquiryLead,
  ChatMessage,
  ChatSession,
  UserProfile,
  UserRole,
  DatabaseStats,
  AppInitialData,
  IncotermType,
  VolumeUnit,
  AppPage,
  PageSEOMetadata,
  SEOMetadataMap,
  FAQItem
} from '../types';
import { DEFAULT_SEO_CONFIGS, applyDocumentSEO } from '../utils/seo';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_CERTIFICATIONS,
  DEFAULT_QUOTES,
  DEFAULT_ARTICLES,
  DEFAULT_CAREERS,
  DEFAULT_FAQS,
  DEFAULT_METRICS,
  DEFAULT_CHAT_SESSIONS
} from '../data/defaultData';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'SGD' | 'JPY';

export interface CurrencyRate {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyRate> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.78, flag: '🇬🇧' },
  INR: { code: 'INR', symbol: '₹', rate: 83.5, flag: '🇮🇳' },
  AED: { code: 'AED', symbol: 'AED ', rate: 3.67, flag: '🇦🇪' },
  SGD: { code: 'SGD', symbol: 'S$', rate: 1.34, flag: '🇸🇬' },
  JPY: { code: 'JPY', symbol: '¥', rate: 152.0, flag: '🇯🇵' }
};

export const MAJOR_PORTS = [
  { name: 'Jebel Ali Port (Dubai), UAE', region: 'Middle East', oceanTransitDays: 5, estFreightUSDPerMT: 32 },
  { name: 'Port of Rotterdam, Netherlands', region: 'Europe', oceanTransitDays: 22, estFreightUSDPerMT: 65 },
  { name: 'Port of Hamburg, Germany', region: 'Europe', oceanTransitDays: 24, estFreightUSDPerMT: 68 },
  { name: 'Port of Antwerp, Belgium', region: 'Europe', oceanTransitDays: 23, estFreightUSDPerMT: 66 },
  { name: 'Port of Le Havre, France', region: 'Europe', oceanTransitDays: 24, estFreightUSDPerMT: 67 },
  { name: 'Port of Gothenburg, Sweden', region: 'Scandinavia', oceanTransitDays: 28, estFreightUSDPerMT: 78 },
  { name: 'Port of Singapore, Singapore', region: 'Southeast Asia', oceanTransitDays: 8, estFreightUSDPerMT: 38 },
  { name: 'Port of Tokyo / Yokohama, Japan', region: 'East Asia', oceanTransitDays: 16, estFreightUSDPerMT: 52 },
  { name: 'Port of Busan, South Korea', region: 'East Asia', oceanTransitDays: 15, estFreightUSDPerMT: 50 },
  { name: 'Port of Houston, USA (Gulf)', region: 'North America', oceanTransitDays: 32, estFreightUSDPerMT: 95 },
  { name: 'Nhava Sheva / JNPT (Mumbai), India (FOB Origin)', region: 'Origin (FOB)', oceanTransitDays: 0, estFreightUSDPerMT: 0 },
  { name: 'Cochin Port (Kochi), India (FOB Origin)', region: 'Origin (FOB)', oceanTransitDays: 0, estFreightUSDPerMT: 0 }
];

interface AppContextType {
  // Page Routing
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;

  // Data
  products: CommodityProduct[];
  categories: Category[];
  quotes: RFQQuote[];
  certifications: Certification[];
  articles: Article[];
  careers: CareerJob[];
  faqs: FAQItem[];
  siteContent: any;
  jobApplications: any[];
  inquiries: InquiryLead[];
  chatHistory: ChatMessage[];
  chatMessages: ChatMessage[];
  databaseStats: DatabaseStats | null;
  metrics: {
    countriesExported: number;
    annualTonnageMT: number;
    qualityAccreditations: number;
    co2OffsetMT: number;
    totalOrdersCompleted: number;
  };
  isLoading: boolean;
  error: string | null;

  // Currency
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (usdAmount: number) => string;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // RFQ Builder Cart
  rfqItems: RFQItem[];
  addToRFQ: (product: CommodityProduct, volume?: number, unit?: VolumeUnit) => void;
  updateRFQItem: (productId: string, updates: Partial<RFQItem>) => void;
  removeFromRFQ: (productId: string) => void;
  clearRFQ: () => void;
  submitRFQ: (quoteData: Partial<RFQQuote>) => Promise<RFQQuote | null>;

  // User & Auth
  currentUser: UserProfile;
  switchRole: (role: UserRole) => void;

  // Modals & Navigation
  activeModal: 'none' | 'rfq' | 'product-detail' | 'cert-detail' | 'article-detail' | 'article-submit' | 'job-apply' | 'proforma-view';
  setActiveModal: (m: 'none' | 'rfq' | 'product-detail' | 'cert-detail' | 'article-detail' | 'article-submit' | 'job-apply' | 'proforma-view') => void;
  selectedProduct: CommodityProduct | null;
  setSelectedProduct: (p: CommodityProduct | null) => void;
  selectedCert: Certification | null;
  setSelectedCert: (c: Certification | null) => void;
  selectedArticle: Article | null;
  setSelectedArticle: (a: Article | null) => void;
  selectedJob: CareerJob | null;
  setSelectedJob: (j: CareerJob | null) => void;
  selectedQuoteForView: RFQQuote | null;
  setSelectedQuoteForView: (q: RFQQuote | null) => void;

  // Chat Drawer & Dual-Persona Engine
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatSessions: ChatSession[];
  activeAdminSessionId: string | null;
  setActiveAdminSessionId: (id: string | null) => void;
  customerChatSession: ChatSession | null;
  setCustomerChatSession: (s: ChatSession | null) => void;
  activeSessionMessages: ChatMessage[];
  startCustomerChatSession: (details: { name: string; email: string; company: string; country: string; message: string; tags?: string[] }) => Promise<ChatSession | null>;
  sendCustomerChatMessage: (text: string) => Promise<void>;
  sendAdminChatMessage: (sessionId: string, text: string, senderName?: string) => Promise<void>;
  updateChatSessionMeta: (sessionId: string, updates: Partial<ChatSession>) => Promise<void>;
  markChatSessionRead: (sessionId: string, who: 'admin' | 'customer') => Promise<void>;
  refreshChatSessions: () => Promise<void>;
  sendChatMessage: (text: string) => Promise<void>;

  // Admin Actions
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  addProduct: (product: Partial<CommodityProduct>) => Promise<void>;
  updateProduct: (id: string, product: Partial<CommodityProduct>) => Promise<void>;
  updateProductPrice: (id: string, newPriceUSD: number) => Promise<void>;
  updateProductStock: (id: string, inStockStatus: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateQuoteStatus: (id: string, updates: Partial<RFQQuote>) => Promise<void>;
  priceQuoteByAdmin: (quoteId: string, itemPrices: { productId: string; unitPriceUSD: number }[], freightUSD?: number, insuranceUSD?: number, discountUSD?: number) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  updateArticleStatus: (id: string, status: 'Approved' | 'Rejected' | 'Pending Moderation') => Promise<void>;
  submitArticle: (article: Partial<Article>) => Promise<void>;
  submitInquiry: (inquiry: Partial<InquiryLead>) => Promise<void>;
  submitJobApplication: (app: any) => Promise<void>;
  updateJobApplicationStatus: (id: string, status: string) => Promise<void>;
  refreshDatabaseStats: () => Promise<void>;

  // Additional Admin Section CRUD
  addCertification: (cert: Partial<Certification>) => Promise<void>;
  updateCertification: (id: string, cert: Partial<Certification>) => Promise<void>;
  deleteCertification: (id: string) => Promise<void>;
  addCareer: (job: Partial<CareerJob>) => Promise<void>;
  updateCareer: (id: string, job: Partial<CareerJob>) => Promise<void>;
  deleteCareer: (id: string) => Promise<void>;
  addArticle: (art: Partial<Article>) => Promise<void>;
  updateArticle: (id: string, art: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  addFAQ: (faq: Partial<FAQItem>) => Promise<void>;
  updateFAQ: (id: string, faq: Partial<FAQItem>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  updateSiteContent: (keyOrData: string | Record<string, any>, data?: any) => Promise<void>;
  updateInquiryStatus: (id: string, status: string) => Promise<void>;
  deleteInquiry: (id: string) => Promise<void>;

  // Centralized SEO Metadata
  seoMetadata: SEOMetadataMap;
  updateSEOMetadata: (pageKey: string, data: Partial<PageSEOMetadata>) => Promise<boolean>;
  resetSEOMetadata: (pageKey: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_USER: UserProfile = {
  id: 'usr-1',
  name: 'Tiku Sharma',
  email: 'tikuphost@gmail.com',
  company: 'Global Procurement Ltd',
  role: 'Verified Buyer',
  country: 'India'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [products, setProducts] = useState<CommodityProduct[]>(() => {
    try {
      const saved = localStorage.getItem('rme_products');
      return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [quotes, setQuotes] = useState<RFQQuote[]>(() => {
    try {
      const saved = localStorage.getItem('rme_quotes');
      return saved ? JSON.parse(saved) : DEFAULT_QUOTES;
    } catch {
      return DEFAULT_QUOTES;
    }
  });
  const [certifications, setCertifications] = useState<Certification[]>(DEFAULT_CERTIFICATIONS);
  const [articles, setArticles] = useState<Article[]>(DEFAULT_ARTICLES);
  const [careers, setCareers] = useState<CareerJob[]>(DEFAULT_CAREERS);
  const [jobApplications, setJobApplications] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<InquiryLead[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
  const [siteContent, setSiteContent] = useState<any>({});
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome-initial',
      sender: 'agent',
      text: 'Welcome to Richmount Exim! I am your AI Commercial Desk Assistant. How may I assist you with bulk biomass specifications, shipping schedules, or proforma quotations today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [databaseStats, setDatabaseStats] = useState<DatabaseStats | null>(null);
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Currency
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // RFQ Builder Cart
  const [rfqItems, setRfqItems] = useState<RFQItem[]>(() => {
    try {
      const saved = localStorage.getItem('rme_rfq_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('rme_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // Modals
  const [activeModal, setActiveModal] = useState<'none' | 'rfq' | 'product-detail' | 'cert-detail' | 'article-detail' | 'article-submit' | 'job-apply' | 'proforma-view'>('none');
  const [selectedProduct, setSelectedProduct] = useState<CommodityProduct | null>(null);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedJob, setSelectedJob] = useState<CareerJob | null>(null);
  const [selectedQuoteForView, setSelectedQuoteForView] = useState<RFQQuote | null>(null);

  // Chat & Admin
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    try {
      const savedUser = localStorage.getItem('rme_user_profile');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'Admin') return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  // Dual-Persona Chat Session States
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeAdminSessionId, setActiveAdminSessionId] = useState<string | null>('sess-101');
  const [activeSessionMessages, setActiveSessionMessages] = useState<ChatMessage[]>([]);
  const [customerChatSession, setCustomerChatSession] = useState<ChatSession | null>(() => {
    try {
      const saved = localStorage.getItem('rme_customer_chat_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist customer chat session
  useEffect(() => {
    try {
      if (customerChatSession) {
        localStorage.setItem('rme_customer_chat_session', JSON.stringify(customerChatSession));
      } else {
        localStorage.removeItem('rme_customer_chat_session');
      }
    } catch (e) {
      console.error(e);
    }
  }, [customerChatSession]);

  // Load messages whenever activeAdminSessionId changes
  useEffect(() => {
    if (!activeAdminSessionId) return;
    let isCurrent = true;
    fetch(`/api/chat/sessions/${activeAdminSessionId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (isCurrent && Array.isArray(data)) {
          setActiveSessionMessages(data);
        }
      })
      .catch((e) => console.error('Failed to load session messages:', e));
    return () => {
      isCurrent = false;
    };
  }, [activeAdminSessionId]);

  // Persist RFQ items
  useEffect(() => {
    try {
      localStorage.setItem('rme_rfq_items', JSON.stringify(rfqItems));
    } catch (e) {
      console.error(e);
    }
  }, [rfqItems]);

  // Persist Products (supports offline/static admin updates)
  useEffect(() => {
    try {
      localStorage.setItem('rme_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Persist Quotes (supports offline/static RFQ submissions)
  useEffect(() => {
    try {
      localStorage.setItem('rme_quotes', JSON.stringify(quotes));
    } catch (e) {
      console.error(e);
    }
  }, [quotes]);

  // Persist User
  useEffect(() => {
    try {
      localStorage.setItem('rme_user_profile', JSON.stringify(currentUser));
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Centralized SEO State with Local Storage and Server Fallbacks
  const [seoMetadata, setSeoMetadata] = useState<SEOMetadataMap>(() => {
    try {
      const cached = localStorage.getItem('rme_seo_metadata');
      if (cached) {
        return { ...DEFAULT_SEO_CONFIGS, ...JSON.parse(cached) };
      }
    } catch (e) {
      console.warn('Could not read SEO metadata from local cache:', e);
    }
    return DEFAULT_SEO_CONFIGS;
  });

  // Dynamic SEO Synchronization with Document Head
  useEffect(() => {
    let key: string = 'home';
    if (currentPage === 'about') key = 'about';
    else if (currentPage === 'blog') key = 'blog';
    else if (currentPage === 'careers') key = 'careers';
    else if (currentPage === 'faq') key = 'faq';
    else if (currentPage === 'products') key = 'product';
    else key = 'home';

    const currentSeo = seoMetadata[key] || DEFAULT_SEO_CONFIGS[key] || DEFAULT_SEO_CONFIGS.home;

    if (activeModal === 'product-detail' && selectedProduct) {
      applyDocumentSEO({
        pageKey: 'product',
        pageName: selectedProduct.name,
        title: `${selectedProduct.name} (HS: ${selectedProduct.hsCode}) - Export Specs | Richmount Exim`,
        description: selectedProduct.description || currentSeo.description,
        keywords: `${selectedProduct.name}, HS ${selectedProduct.hsCode}, ${selectedProduct.calorificValue}, biomass export, Richmount Exim`,
        ogTitle: `${selectedProduct.name} - Technical Analysis & Export Quotation`,
        ogDescription: `Calorific Value: ${selectedProduct.calorificValue} | Moisture: ${selectedProduct.moisture} | Ash: ${selectedProduct.ashContent}. FOB JNPT / CIF Global Ports.`,
        ogImage: selectedProduct.imageUrl || currentSeo.ogImage,
        twitterCard: 'summary_large_image',
        canonicalUrl: `https://www.richmount-exim.com/products/${selectedProduct.id}`
      });
    } else {
      applyDocumentSEO(currentSeo);
    }
  }, [currentPage, seoMetadata, activeModal, selectedProduct]);

  // Persist SEO metadata locally
  useEffect(() => {
    try {
      localStorage.setItem('rme_seo_metadata', JSON.stringify(seoMetadata));
    } catch (e) {
      console.error(e);
    }
  }, [seoMetadata]);

  // Initial State Hydration (/api/data/all)
  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/data/all');
        if (!res.ok) {
          throw new Error(`Hydration failed: HTTP ${res.status}`);
        }
        const data: AppInitialData = await res.json();
        if (isMounted) {
          setProducts(data.products || []);
          setCategories(data.categories || []);
          setQuotes(data.quotes || []);
          setCertifications(data.certifications || []);
          setArticles(data.articles || []);
          setCareers(data.careers || []);
          setJobApplications(data.jobApplications || []);
          setInquiries(data.inquiries || []);
          setFaqs(data.faqs || []);
          if (data.siteContent) {
            setSiteContent(data.siteContent);
          }
          setChatHistory(data.chatHistory || []);
          if (data.chatSessions && data.chatSessions.length > 0) {
            setChatSessions(data.chatSessions);
            // Default active admin session if not set
            setActiveAdminSessionId((prev) => prev || data.chatSessions![0].id);
          }
          setDatabaseStats(data.databaseStats || null);
          if (data.seoMetadata && Object.keys(data.seoMetadata).length > 0) {
            setSeoMetadata((prev) => ({ ...prev, ...data.seoMetadata }));
          }
          if (data.metrics) {
            setMetrics(data.metrics);
          }
          setError(null);
        }
      } catch (err: any) {
        // In static hosting environments like GitHub Pages, /api/data/all will return 404.
        // We gracefully fall back to our rich embedded datasets without throwing or blocking.
        console.info('[AppContext] Running in static/GitHub Pages deployment mode. Embedded datasets active.');
        if (isMounted) {
          setError(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAllData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Format Price with selected currency
  const formatPrice = (usdAmount: number) => {
    const cur = CURRENCIES[currency];
    const converted = usdAmount * cur.rate;
    if (currency === 'JPY') {
      return `${cur.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${cur.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // RFQ Cart Methods
  const addToRFQ = (product: CommodityProduct, volume: number = product.minOrderQty, unit: VolumeUnit = 'MT') => {
    setRfqItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.productId === product.id);
      const packaging = product.packagingOptions?.[0] || 'Standard Packaging';
      if (existingIdx > -1) {
        const next = [...prev];
        const newVol = next[existingIdx].volume + volume;
        next[existingIdx] = {
          ...next[existingIdx],
          volume: newVol,
          lineTotalUSD: newVol * product.basePriceUSD
        };
        return next;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            hsCode: product.hsCode,
            volume,
            unit,
            unitPriceUSD: product.basePriceUSD,
            selectedPackaging: packaging,
            lineTotalUSD: volume * product.basePriceUSD
          }
        ];
      }
    });
    setActiveModal('rfq');
  };

  const updateRFQItem = (productId: string, updates: Partial<RFQItem>) => {
    setRfqItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const updated = { ...item, ...updates };
          updated.lineTotalUSD = updated.volume * updated.unitPriceUSD;
          return updated;
        }
        return item;
      })
    );
  };

  const removeFromRFQ = (productId: string) => {
    setRfqItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearRFQ = () => {
    setRfqItems([]);
  };

  const submitRFQ = async (quoteData: Partial<RFQQuote>): Promise<RFQQuote | null> => {
    try {
      const quoteNumber = `RME-RFQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const isUserAdmin = currentUser.role === 'Admin';

      // Port freight calculations
      const portInfo = MAJOR_PORTS.find((p) => p.name === quoteData.destinationPort) || MAJOR_PORTS[0];
      const totalTonnage = rfqItems.reduce((sum, i) => sum + i.volume, 0);

      // If submitted by regular user, price must be determined/given by Admin
      const quoteItems: RFQItem[] = rfqItems.map((item) => ({
        ...item,
        unitPriceUSD: isUserAdmin ? item.unitPriceUSD : 0,
        lineTotalUSD: isUserAdmin ? item.lineTotalUSD : 0
      }));

      const subtotalUSD = isUserAdmin ? rfqItems.reduce((sum, item) => sum + item.lineTotalUSD, 0) : 0;
      let freightUSD = 0;
      let insuranceUSD = 0;
      if (isUserAdmin && (quoteData.incoterm === 'CIF' || quoteData.incoterm === 'CFR')) {
        freightUSD = portInfo.estFreightUSDPerMT * totalTonnage;
      }
      if (isUserAdmin && quoteData.incoterm === 'CIF') {
        insuranceUSD = Math.round(subtotalUSD * 0.0065);
      }

      let discountUSD = 0;
      if (isUserAdmin) {
        if (totalTonnage >= 100) discountUSD = Math.round(subtotalUSD * 0.04);
        else if (totalTonnage >= 50) discountUSD = Math.round(subtotalUSD * 0.02);
      }

      const inspectionUSD = 350;
      const totalUSD = isUserAdmin
        ? (subtotalUSD + freightUSD + insuranceUSD + inspectionUSD - discountUSD)
        : 0;

      const newQuote: RFQQuote = {
        id: 'rfq-' + Date.now(),
        quoteNumber,
        createdAt: new Date().toISOString(),
        buyerName: quoteData.buyerName || currentUser.name,
        buyerCompany: quoteData.buyerCompany || currentUser.company,
        buyerEmail: quoteData.buyerEmail || currentUser.email,
        buyerPhone: quoteData.buyerPhone || '+91 8921517645',
        buyerCountry: quoteData.buyerCountry || currentUser.country,
        destinationPort: quoteData.destinationPort || 'Port of Rotterdam, Netherlands',
        incoterm: quoteData.incoterm || 'CIF',
        items: quoteItems,
        subtotalUSD,
        freightCostUSD: freightUSD,
        insuranceCostUSD: insuranceUSD,
        inspectionFeeUSD: inspectionUSD,
        discountUSD,
        totalUSD,
        status: isUserAdmin ? 'Quoted' : 'Pending Admin Price',
        notes: quoteData.notes || (isUserAdmin ? 'Commercial terms authorized.' : 'Buyer inquiry awaiting price tariff confirmation from Admin Trade Desk.'),
        paymentTerms: quoteData.paymentTerms || '30% Advance T/T, 70% against B/L copy',
        estimatedDeliveryWeeks: Math.ceil(portInfo.oceanTransitDays / 7) + 2,
        validUntil: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
        assignedManager: isUserAdmin ? 'Admin Trade Desk' : 'Pending Admin Pricing'
      };

      // Optimistic update
      setQuotes((prev) => [newQuote, ...prev]);
      clearRFQ();

      // Background API sync
      fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuote)
      }).catch((e) => console.error('Error saving quote to backend:', e));

      return newQuote;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const switchRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
      name: role === 'Admin' ? 'Executive Director (Admin)' : role === 'Sales Manager' ? 'Vikramaditya Rao (Sales)' : role === 'Logistics Coordinator' ? 'Ananya Sharma (Logistics)' : prev.name
    }));
    if (role === 'Admin') {
      setIsAdminOpen(true);
      setCurrentPage('admin');
    } else {
      setIsAdminOpen(false);
      if (currentPage === 'admin') {
        setCurrentPage('home');
      }
    }
  };

  const refreshChatSessions = async () => {
    try {
      const res = await fetch('/api/chat/sessions');
      if (res.ok) {
        const data = await res.json();
        setChatSessions(data);
      }
    } catch (e) {
      console.error('Failed to refresh chat sessions:', e);
    }
  };

  const startCustomerChatSession = async (details: {
    name: string;
    email: string;
    company: string;
    country: string;
    message: string;
    tags?: string[];
  }): Promise<ChatSession | null> => {
    try {
      const res = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactIdentifier: details.email || `guest-${Date.now()}`,
          customerName: details.name,
          customerEmail: details.email,
          customerCompany: details.company,
          customerCountry: details.country,
          initialMessage: details.message,
          tags: details.tags || ['Storefront Inquiry']
        })
      });

      if (res.ok) {
        const session: ChatSession = await res.json();
        setCustomerChatSession(session);
        setChatSessions((prev) => {
          const exists = prev.find((s) => s.id === session.id);
          if (exists) return prev.map((s) => (s.id === session.id ? session : s));
          return [session, ...prev];
        });

        // Load messages for this new session
        const msgRes = await fetch(`/api/chat/sessions/${session.id}/messages`);
        if (msgRes.ok) {
          const msgs = await msgRes.json();
          if (session.id === activeAdminSessionId || !activeAdminSessionId) {
            setActiveSessionMessages(msgs);
            setActiveAdminSessionId(session.id);
          }
        }
        return session;
      }
    } catch (e) {
      console.error('Failed to start customer chat session:', e);
    }
    return null;
  };

  const sendCustomerChatMessage = async (text: string) => {
    if (!customerChatSession) return;
    const now = new Date().toISOString();
    const optimisticMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sessionId: customerChatSession.id,
      sender: 'customer',
      senderName: customerChatSession.customerName || currentUser.name,
      senderAvatar: (customerChatSession.customerName || 'CU').slice(0, 2).toUpperCase(),
      message: text,
      text,
      timestamp: now,
      read: 0,
      attachments: []
    };

    if (activeAdminSessionId === customerChatSession.id) {
      setActiveSessionMessages((prev) => [...prev, optimisticMsg]);
    }

    setChatSessions((prev) =>
      prev.map((s) =>
        s.id === customerChatSession.id
          ? {
              ...s,
              lastMessageText: text,
              lastMessageTime: now,
              status: 'waiting_agent',
              unreadAdminCount: (s.unreadAdminCount || 0) + 1
            }
          : s
      )
    );

    try {
      const res = await fetch(`/api/chat/sessions/${customerChatSession.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'customer',
          senderName: customerChatSession.customerName || currentUser.name,
          senderAvatar: (customerChatSession.customerName || 'CU').slice(0, 2).toUpperCase(),
          message: text,
          attachments: []
        })
      });

      if (res.ok) {
        // Fetch updated session messages to receive any auto-SLA reply
        const msgRes = await fetch(`/api/chat/sessions/${customerChatSession.id}/messages`);
        if (msgRes.ok) {
          const msgs = await msgRes.json();
          if (activeAdminSessionId === customerChatSession.id) {
            setActiveSessionMessages(msgs);
          }
        }
      }
    } catch (e) {
      console.error('Error sending customer chat message:', e);
    }
  };

  const sendAdminChatMessage = async (sessionId: string, text: string, senderName?: string) => {
    const defaultAgentName = currentUser.role === 'Admin' ? 'Executive Director (Admin)' : currentUser.name;
    const chosenName = senderName || defaultAgentName;
    const now = new Date().toISOString();

    const optimisticMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sessionId,
      sender: 'agent',
      senderName: chosenName,
      senderAvatar: 'RX',
      message: text,
      text,
      timestamp: now,
      read: 0,
      attachments: []
    };

    setActiveSessionMessages((prev) => [...prev, optimisticMsg]);

    setChatSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              lastMessageText: text,
              lastMessageTime: now,
              status: 'active',
              unreadAdminCount: 0,
              unreadCustomerCount: (s.unreadCustomerCount || 0) + 1
            }
          : s
      )
    );

    try {
      await fetch(`/api/chat/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: 'agent',
          senderName: chosenName,
          senderAvatar: 'RX',
          message: text,
          attachments: []
        })
      });
    } catch (e) {
      console.error('Error sending admin chat message:', e);
    }
  };

  const updateChatSessionMeta = async (sessionId: string, updates: Partial<ChatSession>) => {
    setChatSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, ...updates } : s))
    );
    if (customerChatSession && customerChatSession.id === sessionId) {
      setCustomerChatSession((prev) => (prev ? { ...prev, ...updates } : null));
    }

    try {
      await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (e) {
      console.error('Error updating chat session meta:', e);
    }
  };

  const markChatSessionRead = async (sessionId: string, who: 'admin' | 'customer') => {
    setChatSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              unreadAdminCount: who === 'admin' ? 0 : s.unreadAdminCount,
              unreadCustomerCount: who === 'customer' ? 0 : s.unreadCustomerCount
            }
          : s
      )
    );

    try {
      await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markRead: who })
      });
    } catch (e) {
      console.error('Error marking chat session read:', e);
    }
  };

  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      senderName: currentUser.name,
      text,
      timestamp: new Date().toISOString()
    };

    setChatHistory((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, senderName: currentUser.name })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.agentReply) {
          setChatHistory((prev) => [...prev, data.agentReply]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Product CRUD
  const addProduct = async (productData: Partial<CommodityProduct>) => {
    const id = 'prod-' + Date.now();
    const newProduct: CommodityProduct = {
      id,
      name: productData.name || 'New Commodity',
      category: productData.category || 'Bio Fuels & Biomass Energy',
      subCategory: productData.subCategory || 'Processed Fuel',
      code: productData.code || 'RME-GEN-' + Math.floor(100 + Math.random() * 900),
      hsCode: productData.hsCode || '4401.31.00',
      calorificValue: productData.calorificValue || '4,500 kcal/kg',
      calorificMin: productData.calorificMin || 4200,
      calorificMax: productData.calorificMax || 4800,
      moisture: productData.moisture || '< 10%',
      ashContent: productData.ashContent || '< 2.5%',
      bulkDensity: productData.bulkDensity || '600 kg/m³',
      fixedCarbon: productData.fixedCarbon || '20%',
      volatileMatter: productData.volatileMatter || '75%',
      particleSize: productData.particleSize || 'Standard 8mm',
      minOrderQty: productData.minOrderQty || 20,
      basePriceUSD: productData.basePriceUSD || 120,
      packagingOptions: productData.packagingOptions || ['50kg Bags', '1000kg Jumbo Bags'],
      harvestSeason: productData.harvestSeason || 'Year-Round Continuous',
      origin: productData.origin || 'India',
      applications: productData.applications || ['Industrial Boilers'],
      description: productData.description || '',
      inStock: productData.inStock ?? true,
      featured: productData.featured ?? false,
      gradeTier: productData.gradeTier || 'Industrial Premium',
      imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
    };

    setProducts((prev) => [newProduct, ...prev]);

    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    }).catch(console.error);
  };

  const updateProduct = async (id: string, productData: Partial<CommodityProduct>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );

    const updated = products.find((p) => p.id === id);
    if (updated) {
      fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updated, ...productData })
      }).catch(console.error);
    }
  };

  const updateProductPrice = async (id: string, newPriceUSD: number) => {
    await updateProduct(id, { basePriceUSD: newPriceUSD });
  };

  const updateProductStock = async (id: string, inStockStatus: string) => {
    await updateProduct(id, { inStock: inStockStatus === 'In Stock' });
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    fetch(`/api/products/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  // RFQ Pipeline CRUD
  const updateQuoteStatus = async (id: string, updates: Partial<RFQQuote>) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );

    fetch(`/api/quotes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    }).catch(console.error);
  };

  const priceQuoteByAdmin = async (
    quoteId: string,
    itemPrices: { productId: string; unitPriceUSD: number }[],
    freightUSD?: number,
    insuranceUSD?: number,
    discountUSD?: number
  ) => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return;

    const updatedItems = quote.items.map((item) => {
      const override = itemPrices.find((ip) => ip.productId === item.productId);
      const unitPriceUSD = override !== undefined ? override.unitPriceUSD : (item.unitPriceUSD || 0);
      return {
        ...item,
        unitPriceUSD,
        lineTotalUSD: Math.round(item.volume * unitPriceUSD)
      };
    });

    const subtotalUSD = updatedItems.reduce((acc, i) => acc + i.lineTotalUSD, 0);
    const finalFreight = freightUSD !== undefined ? freightUSD : (quote.freightCostUSD || 0);
    const finalInsurance = insuranceUSD !== undefined ? insuranceUSD : (quote.insuranceCostUSD || Math.round(subtotalUSD * 0.0065));
    const finalDiscount = discountUSD !== undefined ? discountUSD : (quote.discountUSD || 0);
    const inspectionUSD = quote.inspectionFeeUSD || 350;
    const totalUSD = subtotalUSD + finalFreight + finalInsurance + inspectionUSD - finalDiscount;

    const updates: Partial<RFQQuote> = {
      items: updatedItems,
      subtotalUSD,
      freightCostUSD: finalFreight,
      insuranceCostUSD: finalInsurance,
      discountUSD: finalDiscount,
      totalUSD,
      status: 'Quoted',
      assignedManager: 'Admin Commercial Desk (Price Confirmed)'
    };

    setQuotes((prev) => prev.map((q) => (q.id === quoteId ? { ...q, ...updates } : q)));

    try {
      await fetch(`/api/quotes/${quoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (err) {
      console.error('Failed to submit quote pricing:', err);
    }
  };

  const deleteQuote = async (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    fetch(`/api/quotes/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  // Article / Blog CRUD
  const submitArticle = async (artData: Partial<Article>) => {
    const id = 'art-' + Date.now();
    const newArt: Article = {
      id,
      title: artData.title || 'Technical Article',
      slug: (artData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: artData.excerpt || '',
      content: artData.content || '',
      category: artData.category || 'Biomass Decarbonization',
      author: artData.author || currentUser.name,
      authorRole: artData.authorRole || currentUser.company,
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      status: currentUser.role === 'Admin' ? 'Approved' : 'Pending Moderation',
      tags: artData.tags || ['Biomass', 'Renewable Energy'],
      views: 0
    };

    setArticles((prev) => [newArt, ...prev]);

    fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArt)
    }).catch(console.error);
  };

  const updateArticleStatus = async (id: string, status: 'Approved' | 'Rejected' | 'Pending Moderation') => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );

    fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(console.error);
  };

  // Inquiry & Job submission
  const submitInquiry = async (inqData: Partial<InquiryLead>) => {
    const id = 'inq-' + Date.now();
    const newInq: InquiryLead = {
      id,
      fullName: inqData.fullName || inqData.name || currentUser.name,
      name: inqData.name || inqData.fullName || currentUser.name,
      email: inqData.email || currentUser.email,
      phone: inqData.phone || '+91 8921517645',
      company: inqData.company || currentUser.company,
      country: inqData.country || currentUser.country,
      subject: inqData.subject || 'Export Inquiry',
      message: inqData.message || '',
      productInterest: inqData.productInterest || inqData.commodity || 'General',
      commodity: inqData.commodity || inqData.productInterest || 'General',
      estimatedTonnage: inqData.estimatedTonnage,
      createdAt: new Date().toISOString(),
      status: 'New'
    };

    setInquiries((prev) => [newInq, ...prev]);

    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInq)
    }).catch(console.error);
  };

  const submitJobApplication = async (appData: any) => {
    const newApp = {
      id: 'app-' + Date.now(),
      ...appData,
      submittedAt: new Date().toISOString(),
      status: 'Under Review'
    };
    setJobApplications((prev) => [newApp, ...prev]);

    fetch('/api/careers/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    }).catch(console.error);
  };

  const updateJobApplicationStatus = async (id: string, status: string) => {
    setJobApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    try {
      await fetch(`/api/careers/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.error('Error updating application status:', e);
    }
  };

  // Certifications CRUD
  const addCertification = async (cert: Partial<Certification>) => {
    const id = cert.id || 'cert-' + Date.now();
    const newCert: Certification = {
      id,
      name: cert.name || 'Quality Accreditation',
      issuer: cert.issuer || 'International Accreditation Forum',
      code: cert.code || 'ISO-9001',
      issueDate: cert.issueDate || new Date().toISOString().split('T')[0],
      validUntil: cert.validUntil || '2028-12-31',
      accreditedBody: cert.accreditedBody || 'IAF Multilateral',
      category: cert.category || 'Quality',
      description: cert.description || '',
      badgeCode: cert.badgeCode || 'GLOBAL_AUDIT_PASS',
      documentNumber: cert.documentNumber || `RME/QA/${Math.floor(1000 + Math.random() * 9000)}`
    };
    setCertifications((prev) => [...prev, newCert]);
    fetch('/api/certifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCert)
    }).catch(console.error);
  };

  const updateCertification = async (id: string, cert: Partial<Certification>) => {
    setCertifications((prev) => prev.map((c) => (c.id === id ? { ...c, ...cert } : c)));
    const existing = certifications.find((c) => c.id === id);
    if (existing) {
      fetch(`/api/certifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...existing, ...cert })
      }).catch(console.error);
    }
  };

  const deleteCertification = async (id: string) => {
    setCertifications((prev) => prev.filter((c) => c.id !== id));
    fetch(`/api/certifications/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  // Careers CRUD
  const addCareer = async (job: Partial<CareerJob>) => {
    const id = job.id || 'job-' + Date.now();
    const newJob: CareerJob = {
      id,
      title: job.title || 'Export Operations Specialist',
      department: job.department || 'Export Logistics',
      location: job.location || 'Mumbai / Hybrid',
      type: job.type || 'Full-time',
      experience: job.experience || '3 - 6 Years',
      description: job.description || '',
      requirements: job.requirements || ["Bachelor's degree in International Trade", 'Proficiency in Incoterms 2020'],
      responsibilities: job.responsibilities || ['Manage vessel schedules', 'Liaise with customs brokers'],
      active: job.active !== undefined ? job.active : true
    };
    setCareers((prev) => [...prev, newJob]);
    fetch('/api/careers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newJob)
    }).catch(console.error);
  };

  const updateCareer = async (id: string, job: Partial<CareerJob>) => {
    setCareers((prev) => prev.map((j) => (j.id === id ? { ...j, ...job } : j)));
    const existing = careers.find((j) => j.id === id);
    if (existing) {
      fetch(`/api/careers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...existing, ...job })
      }).catch(console.error);
    }
  };

  const deleteCareer = async (id: string) => {
    setCareers((prev) => prev.filter((j) => j.id !== id));
    fetch(`/api/careers/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  // Articles CRUD
  const addArticle = async (art: Partial<Article>) => {
    await submitArticle(art);
  };

  const updateArticle = async (id: string, art: Partial<Article>) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, ...art } : a)));
    fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(art)
    }).catch(console.error);
  };

  const deleteArticle = async (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    fetch(`/api/articles/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  // FAQs CRUD
  const addFAQ = async (faq: Partial<FAQItem>) => {
    const id = faq.id || 'faq-' + Date.now();
    const newFaq: FAQItem = {
      id,
      category: faq.category || 'General',
      question: faq.question || '',
      answer: faq.answer || '',
      tags: faq.tags || []
    };
    setFaqs((prev) => [...prev, newFaq]);
    fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFaq)
    }).catch(console.error);
  };

  const updateFAQ = async (id: string, faq: Partial<FAQItem>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...faq } : f)));
    fetch(`/api/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faq)
    }).catch(console.error);
  };

  const deleteFAQ = async (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    fetch(`/api/faqs/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  // Site Content
  const updateSiteContent = async (keyOrData: string | Record<string, any>, data?: any) => {
    if (typeof keyOrData === 'object' && keyOrData !== null) {
      setSiteContent((prev: any) => ({ ...prev, ...keyOrData }));
      if (keyOrData.metrics) {
        setMetrics((prev) => ({ ...prev, ...keyOrData.metrics }));
      }
      for (const [k, v] of Object.entries(keyOrData)) {
        fetch(`/api/site-content/${k}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(v)
        }).catch(console.error);
      }
      return;
    }

    const key = keyOrData as string;
    setSiteContent((prev: any) => ({ ...prev, [key]: data }));
    if (key === 'metrics' && data) {
      setMetrics((prev) => ({ ...prev, ...data }));
    }
    fetch(`/api/site-content/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(console.error);
  };

  // Inquiries status & deletion
  const updateInquiryStatus = async (id: string, status: string) => {
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status: status as any } : inq)));
    fetch(`/api/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(console.error);
  };

  const deleteInquiry = async (id: string) => {
    setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    fetch(`/api/inquiries/${id}`, { method: 'DELETE' }).catch(console.error);
  };

  const refreshDatabaseStats = async () => {
    try {
      const res = await fetch('/api/database/stats');
      if (res.ok) {
        const stats = await res.json();
        setDatabaseStats(stats);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateSEOMetadata = async (pageKey: string, data: Partial<PageSEOMetadata>): Promise<boolean> => {
    try {
      const base = seoMetadata[pageKey] || DEFAULT_SEO_CONFIGS[pageKey] || DEFAULT_SEO_CONFIGS.home;
      const updatedRecord: PageSEOMetadata = {
        ...base,
        ...data,
        pageKey: pageKey as any,
        updatedAt: new Date().toISOString()
      };

      // Optimistic update
      setSeoMetadata((prev) => ({
        ...prev,
        [pageKey]: updatedRecord
      }));

      // Immediate DOM update if currently on this page
      const currentActiveKey = currentPage === 'products' ? 'product' : currentPage;
      if (currentActiveKey === pageKey) {
        applyDocumentSEO(updatedRecord);
      }

      // Backend API sync
      const res = await fetch(`/api/seo/${pageKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecord)
      });

      return res.ok;
    } catch (err) {
      console.error('Failed to update SEO metadata:', err);
      return false;
    }
  };

  const resetSEOMetadata = async (pageKey: string): Promise<boolean> => {
    const defaultData = DEFAULT_SEO_CONFIGS[pageKey];
    if (!defaultData) return false;
    return updateSEOMetadata(pageKey, defaultData);
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        products,
        categories,
        quotes,
        certifications,
        articles,
        careers,
        faqs,
        siteContent,
        jobApplications,
        inquiries,
        chatHistory,
        chatMessages: chatHistory,
        databaseStats,
        metrics,
        isLoading,
        error,
        currency,
        setCurrency,
        formatPrice,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        rfqItems,
        addToRFQ,
        updateRFQItem,
        removeFromRFQ,
        clearRFQ,
        submitRFQ,
        currentUser,
        switchRole,
        activeModal,
        setActiveModal,
        selectedProduct,
        setSelectedProduct,
        selectedCert,
        setSelectedCert,
        selectedArticle,
        setSelectedArticle,
        selectedJob,
        setSelectedJob,
        selectedQuoteForView,
        setSelectedQuoteForView,
        isChatOpen,
        setIsChatOpen,
        chatSessions,
        activeAdminSessionId,
        setActiveAdminSessionId,
        customerChatSession,
        setCustomerChatSession,
        activeSessionMessages,
        startCustomerChatSession,
        sendCustomerChatMessage,
        sendAdminChatMessage,
        updateChatSessionMeta,
        markChatSessionRead,
        refreshChatSessions,
        sendChatMessage,
        isAdminOpen,
        setIsAdminOpen,
        addProduct,
        updateProduct,
        updateProductPrice,
        updateProductStock,
        deleteProduct,
        updateQuoteStatus,
        priceQuoteByAdmin,
        deleteQuote,
        updateArticleStatus,
        submitArticle,
        submitInquiry,
        submitJobApplication,
        updateJobApplicationStatus,
        refreshDatabaseStats,
        addCertification,
        updateCertification,
        deleteCertification,
        addCareer,
        updateCareer,
        deleteCareer,
        addArticle,
        updateArticle,
        deleteArticle,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        updateSiteContent,
        updateInquiryStatus,
        deleteInquiry,
        seoMetadata,
        updateSEOMetadata,
        resetSEOMetadata
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
