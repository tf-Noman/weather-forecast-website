import React from 'react';
import { CityLocation, CurrentWeather, CityWeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcons';

interface RightRailProps {
  activeCity: CityLocation;
  activeWeather: CurrentWeather;
  savedCitiesWeather: Record<string, CityWeatherData>;
  regionalCities: CityLocation[];
  onSelectCity: (city: CityLocation) => void;
  tempUnit: 'C' | 'F';
  onOpenReport: () => void;
}

export const RightRail: React.FC<RightRailProps> = ({
  activeCity,
  activeWeather,
  savedCitiesWeather,
  regionalCities,
  onSelectCity,
  tempUnit,
  onOpenReport,
}) => {
  const displayTempNumber = (celsius: number) => {
    if (tempUnit === 'F') return Math.round((celsius * 9) / 5 + 32);
    return celsius;
  };

  // Other cities excluding the current active city
  const otherCities = regionalCities.filter((c) => c.id !== activeCity.id);

  return (
    <aside className="rail" aria-label="Regional Weather Stations">
      {/* Card A: Big Hero Card */}
      <article
        className="card big cursor-pointer hover:border-white/40 transition-all duration-200 group"
        onClick={onOpenReport}
        title="Click to open comprehensive meteorological telemetry report"
      >
        <div className="card-location">
          <span className="flex items-center gap-1.5">
            {activeCity.isCurrentLocation && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Your current location" />
            )}
            <span>{activeCity.name}</span>
          </span>
          <WeatherIcon
            name="pin"
            className={`group-hover:translate-y-[-2px] transition-transform duration-200 ${activeCity.isCurrentLocation ? 'text-emerald-400' : 'text-white/90'}`}
          />
        </div>

        <div className="big-temp">
          {displayTempNumber(activeWeather.temperature)}°
          <i>{tempUnit}</i>
        </div>

        <div className="metrics">
          <div className="metric" title="Wind Velocity">
            <WeatherIcon name="wind" />
            <span>{activeWeather.windSpeed} mph</span>
          </div>
          <div className="metric" title="Precipitation Probability">
            <WeatherIcon name="drop" />
            <span>{activeWeather.precipitationProbability}%</span>
          </div>
          <div className="metric" title="Wind Gusts">
            <WeatherIcon name="gust" />
            <span>{activeWeather.windGust}km/h</span>
          </div>
        </div>
      </article>

      {/* Row Cards (North Jakarta, Bandung, South Jakarta, etc.) */}
      {otherCities.slice(0, 3).map((city) => {
        const cityData = savedCitiesWeather[city.id];
        const temp = cityData ? displayTempNumber(cityData.current.temperature) : '--';
        const condition = cityData ? cityData.current.conditionText : 'Loading...';
        const iconName = cityData ? cityData.current.icon : 'cloud';

        return (
          <article
            key={city.id}
            onClick={() => onSelectCity(city)}
            className={`card row cursor-pointer hover:border-white/40 transition-all duration-200 group ${city.isCurrentLocation ? 'border-emerald-500/40 bg-emerald-950/20' : ''}`}
            title={`Switch to ${city.name}${city.isCurrentLocation ? ' (Current Location)' : ''}`}
          >
            <div className="row-left">
              <span className="country flex items-center gap-1.5">
                {city.isCurrentLocation ? (
                  <span className="text-emerald-300 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Current Location
                  </span>
                ) : (
                  city.country
                )}
              </span>
              <span className="city group-hover:text-cyan-200 transition-colors">
                {city.name}
              </span>
              <span className="weather-desc">{condition}</span>
            </div>

            <div className="row-right">
              <span className="row-temp">{temp}°</span>
              <WeatherIcon
                name={iconName}
                className="row-icon group-hover:scale-110 transition-transform duration-200"
              />
            </div>
          </article>
        );
      })}
    </aside>
  );
};
