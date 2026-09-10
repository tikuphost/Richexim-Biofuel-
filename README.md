# Richmount Exim • Enterprise B2B Export & Supply Chain Portal

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38bdf8.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-WASM_WAL-003B57.svg?style=flat-square&logo=sqlite)](https://sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

> Production-grade, full-stack digital export platform and commercial trade desk for **Richmount Exim (Richexim Group)**, facilitating global procurement of industrial biomass, green energy fuels, and activated carbon.

---

## 🌟 Executive Overview

Richmount Exim is an international trade house and bulk exporter specializing in renewable industrial solid fuels and environmental filtration media. This repository contains the complete enterprise web platform, featuring:

- **Commercial RFQ Engine & Proforma Underwriter**: Real-time freight calculations, Incoterms (FOB JNPT, CIF Global Ports), container stuffing math (20ft/40ft High-Cube FCL), and itemized tariff adjustments.
- **Dual-Persona Live Chat System**: Storefront prospect onboarding with immediate SLA routing, paired with an Admin Operations Desk equipped with thread management, quick macros, and buyer context dossiers.
- **Technical Assays & Specifications**: Calorific heating values (GCV/NCV in kcal/kg), proximate analysis (moisture, ash content, volatile matter, fixed carbon), and certified HS codes.
- **Centralized Dynamic SEO Management**: In-browser control panel for OpenGraph tags, page titles, canonical URLs, and social sharing metadata.
- **Embedded Persistent Storage**: Single-engine full-stack deployment using WASM-powered SQLite with Write-Ahead Logging (WAL) and disk synchronization.

---

## 🏗️ System Architecture

The application is structured as a unified full-stack service where an Express backend and a Vite-powered React 19 single-page application run cohesively on port `3000`.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       Richmount Exim Frontend (React 19)                │
├────────────────────────────────┬────────────────────────────────────────┤
│ Public Storefront              │ Executive Operations Suite             │
│ • Commodity Technical Matrix   │ • Commercial Quote Underwriter         │
│ • Interactive RFQ Calculator   │ • FOB Price Tariff Live Adjustments    │
│ • Floating Customer Chat Desk  │ • Tri-Pane Live Chat Operations Desk   │
│ • Global Currency Switcher     │ • Centralized Dynamic SEO Management   │
└────────────────────────────────┴────────────────────────────────────────┘
                                    │ (REST API & Hydration)
┌───────────────────────────────────▼─────────────────────────────────────┐
│                       Express 4.x Application Server                    │
├─────────────────────────────────────────────────────────────────────────┤
│ • Vite SPA Middleware (Development) / Static Asset Serving (Production) │
│ • Dual-Persona Chat Sessions API (`/api/chat/*`)                        │
│ • RFQ Pipeline & Underwriting Controller (`/api/quotes/*`)              │
│ • Product Catalog & Tariffs (`/api/products/*`)                         │
│ • SEO Metadata Persistence (`/api/seo/*`)                               │
│ • Atomic Disk Snapshot Generator (`/api/database/backup/*`)             │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────────┐
│             WASM SQLite Embedded Storage (`/data/richmount.sqlite`)     │
├─────────────────────────────────────────────────────────────────────────┤
│ • Products • Quotes • Chat Sessions • Chat Messages • Inquiries • SEO   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

### 1. Interactive RFQ Pipeline & Proforma Calculator
- Add items directly from the catalog (Wood Pellets, Coconut Briquettes, Palm Kernel Shells, Activated Carbon).
- Dynamic Incoterm pricing: **FOB JNPT / Nhava Sheva**, **CIF Rotterdam**, **CIF Hamburg**, **CIF Busan**, **CIF Tokyo**, **CIF Jebel Ali**.
- Automated tonnage container estimation (25 MT per 40ft High Cube container).
- Generates official commercial quotes ready for administrative underwriting and proforma PDF printing.

### 2. Dual-Persona Live Trade Desk
- **Customer Storefront Widget**: Unauthenticated visitor onboarding (Name, Corporate Email, Entity, Target Port) with an automated response SLA guarantee (~15 minutes).
- **Admin Operations Inbox**:
  - Searchable thread directory with filters (`All`, `Waiting Agent`, `Active`, `Resolved`).
  - Conversation stream with timestamps, system notices, and canned response macros (CIF turnaround, MOQ standards, laboratory COA dispatch, LC terms).
  - Buyer Context Dossier with verified buyer profile, assigned export officer, tag management, and private confidential staff notes.

### 3. Dynamic Technical Assays & Specification Matrix
- Comprehensive lab parameters for industrial biomass:
  - Gross Calorific Value (GCV): 4,200 – 7,200 kcal/kg
  - Moisture Content: < 8–10%
  - Ash Content: < 1.5–3.0%
  - Fixed Carbon & Volatile Matter ratios
  - Harmonized System (HS) Tariff codes

### 4. Executive Suite & Role Switching
- Role-based permissions switchable on the fly:
  - `Executive Director (Admin)`: Full tariff editing, proforma underwriting, database snapshots.
  - `Sales Manager`: Inquiry management and commercial proposal updates.
  - `Logistics Coordinator`: Freight estimates and container stuffing monitoring.
  - `Procurement Buyer`: Storefront pricing and RFQ submission.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) | Component architecture with hooks and concurrent rendering |
| **Language** | [TypeScript 5.8](https://www.typescriptlang.org/) | End-to-end type safety |
| **Build Tooling** | [Vite 6](https://vitejs.dev/) & [esbuild](https://esbuild.github.io/) | Fast HMR dev server & single-bundle production backend |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Modern utility-first styling with custom corporate theme |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent iconography across customer and admin views |
| **Animations** | [Motion](https://motion.dev/) | Smooth transitions, modal entries, and layout shifts |
| **Backend Server** | [Express 4](https://expressjs.com/) | RESTful API controllers and SPA routing |
| **Database** | [sql.js (SQLite WASM)](https://github.com/sql-js/sql.js) | In-memory relational engine with atomic filesystem persistence |

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or `v20.x` or newer
- **npm** (or `pnpm` / `bun`)

### 1. Clone the Repository
```bash
git clone https://github.com/richmount-exim/portal.git
cd portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a local `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Default configuration values:
```env
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000
```

### 4. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`**. Both the frontend SPA and backend API endpoints will be accessible immediately.

---

## 📦 Production Build & Deployment

To compile the production bundle:

```bash
npm run build
```

This single command:
1. Compiles and optimizes the React 19 frontend into static assets in `dist/`.
2. Bundles the Express TypeScript backend into a standalone CommonJS executable at `dist/server.cjs` via `esbuild`.

To start the production server:
```bash
npm run start
```

### Docker Deployment
You can package this application in a lightweight Docker container:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

---

## 📁 Directory Structure

```
.
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI pipeline for linting & building
├── data/
│   ├── .gitkeep                 # Preserves database directory
│   ├── richmount.sqlite         # SQLite database file (auto-generated)
│   └── backups/                 # Instant snapshot directory
├── public/                      # Public static assets & favicon
├── server/
│   └── db.ts                    # SQLite WASM database schema, seeding, and disk sync
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── LiveChatInbox.tsx       # Tri-pane admin live chat operations desk
│   │   │   └── SEOMetadataManagement.tsx # In-browser SEO manager
│   │   ├── AdminDashboard.tsx   # Executive Suite console & RFQ underwriter
│   │   ├── Header.tsx           # Global navigation & currency selector
│   │   ├── Footer.tsx           # Corporate footer with compliance & certificates
│   │   ├── Hero.tsx             # Interactive trade overview
│   │   ├── LiveChatWidget.tsx   # Customer storefront floating chat drawer
│   │   ├── ProductCatalog.tsx   # Commodity filter, technical assays & specs
│   │   ├── RFQDrawer.tsx        # Interactive Proforma Quote calculation drawer
│   │   └── modals/              # Product detail, cert view, quote preview modals
│   ├── context/
│   │   └── AppContext.tsx       # Global application state management
│   ├── types.ts                 # TypeScript interfaces and domain models
│   ├── utils/
│   │   └── seo.ts               # Document head synchronization utilities
│   ├── App.tsx                  # Root application view
│   ├── main.tsx                 # Client entry point
│   └── index.css                # Tailwind CSS root stylesheet
├── index.html                   # HTML template with SEO meta tags & typography
├── package.json                 # Project dependencies & build scripts
├── server.ts                    # Express API server & Vite middleware
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts               # Vite configuration with Tailwind CSS plugin
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/data/all` | Hydrates products, quotes, articles, chat threads, and telemetry |
| `POST` | `/api/quotes` | Submits a new customer RFQ for underwriting |
| `PUT` | `/api/quotes/:id` | Updates quote status and underwrites pricing |
| `GET` | `/api/chat/sessions` | Lists all chat sessions with unread counts and status |
| `POST` | `/api/chat/sessions` | Initiates a new storefront customer chat session |
| `GET` | `/api/chat/sessions/:id/messages` | Retrieves message history for a session |
| `POST` | `/api/chat/sessions/:id/messages` | Dispatches customer or agent messages |
| `PUT` | `/api/chat/sessions/:id` | Updates session status, priority, agent, or staff notes |
| `GET` | `/api/products` | Retrieves active commodity catalog |
| `POST` | `/api/products` | Creates a new commodity product |
| `PUT` | `/api/products/:id` | Updates product specifications and FOB tariff |
| `PUT` | `/api/seo/:pageKey` | Updates custom SEO metadata for a route |
| `POST` | `/api/database/backup/create` | Triggers a live NVMe snapshot backup of the database |

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and distribute for commercial and private purposes.
