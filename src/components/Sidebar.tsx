import React from 'react';
import { LogoSvg, WeatherIcon } from './WeatherIcons';

export type NavTab = 'dashboard' | 'reports' | 'explore' | 'calendar' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onSignOutClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onSignOutClick,
}) => {
  // Mapping of active tab to relative top coordinate on desktop
  const pipTops: Record<NavTab, number> = {
    dashboard: 131,
    reports: 197,
    explore: 263,
    calendar: 329,
    settings: 395,
  };

  return (
    <aside className="sidebar" aria-label="Main Navigation">
      {/* Active Glowing Pip */}
      <div
        className="pip"
        aria-hidden="true"
        style={{
          top: `calc(${pipTops[activeTab]} * var(--u))`,
          transition: 'top 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Logo */}
      <div
        className="logo-box cursor-pointer"
        onClick={() => onTabChange('dashboard')}
        title="Aurora Weather Home"
      >
        <LogoSvg />
      </div>

      {/* Navigation */}
      <nav className="nav">
        <button
          type="button"
          onClick={() => onTabChange('dashboard')}
          aria-label="Dashboard"
          aria-current={activeTab === 'dashboard' ? 'page' : undefined}
          title="Dashboard"
          className="cursor-pointer bg-transparent border-0"
        >
          <WeatherIcon name="grid" size="100%" />
        </button>

        <button
          type="button"
          onClick={() => onTabChange('reports')}
          aria-label="Reports"
          aria-current={activeTab === 'reports' ? 'page' : undefined}
          title="Meteorological Reports"
          className="cursor-pointer bg-transparent border-0"
        >
          <WeatherIcon name="chart" size="100%" />
        </button>

        <button
          type="button"
          onClick={() => onTabChange('explore')}
          aria-label="Explore regions"
          aria-current={activeTab === 'explore' ? 'page' : undefined}
          title="Explore Regions"
          className="cursor-pointer bg-transparent border-0"
        >
          <WeatherIcon name="globe" size="100%" />
        </button>

        <button
          type="button"
          onClick={() => onTabChange('calendar')}
          aria-label="Calendar"
          aria-current={activeTab === 'calendar' ? 'page' : undefined}
          title="14-Day Outlook"
          className="cursor-pointer bg-transparent border-0"
        >
          <WeatherIcon name="cal" size="100%" />
        </button>

        <button
          type="button"
          onClick={() => onTabChange('settings')}
          aria-label="Settings"
          aria-current={activeTab === 'settings' ? 'page' : undefined}
          title="System Settings"
          className="cursor-pointer bg-transparent border-0"
        >
          <WeatherIcon name="gear" size="100%" />
        </button>
      </nav>

      {/* Sign Out */}
      <button
        type="button"
        onClick={onSignOutClick}
        className="signout-link cursor-pointer bg-transparent border-0"
        aria-label="Sign out"
        title="Sign Out"
      >
        <WeatherIcon name="out" size="100%" />
      </button>
    </aside>
  );
};
