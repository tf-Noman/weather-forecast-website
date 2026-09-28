import React, { useState } from 'react';
import { DayForecast } from '../types/weather';
import { WeatherIcon } from './WeatherIcons';

interface ForecastStripProps {
  daily: DayForecast[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
  tempUnit: 'C' | 'F';
}

export const ForecastStrip: React.FC<ForecastStripProps> = ({
  daily,
  selectedDayIndex,
  onSelectDay,
  tempUnit,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Take 6 days for the strip
  const items = daily.slice(0, 6);

  const displayTemp = (celsius: number) => {
    if (tempUnit === 'F') return `${Math.round((celsius * 9) / 5 + 32)}°`;
    return `${celsius}°`;
  };

  // Generate cubic bezier curve through the 6 points
  // Reference x-positions across 835 width:
  // x-coords: 0 (start), 70 (day0), 215 (day1), 360 (day2), 510 (day3), 660 (day4), 800 (day5), 835 (end)
  const temps = items.map((it) => it.temp);
  const minTemp = Math.min(...temps, 5);
  const maxTemp = Math.max(...temps, 25);
  const range = Math.max(maxTemp - minTemp, 8);

  // Convert temp to Y coord (higher temp = smaller Y)
  // Mapping between Y=32 (highest temp) and Y=155 (lowest temp)
  const getY = (t: number) => {
    const norm = (t - minTemp) / range;
    return Math.round(155 - norm * 123);
  };

  const y0 = items[0] ? getY(items[0].temp) : 130;
  const y1 = items[1] ? getY(items[1].temp) : 102;
  const y2 = items[2] ? getY(items[2].temp) : 92;
  const y3 = items[3] ? getY(items[3].temp) : 146;
  const y4 = items[4] ? getY(items[4].temp) : 32;
  const y5 = items[5] ? getY(items[5].temp) : 86;

  // Exact cubic spline formula
  const strokePath = `M0,${Math.round((y0 + 79) / 2)} C 50,${Math.round((y0 + 79) / 2)} 90,${y0} 140,${y0} C 195,${y0} 235,${y1} 280,${y1} C 330,${y1} 375,${y2} 420,${y2} C 475,${y2} 510,${y3} 560,${y3} C 615,${y3} 650,${y4} 705,${y4} C 760,${y4} 795,${y5} 835,${y5}`;
  const fillPath = `${strokePath} L835,230 L0,230 Z`;

  return (
    <section className="forecast" aria-label="6-Day Forecast and Trend">
      {/* Temperature and Icon row */}
      <div className="temps-row">
        {items.map((item, idx) => {
          const isSelected = selectedDayIndex === idx;
          const isHovered = hoveredIndex === idx;
          return (
            <div
              key={idx}
              className={`temp-item cursor-pointer transition-all duration-200 group ${
                isSelected ? 'scale-105 opacity-100' : 'opacity-90 hover:opacity-100'
              }`}
              onClick={() => onSelectDay(idx)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              title={`Click to view ${item.dayName} details`}
            >
              <span className={`val transition-colors ${isSelected ? 'text-white font-semibold' : 'text-white/90'}`}>
                {displayTemp(item.temp)}
              </span>
              <WeatherIcon
                name={item.icon}
                className={`transition-transform duration-200 ${isHovered || isSelected ? 'scale-115 text-white' : 'text-white/90'}`}
              />
            </div>
          );
        })}
      </div>

      {/* SVG Wave Chart */}
      <svg className="wave-chart" viewBox="0 0 835 230" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="wf" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          <mask id="wfade">
            <linearGradient id="mf" x1="0" y1="0" x2="0" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <rect width="835" height="230" fill="url(#mf)" />
          </mask>

          <clipPath id="wclip">
            <rect id="wclipr" x="0" y="0" width="835" height="230" />
          </clipPath>
        </defs>

        {/* Wave Fill with mask & wipe animation */}
        <g clipPath="url(#wclip)">
          <path d={fillPath} fill="url(#wf)" mask="url(#wfade)" />
        </g>

        {/* 3 Stroked Outline Paths */}
        <path
          className="wline"
          pathLength="1"
          d={strokePath}
          fill="none"
          stroke="url(#wg)"
          strokeWidth="6.2"
          strokeOpacity="0.17"
          strokeLinecap="round"
        />
        <path
          className="wline"
          pathLength="1"
          d={strokePath}
          fill="none"
          stroke="url(#wg)"
          strokeWidth="4.6"
          strokeOpacity="0.26"
          strokeLinecap="round"
        />
        <path
          className="wline"
          pathLength="1"
          d={strokePath}
          fill="none"
          stroke="url(#wg)"
          strokeWidth="3.4"
          strokeOpacity="1"
          strokeLinecap="round"
        />

        {/* Interactive Point Markers */}
        {[
          { x: 140, y: y0 },
          { x: 280, y: y1 },
          { x: 420, y: y2 },
          { x: 560, y: y3 },
          { x: 705, y: y4 },
          { x: 800, y: y5 },
        ].map((pt, i) => {
          const isSelected = selectedDayIndex === i;
          const isHovered = hoveredIndex === i;
          return (
            <g
              key={i}
              className="cursor-pointer"
              onClick={() => onSelectDay(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {isSelected && (
                <circle cx={pt.x} cy={pt.y} r="9" fill="rgba(255,255,255,0.25)" className="animate-ping" />
              )}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? '6' : isHovered ? '5' : '3.5'}
                fill="#ffffff"
                stroke="rgba(4,16,24,0.6)"
                strokeWidth="1.5"
                className="transition-all duration-200"
              />
            </g>
          );
        })}
      </svg>

      {/* Days row */}
      <div className="days-row">
        {items.map((item, idx) => {
          const isSelected = selectedDayIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDay(idx)}
              className={`day-item cursor-pointer bg-transparent border-0 transition-all ${
                isSelected ? 'on text-white font-semibold' : 'text-white/80 hover:text-white'
              }`}
            >
              {item.dayName}
            </button>
          );
        })}
      </div>
    </section>
  );
};
