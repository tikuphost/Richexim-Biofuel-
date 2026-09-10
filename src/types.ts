export type IncotermType = 'FOB' | 'CIF' | 'CFR' | 'EXW' | 'DAP';
export type VolumeUnit = 'MT' | 'Containers (20ft FCL)' | 'Containers (40ft HC)' | 'Metric Tons (Loose Bulk)' | 'Bags (25/50kg)';
export type QuoteStatus = 'Pending Admin Price' | 'Pending' | 'Quoted' | 'Negotiating' | 'Confirmed' | 'Shipped' | 'Completed';
export type UserRole = 'Admin' | 'Sales Manager' | 'Logistics Coordinator' | 'Verified Buyer' | 'Guest';
export type AppPage = 'home' | 'about' | 'products' | 'blog' | 'quality' | 'careers' | 'contact' | 'faq';

export interface CommodityProduct {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  code: string;
  hsCode: string;
  calorificValue: string; // e.g. "7500 - 8000 kcal/kg"
  calorificMin: number;
  calorificMax: number;
  moisture: string; // e.g. "< 8%"
  ashContent: string; // e.g. "1 - 3%"
  bulkDensity: string; // e.g. "600 - 750 kg/m³"
  fixedCarbon?: string;
  volatileMatter?: string;
  particleSize?: string;
  minOrderQty: number; // in MT
  basePriceUSD: number; // per MT
  packagingOptions: string[];
  harvestSeason: string;
  origin: string;
  applications: string[];
  description: string;
  inStock: boolean;
  featured: boolean;
  gradeTier: 'Export Grade A+' | 'Industrial Premium' | 'Standard Processed';
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  productCount: number;
}

export interface RFQItem {
  productId: string;
  productName: string;
  hsCode: string;
  volume: number;
  unit: VolumeUnit;
  unitPriceUSD: number;
  selectedPackaging: string;
  lineTotalUSD: number;
}

export interface RFQQuote {
  id: string;
  quoteNumber: string;
  createdAt: string;
  buyerName: string;
  buyerCompany: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerCountry: string;
  destinationPort: string;
  incoterm: IncotermType;
  items: RFQItem[];
  subtotalUSD: number;
  freightCostUSD: number;
  insuranceCostUSD: number;
  inspectionFeeUSD: number;
  discountUSD: number;
  totalUSD: number;
  status: QuoteStatus;
  notes?: string;
  paymentTerms: string;
  estimatedDeliveryWeeks: number;
  validUntil: string;
  assignedManager?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  code: string;
  issueDate: string;
  validUntil: string;
  accreditedBody: string;
  category: 'Quality' | 'Sustainability' | 'Safety' | 'Religious' | 'Export Trade';
  description: string;
  badgeCode: string;
  documentNumber: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: 'Crop & Harvest Report' | 'Biomass Decarbonization' | 'Boiler Efficiency' | 'Global Supply Chain';
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  status: 'Approved' | 'Pending Moderation' | 'Rejected';
  tags: string[];
  views: number;
}

export interface CareerJob {
  id: string;
  title: string;
  department: 'Export Logistics' | 'Quality & Lab' | 'International Trade' | 'Plant Operations';
  location: string;
  type: 'Full-time' | 'Contract' | 'Hybrid';
  experience: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  active: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone: string;
  experienceYears: number;
  coverLetter: string;
  portfolioUrl?: string;
  submittedAt: string;
  status: 'Under Review' | 'Shortlisted' | 'Interviewed' | 'Archived';
}

export interface InquiryLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  subject: string;
  message: string;
  productInterest: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Converted';
}

export interface ChatSession {
  id: string;
  contactIdentifier: string;
  customerName: string;
  customerEmail: string;
  customerCompany: string;
  customerCountry: string;
  status: 'active' | 'waiting_agent' | 'closed' | 'resolved';
  priority: 'low' | 'normal' | 'urgent';
  tags: string[];
  adminNotes?: string;
  assignedAgent?: string;
  lastMessageText: string;
  lastMessageTime: string;
  unreadAdminCount: number;
  unreadCustomerCount: number;
}

export interface ChatMessage {
  id: string;
  sessionId?: string;
  sender: 'customer' | 'agent' | 'system' | 'user';
  senderName?: string;
  senderAvatar?: string;
  message?: string;
  text?: string;
  timestamp: string;
  read?: number;
  attachments?: string[];
  suggestedPrompts?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  country: string;
  token?: string;
}

export interface DatabaseStats {
  sizeBytes: number;
  formattedSize: string;
  tableCounts: Record<string, number>;
  lastBackupAt: string | null;
  serverUptimeSec: number;
  engine: string;
  storageType: string;
}

export interface PageSEOMetadata {
  pageKey: 'about' | 'blog' | 'product' | 'home' | 'careers' | 'faq' | string;
  pageName: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary_large_image' | 'summary';
  canonicalUrl: string;
  updatedAt?: string;
}

export type SEOMetadataMap = Record<string, PageSEOMetadata>;

export interface AppInitialData {
  products: CommodityProduct[];
  categories: Category[];
  quotes: RFQQuote[];
  certifications: Certification[];
  articles: Article[];
  careers: CareerJob[];
  jobApplications?: JobApplication[];
  inquiries: InquiryLead[];
  chatHistory: ChatMessage[];
  chatSessions?: ChatSession[];
  databaseStats: DatabaseStats;
  seoMetadata?: SEOMetadataMap;
  metrics: {
    countriesExported: number;
    annualTonnageMT: number;
    qualityAccreditations: number;
    co2OffsetMT: number;
    totalOrdersCompleted: number;
  };
}
