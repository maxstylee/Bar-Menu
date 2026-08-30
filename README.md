# 🍸 TUI BLUE — Luxury Bar Menu & Admin Control Suite

[![React 18](https://img.shields.io/badge/React-18.3.1-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.14-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](#license)

A state-of-the-art, responsive beverage menu and real-time administration portal designed specifically for hotel bars and lounges (**TUI BLUE**). Crafted with a dark lounge aesthetic, zero-latency client-side optimizations, 4-language i18n support, and flexible item-level single currency pricing (Turkish Lira ₺ or US Dollars $).

---

## ✨ Key Features & Capabilities

### 🍹 Guest Lounge Experience
* **Dark Luxury Aesthetic:** Immersive `#0c1017` dark lounge theme with warm amber accents, glassmorphic card containers, and smooth micro-interactions.
* **Configurable Item Currency (TRY ₺ / USD $):** Displays the exact single price and currency configured by the Admin for each item (e.g., `₺250` or `$16.00`).
* **4-Language i18n Engine:** Native instant switching between **Turkish (TR)**, **English (EN)**, **Russian (RU)**, and **German (DE)** without page reloads.
* **Instant Multilingual Search & Filtering:** Filter by Category (*Signature Cocktails, Single Malts, Craft Beers, Mocktails, Hot Teas/Coffees*), Alcoholic vs. Non-Alcoholic, or instant search across titles, tasting notes, and tags in all 4 languages.
* **Interactive Beverage Detail Modals:** Displays ABV content, liquid volume (ml), tasting profile notes, and dietary tags.
* **Zero CLS & Optimized Layout:** Pre-computed 4:3 aspect ratio image containers prevent layout shifts during image loading.

### 🛡️ Admin Management Suite
* **Inline Quick Price & Currency Adjuster:** Single-click price and currency (`TRY` or `USD`) updates directly from the table.
* **Instant Stop-List (Availability Toggle):** Mark any beverage out of stock with 1-click; updates the guest menu immediately.
* **Dual-Slot Image Management & Rollback:**
  * **Automatic Client-Side Compression:** Images uploaded by staff are compressed to ultra-fast `<200KB` payloads before storage.
  * **Prominent Centered Active Preview:** Displays the live guest image in a dedicated hero container.
  * **Instant Rollback:** Keeps the previous image in a backup slot for 1-click instant rollback without re-uploading.
* **Mobile-Optimized Responsive Header:** Compact header layout preventing horizontal scrolling or overflow on mobile devices.
* **Hybrid Data Layer:** Works seamlessly online with Supabase BaaS PostgreSQL, or falls back to an offline local dataset when offline.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (Hooks, Context API) | Fast declarative component lifecycle |
| **Bundler & Dev Server** | Vite 5 | HMR, production minification, asset bundling |
| **Styling & Theme** | Vanilla Tailwind CSS | Custom dark lounge tokens, glassmorphism, responsive grid |
| **Database & Auth** | Supabase (PostgreSQL & Storage) | Row Level Security (RLS), real-time menu synchronization |
| **Image Compression** | HTML5 Canvas API | Client-side image scaling to max 1200px and <200KB payload |
| **Icons & Typography** | Lucide React, Google Fonts | `Outfit` & `Inter` luxury typography |

---

## 📁 Repository Structure

```
Tui Blue/
├── public/
│   └── logo.svg                 # Static fallback brand logo
├── src/
│   ├── api/
│   │   └── supabase.js          # Supabase client & offline LocalStorage fallback
│   ├── assets/
│   │   └── logo.svg             # Bundled SVG brand logo
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminBeverageTable.jsx   # Interactive management table
│   │   │   ├── DeleteConfirmModal.jsx   # Deletion safety modal
│   │   │   ├── DualImageUploader.jsx    # Dual-slot image engine & uploader
│   │   │   ├── ItemFormModal.jsx        # Single-currency & 4-language add/edit modal
│   │   │   └── QuickEditPriceModal.jsx  # Inline price & currency editor
│   │   ├── common/
│   │   │   ├── Badge.jsx                # Volume & status badges
│   │   │   ├── Button.jsx               # Reusable styled buttons
│   │   │   ├── Input.jsx                # Input fields with icons
│   │   │   ├── LanguageSwitcher.jsx     # Clean single-label language selector
│   │   │   ├── Modal.jsx                # Glassmorphic modal shell
│   │   │   └── SkeletonLoader.jsx       # Shimmer loading grid
│   │   └── menu/
│   │       ├── CategoryTabs.jsx         # Horizontal category tab navigation
│   │       ├── DrinkDetailModal.jsx     # Detailed tasting note modal
│   │       ├── FilterPills.jsx          # Alcoholic / Non-Alcoholic pills
│   │       ├── MenuCard.jsx             # Beverage card
│   │       └── SearchBar.jsx            # Real-time search input
│   ├── context/
│   │   ├── AuthContext.jsx          # Admin authentication & demo admin mode
│   │   ├── LanguageContext.jsx      # i18n translation context
│   │   └── ToastContext.jsx         # Toast alert notifications
│   ├── hooks/
│   │   └── useMenu.js               # Menu CRUD, filtering & image versioning hook
│   ├── pages/
│   │   ├── AdminDashboard.jsx       # Main admin management suite
│   │   ├── HomePage.jsx             # Public guest bar menu
│   │   └── LoginPage.jsx            # Admin sign-in screen
│   ├── routes/
│   │   └── ProtectedRoute.jsx       # Auth route guard
│   ├── tests/
│   │   └── sentinel.test.js         # Automated Sentinel test suite
│   ├── utils/
│   │   ├── imageCompressor.js       # Client-side image canvas compressor
│   │   ├── mockData.js              # Initial realistic hotel bar dataset
│   │   └── translations.js          # 4-Language dictionaries & price formatter
│   ├── App.jsx                      # App router configuration
│   ├── index.css                    # Tailwind CSS base styles & scrollbar setup
│   └── main.jsx                     # React DOM root entry
├── index.html                       # HTML5 shell & fonts
├── schema.sql                       # PostgreSQL database migration & RLS policies
├── tailwind.config.js               # Design tokens & color palette
└── vite.config.js                   # Vite configuration (Base path: /Bar-Menu/)
```

---

## ⚡ Quick Start & Development

### 1. Prerequisites
- **Node.js** v18+ and `npm`

### 2. Installation
```bash
git clone https://github.com/maxstylee/Bar-Menu.git
cd Bar-Menu
npm install
```

### 3. Run Local Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run Automated Sentinel Test Suite
```bash
npm run test
```

### 5. Production Build
```bash
npm run build
```

---

## 🗄️ Database Setup (Supabase Integration)

To connect your live PostgreSQL database on Supabase:

1. Copy `.env.example` to `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Run the SQL script located in [`schema.sql`](file:///c:/Users/TuF/Desktop/Work%20Space/Tui%20Blue/schema.sql) inside your Supabase SQL Editor. This will create the `categories` and `menu_items` tables, set up Row Level Security (RLS), and initialize the `menu-images` storage bucket.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
