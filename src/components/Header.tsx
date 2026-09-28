import React from 'react';
import { WeatherIcon } from './WeatherIcons';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAddLocation: () => void;
  onOpenNotifications: () => void;
  onDetectLocation?: () => void;
  isDetectingLocation?: boolean;
  isCurrentLocationActive?: boolean;
  unreadAlertsCount?: number;
  userName?: string;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAddLocation,
  onOpenNotifications,
  onDetectLocation,
  isDetectingLocation = false,
  isCurrentLocationActive = false,
  unreadAlertsCount = 2,
  userName = 'Noman Sheikh',
  onProfileClick,
}) => {
  return (
    <header className="header">
      <div className="greeting">
        <span className="greeting-hello">Welcome</span>
        <span className="greeting-who">{userName}</span>
      </div>

      <div className="tools">
        {onDetectLocation && (
          <button
            className={`tool relative transition-all ${
              isCurrentLocationActive ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/40' : ''
            }`}
            type="button"
            onClick={onDetectLocation}
            aria-label="Use Current Location"
            title={
              isDetectingLocation
                ? 'Detecting live meteorological location...'
                : isCurrentLocationActive
                ? 'Viewing current location weather'
                : 'Detect & switch to current location weather'
            }
            disabled={isDetectingLocation}
          >
            <WeatherIcon
              name="pin"
              size="100%"
              className={isDetectingLocation ? 'animate-bounce text-emerald-400' : isCurrentLocationActive ? 'text-emerald-400' : ''}
            />
            {isCurrentLocationActive && (
              <span
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900"
                aria-hidden="true"
              />
            )}
          </button>
        )}

        <button
          className="tool"
          type="button"
          onClick={onOpenAddLocation}
          aria-label="Add location"
          title="Add location to rail"
        >
          <WeatherIcon name="plus" size="100%" />
        </button>

        <button
          className="tool"
          type="button"
          onClick={onOpenSearch}
          aria-label="Search"
          title="Search any global city"
        >
          <WeatherIcon name="search" size="100%" />
        </button>

        <button
          className="tool relative"
          type="button"
          onClick={onOpenNotifications}
          aria-label="Notifications"
          title="Weather alerts & advisories"
        >
          <WeatherIcon name="bell" size="100%" />
          {unreadAlertsCount > 0 && (
            <span
              className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900 animate-ping"
              aria-hidden="true"
            />
          )}
        </button>

        <div
          className="avatar cursor-pointer hover:ring-2 hover:ring-white/40 transition-all"
          onClick={onProfileClick}
          title={`Profile: ${userName}`}
        >
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces&q=80&auto=format"
            alt={userName}
            loading="eager"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <WeatherIcon name="avatar" size="100%" />
        </div>
      </div>
    </header>
  );
};
