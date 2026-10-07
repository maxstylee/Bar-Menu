import React from 'react';
import { useWeather } from '../../hooks/useWeather';
import { Sun, Cloud, CloudSun, CloudRain, CloudLightning, CloudSnow } from 'lucide-react';

/**
 * Line icon renderer matching the sun outline in the design
 */
export function WeatherIcon({ kind = 'clear', className = 'w-4 h-4 text-amber-400' }) {
  if (kind === 'clear') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
        <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
        <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
      </svg>
    );
  }
  if (kind === 'partly') return <CloudSun className={className} />;
  if (kind === 'cloudy') return <Cloud className={className} />;
  if (kind === 'rain') return <CloudRain className={className} />;
  if (kind === 'storm') return <CloudLightning className={className} />;
  if (kind === 'snow') return <CloudSnow className={className} />;
  return <Sun className={className} />;
}

/**
 * Header Weather Widget: "Side, Antalya • 28° ☀️"
 */
export function WeatherHeaderWidget({ className = '' }) {
  const { temp, kind, city } = useWeather();

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 tracking-wide select-none ${className}`}
      title={`${city}: ${temp}°C`}
    >
      <span>{city}</span>
      <span className="text-slate-500">•</span>
      <span className="text-white font-bold">{temp}°</span>
      <WeatherIcon kind={kind} className="w-3.5 h-3.5 text-amber-400 shrink-0" />
    </div>
  );
}

/**
 * Featured Card Weather Widget: "28° ☀️"
 */
export function WeatherBadge({ className = '' }) {
  const { temp, kind } = useWeather();

  return (
    <div className={`inline-flex items-center gap-1 font-outfit select-none ${className}`}>
      <span className="text-xl sm:text-2xl font-black text-white">{temp}°</span>
      <WeatherIcon kind={kind} className="w-5 h-5 text-amber-400 stroke-[2.2] shrink-0" />
    </div>
  );
}

export default WeatherHeaderWidget;
