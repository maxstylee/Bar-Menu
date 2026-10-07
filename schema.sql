-- ============================================================================
-- TUI BLUE - HOTEL BAR BEVERAGE MENU & ADMIN CONTROL SUITE
-- SUPABASE POSTGRESQL MIGRATION, RLS POLICIES & REALTIME
-- Run this first, then run supabase/seed.sql (generated via `npm run db:seed`).
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table (Turkish, English, Russian, German)
--    Uses readable slug IDs ('cocktails', 'tea-coffee', ...) so routes stay stable.
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT ('cat-' || substr(md5(random()::text), 1, 8)),
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT,
  name_de TEXT,
  icon TEXT DEFAULT 'Wine',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Menu Items Table (Beverages with 4 Languages, Configurable Currency EUR/TRY/USD, and Dual-Image Slots)
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
  subcategory TEXT,
  title_tr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_ru TEXT,
  title_de TEXT,
  description_tr TEXT,
  description_en TEXT,
  description_ru TEXT,
  description_de TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'EUR',
  volume_ml INT,
  abv NUMERIC(4, 1) DEFAULT 0.0,
  is_alcoholic BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_signature BOOLEAN DEFAULT FALSE,
  is_extra BOOLEAN DEFAULT FALSE,
  current_image_url TEXT,
  previous_image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  tags TEXT[] DEFAULT '{}',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS menu_items_category_idx ON menu_items (category_id, sort_order);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Public Read Access for Guests (Anonymous & Authenticated)
DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
CREATE POLICY "Allow public read access on categories"
  ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on menu_items" ON menu_items;
CREATE POLICY "Allow public read access on menu_items"
  ON menu_items FOR SELECT USING (true);

-- 6. RLS Policies: Full Access for Authenticated Admin
DROP POLICY IF EXISTS "Allow admin full access on categories" ON categories;
CREATE POLICY "Allow admin full access on categories"
  ON categories FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow admin full access on menu_items" ON menu_items;
CREATE POLICY "Allow admin full access on menu_items"
  ON menu_items FOR ALL USING (auth.role() = 'authenticated');

-- 7. Realtime: broadcast every admin change to all connected guest devices
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE categories;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- 8. Supabase Storage Bucket Setup for Menu Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- 9. Storage RLS Policies: Public View, Admin Upload/Delete
DROP POLICY IF EXISTS "Allow public read on menu images" ON storage.objects;
CREATE POLICY "Allow public read on menu images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Allow admin to manage menu images" ON storage.objects;
CREATE POLICY "Allow admin to manage menu images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
