import React, { useState, useEffect, useRef } from 'react';
import { CityLocation } from '../types/weather';
import { searchCities, TOP_INDIAN_PRIORITY_CITIES } from '../services/weatherApi';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: CityLocation) => void;
  onUseCurrentLocation?: () => void;
  isDetectingLocation?: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  onUseCurrentLocation,
  isDetectingLocation = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>(TOP_INDIAN_PRIORITY_CITIES);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setResults(TOP_INDIAN_PRIORITY_CITIES);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(TOP_INDIAN_PRIORITY_CITIES);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await searchCities(query);
      setResults(res);
      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Location"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-slate-900/85 backdrop-blur-2xl shadow-2xl text-white animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Indian city (e.g. Delhi, Mumbai, Bengaluru, Srinagar)..."
            className="w-full bg-transparent text-white placeholder-white/40 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close search"
          >
            ✕
          </button>
        </div>

        {/* Current Location Quick Action Banner */}
        {onUseCurrentLocation && (
          <div className="px-4 py-2.5 bg-emerald-500/10 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Automatic Geolocation</span>
            </div>
            <button
              onClick={() => {
                onUseCurrentLocation();
                onClose();
              }}
              disabled={isDetectingLocation}
              className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-semibold border border-emerald-400/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span>📍</span>
              <span>{isDetectingLocation ? 'Locating...' : 'Use My Current Location'}</span>
            </button>
          </div>
        )}

        {/* Quick Indian Metros Priority Pills */}
        <div className="px-4 py-2.5 bg-white/5 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-white/40 font-semibold uppercase tracking-wider whitespace-nowrap mr-1">Priority:</span>
          {['New Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad', 'Jaipur'].map((cityName) => (
            <button
              key={cityName}
              onClick={() => {
                const target = TOP_INDIAN_PRIORITY_CITIES.find((c) => c.name.toLowerCase().includes(cityName.toLowerCase()));
                if (target) {
                  onSelectCity(target);
                  onClose();
                } else {
                  setQuery(cityName);
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors whitespace-nowrap cursor-pointer text-xs font-medium"
            >
              {cityName}
            </button>
          ))}
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5">
          <div className="px-3 py-1.5 text-xs font-semibold text-white/40 uppercase tracking-wider">
            {query.trim() ? (loading ? 'Searching live meteorological stations...' : 'Matching Indian & Global Locations') : 'Top Priority Indian Locations'}
          </div>

          {results.length === 0 && !loading && (
            <div className="px-4 py-8 text-center text-sm text-white/60">
              No matching locations found for "{query}". Try another Indian city name.
            </div>
          )}

          {results.map((city) => (
            <button
              key={`${city.lat}-${city.lng}-${city.name}`}
              onClick={() => {
                onSelectCity(city);
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-3 text-left rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {city.country.toLowerCase() === 'india' && (
                  <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" title="Indian Priority Location" />
                )}
                <div>
                  <div className="font-medium text-white group-hover:text-amber-200 transition-colors flex items-center gap-2">
                    <span>{city.name}</span>
                    {city.country.toLowerCase() === 'india' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-medium">India</span>
                    )}
                  </div>
                  <div className="text-xs text-white/50">
                    {city.region ? `${city.region}, ` : ''}{city.country}
                  </div>
                </div>
              </div>
              <div className="text-xs text-white/40 group-hover:text-white/80 transition-colors font-mono">
                {city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°
              </div>
            </button>
          ))}
        </div>

        <div className="px-4 py-2.5 bg-white/5 border-t border-white/10 text-xs text-white/50 flex justify-between items-center">
          <span>Priority Focus: India Weather Observation Grid</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
