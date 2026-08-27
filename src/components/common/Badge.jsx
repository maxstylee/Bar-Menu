import React from 'react';

export function Badge({
  children,
  variant = 'slate', // 'slate' | 'amber' | 'emerald' | 'rose' | 'blue' | 'glass'
  size = 'sm', // 'xs' | 'sm' | 'md'
  className = '',
}) {
  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded-md',
    sm: 'text-xs px-2.5 py-1 rounded-lg font-medium',
    md: 'text-xs px-3 py-1.5 rounded-xl font-semibold',
  };

  const variantStyles = {
    slate: 'bg-slate-800/90 text-slate-300 border border-slate-700/60',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    rose: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    blue: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    glass: 'bg-[#131b2a]/70 backdrop-blur-sm text-slate-200 border border-slate-700/60',
  };

  return (
    <span className={`inline-flex items-center gap-1 leading-none select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function VolumeBadge({ volume_ml, abv, is_alcoholic }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {volume_ml ? (
        <Badge variant="slate" size="xs">
          {volume_ml} ml
        </Badge>
      ) : null}

      {is_alcoholic ? (
        <Badge variant="amber" size="xs">
          {abv ? `${abv}% ABV` : 'Alcoholic'}
        </Badge>
      ) : (
        <Badge variant="emerald" size="xs">
          0.0% Virgin
        </Badge>
      )}
    </div>
  );
}
