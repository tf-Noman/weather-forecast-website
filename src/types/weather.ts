export interface CityLocation {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
  isCurrentLocation?: boolean;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  conditionCode: number;
  conditionText: string;
  icon: 'cloud' | 'cloud2' | 'hail' | 'sun' | 'wind' | 'drop';
  windSpeed: number;
  windGust: number;
  precipitationProbability: number;
  precipitation: number;
  humidity: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  dewPoint: number;
  cloudCover: number;
  headlineLine1: string;
  headlineLine2: string;
  blurb: string;
  updatedAt: string;
}

export interface DayForecast {
  dayName: string;
  dateStr: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  conditionText: string;
  icon: 'cloud' | 'cloud2' | 'hail' | 'sun' | 'wind' | 'drop';
  precipitationProbability: number;
  windSpeed: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: 'cloud' | 'cloud2' | 'hail' | 'sun';
}

export interface CityWeatherData {
  city: CityLocation;
  current: CurrentWeather;
  daily: DayForecast[];
  hourly: HourlyForecast[];
}
