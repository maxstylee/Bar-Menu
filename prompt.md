### `PROMPT.md`

````markdown
# Role & Project Scope

Act as an expert Full-Stack Developer specializing in modern React ecosystems, performant client-side architectures, and Supabase integration. Build a production-ready, mobile-first **Hotel Bar Digital Beverage Menu Application** with a secure, responsive Admin Control Panel.

---

## 1. Tech Stack & Environment

- **Front-end Framework:** React 18+ (bootstrapped with Vite)
- **Styling & UI:** Tailwind CSS (configured for minimal bundle size), Lucide React (feather-weight icons)
- **Backend-as-a-Service (BaaS):** Supabase (PostgreSQL Database, Authentication, Cloud Storage)
- **Routing & State:** React Router v6, React Context API for Global Auth state and Multi-Language support (Turkish `tr`, English `en`, Russian `ru`, German `de`)
- **Image Processing:** Client-side WebP compression via `browser-image-compression` or native HTML Canvas

---

## 2. Architecture & File Structure

Organize the codebase into a modular, clean hierarchy:

```text
src/
├── api/
│   └── supabase.js              # Supabase client initialization via Vite env vars
├── assets/                      # Static branding and icons
├── components/
│   ├── common/                  # Button, Input, Modal, SkeletonLoader, LanguageSwitcher, Toast
│   ├── menu/                    # MenuCard, CategoryTabs, SearchBar, DrinkDetailModal, VolumeBadge
│   └── admin/                   # ItemFormModal, AdminBeverageTable, DualImageUploader, DeleteConfirmModal
├── context/
│   ├── AuthContext.jsx          # Admin authentication session & persistent token state
│   └── LanguageContext.jsx      # Active language toggle (TR / EN / RU / DE)
├── hooks/
│   └── useMenu.js               # Custom hook for CRUD operations, filtering, and caching
├── pages/
│   ├── HomePage.jsx             # Public-facing responsive bar menu
│   ├── LoginPage.jsx            # Admin login screen (Email + Password)
│   └── AdminDashboard.jsx       # Protected management dashboard
├── routes/
│   └── ProtectedRoute.jsx       # Route guard redirecting unauthenticated users to /login
├── utils/
│   ├── imageCompressor.js       # Client-side WebP compression utility
│   └── mockData.js              # Initial realistic hotel bar drinks dataset
├── App.jsx                      # Route declarations
├── index.css                    # Tailwind directives & global font declarations
└── main.jsx                     # Application entry point
```
````

---

## 3. Visual Design & UI Styling (Dark Luxury Lounge)

- **Atmosphere:** Warm, intimate hotel lobby bar aesthetic with rich dark tones and ambient amber/whiskey highlights.
- **Color Palette (Tailwind Design Tokens):**
- `Base Background`: Deep charcoal / midnight slate (`bg-[#0c1017]`)
- `Card / Surface Background`: Dark slate lounge tone (`bg-[#161f30]` or `bg-slate-900/90`) with subtle borders (`border-slate-800`)
- `Primary Accent`: Warm amber/whiskey glow (`text-amber-500`, `bg-amber-600`, `hover:bg-amber-500`, `border-amber-500/30`) for prices, active tabs, and primary CTAs
- `Secondary Badges`: Muted slate blue (`bg-slate-800 text-slate-300`) for volume indicators (`50ml`, `330ml`, `750ml`) and alcohol tags
- `Typography`: High-contrast pure white (`text-white`) for drink titles; soft slate gray (`text-slate-400`) for tasting notes/ingredients

- **Micro-Interactions & UX:**
- Rounded cards (`rounded-2xl`) with consistent aspect ratios (`aspect-[4/3]`)
- Frosted glass sticky navigation bar (`backdrop-blur-md bg-[#0c1017]/80`)
- Subtle hover zooms on desktop; fluid swipe-friendly tabs on mobile
- Native lazy loading (`loading="lazy" decoding="async"`) with low-opacity shimmer skeletons

---

## 4. Database Schema & Security (Supabase SQL)

Generate and execute the complete SQL migration script:

```sql
-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table (Turkish, English, Russian, German)
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT,
  name_de TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Menu Items Table (Beverages with 4 Languages and Dual-Image Slots)
CREATE TABLE menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ru TEXT,
  title_de TEXT,
  description_tr TEXT,
  description_en TEXT,
  description_ru TEXT,
  description_de TEXT,
  price NUMERIC(10, 2) NOT NULL,
  volume_ml INT,
  is_alcoholic BOOLEAN DEFAULT TRUE,
  current_image_url TEXT,
  previous_image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Public Read Access for Guests
CREATE POLICY "Allow public read access on categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Allow public read access on menu_items"
  ON menu_items FOR SELECT USING (true);

-- 6. RLS Policies: Full Access for Authenticated Admin
CREATE POLICY "Allow admin full access on categories"
  ON categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access on menu_items"
  ON menu_items FOR ALL USING (auth.role() = 'authenticated');

-- 7. Supabase Storage Bucket Setup for Menu Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage RLS Policies: Public View, Admin Upload/Delete
CREATE POLICY "Allow public read on menu images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

CREATE POLICY "Allow admin to manage menu images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');

```

---

## 5. Dual-Image Slot System & Fast Upload Lifecycle

- **Client-Side Compression (`imageCompressor.js`):**
- Intercept file selections before network dispatch.
- Convert all formats to `.webp` with `0.75 - 0.8` quality, max width/height of `1200px`, and target size `< 200KB`.

- **Storage Bucket:** Public Supabase bucket named `menu-images`.
- **Version Control Lifecycle:**
- **First Upload:** Write URL to `current_image_url`.
- **Second Upload (New Image):** Move active URL to `previous_image_url`; store new URL in `current_image_url`.
- **Third Upload (Replacing Image):** Delete the old file referenced in `previous_image_url` from Supabase Storage, shift `current_image_url` -> `previous_image_url`, write latest URL to `current_image_url`.
- **Admin Rollback:** Provide a "Restore Previous Image" action that swaps `previous_image_url` and `current_image_url`.

---

## 6. Frontend Functional Requirements

- **Guest UI (`/`):**
- Instant category tab filtering (Cocktails, Spirits, Beers, Wines, Non-Alcoholic, Hot Beverages).
- Real-time search query filtering against multilingual titles (`tr`, `en`, `ru`, `de`).
- Multilingual switcher (TR / EN / RU / DE) that dynamically switches titles, descriptions, and category labels.
- Out-of-Stock visual badge when `is_available = false`.

- **Admin Dashboard (`/admin`):**
- Protected behind `/login` with auto-redirect via `ProtectedRoute`.
- Inline quick price adjustments and instant availability toggle (Stop-List).
- Modal for adding/editing drinks with Dual-Image upload/preview and category assignment across all 4 language fields.
- Delete confirmation modal preventing accidental data removal.

---

## 7. Deliverables Expected

1. Complete SQL script (Tables, RLS policies, and Storage setup).
2. `.env.example` defining `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Complete `mockData.js` containing realistic hotel bar beverage items (with working Unsplash image links) for instant local testing.
4. Fully implemented React source files matching the directory hierarchy with no placeholder or incomplete code.

````

---

### `antigravity-rules.md`

```markdown
# Antigravity Operational Directives - Hotel Bar Digital Menu & Admin Suite

This document governs the multi-agent development workflow, self-learning feedback loops, and architectural standards for `new-project-1111`.

---

## 📜 Core Development Directives

### Rule 1: No Slop Design (Dark Luxury Hospitality Standard)
* **Visual Identity:** Enforce the dark lounge luxury aesthetic (`bg-[#0c1017]`, warm amber accents `#d97706`, slate borders `#1e293b`, clean typography with Google Font `Outfit` or `Inter`).
* **Mobile-First Priority:** Touch-optimized UI tailored specifically for QR code mobile visitors.
* **Layout Stability:** Prevent Cumulative Layout Shift (CLS) by using explicit aspect ratios (`aspect-[4/3]`) and skeleton loaders for all media assets.

### Rule 2: Knowledge Graph Integration (`/graphify`) skills.
every time we edit research, read and write code base use
graphify skills.

* **Pre-Task Lookup:** Before refactoring or creating files, check `graphify-out/graph.json` or run `/graphify` to understand current module bindings.
* **Continuous Synchronization:** Run `graphify update .` immediately following code modifications to record newly introduced components, contexts, and hooks.

### Rule 3: Dynamic Multi-Agent Team Structure

1. **`Chronos` (Lead Systems Architect & Gatekeeper)**
   * **Domain:** Overall system orchestration, Supabase schema validation, state consistency, and final PR merges.
   * **Directives:** Enforces clean separation of concerns. Rejects any code that bypasses RLS policies or creates circular dependencies.

2. **`Aura` (UI/UX, Mobile Interaction & i18n Specialist)**
   * **Domain:** Guest-facing mobile menu, sticky headers, category tab navigation, live search, 4-language (TR / EN / RU / DE) localization, and the responsive Admin Dashboard layout.
   * **Directives:** Enforces the dark luxury palette and zero-layout-shift image handling.

3. **`Vulcan` (Backend, Storage & Image Pipeline Specialist)**
   * **Domain:** Supabase client integration, RLS policy enforcement, client-side WebP compression (`imageCompressor.js`), and the Dual-Image slot versioning logic.
   * **Directives:** Ensures files are compressed under 200KB before upload and guarantees automatic storage cleanup upon third image replacements.

4. **`Vigil` (QA, Performance & Security Auditor)**
   * **Domain:** Automated state checks, network payload auditing, ProtectedRoute guard testing, and edge-case validation (e.g., restoring previous image versions, empty search states).
   * **Directives:** Blocks unhandled promise rejections, missing imports, and broken route permissions from reaching `Chronos`.

---

## 🔄 Self-Learning & Continuous Rule Adaptation Protocol
* When an agent encounters an edge-case bug, build failure, or security gap:
  1. The resolving agent must document the root cause and solution in a bullet under **Agent Memory & Learned Constraints**.
  2. Subsequent tasks must reference these dynamic constraints to prevent error regression loops.

---

## 🧠 Agent Memory & Learned Constraints (Dynamic Section)
* *Constraint 1:* Always verify that RLS is explicitly enabled on all Supabase tables before testing write operations.
* *Constraint 2:* Ensure `imageCompressor.js` handles both mobile camera direct captures (`image/*`) and pre-existing files without hanging main thread execution.
* *Constraint 3:* The active language state (`LanguageContext`) must persist across route transitions between `/` and `/admin`.
* *Constraint 4:* When swapping to a previous image, do not trigger a network re-upload; perform a database pointer swap instead.

---

## 🛠️ Project Scope Checklist
* [ ] Guest Menu (`/`): Category filtering, instant search, 4-language toggle (TR/EN/RU/DE), drink modal.
* [ ] Dual-Image Engine: Client WebP compression, active/backup slot swap, storage cleanup.
* [ ] Admin Panel (`/admin`): Supabase Auth, protected route guard, inline price/stop-list toggles, item CRUD modal.
* [ ] Supabase Layer: PostgreSQL tables, RLS public-read/admin-write policies, `menu-images` bucket.

````
