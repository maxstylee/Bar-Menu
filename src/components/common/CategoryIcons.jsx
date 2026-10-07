import React from 'react';

/**
 * Custom line-drawn category icons precisely matching the TUI BLUE design references:
 * 1. COCKTAILS: Martini glass with olive & pick
 * 2. ALCOHOLIC DRINKS: Liquor bottle with shot glass
 * 3. COLD DRINKS: Tall glass with straw & citrus slice
 * 4. TEA & COFFEE: Steaming cup on saucer
 */

export function CocktailIcon({ className = 'w-7 h-7 text-white' }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Martini V-bowl */}
      <path d="M8 12L20 25L32 12H8Z" />
      {/* Stem & Base */}
      <path d="M20 25V33" />
      <path d="M13 33H27" />
      {/* Cocktail Pick with Olive */}
      <line x1="28" y1="7" x2="16" y2="19" strokeWidth="1.8" />
      <circle cx="25" cy="10" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LiquorBottleIcon({ className = 'w-7 h-7 text-white' }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Bottle neck & cap */}
      <rect x="22" y="7" width="6" height="4" rx="0.5" />
      <path d="M23 11V14" />
      <path d="M27 11V14" />
      {/* Bottle shoulders & body */}
      <path d="M23 14C20 16 19 18 19 21V33H31V21C31 18 30 16 27 14" />
      {/* Bottle label line */}
      <rect x="21" y="22" width="8" height="7" rx="0.5" strokeWidth="1.5" />

      {/* Shot glass beside the bottle */}
      <path d="M10 24L11 33H16L17 24H10Z" />
      <line x1="11" y1="27" x2="16" y2="27" strokeWidth="1.3" />
    </svg>
  );
}

export function ColdDrinkIcon({ className = 'w-7 h-7 text-white' }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Tall Highball glass */}
      <path d="M15 15L17 33H27L29 15H15Z" />
      <line x1="16.5" y1="28" x2="27.5" y2="28" strokeWidth="1.4" strokeDasharray="1 2" />

      {/* Straw sticking out angled */}
      <path d="M23 20L27 6L31 8" />

      {/* Citrus wheel slice clipped to rim */}
      <circle cx="14" cy="14" r="5" strokeWidth="1.8" />
      <circle cx="14" cy="14" r="3.2" strokeWidth="1.2" strokeDasharray="1 1.5" />
    </svg>
  );
}

export function SteamingCupIcon({ className = 'w-7 h-7 text-white' }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Cup bowl */}
      <path d="M10 18H28C28 25 24 28 19 28C14 28 10 25 10 18Z" />
      {/* Cup handle */}
      <path d="M28 20C31 20 32.5 22 31.5 24C30.5 25.5 28.5 25 27 25" />
      {/* Saucer */}
      <path d="M8 31H30" strokeWidth="2.2" />

      {/* Steam lines */}
      <path d="M14 14C13 11 15 9 14 7" strokeWidth="1.6" />
      <path d="M19 14C18 11 20 9 19 7" strokeWidth="1.6" />
      <path d="M24 14C23 11 25 9 24 7" strokeWidth="1.6" />
    </svg>
  );
}

export function CategoryIconRenderer({ categoryId, className = 'w-6 h-6' }) {
  if (categoryId === 'cocktails') return <CocktailIcon className={className} />;
  if (categoryId === 'alcoholic-drinks') return <LiquorBottleIcon className={className} />;
  if (categoryId === 'cold-drinks') return <ColdDrinkIcon className={className} />;
  if (categoryId === 'tea-coffee') return <SteamingCupIcon className={className} />;
  return <CocktailIcon className={className} />;
}
