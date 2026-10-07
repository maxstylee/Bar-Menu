import React, { useState, useMemo, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { TuiLogo } from "../components/common/TuiLogo";
import { useMenu } from "../hooks/useMenu";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { MenuCard } from "../components/menu/MenuCard";
import { DrinkDetailModal } from "../components/menu/DrinkDetailModal";
import { LanguageSwitcher } from "../components/common/LanguageSwitcher";
import { WeatherHeaderWidget, WeatherBadge } from "../components/common/WeatherIndicator";
import { CategoryIconRenderer } from "../components/common/CategoryIcons";
import { resolveAssetUrl } from "../utils/assetHelper";
import { CATEGORY_SUBCATEGORIES } from "../utils/mockData";
import {
  Search,
  ArrowLeft,
  ArrowUp,
  X,
  ShieldCheck,
} from "lucide-react";

export function HomePage() {
  const { categoryId: urlCategoryId } = useParams();
  const navigate = useNavigate();

  const {
    categories,
    items,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useMenu();

  const { t, getLocalizedField } = useLanguage();
  const { isAuthenticated } = useAuth();

  // Mobile navigation view state: 'start' (Start Screen with arc & 4 circle categories) | 'list' (Category Detail continuous scroll)
  const [mobileView, setMobileView] = useState(() => (urlCategoryId ? "list" : "start"));

  // Selected beverage for detail modal inspection
  const [selectedDrink, setSelectedDrink] = useState(null);

  // Search bar expand state on mobile
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Active top navigation tab on desktop: 'beverages' | 'welcome'
  const [desktopNavTab, setDesktopNavTab] = useState("beverages");

  // Floating Back to Top button visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Listen for scroll to toggle Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 320);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync route param with selected category & mobile view
  useEffect(() => {
    if (urlCategoryId) {
      if (categories.some((c) => c.id === urlCategoryId) && selectedCategory !== urlCategoryId) {
        setSelectedCategory(urlCategoryId);
      }
      setMobileView("list");
    } else {
      setMobileView("start");
    }
  }, [urlCategoryId, categories, selectedCategory, setSelectedCategory]);

  // Find Featured Drink for the side widget & start screen (TUI Blue Special)
  const featuredItem = useMemo(() => {
    return (
      items.find((i) => i.is_featured) ||
      items.find((i) => i.title_en === "TUI Blue Special") ||
      items[0] ||
      null
    );
  }, [items]);

  // Active category object
  const activeCategoryObj = useMemo(() => {
    return (
      categories.find((c) => c.id === selectedCategory) ||
      categories[0] || {
        id: "cocktails",
        name_en: "COCKTAILS",
      }
    );
  }, [categories, selectedCategory]);

  const activeCategoryTitle =
    getLocalizedField(activeCategoryObj, "name") ||
    activeCategoryObj.name_en ||
    t("catCocktails") ||
    "COCKTAILS";

  // Handlers for category selection
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    navigate(`/category/${catId}`);
    setMobileView("list");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    navigate("/");
    setMobileView("start");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Determine subcategories for the active category in canonical order
  const activeSubcategories = useMemo(() => {
    if (!activeCategoryObj) return [];
    const catId = activeCategoryObj.id;
    const predefined = CATEGORY_SUBCATEGORIES[catId] || [];
    const allInCat = items.filter((i) => i.category_id === catId);
    const extra = [...new Set(allInCat.map((i) => i.subcategory))].filter(
      (s) => s && !predefined.includes(s)
    );
    return [...predefined, ...extra];
  }, [items, activeCategoryObj]);

  // Group drinks belonging to the active category into distinct subcategory blocks
  const subcategoryGroups = useMemo(() => {
    if (!activeCategoryObj) return [];
    const catId = activeCategoryObj.id;
    const allInCat = items.filter((i) => i.category_id === catId);
    const q = searchQuery.toLowerCase().trim();

    return activeSubcategories
      .map((subcatName) => {
        let subcatDrinks = allInCat.filter((i) => i.subcategory === subcatName);

        if (q) {
          subcatDrinks = subcatDrinks.filter((item) => {
            const matchTitle =
              item.title_tr?.toLowerCase().includes(q) ||
              item.title_en?.toLowerCase().includes(q) ||
              item.title_ru?.toLowerCase().includes(q) ||
              item.title_de?.toLowerCase().includes(q);
            const matchDesc =
              item.description_tr?.toLowerCase().includes(q) ||
              item.description_en?.toLowerCase().includes(q) ||
              item.description_ru?.toLowerCase().includes(q) ||
              item.description_de?.toLowerCase().includes(q);
            const matchTags =
              Array.isArray(item.tags) && item.tags.some((tg) => tg.toLowerCase().includes(q));
            return matchTitle || matchDesc || matchTags;
          });
        }

        return {
          name: subcatName,
          items: subcatDrinks,
        };
      })
      .filter((group) => group.items.length > 0 || !q);
  }, [items, activeCategoryObj, activeSubcategories, searchQuery]);

  // Total matching drinks across all subcategories in active category
  const totalCategoryDrinks = useMemo(() => {
    return subcategoryGroups.reduce((acc, g) => acc + g.items.length, 0);
  }, [subcategoryGroups]);

  return (
    <div className="relative min-h-screen bg-[#070d16] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200 overflow-x-hidden">
      {/* ==================================================================== */}
      {/* 1. DESKTOP VIEW (Visible on lg and larger screens)                   */}
      {/* ==================================================================== */}
      <div className="hidden lg:flex flex-col min-h-screen relative">
        {/* Ambient Dark Lounge Bar Background */}
        <div
          className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-45 brightness-90 ken-burns"
          style={{ backgroundImage: `url(${resolveAssetUrl('/images/bg/bar-desktop.webp')})` }}
        />
        <div className="fixed inset-0 bg-gradient-to-b from-[#070d16]/80 via-[#070d16]/70 to-[#070d16]/95 pointer-events-none z-0" />

        {/* Desktop Top Navigation Bar */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#09111c]/70 border-b border-slate-700/40">
          <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-6">
            {/* Left: TUI BLUE Logo & Navigation Tabs */}
            <div className="flex items-center gap-8">
              <TuiLogo variant="inline" />

              <nav className="flex items-center gap-6 text-xs font-bold tracking-wider uppercase">
                <button
                  type="button"
                  onClick={() => setDesktopNavTab("welcome")}
                  className={`transition-colors py-1 ${
                    desktopNavTab === "welcome"
                      ? "text-white border-b-2 border-sky-400 font-extrabold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t("welcome")}
                </button>
                <button
                  type="button"
                  onClick={() => setDesktopNavTab("beverages")}
                  className={`transition-colors py-1 ${
                    desktopNavTab === "beverages"
                      ? "text-white border-b-2 border-sky-400 font-extrabold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t("beverages")}
                </button>
              </nav>
            </div>

            {/* Right: Weather + Search + Language Switcher + Admin */}
            <div className="flex items-center gap-5">
              {/* Live Weather Widget: Side, Antalya • 28° ☀️ */}
              <WeatherHeaderWidget />

              {/* Search Beverage Input */}
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                  className="w-full bg-[#101b2a]/70 hover:bg-[#142337]/80 focus:bg-[#142337] border border-slate-700/60 focus:border-sky-400/70 rounded-full pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Multilingual Switcher: EN | DE | TR | RU */}
              <LanguageSwitcher variant="inline" />

              {/* Discreet Admin Suite Trigger */}
              <Link
                to={isAuthenticated ? "/admin" : "/login"}
                title={isAuthenticated ? t("adminPanel") : t("login")}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/70 text-slate-400 hover:text-white border border-slate-700/50 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-sky-400" />
              </Link>
            </div>
          </div>
        </header>

        {/* Main Desktop Layout: Left Sidebar + Beverage Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-8 flex gap-10 flex-1">
          {/* 1. Left Sidebar: CATEGORIES & Featured Drink Card */}
          <aside className="w-72 shrink-0 flex flex-col justify-between space-y-8 sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto no-scrollbar">
            <div className="space-y-4">
              <h2 className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase px-2 font-outfit">
                {t("categories")}
              </h2>

              {/* Vertical Category Navigation List */}
              <div className="space-y-2.5">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const localizedName = getLocalizedField(cat, "name") || cat.name_en;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-full transition-all text-left group cursor-pointer ${
                        isSelected
                          ? "bg-[#18283d]/80 border border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.22)] backdrop-blur-md"
                          : "hover:bg-slate-800/30 border border-transparent"
                      }`}
                    >
                      {/* Round Line Icon in Ring */}
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isSelected
                            ? "border-sky-400 text-sky-300 bg-sky-950/40 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                            : "border-slate-500/80 text-slate-300 group-hover:border-white group-hover:text-white bg-[#0b1420]/60"
                        }`}
                      >
                        <CategoryIconRenderer
                          categoryId={cat.id}
                          className="w-5 h-5 transition-transform group-hover:scale-110"
                        />
                      </div>

                      {/* Category Label */}
                      <span
                        className={`font-outfit font-extrabold text-xs sm:text-sm tracking-wide uppercase transition-colors ${
                          isSelected
                            ? "text-white"
                            : "text-slate-300 group-hover:text-white"
                        }`}
                      >
                        {localizedName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Left: Featured Drink Card with Weather Badge */}
            {featuredItem && (
              <div
                onClick={() => setSelectedDrink(featuredItem)}
                className="group relative p-4 rounded-3xl glass glass-hover cursor-pointer border border-slate-700/60 overflow-hidden"
              >
                {/* Weather Indicator in Top Right Corner */}
                <div className="absolute top-3.5 right-4 z-10">
                  <WeatherBadge />
                </div>

                <div className="flex items-center gap-3.5 pt-2">
                  {/* Round Cocktail Photo */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-sky-400/70 shadow-[0_0_16px_rgba(56,189,248,0.35)] bg-slate-900">
                    <img
                      src={resolveAssetUrl(featuredItem.current_image_url || "/images/drinks/tui-blue-special.webp")}
                      alt={featuredItem.title_en}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Drink Titles */}
                  <div className="flex-1 min-w-0 pr-8">
                    <span className="block text-[10px] font-extrabold tracking-wider text-slate-400 uppercase font-outfit">
                      {t("featuredDrink")}
                    </span>
                    <h4 className="font-outfit font-black text-sm text-white uppercase tracking-wide leading-tight group-hover:text-sky-300 transition-colors line-clamp-2">
                      {getLocalizedField(featuredItem, "title") || featuredItem.title_en}
                    </h4>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* 2. Main Content Area: Continuous Scroll View with Subcategory Sections */}
          <main className="flex-1 min-w-0">
            {/* Header: Category Title + Subtitle */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-black font-outfit uppercase tracking-tight text-white flex items-center gap-3">
                {activeCategoryTitle}
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
                {t("selectYourBeverage")}
              </p>
            </div>

            {/* Continuous Scroll View: Distinct Subcategory Blocks */}
            {loading ? (
              <div className="space-y-8">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="h-10 w-48 rounded-xl bg-slate-800/40 border border-slate-700/30 animate-pulse" />
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-28 rounded-2xl bg-slate-800/40 border border-slate-700/30 animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : totalCategoryDrinks === 0 ? (
              <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto my-12 border border-slate-700/50">
                <Search className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white font-outfit">
                  {t("noResultsFound")}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Try clearing your search query.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-4 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  {t("clearSearch")}
                </button>
              </div>
            ) : (
              <div className="space-y-10 animate-fade-in">
                {subcategoryGroups.map((group) => {
                  if (group.items.length === 0) return null;

                  return (
                    <section
                      key={group.name}
                      id={`subcat-${group.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                      className="relative scroll-mt-24"
                    >
                      {/* Elegant Prominent Centered Section Header with Subtle Accent Lines */}
                      <div className="sticky top-[72px] z-30 -mx-3 px-4 py-4 backdrop-blur-xl bg-[#070d16]/95 border-y border-slate-700/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)] my-8 transition-all">
                        <div className="flex items-center justify-center gap-4 w-full">
                          {/* Left Subtle Accent Line */}
                          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-500/30 to-sky-400/80" />

                          {/* Centered Subcategory Header with Accent Pip & Drink Counter */}
                          <div className="flex items-center justify-center gap-3 px-3 shrink-0">
                            <span className="w-2 h-6 rounded-full bg-gradient-to-b from-sky-400 to-sky-600 shadow-[0_0_12px_rgba(56,189,248,0.7)] shrink-0" />
                            <h2 className="font-outfit font-black text-xl xl:text-2xl tracking-widest text-white uppercase text-center drop-shadow-sm">
                              {group.name}
                            </h2>
                            <span className="text-xs font-bold tracking-wider font-outfit uppercase px-3 py-1 rounded-full bg-[#101b2a] text-sky-300 border border-sky-400/40 shadow-[0_0_10px_rgba(56,189,248,0.25)] shrink-0">
                              {group.items.length}{" "}
                              {group.items.length === 1 ? (t("drink") || "Drink") : (t("drinks") || "Drinks")}
                            </span>
                          </div>

                          {/* Right Subtle Accent Line */}
                          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-sky-500/30 to-sky-400/80" />
                        </div>
                      </div>

                      {/* Drinks Grid: 2 Columns matching Desktop Design */}
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-2">
                        {group.items.map((item) => (
                          <MenuCard
                            key={item.id}
                            item={item}
                            onClick={(drink) => setSelectedDrink(drink)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. MOBILE VIEW (Visible on screens < lg)                             */}
      {/* ==================================================================== */}
      <div className="lg:hidden min-h-screen relative flex flex-col">
        {/* ================================================================== */}
        {/* VIEW A: MOBILE START SCREEN                                        */}
        {/* ================================================================== */}
        {mobileView === "start" && (
          <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
            {/* Background Image: Atmospheric breakfast/drink table */}
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none z-0 brightness-95"
              style={{ backgroundImage: `url(${resolveAssetUrl('/images/bg/start-mobile.webp')})` }}
            />
            <div className="absolute inset-0 bg-black/40 pointer-events-none z-0" />

            {/* Mobile Start Screen Top Bar: TUI Logo + Language & Admin */}
            <div className="relative z-20 flex items-center justify-between p-4 pt-5">
              <TuiLogo variant="inline" className="scale-90 origin-left" />
              <div className="flex items-center gap-2">
                <LanguageSwitcher variant="dropdown" />
                <Link
                  to={isAuthenticated ? "/admin" : "/login"}
                  className="p-2 rounded-xl bg-black/40 border border-white/20 text-sky-400 backdrop-blur-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Middle Section: Semicircular Arc Cutout (Left) + 4 Category Icons (Right) */}
            <div className="relative z-10 flex-1 flex items-center justify-between px-3 py-6">
              {/* Left Side: Large Semicircular Overlay Container */}
              <div
                onClick={() => featuredItem && setSelectedDrink(featuredItem)}
                className="relative w-[52%] max-w-[220px] aspect-square rounded-r-full bg-black/65 backdrop-blur-xl border-y border-r border-white/25 flex flex-col justify-between p-3.5 pr-4 -ml-4 shadow-[0_10px_35px_rgba(0,0,0,0.6)] cursor-pointer group disc-in"
              >
                {/* Upper Half: Featured Drink with Image & Title */}
                <div className="flex flex-col items-start gap-1 pt-1">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.5)] bg-slate-900 shrink-0">
                    <img
                      src={resolveAssetUrl(featuredItem?.current_image_url || "/images/drinks/tui-blue-special.webp")}
                      alt="TUI Blue Special"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-300 mt-1">
                    {t("featuredDrink")}
                  </span>
                  <span className="font-outfit font-black text-xs text-white uppercase tracking-wider leading-tight">
                    {featuredItem ? (getLocalizedField(featuredItem, "title") || featuredItem.title_en) : "TUI BLUE SPECIAL"}
                  </span>
                </div>

                {/* Divider Line */}
                <div className="w-full h-px bg-white/20 my-1" />

                {/* Lower Half: Antalya Live Weather */}
                <div className="pb-1">
                  <WeatherBadge />
                </div>
              </div>

              {/* Right Side: Vertical Stack of 4 Round Category Buttons */}
              <div className="flex-1 flex flex-col items-start justify-center gap-3 pl-2.5 space-y-1.5 slide-in-right">
                {categories.map((cat) => {
                  const localizedName = getLocalizedField(cat, "name") || cat.name_en;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className="w-full flex items-center gap-3.5 group text-left transition-transform active:scale-95 cursor-pointer min-h-[48px] py-1.5"
                    >
                      {/* Outline Circle Icon */}
                      <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-white/80 bg-black/40 backdrop-blur-md text-white group-hover:border-sky-400 group-hover:text-sky-300 group-hover:shadow-[0_0_16px_rgba(56,189,248,0.5)] transition-all shrink-0">
                        <CategoryIconRenderer categoryId={cat.id} className="w-6 h-6" />
                      </div>

                      {/* Category Label */}
                      <span className="font-outfit font-extrabold text-sm sm:text-base uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] group-hover:text-sky-300 transition-colors leading-tight">
                        {localizedName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Start Screen Footer */}
            <div className="relative z-10 text-center pb-4 text-[11px] text-slate-400/80 font-medium">
              <span>{t("brandTitle")} Bar & Lounge</span>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* VIEW B: MOBILE DEDICATED CATEGORY DETAIL CONTINUOUS SCROLL SCREEN  */}
        {/* ================================================================== */}
        {mobileView === "list" && (
          <div className="relative min-h-screen flex flex-col bg-[#070d16]">
            {/* Ambient Background */}
            <div
              className="fixed inset-0 bg-cover bg-center pointer-events-none opacity-40 brightness-75"
              style={{ backgroundImage: `url(${resolveAssetUrl('/images/bg/bar-desktop.webp')})` }}
            />
            <div className="fixed inset-0 bg-gradient-to-b from-[#070d16]/90 via-[#070d16]/85 to-[#070d16] pointer-events-none" />

            {/* Sticky Mobile Header (Back Button, Title, Search, TUI Logo Badge) */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#09111c]/90 border-b border-slate-800/80">
              <div className="px-4 h-16 flex items-center justify-between gap-3">
                {/* Left: Back Button + Title */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={handleBackToHome}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-white hover:text-sky-300 active:scale-90 transition-all cursor-pointer"
                    aria-label="Back to categories"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h1 className="font-outfit font-black text-lg sm:text-xl uppercase tracking-wide text-white truncate">
                    {activeCategoryTitle}
                  </h1>
                </div>

                {/* Right: Search Toggle Button + Compact TUI Logo Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:text-sky-300 active:scale-90 transition-all cursor-pointer"
                    aria-label="Search drinks"
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  <TuiLogo variant="badge" />
                </div>
              </div>

              {/* Expandable Search Input on Mobile */}
              {mobileSearchOpen && (
                <div className="px-4 pb-3 animate-slide-up">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("searchPlaceholder")}
                      className="w-full bg-[#101b2a] border border-slate-700 rounded-full pl-9 pr-9 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 shadow-inner"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </header>

            {/* Mobile Dedicated Continuous Scroll Flow with Visual Subcategory Sections */}
            <main className="relative z-10 flex-1 px-4 py-4">
              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="h-8 w-40 rounded-xl bg-slate-800/40 border border-slate-700/30 animate-pulse" />
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-24 rounded-2xl bg-slate-800/40 border border-slate-700/30 animate-pulse"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              ) : totalCategoryDrinks === 0 ? (
                <div className="glass rounded-3xl p-8 text-center my-8 border border-slate-700/50">
                  <Search className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-white font-outfit">
                    {t("noResultsFound")}
                  </h3>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 px-4 py-1.5 rounded-full bg-sky-500 text-slate-950 font-bold text-xs"
                  >
                    {t("clearSearch")}
                  </button>
                </div>
              ) : (
                <div className="space-y-8 animate-fade-in">
                  {subcategoryGroups.map((group) => {
                    if (group.items.length === 0) return null;

                    return (
                      <section
                        key={group.name}
                        id={`subcat-mobile-${group.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                        className="relative scroll-mt-20"
                      >
                        {/* Prominent Centered Sticky Subcategory Section Header with Elegant Accent Lines */}
                        <div className="sticky top-16 z-30 -mx-4 px-4 py-3.5 backdrop-blur-xl bg-[#09111c]/95 border-y border-slate-800/90 shadow-[0_4px_16px_rgba(0,0,0,0.6)] my-6">
                          <div className="flex items-center justify-center gap-3 w-full">
                            {/* Left Accent Gradient Line */}
                            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-sky-500/30 to-sky-400/80" />

                            {/* Centered Subcategory Header with Glowing Pip & Counter Badge */}
                            <div className="flex items-center justify-center gap-2.5 px-2 shrink-0 max-w-[85%]">
                              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-sky-400 to-sky-600 shadow-[0_0_10px_rgba(56,189,248,0.7)] shrink-0" />
                              <h2 className="font-outfit font-black text-base sm:text-lg tracking-wider text-white uppercase text-center drop-shadow truncate">
                                {group.name}
                              </h2>
                              <span className="text-[11px] font-bold tracking-wider font-outfit uppercase px-2 py-0.5 rounded-full bg-[#101b2a] text-sky-300 border border-sky-400/35 shadow-[0_0_8px_rgba(56,189,248,0.2)] shrink-0">
                                {group.items.length}
                              </span>
                            </div>

                            {/* Right Accent Gradient Line */}
                            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-sky-500/30 to-sky-400/80" />
                          </div>
                        </div>

                        {/* 1-Column Mobile Drinks List */}
                        <div className="space-y-3 pb-2">
                          {group.items.map((item) => (
                            <MenuCard
                              key={item.id}
                              item={item}
                              onClick={(drink) => setSelectedDrink(drink)}
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full bg-[#0e1726]/90 hover:bg-sky-500 text-sky-300 hover:text-slate-950 border border-sky-400/40 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all active:scale-90 cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Drink Detail Modal (Shared across Desktop & Mobile) */}
      <DrinkDetailModal
        item={selectedDrink}
        isOpen={Boolean(selectedDrink)}
        onClose={() => setSelectedDrink(null)}
      />
    </div>
  );
}

export default HomePage;
