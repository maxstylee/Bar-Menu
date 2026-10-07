import React from 'react';

export function TuiBlueIcon({ className = 'w-6 h-6 text-white' }) {
  return (
    <svg
      viewBox="0 0 48 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* TUI Signature Smile Ribbon Brand Mark */}
      <path
        d="M6 8C10 5 13 11 11 18C9.5 23 4 21 6 15C7 12 6.5 10 6 8Z"
        fill="currentColor"
      />
      <path
        d="M13 18C15 26 23 29 29 27C37 24 39 15 37 10C35.5 6 30 7 31 12C32 17 28 22 23 22C18 22 15 17 13 18Z"
        fill="currentColor"
      />
      <circle cx="39" cy="8" r="3" fill="#38bdf8" />
    </svg>
  );
}

/**
 * TUI BLUE Official Brand Header Logo & Badge
 * Mode 'inline': Brand mark + "TUI BLUE" typography (matching desktop design)
 * Mode 'badge': Compact rounded square badge with smile mark + "TUI BLUE" (matching mobile design)
 */
export function TuiLogo({ variant = 'inline', className = '' }) {
  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center px-2.5 py-1.5 rounded-lg bg-[#071b2f]/90 border border-[#1e4976]/60 shadow-[0_2px_10px_rgba(3,105,161,0.25)] ${className}`}
      >
        <TuiBlueIcon className="w-5 h-3.5 text-sky-400" />
        <span className="text-[9px] font-outfit font-black tracking-widest text-sky-100 uppercase mt-0.5">
          TUI BLUE
        </span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <TuiBlueIcon className="w-8 h-5 text-sky-400" />
      <div className="flex items-baseline gap-1.5 font-outfit">
        <span className="font-extrabold text-lg tracking-wider text-white">
          TUI BLUE
        </span>
      </div>
    </div>
  );
}

export default TuiLogo;
