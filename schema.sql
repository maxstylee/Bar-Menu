-- ============================================================================
-- TUI BLUE SENSATORI - HOTEL BAR DIGITAL BEVERAGE MENU & ADMIN CONTROL SUITE
-- SUPABASE POSTGRESQL MIGRATION & RLS POLICIES
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table (Turkish, English, Russian, German)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ru TEXT,
  name_de TEXT,
  icon TEXT DEFAULT 'Wine',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Menu Items Table (Beverages with 4 Languages and Dual-Image Slots)
CREATE TABLE IF NOT EXISTS menu_items (
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
  abv NUMERIC(4, 1) DEFAULT 0.0,
  is_alcoholic BOOLEAN DEFAULT TRUE,
  current_image_url TEXT,
  previous_image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- 7. Supabase Storage Bucket Setup for Menu Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage RLS Policies: Public View, Admin Upload/Delete
DROP POLICY IF EXISTS "Allow public read on menu images" ON storage.objects;
CREATE POLICY "Allow public read on menu images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'menu-images');

DROP POLICY IF EXISTS "Allow admin to manage menu images" ON storage.objects;
CREATE POLICY "Allow admin to manage menu images"
  ON storage.objects FOR ALL
  USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');

-- ============================================================================
-- SEED DATA (INITIAL CATEGORIES & REALISTIC LUXURY HOTEL BAR BEVERAGES)
-- ============================================================================

DO $$
DECLARE
  cat_signature UUID;
  cat_classics UUID;
  cat_whiskey UUID;
  cat_gin UUID;
  cat_wine UUID;
  cat_beer UUID;
  cat_mocktail UUID;
  cat_hot UUID;
BEGIN
  -- Clear existing mock seed if needed
  -- TRUNCATE menu_items, categories CASCADE;

  -- Insert Categories
  INSERT INTO categories (name_tr, name_en, name_ru, name_de, icon, sort_order)
  VALUES ('İmza Kokteyller', 'Signature Cocktails', 'Фирменные коктейли', 'Signatur-Cocktails', 'Sparkles', 1)
  RETURNING id INTO cat_signature;

  INSERT INTO categories (name_tr, name_en, name_ru, name_de, icon, sort_order)
  VALUES ('Klasik Kokteyller', 'Classic Cocktails', 'Классические коктейли', 'Klassische Cocktails', 'GlassWater', 2)
  RETURNING id INTO cat_classics;

  INSERT INTO categories (name_tr, name_en, name_ru, name_de, icon, sort_order)
  VALUES ('Viski & Single Malt', 'Whiskey & Single Malts', 'Виски и Односолодовые', 'Whiskey & Single Malts', 'Flame', 3)
  RETURNING id INTO cat_whiskey;

  INSERT INTO categories (name_tr, name_en, name_ru, name_de, icon, sort_order)
  VALUES ('Cin & Tonik', 'Gin & Botanicals', 'Джин и Тоник', 'Gin & Botanicals', 'Citrus', 4)
  RETURNING id INTO cat_gin;

  INSERT INTO categories (name_tr, name_en, name_ru, name_de, icon, sort_order)
  VALUES ('Şarap & Şampanya', 'Wine & Champagne', 'Вино и Шампанское', 'Wein & Champagner', 'Wine', 5)
  RETURNING id INTO cat_wine;

  INSERT INTO categories (name_tr, name_en, name_ru, name_de, icon, sort_order)
  VALUES ('Bira Çeşitleri', 'Craft & Draught Beers', 'Пиво', 'Biere vom Fass & Flaschen', 'Beer', 6)
  RETURNING id INTO cat_beer;

  INSERT INTO categories (name_tr, name_en, name_ru, name_de, icon, sort_order)
  VALUES ('Mocktail & Alkolsüz', 'Mocktails & Non-Alcoholic', 'Безалкогольные коктейли', 'Alkoholfreie Mocktails', 'HeartHandshake', 7)
  RETURNING id INTO cat_mocktail;

  INSERT INTO categories (name_tr, name_en, name_ru, name_de, icon, sort_order)
  VALUES ('Sıcak İçecekler & Kahve', 'Artisanal Teas & Coffee', 'Горячие напитки и кофе', 'Kaffee & Teespezialitäten', 'Coffee', 8)
  RETURNING id INTO cat_hot;

  -- Insert Menu Items for Signature Cocktails
  INSERT INTO menu_items (category_id, title_tr, title_en, title_ru, title_de, description_tr, description_en, description_ru, description_de, price, volume_ml, abv, is_alcoholic, current_image_url, is_available, tags)
  VALUES 
  (cat_signature, 'TUI Blue Sensatori Sunset', 'TUI Blue Sensatori Sunset', 'Закат ТУИ Блю Сенсатори', 'TUI Blue Sensatori Sunset', 
   'Mürver çiçeği likörü, taze çarkıfelek meyvesi püresi, prosecco ve altın simli narenciye infüzyonu.',
   'Elderflower liqueur, fresh passionfruit purée, crisp prosecco topped with 24k gold shimmer citrus spray.',
   'Ликер бузины, пюре из свежей маракуйи, просекко с золотым цитрусовым напылением 24k.',
   'Holunderblütenlikör, frisches Maracujapüree, spritziger Prosecco mit 24k Goldstaub-Zitrusaroma.',
   18.50, 200, 12.5, TRUE, 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Signature', 'Fruity', 'Gold']),
   
  (cat_signature, 'Smoked Amber Old Fashioned', 'Smoked Amber Old Fashioned', 'Копченый янтарный Олд Фэшн', 'Geräucherter Bernstein Old Fashioned',
   'Meşe fıçıda dinlendirilmiş burbon, akçaağaç şurubu, angostura bitter ve sedir ağacı dumanı.',
   'Oak-barrel rested Kentucky bourbon, artisanal maple reduction, aromatic bitters infused with smoked cedar.',
   'Выдержанный в дубе бурбон, кленовый сироп, ароматические биттеры и дым кедровой щепы.',
   'Im Eichenfass gereifter Kentucky Bourbon, Ahornsirup, aromatische Bitter mit Zedernholzrauch.',
   19.00, 120, 32.0, TRUE, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Signature', 'Smoky', 'Strong']),

  (cat_signature, 'Aegean Aegean Breeze', 'Aegean Blue Velvet', 'Эгейский Голубой Бархат', 'Ägäischer Blauer Samt',
   'Kelebek bezelye çiçeği infüze cin, lavanta şurubu, taze limon suyu ve tonik.',
   'Butterfly pea blossom infused gin, botanical lavender syrup, fresh Amalfi lemon, Fever-Tree tonic.',
   'Джин, настоянный на цветках анчана, лавандовый сироп, лимонный сок и тоник.',
   'Mit Schmetterlingserbsenblüten infundierter Gin, Lavendelsirup, Amalfi-Zitrone, Premium-Tonic.',
   16.50, 220, 14.0, TRUE, 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Botanical', 'Floral', 'Color Changing']);

  -- Insert Menu Items for Classics
  INSERT INTO menu_items (category_id, title_tr, title_en, title_ru, title_de, description_tr, description_en, description_ru, description_de, price, volume_ml, abv, is_alcoholic, current_image_url, is_available, tags)
  VALUES
  (cat_classics, 'Espresso Martini Royale', 'Espresso Martini Royale', 'Эспрессо Мартини Рояль', 'Espresso Martini Royale',
   'Taze çekilmiş espresso, vanilyalı votka, Kahlúa kahve likörü ve çikolata tozu.',
   'Single origin freshly pulled espresso, vanilla-infused vodka, Kahlúa coffee liqueur, dark cacao dust.',
   'Свежесваренный эспрессо, ванильная водка, кофейный ликер Kahlúa и темный какао.',
   'Frisch gebrühter Espresso, Vanille-Wodka, Kahlúa-Kaffeelikör, Zartbitter-Kakaostaub.',
   15.50, 150, 18.0, TRUE, 'https://images.unsplash.com/photo-1545438102-799c3991ffb2?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Classic', 'Coffee', 'Rich']),

  (cat_classics, 'Negroni Classico', 'Negroni Classico', 'Негрони Классико', 'Negroni Classico',
   'Tanqueray No. Ten cin, Campari ve Antica Formula tatlı vermut, kurutulmuş portakal dilimi ile.',
   'Tanqueray No. Ten gin, bitter Campari, Carpano Antica Formula sweet vermouth, flamed orange peel.',
   'Джин Tanqueray No. Ten, биттер Campari, красный вермут Antica Formula, цедра апельсина.',
   'Tanqueray No. Ten Gin, Campari, roter Wermut Antica Formula mit flambierter Orangenzeste.',
   16.00, 110, 24.0, TRUE, 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Classic', 'Bitter-Sweet']);

  -- Insert Menu Items for Whiskeys
  INSERT INTO menu_items (category_id, title_tr, title_en, title_ru, title_de, description_tr, description_en, description_ru, description_de, price, volume_ml, abv, is_alcoholic, current_image_url, is_available, tags)
  VALUES
  (cat_whiskey, 'Macallan 12 Double Cask', 'Macallan 12 Years Double Cask', 'Макаллан 12 Лет Дабл Каск', 'Macallan 12 Jahre Double Cask',
   'Sherry fıçılarda olgunlaşmış dengeli vanilya, zencefil ve kuru meyve notaları.',
   'Aged in hand-picked sherry-seasoned oak casks. Balanced notes of honey, delicate spice, and dried fruits.',
   'Выдержан в дубовых бочках из-под хереса. Ноты меда, имбиря и сухофруктов.',
   'Gereift in handverlesenen Sherryfässern. Aromen von Honig, edlen Gewürzen und getrockneten Früchten.',
   22.00, 50, 40.0, TRUE, 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Single Malt', 'Speyside', 'Luxury']),

  (cat_whiskey, 'Lagavulin 16 Islay Malt', 'Lagavulin 16 Years Single Islay Malt', 'Лагавулин 16 Лет', 'Lagavulin 16 Jahre Single Islay Malt',
   'Yoğun turba dumanı, deniz yosunu ve zengin meyvemsi meşe karakteri.',
   'Intense peaty smoke, maritime iodine, sweet rich dried fruit and long spicy finish.',
   'Насыщенный торфяной дым, морские ноты, богатые сладкие сухофрукты.',
   'Intensiver Torfrauch, Meeresaromen, reife Trockenfrüchte und ein langanhaltender Abgang.',
   25.00, 50, 43.0, TRUE, 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Single Malt', 'Islay', 'Peated']);

  -- Insert Menu Items for Gin
  INSERT INTO menu_items (category_id, title_tr, title_en, title_ru, title_de, description_tr, description_en, description_ru, description_de, price, volume_ml, abv, is_alcoholic, current_image_url, is_available, tags)
  VALUES
  (cat_gin, 'Hendrick’s Grand Cabaret & Cucumber', 'Hendrick’s Botanical Tonic', 'Хендрикс Ботаникал Тоник', 'Hendrick’s Botanical Tonic',
   'Gül yaprakları ve salatalık esansı ile damıtılmış cin, taze salatalık şeridi ve pembe karabiber ile.',
   'Infused with rose and crisp cucumber, garnished with ribbons of English cucumber and pink peppercorns.',
   'Джин с экстрактом розы и огурца, подается с ломтиком огурца и розовым перцем.',
   'Destilliert mit Rosen- und Gurkenessenzen, serviert mit Gurkenstreifen und rosa Pfefferkörnern.',
   16.50, 250, 13.5, TRUE, 'https://images.unsplash.com/photo-1607622750671-6cd9a99eabd1?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Gin', 'Refreshing', 'Cucumber']);

  -- Insert Menu Items for Wines
  INSERT INTO menu_items (category_id, title_tr, title_en, title_ru, title_de, description_tr, description_en, description_ru, description_de, price, volume_ml, abv, is_alcoholic, current_image_url, is_available, tags)
  VALUES
  (cat_wine, 'Moët & Chandon Impérial Brut', 'Moët & Chandon Impérial Brut', 'Моэт и Шандон Империал Брют', 'Moët & Chandon Impérial Brut',
   'Fransız şampanyası; canlı yeşil elma, narenciye ve taze briyoş aromaları.',
   'The world’s most loved champagne: vibrant green apple, citrus zest, and elegant mineral nuances.',
   'Легендарное французское шампанское: хрустящее зеленое яблоко, цитрусовые и легкая минеральность.',
   'Der beliebteste Champagner der Welt: grüner Apfel, Zitrusfrische und elegante Brioche-Noten.',
   95.00, 750, 12.0, TRUE, 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Champagne', 'Brut', 'Bottle']),

  (cat_wine, 'Château d’Esclans Whispering Angel Rosé', 'Whispering Angel Côtes de Provence', 'Шепчущий Ангел Прованс Розе', 'Whispering Angel Côtes de Provence Rosé',
   'Provence bölgesinden ipeksi pembe şarap, kırmızı meyve ve taze çiçek dokunuşları.',
   'Premium Provence rosé wine with silky red berry aromas, peach blossom, and a crisp flinty finish.',
   'Премиальное розовое вино из Прованса: шелковистые красные ягоды, цветки персика и минеральность.',
   'Erstklassiger Roséwein aus der Provence mit Aromen von roten Beeren, Pfirsichblüten und Frische.',
   48.00, 750, 13.0, TRUE, 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Wine', 'Rose', 'France']);

  -- Insert Menu Items for Mocktails
  INSERT INTO menu_items (category_id, title_tr, title_en, title_ru, title_de, description_tr, description_en, description_ru, description_de, price, volume_ml, abv, is_alcoholic, current_image_url, is_available, tags)
  VALUES
  (cat_mocktail, 'Virgin Passionfruit & Rosemary Fizz', 'Virgin Passionfruit & Rosemary Fizz', 'Маракуйя и Розмарин Физз (Безалкогольный)', 'Virgin Maracuja & Rosmarin Fizz',
   'Taze çarkıfelek meyvesi, dağ kekiği şurubu, alevlendirilmiş taze biberiye ve maden suyu.',
   'Fresh passionfruit pulp, artisanal rosemary syrup, crushed ice, and sparkling mineral water.',
   'Свежая маракуйя, сироп розмарина, колотый лед и газированная минеральная вода.',
   'Frische Maracuja, Rosmarinsirup, Crushed Ice und prickelndes Mineralwasser.',
   9.50, 300, 0.0, FALSE, 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Mocktail', 'Non-Alcoholic', 'Refreshing']),

  (cat_mocktail, 'Cranberry Basil Elixir', 'Cranberry Basil Elixir', 'Клюквенно-базиликовый эликсир', 'Cranberry-Basilikum-Elixier',
   'Organik turna yemişi suyu, taze fesleğen yaprakları, misket limonu ve zencefilli gazoz.',
   'Wild tart cranberry juice, muddled Italian basil leaves, cold-pressed lime, ginger ale.',
   'Дикая клюква, свежий итальянский базилик, сок лайма и имбирный эль.',
   'Wilder Cranberrysaft, frischer Basilikum, Limette und Ginger Ale.',
   9.00, 280, 0.0, FALSE, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Mocktail', 'Non-Alcoholic', 'Herbal']);

  -- Insert Menu Items for Hot & Coffee
  INSERT INTO menu_items (category_id, title_tr, title_en, title_ru, title_de, description_tr, description_en, description_ru, description_de, price, volume_ml, abv, is_alcoholic, current_image_url, is_available, tags)
  VALUES
  (cat_hot, 'Turkish Coffee Supreme with Mastic', 'Artisanal Turkish Mastic Coffee', 'Турецкий кофе с мастикой', 'Traditioneller Türkischer Mokka mit Mastix',
   'Özel çekilmiş bakır cezvede pişirilen geleneksel damla sakızlı Türk kahvesi, lokum eşliğinde.',
   'Slow-brewed in copper cezve over hot sand, infused with Chios mastic gum, served with lokum.',
   'Сваренный на песке турецкий кофе с натуральной мастикой, подается с рахат-лукумом.',
   'Im Kupferkännchen auf heißem Sand zubereiteter Mokka mit Mastix, serviert mit Lokum.',
   6.50, 80, 0.0, FALSE, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Coffee', 'Traditional', 'Hot']),

  (cat_hot, 'Smoked Cardamom Flat White', 'Smoked Cardamom Flat White', 'Флэт Уайт с кардамоном', 'Geräucherter Kardamom Flat White',
   'Çift shot espresso, mikro köpürtülmüş yulaf veya tam yağlı süt, kavrulmuş kakule tozu.',
   'Double shot specialty espresso, silky micro-foamed milk, dusting of freshly ground cardamom.',
   'Двойной эспрессо, шелковистая микропенка молока и щепотка свежего кардамона.',
   'Doppelter Espresso, samtiger Mikroschaum und ein Hauch frisch gemahlener Kardamom.',
   7.50, 200, 0.0, FALSE, 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80', TRUE, ARRAY['Coffee', 'Barista', 'Hot']);

END $$;
