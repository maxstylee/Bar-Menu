import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Search, X } from 'lucide-react';

export function SearchBar({ value, onChange, onClear, className = '' }) {
  const { t } = useLanguage();

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-4 pointer-events-none text-slate-400">
        <Search className="w-4 h-4 text-amber-500/80" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('searchPlaceholder')}
        className="w-full bg-[#161f30]/90 border border-slate-800 hover:border-slate-700 focus:border-amber-500/80 text-slate-100 placeholder-slate-500 rounded-2xl pl-11 pr-10 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-inner"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label={t('clearSearch')}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
