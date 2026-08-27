import React, { useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Sparkles,
  GlassWater,
  Flame,
  Wine,
  Beer,
  HeartHandshake,
  Coffee,
  Citrus,
  Layers,
} from 'lucide-react';

const iconMap = {
  Sparkles,
  GlassWater,
  Flame,
  Citrus,
  Wine,
  Beer,
  HeartHandshake,
  Coffee,
};

export function CategoryTabs({
  categories = [],
  selectedCategory,
  onSelectCategory,
  itemCounts = {},
  className = '',
}) {
  const { language, getLocalizedField, t } = useLanguage();
  const scrollContainerRef = useRef(null);

  const allItemsCount = Object.values(itemCounts).reduce((acc, count) => acc + count, 0);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth"
        role="tablist"
      >
        {/* 'All' Tab */}
        <button
          role="tab"
          aria-selected={selectedCategory === 'all'}
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 border-amber-400 shadow-amber-glow font-bold'
              : 'bg-[#161f30]/80 hover:bg-[#1e293b] text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t('allDrinks')}</span>
          <span
            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
              selectedCategory === 'all'
                ? 'bg-slate-950/25 text-slate-950'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {allItemsCount}
          </span>
        </button>

        {/* Dynamic Category Tabs */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const IconComponent = iconMap[cat.icon] || Wine;
          const localizedName = getLocalizedField(cat, 'name');
          const count = itemCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 border-amber-400 shadow-amber-glow font-bold'
                  : 'bg-[#161f30]/80 hover:bg-[#1e293b] text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <IconComponent className="w-4 h-4 flex-shrink-0" />
              <span>{localizedName}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  isSelected
                    ? 'bg-slate-950/25 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
