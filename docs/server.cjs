var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);
var import_vite = require("vite");

// server/db.ts
var import_sql = __toESM(require("sql.js"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var dbInstance = null;
var DATA_DIR = import_path.default.resolve(process.cwd(), "data");
var DB_FILE = import_path.default.resolve(DATA_DIR, "richmount.sqlite");
var lastBackupTimestamp = null;
async function getDatabase() {
  if (dbInstance) {
    return dbInstance;
  }
  if (!import_fs.default.existsSync(DATA_DIR)) {
    import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
  }
  const SQL = await (0, import_sql.default)();
  if (import_fs.default.existsSync(DB_FILE)) {
    try {
      const fileBuffer = import_fs.default.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(fileBuffer);
      console.log(`[SQLite] Loaded existing database from ${DB_FILE} (${fileBuffer.length} bytes)`);
    } catch (err) {
      console.error("[SQLite] Error reading existing database, initializing fresh:", err);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
    console.log("[SQLite] Initialized fresh SQLite database in memory");
  }
  runMigrations(dbInstance);
  saveDatabaseToDisk();
  return dbInstance;
}
function saveDatabaseToDisk() {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    import_fs.default.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error("[SQLite] Failed to persist database to disk:", err);
  }
}
function getDatabaseBuffer() {
  if (!dbInstance) {
    throw new Error("Database not initialized");
  }
  const data = dbInstance.export();
  lastBackupTimestamp = (/* @__PURE__ */ new Date()).toISOString();
  return Buffer.from(data);
}
function getDatabaseStats() {
  let sizeBytes = 0;
  if (import_fs.default.existsSync(DB_FILE)) {
    const stats = import_fs.default.statSync(DB_FILE);
    sizeBytes = stats.size;
  }
  const tableCounts = {};
  if (dbInstance) {
    const tables = ["products", "categories", "quotes", "certifications", "articles", "careers", "inquiries", "chat_messages", "chat_sessions", "faqs", "site_content"];
    for (const table of tables) {
      try {
        const res = dbInstance.exec(`SELECT COUNT(*) as count FROM ${table}`);
        if (res.length > 0 && res[0].values.length > 0) {
          tableCounts[table] = Number(res[0].values[0][0]);
        }
      } catch {
        tableCounts[table] = 0;
      }
    }
  }
  return {
    sizeBytes,
    formattedSize: (sizeBytes / 1024).toFixed(2) + " KB",
    tableCounts,
    lastBackupAt: lastBackupTimestamp,
    serverUptimeSec: Math.floor(process.uptime()),
    engine: "SQLite 3 (WASM / NVMe Optimized)",
    storageType: "NVMe Solid-State Disk"
  };
}
function runMigrations(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      iconName TEXT,
      description TEXT,
      productCount INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      subCategory TEXT,
      code TEXT NOT NULL,
      hsCode TEXT NOT NULL,
      calorificValue TEXT,
      calorificMin REAL,
      calorificMax REAL,
      moisture TEXT,
      ashContent TEXT,
      bulkDensity TEXT,
      fixedCarbon TEXT,
      volatileMatter TEXT,
      particleSize TEXT,
      minOrderQty REAL,
      basePriceUSD REAL,
      packagingOptions TEXT, -- JSON array
      harvestSeason TEXT,
      origin TEXT,
      applications TEXT, -- JSON array
      description TEXT,
      inStock INTEGER DEFAULT 1,
      featured INTEGER DEFAULT 0,
      gradeTier TEXT,
      imageUrl TEXT
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      quoteNumber TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      buyerName TEXT NOT NULL,
      buyerCompany TEXT NOT NULL,
      buyerEmail TEXT NOT NULL,
      buyerPhone TEXT,
      buyerCountry TEXT,
      destinationPort TEXT,
      incoterm TEXT,
      items TEXT, -- JSON array
      subtotalUSD REAL,
      freightCostUSD REAL,
      insuranceCostUSD REAL,
      inspectionFeeUSD REAL,
      discountUSD REAL,
      totalUSD REAL,
      status TEXT,
      notes TEXT,
      paymentTerms TEXT,
      estimatedDeliveryWeeks INTEGER,
      validUntil TEXT,
      assignedManager TEXT
    );

    CREATE TABLE IF NOT EXISTS certifications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      issuer TEXT NOT NULL,
      code TEXT NOT NULL,
      issueDate TEXT,
      validUntil TEXT,
      accreditedBody TEXT,
      category TEXT,
      description TEXT,
      badgeCode TEXT,
      documentNumber TEXT
    );

    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      category TEXT,
      author TEXT,
      authorRole TEXT,
      date TEXT,
      readTime TEXT,
      status TEXT,
      tags TEXT, -- JSON array
      views INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS careers (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      department TEXT,
      location TEXT,
      type TEXT,
      experience TEXT,
      description TEXT,
      requirements TEXT, -- JSON array
      responsibilities TEXT, -- JSON array
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS job_applications (
      id TEXT PRIMARY KEY,
      jobId TEXT,
      jobTitle TEXT,
      applicantName TEXT,
      email TEXT,
      phone TEXT,
      experienceYears REAL,
      coverLetter TEXT,
      portfolioUrl TEXT,
      submittedAt TEXT,
      status TEXT
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      fullName TEXT,
      email TEXT,
      phone TEXT,
      company TEXT,
      country TEXT,
      subject TEXT,
      message TEXT,
      productInterest TEXT,
      createdAt TEXT,
      status TEXT
    );

    CREATE TABLE IF NOT EXISTS chat_sessions (
      id TEXT PRIMARY KEY,
      contactIdentifier TEXT,
      customerName TEXT,
      customerEmail TEXT,
      customerCompany TEXT,
      customerCountry TEXT,
      status TEXT DEFAULT 'active', -- 'active' | 'waiting_agent' | 'closed' | 'resolved'
      priority TEXT DEFAULT 'normal', -- 'low' | 'normal' | 'urgent'
      tags TEXT, -- JSON array
      adminNotes TEXT,
      assignedAgent TEXT,
      lastMessageText TEXT,
      lastMessageTime TEXT,
      unreadAdminCount INTEGER DEFAULT 0,
      unreadCustomerCount INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      sessionId TEXT,
      sender TEXT, -- 'customer' | 'agent' | 'system'
      senderName TEXT,
      senderAvatar TEXT,
      message TEXT,
      text TEXT,
      timestamp TEXT,
      read INTEGER DEFAULT 0,
      attachments TEXT, -- JSON array
      suggestedPrompts TEXT -- JSON array
    );

    CREATE TABLE IF NOT EXISTS seo_metadata (
      pageKey TEXT PRIMARY KEY,
      pageName TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      keywords TEXT,
      ogTitle TEXT,
      ogDescription TEXT,
      ogImage TEXT,
      twitterCard TEXT DEFAULT 'summary_large_image',
      canonicalUrl TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      tags TEXT -- JSON array
    );

    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  try {
    db.run("ALTER TABLE chat_messages ADD COLUMN sessionId TEXT");
  } catch {
  }
  try {
    db.run("ALTER TABLE chat_messages ADD COLUMN senderAvatar TEXT");
  } catch {
  }
  try {
    db.run("ALTER TABLE chat_messages ADD COLUMN message TEXT");
  } catch {
  }
  try {
    db.run("ALTER TABLE chat_messages ADD COLUMN read INTEGER DEFAULT 0");
  } catch {
  }
  try {
    db.run("ALTER TABLE chat_messages ADD COLUMN attachments TEXT");
  } catch {
  }
  const countRes = db.exec("SELECT COUNT(*) as count FROM categories");
  const count = countRes.length > 0 && countRes[0].values.length > 0 ? Number(countRes[0].values[0][0]) : 0;
  if (count === 0) {
    console.log("[SQLite] Seeding enterprise initial datasets...");
    seedInitialData(db);
  }
  const seoRes = db.exec("SELECT COUNT(*) as count FROM seo_metadata");
  const seoCount = seoRes.length > 0 && seoRes[0].values.length > 0 ? Number(seoRes[0].values[0][0]) : 0;
  if (seoCount === 0) {
    seedSEOMetadata(db);
  }
  const faqRes = db.exec("SELECT COUNT(*) as count FROM faqs");
  const faqCount = faqRes.length > 0 && faqRes[0].values.length > 0 ? Number(faqRes[0].values[0][0]) : 0;
  if (faqCount === 0) {
    seedFAQs(db);
  }
  const scRes = db.exec("SELECT COUNT(*) as count FROM site_content");
  const scCount = scRes.length > 0 && scRes[0].values.length > 0 ? Number(scRes[0].values[0][0]) : 0;
  if (scCount === 0) {
    seedSiteContent(db);
  }
  const jobAppRes = db.exec("SELECT COUNT(*) as count FROM job_applications");
  const jobAppCount = jobAppRes.length > 0 && jobAppRes[0].values.length > 0 ? Number(jobAppRes[0].values[0][0]) : 0;
  if (jobAppCount === 0) {
    seedJobApplications(db);
  }
  const chatSessRes = db.exec("SELECT COUNT(*) as count FROM chat_sessions");
  const chatSessCount = chatSessRes.length > 0 && chatSessRes[0].values.length > 0 ? Number(chatSessRes[0].values[0][0]) : 0;
  if (chatSessCount === 0) {
    seedChatSessions(db);
  }
}
function seedJobApplications(db) {
  const initialJobApps = [
    {
      id: "app-001",
      jobId: "job-trade-manager",
      jobTitle: "Senior International Trade Manager",
      applicantName: "Vikramaditya Sengupta",
      email: "v.sengupta@exporttrade-intl.com",
      phone: "+91 98401 23456",
      experienceYears: 7,
      coverLetter: "7+ years managing maritime bulk commodity chartering and CIF European contracts. Solid experience with ASTM E870 certification and LC negotiations.",
      portfolioUrl: "https://linkedin.com/in/vikram-trade-export",
      submittedAt: new Date(Date.now() - 36e5 * 5).toISOString(),
      status: "Under Review"
    },
    {
      id: "app-002",
      jobId: "job-qa-engineer",
      jobTitle: "Biomass Quality Assay & Lab Chemist",
      applicantName: "Dr. Ananya Sharma",
      email: "ananya.sharma@biomaterialslab.in",
      phone: "+91 94220 78910",
      experienceYears: 4,
      coverLetter: "Analytical chemist specializing in proximate biomass analysis, bomb calorimetry (calorific GCV/NCV), and sulphur/chlorine emission abatement testing.",
      portfolioUrl: "https://orcid.org/0000-0002-1825-009X",
      submittedAt: new Date(Date.now() - 36e5 * 26).toISOString(),
      status: "Under Review"
    }
  ];
  for (const app2 of initialJobApps) {
    db.run(`
      INSERT OR IGNORE INTO job_applications (id, jobId, jobTitle, applicantName, email, phone, experienceYears, coverLetter, portfolioUrl, submittedAt, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [app2.id, app2.jobId, app2.jobTitle, app2.applicantName, app2.email, app2.phone, app2.experienceYears, app2.coverLetter, app2.portfolioUrl, app2.submittedAt, app2.status]);
  }
}
function seedInitialData(db) {
  const categories = [
    {
      id: "cat-blends",
      name: "Customized Biomass Blends",
      slug: "customized-biomass-blends",
      iconName: "FlaskConical",
      description: "Engineered tailor-made biomass formulations formulated for specific boiler combustion types (Stoker, FBC, AFBC, CFBC).",
      productCount: 2
    },
    {
      id: "cat-biofuels",
      name: "Bio Fuels & Biomass Energy",
      slug: "bio-fuels-biomass-energy",
      iconName: "Flame",
      description: "High-calorific briquettes, pellets, wood chips, and agro-residues designed to substitute industrial coal and furnace oil.",
      productCount: 6
    },
    {
      id: "cat-charcoal",
      name: "Coconut Charcoal & Briquettes",
      slug: "coconut-charcoal-briquettes",
      iconName: "Sparkles",
      description: "Premium smokeless coconut shell charcoal with high energy density (7,500-8,000 kcal/kg) and low ash content.",
      productCount: 3
    },
    {
      id: "cat-carbon",
      name: "Activated Carbon & Foundry Chips",
      slug: "activated-carbon-foundry-chips",
      iconName: "Filter",
      description: "Industrial filtration, metallurgical foundry casting, and gas absorption grades conforming to ASTM and ISO standards.",
      productCount: 4
    }
  ];
  for (const c of categories) {
    db.run(
      "INSERT INTO categories (id, name, slug, iconName, description, productCount) VALUES (?, ?, ?, ?, ?, ?)",
      [c.id, c.name, c.slug, c.iconName, c.description, c.productCount]
    );
  }
  const products = [
    {
      id: "prod-custom-blend-1",
      name: "Customized Biomass Boiler Blend - FBC Grade",
      category: "Customized Biomass Blends",
      subCategory: "Boiler Engineering",
      code: "RME-CBB-FBC",
      hsCode: "4401.39.00",
      calorificValue: "4,200 - 5,200 kcal/kg",
      calorificMin: 4200,
      calorificMax: 5200,
      moisture: "8% - 14%",
      ashContent: "< 3.5%",
      bulkDensity: "380 - 450 kg/m\xB3",
      fixedCarbon: "18% - 22%",
      volatileMatter: "68% - 74%",
      particleSize: "10 - 25 mm",
      minOrderQty: 50,
      basePriceUSD: 115,
      packagingOptions: JSON.stringify(["Loose Bulk (Tippers/Dumping)", "1000 kg Jumbo Bags (FIBC)", "PP Woven Bags 50kg"]),
      harvestSeason: "Year-Round Continuous Supply",
      origin: "India (Western & Southern Agro-Corridors)",
      applications: JSON.stringify(["Fluidized Bed Combustion (FBC)", "AFBC Steam Boilers", "Thermic Fluid Heaters", "Paper Mills & Textile Units"]),
      description: "Engineered tailor-made fuel blend combining pulverized wood chips, agricultural fibers, and coconut shell granules. Delivers stable thermal combustion with low clinkering tendency in FBC boilers.",
      inStock: 1,
      featured: 1,
      gradeTier: "Industrial Premium",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "prod-custom-blend-2",
      name: "High-Density Briquette Blend - Stoker Grade",
      category: "Customized Biomass Blends",
      subCategory: "Boiler Engineering",
      code: "RME-CBB-STK",
      hsCode: "4401.39.00",
      calorificValue: "4,600 - 5,500 kcal/kg",
      calorificMin: 4600,
      calorificMax: 5500,
      moisture: "< 10%",
      ashContent: "< 2.8%",
      bulkDensity: "620 - 720 kg/m\xB3",
      fixedCarbon: "20% - 25%",
      volatileMatter: "70% - 75%",
      particleSize: "90 mm Cylindrical Briquette",
      minOrderQty: 40,
      basePriceUSD: 128,
      packagingOptions: JSON.stringify(["Loose Bulk Containerized", "500 kg Jumbo Bags", "Palletized Shrink Wrap"]),
      harvestSeason: "Year-Round Continuous Supply",
      origin: "India",
      applications: JSON.stringify(["Traveling Grate Boilers", "Industrial Stoker Boilers", "Rotary Kilns", "Ceramic Tile Firing"]),
      description: "Specially compacted cylindrical formulation designed for traveling grate stoker boilers requiring sustained flame length and high radiant heat release without premature disintegrations.",
      inStock: 1,
      featured: 0,
      gradeTier: "Export Grade A+",
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "prod-briquettes-pellets",
      name: "High-Calorific Biomass Briquettes (90mm)",
      category: "Bio Fuels & Biomass Energy",
      subCategory: "Solid Biofuel",
      code: "RME-BIO-BRQ90",
      hsCode: "4401.32.00",
      calorificValue: "4,400 - 4,800 kcal/kg",
      calorificMin: 4400,
      calorificMax: 4800,
      moisture: "< 8%",
      ashContent: "1.8% - 3.2%",
      bulkDensity: "650 - 750 kg/m\xB3",
      fixedCarbon: "19% - 23%",
      volatileMatter: "72% - 78%",
      particleSize: "Diameter 90mm x Length 150-300mm",
      minOrderQty: 25,
      basePriceUSD: 120,
      packagingOptions: JSON.stringify(["25kg PP Bags", "1000kg FIBC Jumbo Bags", "Breakbulk / FCL"]),
      harvestSeason: "Continuous Manufacturing",
      origin: "India / Export Hubs",
      applications: JSON.stringify(["Heavy Steam Generation", "Cement Kiln Pre-heaters", "Distilleries", "Rubber Plants"]),
      description: "Manufactured with high-pressure piston extrusion technology without chemical binders. Replaces Indonesian thermal coal cleanly with zero sulfur dioxide emissions.",
      inStock: 1,
      featured: 1,
      gradeTier: "Export Grade A+",
      imageUrl: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "prod-wood-pellets",
      name: "Certified Industrial Wood Pellets (6mm / 8mm)",
      category: "Bio Fuels & Biomass Energy",
      subCategory: "Wood Fuels",
      code: "RME-WOD-PEL6",
      hsCode: "4401.31.00",
      calorificValue: "4,500 - 4,900 kcal/kg",
      calorificMin: 4500,
      calorificMax: 4900,
      moisture: "< 8.5%",
      ashContent: "< 1.5%",
      bulkDensity: "680 - 740 kg/m\xB3",
      fixedCarbon: "21%",
      volatileMatter: "76%",
      particleSize: "6 mm & 8 mm ENplus-A1 Aligned",
      minOrderQty: 50,
      basePriceUSD: 145,
      packagingOptions: JSON.stringify(["15kg Retail Polybags", "1000kg Heavy Jumbo Bags", "Container Bulk Liners"]),
      harvestSeason: "Continuous",
      origin: "India / Southeast Asia",
      applications: JSON.stringify(["Automated Hopper Feeder Boilers", "Food & Dairy Processing", "District Heating", "Co-Firing Thermal Power"]),
      description: "Manufactured from 100% debarked hardwood sawdust. High mechanical durability (>97.5%) ensuring minimal fine dust formation during ocean container transit.",
      inStock: 1,
      featured: 1,
      gradeTier: "Export Grade A+",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "prod-industrial-wood-chips",
      name: "Industrial Wood Chips & Sifted Powder",
      category: "Bio Fuels & Biomass Energy",
      subCategory: "Wood Fuels",
      code: "RME-WOD-CHP",
      hsCode: "4401.22.00",
      calorificValue: "3,800 - 4,500 kcal/kg",
      calorificMin: 3800,
      calorificMax: 4500,
      moisture: "15% - 25% (Air Dried)",
      ashContent: "1% - 3%",
      bulkDensity: "280 - 350 kg/m\xB3",
      fixedCarbon: "17%",
      volatileMatter: "78%",
      particleSize: "G30 / G50 Screened",
      minOrderQty: 100,
      basePriceUSD: 85,
      packagingOptions: JSON.stringify(["Loose Bulk FCL Container", "Heavy Woven FIBC Bags"]),
      harvestSeason: "All Seasons",
      origin: "India",
      applications: JSON.stringify(["Biomass Cogeneration", "Pulp & Paper Mill Furnaces", "Gasification Plants"]),
      description: "Homogenously chipped hard-timber biomass with low bark content. Screened to remove oversize chips and fine dust for consistent pneumatic conveying.",
      inStock: 1,
      featured: 0,
      gradeTier: "Industrial Premium",
      imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "prod-groundnut-shell",
      name: "Processed Groundnut Shell Biomass Fuel",
      category: "Bio Fuels & Biomass Energy",
      subCategory: "Agro Biomass",
      code: "RME-AGR-GNS",
      hsCode: "1202.42.00",
      calorificValue: "4,000 - 4,500 kcal/kg",
      calorificMin: 4e3,
      calorificMax: 4500,
      moisture: "8% - 12%",
      ashContent: "3% - 5%",
      bulkDensity: "300 - 400 kg/m\xB3",
      fixedCarbon: "18%",
      volatileMatter: "73%",
      particleSize: "Natural Shell & Crushed",
      minOrderQty: 30,
      basePriceUSD: 98,
      packagingOptions: JSON.stringify(["30kg Gunny Bags", "Loose Bulk Container Dump"]),
      harvestSeason: "October - April Peak Season",
      origin: "Gujarat & Karnataka Agro Corridors",
      applications: JSON.stringify(["Brick Kilns", "Oil Extraction Boilers", "Solvent Plants"]),
      description: "Abundant agricultural residue with swift ignition characteristics and steady thermal yield. An economical primary fuel for seasonal heating requirements.",
      inStock: 1,
      featured: 0,
      gradeTier: "Standard Processed",
      imageUrl: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "prod-coffee-shell",
      name: "High-Thermal Coffee Husk & Shell",
      category: "Bio Fuels & Biomass Energy",
      subCategory: "Agro Biomass",
      code: "RME-AGR-CFS",
      hsCode: "0901.90.10",
      calorificValue: "4,200 - 4,800 kcal/kg",
      calorificMin: 4200,
      calorificMax: 4800,
      moisture: "8% - 12%",
      ashContent: "2% - 4%",
      bulkDensity: "320 - 420 kg/m\xB3",
      fixedCarbon: "19%",
      volatileMatter: "74%",
      particleSize: "Pelletized or Raw Flakes",
      minOrderQty: 25,
      basePriceUSD: 110,
      packagingOptions: JSON.stringify(["40kg Woven Bags", "750kg Jumbo Bags"]),
      harvestSeason: "November - March",
      origin: "Western Ghats, India",
      applications: JSON.stringify(["Coffee Processing Mills", "Textile Dyeing Furnaces", "Tea Drying Estates"]),
      description: "Premium agro-residue derived from coffee curing processing. Exceptional clean-burning attributes with pleasant aroma and low corrosive slagging.",
      inStock: 1,
      featured: 0,
      gradeTier: "Industrial Premium",
      imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "prod-coconut-charcoal-briquettes",
      name: "Smokeless Coconut Charcoal Briquettes (Hexagonal / Cube)",
      category: "Coconut Charcoal & Briquettes",
      subCategory: "Charcoal Products",
      code: "RME-CHR-CCB",
      hsCode: "4402.90.10",
      calorificValue: "7,500 - 8,000 kcal/kg",
      calorificMin: 7500,
      calorificMax: 8e3,
      moisture: "< 6%",
      ashContent: "< 2.5% (White Ash)",
      bulkDensity: "620 - 700 kg/m\xB3",
      fixedCarbon: "78% - 84%",
      volatileMatter: "< 13%",
      particleSize: "50x50x25mm Cube / 40x100mm Hexagon",
      minOrderQty: 18,
      basePriceUSD: 520,
      packagingOptions: JSON.stringify(["1kg / 10kg Full Color Inner Box with Master Carton", "10kg Kraft Paper Bag", "20ft FCL Container"]),
      harvestSeason: "Continuous All Year",
      origin: "Kerala & Tamil Nadu Coastal Belt",
      applications: JSON.stringify(["Commercial Shisha & Hookah Cafes", "Premium BBQ & Grills", "High-Temperature Metallurgy", "Air Filtration Blocks"]),
      description: "Manufactured with 100% genuine aged coconut shell charcoal and food-grade tapioca starch binder. Delivers 2.5+ hours burning duration with zero sparks, no smoke, and pure white ash.",
      inStock: 1,
      featured: 1,
      gradeTier: "Export Grade A+",
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "prod-coconut-charcoal-raw",
      name: "Natural Coconut Shell Charcoal Chips (Crushed & Sized)",
      category: "Coconut Charcoal & Briquettes",
      subCategory: "Raw Carbon Minerals",
      code: "RME-CHR-CSC",
      hsCode: "4402.90.10",
      calorificValue: "7,000 - 7,500 kcal/kg",
      calorificMin: 7e3,
      calorificMax: 7500,
      moisture: "< 8%",
      ashContent: "< 3.0%",
      bulkDensity: "550 - 650 kg/m\xB3",
      fixedCarbon: "74% - 80%",
      volatileMatter: "14% - 17%",
      particleSize: "3x6 mesh, 4x8 mesh, 8x20 mesh",
      minOrderQty: 20,
      basePriceUSD: 440,
      packagingOptions: JSON.stringify(["25kg PP Woven Bags", "500kg FIBC Jumbo Bags"]),
      harvestSeason: "Continuous",
      origin: "Southern India",
      applications: JSON.stringify(["Activated Carbon Manufacturing Feedstock", "Foundry Carbon Additive", "Soil Remediation Biochar"]),
      description: "High-purity carbonized coconut shell chips crafted through traditional controlled pyrolisis pits. Free of soil and sand contaminants.",
      inStock: 1,
      featured: 0,
      gradeTier: "Export Grade A+",
      imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "prod-act-carbon-foundry",
      name: "Coconut Charcoal Chips for Iron & Auto Castings",
      category: "Activated Carbon & Foundry Chips",
      subCategory: "Metallurgical Minerals",
      code: "RME-CAR-FND",
      hsCode: "3802.10.00",
      calorificValue: "7,200 - 7,600 kcal/kg",
      calorificMin: 7200,
      calorificMax: 7600,
      moisture: "< 5%",
      ashContent: "< 3.0%",
      bulkDensity: "520 - 600 kg/m\xB3",
      fixedCarbon: "82% - 86%",
      volatileMatter: "< 11%",
      particleSize: "10 - 25 mm Uniform Foundry Fraction",
      minOrderQty: 25,
      basePriceUSD: 480,
      packagingOptions: JSON.stringify(["500kg Jumbo Bags on Heat-Treated ISPM-15 Wooden Pallets", "25kg Bags"]),
      harvestSeason: "Continuous Manufacturing (25,000 MT Annual Capacity)",
      origin: "India",
      applications: JSON.stringify(["Cast Iron (C.I.) Automotive Parts", "Engine Block Casting", "Foundry Ladle Recarburization", "Steel Making Inoculant"]),
      description: "Engineered specifically for heavy foundry applications and automotive castings. Ensures superior carbon dissolution rate and clean metal melt chemistry.",
      inStock: 1,
      featured: 1,
      gradeTier: "Export Grade A+",
      imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "prod-act-carbon-powder",
      name: "Powdered Activated Carbon (PAC) - Water & Sugar Refining",
      category: "Activated Carbon & Foundry Chips",
      subCategory: "Filtration Media",
      code: "RME-CAR-PAC",
      hsCode: "3802.10.00",
      calorificValue: "N/A (Adsorption Chemical)",
      calorificMin: 0,
      calorificMax: 0,
      moisture: "< 5%",
      ashContent: "< 4%",
      bulkDensity: "420 - 500 kg/m\xB3",
      fixedCarbon: "88% - 92%",
      volatileMatter: "< 8%",
      particleSize: "200 - 325 mesh (90% passing)",
      minOrderQty: 10,
      basePriceUSD: 890,
      packagingOptions: JSON.stringify(["25kg Multiwall Kraft Bags with PE Liner", "500kg Jumbo Bags"]),
      harvestSeason: "Continuous (32,500 MT Annual Facility)",
      origin: "India",
      applications: JSON.stringify(["Municipal Water Potabilization", "Edible Vegetable Oil Bleaching", "Sugar Decolorization", "Fine Pharmaceutical Intermediates"]),
      description: "Steam-activated high-adsorption micro-porous carbon powder. Iodine number 900 - 1150 mg/g; Methylene blue value 180 - 240 mg/g.",
      inStock: 1,
      featured: 0,
      gradeTier: "Export Grade A+",
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "prod-act-carbon-granular",
      name: "Granular Activated Carbon (GAC) - Gas Phase & Air Purification",
      category: "Activated Carbon & Foundry Chips",
      subCategory: "Filtration Media",
      code: "RME-CAR-GAC",
      hsCode: "3802.10.00",
      calorificValue: "N/A (Adsorption Media)",
      calorificMin: 0,
      calorificMax: 0,
      moisture: "< 4%",
      ashContent: "< 3.5%",
      bulkDensity: "480 - 540 kg/m\xB3",
      fixedCarbon: "90%",
      volatileMatter: "< 6%",
      particleSize: "4x8 mesh, 8x16 mesh, 8x30 mesh, 12x40 mesh",
      minOrderQty: 5,
      basePriceUSD: 1150,
      packagingOptions: JSON.stringify(["25kg Heavy Duty PP Polybags", "Palletized 550kg Big Bags"]),
      harvestSeason: "Continuous",
      origin: "India",
      applications: JSON.stringify(["Automotive Canister Adsorption", "Chemical Vapor Recovery", "Gold Cyanidation CIP/CIL Recovery", "Industrial Exhaust Scrubbers"]),
      description: "High hardness (>98.5%) granular coconut shell activated carbon. Outstanding resistance to attrition during rapid fluidized gas stripping and solvent recovery cycles.",
      inStock: 1,
      featured: 1,
      gradeTier: "Export Grade A+",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
    }
  ];
  for (const p of products) {
    db.run(`
      INSERT INTO products (
        id, name, category, subCategory, code, hsCode, calorificValue, calorificMin, calorificMax,
        moisture, ashContent, bulkDensity, fixedCarbon, volatileMatter, particleSize, minOrderQty,
        basePriceUSD, packagingOptions, harvestSeason, origin, applications, description,
        inStock, featured, gradeTier, imageUrl
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      p.id,
      p.name,
      p.category,
      p.subCategory,
      p.code,
      p.hsCode,
      p.calorificValue,
      p.calorificMin,
      p.calorificMax,
      p.moisture,
      p.ashContent,
      p.bulkDensity,
      p.fixedCarbon,
      p.volatileMatter,
      p.particleSize,
      p.minOrderQty,
      p.basePriceUSD,
      p.packagingOptions,
      p.harvestSeason,
      p.origin,
      p.applications,
      p.description,
      p.inStock,
      p.featured,
      p.gradeTier,
      p.imageUrl
    ]);
  }
  const certs = [
    {
      id: "cert-iso-9001",
      name: "ISO 9001:2015 Quality Management System",
      issuer: "TUV SUD International Certification Body",
      code: "ISO-9001-QMS-2024",
      issueDate: "2023-04-12",
      validUntil: "2026-04-11",
      accreditedBody: "IAF / UKAS Management Systems",
      category: "Quality",
      description: "Certified for international manufacturing, processing, sampling, and export of processed biomass solid fuels, charcoal, and activated carbon.",
      badgeCode: "ISO 9001:2015",
      documentNumber: "TUV-IN-88942-01"
    },
    {
      id: "cert-apeda",
      name: "APEDA Registration-cum-Membership Certificate (RCMC)",
      issuer: "Ministry of Commerce and Industry, Government of India",
      code: "APEDA-EXP-2022-771",
      issueDate: "2022-08-01",
      validUntil: "2027-07-31",
      accreditedBody: "Agricultural & Processed Food Products Export Development Authority",
      category: "Export Trade",
      description: "Official export license covering agro-residue biomass, agricultural shells, husk fuels, and sustainable organic derivatives.",
      badgeCode: "APEDA VERIFIED",
      documentNumber: "APEDA/REG/DEL/2022/9902"
    },
    {
      id: "cert-iso-14001",
      name: "ISO 14001:2015 Environmental Management Standard",
      issuer: "Bureau Veritas Certification",
      code: "ISO-14001-EMS-554",
      issueDate: "2023-11-15",
      validUntil: "2026-11-14",
      accreditedBody: "ANAB Accreditation Board",
      category: "Sustainability",
      description: "Verifies zero-waste processing facilities, closed-loop thermal dust recycling, and audited life-cycle carbon neutrality.",
      badgeCode: "ISO 14001:2015",
      documentNumber: "BV-EMS-2023-1049"
    },
    {
      id: "cert-halal-kosher",
      name: "Halal & Kosher Food-Grade Processing Certification",
      issuer: "Halal India & Kosher European Inspection Council",
      code: "HK-FGC-2024",
      issueDate: "2024-01-10",
      validUntil: "2027-01-09",
      accreditedBody: "World Halal Council (WHC) & Orthodox Rabbinical Authority",
      category: "Religious",
      description: "Authorizes activated carbon and coconut charcoal usage in edible sugar de-colorization, fruit juice clarification, and pharmaceutical grade purification.",
      badgeCode: "HALAL & KOSHER",
      documentNumber: "HIC-IND-2024-910"
    },
    {
      id: "cert-fssai",
      name: "FSSAI Central Food Safety License",
      issuer: "Food Safety and Standards Authority of India",
      code: "FSSAI-LIC-100220",
      issueDate: "2023-02-18",
      validUntil: "2028-02-17",
      accreditedBody: "Government of India Health Directorate",
      category: "Safety",
      description: "Certified for compliant handling and export of high-purity biomass clarifying carbons intended for food, brewery, and distillery refining.",
      badgeCode: "FSSAI CERTIFIED",
      documentNumber: "10022041000845"
    },
    {
      id: "cert-enplus",
      name: "Biomass Calorific & Heavy Metals Safety Compliance (ASTM D5865)",
      issuer: "SGS India Testing Laboratory",
      code: "SGS-EXP-CAL-2024",
      issueDate: "2024-03-01",
      validUntil: "2027-03-01",
      accreditedBody: "NABL ISO/IEC 17025 Certified Laboratories",
      category: "Quality",
      description: "Laboratory tested batch certifications confirming sulfur content < 0.05%, chlorine < 0.03%, and zero synthetic binders or toxic heavy metal trace elements.",
      badgeCode: "SGS LAB AUDITED",
      documentNumber: "SGS-MNL-2024-8832"
    }
  ];
  for (const c of certs) {
    db.run(`
      INSERT INTO certifications (id, name, issuer, code, issueDate, validUntil, accreditedBody, category, description, badgeCode, documentNumber)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [c.id, c.name, c.issuer, c.code, c.issueDate, c.validUntil, c.accreditedBody, c.category, c.description, c.badgeCode, c.documentNumber]);
  }
  const quotes = [
    {
      id: "rfq-2026-081",
      quoteNumber: "RME-RFQ-2026-081",
      createdAt: "2026-09-02T14:20:00.000Z",
      buyerName: "Marcus Lindholm",
      buyerCompany: "Nordic Clean Energy Kraft AB",
      buyerEmail: "m.lindholm@nordickraft.se",
      buyerPhone: "+46 8 555 1290",
      buyerCountry: "Sweden",
      destinationPort: "Port of Gothenburg, Sweden",
      incoterm: "CIF",
      items: JSON.stringify([
        {
          productId: "prod-wood-pellets",
          productName: "Certified Industrial Wood Pellets (6mm / 8mm)",
          hsCode: "4401.31.00",
          volume: 250,
          unit: "MT",
          unitPriceUSD: 145,
          selectedPackaging: "1000kg Heavy Jumbo Bags",
          lineTotalUSD: 36250
        }
      ]),
      subtotalUSD: 36250,
      freightCostUSD: 4850,
      insuranceCostUSD: 320,
      inspectionFeeUSD: 450,
      discountUSD: 870,
      totalUSD: 41e3,
      status: "Confirmed",
      notes: "Scheduled for October maritime shipment from Nhava Sheva Port (JNPT). Inspection certificate required by SGS.",
      paymentTerms: "30% Advance T/T, 70% against Bill of Lading (B/L) scan copy",
      estimatedDeliveryWeeks: 4,
      validUntil: "2026-10-15",
      assignedManager: "Vikramaditya Rao (VP Global Sales)"
    },
    {
      id: "rfq-2026-094",
      quoteNumber: "RME-RFQ-2026-094",
      createdAt: "2026-09-06T09:15:00.000Z",
      buyerName: "Ahmed Al-Mansoor",
      buyerCompany: "Gulf Foundry & Metal Works LLC",
      buyerEmail: "purchasing@gulffoundry.ae",
      buyerPhone: "+971 4 332 9081",
      buyerCountry: "United Arab Emirates",
      destinationPort: "Jebel Ali Port (Dubai), UAE",
      incoterm: "CIF",
      items: JSON.stringify([
        {
          productId: "prod-act-carbon-foundry",
          productName: "Coconut Charcoal Chips for Iron & Auto Castings",
          hsCode: "3802.10.00",
          volume: 100,
          unit: "MT",
          unitPriceUSD: 480,
          selectedPackaging: "500kg Jumbo Bags on Heat-Treated ISPM-15 Wooden Pallets",
          lineTotalUSD: 48e3
        },
        {
          productId: "prod-coconut-charcoal-briquettes",
          productName: "Smokeless Coconut Charcoal Briquettes (Hexagonal / Cube)",
          hsCode: "4402.90.10",
          volume: 25,
          unit: "MT",
          unitPriceUSD: 520,
          selectedPackaging: "10kg Kraft Paper Bag",
          lineTotalUSD: 13e3
        }
      ]),
      subtotalUSD: 61e3,
      freightCostUSD: 3100,
      insuranceCostUSD: 420,
      inspectionFeeUSD: 350,
      discountUSD: 1500,
      totalUSD: 63370,
      status: "Quoted",
      notes: "Special pallet fumigation stamp required for UAE customs clearance.",
      paymentTerms: "100% Irrevocable Confirmed Letter of Credit (L/C) at Sight",
      estimatedDeliveryWeeks: 2,
      validUntil: "2026-09-30",
      assignedManager: "Priya Nambiar (Middle East Regional Desk)"
    },
    {
      id: "rfq-2026-102",
      quoteNumber: "RME-RFQ-2026-102",
      createdAt: "2026-09-08T11:45:00.000Z",
      buyerName: "Jean-Luc Moreau",
      buyerCompany: "Compagnie Sucri\xE8re de l\u2019Ouest",
      buyerEmail: "jl.moreau@sucre-ouest.fr",
      buyerPhone: "+33 2 40 88 12 34",
      buyerCountry: "France",
      destinationPort: "Port of Le Havre, France",
      incoterm: "FOB",
      items: JSON.stringify([
        {
          productId: "prod-act-carbon-powder",
          productName: "Powdered Activated Carbon (PAC) - Water & Sugar Refining",
          hsCode: "3802.10.00",
          volume: 40,
          unit: "MT",
          unitPriceUSD: 890,
          selectedPackaging: "25kg Multiwall Kraft Bags with PE Liner",
          lineTotalUSD: 35600
        }
      ]),
      subtotalUSD: 35600,
      freightCostUSD: 0,
      insuranceCostUSD: 0,
      inspectionFeeUSD: 300,
      discountUSD: 500,
      totalUSD: 35400,
      status: "Pending",
      notes: "Buyer arranging own ocean charter from Cochin Port. Requested certificate of kosher compliance and food grade safety.",
      paymentTerms: "T/T 20% Deposit, 80% against Mate\u2019s Receipt",
      estimatedDeliveryWeeks: 3,
      validUntil: "2026-10-08",
      assignedManager: "Ananya Sharma (Logistics Coordinator)"
    }
  ];
  for (const q of quotes) {
    db.run(`
      INSERT INTO quotes (
        id, quoteNumber, createdAt, buyerName, buyerCompany, buyerEmail, buyerPhone, buyerCountry,
        destinationPort, incoterm, items, subtotalUSD, freightCostUSD, insuranceCostUSD,
        inspectionFeeUSD, discountUSD, totalUSD, status, notes, paymentTerms,
        estimatedDeliveryWeeks, validUntil, assignedManager
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      q.id,
      q.quoteNumber,
      q.createdAt,
      q.buyerName,
      q.buyerCompany,
      q.buyerEmail,
      q.buyerPhone,
      q.buyerCountry,
      q.destinationPort,
      q.incoterm,
      q.items,
      q.subtotalUSD,
      q.freightCostUSD,
      q.insuranceCostUSD,
      q.inspectionFeeUSD,
      q.discountUSD,
      q.totalUSD,
      q.status,
      q.notes,
      q.paymentTerms,
      q.estimatedDeliveryWeeks,
      q.validUntil,
      q.assignedManager
    ]);
  }
  const articles = [
    {
      id: "art-1",
      title: "Decarbonizing Industrial Boilers: The Economic Math of Switching from Coal to Biomass Briquettes",
      slug: "decarbonizing-boilers-coal-to-biomass-math",
      excerpt: "How thermal power and textile mills are reducing operating cost by 18-24% while eliminating carbon penalties through custom high-calorific briquettes.",
      content: "Transitioning from Indonesian imported thermal coal (calorific 4,800-5,400 kcal/kg with 1.2% sulfur) to engineered biomass briquettes (calorific 4,500-5,000 kcal/kg with zero sulfur) is no longer solely an ESG mandate\u2014it is now a direct bottom-line optimization. In 2026, carbon credit arbitrage combined with favorable import tariffs for renewable biomass creates net savings of $14 to $22 per metric ton of steam generated. Furthermore, the ash generated from biomass combustion contains high potassium and phosphorus values, turning boiler waste into marketable agricultural soil conditioners instead of toxic fly ash landfill liabilities.",
      category: "Biomass Decarbonization",
      author: "Dr. K. S. Rajasekharan",
      authorRole: "Chief Combustion Engineer, Richexim Group",
      date: "2026-08-28",
      readTime: "6 min read",
      status: "Approved",
      tags: JSON.stringify(["Decarbonization", "Boiler Engineering", "Cost Optimization", "Clean Energy"]),
      views: 1420
    },
    {
      id: "art-2",
      title: "Global Coconut Shell Supply Outlook 2026: Monsoon Impact & Activated Carbon Yields",
      slug: "global-coconut-shell-supply-outlook-2026",
      excerpt: "Comprehensive harvest assessment from South Indian coastal belts and Southeast Asian exporters detailing shell density and micro-pore structural integrity.",
      content: "The 2026 southwest monsoon yielded robust coconut productivity across the Kerala, Tamil Nadu, and Karnataka agricultural corridors, stabilizing raw coconut shell feedstock prices. For activated carbon manufacturers, mature coconut shells with high lignocellulose content (over 34% lignin) are crucial for synthesizing high-surface-area micro-porous matrices (BET surface area exceeding 1,150 m\xB2/g). Our processing facilities have locked forward contracts for 45,000 MT of raw aged shell to insulate international buyers against seasonal price fluctuations.",
      category: "Crop & Harvest Report",
      author: "Meera Pillai",
      authorRole: "Head of Agro-Supply Chain, Richmount Exim",
      date: "2026-08-14",
      readTime: "5 min read",
      status: "Approved",
      tags: JSON.stringify(["Coconut Shell", "Market Intelligence", "Activated Carbon", "Export Price Trends"]),
      views: 980
    },
    {
      id: "art-3",
      title: "Optimizing Fluidized Bed Combustion (FBC) with Custom Multi-Source Agro Blends",
      slug: "optimizing-fbc-boilers-multi-source-agro-blends",
      excerpt: "Preventing bed agglomeration and alkali slagging by adjusting silica-to-potassium ratios in composite biomass formulations.",
      content: "Single-source agricultural biomass fuels like 100% rice husk or 100% bagasse often lead to severe bed sintering and refractory erosion due to low ash fusion temperatures (<1,050\xB0C). By formulating a calibrated blend of wood chips, groundnut shells, and coconut charcoal fines, Richmount Exim creates composite fuels with elevated ash softening temperatures (>1,280\xB0C). This study outlines the precise mass-balance formulations that allow multi-megawatt industrial boilers to operate continuously without unplanned deslagging shutdowns.",
      category: "Boiler Efficiency",
      author: "R. Balakrishnan",
      authorRole: "Technical Services Director",
      date: "2026-07-30",
      readTime: "8 min read",
      status: "Approved",
      tags: JSON.stringify(["FBC Boilers", "Slagging Prevention", "Thermal Efficiency", "Custom Blends"]),
      views: 1250
    },
    {
      id: "art-4",
      title: "Navigating New European Union CBAM (Carbon Border Adjustment Mechanism) Regulations for Importers",
      slug: "eu-cbam-biomass-export-compliance-2026",
      excerpt: "Detailed compliance checklist for European industrial procurement managers importing certified carbon-neutral bio-commodities.",
      content: "With the full enforcement phase of the EU Carbon Border Adjustment Mechanism (CBAM), European importers must report verified embedded emissions for energy-intensive sectors like steel, fertilizers, and foundries. Utilizing Richmount Exim\u2019s ISO 14001 and SGS-audited carbon-neutral biofuels enables EU enterprises to submit certified zero-emission fuel documentation, eliminating punitive border equalization levies.",
      category: "Global Supply Chain",
      author: "Alexander Sterling",
      authorRole: "International Trade Counsel, Richexim Group",
      date: "2026-07-15",
      readTime: "7 min read",
      status: "Approved",
      tags: JSON.stringify(["EU CBAM", "Trade Regulations", "Compliance", "Export Logistics"]),
      views: 2100
    },
    {
      id: "art-5",
      title: "Granular Activated Carbon (GAC) in Precious Metal Recovery: Gold Leaching (CIL/CIP) & Iodine Rating Benchmarks",
      slug: "gac-gold-recovery-cil-cip-specs",
      excerpt: "High-attrition slurry agitation in gold cyanidation circuits destroys low-grade carbon, causing severe gold slippage into tailings. Discover why steam-activated coconut shell carbon with >98.5% ball-pan hardness is the metallurgical benchmark.",
      content: "In modern hydrometallurgical gold extraction (CIP, CIL, CIC circuits), mechanical durability and kinetic adsorption capacity of the carbon matrix dictate overall mill recovery. Pyrolyzed high-density coconut shell delivers natural micro-porosity (pore diameters < 2 nm) and extreme structural resistance to shearing forces. When inferior carbons disintegrate under heavy ore pulp agitation, gold-loaded micro-fines wash through interstage screens into tailings ponds, causing unrecoverable revenue losses. Richmount export-grade gold recovery carbons achieve ball-pan hardness exceeding 98.5% and rapid gold loading kinetics (R-value > 45%).",
      category: "Quality Standards",
      author: "Dr. Evelyn Martinez-Dass",
      authorRole: "Chief Quality Officer",
      date: "2026-09-02",
      readTime: "7 min read",
      status: "Approved",
      tags: JSON.stringify(["Activated Carbon", "Gold Recovery", "CIL CIP", "Iodine Number", "Hardness"]),
      views: 1840
    },
    {
      id: "art-6",
      title: "Agro-Residue Briquette Selection: Comparing Groundnut Shell vs. Mustard Husk for High-Pressure Steam Boilers",
      slug: "groundnut-shell-vs-mustard-husk-combustion",
      excerpt: "Evaluating the proximate analysis, volatile release curves, and ash deformation temperatures of groundnut shell versus mustard crop briquettes for traveling grates and bubbling fluidized bed boilers.",
      content: "Groundnut shells possess natural residual vegetable lipids and high cellulose content, translating into an instantaneous volatile ignition front and higher gross calorific value (4,250 to 4,450 kcal/kg). Conversely, mustard crop residues feature higher bulk lignin density and an alkaline ash matrix rich in calcium and magnesium rather than potassium. This natural chemistry elevates the initial ash deformation temperature past 1,260\xB0C, drastically minimizing refractory wall clinkering. By formulating a calibrated 60:40 hybrid blend, Richmount delivers a stable, non-slagging solid biofuel optimized for automated stoker boilers.",
      category: "Technical Combustion",
      author: "R. Balakrishnan",
      authorRole: "Technical Services Director",
      date: "2026-08-20",
      readTime: "6 min read",
      status: "Approved",
      tags: JSON.stringify(["Groundnut Shell", "Mustard Briquettes", "Boiler Slagging", "Calorific Yield"]),
      views: 1530
    },
    {
      id: "art-7",
      title: "Maritime Moisture Control & Container Sweat Prevention: Safeguarding 40ft High-Cube Biomass Shipments",
      slug: "maritime-moisture-container-sweat-prevention",
      excerpt: "Trans-oceanic shipping through equatorial waters causes steep temperature shifts and cargo sweat. Review the desiccant protocols, container liners, and ISPM-15 packaging that guarantee dry arrival.",
      content: "Transporting hygroscopic biomass fuels across 25 to 35-day ocean voyages through tropical ports such as Nhava Sheva or Cochin to cold European or East Asian harbors presents severe cargo sweat risks. As ambient temperatures drop, air inside the sealed container cools, releasing condensation onto the cargo. Richmount implements a triple-barrier moisture protocol: packing solid fuels strictly under 8.0% moisture, installing hung calcium chloride desiccant blankets, and lining container floors with moisture-barrier corrugated decking.",
      category: "Maritime Logistics",
      author: "Alok N. Varma",
      authorRole: "Head of Global Supply Chain",
      date: "2026-08-10",
      readTime: "5 min read",
      status: "Approved",
      tags: JSON.stringify(["Ocean Freight", "Moisture Control", "Container Sweat", "Desiccants"]),
      views: 1120
    },
    {
      id: "art-8",
      title: "Standardizing Industrial Wood Chips: Why ENplus & ISO 17225-4 Size Fractions Dictate Boiler Feeding Reliability",
      slug: "iso-17225-wood-chips-boiler-feeding",
      excerpt: "Un-screened wood chips with fibrous slivers cause severe bridging in fuel chutes and screw conveyors. Learn how precision mechanical screening to G30 and G50 specs ensures continuous boiler automation.",
      content: "International standard ISO 17225-4 categorizes wood chips into strict dimensional classes, notably P31S (G30) and P45S (G50). Maintaining strict sizing envelopes prevents mechanical interlocking in silo funnels while ensuring uniform aerated combustion without localized starvation zones. Richmount processing yards utilize twin-deck rotary trommel screens and magnetic separator belts to eliminate dust fines, oversized slivers, and tramp ferrous metal.",
      category: "Energy Transition",
      author: "Dr. K. S. Rajasekharan",
      authorRole: "Chief Combustion Engineer",
      date: "2026-07-28",
      readTime: "6 min read",
      status: "Approved",
      tags: JSON.stringify(["Wood Chips", "ISO 17225", "G30 G50", "Boiler Feeding", "Biomass Handling"]),
      views: 1390
    },
    {
      id: "art-9",
      title: "Decarbonizing Cement Kilns & Precalciners: Replacing Fossil Petcoke with Low-Chlorine Bio-Coal",
      slug: "decarbonizing-cement-kilns-bio-coal-petcoke",
      excerpt: "Achieving 30-50% Thermal Substitution Rates (TSR) in cement manufacturing without risking kiln duct clogging or refractory deterioration by utilizing torrefied bio-coal with <0.03% chlorine.",
      content: "Global cement manufacturers face aggressive mandates to elevate their Thermal Substitution Rate (TSR) to over 30-50% by 2030 under SBTi. While petroleum coke delivers extreme heat, raw agricultural biomass fuels suffer from low energy density and high chlorine, triggering kiln cyclone clogging. Richmount torrefied bio-coal hydro-char delivers 7,200 - 7,600 kcal/kg with total chlorine maintained below 0.03%, enabling safe co-firing in calciner burners.",
      category: "Carbon Markets",
      author: "Sunita Mehra",
      authorRole: "Director of ESG & Sustainability Compliance",
      date: "2026-07-12",
      readTime: "8 min read",
      status: "Approved",
      tags: JSON.stringify(["Cement Decarbonization", "Bio-Coal", "Petcoke Substitution", "SBTi", "EU ETS"]),
      views: 2470
    }
  ];
  for (const a of articles) {
    db.run(`
      INSERT INTO articles (id, title, slug, excerpt, content, category, author, authorRole, date, readTime, status, tags, views)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [a.id, a.title, a.slug, a.excerpt, a.content, a.category, a.author, a.authorRole, a.date, a.readTime, a.status, a.tags, a.views]);
  }
  const careers = [
    {
      id: "job-1",
      title: "Senior International Export Logistics Manager",
      department: "Export Logistics",
      location: "Kochi / Mumbai (Hybrid)",
      type: "Full-time",
      experience: "5 - 8 Years",
      description: "Lead ocean freight negotiations, breakbulk charters, customs clearance, and container shipping lines across European and Middle East export trade lanes.",
      requirements: JSON.stringify(["Deep proficiency in ocean freight contracts, Incoterms 2020, and bill of lading documentation", "Experience coordinating FCL/LCL and breakbulk charters from Nhava Sheva, Cochin, and Chennai ports", "Knowledge of phytosanitary certifications and fumigation protocols"]),
      responsibilities: JSON.stringify(["Negotiate competitive freight spot and contract rates with Maersk, MSC, and CMA CGM", "Oversee end-to-end documentation from proforma invoice to customs e-BRC filing", "Coordinate warehouse stuffing and pre-shipment surveyor inspections"]),
      active: 1
    },
    {
      id: "job-2",
      title: "Biomass Quality Control Chemist & Lab Head",
      department: "Quality & Lab",
      location: "Coimbatore Plant / Lab",
      type: "Full-time",
      experience: "3 - 6 Years",
      description: "Manage our analytical testing laboratory for bomb calorimetry, proximate analysis, ash fusion temperature testing, and moisture meters.",
      requirements: JSON.stringify(["M.Sc. in Chemistry or Chemical Engineering", "Hands-on experience with Parr Bomb Calorimeters, muffle furnaces, and titration equipment", "Familiarity with ASTM D5865 and ISO 17225 solid biofuel standards"]),
      responsibilities: JSON.stringify(["Issue Certificate of Analysis (COA) for every export container lot", "Formulate customer-specific fuel blends according to client boiler specifications", "Conduct routine audits on raw material sourcing and crushing quality"]),
      active: 1
    },
    {
      id: "job-3",
      title: "International Business Development Executive (Europe & MENA)",
      department: "International Trade",
      location: "Bangalore / Remote",
      type: "Full-time",
      experience: "2 - 5 Years",
      description: "Drive strategic enterprise sales of industrial biomass pellets, coconut charcoal, and foundry grade carbon to multinational corporations.",
      requirements: JSON.stringify(["Demonstrated B2B track record in commodity trading, renewable energy, or metallurgical raw materials", "Fluent English with European or Arabic language skills as an advantage", "Exceptional contract negotiation and client relationship management"]),
      responsibilities: JSON.stringify(["Identify and onboard thermal power plants, cement kilns, and foundries transitioning to green fuel", "Present technical feasibility and cost-benefit analysis of custom biomass blends", "Manage pipeline from RFQ generation to long-term annual supply contracts"]),
      active: 1
    }
  ];
  for (const c of careers) {
    db.run(`
      INSERT INTO careers (id, title, department, location, type, experience, description, requirements, responsibilities, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [c.id, c.title, c.department, c.location, c.type, c.experience, c.description, c.requirements, c.responsibilities, c.active]);
  }
  const inquiries = [
    {
      id: "inq-1",
      fullName: "Hans-Peter Ziegler",
      email: "hp.ziegler@bavaria-energy.de",
      phone: "+49 89 244 8910",
      company: "Bavaria BioKraft GmbH",
      country: "Germany",
      subject: "Supply Contract for 1,200 MT Wood Pellets 6mm",
      message: "We are seeking long-term quarterly shipments of ENplus-A1 aligned wood pellets for our district heating plant in Munich. Please send specifications and CIF Hamburg port quotation.",
      productInterest: "Industrial Wood Pellets (6mm / 8mm)",
      createdAt: "2026-09-07T15:30:00.000Z",
      status: "New"
    }
  ];
  for (const inq of inquiries) {
    db.run(`
      INSERT INTO inquiries (id, fullName, email, phone, company, country, subject, message, productInterest, createdAt, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [inq.id, inq.fullName, inq.email, inq.phone, inq.company, inq.country, inq.subject, inq.message, inq.productInterest, inq.createdAt, inq.status]);
  }
  const initialJobApps = [
    {
      id: "app-001",
      jobId: "job-trade-manager",
      jobTitle: "Senior International Trade Manager",
      applicantName: "Vikramaditya Sengupta",
      email: "v.sengupta@exporttrade-intl.com",
      phone: "+91 98401 23456",
      experienceYears: 7,
      coverLetter: "7+ years managing maritime bulk commodity chartering and CIF European contracts. Solid experience with ASTM E870 certification and LC negotiations.",
      portfolioUrl: "https://linkedin.com/in/vikram-trade-export",
      submittedAt: new Date(Date.now() - 36e5 * 5).toISOString(),
      status: "Under Review"
    },
    {
      id: "app-002",
      jobId: "job-qa-engineer",
      jobTitle: "Biomass Quality Assay & Lab Chemist",
      applicantName: "Dr. Ananya Sharma",
      email: "ananya.sharma@biomaterialslab.in",
      phone: "+91 94220 78910",
      experienceYears: 4,
      coverLetter: "Analytical chemist specializing in proximate biomass analysis, bomb calorimetry (calorific GCV/NCV), and sulphur/chlorine emission abatement testing.",
      portfolioUrl: "https://orcid.org/0000-0002-1825-009X",
      submittedAt: new Date(Date.now() - 36e5 * 26).toISOString(),
      status: "Under Review"
    }
  ];
  for (const app2 of initialJobApps) {
    db.run(`
      INSERT OR IGNORE INTO job_applications (id, jobId, jobTitle, applicantName, email, phone, experienceYears, coverLetter, portfolioUrl, submittedAt, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [app2.id, app2.jobId, app2.jobTitle, app2.applicantName, app2.email, app2.phone, app2.experienceYears, app2.coverLetter, app2.portfolioUrl, app2.submittedAt, app2.status]);
  }
  const chatMessages = [
    {
      id: "msg-1",
      sender: "agent",
      senderName: "Richexim Export Trade Assistant",
      text: "Welcome to Richmount Exim! I can help you compute instant freight estimates, examine moisture & calorific specifications, or request lab samples. What commodity can I help you evaluate today?",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      suggestedPrompts: JSON.stringify([
        "What is the calorific value of your Coconut Briquettes?",
        "Calculate CIF freight cost to Port of Rotterdam",
        "How do I request a 2kg laboratory sample?",
        "What custom blends do you offer for FBC boilers?"
      ])
    }
  ];
  for (const m of chatMessages) {
    db.run(`
      INSERT INTO chat_messages (id, sender, senderName, text, timestamp, suggestedPrompts)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [m.id, m.sender, m.senderName, m.text, m.timestamp, m.suggestedPrompts]);
  }
}
function seedSEOMetadata(db) {
  console.log("[SQLite] Seeding SEO page metadata...");
  const seoRecords = [
    {
      pageKey: "about",
      pageName: "About Us",
      title: "About Us | Richmount Metallic & Allied Exporters - Richexim Group",
      description: "Discover Richmount Exim, premier export subsidiary of Richexim Group since 1994. Global suppliers of high-calorific industrial biomass briquettes, torrefied pellets, and coconut shell carbon.",
      keywords: "biomass exporter India, Richexim Group subsidiary, industrial biofuel exporter, torrefied bio-coal, coconut shell charcoal, ISO 9001 certified exporter",
      ogTitle: "About Us - Richmount Metallic & Allied Exporters (Richexim Group)",
      ogDescription: "Trusted supplier of industrial biomass solid fuels to 28+ countries with ISO 9001:2015 accreditation, deep-water port processing, and ASTM/SGS certified quality.",
      ogImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
      twitterCard: "summary_large_image",
      canonicalUrl: "https://www.richmount-exim.com/about",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      pageKey: "blog",
      pageName: "Industry Intelligence & Blog",
      title: "Biomass & Carbon Intelligence Whitepapers | Richmount Exim",
      description: "Read authoritative engineering whitepapers on EU CBAM 2026 directives, boiler slagging mitigation chemistry, ocean freight hedging, and GCV vs NCV calorific trade economics.",
      keywords: "biomass trade blog, EU CBAM compliance, industrial boiler slagging, agro-biomass briquettes, CIF FOB maritime logistics, bio-coal research",
      ogTitle: "Biomass Fuels, Carbon Tariffs & Global Trade Whitepapers | Richmount",
      ogDescription: "Technical combustion analyses, regulatory forecasts (CBAM & EUDR), ocean logistics benchmarks, and commodity pricing intelligence by Richexim trade engineering.",
      ogImage: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80",
      twitterCard: "summary_large_image",
      canonicalUrl: "https://www.richmount-exim.com/blog",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      pageKey: "product",
      pageName: "Export Commodity Catalog",
      title: "Export Commodity Catalog & Technical Specifications | Richmount Exim",
      description: "Explore high-density industrial biomass briquettes, torrefied bio-coal pellets (7,500+ kcal/kg), and metallurgical coconut shell charcoal. Direct bulk export from JNPT Mumbai.",
      keywords: "sawdust briquettes 90mm, groundnut shell briquettes, torrefied wood pellets, coconut charcoal lumps, mustard husk biomass, industrial solid fuel export",
      ogTitle: "Export Commodity Catalog & Technical Specifications | Richmount Exim",
      ogDescription: "Engineered high-calorific solid fuels with proximate analysis, SGS inspection reports, moisture < 8%, and flexible FCL container packaging.",
      ogImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
      twitterCard: "summary_large_image",
      canonicalUrl: "https://www.richmount-exim.com/products",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      pageKey: "home",
      pageName: "Home Page",
      title: "Richmount Metallic & Allied Exporters | Global Industrial Biomass Solutions",
      description: "Leading Indian exporter of densified agro-biomass briquettes, torrefied pellets, and carbonized coconut charcoal. Certified for EU CBAM compliance and ASTM standards.",
      keywords: "industrial biomass exporters, bio-coal briquettes, coconut shell charcoal, Richexim Group, CIF Rotterdam biomass, JNPT Mumbai export",
      ogTitle: "Richmount Metallic & Allied Exporters - Renewable Energy & Solid Fuels",
      ogDescription: "Supplying high-efficiency biomass solid fuels to thermal power plants, cement kilns, and foundries across Europe, Middle East, and Asia.",
      ogImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
      twitterCard: "summary_large_image",
      canonicalUrl: "https://www.richmount-exim.com/",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      pageKey: "careers",
      pageName: "Careers & Opportunities",
      title: "Careers & Global Trade Positions | Richmount Exim",
      description: "Join the international supply chain and export logistics desk at Richmount Exim. Explore opportunities in maritime chartering, quality control, and cross-border trade.",
      keywords: "careers in export, international trade jobs, maritime logistics career, biomass engineering jobs, Richexim hiring",
      ogTitle: "Careers & Global Trade Positions | Richmount Exim",
      ogDescription: "Advance your career in global sustainable fuel commodities and cross-border trade operations with Richexim Group.",
      ogImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      twitterCard: "summary_large_image",
      canonicalUrl: "https://www.richmount-exim.com/careers",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      pageKey: "faq",
      pageName: "Frequently Asked Questions",
      title: "International Buyer FAQ & Trade Inquiries | Richmount Exim",
      description: "Frequently asked questions regarding ocean freight logistics, Incoterms (CIF vs FOB), SGS quality assay certificates, LC payments, and CBAM carbon certificates.",
      keywords: "biomass export FAQ, Incoterms CIF FOB, biomass lab test COA, letter of credit payment, EU CBAM regulation",
      ogTitle: "International Trade & Quality Assurance FAQ | Richmount Exim",
      ogDescription: "Clear answers on biomass technical specifications, ocean container stuffing, proforma quotations, and contract compliance.",
      ogImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      twitterCard: "summary_large_image",
      canonicalUrl: "https://www.richmount-exim.com/faq",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ];
  for (const s of seoRecords) {
    db.run(`
      INSERT OR REPLACE INTO seo_metadata (pageKey, pageName, title, description, keywords, ogTitle, ogDescription, ogImage, twitterCard, canonicalUrl, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [s.pageKey, s.pageName, s.title, s.description, s.keywords, s.ogTitle, s.ogDescription, s.ogImage, s.twitterCard, s.canonicalUrl, s.updatedAt]);
  }
}
function seedChatSessions(db) {
  console.log("[SQLite] Seeding dual-persona B2B export chat sessions & message threads...");
  const sessions = [
    {
      id: "sess-101",
      contactIdentifier: "m.weber@steag-fernwaerme.de",
      customerName: "Markus Weber",
      customerEmail: "m.weber@steag-fernwaerme.de",
      customerCompany: "Steag Fernw\xE4rme GmbH",
      customerCountry: "Germany",
      status: "waiting_agent",
      priority: "urgent",
      tags: JSON.stringify(["Bulk RFQ", "CIF Rotterdam", "Wood Pellets 6mm"]),
      adminNotes: "Needs immediate CIF Rotterdam price for 3,500 MT test shipment. Asking for ENplus-A1 laboratory certificate & ash fusion data. Contact via German WhatsApp if required.",
      assignedAgent: "Sarah Jenkins (Senior Trade Desk)",
      lastMessageText: "Can you confirm if you can guarantee ash content <0.7% on dry basis for the 3,500 MT lot to Rotterdam?",
      lastMessageTime: "2026-09-09T18:45:00.000Z",
      unreadAdminCount: 1,
      unreadCustomerCount: 0
    },
    {
      id: "sess-102",
      contactIdentifier: "tariq@emiratesbiopower.ae",
      customerName: "Tariq Al-Hashimi",
      customerEmail: "tariq@emiratesbiopower.ae",
      customerCompany: "Emirates Bio Power LLC",
      customerCountry: "UAE",
      status: "active",
      priority: "normal",
      tags: JSON.stringify(["CNSL Oil", "FOB Cochin", "Marine Boiler"]),
      adminNotes: "Inquired about raw CNSL (Cashew Nut Shell Liquid) in flexibags or ISO tanks. Destination Jebel Ali for cement preheater fuel test.",
      assignedAgent: "Alex Morgan (Logistics & Chartering)",
      lastMessageText: "We have prepared the drum vs ISO container comparison sheet and sent it to your registered email.",
      lastMessageTime: "2026-09-09T16:20:00.000Z",
      unreadAdminCount: 0,
      unreadCustomerCount: 1
    },
    {
      id: "sess-103",
      contactIdentifier: "k.sato@nippon-biomass.co.jp",
      customerName: "Kenji Sato",
      customerEmail: "k.sato@nippon-biomass.co.jp",
      customerCompany: "Nippon Energy & Bio Carbon Co.",
      customerCountry: "Japan",
      status: "resolved",
      priority: "normal",
      tags: JSON.stringify(["Activated Carbon", "JIS Compliance", "Sample Dispatched"]),
      adminNotes: "Sample lot of 2kg 4x8 mesh steam-activated carbon dispatched via DHL #8492019482. JIS testing currently underway in Tokyo.",
      assignedAgent: "Vikram Sengupta (Quality & Lab)",
      lastMessageText: "Airway bill #8492019482 shows arrival at Narita customs clearance today. Thank you!",
      lastMessageTime: "2026-09-08T11:15:00.000Z",
      unreadAdminCount: 0,
      unreadCustomerCount: 0
    }
  ];
  for (const s of sessions) {
    db.run(`
      INSERT OR REPLACE INTO chat_sessions (id, contactIdentifier, customerName, customerEmail, customerCompany, customerCountry, status, priority, tags, adminNotes, assignedAgent, lastMessageText, lastMessageTime, unreadAdminCount, unreadCustomerCount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [s.id, s.contactIdentifier, s.customerName, s.customerEmail, s.customerCompany, s.customerCountry, s.status, s.priority, s.tags, s.adminNotes, s.assignedAgent, s.lastMessageText, s.lastMessageTime, s.unreadAdminCount, s.unreadCustomerCount]);
  }
  const messages = [
    // Thread 101
    {
      id: "msg-101-1",
      sessionId: "sess-101",
      sender: "customer",
      senderName: "Markus Weber",
      senderAvatar: "MW",
      message: "Hello, we are procuring 3,500 MT of industrial wood pellets for our district heating station near Essen. We need delivery at Rotterdam Port.",
      text: "Hello, we are procuring 3,500 MT of industrial wood pellets for our district heating station near Essen. We need delivery at Rotterdam Port.",
      timestamp: "2026-09-09T18:30:00.000Z",
      read: 1,
      attachments: JSON.stringify([])
    },
    {
      id: "msg-101-2",
      sessionId: "sess-101",
      sender: "agent",
      senderName: "Sarah Jenkins (Senior Trade Desk)",
      senderAvatar: "SJ",
      message: "Greetings Herr Weber! Richmount Exim supplies ENplus-A1 aligned 6mm pellets manufactured from sustainably harvested virgin pine and hardwood residues. Ash content is rigorously maintained below 0.65%.",
      text: "Greetings Herr Weber! Richmount Exim supplies ENplus-A1 aligned 6mm pellets manufactured from sustainably harvested virgin pine and hardwood residues. Ash content is rigorously maintained below 0.65%.",
      timestamp: "2026-09-09T18:35:00.000Z",
      read: 1,
      attachments: JSON.stringify(["COA-Wood-Pellets-ENplus-A1.pdf"])
    },
    {
      id: "msg-101-3",
      sessionId: "sess-101",
      sender: "customer",
      senderName: "Markus Weber",
      senderAvatar: "MW",
      message: "Can you confirm if you can guarantee ash content <0.7% on dry basis for the 3,500 MT lot to Rotterdam?",
      text: "Can you confirm if you can guarantee ash content <0.7% on dry basis for the 3,500 MT lot to Rotterdam?",
      timestamp: "2026-09-09T18:45:00.000Z",
      read: 0,
      attachments: JSON.stringify([])
    },
    // Thread 102
    {
      id: "msg-102-1",
      sessionId: "sess-102",
      sender: "customer",
      senderName: "Tariq Al-Hashimi",
      senderAvatar: "TA",
      message: "Good day, we require 150 MT Cashew Nut Shell Liquid (CNSL) FOB Cochin. What is the typical moisture and iodine value?",
      text: "Good day, we require 150 MT Cashew Nut Shell Liquid (CNSL) FOB Cochin. What is the typical moisture and iodine value?",
      timestamp: "2026-09-09T15:50:00.000Z",
      read: 1,
      attachments: JSON.stringify([])
    },
    {
      id: "msg-102-2",
      sessionId: "sess-102",
      sender: "agent",
      senderName: "Alex Morgan (Logistics & Chartering)",
      senderAvatar: "AM",
      message: "Hello Tariq, our CNSL features gross calorific value > 9,000 kcal/kg, moisture < 1.5%, and cardanol content > 70%. Shipped in 200L steel drums or 24,000L ISO tanks.",
      text: "Hello Tariq, our CNSL features gross calorific value > 9,000 kcal/kg, moisture < 1.5%, and cardanol content > 70%. Shipped in 200L steel drums or 24,000L ISO tanks.",
      timestamp: "2026-09-09T16:05:00.000Z",
      read: 1,
      attachments: JSON.stringify([])
    },
    {
      id: "msg-102-3",
      sessionId: "sess-102",
      sender: "customer",
      senderName: "Tariq Al-Hashimi",
      senderAvatar: "TA",
      message: "Could you send over the pricing difference between steel drums and ISO tanks to Jebel Ali?",
      text: "Could you send over the pricing difference between steel drums and ISO tanks to Jebel Ali?",
      timestamp: "2026-09-09T16:12:00.000Z",
      read: 1,
      attachments: JSON.stringify([])
    },
    {
      id: "msg-102-4",
      sessionId: "sess-102",
      sender: "agent",
      senderName: "Alex Morgan (Logistics & Chartering)",
      senderAvatar: "AM",
      message: "We have prepared the drum vs ISO container comparison sheet and sent it to your registered email.",
      text: "We have prepared the drum vs ISO container comparison sheet and sent it to your registered email.",
      timestamp: "2026-09-09T16:20:00.000Z",
      read: 0,
      attachments: JSON.stringify(["CNSL-Packaging-Economics-JebelAli.pdf"])
    },
    // Thread 103
    {
      id: "msg-103-1",
      sessionId: "sess-103",
      sender: "customer",
      senderName: "Kenji Sato",
      senderAvatar: "KS",
      message: "We are testing activated coconut shell carbon for municipal water de-chlorination. Iodine number must exceed 1,050 mg/g.",
      text: "We are testing activated coconut shell carbon for municipal water de-chlorination. Iodine number must exceed 1,050 mg/g.",
      timestamp: "2026-09-08T09:30:00.000Z",
      read: 1,
      attachments: JSON.stringify([])
    },
    {
      id: "msg-103-2",
      sessionId: "sess-103",
      sender: "agent",
      senderName: "Vikram Sengupta (Quality & Lab)",
      senderAvatar: "VS",
      message: "Konichiwa Sato-san. Our acid-washed coconut shell carbon delivers iodine numbers between 1,050 and 1,150 mg/g with methylene blue adsorption >180 mg/g.",
      text: "Konichiwa Sato-san. Our acid-washed coconut shell carbon delivers iodine numbers between 1,050 and 1,150 mg/g with methylene blue adsorption >180 mg/g.",
      timestamp: "2026-09-08T09:45:00.000Z",
      read: 1,
      attachments: JSON.stringify([])
    },
    {
      id: "msg-103-3",
      sessionId: "sess-103",
      sender: "customer",
      senderName: "Kenji Sato",
      senderAvatar: "KS",
      message: "Airway bill #8492019482 shows arrival at Narita customs clearance today. Thank you!",
      text: "Airway bill #8492019482 shows arrival at Narita customs clearance today. Thank you!",
      timestamp: "2026-09-08T11:15:00.000Z",
      read: 1,
      attachments: JSON.stringify([])
    }
  ];
  for (const m of messages) {
    db.run(`
      INSERT OR REPLACE INTO chat_messages (id, sessionId, sender, senderName, senderAvatar, message, text, timestamp, read, attachments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [m.id, m.sessionId, m.sender, m.senderName, m.senderAvatar, m.message, m.text, m.timestamp, m.read, m.attachments]);
  }
}
function seedFAQs(db) {
  const initialFaqs = [
    {
      id: "faq-1",
      category: "Incoterms & Shipping",
      question: "Which international trade Incoterms do you support for export contracts?",
      answer: "We routinely issue commercial contracts under Incoterms 2020 including CIF (Cost, Insurance & Freight), CFR (Cost & Freight), FOB (Free On Board Nhava Sheva / Cochin / Mundra ports), EXW (Ex-Works factory gate), and DAP (Delivered at Place) for select European and GCC industrial terminals. Our maritime chartering desk manages containerized FCL and breakbulk vessel fixtures.",
      tags: JSON.stringify(["Incoterms", "CIF", "FOB", "Maritime", "JNPT"])
    },
    {
      id: "faq-2",
      category: "Packaging & MOQ",
      question: "What is the Minimum Order Quantity (MOQ) for international container shipments?",
      answer: "Our standard export MOQ is 1 x 20ft FCL (approximately 18 to 22 Metric Tons depending on commodity density and bag specification) or 1 x 40ft HC FCL (approx. 25 to 28 MT). For trial industrial boiler testing and laboratory evaluations, palletized LCL air/sea sample consignments can be arranged upon commercial request.",
      tags: JSON.stringify(["MOQ", "FCL", "Container", "Tonnage", "Samples"])
    },
    {
      id: "faq-3",
      category: "Quality & Lab COA",
      question: "What laboratory testing and inspection certificates accompany every export shipment?",
      answer: "Every export container lot is provided with an official Certificate of Analysis (COA) containing bomb calorimetry (ASTM D5865), proximate analysis (moisture, ash content, volatile matter, fixed carbon), and ultimate elemental analysis (C, H, N, S, O). We offer independent pre-shipment sampling and testing by globally recognized surveyors (SGS, Bureau Veritas, or Intertek), accompanied by Phytosanitary Fumigation certificates and Chamber of Commerce Legalized Certificates of Origin.",
      tags: JSON.stringify(["COA", "ASTM", "SGS", "Calorific", "Fumigation"])
    },
    {
      id: "faq-4",
      category: "Custom Formulations",
      question: "Can you formulate custom biomass fuel blends for specific industrial boiler designs?",
      answer: "Yes. Our specialized blending facility calibrates particle sizes (5mm to 90mm), gross calorific value (3,800 to 7,500 kcal/kg), and high ash fusion temperatures (>1280\xB0C) tailored specifically for FBC (Fluidized Bed Combustion), AFBC, CFBC, and Stoker industrial boilers. Blending saw-dust, groundnut husk, and torrefied bio-coal prevents clinkering and boiler tube slagging.",
      tags: JSON.stringify(["Boilers", "AFBC", "CFBC", "Slagging", "Calorific"])
    },
    {
      id: "faq-5",
      category: "Payment & L/C",
      question: "What are standard international commercial payment terms for export orders?",
      answer: "Our primary export payment structures are: 1) 30% Advance T/T upon contract signing with 70% against emailed non-negotiable Bill of Lading (B/L) and SGS inspection certificate, or 2) 100% Irrevocable Confirmed Letter of Credit (L/C) at Sight from prime international tier-1 banks conforming to ICC UCP 600 regulations.",
      tags: JSON.stringify(["Payment", "Letter of Credit", "T/T", "Trade Finance", "UCP 600"])
    },
    {
      id: "faq-6",
      category: "Packaging & MOQ",
      question: "What export packaging configurations are available for pellets and briquettes?",
      answer: "We provide heavy-duty export packaging designed to withstand oceanic humidity: 1) 1,000 kg UV-stabilized PP Jumbo Bags with bottom discharge spouts and moisture barrier liners, 2) 25 kg / 50 kg multi-wall PP woven bags on heat-treated ISPM-15 wooden pallets, 3) 15 kg PE retail-ready transparent bags with barcode labelling, and 4) Full container bulk liner bags for mechanized pneumatic discharge.",
      tags: JSON.stringify(["Packaging", "Jumbo Bags", "ISPM-15", "Pallets", "Bulk"])
    },
    {
      id: "faq-7",
      category: "EU Regulations",
      question: "Are your biomass fuels compliant with EU CBAM (Carbon Border Adjustment Mechanism) & EUDR?",
      answer: "Yes. All Richmount Exim solid biofuels are sourced from certified agricultural residuals and sawmill co-products without deforestation risk. We provide comprehensive carbon accounting dossiers specifying embedded emissions data per Metric Ton, ensuring seamless compliance with European Union CBAM transitional registries and EUDR timber traceability standards.",
      tags: JSON.stringify(["CBAM", "EUDR", "Carbon Footprint", "Decarbonization", "Europe"])
    },
    {
      id: "faq-8",
      category: "Incoterms & Shipping",
      question: "What is the standard production lead time and maritime transit duration?",
      answer: "Standard manufacturing and port staging lead time is 7 to 12 business days from confirmed order / operative L/C. Ocean transit from Nhava Sheva (JNPT Mumbai) is approximately 18\u201324 days to Western European ports (Rotterdam, Antwerp, Hamburg), 4\u20136 days to GCC ports (Jebel Ali, Dammam), and 10\u201314 days to Southeast Asian terminals (Singapore, Port Klang).",
      tags: JSON.stringify(["Lead Time", "Transit", "Shipping", "Rotterdam", "Jebel Ali"])
    }
  ];
  for (const f of initialFaqs) {
    db.run(
      "INSERT OR REPLACE INTO faqs (id, category, question, answer, tags) VALUES (?, ?, ?, ?, ?)",
      [f.id, f.category, f.question, f.answer, f.tags]
    );
  }
}
function seedSiteContent(db) {
  const initialHeroSlides = [
    {
      badge: "Powering Industries with Sustainable Energy",
      title: "Industrial Biomass & Green Bio-Fuels",
      sub: "Manufacturers, Processors, Suppliers & Exporters of High-Calorific Clean Energy Alternatives.",
      highlight: "Replace Indonesian thermal coal cleanly with 4,200 \u2013 8,000 kcal/kg energy density and zero sulfur emissions.",
      ctaText: "Build Proforma RFQ",
      secondaryText: "Explore Commodity Catalog"
    },
    {
      badge: "Tailored Combustion Engineering",
      title: "Customized Biomass Fuel Blends",
      sub: "Calibrated formulations engineered specifically for your boiler combustion parameters.",
      highlight: "Optimized for FBC, AFBC, CFBC, Stoker & Rotary Kilns. High ash fusion temperature (>1280\xB0C) prevents bed clinkering.",
      ctaText: "Formulate Custom Blend",
      secondaryText: "View Boiler Specs"
    },
    {
      badge: "Metallurgical & Filtration Grade",
      title: "Coconut Charcoal & Activated Carbon",
      sub: "7,500 \u2013 8,000 kcal/kg Smokeless Briquettes & Steam-Activated Adsorption Media.",
      highlight: "Supplying 25,000 MT foundry chips for automotive castings and iodine 1,150+ PAC for water & sugar refining.",
      ctaText: "Inspect Technical Specs",
      secondaryText: "Accreditation Lab"
    }
  ];
  const initialCompanyInfo = {
    groupName: "Richexim Group",
    foundingYear: "2014",
    hqAddress: "Richmount Tower, Export Promotion Industrial Park, Kochi / Mumbai Port Hub, India",
    phone: "+91 (0) 22 6890 4400",
    email: "exports@richmount-exim.com",
    whatsapp: "+91 98401 23456",
    tagline: "Leading Global Biomass Energy & Clean Carbon Exporters",
    mission: "Empowering global heavy industries to decarbonize steam and metallurgical processes with audited, zero-deforestation solid bio-commodities."
  };
  db.run("INSERT OR REPLACE INTO site_content (key, value) VALUES (?, ?)", ["heroSlides", JSON.stringify(initialHeroSlides)]);
  db.run("INSERT OR REPLACE INTO site_content (key, value) VALUES (?, ?)", ["companyInfo", JSON.stringify(initialCompanyInfo)]);
}

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
app.use(import_express.default.urlencoded({ extended: true }));
getDatabase().then(() => {
  console.log("[Richmount Exim Server] SQLite database initialized successfully.");
}).catch((err) => {
  console.error("[Richmount Exim Server] Failed to initialize SQLite database:", err);
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Richmount Exim Enterprise API",
    parentGroup: "Richexim Group",
    uptime: process.uptime(),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/database/stats", async (req, res) => {
  try {
    await getDatabase();
    const stats = getDatabaseStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/database/backup/create", async (req, res) => {
  try {
    await getDatabase();
    const buffer = getDatabaseBuffer();
    const filename = `richmount-backup-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.sqlite`;
    res.setHeader("Content-Type", "application/x-sqlite3");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: "Backup creation failed: " + err.message });
  }
});
function executeQuery(db, sql) {
  const res = db.exec(sql);
  if (!res || res.length === 0) return [];
  const columns = res[0].columns;
  return res[0].values.map((row) => {
    const obj = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}
app.get("/api/data/all", async (req, res) => {
  try {
    const db = await getDatabase();
    const queryAll = (sql) => executeQuery(db, sql);
    const categoriesRaw = queryAll("SELECT * FROM categories ORDER BY name ASC");
    const productsRaw = queryAll("SELECT * FROM products ORDER BY name ASC");
    const quotesRaw = queryAll("SELECT * FROM quotes ORDER BY createdAt DESC");
    const certsRaw = queryAll("SELECT * FROM certifications ORDER BY name ASC");
    const articlesRaw = queryAll("SELECT * FROM articles ORDER BY date DESC");
    const careersRaw = queryAll("SELECT * FROM careers ORDER BY title ASC");
    const inquiriesRaw = queryAll("SELECT * FROM inquiries ORDER BY createdAt DESC");
    const applicationsRaw = queryAll("SELECT * FROM job_applications ORDER BY submittedAt DESC");
    const chatRaw = queryAll("SELECT * FROM chat_messages ORDER BY timestamp ASC");
    const chatSessionsRaw = queryAll("SELECT * FROM chat_sessions ORDER BY lastMessageTime DESC");
    const seoRaw = queryAll("SELECT * FROM seo_metadata");
    const faqsRaw = queryAll("SELECT * FROM faqs ORDER BY id ASC");
    const siteContentRaw = queryAll("SELECT * FROM site_content");
    const products = productsRaw.map((p) => ({
      ...p,
      packagingOptions: typeof p.packagingOptions === "string" ? JSON.parse(p.packagingOptions || "[]") : p.packagingOptions,
      applications: typeof p.applications === "string" ? JSON.parse(p.applications || "[]") : p.applications,
      inStock: Boolean(p.inStock),
      featured: Boolean(p.featured)
    }));
    const quotes = quotesRaw.map((q) => ({
      ...q,
      items: typeof q.items === "string" ? JSON.parse(q.items || "[]") : q.items
    }));
    const articles = articlesRaw.map((a) => ({
      ...a,
      tags: typeof a.tags === "string" ? JSON.parse(a.tags || "[]") : a.tags
    }));
    const careers = careersRaw.map((c) => ({
      ...c,
      requirements: typeof c.requirements === "string" ? JSON.parse(c.requirements || "[]") : c.requirements,
      responsibilities: typeof c.responsibilities === "string" ? JSON.parse(c.responsibilities || "[]") : c.responsibilities,
      active: Boolean(c.active)
    }));
    const chatHistory = chatRaw.map((m) => ({
      ...m,
      suggestedPrompts: typeof m.suggestedPrompts === "string" ? JSON.parse(m.suggestedPrompts || "[]") : m.suggestedPrompts,
      attachments: typeof m.attachments === "string" ? JSON.parse(m.attachments || "[]") : m.attachments || []
    }));
    const chatSessions = chatSessionsRaw.map((s) => ({
      ...s,
      tags: typeof s.tags === "string" ? JSON.parse(s.tags || "[]") : s.tags || []
    }));
    const seoMetadata = {};
    seoRaw.forEach((row) => {
      seoMetadata[row.pageKey] = row;
    });
    const faqs = faqsRaw.map((f) => ({
      ...f,
      tags: typeof f.tags === "string" ? JSON.parse(f.tags || "[]") : f.tags || []
    }));
    const siteContent = {};
    siteContentRaw.forEach((row) => {
      try {
        siteContent[row.key] = JSON.parse(row.value);
      } catch {
        siteContent[row.key] = row.value;
      }
    });
    const dbStats = getDatabaseStats();
    res.json({
      products,
      categories: categoriesRaw,
      quotes,
      certifications: certsRaw,
      articles,
      careers,
      faqs,
      siteContent,
      jobApplications: applicationsRaw,
      inquiries: inquiriesRaw,
      chatHistory,
      chatSessions,
      databaseStats: dbStats,
      seoMetadata,
      metrics: {
        countriesExported: 42,
        annualTonnageMT: 185e3,
        qualityAccreditations: certsRaw.length,
        co2OffsetMT: 42e4,
        totalOrdersCompleted: 1450 + quotes.length
      }
    });
  } catch (err) {
    console.error("[API /data/all] Error:", err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/metadata", (req, res) => {
  try {
    const metadataPath = import_path2.default.join(process.cwd(), "metadata.json");
    if (import_fs2.default.existsSync(metadataPath)) {
      const content = import_fs2.default.readFileSync(metadataPath, "utf-8");
      res.json(JSON.parse(content));
    } else {
      res.json({
        name: "Richmount Exim",
        description: "Enterprise export and supply chain portal for Richmount Exim (Richexim Group) specializing in industrial biomass, green fuels, and activated carbon with proforma RFQ calculator.",
        requestFramePermissions: [],
        majorCapabilities: ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
      });
    }
  } catch (err) {
    console.error("[API /api/metadata GET] Error:", err);
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/metadata", (req, res) => {
  try {
    const { name, description } = req.body;
    const metadataPath = import_path2.default.join(process.cwd(), "metadata.json");
    let current = {
      name: "Richmount Exim",
      description: "Enterprise export and supply chain portal for Richmount Exim (Richexim Group) specializing in industrial biomass, green fuels, and activated carbon with proforma RFQ calculator.",
      requestFramePermissions: [],
      majorCapabilities: ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]
    };
    if (import_fs2.default.existsSync(metadataPath)) {
      try {
        current = JSON.parse(import_fs2.default.readFileSync(metadataPath, "utf-8"));
      } catch (parseErr) {
        console.warn("Could not parse existing metadata.json, using defaults.");
      }
    }
    if (typeof name === "string" && name.trim()) {
      current.name = name.trim();
    }
    if (typeof description === "string" && description.trim()) {
      current.description = description.trim();
    }
    import_fs2.default.writeFileSync(metadataPath, JSON.stringify(current, null, 2), "utf-8");
    const indexPath = import_path2.default.join(process.cwd(), "index.html");
    if (import_fs2.default.existsSync(indexPath)) {
      let html = import_fs2.default.readFileSync(indexPath, "utf-8");
      if (current.name) {
        html = html.replace(/<title>.*?<\/title>/i, `<title>${current.name}</title>`);
        html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${current.name}" />`);
      }
      if (current.description) {
        html = html.replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${current.description}" />`);
        html = html.replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${current.description}" />`);
      }
      import_fs2.default.writeFileSync(indexPath, html, "utf-8");
    }
    res.json({ success: true, metadata: current });
  } catch (err) {
    console.error("[API /api/metadata PUT] Error:", err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/seo", async (req, res) => {
  try {
    const db = await getDatabase();
    const result = db.exec("SELECT * FROM seo_metadata ORDER BY pageKey ASC");
    if (result.length === 0) {
      return res.json({ items: [], map: {} });
    }
    const columns = result[0].columns;
    const rows = result[0].values.map((row) => {
      const obj = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
    const map = {};
    rows.forEach((r) => {
      map[r.pageKey] = r;
    });
    res.json({ items: rows, map });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/seo/:pageKey", async (req, res) => {
  try {
    const db = await getDatabase();
    const pageKey = req.params.pageKey;
    const body = req.body;
    const updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.run(`
      INSERT OR REPLACE INTO seo_metadata (
        pageKey, pageName, title, description, keywords, ogTitle, ogDescription, ogImage, twitterCard, canonicalUrl, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      pageKey,
      body.pageName || pageKey,
      body.title || "",
      body.description || "",
      body.keywords || "",
      body.ogTitle || body.title || "",
      body.ogDescription || body.description || "",
      body.ogImage || "",
      body.twitterCard || "summary_large_image",
      body.canonicalUrl || "",
      updatedAt
    ]);
    saveDatabaseToDisk();
    res.json({
      success: true,
      data: {
        pageKey,
        pageName: body.pageName || pageKey,
        title: body.title,
        description: body.description,
        keywords: body.keywords,
        ogTitle: body.ogTitle || body.title,
        ogDescription: body.ogDescription || body.description,
        ogImage: body.ogImage,
        twitterCard: body.twitterCard || "summary_large_image",
        canonicalUrl: body.canonicalUrl,
        updatedAt
      }
    });
  } catch (err) {
    console.error("[API /seo/:pageKey] Error:", err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/seo/:pageKey", async (req, res) => {
  try {
    const db = await getDatabase();
    const pageKey = req.params.pageKey;
    const body = req.body;
    const updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.run(`
      INSERT OR REPLACE INTO seo_metadata (
        pageKey, pageName, title, description, keywords, ogTitle, ogDescription, ogImage, twitterCard, canonicalUrl, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      pageKey,
      body.pageName || pageKey,
      body.title || "",
      body.description || "",
      body.keywords || "",
      body.ogTitle || body.title || "",
      body.ogDescription || body.description || "",
      body.ogImage || "",
      body.twitterCard || "summary_large_image",
      body.canonicalUrl || "",
      updatedAt
    ]);
    saveDatabaseToDisk();
    res.json({
      success: true,
      data: {
        pageKey,
        pageName: body.pageName || pageKey,
        title: body.title,
        description: body.description,
        keywords: body.keywords,
        ogTitle: body.ogTitle || body.title,
        ogDescription: body.ogDescription || body.description,
        ogImage: body.ogImage,
        twitterCard: body.twitterCard || "summary_large_image",
        canonicalUrl: body.canonicalUrl,
        updatedAt
      }
    });
  } catch (err) {
    console.error("[API /seo/:pageKey] Error:", err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/products", async (req, res) => {
  try {
    const db = await getDatabase();
    const p = req.body;
    const id = p.id || "prod-" + Date.now();
    db.run(`
      INSERT INTO products (
        id, name, category, subCategory, code, hsCode, calorificValue, calorificMin, calorificMax,
        moisture, ashContent, bulkDensity, fixedCarbon, volatileMatter, particleSize, minOrderQty,
        basePriceUSD, packagingOptions, harvestSeason, origin, applications, description,
        inStock, featured, gradeTier, imageUrl
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      p.name,
      p.category,
      p.subCategory || "",
      p.code,
      p.hsCode,
      p.calorificValue || "",
      p.calorificMin || 0,
      p.calorificMax || 0,
      p.moisture || "",
      p.ashContent || "",
      p.bulkDensity || "",
      p.fixedCarbon || "",
      p.volatileMatter || "",
      p.particleSize || "",
      p.minOrderQty || 1,
      p.basePriceUSD || 0,
      JSON.stringify(p.packagingOptions || []),
      p.harvestSeason || "",
      p.origin || "",
      JSON.stringify(p.applications || []),
      p.description || "",
      p.inStock ? 1 : 0,
      p.featured ? 1 : 0,
      p.gradeTier || "Industrial Premium",
      p.imageUrl || ""
    ]);
    saveDatabaseToDisk();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/products/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    const p = req.body;
    const id = req.params.id;
    db.run(`
      UPDATE products SET
        name = ?, category = ?, subCategory = ?, code = ?, hsCode = ?, calorificValue = ?,
        calorificMin = ?, calorificMax = ?, moisture = ?, ashContent = ?, bulkDensity = ?,
        fixedCarbon = ?, volatileMatter = ?, particleSize = ?, minOrderQty = ?, basePriceUSD = ?,
        packagingOptions = ?, harvestSeason = ?, origin = ?, applications = ?, description = ?,
        inStock = ?, featured = ?, gradeTier = ?, imageUrl = ?
      WHERE id = ?
    `, [
      p.name,
      p.category,
      p.subCategory || "",
      p.code,
      p.hsCode,
      p.calorificValue || "",
      p.calorificMin || 0,
      p.calorificMax || 0,
      p.moisture || "",
      p.ashContent || "",
      p.bulkDensity || "",
      p.fixedCarbon || "",
      p.volatileMatter || "",
      p.particleSize || "",
      p.minOrderQty || 1,
      p.basePriceUSD || 0,
      JSON.stringify(p.packagingOptions || []),
      p.harvestSeason || "",
      p.origin || "",
      JSON.stringify(p.applications || []),
      p.description || "",
      p.inStock ? 1 : 0,
      p.featured ? 1 : 0,
      p.gradeTier || "Industrial Premium",
      p.imageUrl || "",
      id
    ]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/products/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    db.run("DELETE FROM products WHERE id = ?", [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/quotes", async (req, res) => {
  try {
    const db = await getDatabase();
    const q = req.body;
    const id = q.id || "rfq-" + Date.now();
    const quoteNumber = q.quoteNumber || `RME-RFQ-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    db.run(`
      INSERT INTO quotes (
        id, quoteNumber, createdAt, buyerName, buyerCompany, buyerEmail, buyerPhone, buyerCountry,
        destinationPort, incoterm, items, subtotalUSD, freightCostUSD, insuranceCostUSD,
        inspectionFeeUSD, discountUSD, totalUSD, status, notes, paymentTerms,
        estimatedDeliveryWeeks, validUntil, assignedManager
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      quoteNumber,
      q.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      q.buyerName,
      q.buyerCompany,
      q.buyerEmail,
      q.buyerPhone || "",
      q.buyerCountry || "",
      q.destinationPort || "Nhava Sheva (FOB)",
      q.incoterm || "FOB",
      JSON.stringify(q.items || []),
      q.subtotalUSD || 0,
      q.freightCostUSD || 0,
      q.insuranceCostUSD || 0,
      q.inspectionFeeUSD || 0,
      q.discountUSD || 0,
      q.totalUSD || 0,
      q.status || "Pending",
      q.notes || "",
      q.paymentTerms || "30% T/T Advance, 70% against B/L copy",
      q.estimatedDeliveryWeeks || 3,
      q.validUntil || new Date(Date.now() + 30 * 864e5).toISOString().split("T")[0],
      q.assignedManager || "Sales Desk"
    ]);
    saveDatabaseToDisk();
    res.json({ success: true, id, quoteNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/quotes/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    const q = req.body;
    const id = req.params.id;
    const existing = db.exec("SELECT * FROM quotes WHERE id = ?", [id]);
    let existingQuote = {};
    if (existing.length > 0 && existing[0].values.length > 0) {
      const cols = existing[0].columns;
      const row = existing[0].values[0];
      cols.forEach((col, idx) => {
        existingQuote[col] = row[idx];
      });
    }
    const status = q.status !== void 0 ? q.status : existingQuote.status || "Pending";
    const items = q.items !== void 0 ? JSON.stringify(q.items) : existingQuote.items || "[]";
    const subtotalUSD = q.subtotalUSD !== void 0 ? q.subtotalUSD : existingQuote.subtotalUSD || 0;
    const freightCostUSD = q.freightCostUSD !== void 0 ? q.freightCostUSD : existingQuote.freightCostUSD || 0;
    const insuranceCostUSD = q.insuranceCostUSD !== void 0 ? q.insuranceCostUSD : existingQuote.insuranceCostUSD || 0;
    const discountUSD = q.discountUSD !== void 0 ? q.discountUSD : existingQuote.discountUSD || 0;
    const totalUSD = q.totalUSD !== void 0 ? q.totalUSD : existingQuote.totalUSD || 0;
    const notes = q.notes !== void 0 ? q.notes : existingQuote.notes || "";
    const paymentTerms = q.paymentTerms !== void 0 ? q.paymentTerms : existingQuote.paymentTerms || "";
    const estimatedDeliveryWeeks = q.estimatedDeliveryWeeks !== void 0 ? q.estimatedDeliveryWeeks : existingQuote.estimatedDeliveryWeeks || 3;
    const assignedManager = q.assignedManager !== void 0 ? q.assignedManager : existingQuote.assignedManager || "Sales Desk";
    db.run(`
      UPDATE quotes SET
        status = ?, items = ?, subtotalUSD = ?, freightCostUSD = ?, insuranceCostUSD = ?, discountUSD = ?,
        totalUSD = ?, notes = ?, paymentTerms = ?, estimatedDeliveryWeeks = ?, assignedManager = ?
      WHERE id = ?
    `, [
      status,
      items,
      subtotalUSD,
      freightCostUSD,
      insuranceCostUSD,
      discountUSD,
      totalUSD,
      notes,
      paymentTerms,
      estimatedDeliveryWeeks,
      assignedManager,
      id
    ]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/quotes/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    db.run("DELETE FROM quotes WHERE id = ?", [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/articles", async (req, res) => {
  try {
    const db = await getDatabase();
    const a = req.body;
    const id = a.id || "art-" + Date.now();
    const slug = a.slug || a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    db.run(`
      INSERT INTO articles (id, title, slug, excerpt, content, category, author, authorRole, date, readTime, status, tags, views)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      a.title,
      slug,
      a.excerpt,
      a.content,
      a.category,
      a.author,
      a.authorRole || "Contributor",
      a.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      a.readTime || "4 min read",
      a.status || "Pending Moderation",
      JSON.stringify(a.tags || []),
      0
    ]);
    saveDatabaseToDisk();
    res.json({ success: true, id, slug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/articles/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    const a = req.body;
    const id = req.params.id;
    db.run(`
      UPDATE articles SET
        title = ?, excerpt = ?, content = ?, category = ?, author = ?, authorRole = ?,
        status = ?, tags = ?
      WHERE id = ?
    `, [
      a.title,
      a.excerpt,
      a.content,
      a.category,
      a.author,
      a.authorRole,
      a.status,
      JSON.stringify(a.tags || []),
      id
    ]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/articles/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    db.run("DELETE FROM articles WHERE id = ?", [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/inquiries", async (req, res) => {
  try {
    const db = await getDatabase();
    const inq = req.body;
    const id = inq.id || "inq-" + Date.now();
    db.run(`
      INSERT INTO inquiries (id, fullName, email, phone, company, country, subject, message, productInterest, createdAt, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      inq.fullName,
      inq.email,
      inq.phone || "",
      inq.company || "",
      inq.country || "",
      inq.subject || "Export Inquiry",
      inq.message,
      inq.productInterest || "General",
      (/* @__PURE__ */ new Date()).toISOString(),
      "New"
    ]);
    saveDatabaseToDisk();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/inquiries/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    const { status } = req.body;
    db.run("UPDATE inquiries SET status = ? WHERE id = ?", [status || "Contacted", req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/inquiries/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    db.run("DELETE FROM inquiries WHERE id = ?", [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/certifications", async (req, res) => {
  try {
    const db = await getDatabase();
    const c = req.body;
    const id = c.id || "cert-" + Date.now();
    db.run(`
      INSERT INTO certifications (id, name, issuer, code, issueDate, validUntil, accreditedBody, category, description, badgeCode, documentNumber)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      c.name,
      c.issuer || "",
      c.code || "",
      c.issueDate || "",
      c.validUntil || "",
      c.accreditedBody || "",
      c.category || "Quality",
      c.description || "",
      c.badgeCode || "",
      c.documentNumber || ""
    ]);
    saveDatabaseToDisk();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/certifications/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    const c = req.body;
    db.run(`
      UPDATE certifications SET
        name = ?, issuer = ?, code = ?, issueDate = ?, validUntil = ?,
        accreditedBody = ?, category = ?, description = ?, badgeCode = ?, documentNumber = ?
      WHERE id = ?
    `, [
      c.name,
      c.issuer || "",
      c.code || "",
      c.issueDate || "",
      c.validUntil || "",
      c.accreditedBody || "",
      c.category || "Quality",
      c.description || "",
      c.badgeCode || "",
      c.documentNumber || "",
      req.params.id
    ]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/certifications/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    db.run("DELETE FROM certifications WHERE id = ?", [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/careers", async (req, res) => {
  try {
    const db = await getDatabase();
    const c = req.body;
    const id = c.id || "job-" + Date.now();
    db.run(`
      INSERT INTO careers (id, title, department, location, type, experience, description, requirements, responsibilities, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      c.title,
      c.department || "International Trade",
      c.location || "Mumbai / Hybrid",
      c.type || "Full-time",
      c.experience || "2 - 5 Years",
      c.description || "",
      JSON.stringify(c.requirements || []),
      JSON.stringify(c.responsibilities || []),
      c.active !== void 0 ? c.active ? 1 : 0 : 1
    ]);
    saveDatabaseToDisk();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/careers/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    const c = req.body;
    db.run(`
      UPDATE careers SET
        title = ?, department = ?, location = ?, type = ?, experience = ?,
        description = ?, requirements = ?, responsibilities = ?, active = ?
      WHERE id = ?
    `, [
      c.title,
      c.department,
      c.location,
      c.type,
      c.experience,
      c.description,
      JSON.stringify(c.requirements || []),
      JSON.stringify(c.responsibilities || []),
      c.active ? 1 : 0,
      req.params.id
    ]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/careers/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    db.run("DELETE FROM careers WHERE id = ?", [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/faqs", async (req, res) => {
  try {
    const db = await getDatabase();
    const rows = executeQuery(db, "SELECT * FROM faqs ORDER BY id ASC");
    const parsed = rows.map((r) => ({
      ...r,
      tags: typeof r.tags === "string" ? JSON.parse(r.tags || "[]") : r.tags || []
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/faqs", async (req, res) => {
  try {
    const db = await getDatabase();
    const f = req.body;
    const id = f.id || "faq-" + Date.now();
    db.run(`
      INSERT INTO faqs (id, category, question, answer, tags)
      VALUES (?, ?, ?, ?, ?)
    `, [
      id,
      f.category || "General",
      f.question,
      f.answer,
      JSON.stringify(f.tags || [])
    ]);
    saveDatabaseToDisk();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/faqs/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    const f = req.body;
    db.run(`
      UPDATE faqs SET
        category = ?, question = ?, answer = ?, tags = ?
      WHERE id = ?
    `, [
      f.category,
      f.question,
      f.answer,
      JSON.stringify(f.tags || []),
      req.params.id
    ]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/api/faqs/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    db.run("DELETE FROM faqs WHERE id = ?", [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/site-content", async (req, res) => {
  try {
    const db = await getDatabase();
    const rows = executeQuery(db, "SELECT * FROM site_content");
    const result = {};
    rows.forEach((r) => {
      try {
        result[r.key] = JSON.parse(r.value);
      } catch {
        result[r.key] = r.value;
      }
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/site-content/:key", async (req, res) => {
  try {
    const db = await getDatabase();
    const key = req.params.key;
    const valueStr = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    db.run("INSERT OR REPLACE INTO site_content (key, value) VALUES (?, ?)", [key, valueStr]);
    saveDatabaseToDisk();
    res.json({ success: true, key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/careers/apply", async (req, res) => {
  try {
    const db = await getDatabase();
    const appData = req.body;
    const id = "app-" + Date.now();
    db.run(`
      INSERT INTO job_applications (id, jobId, jobTitle, applicantName, email, phone, experienceYears, coverLetter, portfolioUrl, submittedAt, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      appData.jobId,
      appData.jobTitle,
      appData.applicantName,
      appData.email,
      appData.phone || "",
      appData.experienceYears || 0,
      appData.coverLetter || "",
      appData.portfolioUrl || "",
      (/* @__PURE__ */ new Date()).toISOString(),
      "Under Review"
    ]);
    saveDatabaseToDisk();
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/careers/applications/:id/status", async (req, res) => {
  try {
    const db = await getDatabase();
    const { status } = req.body;
    db.run("UPDATE job_applications SET status = ? WHERE id = ?", [status || "Reviewed", req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/chat", async (req, res) => {
  try {
    const db = await getDatabase();
    const { message, senderName } = req.body;
    const userMsgId = "msg-" + Date.now();
    db.run(`
      INSERT INTO chat_messages (id, sender, senderName, text, timestamp, suggestedPrompts)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [userMsgId, "user", senderName || "International Buyer", message, (/* @__PURE__ */ new Date()).toISOString(), "[]"]);
    const msgLower = (message || "").toLowerCase();
    let replyText = "";
    let suggestedPrompts = [];
    if (msgLower.includes("calorific") || msgLower.includes("energy") || msgLower.includes("kcal")) {
      replyText = "Our biomass fuels span from 3,800 to 5,500 kcal/kg for agro-wood briquettes/pellets, and up to 7,500 - 8,000 kcal/kg for our premium Coconut Shell Smokeless Charcoal. All lots are tested in our accredited lab with Parr Bomb Calorimeters.";
      suggestedPrompts = ["View Technical Specifications table", "Download Certificate of Analysis", "Build custom RFQ quote"];
    } else if (msgLower.includes("freight") || msgLower.includes("port") || msgLower.includes("cif") || msgLower.includes("fob")) {
      replyText = "We operate regular ocean freight contracts with major shipping lines from Nhava Sheva (JNPT), Cochin, Chennai, and Mundra ports. Standard container load is 20-25 MT per 20ft FCL and up to 28 MT for 40ft HC. We support CIF, FOB, CFR, and EXW terms.";
      suggestedPrompts = ["Open RFQ Calculator for Port of Jebel Ali", "Calculate CIF Rotterdam price", "Request breakbulk vessel quotation"];
    } else if (msgLower.includes("sample") || msgLower.includes("test") || msgLower.includes("trial")) {
      replyText = "We dispatch 1kg - 5kg laboratory samples worldwide via DHL/FedEx Express with comprehensive Certificate of Analysis (COA), moisture verification, and ash fusion data. Please provide your corporate address and courier account.";
      suggestedPrompts = ["Submit Sample Request Form", "Contact sales via WhatsApp", "Check ISO 9001 and SGS certificates"];
    } else if (msgLower.includes("fbc") || msgLower.includes("boiler") || msgLower.includes("blend")) {
      replyText = "Our Customized Biomass Blends are tailor-formulated for Fluidized Bed (FBC/AFBC/CFBC) and Stoker boilers. We adjust silica-to-potassium ratios to maintain ash fusion temperatures above 1,280\xB0C, preventing bed sintering and clinker formation.";
      suggestedPrompts = ["Explore FBC Boiler Blends", "Read technical whitepaper on bed agglomeration", "Book technical engineering consultation"];
    } else if (msgLower.includes("carbon") || msgLower.includes("foundry") || msgLower.includes("activated")) {
      replyText = "Richmount Exim exports over 25,000 MT annually of Coconut Charcoal Chips for cast iron automotive foundries, as well as steam-activated Powdered (PAC) and Granular (GAC) activated carbons with Iodine values up to 1,150 mg/g.";
      suggestedPrompts = ["View Foundry Grade Carbon specs", "View PAC Sugar/Water Refining specs", "Download ASTM compliance certificate"];
    } else {
      replyText = "Thank you for reaching out to Richmount Exim (Richexim Group). Our export operations team is on standby to assist you with commercial proforma invoicing, customs tariff codes (HS Codes), container stuffing options, and bulk contract pricing. How can we direct your request?";
      suggestedPrompts = ["Configure Proforma RFQ", "Explore all product categories", "Connect directly on WhatsApp +91 8105233700"];
    }
    const replyMsgId = "msg-" + (Date.now() + 1);
    db.run(`
      INSERT INTO chat_messages (id, sender, senderName, text, timestamp, suggestedPrompts)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [replyMsgId, "agent", "Richexim Logistics Desk", replyText, new Date(Date.now() + 500).toISOString(), JSON.stringify(suggestedPrompts)]);
    saveDatabaseToDisk();
    res.json({
      userMessage: { id: userMsgId, sender: "user", text: message, timestamp: (/* @__PURE__ */ new Date()).toISOString() },
      agentReply: { id: replyMsgId, sender: "agent", senderName: "Richexim Logistics Desk", text: replyText, timestamp: (/* @__PURE__ */ new Date()).toISOString(), suggestedPrompts }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/chat/sessions", async (req, res) => {
  try {
    const db = await getDatabase();
    const result = db.exec("SELECT * FROM chat_sessions ORDER BY lastMessageTime DESC");
    if (result.length === 0) {
      return res.json([]);
    }
    const cols = result[0].columns;
    const sessions = result[0].values.map((row) => {
      const s = {};
      cols.forEach((col, idx) => {
        s[col] = row[idx];
      });
      s.tags = typeof s.tags === "string" ? JSON.parse(s.tags || "[]") : s.tags || [];
      return s;
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/chat/sessions", async (req, res) => {
  try {
    const db = await getDatabase();
    const { contactIdentifier, customerName, customerEmail, customerCompany, customerCountry, initialMessage, tags } = req.body;
    let sessionId = "sess-" + Date.now();
    let existingSession = null;
    if (contactIdentifier) {
      const checkRes = db.exec(`SELECT * FROM chat_sessions WHERE contactIdentifier = ? LIMIT 1`);
      const stmt = db.prepare("SELECT * FROM chat_sessions WHERE contactIdentifier = ?");
      stmt.bind([contactIdentifier]);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        existingSession = {
          ...row,
          tags: typeof row.tags === "string" ? JSON.parse(row.tags || "[]") : []
        };
        sessionId = row.id;
      }
      stmt.free();
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (!existingSession) {
      const assignedAgent = "Sarah Jenkins (Senior Trade Desk)";
      const initialStatus = "waiting_agent";
      const initialPriority = "normal";
      const parsedTags = JSON.stringify(tags || ["Storefront Inquiry", customerCompany || "Direct Buyer"]);
      const lastText = initialMessage || "Chat session initiated";
      db.run(`
        INSERT INTO chat_sessions (id, contactIdentifier, customerName, customerEmail, customerCompany, customerCountry, status, priority, tags, adminNotes, assignedAgent, lastMessageText, lastMessageTime, unreadAdminCount, unreadCustomerCount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        sessionId,
        contactIdentifier || customerEmail || `anon-${Date.now()}`,
        customerName || "Anonymous Buyer",
        customerEmail || "",
        customerCompany || "Commercial Prospect",
        customerCountry || "International",
        initialStatus,
        initialPriority,
        parsedTags,
        "Session initiated from storefront chat widget.",
        assignedAgent,
        lastText,
        now,
        initialMessage ? 1 : 0,
        0
      ]);
      if (initialMessage) {
        const msgId = "msg-" + Date.now();
        db.run(`
          INSERT INTO chat_messages (id, sessionId, sender, senderName, senderAvatar, message, text, timestamp, read, attachments)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          msgId,
          sessionId,
          "customer",
          customerName || "Customer",
          (customerName || "CU").slice(0, 2).toUpperCase(),
          initialMessage,
          initialMessage,
          now,
          0,
          JSON.stringify([])
        ]);
        const slaReplyId = "msg-" + (Date.now() + 10);
        const slaText = "Hello " + (customerName || "") + "! Thank you for connecting with Richmount Exim (Richexim Group). Our international trade desk has logged your inquiry for " + (customerCompany ? customerCompany + " " : "") + "and typically responds within 15 minutes during port business hours (09:00 - 18:00 IST).";
        db.run(`
          INSERT INTO chat_messages (id, sessionId, sender, senderName, senderAvatar, message, text, timestamp, read, attachments)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          slaReplyId,
          sessionId,
          "system",
          "Richmount Export Desk (Auto-SLA)",
          "RX",
          slaText,
          slaText,
          new Date(Date.now() + 800).toISOString(),
          0,
          JSON.stringify([])
        ]);
      }
      saveDatabaseToDisk();
      return res.json({
        id: sessionId,
        contactIdentifier: contactIdentifier || customerEmail,
        customerName,
        customerEmail,
        customerCompany,
        customerCountry,
        status: initialStatus,
        priority: initialPriority,
        tags: tags || ["Storefront Inquiry"],
        lastMessageText: lastText,
        lastMessageTime: now,
        unreadAdminCount: 1,
        unreadCustomerCount: 0
      });
    } else {
      if (initialMessage) {
        const msgId = "msg-" + Date.now();
        db.run(`
          INSERT INTO chat_messages (id, sessionId, sender, senderName, senderAvatar, message, text, timestamp, read, attachments)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          msgId,
          sessionId,
          "customer",
          customerName || existingSession.customerName || "Customer",
          (customerName || existingSession.customerName || "CU").slice(0, 2).toUpperCase(),
          initialMessage,
          initialMessage,
          now,
          0,
          JSON.stringify([])
        ]);
        db.run(`
          UPDATE chat_sessions SET
            lastMessageText = ?,
            lastMessageTime = ?,
            status = 'waiting_agent',
            unreadAdminCount = unreadAdminCount + 1
          WHERE id = ?
        `, [initialMessage, now, sessionId]);
        saveDatabaseToDisk();
      }
      return res.json(existingSession);
    }
  } catch (err) {
    console.error("[API /api/chat/sessions POST Error]", err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/chat/sessions/:id/messages", async (req, res) => {
  try {
    const db = await getDatabase();
    const sessionId = req.params.id;
    const stmt = db.prepare("SELECT * FROM chat_messages WHERE sessionId = ? ORDER BY timestamp ASC");
    stmt.bind([sessionId]);
    const messages = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      messages.push({
        ...row,
        attachments: typeof row.attachments === "string" ? JSON.parse(row.attachments || "[]") : [],
        suggestedPrompts: typeof row.suggestedPrompts === "string" ? JSON.parse(row.suggestedPrompts || "[]") : []
      });
    }
    stmt.free();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/chat/sessions/:id/messages", async (req, res) => {
  try {
    const db = await getDatabase();
    const sessionId = req.params.id;
    const { sender, senderName, senderAvatar, message, attachments } = req.body;
    const msgId = "msg-" + Date.now();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const cleanSender = sender === "agent" ? "agent" : sender === "system" ? "system" : "customer";
    const cleanAvatar = senderAvatar || (cleanSender === "agent" ? "RX" : cleanSender === "system" ? "SYS" : "CU");
    db.run(`
      INSERT INTO chat_messages (id, sessionId, sender, senderName, senderAvatar, message, text, timestamp, read, attachments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      msgId,
      sessionId,
      cleanSender,
      senderName || (cleanSender === "agent" ? "Richmount Trade Agent" : "Customer"),
      cleanAvatar,
      message,
      message,
      now,
      0,
      JSON.stringify(attachments || [])
    ]);
    if (cleanSender === "agent") {
      db.run(`
        UPDATE chat_sessions SET
          lastMessageText = ?,
          lastMessageTime = ?,
          status = 'active',
          unreadAdminCount = 0,
          unreadCustomerCount = unreadCustomerCount + 1
        WHERE id = ?
      `, [message, now, sessionId]);
    } else if (cleanSender === "customer") {
      db.run(`
        UPDATE chat_sessions SET
          lastMessageText = ?,
          lastMessageTime = ?,
          status = 'waiting_agent',
          unreadAdminCount = unreadAdminCount + 1
        WHERE id = ?
      `, [message, now, sessionId]);
    }
    saveDatabaseToDisk();
    const createdMsg = {
      id: msgId,
      sessionId,
      sender: cleanSender,
      senderName: senderName || (cleanSender === "agent" ? "Richmount Trade Agent" : "Customer"),
      senderAvatar: cleanAvatar,
      message,
      text: message,
      timestamp: now,
      read: 0,
      attachments: attachments || []
    };
    res.json({ success: true, message: createdMsg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/api/chat/sessions/:id", async (req, res) => {
  try {
    const db = await getDatabase();
    const sessionId = req.params.id;
    const { status, priority, adminNotes, assignedAgent, tags, markRead } = req.body;
    if (markRead === "admin") {
      db.run(`UPDATE chat_sessions SET unreadAdminCount = 0 WHERE id = ?`, [sessionId]);
      db.run(`UPDATE chat_messages SET read = 1 WHERE sessionId = ? AND sender = 'customer'`, [sessionId]);
    } else if (markRead === "customer") {
      db.run(`UPDATE chat_sessions SET unreadCustomerCount = 0 WHERE id = ?`, [sessionId]);
      db.run(`UPDATE chat_messages SET read = 1 WHERE sessionId = ? AND sender != 'customer'`, [sessionId]);
    }
    if (status) {
      db.run(`UPDATE chat_sessions SET status = ? WHERE id = ?`, [status, sessionId]);
    }
    if (priority) {
      db.run(`UPDATE chat_sessions SET priority = ? WHERE id = ?`, [priority, sessionId]);
    }
    if (adminNotes !== void 0) {
      db.run(`UPDATE chat_sessions SET adminNotes = ? WHERE id = ?`, [adminNotes, sessionId]);
    }
    if (assignedAgent) {
      db.run(`UPDATE chat_sessions SET assignedAgent = ? WHERE id = ?`, [assignedAgent, sessionId]);
    }
    if (tags) {
      db.run(`UPDATE chat_sessions SET tags = ? WHERE id = ?`, [JSON.stringify(tags), sessionId]);
    }
    saveDatabaseToDisk();
    const stmt = db.prepare("SELECT * FROM chat_sessions WHERE id = ?");
    stmt.bind([sessionId]);
    let updatedSession = null;
    if (stmt.step()) {
      const row = stmt.getAsObject();
      updatedSession = {
        ...row,
        tags: typeof row.tags === "string" ? JSON.parse(row.tags || "[]") : []
      };
    }
    stmt.free();
    res.json({ success: true, session: updatedSession });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/database/backup/create", async (req, res) => {
  try {
    saveDatabaseToDisk();
    const buffer = getDatabaseBuffer();
    const backupsDir = import_path2.default.join(process.cwd(), "data", "backups");
    if (!import_fs2.default.existsSync(backupsDir)) {
      import_fs2.default.mkdirSync(backupsDir, { recursive: true });
    }
    const filename = `richexim_backup_${Date.now()}.sqlite`;
    const filePath = import_path2.default.join(backupsDir, filename);
    import_fs2.default.writeFileSync(filePath, buffer);
    res.json({
      status: "ok",
      message: "Binary SQLite snapshot created successfully",
      backupFile: filename,
      sizeBytes: buffer.length,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (err) {
    console.error("[Backup Error]", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});
app.get("/api/database/backup/download", async (req, res) => {
  try {
    saveDatabaseToDisk();
    const buffer = getDatabaseBuffer();
    res.setHeader("Content-Type", "application/x-sqlite3");
    res.setHeader("Content-Disposition", `attachment; filename="richexim_db_${Date.now()}.sqlite"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/api/database/stats", async (req, res) => {
  try {
    const stats = getDatabaseStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Richmount Exim] Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
