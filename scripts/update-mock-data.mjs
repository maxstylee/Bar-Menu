import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATEGORY_SUBCATEGORIES, mockCategories, mockMenuItems } from '../src/utils/mockData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(__dirname, '../src/utils/mockData.js');

export const SUBCATEGORY_DEFAULT_IMAGES = {
  'TEA': '/images/subcategories/tea.webp',
  'COFFEE': '/images/subcategories/coffee.webp',
  'COFFEE WITH ALCOHOL': '/images/subcategories/coffee-alcohol.webp',
  'COLD DRINKS': '/images/subcategories/cold-drinks.webp',
  'JUICE': '/images/subcategories/juice.webp',
  'WELLNESS': '/images/subcategories/wellness.webp',
  'BEER': '/images/subcategories/beer.webp',
  'LIQUEURS': '/images/subcategories/liqueurs.webp',
  'IMPORTED LIQUOR': '/images/subcategories/imported-liquor.webp',
  'VERMOUTH': '/images/subcategories/vermouth.webp',
  'COGNAC': '/images/subcategories/cognac.webp',
  'RUM': '/images/subcategories/rum.webp',
  'TEQUILA': '/images/subcategories/tequila.webp',
  'VODKA': '/images/subcategories/vodka.webp',
  'GINS': '/images/subcategories/gins.webp',
  'RAKI': '/images/subcategories/raki.webp',
  'WHISKEYS': '/images/subcategories/whiskeys.webp',
  'BOURBON WHISKEY': '/images/subcategories/bourbon.webp',
  'IRISH WHISKEY': '/images/subcategories/irish-whiskey.webp',
  'WINE': '/images/subcategories/wine.webp',
  'CHAMPAGNE': '/images/subcategories/champagne.webp',
};

// Strict sequence:
// 1. COCKTAILS
// 2. ALCOHOLIC DRINKS
// 3. COLD DRINKS
// 4. TEA & COFFEE
const orderedCategories = [
  {
    id: 'cocktails',
    name_en: 'COCKTAILS',
    name_tr: 'KOKTEYLLER',
    name_de: 'COCKTAILS',
    name_ru: 'КОКТЕЙЛИ',
    icon: 'Martini',
    sort_order: 1
  },
  {
    id: 'alcoholic-drinks',
    name_en: 'ALCOHOLIC DRINKS',
    name_tr: 'ALKOLLÜ İÇECEKLER',
    name_de: 'ALKOHOLISCHE GETRÄNKE',
    name_ru: 'АЛКОГОЛЬНЫЕ НАПИТКИ',
    icon: 'Wine',
    sort_order: 2
  },
  {
    id: 'cold-drinks',
    name_en: 'COLD DRINKS',
    name_tr: 'SOĞUK İÇECEKLER',
    name_de: 'KALTE GETRÄNKE',
    name_ru: 'ХОЛОДНЫЕ НАПИТКИ',
    icon: 'GlassWater',
    sort_order: 3
  },
  {
    id: 'tea-coffee',
    name_en: 'TEA and COFFEE',
    name_tr: 'ÇAY ve KAHVE',
    name_de: 'TEE und KAFFEE',
    name_ru: 'ЧАЙ И КОФЕ',
    icon: 'Coffee',
    sort_order: 4
  }
];

const updatedItems = mockMenuItems.map((item) => {
  // Retain existing individual drink images for cocktails
  if (item.category_id === 'cocktails' && item.current_image_url) {
    return item;
  }
  // Assign subcategory shared image
  const subcatImage = SUBCATEGORY_DEFAULT_IMAGES[item.subcategory] || '';
  return {
    ...item,
    current_image_url: subcatImage || item.current_image_url || '',
  };
});

const header = `/**
 * TUI BLUE DIGITAL BEVERAGE MENU & ADMIN CONTROL SUITE
 * Master dataset containing the 4 Primary Categories and all beverages.
 * Used as offline fallback and as the source for supabase/seed.sql.
 */
`;

const fileContent =
  header + '\n' +
  'export const CATEGORY_SUBCATEGORIES = ' + JSON.stringify(CATEGORY_SUBCATEGORIES, null, 2) + ';\n\n' +
  'export const SUBCATEGORY_DEFAULT_IMAGES = ' + JSON.stringify(SUBCATEGORY_DEFAULT_IMAGES, null, 2) + ';\n\n' +
  'export function getBeverageImageUrl(item) {\n' +
  '  if (item?.current_image_url) return item.current_image_url;\n' +
  '  if (item?.subcategory && SUBCATEGORY_DEFAULT_IMAGES[item.subcategory]) {\n' +
  '    return SUBCATEGORY_DEFAULT_IMAGES[item.subcategory];\n' +
  '  }\n' +
  '  return "";\n' +
  '}\n\n' +
  'export const mockCategories = ' + JSON.stringify(orderedCategories, null, 2) + ';\n\n' +
  'export const mockMenuItems = ' + JSON.stringify(updatedItems, null, 2) + ';\n';

fs.writeFileSync(target, fileContent, 'utf8');
console.log('Successfully updated mockData.js with reordered categories and subcategory images!');
