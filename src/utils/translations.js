/**
 * Multilingual Translation Dictionaries for TUI BLUE Bar Menu
 * Supported Languages: English ('en'), German ('de'), Turkish ('tr'), Russian ('ru')
 */

export const supportedLanguages = [
  { code: 'en', name: 'English', label: 'EN' },
  { code: 'de', name: 'Deutsch', label: 'DE' },
  { code: 'tr', name: 'Türkçe', label: 'TR' },
  { code: 'ru', name: 'Русский', label: 'RU' },
];

export function formatItemPrice(price, currency = 'EUR') {
  const num = Number(price) || 0;
  const str = num % 1 === 0 ? num.toFixed(0) : String(num);
  if (currency === 'USD') {
    return `$${str}`;
  }
  if (currency === 'TRY') {
    return `₺${str}`;
  }
  return `${str}€`;
}

export const translations = {
  en: {
    // Branding & Navigation
    brandTitle: 'TUI BLUE',
    welcome: 'WELCOME',
    beverages: 'BEVERAGES',
    categories: 'CATEGORIES',
    selectYourBeverage: 'Select your beverage',
    searchPlaceholder: 'Search beverage...',
    featuredDrink: 'FEATURED DRINK',
    adminPanel: 'Admin Panel',
    guestMenu: 'Guest Menu',
    login: 'Login',
    logout: 'Logout',
    back: 'Back',

    // Filter Pills
    filterAll: 'All',
    filterIncluded: 'Included',
    filterPremium: 'Premium (Extra)',
    filterSignature: 'Signature',

    // Badges
    badgeFeatured: 'FEATURED',
    badgeIncluded: 'INCLUDED',
    badgeExtra: 'EXTRA',
    badgeSignature: 'SIGNATURE',
    badgeOutOfStock: 'OUT OF STOCK',

    // Categories
    catCocktails: 'COCKTAILS',
    catAlcoholicDrinks: 'ALCOHOLIC DRINKS',
    catColdDrinks: 'COLD DRINKS',
    catTeaCoffee: 'TEA and COFFEE',
    drink: 'Drink',
    drinks: 'Drinks',

    // Menu Card & Detail Modal
    outOfStock: 'Out of Stock',
    available: 'Available',
    volume: 'Volume',
    abv: 'ABV Content',
    tastingNotes: 'Tasting Notes & Ingredients',
    ingredients: 'Ingredients',
    price: 'Price',
    currency: 'Currency',
    close: 'Close',
    viewDetails: 'View Details',
    noResultsFound: 'No beverages match your search or filter criteria.',
    clearSearch: 'Clear Filters',

    // Admin Dashboard
    dashboardTitle: 'Beverage Menu Management',
    dashboardSubtitle: 'Manage beverages, update real-time prices, and adjust availability.',
    addNewItem: 'Add New Beverage',
    editItem: 'Edit Beverage',
    deleteItem: 'Delete Beverage',
    manageCategories: 'Manage Categories',
    addCategory: 'Add Category',
    editCategory: 'Edit Category',
    deleteCategory: 'Delete Category',
    categoryName: 'Category Name',
    categoryIcon: 'Icon',
    sortOrder: 'Sort Order',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    confirmDelete: 'Confirm Delete',
    deleteWarningText: 'Are you sure you want to permanently delete this beverage from the menu?',
    
    // Admin Table
    colImage: 'Image',
    colTitle: 'Beverage Name',
    colCategory: 'Category',
    colSubcategory: 'Subcategory',
    colPrice: 'Price',
    colStatus: 'Status',
    colActions: 'Actions',
    inStockStatus: 'In Stock',
    outOfStockStatus: 'Out of Stock',
    noItemsInAdmin: 'No registered beverages found.',
    allCategories: 'All Categories',
    allSubcategories: 'All Subcategories',
    searchAdminPlaceholder: 'Quick search by name, ingredients or subcategory...',
    statTotalItems: 'Total Beverages',
    statActiveItems: 'In Stock',
    statStopListed: 'Out of Stock',
    statCategories: 'Categories',
  },

  de: {
    // Branding & Navigation
    brandTitle: 'TUI BLUE',
    welcome: 'WILLKOMMEN',
    beverages: 'GETRÄNKE',
    categories: 'KATEGORIEN',
    selectYourBeverage: 'Wählen Sie Ihr Getränk',
    searchPlaceholder: 'Getränk suchen...',
    featuredDrink: 'EMPFOHLENES GETRÄNK',
    adminPanel: 'Admin-Bereich',
    guestMenu: 'Gästemenü',
    login: 'Anmelden',
    logout: 'Abmelden',
    back: 'Zurück',

    // Filter Pills
    filterAll: 'Alle',
    filterIncluded: 'Inklusive',
    filterPremium: 'Premium (Extra)',
    filterSignature: 'Signatur',

    // Badges
    badgeFeatured: 'EMPFOHLEN',
    badgeIncluded: 'INKLUSIVE',
    badgeExtra: 'EXTRA',
    badgeSignature: 'SIGNATUR',
    badgeOutOfStock: 'AUSVERKAUFT',

    // Categories
    catCocktails: 'COCKTAILS',
    catAlcoholicDrinks: 'ALKOHOLISCHE GETRÄNKE',
    catColdDrinks: 'KALTE GETRÄNKE',
    catTeaCoffee: 'TEE & KAFFEE',
    drink: 'Getränk',
    drinks: 'Getränke',

    // Menu Card & Detail Modal
    outOfStock: 'Ausverkauft',
    available: 'Verfügbar',
    volume: 'Volumen',
    abv: 'Alkoholgehalt',
    tastingNotes: 'Geschmack & Zutaten',
    ingredients: 'Zutaten',
    price: 'Preis',
    currency: 'Währung',
    close: 'Schließen',
    viewDetails: 'Details anzeigen',
    noResultsFound: 'Keine Getränke entsprechen Ihren Kriterien.',
    clearSearch: 'Filter zurücksetzen',

    // Admin Dashboard
    dashboardTitle: 'Getränkekarte Verwaltung',
    dashboardSubtitle: 'Getränke bearbeiten, Preise anpassen und Verfügbarkeiten steuern.',
    addNewItem: 'Neues Getränk hinzufügen',
    editItem: 'Getränk bearbeiten',
    deleteItem: 'Getränk löschen',
    manageCategories: 'Kategorien verwalten',
    addCategory: 'Kategorie hinzufügen',
    editCategory: 'Kategorie bearbeiten',
    deleteCategory: 'Kategorie löschen',
    categoryName: 'Kategoriename',
    categoryIcon: 'Symbol',
    sortOrder: 'Reihenfolge',
    saveChanges: 'Änderungen speichern',
    cancel: 'Abbrechen',
    confirmDelete: 'Löschen bestätigen',
    deleteWarningText: 'Möchten Sie dieses Getränk wirklich dauerhaft entfernen?',

    // Admin Table
    colImage: 'Bild',
    colTitle: 'Getränkename',
    colCategory: 'Kategorie',
    colSubcategory: 'Unterkategorie',
    colPrice: 'Preis',
    colStatus: 'Status',
    colActions: 'Aktionen',
    inStockStatus: 'Auf Lager',
    outOfStockStatus: 'Ausverkauft',
    noItemsInAdmin: 'Keine Getränke gefunden.',
    allCategories: 'Alle Kategorien',
    allSubcategories: 'Alle Unterkategorien',
    searchAdminPlaceholder: 'Schnellsuche nach Name, Zutaten oder Kategorie...',
    statTotalItems: 'Gesamtgetränke',
    statActiveItems: 'Verfügbar',
    statStopListed: 'Ausverkauft',
    statCategories: 'Kategorien',
  },

  tr: {
    // Branding & Navigation
    brandTitle: 'TUI BLUE',
    welcome: 'HOŞ GELDİNİZ',
    beverages: 'İÇECEKLER',
    categories: 'KATEGORİLER',
    selectYourBeverage: 'İçeceğinizi seçin',
    searchPlaceholder: 'İçecek ara...',
    featuredDrink: 'ÖNE ÇIKAN İÇECEK',
    adminPanel: 'Yönetim Paneli',
    guestMenu: 'Misafir Menüsü',
    login: 'Giriş Yap',
    logout: 'Çıkış Yap',
    back: 'Geri',

    // Filter Pills
    filterAll: 'Tümü',
    filterIncluded: 'Dahil',
    filterPremium: 'Premium (Ekstra)',
    filterSignature: 'İmza',

    // Badges
    badgeFeatured: 'ÖNE ÇIKAN',
    badgeIncluded: 'DAHİL',
    badgeExtra: 'EKSTRA',
    badgeSignature: 'İMZA',
    badgeOutOfStock: 'TÜKENDİ',

    // Categories
    catCocktails: 'KOKTEYLLER',
    catAlcoholicDrinks: 'ALKOLLÜ İÇECEKLER',
    catColdDrinks: 'SOĞUK İÇECEKLER',
    catTeaCoffee: 'ÇAY & KAHVE',
    drink: 'İçecek',
    drinks: 'İçecek',

    // Menu Card & Detail Modal
    outOfStock: 'Tükendi (Stop-List)',
    available: 'Mevcut',
    volume: 'Hacim',
    abv: 'Alkol Oranı',
    tastingNotes: 'Tat Profili & İçerikler',
    ingredients: 'İçerik Detayları',
    price: 'Fiyat',
    currency: 'Para Birimi',
    close: 'Kapat',
    viewDetails: 'Detayları Gör',
    noResultsFound: 'Aramanızla eşleşen içecek bulunamadı.',
    clearSearch: 'Filtreleri Temizle',

    // Admin Dashboard
    dashboardTitle: 'Bar İçecek Yönetim Merkezi',
    dashboardSubtitle: 'Menüdeki içecekleri düzenleyin, anlık fiyat güncelleyin ve stok durumunu yönetin.',
    addNewItem: 'Yeni İçecek Ekle',
    editItem: 'İçeceği Düzenle',
    deleteItem: 'İçeceği Sil',
    manageCategories: 'Kategorileri Yönet',
    addCategory: 'Yeni Kategori Ekle',
    editCategory: 'Kategoriyi Düzenle',
    deleteCategory: 'Kategoriyi Sil',
    categoryName: 'Kategori Adı',
    categoryIcon: 'İkon',
    sortOrder: 'Sıra No',
    saveChanges: 'Değişiklikleri Kaydet',
    cancel: 'İptal',
    confirmDelete: 'Silmeyi Onayla',
    deleteWarningText: 'Bu içeceği menüden kalıcı olarak silmek istediğinizden emin misiniz?',

    // Admin Table
    colImage: 'Görsel',
    colTitle: 'İçecek Adı',
    colCategory: 'Kategori',
    colSubcategory: 'Alt Kategori',
    colPrice: 'Fiyat',
    colStatus: 'Durum',
    colActions: 'İşlemler',
    inStockStatus: 'Satışta',
    outOfStockStatus: 'Tükendi (Stop-List)',
    noItemsInAdmin: 'Kayıtlı içecek bulunamadı.',
    allCategories: 'Tüm Kategoriler',
    allSubcategories: 'Tüm Alt Kategoriler',
    searchAdminPlaceholder: 'İsim, içerik veya alt kategoriye göre hızlı ara...',
    statTotalItems: 'Toplam İçecek',
    statActiveItems: 'Satışta',
    statStopListed: 'Tükenenler',
    statCategories: 'Kategori Sayısı',
  },

  ru: {
    // Branding & Navigation
    brandTitle: 'TUI BLUE',
    welcome: 'ДОБРО ПОЖАЛОВАТЬ',
    beverages: 'НАПИТКИ',
    categories: 'КАТЕГОРИИ',
    selectYourBeverage: 'Выберите ваш напиток',
    searchPlaceholder: 'Поиск напитка...',
    featuredDrink: 'ФИРМЕННЫЙ НАПИТОК',
    adminPanel: 'Панель управления',
    guestMenu: 'Меню для гостей',
    login: 'Войти',
    logout: 'Выйти',
    back: 'Назад',

    // Filter Pills
    filterAll: 'Все',
    filterIncluded: 'Включено',
    filterPremium: 'Премиум (Доплата)',
    filterSignature: 'Фирменные',

    // Badges
    badgeFeatured: 'ФИРМЕННЫЙ',
    badgeIncluded: 'ВКЛЮЧЕНО',
    badgeExtra: 'ДОПЛАТА',
    badgeSignature: 'СИГНАТУРА',
    badgeOutOfStock: 'НЕТ В НАЛИЧИИ',

    // Categories
    catCocktails: 'КОКТЕЙЛИ',
    catAlcoholicDrinks: 'АЛКОГОЛЬНЫЕ НАПИТКИ',
    catColdDrinks: 'ХОЛОДНЫЕ НАПИТКИ',
    catTeaCoffee: 'ЧАЙ И КОФЕ',
    drink: 'Напиток',
    drinks: 'Напитков',

    // Menu Card & Detail Modal
    outOfStock: 'Нет в наличии',
    available: 'В наличии',
    volume: 'Объем',
    abv: 'Крепость',
    tastingNotes: 'Вкус и состав',
    ingredients: 'Ингредиенты',
    price: 'Цена',
    currency: 'Валюта',
    close: 'Закрыть',
    viewDetails: 'Подробнее',
    noResultsFound: 'Напитки не найдены.',
    clearSearch: 'Сбросить фильтры',

    // Admin Dashboard
    dashboardTitle: 'Управление барным меню',
    dashboardSubtitle: 'Редактируйте позиции меню, цены и наличие в реальном времени.',
    addNewItem: 'Добавить напиток',
    editItem: 'Редактировать напиток',
    deleteItem: 'Удалить напиток',
    manageCategories: 'Управление категориями',
    addCategory: 'Добавить категорию',
    editCategory: 'Редактировать категорию',
    deleteCategory: 'Удалить категорию',
    categoryName: 'Название категории',
    categoryIcon: 'Иконка',
    sortOrder: 'Порядок',
    saveChanges: 'Сохранить изменения',
    cancel: 'Отмена',
    confirmDelete: 'Подтвердить удаление',
    deleteWarningText: 'Вы уверены, что хотите удалить этот напиток?',

    // Admin Table
    colImage: 'Фото',
    colTitle: 'Название',
    colCategory: 'Категория',
    colSubcategory: 'Подкатегория',
    colPrice: 'Цена',
    colStatus: 'Статус',
    colActions: 'Действия',
    inStockStatus: 'В наличии',
    outOfStockStatus: 'Стоп-лист',
    noItemsInAdmin: 'Напитки не найдены.',
    allCategories: 'Все категории',
    allSubcategories: 'Все подкатегории',
    searchAdminPlaceholder: 'Быстрый поиск по названию или ингредиентам...',
    statTotalItems: 'Всего напитков',
    statActiveItems: 'В наличии',
    statStopListed: 'В стоп-листе',
    statCategories: 'Категорий',
  },
};
