import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { getDatabase, saveDatabaseToDisk, getDatabaseBuffer, getDatabaseStats } from './server/db.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize SQLite database
getDatabase().then(() => {
  console.log('[Richmount Exim Server] SQLite database initialized successfully.');
}).catch((err) => {
  console.error('[Richmount Exim Server] Failed to initialize SQLite database:', err);
});

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Richmount Exim Enterprise API',
    parentGroup: 'Richexim Group',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Database Telemetry & Stats
app.get('/api/database/stats', async (req: Request, res: Response) => {
  try {
    await getDatabase();
    const stats = getDatabaseStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Binary Snapshot Backup Download API (e.g. for NVMe SSD hosting)
app.get('/api/database/backup/create', async (req: Request, res: Response) => {
  try {
    await getDatabase();
    const buffer = getDatabaseBuffer();
    const filename = `richmount-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.sqlite`;

    res.setHeader('Content-Type', 'application/x-sqlite3');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: 'Backup creation failed: ' + err.message });
  }
});

// Hydrated Full App State (Zero-flicker architecture)
app.get('/api/data/all', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();

    // Helper to query and map columns to objects
    const queryAll = (sql: string) => {
      const res = db.exec(sql);
      if (res.length === 0) return [];
      const columns = res[0].columns;
      return res[0].values.map((row) => {
        const obj: Record<string, any> = {};
        columns.forEach((col, i) => {
          obj[col] = row[i];
        });
        return obj;
      });
    };

    const categoriesRaw = queryAll('SELECT * FROM categories ORDER BY name ASC');
    const productsRaw = queryAll('SELECT * FROM products ORDER BY name ASC');
    const quotesRaw = queryAll('SELECT * FROM quotes ORDER BY createdAt DESC');
    const certsRaw = queryAll('SELECT * FROM certifications ORDER BY name ASC');
    const articlesRaw = queryAll('SELECT * FROM articles ORDER BY date DESC');
    const careersRaw = queryAll('SELECT * FROM careers ORDER BY title ASC');
    const inquiriesRaw = queryAll('SELECT * FROM inquiries ORDER BY createdAt DESC');
    const applicationsRaw = queryAll('SELECT * FROM job_applications ORDER BY submittedAt DESC');
    const chatRaw = queryAll('SELECT * FROM chat_messages ORDER BY timestamp ASC');
    const seoRaw = queryAll('SELECT * FROM seo_metadata');

    // Parse JSON string fields safely
    const products = productsRaw.map((p) => ({
      ...p,
      packagingOptions: typeof p.packagingOptions === 'string' ? JSON.parse(p.packagingOptions || '[]') : p.packagingOptions,
      applications: typeof p.applications === 'string' ? JSON.parse(p.applications || '[]') : p.applications,
      inStock: Boolean(p.inStock),
      featured: Boolean(p.featured)
    }));

    const quotes = quotesRaw.map((q) => ({
      ...q,
      items: typeof q.items === 'string' ? JSON.parse(q.items || '[]') : q.items
    }));

    const articles = articlesRaw.map((a) => ({
      ...a,
      tags: typeof a.tags === 'string' ? JSON.parse(a.tags || '[]') : a.tags
    }));

    const careers = careersRaw.map((c) => ({
      ...c,
      requirements: typeof c.requirements === 'string' ? JSON.parse(c.requirements || '[]') : c.requirements,
      responsibilities: typeof c.responsibilities === 'string' ? JSON.parse(c.responsibilities || '[]') : c.responsibilities,
      active: Boolean(c.active)
    }));

    const chatHistory = chatRaw.map((m) => ({
      ...m,
      suggestedPrompts: typeof m.suggestedPrompts === 'string' ? JSON.parse(m.suggestedPrompts || '[]') : m.suggestedPrompts
    }));

    const seoMetadata: Record<string, any> = {};
    seoRaw.forEach((row: any) => {
      seoMetadata[row.pageKey] = row;
    });

    const dbStats = getDatabaseStats();

    res.json({
      products,
      categories: categoriesRaw,
      quotes,
      certifications: certsRaw,
      articles,
      careers,
      jobApplications: applicationsRaw,
      inquiries: inquiriesRaw,
      chatHistory,
      databaseStats: dbStats,
      seoMetadata,
      metrics: {
        countriesExported: 42,
        annualTonnageMT: 185000,
        qualityAccreditations: certsRaw.length,
        co2OffsetMT: 420000,
        totalOrdersCompleted: 1450 + quotes.length
      }
    });
  } catch (err: any) {
    console.error('[API /data/all] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Root Metadata (metadata.json) Management APIs
app.get('/api/metadata', (req: Request, res: Response) => {
  try {
    const metadataPath = path.join(process.cwd(), 'metadata.json');
    if (fs.existsSync(metadataPath)) {
      const content = fs.readFileSync(metadataPath, 'utf-8');
      res.json(JSON.parse(content));
    } else {
      res.json({
        name: 'Richmount Exim',
        description: 'Enterprise export and supply chain portal for Richmount Exim (Richexim Group) specializing in industrial biomass, green fuels, and activated carbon with proforma RFQ calculator.',
        requestFramePermissions: [],
        majorCapabilities: ['MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API']
      });
    }
  } catch (err: any) {
    console.error('[API /api/metadata GET] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/metadata', (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const metadataPath = path.join(process.cwd(), 'metadata.json');
    let current: any = {
      name: 'Richmount Exim',
      description: 'Enterprise export and supply chain portal for Richmount Exim (Richexim Group) specializing in industrial biomass, green fuels, and activated carbon with proforma RFQ calculator.',
      requestFramePermissions: [],
      majorCapabilities: ['MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API']
    };
    if (fs.existsSync(metadataPath)) {
      try {
        current = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      } catch (parseErr) {
        console.warn('Could not parse existing metadata.json, using defaults.');
      }
    }
    if (typeof name === 'string' && name.trim()) {
      current.name = name.trim();
    }
    if (typeof description === 'string' && description.trim()) {
      current.description = description.trim();
    }
    fs.writeFileSync(metadataPath, JSON.stringify(current, null, 2), 'utf-8');

    // Keep HTML entry point in sync
    const indexPath = path.join(process.cwd(), 'index.html');
    if (fs.existsSync(indexPath)) {
      let html = fs.readFileSync(indexPath, 'utf-8');
      if (current.name) {
        html = html.replace(/<title>.*?<\/title>/i, `<title>${current.name}</title>`);
        html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/i, `<meta property="og:title" content="${current.name}" />`);
      }
      if (current.description) {
        html = html.replace(/<meta name="description" content=".*?"\s*\/?>/i, `<meta name="description" content="${current.description}" />`);
        html = html.replace(/<meta property="og:description" content=".*?"\s*\/?>/i, `<meta property="og:description" content="${current.description}" />`);
      }
      fs.writeFileSync(indexPath, html, 'utf-8');
    }

    res.json({ success: true, metadata: current });
  } catch (err: any) {
    console.error('[API /api/metadata PUT] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Centralized SEO Metadata Management APIs
app.get('/api/seo', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM seo_metadata ORDER BY pageKey ASC');
    if (result.length === 0) {
      return res.json({ items: [], map: {} });
    }
    const columns = result[0].columns;
    const rows = result[0].values.map((row) => {
      const obj: Record<string, any> = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
    const map: Record<string, any> = {};
    rows.forEach((r) => {
      map[r.pageKey] = r;
    });
    res.json({ items: rows, map });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/seo/:pageKey', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const pageKey = req.params.pageKey;
    const body = req.body;
    const updatedAt = new Date().toISOString();

    db.run(`
      INSERT OR REPLACE INTO seo_metadata (
        pageKey, pageName, title, description, keywords, ogTitle, ogDescription, ogImage, twitterCard, canonicalUrl, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      pageKey,
      body.pageName || pageKey,
      body.title || '',
      body.description || '',
      body.keywords || '',
      body.ogTitle || body.title || '',
      body.ogDescription || body.description || '',
      body.ogImage || '',
      body.twitterCard || 'summary_large_image',
      body.canonicalUrl || '',
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
        twitterCard: body.twitterCard || 'summary_large_image',
        canonicalUrl: body.canonicalUrl,
        updatedAt
      }
    });
  } catch (err: any) {
    console.error('[API /seo/:pageKey] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/seo/:pageKey', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const pageKey = req.params.pageKey;
    const body = req.body;
    const updatedAt = new Date().toISOString();

    db.run(`
      INSERT OR REPLACE INTO seo_metadata (
        pageKey, pageName, title, description, keywords, ogTitle, ogDescription, ogImage, twitterCard, canonicalUrl, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      pageKey,
      body.pageName || pageKey,
      body.title || '',
      body.description || '',
      body.keywords || '',
      body.ogTitle || body.title || '',
      body.ogDescription || body.description || '',
      body.ogImage || '',
      body.twitterCard || 'summary_large_image',
      body.canonicalUrl || '',
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
        twitterCard: body.twitterCard || 'summary_large_image',
        canonicalUrl: body.canonicalUrl,
        updatedAt
      }
    });
  } catch (err: any) {
    console.error('[API /seo/:pageKey] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Products CRUD
app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const p = req.body;
    const id = p.id || 'prod-' + Date.now();

    db.run(`
      INSERT INTO products (
        id, name, category, subCategory, code, hsCode, calorificValue, calorificMin, calorificMax,
        moisture, ashContent, bulkDensity, fixedCarbon, volatileMatter, particleSize, minOrderQty,
        basePriceUSD, packagingOptions, harvestSeason, origin, applications, description,
        inStock, featured, gradeTier, imageUrl
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, p.name, p.category, p.subCategory || '', p.code, p.hsCode, p.calorificValue || '',
      p.calorificMin || 0, p.calorificMax || 0, p.moisture || '', p.ashContent || '', p.bulkDensity || '',
      p.fixedCarbon || '', p.volatileMatter || '', p.particleSize || '', p.minOrderQty || 1,
      p.basePriceUSD || 0, JSON.stringify(p.packagingOptions || []), p.harvestSeason || '',
      p.origin || '', JSON.stringify(p.applications || []), p.description || '',
      p.inStock ? 1 : 0, p.featured ? 1 : 0, p.gradeTier || 'Industrial Premium', p.imageUrl || ''
    ]);

    saveDatabaseToDisk();
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req: Request, res: Response) => {
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
      p.name, p.category, p.subCategory || '', p.code, p.hsCode, p.calorificValue || '',
      p.calorificMin || 0, p.calorificMax || 0, p.moisture || '', p.ashContent || '', p.bulkDensity || '',
      p.fixedCarbon || '', p.volatileMatter || '', p.particleSize || '', p.minOrderQty || 1,
      p.basePriceUSD || 0, JSON.stringify(p.packagingOptions || []), p.harvestSeason || '',
      p.origin || '', JSON.stringify(p.applications || []), p.description || '',
      p.inStock ? 1 : 0, p.featured ? 1 : 0, p.gradeTier || 'Industrial Premium', p.imageUrl || '',
      id
    ]);

    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Quotes / RFQ CRUD
app.post('/api/quotes', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const q = req.body;
    const id = q.id || 'rfq-' + Date.now();
    const quoteNumber = q.quoteNumber || `RME-RFQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    db.run(`
      INSERT INTO quotes (
        id, quoteNumber, createdAt, buyerName, buyerCompany, buyerEmail, buyerPhone, buyerCountry,
        destinationPort, incoterm, items, subtotalUSD, freightCostUSD, insuranceCostUSD,
        inspectionFeeUSD, discountUSD, totalUSD, status, notes, paymentTerms,
        estimatedDeliveryWeeks, validUntil, assignedManager
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, quoteNumber, q.createdAt || new Date().toISOString(), q.buyerName, q.buyerCompany,
      q.buyerEmail, q.buyerPhone || '', q.buyerCountry || '', q.destinationPort || 'Nhava Sheva (FOB)',
      q.incoterm || 'FOB', JSON.stringify(q.items || []), q.subtotalUSD || 0, q.freightCostUSD || 0,
      q.insuranceCostUSD || 0, q.inspectionFeeUSD || 0, q.discountUSD || 0, q.totalUSD || 0,
      q.status || 'Pending', q.notes || '', q.paymentTerms || '30% T/T Advance, 70% against B/L copy',
      q.estimatedDeliveryWeeks || 3, q.validUntil || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      q.assignedManager || 'Sales Desk'
    ]);

    saveDatabaseToDisk();
    res.json({ success: true, id, quoteNumber });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/quotes/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const q = req.body;
    const id = req.params.id;

    // Fetch existing quote to fallback cleanly
    const existing = db.exec('SELECT * FROM quotes WHERE id = ?', [id]);
    let existingQuote: any = {};
    if (existing.length > 0 && existing[0].values.length > 0) {
      const cols = existing[0].columns;
      const row = existing[0].values[0];
      cols.forEach((col: string, idx: number) => {
        existingQuote[col] = row[idx];
      });
    }

    const status = q.status !== undefined ? q.status : (existingQuote.status || 'Pending');
    const items = q.items !== undefined ? JSON.stringify(q.items) : (existingQuote.items || '[]');
    const subtotalUSD = q.subtotalUSD !== undefined ? q.subtotalUSD : (existingQuote.subtotalUSD || 0);
    const freightCostUSD = q.freightCostUSD !== undefined ? q.freightCostUSD : (existingQuote.freightCostUSD || 0);
    const insuranceCostUSD = q.insuranceCostUSD !== undefined ? q.insuranceCostUSD : (existingQuote.insuranceCostUSD || 0);
    const discountUSD = q.discountUSD !== undefined ? q.discountUSD : (existingQuote.discountUSD || 0);
    const totalUSD = q.totalUSD !== undefined ? q.totalUSD : (existingQuote.totalUSD || 0);
    const notes = q.notes !== undefined ? q.notes : (existingQuote.notes || '');
    const paymentTerms = q.paymentTerms !== undefined ? q.paymentTerms : (existingQuote.paymentTerms || '');
    const estimatedDeliveryWeeks = q.estimatedDeliveryWeeks !== undefined ? q.estimatedDeliveryWeeks : (existingQuote.estimatedDeliveryWeeks || 3);
    const assignedManager = q.assignedManager !== undefined ? q.assignedManager : (existingQuote.assignedManager || 'Sales Desk');

    db.run(`
      UPDATE quotes SET
        status = ?, items = ?, subtotalUSD = ?, freightCostUSD = ?, insuranceCostUSD = ?, discountUSD = ?,
        totalUSD = ?, notes = ?, paymentTerms = ?, estimatedDeliveryWeeks = ?, assignedManager = ?
      WHERE id = ?
    `, [
      status, items, subtotalUSD, freightCostUSD, insuranceCostUSD, discountUSD,
      totalUSD, notes, paymentTerms, estimatedDeliveryWeeks, assignedManager, id
    ]);

    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/quotes/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    db.run('DELETE FROM quotes WHERE id = ?', [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Articles CRUD
app.post('/api/articles', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const a = req.body;
    const id = a.id || 'art-' + Date.now();
    const slug = a.slug || a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    db.run(`
      INSERT INTO articles (id, title, slug, excerpt, content, category, author, authorRole, date, readTime, status, tags, views)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, a.title, slug, a.excerpt, a.content, a.category, a.author, a.authorRole || 'Contributor',
      a.date || new Date().toISOString().split('T')[0], a.readTime || '4 min read',
      a.status || 'Pending Moderation', JSON.stringify(a.tags || []), 0
    ]);

    saveDatabaseToDisk();
    res.json({ success: true, id, slug });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/articles/:id', async (req: Request, res: Response) => {
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
      a.title, a.excerpt, a.content, a.category, a.author, a.authorRole,
      a.status, JSON.stringify(a.tags || []), id
    ]);

    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/articles/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    db.run('DELETE FROM articles WHERE id = ?', [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Inquiries / Leads
app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const inq = req.body;
    const id = inq.id || 'inq-' + Date.now();

    db.run(`
      INSERT INTO inquiries (id, fullName, email, phone, company, country, subject, message, productInterest, createdAt, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, inq.fullName, inq.email, inq.phone || '', inq.company || '', inq.country || '',
      inq.subject || 'Export Inquiry', inq.message, inq.productInterest || 'General',
      new Date().toISOString(), 'New'
    ]);

    saveDatabaseToDisk();
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Careers & Applications
app.post('/api/careers/apply', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const appData = req.body;
    const id = 'app-' + Date.now();

    db.run(`
      INSERT INTO job_applications (id, jobId, jobTitle, applicantName, email, phone, experienceYears, coverLetter, portfolioUrl, submittedAt, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, appData.jobId, appData.jobTitle, appData.applicantName, appData.email, appData.phone || '',
      appData.experienceYears || 0, appData.coverLetter || '', appData.portfolioUrl || '',
      new Date().toISOString(), 'Under Review'
    ]);

    saveDatabaseToDisk();
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/careers/applications/:id/status', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { status } = req.body;
    db.run('UPDATE job_applications SET status = ? WHERE id = ?', [status || 'Reviewed', req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Interactive Export Chat Assistance
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { message, senderName } = req.body;
    const userMsgId = 'msg-' + Date.now();

    // Store user message
    db.run(`
      INSERT INTO chat_messages (id, sender, senderName, text, timestamp, suggestedPrompts)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [userMsgId, 'user', senderName || 'International Buyer', message, new Date().toISOString(), '[]']);

    // Generate smart context-aware domain response
    const msgLower = (message || '').toLowerCase();
    let replyText = '';
    let suggestedPrompts: string[] = [];

    if (msgLower.includes('calorific') || msgLower.includes('energy') || msgLower.includes('kcal')) {
      replyText = 'Our biomass fuels span from 3,800 to 5,500 kcal/kg for agro-wood briquettes/pellets, and up to 7,500 - 8,000 kcal/kg for our premium Coconut Shell Smokeless Charcoal. All lots are tested in our accredited lab with Parr Bomb Calorimeters.';
      suggestedPrompts = ['View Technical Specifications table', 'Download Certificate of Analysis', 'Build custom RFQ quote'];
    } else if (msgLower.includes('freight') || msgLower.includes('port') || msgLower.includes('cif') || msgLower.includes('fob')) {
      replyText = 'We operate regular ocean freight contracts with major shipping lines from Nhava Sheva (JNPT), Cochin, Chennai, and Mundra ports. Standard container load is 20-25 MT per 20ft FCL and up to 28 MT for 40ft HC. We support CIF, FOB, CFR, and EXW terms.';
      suggestedPrompts = ['Open RFQ Calculator for Port of Jebel Ali', 'Calculate CIF Rotterdam price', 'Request breakbulk vessel quotation'];
    } else if (msgLower.includes('sample') || msgLower.includes('test') || msgLower.includes('trial')) {
      replyText = 'We dispatch 1kg - 5kg laboratory samples worldwide via DHL/FedEx Express with comprehensive Certificate of Analysis (COA), moisture verification, and ash fusion data. Please provide your corporate address and courier account.';
      suggestedPrompts = ['Submit Sample Request Form', 'Contact sales via WhatsApp', 'Check ISO 9001 and SGS certificates'];
    } else if (msgLower.includes('fbc') || msgLower.includes('boiler') || msgLower.includes('blend')) {
      replyText = 'Our Customized Biomass Blends are tailor-formulated for Fluidized Bed (FBC/AFBC/CFBC) and Stoker boilers. We adjust silica-to-potassium ratios to maintain ash fusion temperatures above 1,280°C, preventing bed sintering and clinker formation.';
      suggestedPrompts = ['Explore FBC Boiler Blends', 'Read technical whitepaper on bed agglomeration', 'Book technical engineering consultation'];
    } else if (msgLower.includes('carbon') || msgLower.includes('foundry') || msgLower.includes('activated')) {
      replyText = 'Richmount Exim exports over 25,000 MT annually of Coconut Charcoal Chips for cast iron automotive foundries, as well as steam-activated Powdered (PAC) and Granular (GAC) activated carbons with Iodine values up to 1,150 mg/g.';
      suggestedPrompts = ['View Foundry Grade Carbon specs', 'View PAC Sugar/Water Refining specs', 'Download ASTM compliance certificate'];
    } else {
      replyText = 'Thank you for reaching out to Richmount Exim (Richexim Group). Our export operations team is on standby to assist you with commercial proforma invoicing, customs tariff codes (HS Codes), container stuffing options, and bulk contract pricing. How can we direct your request?';
      suggestedPrompts = ['Configure Proforma RFQ', 'Explore all product categories', 'Connect directly on WhatsApp +91 8105233700'];
    }

    const replyMsgId = 'msg-' + (Date.now() + 1);
    db.run(`
      INSERT INTO chat_messages (id, sender, senderName, text, timestamp, suggestedPrompts)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [replyMsgId, 'agent', 'Richexim Logistics Desk', replyText, new Date(Date.now() + 500).toISOString(), JSON.stringify(suggestedPrompts)]);

    saveDatabaseToDisk();

    res.json({
      userMessage: { id: userMsgId, sender: 'user', text: message, timestamp: new Date().toISOString() },
      agentReply: { id: replyMsgId, sender: 'agent', senderName: 'Richexim Logistics Desk', text: replyText, timestamp: new Date().toISOString(), suggestedPrompts }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Database Management & Backup Snapshot APIs
app.post('/api/database/backup/create', async (req: Request, res: Response) => {
  try {
    saveDatabaseToDisk();
    const buffer = getDatabaseBuffer();
    const backupsDir = path.join(process.cwd(), 'data', 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }
    const filename = `richexim_backup_${Date.now()}.sqlite`;
    const filePath = path.join(backupsDir, filename);
    fs.writeFileSync(filePath, buffer);

    res.json({
      status: 'ok',
      message: 'Binary SQLite snapshot created successfully',
      backupFile: filename,
      sizeBytes: buffer.length,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[Backup Error]', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.get('/api/database/backup/download', async (req: Request, res: Response) => {
  try {
    saveDatabaseToDisk();
    const buffer = getDatabaseBuffer();
    res.setHeader('Content-Type', 'application/x-sqlite3');
    res.setHeader('Content-Disposition', `attachment; filename="richexim_db_${Date.now()}.sqlite"`);
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/database/stats', async (req: Request, res: Response) => {
  try {
    const stats = getDatabaseStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== VITE & PRODUCTION SETUP ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Richmount Exim] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
