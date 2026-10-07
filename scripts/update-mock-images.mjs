/**
 * One-off maintenance script: assigns dedicated cocktail photos and a stable
 * `sort_order` to every item in src/utils/mockData.js.
 * Usage: node scripts/update-mock-images.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mockCategories, mockMenuItems } from '../src/utils/mockData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(__dirname, '../src/utils/mockData.js');

const IMAGE_MAP = {
  'Spartacus': 'spartacus',
  'Cadillac Margarita': 'margarita',
  'Caipirinha Brazilian': 'caipirinha',
  'German Beam': 'whiskey-sour',
  'Long Island Iced Tea': 'long-island',
  'TUI Blue Special': 'tui-blue-special',
  'Tequila Sunrise': 'tequila-sunrise',
  'Mojito': 'mojito',
  'Pina Colada': 'pina-colada',
  'Brandy Alexander': 'brandy-alexander',
  'Martini Cocktail': 'martini',
  'Tropicana': 'tropicana',
  'Bloody Mary': 'bloody-mary',
  'Cuba Libre': 'cuba-libre',
  'Med Mule': 'med-mule',
  'Espresso Martini': 'espresso-martini',
  'Very Berry': 'very-berry',
  'Green Mile': 'green-mile',
  'Green Apple Martini': 'green-apple-martini',
  'Miss G': 'caipirinha',
  'Moonlight': 'moonlight',
  'Whiskey Sour Peach': 'whiskey-sour',
  'Aperol Spritz': 'aperol-spritz',
  'Ipanema': 'mocktail',
  'Virgin Colada': 'pina-colada',
  'Florida': 'tropicana',
  'Fruit Blast': 'mocktail',
};

const updated = mockMenuItems.map((item, index) => {
  const slug = IMAGE_MAP[item.title_en];
  return {
    ...item,
    sort_order: index + 1,
    current_image_url: slug ? `/images/drinks/${slug}.webp` : item.current_image_url,
  };
});

const header = `/**
 * TUI BLUE DIGITAL BEVERAGE MENU & ADMIN CONTROL SUITE
 * Master dataset containing the 4 Primary Categories and all beverages.
 * Used as offline fallback and as the source for supabase/seed.sql.
 */
`;

const output =
  `${header}\nexport const mockCategories = ${JSON.stringify(mockCategories, null, 2)};\n\n` +
  `export const mockMenuItems = ${JSON.stringify(updated, null, 2)};\n`;

writeFileSync(target, output, 'utf8');
console.log(`Updated ${updated.length} items.`);
