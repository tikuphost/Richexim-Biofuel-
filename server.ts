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

// Helper to query and map columns to objects across endpoints
function executeQuery(db: any, sql: string): any[] {
  const res = db.exec(sql);
  if (!res || res.length === 0) return [];
  const columns = res[0].columns;
  return res[0].values.map((row: any[]) => {
    const obj: Record<string, any> = {};
    columns.forEach((col: string, i: number) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

// Hydrated Full App State (Zero-flicker architecture)
app.get('/api/data/all', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();

    // Helper to query and map columns to objects
    const queryAll = (sql: string) => executeQuery(db, sql);

    const categoriesRaw = queryAll('SELECT * FROM categories ORDER BY name ASC');
    const productsRaw = queryAll('SELECT * FROM products ORDER BY name ASC');
    const quotesRaw = queryAll('SELECT * FROM quotes ORDER BY createdAt DESC');
    const certsRaw = queryAll('SELECT * FROM certifications ORDER BY name ASC');
    const articlesRaw = queryAll('SELECT * FROM articles ORDER BY date DESC');
    const careersRaw = queryAll('SELECT * FROM careers ORDER BY title ASC');
    const inquiriesRaw = queryAll('SELECT * FROM inquiries ORDER BY createdAt DESC');
    const applicationsRaw = queryAll('SELECT * FROM job_applications ORDER BY submittedAt DESC');
    const chatRaw = queryAll('SELECT * FROM chat_messages ORDER BY timestamp ASC');
    const chatSessionsRaw = queryAll('SELECT * FROM chat_sessions ORDER BY lastMessageTime DESC');
    const seoRaw = queryAll('SELECT * FROM seo_metadata');
    const faqsRaw = queryAll('SELECT * FROM faqs ORDER BY id ASC');
    const siteContentRaw = queryAll('SELECT * FROM site_content');

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
      suggestedPrompts: typeof m.suggestedPrompts === 'string' ? JSON.parse(m.suggestedPrompts || '[]') : m.suggestedPrompts,
      attachments: typeof m.attachments === 'string' ? JSON.parse(m.attachments || '[]') : (m.attachments || [])
    }));

    const chatSessions = chatSessionsRaw.map((s) => ({
      ...s,
      tags: typeof s.tags === 'string' ? JSON.parse(s.tags || '[]') : (s.tags || [])
    }));

    const seoMetadata: Record<string, any> = {};
    seoRaw.forEach((row: any) => {
      seoMetadata[row.pageKey] = row;
    });

    const faqs = faqsRaw.map((f) => ({
      ...f,
      tags: typeof f.tags === 'string' ? JSON.parse(f.tags || '[]') : (f.tags || [])
    }));

    const siteContent: Record<string, any> = {};
    siteContentRaw.forEach((row: any) => {
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

app.put('/api/inquiries/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { status } = req.body;
    db.run('UPDATE inquiries SET status = ? WHERE id = ?', [status || 'Contacted', req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/inquiries/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    db.run('DELETE FROM inquiries WHERE id = ?', [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Certifications CRUD
app.post('/api/certifications', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const c = req.body;
    const id = c.id || 'cert-' + Date.now();
    db.run(`
      INSERT INTO certifications (id, name, issuer, code, issueDate, validUntil, accreditedBody, category, description, badgeCode, documentNumber)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, c.name, c.issuer || '', c.code || '', c.issueDate || '', c.validUntil || '',
      c.accreditedBody || '', c.category || 'Quality', c.description || '', c.badgeCode || '', c.documentNumber || ''
    ]);
    saveDatabaseToDisk();
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/certifications/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const c = req.body;
    db.run(`
      UPDATE certifications SET
        name = ?, issuer = ?, code = ?, issueDate = ?, validUntil = ?,
        accreditedBody = ?, category = ?, description = ?, badgeCode = ?, documentNumber = ?
      WHERE id = ?
    `, [
      c.name, c.issuer || '', c.code || '', c.issueDate || '', c.validUntil || '',
      c.accreditedBody || '', c.category || 'Quality', c.description || '', c.badgeCode || '', c.documentNumber || '',
      req.params.id
    ]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/certifications/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    db.run('DELETE FROM certifications WHERE id = ?', [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Careers Postings CRUD
app.post('/api/careers', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const c = req.body;
    const id = c.id || 'job-' + Date.now();
    db.run(`
      INSERT INTO careers (id, title, department, location, type, experience, description, requirements, responsibilities, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, c.title, c.department || 'International Trade', c.location || 'Mumbai / Hybrid',
      c.type || 'Full-time', c.experience || '2 - 5 Years', c.description || '',
      JSON.stringify(c.requirements || []), JSON.stringify(c.responsibilities || []),
      c.active !== undefined ? (c.active ? 1 : 0) : 1
    ]);
    saveDatabaseToDisk();
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/careers/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const c = req.body;
    db.run(`
      UPDATE careers SET
        title = ?, department = ?, location = ?, type = ?, experience = ?,
        description = ?, requirements = ?, responsibilities = ?, active = ?
      WHERE id = ?
    `, [
      c.title, c.department, c.location, c.type, c.experience,
      c.description, JSON.stringify(c.requirements || []), JSON.stringify(c.responsibilities || []),
      c.active ? 1 : 0, req.params.id
    ]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/careers/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    db.run('DELETE FROM careers WHERE id = ?', [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// FAQs CRUD
app.get('/api/faqs', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const rows = executeQuery(db, 'SELECT * FROM faqs ORDER BY id ASC');
    const parsed = rows.map((r: any) => ({
      ...r,
      tags: typeof r.tags === 'string' ? JSON.parse(r.tags || '[]') : (r.tags || [])
    }));
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/faqs', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const f = req.body;
    const id = f.id || 'faq-' + Date.now();
    db.run(`
      INSERT INTO faqs (id, category, question, answer, tags)
      VALUES (?, ?, ?, ?, ?)
    `, [
      id, f.category || 'General', f.question, f.answer,
      JSON.stringify(f.tags || [])
    ]);
    saveDatabaseToDisk();
    res.json({ success: true, id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/faqs/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const f = req.body;
    db.run(`
      UPDATE faqs SET
        category = ?, question = ?, answer = ?, tags = ?
      WHERE id = ?
    `, [
      f.category, f.question, f.answer,
      JSON.stringify(f.tags || []), req.params.id
    ]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/faqs/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    db.run('DELETE FROM faqs WHERE id = ?', [req.params.id]);
    saveDatabaseToDisk();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Site Content / Homepage & Global Settings CRUD
app.get('/api/site-content', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const rows = executeQuery(db, 'SELECT * FROM site_content');
    const result: Record<string, any> = {};
    rows.forEach((r: any) => {
      try {
        result[r.key] = JSON.parse(r.value);
      } catch {
        result[r.key] = r.value;
      }
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/site-content/:key', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const key = req.params.key;
    const valueStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    db.run('INSERT OR REPLACE INTO site_content (key, value) VALUES (?, ?)', [key, valueStr]);
    saveDatabaseToDisk();
    res.json({ success: true, key });
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

// ==================== DUAL-PERSONA ASYNCHRONOUS CHAT REST API ====================

// 1. List all Chat Sessions (for Admin Inbox)
app.get('/api/chat/sessions', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const result = db.exec('SELECT * FROM chat_sessions ORDER BY lastMessageTime DESC');
    if (result.length === 0) {
      return res.json([]);
    }
    const cols = result[0].columns;
    const sessions = result[0].values.map((row) => {
      const s: any = {};
      cols.forEach((col, idx) => { s[col] = row[idx]; });
      s.tags = typeof s.tags === 'string' ? JSON.parse(s.tags || '[]') : (s.tags || []);
      return s;
    });
    res.json(sessions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Create or Initialize Chat Session (Storefront customer initiation)
app.post('/api/chat/sessions', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const { contactIdentifier, customerName, customerEmail, customerCompany, customerCountry, initialMessage, tags } = req.body;
    
    // Check if session exists for this contactIdentifier
    let sessionId = 'sess-' + Date.now();
    let existingSession: any = null;

    if (contactIdentifier) {
      const checkRes = db.exec(`SELECT * FROM chat_sessions WHERE contactIdentifier = ? LIMIT 1`);
      // sql.js exec with params via statement
      const stmt = db.prepare('SELECT * FROM chat_sessions WHERE contactIdentifier = ?');
      stmt.bind([contactIdentifier]);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        existingSession = {
          ...row,
          tags: typeof row.tags === 'string' ? JSON.parse(row.tags as string || '[]') : []
        };
        sessionId = row.id as string;
      }
      stmt.free();
    }

    const now = new Date().toISOString();

    if (!existingSession) {
      const assignedAgent = 'Sarah Jenkins (Senior Trade Desk)';
      const initialStatus = 'waiting_agent';
      const initialPriority = 'normal';
      const parsedTags = JSON.stringify(tags || ['Storefront Inquiry', customerCompany || 'Direct Buyer']);
      const lastText = initialMessage || 'Chat session initiated';

      db.run(`
        INSERT INTO chat_sessions (id, contactIdentifier, customerName, customerEmail, customerCompany, customerCountry, status, priority, tags, adminNotes, assignedAgent, lastMessageText, lastMessageTime, unreadAdminCount, unreadCustomerCount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        sessionId,
        contactIdentifier || customerEmail || `anon-${Date.now()}`,
        customerName || 'Anonymous Buyer',
        customerEmail || '',
        customerCompany || 'Commercial Prospect',
        customerCountry || 'International',
        initialStatus,
        initialPriority,
        parsedTags,
        'Session initiated from storefront chat widget.',
        assignedAgent,
        lastText,
        now,
        initialMessage ? 1 : 0,
        0
      ]);

      if (initialMessage) {
        const msgId = 'msg-' + Date.now();
        db.run(`
          INSERT INTO chat_messages (id, sessionId, sender, senderName, senderAvatar, message, text, timestamp, read, attachments)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          msgId,
          sessionId,
          'customer',
          customerName || 'Customer',
          (customerName || 'CU').slice(0, 2).toUpperCase(),
          initialMessage,
          initialMessage,
          now,
          0,
          JSON.stringify([])
        ]);

        // Auto SLA Welcome Response
        const slaReplyId = 'msg-' + (Date.now() + 10);
        const slaText = 'Hello ' + (customerName || '') + '! Thank you for connecting with Richmount Exim (Richexim Group). Our international trade desk has logged your inquiry for ' + (customerCompany ? customerCompany + ' ' : '') + 'and typically responds within 15 minutes during port business hours (09:00 - 18:00 IST).';
        db.run(`
          INSERT INTO chat_messages (id, sessionId, sender, senderName, senderAvatar, message, text, timestamp, read, attachments)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          slaReplyId,
          sessionId,
          'system',
          'Richmount Export Desk (Auto-SLA)',
          'RX',
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
        tags: tags || ['Storefront Inquiry'],
        lastMessageText: lastText,
        lastMessageTime: now,
        unreadAdminCount: 1,
        unreadCustomerCount: 0
      });
    } else {
      // Session exists, if initialMessage provided, add it
      if (initialMessage) {
        const msgId = 'msg-' + Date.now();
        db.run(`
          INSERT INTO chat_messages (id, sessionId, sender, senderName, senderAvatar, message, text, timestamp, read, attachments)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          msgId,
          sessionId,
          'customer',
          customerName || existingSession.customerName || 'Customer',
          (customerName || existingSession.customerName || 'CU').slice(0, 2).toUpperCase(),
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
  } catch (err: any) {
    console.error('[API /api/chat/sessions POST Error]', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Messages for a specific Session
app.get('/api/chat/sessions/:id/messages', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const sessionId = req.params.id;
    const stmt = db.prepare('SELECT * FROM chat_messages WHERE sessionId = ? ORDER BY timestamp ASC');
    stmt.bind([sessionId]);
    const messages: any[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      messages.push({
        ...row,
        attachments: typeof row.attachments === 'string' ? JSON.parse(row.attachments as string || '[]') : [],
        suggestedPrompts: typeof row.suggestedPrompts === 'string' ? JSON.parse(row.suggestedPrompts as string || '[]') : []
      });
    }
    stmt.free();
    res.json(messages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Send Message into Session (Dual-Persona: Customer or Admin Agent)
app.post('/api/chat/sessions/:id/messages', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const sessionId = req.params.id;
    const { sender, senderName, senderAvatar, message, attachments } = req.body;
    const msgId = 'msg-' + Date.now();
    const now = new Date().toISOString();

    const cleanSender = sender === 'agent' ? 'agent' : sender === 'system' ? 'system' : 'customer';
    const cleanAvatar = senderAvatar || (cleanSender === 'agent' ? 'RX' : cleanSender === 'system' ? 'SYS' : 'CU');

    db.run(`
      INSERT INTO chat_messages (id, sessionId, sender, senderName, senderAvatar, message, text, timestamp, read, attachments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      msgId,
      sessionId,
      cleanSender,
      senderName || (cleanSender === 'agent' ? 'Richmount Trade Agent' : 'Customer'),
      cleanAvatar,
      message,
      message,
      now,
      0,
      JSON.stringify(attachments || [])
    ]);

    // Update Session
    if (cleanSender === 'agent') {
      db.run(`
        UPDATE chat_sessions SET
          lastMessageText = ?,
          lastMessageTime = ?,
          status = 'active',
          unreadAdminCount = 0,
          unreadCustomerCount = unreadCustomerCount + 1
        WHERE id = ?
      `, [message, now, sessionId]);
    } else if (cleanSender === 'customer') {
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
      senderName: senderName || (cleanSender === 'agent' ? 'Richmount Trade Agent' : 'Customer'),
      senderAvatar: cleanAvatar,
      message,
      text: message,
      timestamp: now,
      read: 0,
      attachments: attachments || []
    };

    res.json({ success: true, message: createdMsg });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Update Session Metadata (status, priority, adminNotes, assignedAgent, tags, markRead)
app.put('/api/chat/sessions/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const sessionId = req.params.id;
    const { status, priority, adminNotes, assignedAgent, tags, markRead } = req.body;

    if (markRead === 'admin') {
      db.run(`UPDATE chat_sessions SET unreadAdminCount = 0 WHERE id = ?`, [sessionId]);
      db.run(`UPDATE chat_messages SET read = 1 WHERE sessionId = ? AND sender = 'customer'`, [sessionId]);
    } else if (markRead === 'customer') {
      db.run(`UPDATE chat_sessions SET unreadCustomerCount = 0 WHERE id = ?`, [sessionId]);
      db.run(`UPDATE chat_messages SET read = 1 WHERE sessionId = ? AND sender != 'customer'`, [sessionId]);
    }

    if (status) {
      db.run(`UPDATE chat_sessions SET status = ? WHERE id = ?`, [status, sessionId]);
    }
    if (priority) {
      db.run(`UPDATE chat_sessions SET priority = ? WHERE id = ?`, [priority, sessionId]);
    }
    if (adminNotes !== undefined) {
      db.run(`UPDATE chat_sessions SET adminNotes = ? WHERE id = ?`, [adminNotes, sessionId]);
    }
    if (assignedAgent) {
      db.run(`UPDATE chat_sessions SET assignedAgent = ? WHERE id = ?`, [assignedAgent, sessionId]);
    }
    if (tags) {
      db.run(`UPDATE chat_sessions SET tags = ? WHERE id = ?`, [JSON.stringify(tags), sessionId]);
    }

    saveDatabaseToDisk();

    // Return updated session
    const stmt = db.prepare('SELECT * FROM chat_sessions WHERE id = ?');
    stmt.bind([sessionId]);
    let updatedSession = null;
    if (stmt.step()) {
      const row = stmt.getAsObject();
      updatedSession = {
        ...row,
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags as string || '[]') : []
      };
    }
    stmt.free();

    res.json({ success: true, session: updatedSession });
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
