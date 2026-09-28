import React from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempUnit: 'C' | 'F';
  setTempUnit: (unit: 'C' | 'F') => void;
  windUnit: 'mph' | 'kmh';
  setWindUnit: (unit: 'mph' | 'kmh') => void;
  onRefreshData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  tempUnit,
  setTempUnit,
  windUnit,
  setWindUnit,
  onRefreshData,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="App Settings"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-slate-900/85 backdrop-blur-2xl shadow-2xl text-white animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h3 className="font-bold text-lg">System Preferences</h3>
            <p className="text-xs text-white/50">Meteorological units & display configurations</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Temperature Unit */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5">
            <div>
              <div className="font-medium text-sm text-white">Temperature Unit</div>
              <div className="text-xs text-white/50">Celsius (°C) or Fahrenheit (°F)</div>
            </div>
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setTempUnit('C')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  tempUnit === 'C' ? 'bg-white text-slate-900 shadow-md' : 'text-white/70 hover:text-white'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setTempUnit('F')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  tempUnit === 'F' ? 'bg-white text-slate-900 shadow-md' : 'text-white/70 hover:text-white'
                }`}
              >
                °F
              </button>
            </div>
          </div>

          {/* Wind Speed Unit */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5">
            <div>
              <div className="font-medium text-sm text-white">Wind Speed Metric</div>
              <div className="text-xs text-white/50">Statute miles per hour or km/h</div>
            </div>
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setWindUnit('mph')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  windUnit === 'mph' ? 'bg-white text-slate-900 shadow-md' : 'text-white/70 hover:text-white'
                }`}
              >
                mph
              </button>
              <button
                onClick={() => setWindUnit('kmh')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  windUnit === 'kmh' ? 'bg-white text-slate-900 shadow-md' : 'text-white/70 hover:text-white'
                }`}
              >
                km/h
              </button>
            </div>
          </div>

          {/* Manual Force Sync */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5">
            <div>
              <div className="font-medium text-sm text-white">Sync Live Data</div>
              <div className="text-xs text-white/50">Poll fresh satellite weather observations</div>
            </div>
            <button
              onClick={() => {
                onRefreshData();
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 text-xs font-medium transition-colors"
            >
              Sync Now
            </button>
          </div>

          {/* API Grid Source Information */}
          <div className="p-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white/60 space-y-1">
            <div className="font-semibold text-white/80">API Grid Architecture</div>
            <p>Direct atmospheric queries via StormGlass & Open-Meteo High-Resolution Numerical Weather Prediction (NWP) model.</p>
          </div>
        </div>

        <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
