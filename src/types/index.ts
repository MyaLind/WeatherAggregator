export interface StationInfo {
  address: string;
  location: string;
  isActive: boolean;
  dataSubmissions: number;
  totalSubmissions: number;
}

export interface ForecastInfo {
  id: number;
  canSubmitData: boolean;
  canGenerateForecast: boolean;
  submittedStations: number;
}

export interface WeatherForecast {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  timestamp: number;
  participatingStations: number;
  isGenerated: boolean;
}

export interface ContractInfo {
  address: string;
  owner: string;
  totalStations: number;
  timeWindowEnabled: boolean;
}

export interface Theme {
  name: string;
  background: string;
  cardBorder: string;
  primaryColor: string;
  accentColor: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
}
