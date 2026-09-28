import React from 'react';
import { CurrentWeather, CityLocation } from '../types/weather';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityLocation;
  weather: CurrentWeather;
  tempUnit: 'C' | 'F';
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  city,
  weather,
  tempUnit,
}) => {
  if (!isOpen) return null;

  const displayTemp = (celsius: number) => {
    if (tempUnit === 'F') return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    return `${celsius}°C`;
  };

  const metrics = [
    { label: 'Air Temperature', val: displayTemp(weather.temperature), desc: `Feels like ${displayTemp(weather.apparentTemperature)}` },
    { label: 'Relative Humidity', val: `${weather.humidity}%`, desc: `Dew point at ${displayTemp(weather.dewPoint)}` },
    { label: 'Surface Pressure', val: `${weather.pressure} hPa`, desc: 'Standard barometric gradient' },
    { label: 'Wind Velocity', val: `${weather.windSpeed} mph`, desc: `Gusts up to ${weather.windGust} km/h` },
    { label: 'Cloud Coverage', val: `${weather.cloudCover}%`, desc: 'Cumulonimbus dense ceiling' },
    { label: 'UV Index', val: `${weather.uvIndex} / 11`, desc: 'Moderate solar irradiance' },
    { label: 'Horizontal Visibility', val: `${weather.visibility} km`, desc: 'Unobstructed visual range' },
    { label: 'Precipitation Index', val: `${weather.precipitation.toFixed(1)} mm/h`, desc: `${weather.precipitationProbability}% occurrence probability` },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Meteorological Report"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-slate-900/85 backdrop-blur-2xl shadow-2xl text-white animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{city.name} Meteorological Report</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">LIVE SG GRID</span>
            </div>
            <p className="text-xs text-white/50">{city.region}, {city.country} • Lat: {city.lat.toFixed(2)}° Lng: {city.lng.toFixed(2)}°</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[70vh] overflow-y-auto">
          {metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-white/10 bg-white/5 flex flex-col justify-between"
            >
              <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{m.label}</span>
              <span className="text-2xl font-bold tracking-tight text-white my-1">{m.val}</span>
              <span className="text-[11px] text-white/60">{m.desc}</span>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center text-xs text-white/50">
          <span>Synced at {weather.updatedAt}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
