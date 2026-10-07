import { mockCategories, mockMenuItems, CATEGORY_SUBCATEGORIES } from '../utils/mockData.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('================================================================');
console.log('🧪 CATEGORY DETAIL & CONTINUOUS SCROLL TEST SUITE');
console.log('================================================================');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Verify Category 1 to 4 Ordering
console.log('\n🔹 1. Four Primary Master Categories Hierarchy');
assert(mockCategories.length === 4, 'Exactly 4 master categories defined');
assert(mockCategories[0].id === 'tea-coffee' && mockCategories[0].sort_order === 1, 'Category 1 is TEA and COFFEE (sort_order 1)');
assert(mockCategories[1].id === 'cold-drinks' && mockCategories[1].sort_order === 2, 'Category 2 is COLD DRINKS (sort_order 2)');
assert(mockCategories[2].id === 'alcoholic-drinks' && mockCategories[2].sort_order === 3, 'Category 3 is ALCOHOLIC DRINKS (sort_order 3)');
assert(mockCategories[3].id === 'cocktails' && mockCategories[3].sort_order === 4, 'Category 4 is COCKTAILS (sort_order 4)');

// 2. Verify Canonical Subcategories Mapping
console.log('\n🔹 2. Subcategory Structure Mapping');
const expectedHierarchy = {
  'tea-coffee': ['TEA', 'COFFEE', 'COFFEE WITH ALCOHOL'],
  'cold-drinks': ['COLD DRINKS', 'JUICE', 'WELLNESS'],
  'alcoholic-drinks': [
    'BEER', 'LIQUEURS', 'IMPORTED LIQUOR', 'VERMOUTH', 'COGNAC', 'RUM', 'TEQUILA',
    'VODKA', 'GINS', 'RAKI', 'WHISKEYS', 'BOURBON WHISKEY', 'IRISH WHISKEY', 'WINE', 'CHAMPAGNE'
  ],
  'cocktails': [
    'COCKTAIL SELECTION WITH PREMIUM LIQUEURS', 'COCKTAILS WITH ALCOHOL', 'NON ALCOHOLIC COCKTAILS'
  ]
};

for (const [catId, subcats] of Object.entries(expectedHierarchy)) {
  const actual = CATEGORY_SUBCATEGORIES[catId];
  assert(Boolean(actual), `Canonical map exists for category: ${catId}`);
  assert(JSON.stringify(actual) === JSON.stringify(subcats), `Subcategories for ${catId} match specification order (${actual.length} subcategories)`);
}

// 3. Verify Drink Items Count per Subcategory
console.log('\n🔹 3. Drink Items Categorization Integrity');
let totalAssigned = 0;
for (const [catId, subcats] of Object.entries(expectedHierarchy)) {
  const catItems = mockMenuItems.filter(i => i.category_id === catId);
  for (const sub of subcats) {
    const subItems = catItems.filter(i => i.subcategory === sub);
    assert(subItems.length > 0, `${catId} > ${sub} has ${subItems.length} drinks`);
    totalAssigned += subItems.length;
  }
}
assert(totalAssigned === mockMenuItems.length, `All ${mockMenuItems.length} drinks are mapped to canonical subcategories`);

// 4. Verify HomePage.jsx does NOT render FilterPills or filter tabs
console.log('\n🔹 4. Absence of Filter Pills / Tabs in HomePage');
const homePageSrc = fs.readFileSync(path.join(__dirname, '../pages/HomePage.jsx'), 'utf-8');
assert(!homePageSrc.includes('<FilterPills'), 'HomePage.jsx does NOT render <FilterPills');
assert(!homePageSrc.includes('import { FilterPills }'), 'HomePage.jsx does NOT import FilterPills');
assert(homePageSrc.includes('CATEGORY_SUBCATEGORIES'), 'HomePage.jsx uses CATEGORY_SUBCATEGORIES for visual sections');
assert(homePageSrc.includes('subcategoryGroups.map'), 'HomePage.jsx maps over subcategoryGroups for continuous scroll view');
const appSrc = fs.readFileSync(path.join(__dirname, '../App.jsx'), 'utf-8');
assert(appSrc.includes('/category/:categoryId'), 'App.jsx supports /category/:categoryId navigation');

console.log('\n================================================================');
console.log(`📊 RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('================================================================');

if (failed > 0) process.exit(1);
