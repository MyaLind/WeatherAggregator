'use client';

import React from 'react';
import { WeatherForecast } from '@/types';

interface ForecastHistoryProps {
  forecasts: WeatherForecast[];
  onRefresh: () => void;
}

export const ForecastHistory: React.FC<ForecastHistoryProps> = ({ forecasts, onRefresh }) => {
  return (
    <div className="card">
      <h2>📈 Recent Forecasts</h2>
      <div className="forecast-history">
        {forecasts.length === 0 ? (
          <div className="status info">No forecasts generated yet</div>
        ) : (
          forecasts.map((forecast, index) => (
            <div key={index} className="forecast-item">
              <div className="forecast-header">
                <span className="forecast-id">Forecast #{index + 1}</span>
                <span className="forecast-time">
                  {new Date(forecast.timestamp * 1000).toLocaleString()}
                </span>
              </div>
              <div className="weather-data">
                <div className="weather-item">
                  <span className="value">{forecast.temperature.toFixed(1)}°C</span>
                  <span className="label">Temperature</span>
                </div>
                <div className="weather-item">
                  <span className="value">{forecast.humidity.toFixed(1)}%</span>
                  <span className="label">Humidity</span>
                </div>
                <div className="weather-item">
                  <span className="value">{forecast.pressure.toFixed(2)} hPa</span>
                  <span className="label">Pressure</span>
                </div>
                <div className="weather-item">
                  <span className="value">{forecast.windSpeed} km/h</span>
                  <span className="label">Wind Speed</span>
                </div>
              </div>
              <div style={{ marginTop: '10px', color: '#718096', fontSize: '0.9rem' }}>
                Participating Stations: {forecast.participatingStations}
              </div>
            </div>
          ))
        )}
      </div>
      <button className="btn" onClick={onRefresh}>
        🔄 Refresh Forecasts
      </button>
    </div>
  );
};
