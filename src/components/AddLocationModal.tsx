import React, { useState } from 'react';
import { CityLocation } from '../types/weather';
import { searchCities, TOP_INDIAN_PRIORITY_CITIES } from '../services/weatherApi';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCity: (city: CityLocation) => void;
  existingCityIds: string[];
}

export const AddLocationModal: React.FC<AddLocationModalProps> = ({
  isOpen,
  onClose,
  onAddCity,
  existingCityIds,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CityLocation[]>([]);
  const [searching, setSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    const res = await searchCities(term);
    setSearchResults(res);
    setSearching(false);
  };

  const handleSelect = (city: CityLocation) => {
    onAddCity(city);
    onClose();
  };

  const listToDisplay = searchTerm ? searchResults : TOP_INDIAN_PRIORITY_CITIES;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add Weather Station"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-slate-900/85 backdrop-blur-2xl shadow-2xl text-white animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h3 className="font-semibold text-base">Pin Location to Forecast Rail</h3>
            <p className="text-xs text-white/50">Top Indian cities and state capitals on priority</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4 border-b border-white/10">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search Indian city or territory..."
            className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/40"
          />
        </div>

        <div className="p-4 max-h-80 overflow-y-auto space-y-2">
          <div className="text-xs font-semibold text-orange-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            {searchTerm ? (searching ? 'Searching...' : 'Search Results') : 'Priority Indian Locations'}
          </div>

          {listToDisplay.map((city) => {
            const isAdded =
              existingCityIds.includes(city.id) ||
              existingCityIds.some((id) => id.includes(city.name.toLowerCase()));
            return (
              <div
                key={`${city.lat}-${city.lng}-${city.name}`}
                className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div>
                  <div className="font-medium text-sm text-white flex items-center gap-1.5">
                    <span>{city.name}</span>
                    {city.country.toLowerCase() === 'india' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-300 font-semibold">
                        India
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-white/50">
                    {city.region ? `${city.region}, ` : ''}{city.country}
                  </div>
                </div>
                <button
                  disabled={isAdded}
                  onClick={() => handleSelect(city)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    isAdded
                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                      : 'bg-white/20 hover:bg-white/30 text-white cursor-pointer'
                  }`}
                >
                  {isAdded ? 'Pinned' : '+ Pin'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-white/5 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
