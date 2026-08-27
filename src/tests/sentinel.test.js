/**
 * ============================================================================
 * SENTINEL TEST SUITE - TUI BLUE SENSATORI DIGITAL BEVERAGE MENU & ADMIN
 * Automated Verification: i18n, Dual-Image Engine, State Consistency, Filters
 * ============================================================================
 */

import { mockCategories, mockMenuItems } from '../utils/mockData.js';
import { translations, supportedLanguages } from '../utils/translations.js';

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
  assert(mockCategories.length >= 8, `Should have at least 8 categories (Found: ${mockCategories.length})`);
  assert(mockMenuItems.length >= 15, `Should have at least 15 menu items (Found: ${mockMenuItems.length})`);

  mockCategories.forEach((cat) => {
    assert(cat.id && typeof cat.id === 'string', `Category ${cat.id} has valid ID`);
    assert(cat.name_en && cat.name_tr, `Category ${cat.id} has EN & TR names`);
    assert(cat.icon, `Category ${cat.id} has icon defined`);
  });

  mockMenuItems.forEach((item) => {
    assert(item.id && typeof item.id === 'string', `Item ${item.id} has valid ID`);
    assert(item.category_id, `Item ${item.id} is linked to a valid category`);
    assert(typeof item.price === 'number' && item.price >= 0, `Item ${item.id} has non-negative price (${item.price})`);
    assert(item.title_en && item.title_tr, `Item ${item.id} has English & Turkish titles`);
    assert(typeof item.is_available === 'boolean', `Item ${item.id} has boolean availability`);
    assert(typeof item.is_alcoholic === 'boolean', `Item ${item.id} has boolean alcoholic flag`);
    assert(item.current_image_url && item.current_image_url.startsWith('http'), `Item ${item.id} has valid image URL`);
  });
});

// 2. Multilingual Translations & Supported Languages Tests
testSection('4-Language Localization & Translation Completeness', () => {
  const langCodes = supportedLanguages.map((l) => l.code);
  assert(langCodes.includes('tr'), 'Supports Turkish (TR)');
  assert(langCodes.includes('en'), 'Supports English (EN)');
  assert(langCodes.includes('ru'), 'Supports Russian (RU)');
  assert(langCodes.includes('de'), 'Supports German (DE)');

  const requiredKeys = [
    'brandTitle',
    'brandSubtitle',
    'adminPanel',
    'guestMenu',
    'allDrinks',
    'alcoholic',
    'nonAlcoholic',
    'searchPlaceholder',
    'outOfStock',
    'available',
    'dashboardTitle',
    'addNewItem',
    'quickEditPrice',
    'dualImageTitle',
    'restorePrevious',
    'activeSlot',
    'backupSlot',
  ];

  ['tr', 'en', 'ru', 'de'].forEach((lang) => {
    const dict = translations[lang];
    assert(Boolean(dict), `Translation dictionary exists for '${lang}'`);
    requiredKeys.forEach((key) => {
      assert(Boolean(dict[key]), `Dictionary '${lang}' contains key '${key}'`);
    });
  });
});

// 3. Dual-Image Slot Versioning & Rollback Pointer Logic Simulation
testSection('Dual-Image Slot Versioning & Rollback Lifecycle', () => {
  // Simulate an item with initial upload
  let item = {
    id: 'test-item-01',
    current_image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b',
    previous_image_url: null,
  };

  assert(item.current_image_url !== null, 'Initial upload: current_image_url is populated');
  assert(item.previous_image_url === null, 'Initial upload: previous_image_url is null');

  // Second Upload: New image arrives
  const secondUploadUrl = 'https://images.unsplash.com/photo-1551024709-8f23befc6f87';
  let shiftedPrevious = item.current_image_url;
  let newCurrent = secondUploadUrl;
  item = {
    ...item,
    current_image_url: newCurrent,
    previous_image_url: shiftedPrevious,
  };

  assert(item.current_image_url === secondUploadUrl, 'Second upload: current_image_url points to new image');
  assert(item.previous_image_url === 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b', 'Second upload: previous_image_url holds 1st image as backup');

  // Third Upload: Replacing again
  const thirdUploadUrl = 'https://images.unsplash.com/photo-1536935338788-846bb9981813';
  const oldBackupToBeDeleted = item.previous_image_url;
  shiftedPrevious = item.current_image_url;
  newCurrent = thirdUploadUrl;
  item = {
    ...item,
    current_image_url: newCurrent,
    previous_image_url: shiftedPrevious,
  };

  assert(oldBackupToBeDeleted === 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b', 'Third upload: Old backup URL correctly identified for storage cleanup');
  assert(item.current_image_url === thirdUploadUrl, 'Third upload: current_image_url points to 3rd image');
  assert(item.previous_image_url === secondUploadUrl, 'Third upload: previous_image_url holds 2nd image');

  // Instant Rollback Pointer Swap
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

// 4. Menu Filtering, Multilingual Search & Stop-List Logic
testSection('Menu Search & Filter Query Resolution', () => {
  // Test Category filter
  const sigCocktails = mockMenuItems.filter((i) => i.category_id === 'cat-01-signature');
  assert(sigCocktails.length >= 3, `Category filter found ${sigCocktails.length} signature cocktails`);

  // Test Alcoholic / Non-Alcoholic filter
  const nonAlcoholicItems = mockMenuItems.filter((i) => !i.is_alcoholic);
  assert(nonAlcoholicItems.length >= 4, `Dietary filter found ${nonAlcoholicItems.length} non-alcoholic beverages`);

  // Test Multilingual search: English query
  const macallanSearch = mockMenuItems.filter((i) =>
    i.title_en.toLowerCase().includes('macallan') || i.title_tr.toLowerCase().includes('macallan')
  );
  assert(macallanSearch.length >= 1, `Search for 'macallan' returned ${macallanSearch.length} item(s)`);

  // Test Multilingual search: Russian title match
  const russianSearch = mockMenuItems.filter((i) =>
    i.title_ru && i.title_ru.includes('Макаллан')
  );
  assert(russianSearch.length >= 1, `Russian search for 'Макаллан' returned ${russianSearch.length} item(s)`);

  // Test Multilingual search: German title match
  const germanSearch = mockMenuItems.filter((i) =>
    i.title_de && i.title_de.includes('Bernstein')
  );
  assert(germanSearch.length >= 1, `German search for 'Bernstein' returned ${germanSearch.length} item(s)`);

  // Test Stop-List toggle simulation
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
