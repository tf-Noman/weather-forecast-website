import React from 'react';
import { CurrentWeather } from '../types/weather';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
  weather: CurrentWeather;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  cityName,
  weather,
}) => {
  if (!isOpen) return null;

  const alerts = [
    {
      id: 'alert-1',
      title: 'Atmospheric Storm Advisory',
      severity: 'moderate',
      time: '12m ago',
      desc: `Convective thunder activity detected across ${cityName}. Lightning strikes observed within 15km perimeter with wind gusts up to ${weather.windGust} km/h.`,
    },
    {
      id: 'alert-2',
      title: 'Precipitation Probability Spike',
      severity: 'advisory',
      time: '45m ago',
      desc: `Current rainfall chance sits at ${weather.precipitationProbability}%. Expected precipitation index around ${weather.precipitation.toFixed(1)} mm/h. Keep waterproof gear ready.`,
    },
    {
      id: 'alert-3',
      title: 'Rapid Pressure Fluctuation',
      severity: 'info',
      time: '1h ago',
      desc: `Surface barometric pressure registered at ${weather.pressure} hPa. Frontal boundaries indicate persistent low-pressure gradient over the metropolitan area.`,
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Weather Notifications"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-slate-900/85 backdrop-blur-2xl shadow-2xl text-white animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="font-semibold text-base">Weather Advisories & Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Close notifications"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  {alert.title}
                </span>
                <span className="text-xs text-white/40">{alert.time}</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">{alert.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-3 bg-white/5 border-t border-white/10 flex justify-between items-center text-xs text-white/50">
          <span>Active Station: {cityName}</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Dismiss All
          </button>
        </div>
      </div>
    </div>
  );
};
