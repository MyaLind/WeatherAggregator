'use client';

import React, { useState } from 'react';
import { WeatherData } from '@/types';

interface SubmitWeatherDataCardProps {
  loading: boolean;
  error: string | null;
  onSubmit: (data: WeatherData) => Promise<void>;
}

export const SubmitWeatherDataCard: React.FC<SubmitWeatherDataCardProps> = ({
  loading,
  error,
  onSubmit
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 0,
    humidity: 0,
    pressure: 0,
    windSpeed: 0
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!weatherData.temperature && !weatherData.humidity && !weatherData.pressure && !weatherData.windSpeed) {
      setStatus({ type: 'error', message: 'Please fill in all weather data fields' });
      return;
    }

    setStatus({ type: 'info', message: 'Submitting transaction...' });

    try {
      await onSubmit(weatherData);
      setStatus({ type: 'success', message: 'Weather data submitted successfully!' });
      setWeatherData({ temperature: 0, humidity: 0, pressure: 0, windSpeed: 0 });
    } catch (err) {
      setStatus({ type: 'error', message: error || 'Failed to submit weather data' });
    }
  };

  return (
    <div className="card">
      <h2>🌡️ Submit Weather Data</h2>
      <p style={{ marginBottom: '20px', color: '#718096' }}>
        Submit encrypted weather data from your weather station
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid">
          <div className="form-group">
            <label htmlFor="temperature">Temperature (°C)</label>
            <input
              type="number"
              id="temperature"
              step="0.01"
              min="-100"
              max="100"
              value={weatherData.temperature || ''}
              onChange={(e) => setWeatherData({ ...weatherData, temperature: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 22.5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="humidity">Humidity (%)</label>
            <input
              type="number"
              id="humidity"
              step="0.01"
              min="0"
              max="100"
              value={weatherData.humidity || ''}
              onChange={(e) => setWeatherData({ ...weatherData, humidity: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 65.0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pressure">Pressure (hPa)</label>
            <input
              type="number"
              id="pressure"
              step="0.01"
              min="900"
              max="1100"
              value={weatherData.pressure || ''}
              onChange={(e) => setWeatherData({ ...weatherData, pressure: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 1013.25"
            />
          </div>

          <div className="form-group">
            <label htmlFor="windSpeed">Wind Speed (km/h)</label>
            <input
              type="number"
              id="windSpeed"
              step="0.1"
              min="0"
              max="200"
              value={weatherData.windSpeed || ''}
              onChange={(e) => setWeatherData({ ...weatherData, windSpeed: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 15.0"
            />
          </div>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? <><span className="loading"></span>Submitting...</> : '📤 Submit Weather Data'}
        </button>

        {status && (
          <div className={`status ${status.type}`}>
            {status.message}
          </div>
        )}

        {error && !status && (
          <div className="status error">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
