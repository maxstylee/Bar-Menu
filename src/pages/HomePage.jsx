import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMenu } from "../hooks/useMenu";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { CategoryTabs } from "../components/menu/CategoryTabs";
import { SearchBar } from "../components/menu/SearchBar";
import { FilterPills } from "../components/menu/FilterPills";
import { MenuCard } from "../components/menu/MenuCard";
import { DrinkDetailModal } from "../components/menu/DrinkDetailModal";
import { LanguageSwitcher } from "../components/common/LanguageSwitcher";
import { SkeletonGrid } from "../components/common/SkeletonLoader";
import { Badge } from "../components/common/Badge";
import {
  Sparkles,
  ShieldCheck,
  Wine,
  GlassWater,
  Flame,
  Search,
  SlidersHorizontal,
} from "lucide-react";

export function HomePage() {
  const {
    categories,
    items,
    filteredItems,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    dietaryFilter,
    setDietaryFilter,
  } = useMenu();

  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [selectedDrink, setSelectedDrink] = useState(null);

  // Compute item counts per category
  const itemCounts = useMemo(() => {
    const counts = {};
    items.forEach((item) => {
      counts[item.category_id] = (counts[item.category_id] || 0) + 1;
    });
    return counts;
  }, [items]);

  return (
    <div className="min-h-screen bg-[#0c1017] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-300">
      {/* 1. Sticky Luxury Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0c1017]/85 border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#131b2a] border border-amber-500/30 flex items-center justify-center p-1.5 shadow-amber-glow">
              <img
                src="/src/assets/logo.svg"
                alt="TUI Blue Logo"
                className="w-full h-full"
              />
            </div>
            <div>
              <h1 className="font-outfit font-extrabold text-base sm:text-lg tracking-wide text-white flex items-center gap-1.5">
                <span>{t("brandTitle")}</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                  LOUNGE
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">
                {t("brandSubtitle")}
              </p>
            </div>
          </div>

          {/* Header Controls: Language Switcher + Admin Button */}
          <div className="flex items-center gap-2.5">
            <LanguageSwitcher variant="dropdown" />

            <Link
              to={isAuthenticated ? "/admin" : "/login"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161f30] hover:bg-[#1e293b] text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {isAuthenticated ? t("adminPanel") : t("login")}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Atmospheric Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#131b2a]/60 via-[#0c1017] to-[#0c1017] pt-8 pb-6 px-4 sm:px-6 lg:px-8 border-b border-slate-800/40">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-amber-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sensatori Premium Collection</span>
          </div>

          <h2 className="font-outfit font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight">
            {t("heroHeadline")}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t("heroTagline")}
          </p>

          {/* Quick Highlights Bar */}
          <div className="pt-2 flex items-center justify-center gap-4 sm:gap-8 text-slate-400 text-xs font-medium flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-amber-glow" />
              <span>Signature Mixology</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Aged Cellar Spirits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Virgin Botanical Elixirs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Search & Interactive Filter Controls */}
      <section className="sticky top-18 z-30 bg-[#0c1017]/95 backdrop-blur-md py-4 border-b border-slate-800/70 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* Top Row: Multilingual Search & Dietary Pills */}
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="w-full sm:max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery("")}
              />
            </div>

            <FilterPills
              currentFilter={dietaryFilter}
              onFilterChange={setDietaryFilter}
              className="w-full sm:w-auto justify-start sm:justify-end"
            />
          </div>

          {/* Category Tabs */}
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            itemCounts={itemCounts}
          />
        </div>
      </section>

      {/* 4. Menu Grid / Content Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <SkeletonGrid count={8} />
        ) : filteredItems.length === 0 ? (
          /* Empty Search / Filter State */
          <div className="bg-[#161f30] border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-lounge-card">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold font-outfit text-white">
              {t("noResultsFound")}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Try searching with another keyword or reset the active category
              and dietary filters.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setDietaryFilter("all");
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-900/30 hover:from-amber-500 hover:to-amber-400 transition-all"
              >
                {t("clearSearch")}
              </button>
            </div>
          </div>
        ) : (
          /* Responsive 4-Column Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 animate-fade-in">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onClick={(drink) => setSelectedDrink(drink)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 5. Drink Detail Modal */}
      <DrinkDetailModal
        item={selectedDrink}
        isOpen={Boolean(selectedDrink)}
        onClose={() => setSelectedDrink(null)}
      />

      {/* 6. Lounge Footer */}
      <footer className="bg-[#131b2a] border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mt-auto text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">{t("brandTitle")}</span>
            <span>•</span>
            <span>Sensatori Bar & Lounge</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>4-Language Menu (TR / EN / RU / DE)</span>
            <span>•</span>
            <Link
              to="/admin"
              className="text-amber-400 hover:text-amber-300 font-semibold"
            >
              {t("adminPanel")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
