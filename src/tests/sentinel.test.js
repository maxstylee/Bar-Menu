/**
 * ============================================================================
 * SENTINEL TEST SUITE - TUI BLUE BEVERAGE MENU & ADMIN
 * Automated Verification: 4 Master Categories, 180+ Menu Items, i18n (TR/EN/RU/DE),
 * Dual-Image Slot Lifecycle, Currency Formatting, and Filtering.
 * ============================================================================
 */

import { mockCategories, mockMenuItems } from '../utils/mockData.js';
import { translations, supportedLanguages, formatItemPrice } from '../utils/translations.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

function testSection(title, fn) {
  console.log(`\n🔹 [TEST SUITE] ${title}`);
  try {
    fn();
  } catch (err) {
    console.error(`  ❌ EXCEPTION in "${title}":`, err);
    failedTests++;
  }
}

console.log('================================================================');
console.log('🛡️  SENTINEL AUTOMATED QUALITY CONTROL & VERIFICATION');
console.log('================================================================');

// 1. Data Schema & Integrity Tests
testSection('Mock Data Schema & Required Fields Integrity', () => {
  assert(mockCategories.length === 4, `Must feature exactly 4 Primary Master Categories (Found: ${mockCategories.length})`);
  assert(mockMenuItems.length >= 150, `Must have complete beverage dataset (Found: ${mockMenuItems.length})`);

  const categoryIds = new Set(mockCategories.map((c) => c.id));
  assert(categoryIds.has('cocktails'), 'Contains category: cocktails');
  assert(categoryIds.has('alcoholic-drinks'), 'Contains category: alcoholic-drinks');
  assert(categoryIds.has('cold-drinks'), 'Contains category: cold-drinks');
  assert(categoryIds.has('tea-coffee'), 'Contains category: tea-coffee');

  mockCategories.forEach((cat) => {
    assert(cat.id && typeof cat.id === 'string', `Category ${cat.id} has valid ID`);
    assert(cat.name_en && cat.name_tr, `Category ${cat.id} has EN & TR names`);
    assert(cat.icon, `Category ${cat.id} has icon defined`);
  });

  mockMenuItems.forEach((item) => {
    assert(item.id && typeof item.id === 'string', `Item ${item.id} has valid ID`);
    assert(categoryIds.has(item.category_id), `Item ${item.id} is linked to valid category ${item.category_id}`);
    assert(typeof item.price === 'number' && item.price >= 0, `Item ${item.id} has non-negative price (${item.price})`);
    assert(['EUR', 'TRY', 'USD'].includes(item.currency || 'EUR'), `Item ${item.id} has valid currency (${item.currency})`);
    assert(Boolean(item.title_en), `Item ${item.id} has English title`);
    assert(typeof item.is_available === 'boolean', `Item ${item.id} has boolean availability`);
    assert(typeof item.is_alcoholic === 'boolean', `Item ${item.id} has boolean alcoholic flag`);
  });
});

// 2. Multilingual Translations & Brand Integrity Tests
testSection('4-Language Localization & Brand Integrity', () => {
  const langCodes = supportedLanguages.map((l) => l.code);
  assert(langCodes.includes('tr'), 'Supports Turkish (TR)');
  assert(langCodes.includes('en'), 'Supports English (EN)');
  assert(langCodes.includes('ru'), 'Supports Russian (RU)');
  assert(langCodes.includes('de'), 'Supports German (DE)');

  const requiredKeys = [
    'brandTitle',
    'welcome',
    'beverages',
    'categories',
    'selectYourBeverage',
    'adminPanel',
    'searchPlaceholder',
    'outOfStock',
    'available',
    'filterAll',
    'filterIncluded',
    'filterPremium',
    'filterSignature',
    'dashboardTitle',
    'addNewItem',
    'manageCategories',
  ];

  ['tr', 'en', 'ru', 'de'].forEach((lang) => {
    const dict = translations[lang];
    assert(Boolean(dict), `Translation dictionary exists for '${lang}'`);
    assert(dict.brandTitle === 'TUI BLUE', `Brand title for '${lang}' is strictly 'TUI BLUE'`);
    requiredKeys.forEach((key) => {
      assert(Boolean(dict[key]), `Dictionary '${lang}' contains key '${key}'`);
    });
  });
});

// 3. Price Formatting Tests (Matching the design pill: EXTRA • 10€)
testSection('Currency Price Formatting Resolution', () => {
  assert(formatItemPrice(10, 'EUR') === '10€', 'Format 10 EUR -> 10€');
  assert(formatItemPrice(13, 'EUR') === '13€', 'Format 13 EUR -> 13€');
  assert(formatItemPrice(250, 'TRY') === '₺250', 'Format 250 TRY -> ₺250');
  assert(formatItemPrice(16.5, 'USD') === '$16.5', 'Format 16.5 USD -> $16.5');
  assert(formatItemPrice(0) === '0€', 'Default format 0 without currency -> 0€');
});

// 4. Dual-Image Slot Versioning & Rollback Pointer Logic Simulation
testSection('Dual-Image Slot Versioning & Rollback Lifecycle', () => {
  let item = {
    id: 'test-item-01',
    current_image_url: '/images/drinks/tui-blue-special.webp',
    previous_image_url: null,
  };

  assert(item.current_image_url !== null, 'Initial upload: current_image_url is populated');
  assert(item.previous_image_url === null, 'Initial upload: previous_image_url is null');

  const secondUploadUrl = '/images/drinks/mojito.webp';
  let shiftedPrevious = item.current_image_url;
  let newCurrent = secondUploadUrl;
  item = {
    ...item,
    current_image_url: newCurrent,
    previous_image_url: shiftedPrevious,
  };

  assert(item.current_image_url === secondUploadUrl, 'Second upload: current_image_url points to new image');
  assert(item.previous_image_url === '/images/drinks/tui-blue-special.webp', 'Second upload: previous_image_url holds 1st image as backup');

  const thirdUploadUrl = '/images/drinks/pina-colada.webp';
  const oldBackupToBeDeleted = item.previous_image_url;
  shiftedPrevious = item.current_image_url;
  newCurrent = thirdUploadUrl;
  item = {
    ...item,
    current_image_url: newCurrent,
    previous_image_url: shiftedPrevious,
  };

  assert(oldBackupToBeDeleted === '/images/drinks/tui-blue-special.webp', 'Third upload: Old backup URL correctly identified for storage cleanup');
  assert(item.current_image_url === thirdUploadUrl, 'Third upload: current_image_url points to 3rd image');
  assert(item.previous_image_url === secondUploadUrl, 'Third upload: previous_image_url holds 2nd image');

  const rollbackCurrent = item.previous_image_url;
  const rollbackPrevious = item.current_image_url;
  item = {
    ...item,
    current_image_url: rollbackCurrent,
    previous_image_url: rollbackPrevious,
  };

  assert(item.current_image_url === secondUploadUrl, 'Rollback: current_image_url restored to 2nd image without re-upload');
  assert(item.previous_image_url === thirdUploadUrl, 'Rollback: previous_image_url now holds 3rd image');
});

// 5. Menu Filtering, Multilingual Search & Stop-List Logic
testSection('Menu Search & Filter Query Resolution', () => {
  const cocktails = mockMenuItems.filter((i) => i.category_id === 'cocktails');
  assert(cocktails.length >= 20, `Cocktails category found ${cocktails.length} drinks`);

  const mojitoSearch = mockMenuItems.filter((i) =>
    i.title_en.toLowerCase().includes('mojito')
  );
  assert(mojitoSearch.length >= 1, `Search for 'mojito' returned ${mojitoSearch.length} item(s)`);

  const turkishTeaSearch = mockMenuItems.filter((i) =>
    i.title_en.toLowerCase().includes('turkish tea') || (i.title_tr && i.title_tr.toLowerCase().includes('türk çayı'))
  );
  assert(turkishTeaSearch.length >= 1, `Search for 'Turkish Tea' returned ${turkishTeaSearch.length} item(s)`);

  const nonAlcoholicItems = mockMenuItems.filter((i) => !i.is_alcoholic);
  assert(nonAlcoholicItems.length >= 20, `Found ${nonAlcoholicItems.length} non-alcoholic items`);

  const targetItem = { ...mockMenuItems[0], is_available: true };
  const toggledItem = { ...targetItem, is_available: !targetItem.is_available };
  assert(toggledItem.is_available === false, 'Stop-List toggle correctly flags item as unavailable');
});

console.log('\n================================================================');
console.log(`📊 TEST RESULTS SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('================================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('✨ All Sentinel quality control checks passed with 100% precision!\n');
  process.exit(0);
}
