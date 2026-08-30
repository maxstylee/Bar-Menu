/**
 * Multilingual Translation Dictionaries for TUI BLUE Bar Menu
 * Supported Languages: Turkish ('tr'), English ('en'), Russian ('ru'), German ('de')
 */

export const supportedLanguages = [
  { code: 'tr', name: 'Türkçe', label: 'TR' },
  { code: 'en', name: 'English', label: 'EN' },
  { code: 'ru', name: 'Русский', label: 'RU' },
  { code: 'de', name: 'Deutsch', label: 'DE' },
];

export function formatItemPrice(price, currency = 'EUR') {
  const num = Number(price) || 0;
  if (currency === 'USD') {
    return `$${num.toFixed(2)}`;
  }
  if (currency === 'TRY') {
    return `₺${num.toFixed(0)}`;
  }
  return `€${num.toFixed(2)}`;
}

export const translations = {
  tr: {
    // Branding & Header
    brandTitle: 'TUI BLUE',
    brandSubtitle: 'Lounge & Bar Menü',
    adminPanel: 'Yönetim Paneli',
    guestMenu: 'Misafir Menüsü',
    login: 'Giriş Yap',
    logout: 'Çıkış Yap',
    welcomeAdmin: 'Hoş Geldiniz, Yönetici',

    // Hero Section
    allDrinks: 'Tüm İçecekler',
    alcoholic: 'Alkollü',
    nonAlcoholic: 'Alkolsüz & Mocktail',
    searchPlaceholder: 'İçecek veya içerik ara (örn: Macallan, Passionfruit, Espresso)...',
    noResultsFound: 'Aramanızla eşleşen içecek bulunamadı.',
    clearSearch: 'Aramayı Temizle',

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

    // Admin Dashboard & Category Manager
    dashboardTitle: 'Bar İçecek Yönetim Merkezi',
    dashboardSubtitle: 'Menüdeki içecekleri düzenleyin, anlık fiyat güncelleyin ve kategorileri yönetin.',
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
    deleteWarningText: 'Bu içeceği menüden kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    deleteCategoryWarning: 'Bu kategoriyi silmek istediğinizden emin misiniz? Kategorideki içecekler kategorisiz olarak işaretlenecektir.',

    // Stats Bar
    statTotalItems: 'Toplam İçecek',
    statActiveItems: 'Menüde Aktif',
    statStopListed: 'Tükenen / Stop-List',
    statCategories: 'Kategori Sayısı',

    // Table Columns & Admin Actions
    colImage: 'Görsel',
    colTitle: 'İçecek Adı',
    colCategory: 'Kategori',
    colPrice: 'Fiyat',
    colVolume: 'Hacim / Alkol',
    colStatus: 'Durum',
    colActions: 'İşlemler',
    quickEditPrice: 'Hızlı Fiyat Güncelle',
    toggleAvailability: 'Stok Durumunu Değiştir',
    inStockStatus: 'Satışta',
    outOfStockStatus: 'Stop-List',
    noItemsInAdmin: 'Henüz kayıtlı içecek bulunmuyor.',

    // Dual-Image Engine & Upload
    dualImageTitle: 'Çift Görsel Yönetimi',
    activeSlot: 'Aktif Görsel',
    backupSlot: 'Yedek Görsel',
    restorePrevious: 'Önceki Görsele Dön',
    uploadNewImage: 'Yeni Görsel Yükle (Otomatik Optimize <200KB)',
    noBackupImage: 'Yedek görsel yok',
    compressionNotice: 'Görseller istemci tarafında otomatik olarak optimize edilir.',
    dragDropText: 'Görseli buraya sürükleyin veya dosya seçin',
    fileSupport: 'PNG, JPG, JPEG desteklenir (Maks 1200px, <200KB)',
    imageCompressedSuccess: 'Görsel başarıyla optimize edildi',

    // Form Fields
    fieldCategory: 'Kategori Seçiniz',
    fieldPrice: 'Fiyat',
    fieldCurrency: 'Para Birimi',
    fieldVolume: 'Hacim (ml)',
    fieldAbv: 'Alkol Oranı (% ABV)',
    fieldIsAlcoholic: 'Alkollü İçecek',
    fieldIsAvailable: 'Misafir Menüsünde Satışa Açık',
    fieldTags: 'Etiketler (Virgülle ayırın: Signature, Smoky, Fruity)',
    tabTR: 'Türkçe',
    tabEN: 'English',
    tabRU: 'Русский',
    tabDE: 'Deutsch',
    titleLabel: 'İçecek Adı',
    descLabel: 'Açıklama / Tat Profili',

    // Auth & Login
    adminLoginTitle: 'Yönetici Girişi',
    adminLoginSubtitle: 'TUI BLUE Bar Yönetim Sistemine erişmek için kimliğinizi doğrulayın.',
    emailLabel: 'E-posta Adresi',
    passwordLabel: 'Şifre',
    signInButton: 'Giriş Yap',
    demoAdminButton: 'Hızlı Demo Yönetici Girişi (Yerel Mod)',
    demoAdminNote: 'Supabase bağlantısı olmadan anında test etmek için demo yönetici modunu kullanabilirsiniz.',
    loginError: 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.',
    loginSuccess: 'Yönetici girişi başarılı.',
    logoutSuccess: 'Başarıyla çıkış yapıldı.',

    // Toast Notifications
    toastItemAdded: 'İçecek başarıyla menüye eklendi.',
    toastItemUpdated: 'İçecek bilgileri güncellendi.',
    toastItemDeleted: 'İçecek menüden silindi.',
    toastPriceUpdated: 'Fiyat anında güncellendi.',
    toastStatusToggled: 'İçecek stok durumu güncellendi.',
    toastImageRestored: 'Önceki görsel başarıyla geri yüklendi.',
    toastCategoryAdded: 'Kategori başarıyla eklendi.',
    toastCategoryUpdated: 'Kategori bilgileri güncellendi.',
    toastCategoryDeleted: 'Kategori başarıyla silindi.',
    toastError: 'Bir hata oluştu. Lütfen tekrar deneyin.',
  },

  en: {
    // Branding & Header
    brandTitle: 'TUI BLUE',
    brandSubtitle: 'Lounge & Bar Menu',
    adminPanel: 'Admin Control Panel',
    guestMenu: 'Guest Menu',
    login: 'Sign In',
    logout: 'Sign Out',
    welcomeAdmin: 'Welcome, Bar Manager',

    // Hero Section
    allDrinks: 'All Beverages',
    alcoholic: 'Alcoholic',
    nonAlcoholic: 'Non-Alcoholic & Mocktails',
    searchPlaceholder: 'Search drinks, tasting notes, ingredients (e.g. Macallan, Passionfruit, Espresso)...',
    noResultsFound: 'No beverages found matching your search.',
    clearSearch: 'Clear Search',

    // Menu Card & Detail Modal
    outOfStock: 'Sold Out (Stop-List)',
    available: 'Available',
    volume: 'Volume',
    abv: 'Alcohol by Volume',
    tastingNotes: 'Tasting Notes & Profile',
    ingredients: 'Detailed Ingredients',
    price: 'Price',
    currency: 'Currency',
    close: 'Close',
    viewDetails: 'View Details',

    // Admin Dashboard & Category Manager
    dashboardTitle: 'Bar Beverage Management Suite',
    dashboardSubtitle: 'Manage the live beverage catalog, perform inline quick price adjustments, and organize categories.',
    addNewItem: 'Add New Beverage',
    editItem: 'Edit Beverage',
    deleteItem: 'Delete Beverage',
    manageCategories: 'Manage Categories',
    addCategory: 'Add New Category',
    editCategory: 'Edit Category',
    deleteCategory: 'Delete Category',
    categoryName: 'Category Name',
    categoryIcon: 'Icon',
    sortOrder: 'Sort Order',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    confirmDelete: 'Confirm Deletion',
    deleteWarningText: 'Are you sure you want to permanently delete this beverage from the menu? This action cannot be undone.',
    deleteCategoryWarning: 'Are you sure you want to delete this category? Beverages in this category will be unassigned.',

    // Stats Bar
    statTotalItems: 'Total Beverages',
    statActiveItems: 'Active on Menu',
    statStopListed: 'Stop-Listed / Out',
    statCategories: 'Menu Categories',

    // Table Columns & Admin Actions
    colImage: 'Image',
    colTitle: 'Beverage Name',
    colCategory: 'Category',
    colPrice: 'Price',
    colVolume: 'Volume / ABV',
    colStatus: 'Status',
    colActions: 'Actions',
    quickEditPrice: 'Quick Price Edit',
    toggleAvailability: 'Toggle Stop-List',
    inStockStatus: 'Live',
    outOfStockStatus: 'Stop-List',
    noItemsInAdmin: 'No beverages currently listed in the database.',

    // Dual-Image Engine & Upload
    dualImageTitle: 'Dual Image Management',
    activeSlot: 'Active Drink Image',
    backupSlot: 'Previous Backup Image',
    restorePrevious: 'Rollback to Previous Image',
    uploadNewImage: 'Upload New Image (Auto Optimized <200KB)',
    noBackupImage: 'No backup image available',
    compressionNotice: 'Images are client-side optimized and scaled to 1200px max width.',
    dragDropText: 'Drag & drop image here or browse',
    fileSupport: 'PNG, JPG, JPEG supported (Max 1200px, <200KB)',
    imageCompressedSuccess: 'Image compressed & optimized successfully',

    // Form Fields
    fieldCategory: 'Select Category',
    fieldPrice: 'Price',
    fieldCurrency: 'Currency',
    fieldVolume: 'Volume (ml)',
    fieldAbv: 'Alcohol Content (% ABV)',
    fieldIsAlcoholic: 'Contains Alcohol',
    fieldIsAvailable: 'Live on Guest Menu',
    fieldTags: 'Tags (comma separated: Signature, Smoky, Fruity)',
    tabTR: 'Türkçe',
    tabEN: 'English',
    tabRU: 'Русский',
    tabDE: 'Deutsch',
    titleLabel: 'Beverage Title',
    descLabel: 'Description & Tasting Notes',

    // Auth & Login
    adminLoginTitle: 'Admin Authentication',
    adminLoginSubtitle: 'Verify your credentials to access the TUI BLUE Beverage Management System.',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    signInButton: 'Sign In to Dashboard',
    demoAdminButton: '1-Click Demo Admin Mode (Local)',
    demoAdminNote: 'Test all features immediately in local offline mode without configuring Supabase.',
    loginError: 'Invalid credentials. Please verify your email and password.',
    loginSuccess: 'Admin authenticated successfully.',
    logoutSuccess: 'Signed out successfully.',

    // Toast Notifications
    toastItemAdded: 'Beverage added to the menu successfully.',
    toastItemUpdated: 'Beverage details updated.',
    toastItemDeleted: 'Beverage removed from the menu.',
    toastPriceUpdated: 'Price updated instantly.',
    toastStatusToggled: 'Stop-list availability updated.',
    toastImageRestored: 'Previous image restored successfully.',
    toastCategoryAdded: 'Category added successfully.',
    toastCategoryUpdated: 'Category updated successfully.',
    toastCategoryDeleted: 'Category deleted successfully.',
    toastError: 'An error occurred. Please try again.',
  },

  ru: {
    // Branding & Header
    brandTitle: 'TUI BLUE',
    brandSubtitle: 'Меню лаундж-бара',
    adminPanel: 'Панель управления',
    guestMenu: 'Меню для гостей',
    login: 'Вход для персонала',
    logout: 'Выйти',
    welcomeAdmin: 'Добро пожаловать, Управляющий баром',

    // Hero Section
    allDrinks: 'Все напитки',
    alcoholic: 'Алкогольные',
    nonAlcoholic: 'Безалкогольные и моктейли',
    searchPlaceholder: 'Поиск по названию или ингредиентам (напр. Макаллан, Маракуйя, Эспрессо)...',
    noResultsFound: 'Напитков по вашему запросу не найдено.',
    clearSearch: 'Очистить поиск',

    // Menu Card & Detail Modal
    outOfStock: 'Временно нет (Стоп-лист)',
    available: 'В наличии',
    volume: 'Объем',
    abv: 'Крепость',
    tastingNotes: 'Вкусовой профиль и ноты',
    ingredients: 'Подробный состав',
    price: 'Цена',
    currency: 'Валюта',
    close: 'Закрыть',
    viewDetails: 'Подробнее',

    // Admin Dashboard & Category Manager
    dashboardTitle: 'Управление напитками бара',
    dashboardSubtitle: 'Редактируйте каталог напитков, меняйте цены в один клик и управляйте категориями.',
    addNewItem: 'Добавить напиток',
    editItem: 'Редактировать',
    deleteItem: 'Удалить',
    manageCategories: 'Управление категориями',
    addCategory: 'Добавить категорию',
    editCategory: 'Редактировать категорию',
    deleteCategory: 'Удалить категорию',
    categoryName: 'Название категории',
    categoryIcon: 'Иконка',
    sortOrder: 'Порядок',
    saveChanges: 'Сохранить изменения',
    cancel: 'Отмена',
    confirmDelete: 'Подтвердите удаление',
    deleteWarningText: 'Вы уверены, что хотите навсегда удалить этот напиток из меню? Это действие необратимо.',
    deleteCategoryWarning: 'Вы уверены, что хотите удалить эту категорию?',

    // Stats Bar
    statTotalItems: 'Всего напитков',
    statActiveItems: 'Активны в меню',
    statStopListed: 'В стоп-листе',
    statCategories: 'Категорий меню',

    // Table Columns & Admin Actions
    colImage: 'Фото',
    colTitle: 'Название напитка',
    colCategory: 'Категория',
    colPrice: 'Цена',
    colVolume: 'Объем / Крепость',
    colStatus: 'Статус',
    colActions: 'Действия',
    quickEditPrice: 'Быстрая цена',
    toggleAvailability: 'Стоп-лист',
    inStockStatus: 'В меню',
    outOfStockStatus: 'Стоп-лист',
    noItemsInAdmin: 'В базе данных пока нет напитков.',

    // Dual-Image Engine & Upload
    dualImageTitle: 'Управление изображениями',
    activeSlot: 'Активное фото',
    backupSlot: 'Резервное фото',
    restorePrevious: 'Откатить к предыдущему фото',
    uploadNewImage: 'Загрузить новое фото (Авто оптимизация <200KB)',
    noBackupImage: 'Резервное фото отсутствует',
    compressionNotice: 'Изображения автоматически сжимаются на стороне клиента до 1200px.',
    dragDropText: 'Перетащите изображение сюда или выберите файл',
    fileSupport: 'Поддерживаются PNG, JPG, JPEG (Макс 1200px, <200KB)',
    imageCompressedSuccess: 'Изображение успешно оптимизировано',

    // Form Fields
    fieldCategory: 'Выберите категорию',
    fieldPrice: 'Цена',
    fieldCurrency: 'Валюта',
    fieldVolume: 'Объем (мл)',
    fieldAbv: 'Крепость (% ABV)',
    fieldIsAlcoholic: 'Содержит алкоголь',
    fieldIsAvailable: 'Отображать в меню для гостей',
    fieldTags: 'Теги (через запятую: Signature, Smoky, Fruity)',
    tabTR: 'Türkçe',
    tabEN: 'English',
    tabRU: 'Русский',
    tabDE: 'Deutsch',
    titleLabel: 'Название напитка',
    descLabel: 'Описание и вкусовые ноты',

    // Auth & Login
    adminLoginTitle: 'Авторизация администратора',
    adminLoginSubtitle: 'Войдите в систему управления баром TUI BLUE.',
    emailLabel: 'Электронная почта',
    passwordLabel: 'Пароль',
    signInButton: 'Войти в панель',
    demoAdminButton: 'Вход в демо-режиме (Локально)',
    demoAdminNote: 'Позволяет протестировать весь функционал локально без настройки Supabase.',
    loginError: 'Неверный логин или пароль.',
    loginSuccess: 'Успешный вход в систему.',
    logoutSuccess: 'Вы успешно вышли из системы.',

    // Toast Notifications
    toastItemAdded: 'Напиток успешно добавлен в меню.',
    toastItemUpdated: 'Данные напитка обновлены.',
    toastItemDeleted: 'Напиток удален из меню.',
    toastPriceUpdated: 'Цена обновлена.',
    toastStatusToggled: 'Статус стоп-листа обновлен.',
    toastImageRestored: 'Предыдущее фото успешно восстановлено.',
    toastCategoryAdded: 'Категория успешно добавлена.',
    toastCategoryUpdated: 'Категория успешно обновлена.',
    toastCategoryDeleted: 'Категория успешно удалена.',
    toastError: 'Произошла ошибка. Попробуйте снова.',
  },

  de: {
    // Branding & Header
    brandTitle: 'TUI BLUE',
    brandSubtitle: 'Lounge & Bar Getränkekarte',
    adminPanel: 'Admin-Verwaltung',
    guestMenu: 'Gästekarte',
    login: 'Anmelden',
    logout: 'Abmelden',
    welcomeAdmin: 'Willkommen, Bar-Manager',

    // Hero Section
    allDrinks: 'Alle Getränke',
    alcoholic: 'Alkoholisch',
    nonAlcoholic: 'Alkoholfrei & Mocktails',
    searchPlaceholder: 'Getränke, Zutaten oder Aromen suchen (z. B. Macallan, Maracuja, Espresso)...',
    noResultsFound: 'Keine passenden Getränke gefunden.',
    clearSearch: 'Suche zurücksetzen',

    // Menu Card & Detail Modal
    outOfStock: 'Ausverkauft (Stop-List)',
    available: 'Verfügbar',
    volume: 'Volumen',
    abv: 'Alkoholgehalt',
    tastingNotes: 'Geschmacksprofil & Noten',
    ingredients: 'Detaillierte Zutaten',
    price: 'Preis',
    currency: 'Währung',
    close: 'Schließen',
    viewDetails: 'Details ansehen',

    // Admin Dashboard & Category Manager
    dashboardTitle: 'Bar-Getränkeverwaltung',
    dashboardSubtitle: 'Verwalten Sie das Live-Menü, passen Sie Preise direkt an und verwalten Sie Kategorien.',
    addNewItem: 'Neues Getränk hinzufügen',
    editItem: 'Getränk bearbeiten',
    deleteItem: 'Getränk löschen',
    manageCategories: 'Kategorien verwalten',
    addCategory: 'Neue Kategorie hinzufügen',
    editCategory: 'Kategorie bearbeiten',
    deleteCategory: 'Kategorie löschen',
    categoryName: 'Kategoriename',
    categoryIcon: 'Icon',
    sortOrder: 'Sortierung',
    saveChanges: 'Änderungen speichern',
    cancel: 'Abbrechen',
    confirmDelete: 'Löschen bestätigen',
    deleteWarningText: 'Möchten Sie dieses Getränk wirklich dauerhaft aus der Karte entfernen? Diese Aktion kann nicht rückgängig gemacht werden.',
    deleteCategoryWarning: 'Möchten Sie diese Kategorie wirklich löschen?',

    // Stats Bar
    statTotalItems: 'Gesamt Getränke',
    statActiveItems: 'Aktiv auf Karte',
    statStopListed: 'In Stop-Liste',
    statCategories: 'Kategorien',

    // Table Columns & Admin Actions
    colImage: 'Bild',
    colTitle: 'Getränkename',
    colCategory: 'Kategorie',
    colPrice: 'Preis',
    colVolume: 'Volumen / Vol.-%',
    colStatus: 'Status',
    colActions: 'Aktionen',
    quickEditPrice: 'Schnellpreis ändern',
    toggleAvailability: 'Stop-Liste umschalten',
    inStockStatus: 'Aktiv',
    outOfStockStatus: 'Stop-Liste',
    noItemsInAdmin: 'Keine Getränke in der Datenbank vorhanden.',

    // Dual-Image Engine & Upload
    dualImageTitle: 'Duale Bildverwaltung',
    activeSlot: 'Aktives Getränkebild',
    backupSlot: 'Vorheriges Backup-Bild',
    restorePrevious: 'Auf vorheriges Bild zurücksetzen',
    uploadNewImage: 'Neues Bild hochladen (Auto Optimiert <200KB)',
    noBackupImage: 'Kein Backup-Bild vorhanden',
    compressionNotice: 'Bilder werden clientseitig automatisch optimiert und auf maximal 1200px skaliert.',
    dragDropText: 'Bild hierhin ziehen oder Datei auswählen',
    fileSupport: 'PNG, JPG, JPEG unterstützt (Max 1200px, <200KB)',
    imageCompressedSuccess: 'Bild erfolgreich optimiert',

    // Form Fields
    fieldCategory: 'Kategorie auswählen',
    fieldPrice: 'Preis',
    fieldCurrency: 'Währung',
    fieldVolume: 'Volumen (ml)',
    fieldAbv: 'Alkoholgehalt (% Vol.)',
    fieldIsAlcoholic: 'Enthält Alkohol',
    fieldIsAvailable: 'In der Gästekarte anzeigen',
    fieldTags: 'Tags (kommagetrennt: Signature, Smoky, Fruity)',
    tabTR: 'Türkçe',
    tabEN: 'English',
    tabRU: 'Русский',
    tabDE: 'Deutsch',
    titleLabel: 'Getränkename',
    descLabel: 'Beschreibung & Geschmacksnoten',

    // Auth & Login
    adminLoginTitle: 'Admin-Authentifizierung',
    adminLoginSubtitle: 'Melden Sie sich an, um Zugriff auf das TUI BLUE Barsystem zu erhalten.',
    emailLabel: 'E-Mail-Adresse',
    passwordLabel: 'Passwort',
    signInButton: 'Anmelden',
    demoAdminButton: '1-Klick Demo-Admin-Modus (Lokal)',
    demoAdminNote: 'Ermöglicht das sofortige Testen aller Funktionen im lokalen Offline-Modus.',
    loginError: 'Ungültige Anmeldedaten. Bitte überprüfen Sie E-Mail und Passwort.',
    loginSuccess: 'Erfolgreich angemeldet.',
    logoutSuccess: 'Erfolgreich abgemeldet.',

    // Toast Notifications
    toastItemAdded: 'Getränk erfolgreich zur Karte hinzugefügt.',
    toastItemUpdated: 'Getränkedetails aktualisiert.',
    toastItemDeleted: 'Getränk aus der Karte gelöscht.',
    toastPriceUpdated: 'Preis sofort aktualisiert.',
    toastStatusToggled: 'Verfügbarkeitsstatus aktualisiert.',
    toastImageRestored: 'Vorheriges Bild erfolgreich wiederhergestellt.',
    toastCategoryAdded: 'Kategorie erfolgreich hinzugefügt.',
    toastCategoryUpdated: 'Kategorie erfolgreich aktualisiert.',
    toastCategoryDeleted: 'Kategorie erfolgreich gelöscht.',
    toastError: 'Ein Fehler ist aufgetreten. Bitte erneut versuchen.',
  },
};
