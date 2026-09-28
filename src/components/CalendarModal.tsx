import React from 'react';
import { DayForecast, CityLocation } from '../types/weather';
import { WeatherIcon } from './WeatherIcons';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: CityLocation;
  daily: DayForecast[];
  tempUnit: 'C' | 'F';
  onSelectDay?: (day: DayForecast) => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  city,
  daily,
  tempUnit,
  onSelectDay,
}) => {
  if (!isOpen) return null;

  const displayTemp = (celsius: number) => {
    if (tempUnit === 'F') return `${Math.round((celsius * 9) / 5 + 32)}°`;
    return `${celsius}°`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Forecast Calendar"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-slate-900/85 backdrop-blur-2xl shadow-2xl text-white animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h3 className="font-bold text-lg">{city.name} Extended Forecast Calendar</h3>
            <p className="text-xs text-white/50">Multi-day barometric projection & precipitation probability</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-2.5">
          {daily.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectDay?.(item);
                onClose();
              }}
              className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="w-28">
                <div className="font-semibold text-sm text-white">{item.dayName}</div>
                <div className="text-[11px] text-white/50">{item.dateStr}</div>
              </div>

              <div className="flex items-center gap-2">
                <WeatherIcon name={item.icon} size={22} className="text-white" />
                <span className="text-xs text-white/80 w-28 truncate">{item.conditionText}</span>
              </div>

              <div className="text-xs text-cyan-300 font-mono w-20 text-center">
                ☂ {item.precipitationProbability}%
              </div>

              <div className="flex items-center gap-3 text-right">
                <span className="text-xs text-white/40">{displayTemp(item.tempMin)}</span>
                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                  <div
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-400 to-amber-300 rounded-full"
                    style={{
                      left: '20%',
                      width: '60%',
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-white w-8">{displayTemp(item.tempMax)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center text-xs text-white/50">
          <span>Click any day to load its trend into the hero forecast</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
