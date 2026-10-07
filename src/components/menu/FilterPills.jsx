import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export function FilterPills({ currentFilter = 'all', onFilterChange, className = '' }) {
  const { t } = useLanguage();

  const filters = [
    { id: 'all', label: t('filterAll') },
    { id: 'included', label: t('filterIncluded') },
    { id: 'premium', label: t('filterPremium') },
    { id: 'signature', label: t('filterSignature') },
  ];

  return (
    <div
      role="tablist"
      className={`flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1 ${className}`}
    >
      {filters.map((f) => {
        const isSelected = currentFilter === f.id;

        return (
          <button
            key={f.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onFilterChange(f.id)}
            className={`whitespace-nowrap px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 select-none ${
              isSelected
                ? 'bg-sky-500/25 text-white border border-sky-400/70 shadow-[0_0_14px_rgba(56,189,248,0.35)]'
                : 'bg-[#101827]/70 hover:bg-[#152238]/80 text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-600'
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterPills;
