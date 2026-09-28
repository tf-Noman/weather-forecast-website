import React from 'react';
import { CityLocation } from '../types/weather';

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: CityLocation) => void;
}

const INDIAN_PRIORITY_REGIONS = [
  {
    name: 'Top Priority Indian Metros',
    badge: 'Tier 1 Priority',
    cities: [
      { id: 'new-delhi', name: 'New Delhi', region: 'Delhi NCR', country: 'India', lat: 28.6139, lng: 77.2090 },
      { id: 'mumbai', name: 'Mumbai', region: 'Maharashtra', country: 'India', lat: 19.0760, lng: 72.8777 },
      { id: 'bengaluru', name: 'Bengaluru', region: 'Karnataka', country: 'India', lat: 12.9716, lng: 77.5946 },
      { id: 'kolkata', name: 'Kolkata', region: 'West Bengal', country: 'India', lat: 22.5726, lng: 88.3639 },
      { id: 'chennai', name: 'Chennai', region: 'Tamil Nadu', country: 'India', lat: 13.0827, lng: 80.2707 },
      { id: 'hyderabad', name: 'Hyderabad', region: 'Telangana', country: 'India', lat: 17.3850, lng: 78.4867 },
    ],
  },
  {
    name: 'North & Himalayan India',
    badge: 'North Zone',
    cities: [
      { id: 'srinagar', name: 'Srinagar', region: 'Jammu & Kashmir', country: 'India', lat: 34.0837, lng: 74.7973 },
      { id: 'shimla', name: 'Shimla', region: 'Himachal Pradesh', country: 'India', lat: 31.1048, lng: 77.1734 },
      { id: 'jaipur', name: 'Jaipur', region: 'Rajasthan', country: 'India', lat: 26.9124, lng: 75.7873 },
      { id: 'chandigarh', name: 'Chandigarh', region: 'Punjab & Haryana', country: 'India', lat: 30.7333, lng: 76.7794 },
      { id: 'lucknow', name: 'Lucknow', region: 'Uttar Pradesh', country: 'India', lat: 26.8467, lng: 80.9462 },
      { id: 'dehradun', name: 'Dehradun', region: 'Uttarakhand', country: 'India', lat: 30.3165, lng: 78.0322 },
    ],
  },
  {
    name: 'West & Central India',
    badge: 'West Zone',
    cities: [
      { id: 'pune', name: 'Pune', region: 'Maharashtra', country: 'India', lat: 18.5204, lng: 73.8567 },
      { id: 'ahmedabad', name: 'Ahmedabad', region: 'Gujarat', country: 'India', lat: 23.0225, lng: 72.5714 },
      { id: 'goa', name: 'Goa (Panaji)', region: 'Goa', country: 'India', lat: 15.4909, lng: 73.8278 },
      { id: 'surat', name: 'Surat', region: 'Gujarat', country: 'India', lat: 21.1702, lng: 72.8311 },
      { id: 'indore', name: 'Indore', region: 'Madhya Pradesh', country: 'India', lat: 22.7196, lng: 75.8577 },
      { id: 'bhopal', name: 'Bhopal', region: 'Madhya Pradesh', country: 'India', lat: 23.2599, lng: 77.4126 },
    ],
  },
  {
    name: 'South & Coastal Peninsula',
    badge: 'South Zone',
    cities: [
      { id: 'kochi', name: 'Kochi', region: 'Kerala', country: 'India', lat: 9.9312, lng: 76.2673 },
      { id: 'visakhapatnam', name: 'Visakhapatnam', region: 'Andhra Pradesh', country: 'India', lat: 17.6868, lng: 83.2185 },
      { id: 'coimbatore', name: 'Coimbatore', region: 'Tamil Nadu', country: 'India', lat: 11.0168, lng: 76.9558 },
      { id: 'thiruvananthapuram', name: 'Thiruvananthapuram', region: 'Kerala', country: 'India', lat: 8.5241, lng: 76.9366 },
      { id: 'mangalore', name: 'Mangaluru', region: 'Karnataka', country: 'India', lat: 12.9141, lng: 74.8560 },
      { id: 'madurai', name: 'Madurai', region: 'Tamil Nadu', country: 'India', lat: 9.9252, lng: 78.1198 },
    ],
  },
  {
    name: 'East & Northeast India',
    badge: 'East Zone',
    cities: [
      { id: 'guwahati', name: 'Guwahati', region: 'Assam', country: 'India', lat: 26.1445, lng: 91.7362 },
      { id: 'bhubaneswar', name: 'Bhubaneswar', region: 'Odisha', country: 'India', lat: 20.2961, lng: 85.8245 },
      { id: 'patna', name: 'Patna', region: 'Bihar', country: 'India', lat: 25.5941, lng: 85.1376 },
      { id: 'shillong', name: 'Shillong', region: 'Meghalaya', country: 'India', lat: 25.5788, lng: 91.8933 },
      { id: 'ranchi', name: 'Ranchi', region: 'Jharkhand', country: 'India', lat: 23.3441, lng: 85.3096 },
    ],
  },
  {
    name: 'Global Meteorological Hubs',
    badge: 'International',
    cities: [
      { id: 'dubai', name: 'Dubai', region: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
      { id: 'singapore', name: 'Singapore', region: 'Central', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
      { id: 'london', name: 'London', region: 'Greater London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
      { id: 'tokyo', name: 'Tokyo', region: 'Kanto', country: 'Japan', lat: 35.6762, lng: 139.6503 },
    ],
  },
];

export const ExploreModal: React.FC<ExploreModalProps> = ({ isOpen, onClose, onSelectCity }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Explore Regions"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-slate-900/85 backdrop-blur-2xl shadow-2xl text-white animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">Explore Indian & Regional Weather Zones</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-semibold border border-orange-400/30">
                INDIA PRIORITY
              </span>
            </div>
            <p className="text-xs text-white/50">Comprehensive observation grid covering Indian metros, plains, coasts, and hill stations</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-6">
          {INDIAN_PRIORITY_REGIONS.map((reg) => (
            <div key={reg.name}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {reg.name}
                </span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">{reg.badge}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {reg.cities.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCity(c);
                      onClose();
                    }}
                    className="p-3 text-left rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 transition-all text-white group cursor-pointer"
                  >
                    <div className="font-semibold text-sm group-hover:text-amber-200 transition-colors flex items-center justify-between">
                      <span>{c.name}</span>
                      {c.country === 'India' && (
                        <span className="text-[9px] px-1 rounded bg-white/10 text-white/60 font-normal">IN</span>
                      )}
                    </div>
                    <div className="text-[11px] text-white/50 truncate">
                      {c.region ? `${c.region}, ` : ''}{c.country}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center text-xs text-white/50">
          <span>Targeting Indian Meteorological Department (IMD) observation zones</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
