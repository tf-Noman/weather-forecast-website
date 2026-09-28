import React from 'react';
import { CurrentWeather, CityLocation } from '../types/weather';

interface HeroProps {
  city: CityLocation;
  weather: CurrentWeather;
  selectedDayName?: string;
  isCustomDay?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  city,
  weather,
  selectedDayName,
  isCustomDay,
}) => {
  return (
    <section className="hero" aria-label="Current Weather Overview">
      <div className="flex items-center gap-2.5">
        <div className="chip">Weather Forecast</div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/90 font-medium backdrop-blur-md border border-white/15 flex items-center gap-1.5">
          {city.isCurrentLocation ? (
            <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Current Location: {city.name}</span>
              {city.country && <span className="text-white/40 font-normal">({city.country})</span>}
            </span>
          ) : (
            <>
              {city.country.toLowerCase() === 'india' && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              )}
              <span>{city.name}</span>
              <span className="text-white/40">({city.country})</span>
            </>
          )}
        </span>
        {isCustomDay && selectedDayName && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-400/20 text-cyan-200 font-medium backdrop-blur-md border border-cyan-400/30">
            {selectedDayName} Trend
          </span>
        )}
      </div>

      <h1>
        <span className="ln">
          <span>{weather.headlineLine1}</span>
        </span>
        <span className="ln">
          <span>{weather.headlineLine2}</span>
        </span>
      </h1>

      <p className="blurb whitespace-pre-line">
        {weather.blurb}
      </p>
    </section>
  );
};
