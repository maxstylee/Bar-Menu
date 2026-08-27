import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Wine, Sparkles, Ban } from 'lucide-react';

export function FilterPills({ currentFilter, onFilterChange, className = '' }) {
  const { t } = useLanguage();

  const filters = [
    { id: 'all', label: t('allDrinks'), icon: Sparkles },
    { id: 'alcoholic', label: t('alcoholic'), icon: Wine },
    { id: 'non_alcoholic', label: t('nonAlcoholic'), icon: Ban },
  ];

  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      {filters.map((f) => {
        const isSelected = currentFilter === f.id;
        const Icon = f.icon;

        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isSelected
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'bg-[#131b2a] text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}
