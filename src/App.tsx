/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { CityLocation, CityWeatherData } from './types/weather';
import { INITIAL_CITIES, fetchWeatherData, getFallbackWeatherData, detectCurrentLocation } from './services/weatherApi';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ForecastStrip } from './components/ForecastStrip';
import { RightRail } from './components/RightRail';
import { SearchModal } from './components/SearchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { AddLocationModal } from './components/AddLocationModal';
import { ReportsModal } from './components/ReportsModal';
import { CalendarModal } from './components/CalendarModal';
import { SettingsModal } from './components/SettingsModal';
import { ExploreModal } from './components/ExploreModal';
import { SignOutModal } from './components/SignOutModal';

export default function App() {
  const [activeCity, setActiveCity] = useState<CityLocation>(INITIAL_CITIES[0]);
  const [regionalCities, setRegionalCities] = useState<CityLocation[]>(INITIAL_CITIES.slice(0, 4));
  const [weatherMap, setWeatherMap] = useState<Record<string, CityWeatherData>>(() => {
    const init: Record<string, CityWeatherData> = {};
    INITIAL_CITIES.forEach((c) => {
      init[c.id] = getFallbackWeatherData(c);
    });
    return init;
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(3); // Wednesday active in original
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [windUnit, setWindUnit] = useState<'mph' | 'kmh'>('mph');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);

  // Fetch weather data for a city
  const loadCityWeather = useCallback(async (city: CityLocation) => {
    try {
      const data = await fetchWeatherData(city);
      setWeatherMap((prev) => ({
        ...prev,
        [city.id]: data,
      }));
    } catch (e) {
      console.error(`Failed to load weather for ${city.name}:`, e);
    }
  }, []);

  // Handle detecting user's current location weather
  const handleDetectCurrentLocation = useCallback(async () => {
    setIsDetectingLocation(true);
    try {
      const detected = await detectCurrentLocation();
      if (detected) {
        setActiveCity(detected);
        setSelectedDayIndex(3);
        await loadCityWeather(detected);

        // Put detected city at the top of regional list
        setRegionalCities((prev) => {
          const filtered = prev.filter((c) => c.id !== detected.id);
          return [detected, ...filtered.slice(0, 3)];
        });
      }
    } catch (err) {
      console.warn('Location detection failed:', err);
    } finally {
      setIsDetectingLocation(false);
    }
  }, [loadCityWeather]);

  // When user opens the webpage, automatically detect their current location weather
  useEffect(() => {
    handleDetectCurrentLocation();
  }, [handleDetectCurrentLocation]);

  // Initial load for initial cities
  useEffect(() => {
    INITIAL_CITIES.slice(0, 4).forEach((c) => {
      loadCityWeather(c);
    });
  }, [loadCityWeather]);

  // Load weather when active city changes if missing
  useEffect(() => {
    if (!weatherMap[activeCity.id]) {
      loadCityWeather(activeCity);
    }
  }, [activeCity, weatherMap, loadCityWeather]);

  // Handle selecting city from anywhere (Search, Right Rail, Explore, etc.)
  const handleSelectCity = (city: CityLocation) => {
    setActiveCity(city);
    setSelectedDayIndex(3); // Reset to active forecast day
    loadCityWeather(city);

    // Ensure it's in the regional list so it's readily accessible
    setRegionalCities((prev) => {
      if (prev.some((c) => c.id === city.id)) return prev;
      return [city, ...prev.slice(0, 3)];
    });
  };

  const handleAddCity = (city: CityLocation) => {
    setRegionalCities((prev) => {
      if (prev.some((c) => c.id === city.id)) return prev;
      return [...prev, city];
    });
    loadCityWeather(city);
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'reports') setIsReportsOpen(true);
    else if (tab === 'explore') setIsExploreOpen(true);
    else if (tab === 'calendar') setIsCalendarOpen(true);
    else if (tab === 'settings') setIsSettingsOpen(true);
    else if (tab === 'dashboard') {
      // Close all modals
      setIsReportsOpen(false);
      setIsExploreOpen(false);
      setIsCalendarOpen(false);
      setIsSettingsOpen(false);
    }
  };

  const currentCityWeather = weatherMap[activeCity.id] || getFallbackWeatherData(activeCity);

  // Determine current display weather: if user selected a different day from the strip
  const selectedDay = currentCityWeather.daily[selectedDayIndex];
  const isCustomDay = selectedDayIndex !== 3; // 3 was default active Wednesday

  const displayWeather = isCustomDay && selectedDay
    ? {
        ...currentCityWeather.current,
        temperature: selectedDay.temp,
        conditionText: selectedDay.conditionText,
        precipitationProbability: selectedDay.precipitationProbability,
        windSpeed: selectedDay.windSpeed,
        headlineLine1: selectedDay.conditionText.split(' ')[0] || 'Forecast',
        headlineLine2: `for ${selectedDay.dayName}`,
        blurb: `${selectedDay.conditionText} expected across ${activeCity.name}. Maximum daytime high reaches ${selectedDay.tempMax}°${tempUnit} with wind averaging ${selectedDay.windSpeed} mph. Precipitation chance estimated at ${selectedDay.precipitationProbability}%.`,
      }
    : currentCityWeather.current;

  return (
    <>
      <main className="stage">
        {/* 1. Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSignOutClick={() => setIsSignOutOpen(true)}
        />

        {/* 2. Top Header */}
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenAddLocation={() => setIsAddLocationOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onDetectLocation={handleDetectCurrentLocation}
          isDetectingLocation={isDetectingLocation}
          isCurrentLocationActive={Boolean(activeCity.isCurrentLocation)}
          onProfileClick={() => setIsReportsOpen(true)}
          unreadAlertsCount={2}
          userName="Noman Sheikh"
        />

        {/* 3. Hero Section */}
        <Hero
          city={activeCity}
          weather={displayWeather}
          selectedDayName={selectedDay?.dayName}
          isCustomDay={isCustomDay}
        />

        {/* 4. Forecast Strip & Interactive SVG Wave Chart */}
        <ForecastStrip
          daily={currentCityWeather.daily}
          selectedDayIndex={selectedDayIndex}
          onSelectDay={(idx) => setSelectedDayIndex(idx)}
          tempUnit={tempUnit}
        />

        {/* 5. Right Rail */}
        <RightRail
          activeCity={activeCity}
          activeWeather={currentCityWeather.current}
          savedCitiesWeather={weatherMap}
          regionalCities={regionalCities}
          onSelectCity={handleSelectCity}
          tempUnit={tempUnit}
          onOpenReport={() => setIsReportsOpen(true)}
        />
      </main>

      {/* Interactive Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCity={handleSelectCity}
        onUseCurrentLocation={handleDetectCurrentLocation}
        isDetectingLocation={isDetectingLocation}
      />

      <AddLocationModal
        isOpen={isAddLocationOpen}
        onClose={() => setIsAddLocationOpen(false)}
        onAddCity={handleAddCity}
        existingCityIds={regionalCities.map((c) => c.id)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        cityName={activeCity.name}
        weather={currentCityWeather.current}
      />

      <ReportsModal
        isOpen={isReportsOpen}
        onClose={() => {
          setIsReportsOpen(false);
          setActiveTab('dashboard');
        }}
        city={activeCity}
        weather={currentCityWeather.current}
        tempUnit={tempUnit}
      />

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => {
          setIsCalendarOpen(false);
          setActiveTab('dashboard');
        }}
        city={activeCity}
        daily={currentCityWeather.daily}
        tempUnit={tempUnit}
        onSelectDay={(day) => {
          const idx = currentCityWeather.daily.findIndex((d) => d.dayName === day.dayName);
          if (idx !== -1) setSelectedDayIndex(idx);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          setActiveTab('dashboard');
        }}
        tempUnit={tempUnit}
        setTempUnit={setTempUnit}
        windUnit={windUnit}
        setWindUnit={setWindUnit}
        onRefreshData={() => loadCityWeather(activeCity)}
      />

      <ExploreModal
        isOpen={isExploreOpen}
        onClose={() => {
          setIsExploreOpen(false);
          setActiveTab('dashboard');
        }}
        onSelectCity={handleSelectCity}
      />

      <SignOutModal
        isOpen={isSignOutOpen}
        onClose={() => setIsSignOutOpen(false)}
        userName="Noman Sheikh"
        onConfirm={() => {
          setActiveCity(INITIAL_CITIES[0]);
          setSelectedDayIndex(3);
          setActiveTab('dashboard');
        }}
      />
    </>
  );
}
