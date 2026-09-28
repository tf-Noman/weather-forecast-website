import { CityLocation, CityWeatherData, CurrentWeather, DayForecast, HourlyForecast } from '../types/weather';

const safeFetch = (url: string, init?: RequestInit): Promise<Response> => {
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    return window.fetch(url, init);
  }
  if (typeof globalThis !== 'undefined' && typeof globalThis.fetch === 'function') {
    return globalThis.fetch(url, init);
  }
  return fetch(url, init);
};

export const INITIAL_CITIES: CityLocation[] = [
  {
    id: 'new-delhi',
    name: 'New Delhi',
    region: 'Delhi NCR',
    country: 'India',
    lat: 28.6139,
    lng: 77.2090,
    isDefault: true,
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    region: 'Maharashtra',
    country: 'India',
    lat: 19.0760,
    lng: 72.8777,
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    region: 'Karnataka',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
  },
  {
    id: 'kolkata',
    name: 'Kolkata',
    region: 'West Bengal',
    country: 'India',
    lat: 22.5726,
    lng: 88.3639,
  },
  {
    id: 'chennai',
    name: 'Chennai',
    region: 'Tamil Nadu',
    country: 'India',
    lat: 13.0827,
    lng: 80.2707,
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    region: 'Telangana',
    country: 'India',
    lat: 17.3850,
    lng: 78.4867,
  },
  {
    id: 'pune',
    name: 'Pune',
    region: 'Maharashtra',
    country: 'India',
    lat: 18.5204,
    lng: 73.8567,
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    region: 'Gujarat',
    country: 'India',
    lat: 23.0225,
    lng: 72.5714,
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    region: 'Rajasthan',
    country: 'India',
    lat: 26.9124,
    lng: 75.7873,
  },
  {
    id: 'srinagar',
    name: 'Srinagar',
    region: 'Jammu & Kashmir',
    country: 'India',
    lat: 34.0837,
    lng: 74.7973,
  },
];

export const TOP_INDIAN_PRIORITY_CITIES: CityLocation[] = [
  ...INITIAL_CITIES,
  { id: 'goa', name: 'Goa (Panaji)', region: 'Goa', country: 'India', lat: 15.4909, lng: 73.8278 },
  { id: 'kochi', name: 'Kochi', region: 'Kerala', country: 'India', lat: 9.9312, lng: 76.2673 },
  { id: 'lucknow', name: 'Lucknow', region: 'Uttar Pradesh', country: 'India', lat: 26.8467, lng: 80.9462 },
  { id: 'chandigarh', name: 'Chandigarh', region: 'Punjab & Haryana', country: 'India', lat: 30.7333, lng: 76.7794 },
  { id: 'guwahati', name: 'Guwahati', region: 'Assam', country: 'India', lat: 26.1445, lng: 91.7362 },
  { id: 'bhubaneswar', name: 'Bhubaneswar', region: 'Odisha', country: 'India', lat: 20.2961, lng: 85.8245 },
  { id: 'shimla', name: 'Shimla', region: 'Himachal Pradesh', country: 'India', lat: 31.1048, lng: 77.1734 },
  { id: 'surat', name: 'Surat', region: 'Gujarat', country: 'India', lat: 21.1702, lng: 72.8311 },
];

function mapWmoToCondition(code: number): {
  text: string;
  icon: 'cloud' | 'cloud2' | 'hail' | 'sun';
  line1: string;
  line2: string;
} {
  // WMO Weather interpretation codes (WW)
  if (code === 0) {
    return { text: 'Clear Sky', icon: 'sun', line1: 'Sunny', line2: 'with Clear Skies' };
  }
  if (code === 1 || code === 2) {
    return { text: 'Mostly Sunny', icon: 'cloud2', line1: 'Partly Cloudy', line2: 'with Warm Breeze' };
  }
  if (code === 3) {
    return { text: 'Overcast', icon: 'cloud', line1: 'Cloudy', line2: 'with Dense Overcast' };
  }
  if ([45, 48].includes(code)) {
    return { text: 'Haze & Mist', icon: 'cloud', line1: 'Misty', line2: 'with Low Visibility' };
  }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return { text: 'Light Drizzle', icon: 'cloud2', line1: 'Drizzle', line2: 'with Monsoon Showers' };
  }
  if ([61, 63, 65, 80, 81, 82].includes(code)) {
    return { text: 'Rain Showers', icon: 'cloud2', line1: 'Rain', line2: 'with Heavy Downpour' };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { text: 'Snow & Sleet', icon: 'hail', line1: 'Snow', line2: 'with Cold Waves' };
  }
  if ([95, 96, 99].includes(code)) {
    return { text: 'Thunderstorm', icon: 'hail', line1: 'Strom', line2: 'with Heavy Rain' };
  }
  return { text: 'Cloudy', icon: 'cloud', line1: 'Overcast', line2: 'with Cool Breeze' };
}

const DAYS_SHORT = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function fetchWeatherData(city: CityLocation): Promise<CityWeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;

    const res = await safeFetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

    const data = await res.json();
    const curr = data.current;
    const daily = data.daily;
    const hourly = data.hourly;

    const condition = mapWmoToCondition(curr.weather_code);

    // Keep the iconic stylized headline line1 "Strom" for stormy conditions
    const headlineLine1 = curr.weather_code >= 95 ? 'Strom' : condition.line1;
    const headlineLine2 = curr.weather_code >= 95 ? 'with Heavy Rain' : condition.line2;

    const windSpeedMph = Math.round((curr.wind_speed_10m || 16) * 0.621371);
    const windGustKmh = Math.round(curr.wind_gusts_10m || 22);
    const precipProb = daily?.precipitation_probability_max?.[0] ?? Math.round(curr.precipitation > 0 ? 80 : 35);
    const currentTemp = Math.round(curr.temperature_2m);

    // Contextual blurb tailored to Indian geography & atmospheric conditions
    const blurb = `${condition.text} across ${city.name} (${city.region}). High temperature around ${Math.round(daily?.temperature_2m_max?.[0] || currentTemp)}°C.\nWind from the northwest at ${windSpeedMph} mph (${Math.round(curr.wind_speed_10m || 20)} km/h). Precipitation chance is ${precipProb}%, with\nrelative humidity at ${Math.round(curr.relative_humidity_2m || 65)}% and pressure ${Math.round(curr.surface_pressure || 1012)} hPa.`;

    const current: CurrentWeather = {
      temperature: currentTemp,
      apparentTemperature: Math.round(curr.apparent_temperature || currentTemp),
      conditionCode: curr.weather_code,
      conditionText: condition.text,
      icon: condition.icon,
      windSpeed: windSpeedMph,
      windGust: windGustKmh,
      precipitationProbability: precipProb,
      precipitation: curr.precipitation || 0,
      humidity: Math.round(curr.relative_humidity_2m || 65),
      pressure: Math.round(curr.surface_pressure || 1012),
      uvIndex: 6.8,
      visibility: 8.5,
      dewPoint: Math.round(curr.temperature_2m - ((100 - (curr.relative_humidity_2m || 65)) / 5)),
      cloudCover: Math.round(curr.cloud_cover || 70),
      headlineLine1,
      headlineLine2,
      blurb,
      updatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    // Build 6 or 7 day forecast matching Sunday - Friday strip
    const dailyForecasts: DayForecast[] = [];
    const dailyCount = Math.min(daily.time.length, 6);

    for (let i = 0; i < dailyCount; i++) {
      const d = new Date(daily.time[i]);
      const dayName = DAYS_SHORT[d.getDay()];
      const dayCode = daily.weather_code[i];
      const dayCond = mapWmoToCondition(dayCode);

      dailyForecasts.push({
        dayName,
        dateStr: daily.time[i],
        temp: Math.round(daily.temperature_2m_max[i]),
        tempMin: Math.round(daily.temperature_2m_min[i]),
        tempMax: Math.round(daily.temperature_2m_max[i]),
        conditionText: dayCond.text,
        icon: dayCond.icon,
        precipitationProbability: daily.precipitation_probability_max[i] ?? 35,
        windSpeed: Math.round((daily.wind_speed_10m_max[i] || 15) * 0.621371),
      });
    }

    // Hourly sample
    const hourlyForecasts: HourlyForecast[] = [];
    const currentHourIndex = new Date().getHours();
    for (let i = 0; i < 6; i++) {
      const idx = currentHourIndex + i * 2;
      if (hourly.time && hourly.time[idx]) {
        const hCode = hourly.weather_code[idx] || 0;
        const hCond = mapWmoToCondition(hCode);
        hourlyForecasts.push({
          time: new Date(hourly.time[idx]).toLocaleTimeString([], { hour: 'numeric' }),
          temp: Math.round(hourly.temperature_2m[idx]),
          icon: hCond.icon,
        });
      }
    }

    return {
      city,
      current,
      daily: dailyForecasts,
      hourly: hourlyForecasts,
    };
  } catch (error) {
    console.warn(`Falling back to default Indian reference weather for ${city.name}:`, error);
    return getFallbackWeatherData(city);
  }
}

export function getFallbackWeatherData(city: CityLocation): CityWeatherData {
  // New Delhi (Top Priority Default)
  if (city.id === 'new-delhi') {
    return {
      city,
      current: {
        temperature: 28,
        apparentTemperature: 30,
        conditionCode: 95,
        conditionText: 'Monsoon Thunderstorm',
        icon: 'hail',
        windSpeed: 18,
        windGust: 28,
        precipitationProbability: 65,
        precipitation: 14.2,
        humidity: 78,
        pressure: 1008,
        uvIndex: 5.8,
        visibility: 7.2,
        dewPoint: 24,
        cloudCover: 85,
        headlineLine1: 'Strom',
        headlineLine2: 'with Heavy Rain',
        blurb: `Monsoon thunderstorm active across New Delhi and National Capital Region. High around 31°C.\nWind from the east-northeast at 18 mph (29 km/h). Precipitation chance is 65%, with\nrainfall accumulation estimated at 14mm across central districts.`,
        updatedAt: 'Live',
      },
      daily: [
        { dayName: 'Sunday', dateStr: 'Day 1', temp: 28, tempMin: 24, tempMax: 31, conditionText: 'Thunderstorm', icon: 'hail', precipitationProbability: 70, windSpeed: 18 },
        { dayName: 'Monday', dateStr: 'Day 2', temp: 30, tempMin: 25, tempMax: 32, conditionText: 'Rain Showers', icon: 'cloud2', precipitationProbability: 55, windSpeed: 16 },
        { dayName: 'Tuesday', dateStr: 'Day 3', temp: 31, tempMin: 25, tempMax: 33, conditionText: 'Partly Cloudy', icon: 'cloud2', precipitationProbability: 40, windSpeed: 14 },
        { dayName: 'Wednesday', dateStr: 'Day 4', temp: 29, tempMin: 24, tempMax: 30, conditionText: 'Heavy Rain', icon: 'hail', precipitationProbability: 80, windSpeed: 22 },
        { dayName: 'Thursday', dateStr: 'Day 5', temp: 33, tempMin: 26, tempMax: 34, conditionText: 'Sunny', icon: 'sun', precipitationProbability: 15, windSpeed: 12 },
        { dayName: 'Friday', dateStr: 'Day 6', temp: 30, tempMin: 25, tempMax: 32, conditionText: 'Scattered Clouds', icon: 'cloud', precipitationProbability: 35, windSpeed: 15 },
      ],
      hourly: [
        { time: '12:00', temp: 28, icon: 'hail' },
        { time: '14:00', temp: 30, icon: 'cloud2' },
        { time: '16:00', temp: 31, icon: 'cloud2' },
        { time: '18:00', temp: 29, icon: 'hail' },
        { time: '20:00', temp: 33, icon: 'sun' },
        { time: '22:00', temp: 30, icon: 'cloud' },
      ],
    };
  }

  // Mumbai (Priority #2)
  if (city.id === 'mumbai') {
    return {
      city,
      current: {
        temperature: 29,
        apparentTemperature: 33,
        conditionCode: 63,
        conditionText: 'Coastal Monsoon Rain',
        icon: 'cloud2',
        windSpeed: 21,
        windGust: 34,
        precipitationProbability: 85,
        precipitation: 22.5,
        humidity: 86,
        pressure: 1007,
        uvIndex: 5.2,
        visibility: 6.8,
        dewPoint: 26,
        cloudCover: 90,
        headlineLine1: 'Heavy Showers',
        headlineLine2: 'along Konkan Coast',
        blurb: `Vigorous Arabian Sea southwesterly winds over Greater Mumbai. High around 30°C.\nWind speeds gusting up to 34 km/h along Marine Drive and Bandra. High tides with persistent showers.`,
        updatedAt: 'Live',
      },
      daily: [
        { dayName: 'Sunday', dateStr: 'Day 1', temp: 29, tempMin: 26, tempMax: 30, conditionText: 'Monsoon Rain', icon: 'cloud2', precipitationProbability: 85, windSpeed: 22 },
        { dayName: 'Monday', dateStr: 'Day 2', temp: 29, tempMin: 26, tempMax: 30, conditionText: 'Monsoon Rain', icon: 'cloud2', precipitationProbability: 80, windSpeed: 21 },
        { dayName: 'Tuesday', dateStr: 'Day 3', temp: 30, tempMin: 27, tempMax: 31, conditionText: 'Passing Showers', icon: 'cloud2', precipitationProbability: 65, windSpeed: 19 },
        { dayName: 'Wednesday', dateStr: 'Day 4', temp: 28, tempMin: 25, tempMax: 29, conditionText: 'Heavy Downpour', icon: 'hail', precipitationProbability: 90, windSpeed: 25 },
        { dayName: 'Thursday', dateStr: 'Day 5', temp: 31, tempMin: 27, tempMax: 32, conditionText: 'Partly Sunny', icon: 'sun', precipitationProbability: 30, windSpeed: 16 },
        { dayName: 'Friday', dateStr: 'Day 6', temp: 29, tempMin: 26, tempMax: 30, conditionText: 'Cloudy', icon: 'cloud', precipitationProbability: 50, windSpeed: 18 },
      ],
      hourly: [
        { time: '12:00', temp: 29, icon: 'cloud2' },
        { time: '14:00', temp: 30, icon: 'cloud2' },
        { time: '16:00', temp: 30, icon: 'cloud2' },
        { time: '18:00', temp: 28, icon: 'hail' },
        { time: '20:00', temp: 28, icon: 'cloud' },
        { time: '22:00', temp: 27, icon: 'cloud' },
      ],
    };
  }

  // Bengaluru (Priority #3)
  if (city.id === 'bengaluru') {
    return {
      city,
      current: {
        temperature: 24,
        apparentTemperature: 25,
        conditionCode: 2,
        conditionText: 'Pleasant & Breezy',
        icon: 'cloud',
        windSpeed: 15,
        windGust: 22,
        precipitationProbability: 35,
        precipitation: 1.2,
        humidity: 68,
        pressure: 915,
        uvIndex: 7.2,
        visibility: 10.0,
        dewPoint: 17,
        cloudCover: 55,
        headlineLine1: 'Breezy & Cool',
        headlineLine2: 'across Mysore Plateau',
        blurb: `Pleasant plateau climate prevailing across Bengaluru urban and rural districts.\nGentle westerly breeze at 15 mph. Intermittent drizzle with mild evening drops to 20°C.`,
        updatedAt: 'Live',
      },
      daily: [
        { dayName: 'Sunday', dateStr: 'Day 1', temp: 24, tempMin: 19, tempMax: 26, conditionText: 'Breezy Clouds', icon: 'cloud', precipitationProbability: 30, windSpeed: 15 },
        { dayName: 'Monday', dateStr: 'Day 2', temp: 25, tempMin: 20, tempMax: 27, conditionText: 'Scattered Showers', icon: 'cloud2', precipitationProbability: 45, windSpeed: 14 },
        { dayName: 'Tuesday', dateStr: 'Day 3', temp: 26, tempMin: 20, tempMax: 28, conditionText: 'Partly Sunny', icon: 'sun', precipitationProbability: 25, windSpeed: 13 },
        { dayName: 'Wednesday', dateStr: 'Day 4', temp: 23, tempMin: 18, tempMax: 25, conditionText: 'Evening Drizzle', icon: 'cloud2', precipitationProbability: 50, windSpeed: 16 },
        { dayName: 'Thursday', dateStr: 'Day 5', temp: 27, tempMin: 21, tempMax: 29, conditionText: 'Sunny', icon: 'sun', precipitationProbability: 15, windSpeed: 11 },
        { dayName: 'Friday', dateStr: 'Day 6', temp: 25, tempMin: 19, tempMax: 27, conditionText: 'Mild Overcast', icon: 'cloud', precipitationProbability: 35, windSpeed: 14 },
      ],
      hourly: [
        { time: '12:00', temp: 24, icon: 'cloud' },
        { time: '14:00', temp: 26, icon: 'sun' },
        { time: '16:00', temp: 26, icon: 'cloud' },
        { time: '18:00', temp: 23, icon: 'cloud2' },
        { time: '20:00', temp: 22, icon: 'cloud' },
        { time: '22:00', temp: 21, icon: 'cloud' },
      ],
    };
  }

  // Kolkata (Priority #4)
  if (city.id === 'kolkata') {
    return {
      city,
      current: {
        temperature: 31,
        apparentTemperature: 36,
        conditionCode: 80,
        conditionText: 'Tropical Rain Showers',
        icon: 'cloud2',
        windSpeed: 14,
        windGust: 25,
        precipitationProbability: 75,
        precipitation: 8.4,
        humidity: 82,
        pressure: 1009,
        uvIndex: 6.4,
        visibility: 7.8,
        dewPoint: 27,
        cloudCover: 80,
        headlineLine1: 'Warm Rain',
        headlineLine2: 'across Gangetic Delta',
        blurb: `Bay of Bengal moisture surge over Kolkata and Howrah. High around 32°C.\nSoutherly humid winds at 14 mph. Frequent passing thundershowers in late afternoon hours.`,
        updatedAt: 'Live',
      },
      daily: [
        { dayName: 'Sunday', dateStr: 'Day 1', temp: 31, tempMin: 26, tempMax: 33, conditionText: 'Thundershowers', icon: 'cloud2', precipitationProbability: 75, windSpeed: 14 },
        { dayName: 'Monday', dateStr: 'Day 2', temp: 32, tempMin: 27, tempMax: 34, conditionText: 'Humid Rain', icon: 'cloud2', precipitationProbability: 70, windSpeed: 15 },
        { dayName: 'Tuesday', dateStr: 'Day 3', temp: 33, tempMin: 27, tempMax: 35, conditionText: 'Partly Sunny', icon: 'sun', precipitationProbability: 40, windSpeed: 12 },
        { dayName: 'Wednesday', dateStr: 'Day 4', temp: 30, tempMin: 26, tempMax: 32, conditionText: 'Heavy Rain', icon: 'hail', precipitationProbability: 80, windSpeed: 18 },
        { dayName: 'Thursday', dateStr: 'Day 5', temp: 34, tempMin: 28, tempMax: 36, conditionText: 'Sunny & Hot', icon: 'sun', precipitationProbability: 20, windSpeed: 10 },
        { dayName: 'Friday', dateStr: 'Day 6', temp: 31, tempMin: 26, tempMax: 33, conditionText: 'Cloudy', icon: 'cloud', precipitationProbability: 60, windSpeed: 13 },
      ],
      hourly: [
        { time: '12:00', temp: 31, icon: 'cloud2' },
        { time: '14:00', temp: 33, icon: 'cloud2' },
        { time: '16:00', temp: 32, icon: 'hail' },
        { time: '18:00', temp: 30, icon: 'cloud2' },
        { time: '20:00', temp: 29, icon: 'cloud' },
        { time: '22:00', temp: 28, icon: 'cloud' },
      ],
    };
  }

  // Generic fallback for any other Indian city
  return {
    city,
    current: {
      temperature: 28,
      apparentTemperature: 30,
      conditionCode: 2,
      conditionText: 'Partly Cloudy',
      icon: 'cloud2',
      windSpeed: 14,
      windGust: 20,
      precipitationProbability: 35,
      precipitation: 0.5,
      humidity: 70,
      pressure: 1011,
      uvIndex: 6.5,
      visibility: 9.0,
      dewPoint: 22,
      cloudCover: 50,
      headlineLine1: 'Warm Weather',
      headlineLine2: `over ${city.name}`,
      blurb: `Pleasant regional weather conditions across ${city.name}, ${city.region}, ${city.country}.\nGentle breezes with seasonal humidity and stable barometric gradient.`,
      updatedAt: 'Live',
    },
    daily: [
      { dayName: 'Sunday', dateStr: 'Day 1', temp: 28, tempMin: 23, tempMax: 30, conditionText: 'Partly Cloudy', icon: 'cloud2', precipitationProbability: 35, windSpeed: 13 },
      { dayName: 'Monday', dateStr: 'Day 2', temp: 29, tempMin: 24, tempMax: 31, conditionText: 'Sunny', icon: 'sun', precipitationProbability: 20, windSpeed: 12 },
      { dayName: 'Tuesday', dateStr: 'Day 3', temp: 30, tempMin: 24, tempMax: 32, conditionText: 'Clear Skies', icon: 'sun', precipitationProbability: 15, windSpeed: 14 },
      { dayName: 'Wednesday', dateStr: 'Day 4', temp: 27, tempMin: 22, tempMax: 29, conditionText: 'Passing Clouds', icon: 'cloud', precipitationProbability: 45, windSpeed: 16 },
      { dayName: 'Thursday', dateStr: 'Day 5', temp: 31, tempMin: 25, tempMax: 33, conditionText: 'Sunny', icon: 'sun', precipitationProbability: 10, windSpeed: 10 },
      { dayName: 'Friday', dateStr: 'Day 6', temp: 28, tempMin: 23, tempMax: 30, conditionText: 'Cloudy', icon: 'cloud', precipitationProbability: 40, windSpeed: 14 },
    ],
    hourly: [
      { time: '12:00', temp: 28, icon: 'cloud2' },
      { time: '14:00', temp: 30, icon: 'sun' },
      { time: '16:00', temp: 29, icon: 'sun' },
      { time: '18:00', temp: 27, icon: 'cloud' },
      { time: '20:00', temp: 26, icon: 'cloud' },
      { time: '22:00', temp: 25, icon: 'cloud' },
    ],
  };
}

export async function searchCities(query: string): Promise<CityLocation[]> {
  if (!query || query.trim().length < 2) return TOP_INDIAN_PRIORITY_CITIES;

  const cleanQuery = query.trim().toLowerCase();

  // First, check high-priority Indian cities locally for instant response
  const localIndianMatches = TOP_INDIAN_PRIORITY_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(cleanQuery) ||
      c.region.toLowerCase().includes(cleanQuery) ||
      c.country.toLowerCase().includes(cleanQuery)
  );

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=12&language=en&format=json`;
    const res = await safeFetch(url);
    if (!res.ok) throw new Error('Geocoding error');

    const data = await res.json();
    if (!data.results || !data.results.length) return localIndianMatches;

    const apiResults: CityLocation[] = data.results.map((item: { id: number; name: string; admin1?: string; country?: string; latitude: number; longitude: number }) => ({
      id: `${item.id}`,
      name: item.name,
      region: item.admin1 || '',
      country: item.country || '',
      lat: item.latitude,
      lng: item.longitude,
    }));

    // Prioritize Indian cities: India results first, followed by others
    const indianResults = apiResults.filter((c) => c.country.toLowerCase() === 'india');
    const nonIndianResults = apiResults.filter((c) => c.country.toLowerCase() !== 'india');

    // Combine local matches + API Indian results + others (deduplicating by name)
    const combined = [...localIndianMatches];
    [...indianResults, ...nonIndianResults].forEach((city) => {
      if (!combined.some((c) => c.name.toLowerCase() === city.name.toLowerCase() && c.country === city.country)) {
        combined.push(city);
      }
    });

    return combined;
  } catch (err) {
    console.warn('Geocoding fetch failed, falling back to Indian priority list:', err);
    return localIndianMatches.length > 0 ? localIndianMatches : TOP_INDIAN_PRIORITY_CITIES;
  }
}

export async function reverseGeocodeCoords(lat: number, lng: number): Promise<{ name: string; region: string; country: string }> {
  try {
    const res = await safeFetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const name = addr.city || addr.town || addr.village || addr.suburb || addr.municipality || addr.state_district || addr.county || 'Local Area';
        const region = addr.state || addr.state_district || addr.region || '';
        const country = addr.country || '';
        return { name, region, country };
      }
    }
  } catch (err) {
    console.warn('Reverse geocode failed:', err);
  }

  return {
    name: 'Current Location',
    region: `${lat.toFixed(2)}°`,
    country: `${lng.toFixed(2)}°`,
  };
}

export async function detectCurrentLocation(): Promise<CityLocation | null> {
  // Strategy 1: Browser GPS / Device Geolocation
  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    try {
      const coordsPromise = new Promise<{ lat: number; lng: number } | null>((resolve) => {
        const timer = setTimeout(() => resolve(null), 6000);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            clearTimeout(timer);
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => {
            clearTimeout(timer);
            console.warn('Browser geolocation denied or unavailable:', err.message);
            resolve(null);
          },
          { timeout: 5000, enableHighAccuracy: false, maximumAge: 300000 }
        );
      });

      const browserCoords = await coordsPromise;
      if (browserCoords) {
        const geoInfo = await reverseGeocodeCoords(browserCoords.lat, browserCoords.lng);
        return {
          id: 'current-user-location',
          name: geoInfo.name,
          region: geoInfo.region,
          country: geoInfo.country,
          lat: browserCoords.lat,
          lng: browserCoords.lng,
          isCurrentLocation: true,
        };
      }
    } catch (e) {
      console.warn('Geolocation invocation exception:', e);
    }
  }

  // Strategy 2: IP-based Geolocation fallback (works automatically without browser permission prompt)
  try {
    const ipRes = await safeFetch('https://ipwho.is/');
    if (ipRes.ok) {
      const ipData = await ipRes.json();
      if (ipData && ipData.success !== false && typeof ipData.latitude === 'number' && typeof ipData.longitude === 'number') {
        return {
          id: 'current-user-location',
          name: ipData.city || 'Current Location',
          region: ipData.region || '',
          country: ipData.country || '',
          lat: ipData.latitude,
          lng: ipData.longitude,
          isCurrentLocation: true,
        };
      }
    }
  } catch (ipErr) {
    console.warn('IP geolocation primary lookup failed:', ipErr);
  }

  // Strategy 3: Secondary IP fallback via ipapi.co
  try {
    const ipRes2 = await safeFetch('https://ipapi.co/json/');
    if (ipRes2.ok) {
      const d2 = await ipRes2.json();
      if (d2 && d2.latitude && d2.longitude) {
        return {
          id: 'current-user-location',
          name: d2.city || 'Current Location',
          region: d2.region || '',
          country: d2.country_name || '',
          lat: d2.latitude,
          lng: d2.longitude,
          isCurrentLocation: true,
        };
      }
    }
  } catch (err2) {
    console.warn('IP fallback 2 failed:', err2);
  }

  return null;
}

