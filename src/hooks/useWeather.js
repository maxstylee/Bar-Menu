import { useState, useEffect } from 'react';

/**
 * Live weather for Antalya, Turkey via Open-Meteo (free, no API key).
 * `kind` drives the line-icon shown in the UI: clear | partly | cloudy | fog | rain | snow | storm.
 */
const ANTALYA = { lat: 36.8969, lon: 30.7133 };
const ENDPOINT = `https://api.open-meteo.com/v1/forecast?latitude=${ANTALYA.lat}&longitude=${ANTALYA.lon}&current_weather=true`;
const REFRESH_MS = 30 * 60 * 1000;
const FALLBACK = { temp: 28, kind: 'clear', isDay: true, text: 'Sunny' };

/**
 * WMO Weather interpretation codes mapped to icon kind and text
 */
function interpretWeatherCode(code) {
  if (code === 0) return { kind: 'clear', text: 'Clear Sky' };
  if (code === 1 || code === 2) return { kind: 'partly', text: 'Partly Cloudy' };
  if (code === 3) return { kind: 'cloudy', text: 'Overcast' };
  if (code === 45 || code === 48) return { kind: 'fog', text: 'Foggy' };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { kind: 'rain', text: 'Rain' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { kind: 'snow', text: 'Snow' };
  if ([95, 96, 99].includes(code)) return { kind: 'storm', text: 'Thunderstorm' };
  return { kind: 'clear', text: 'Clear' };
}

export function useWeather() {
  const [weather, setWeather] = useState({
    ...FALLBACK,
    city: 'Side, Antalya',
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchAntalyaWeather() {
      try {
        const res = await fetch(ENDPOINT, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

        const data = await res.json();
        const current = data?.current_weather;
        if (current && isMounted) {
          setWeather({
            temp: Math.round(current.temperature),
            ...interpretWeatherCode(current.weathercode),
            isDay: current.is_day !== 0,
            city: 'Side, Antalya',
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        console.warn('Weather fetch failed, using fallback state (28° sunny):', err);
        if (isMounted) {
          setWeather((prev) => ({ ...prev, ...FALLBACK, loading: false, error: err.message }));
        }
      }
    }

    fetchAntalyaWeather();
    const interval = setInterval(fetchAntalyaWeather, REFRESH_MS);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return weather;
}
