# Graph Report - Tui Blue  (2026-10-07)

## Corpus Check
- 48 files · ~69,537 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 202 nodes · 391 edges · 15 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dc625573`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- LanguageContext.jsx
- devDependencies
- useLanguage
- category_scroll.test.js
- useMenu.js
- dependencies
- prompt.md
- 🍸 TUI BLUE — Luxury Bar Menu & Admin Control Suite
- App.jsx
- HomePage.jsx

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 31 edges
2. `useMenu()` - 12 edges
3. `Button()` - 9 edges
4. `useAuth()` - 9 edges
5. `resolveAssetUrl()` - 9 edges
6. `formatItemPrice()` - 8 edges
7. `🍸 TUI BLUE — Luxury Bar Menu & Admin Control Suite` - 7 edges
8. `Modal()` - 6 edges
9. `AdminDashboard()` - 6 edges
10. `HomePage()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `AdminBeverageTable()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/admin/AdminBeverageTable.jsx → src/context/LanguageContext.jsx
- `DualImageUploader()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/admin/DualImageUploader.jsx → src/context/LanguageContext.jsx
- `CategoryTabs()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/menu/CategoryTabs.jsx → src/context/LanguageContext.jsx
- `DrinkDetailModal()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/menu/DrinkDetailModal.jsx → src/context/LanguageContext.jsx
- `FilterPills()` --calls--> `useLanguage()`  [EXTRACTED]
  src/components/menu/FilterPills.jsx → src/context/LanguageContext.jsx

## Import Cycles
- None detected.

## Communities (15 total, 0 thin omitted)

### Community 0 - "LanguageContext.jsx"
Cohesion: 0.21
Nodes (11): AdminBeverageTable(), Badge(), VolumeBadge(), DrinkDetailModal(), DrinkBadge(), MenuCard(), LanguageContext, resolveAssetUrl() (+3 more)

### Community 1 - "devDependencies"
Cohesion: 0.08
Nodes (24): autoprefixer, devDependencies, autoprefixer, postcss, tailwindcss, @types/react, @types/react-dom, vite (+16 more)

### Community 2 - "useLanguage"
Cohesion: 0.18
Nodes (17): CategoryManagerModal(), ICON_OPTIONS, DeleteConfirmModal(), ItemFormModal(), QuickEditPriceModal(), Button(), Input, LanguageSwitcher() (+9 more)

### Community 3 - "category_scroll.test.js"
Cohesion: 0.12
Nodes (18): arr(), __dirname, lines, outDir, outFile, q(), __dirname, IMAGE_MAP (+10 more)

### Community 4 - "useMenu.js"
Cohesion: 0.25
Nodes (13): deleteImageFromStorage(), getLocalCategories(), getLocalMenuItems(), isSupabaseConfigured, saveLocalCategories(), saveLocalMenuItems(), supabase, uploadImageToStorage() (+5 more)

### Community 5 - "dependencies"
Cohesion: 0.13
Nodes (15): clsx, lucide-react, dependencies, clsx, lucide-react, react, react-dom, react-router-dom (+7 more)

### Community 6 - "prompt.md"
Cohesion: 0.13
Nodes (14): 3. Visual Design & UI Styling (Dark Luxury Lounge), 4. Database Schema & Security (Supabase SQL), 5. Dual-Image Slot System & Fast Upload Lifecycle, 6. Frontend Functional Requirements, 7. Deliverables Expected, 🧠 Agent Memory & Learned Constraints (Dynamic Section), Antigravity Operational Directives - Hotel Bar Digital Menu & Admin Suite, 📜 Core Development Directives (+6 more)

### Community 7 - "🍸 TUI BLUE — Luxury Bar Menu & Admin Control Suite"
Cohesion: 0.13
Nodes (14): 1. Prerequisites, 2. Installation, 3. Run Local Dev Server, 4. Run Automated Sentinel Test Suite, 5. Production Build, 🛡️ Admin Management Suite, 🛠️ Architecture & Tech Stack, 🗄️ Database Setup (Supabase Integration) (+6 more)

### Community 8 - "App.jsx"
Cohesion: 0.24
Nodes (8): App(), AuthProvider(), useAuth(), LanguageProvider(), ToastContext, ToastProvider(), HomePage(), ProtectedRoute()

### Community 9 - "HomePage.jsx"
Cohesion: 0.14
Nodes (9): CategoryIconRenderer(), TuiLogo(), WeatherBadge(), WeatherHeaderWidget(), ANTALYA, FALLBACK, interpretWeatherCode(), useWeather() (+1 more)

## Knowledge Gaps
- **65 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useLanguage()` connect `useLanguage` to `LanguageContext.jsx`, `HomePage.jsx`, `useMenu.js`, `App.jsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `devDependencies`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `category_scroll.test.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11857707509881422 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `prompt.md` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._