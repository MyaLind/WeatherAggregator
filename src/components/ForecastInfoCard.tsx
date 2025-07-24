'use client';

import React from 'react';
import { ForecastInfo } from '@/types';

interface ForecastInfoCardProps {
  forecastInfo: ForecastInfo | null;
  onRefresh: () => void;
}

export const ForecastInfoCard: React.FC<ForecastInfoCardProps> = ({
  forecastInfo,
  onRefresh
}) => {
  return (
    <div className="card">
      <h2>📊 Current Forecast Period</h2>
      <div className="status info">
        <strong>Forecast ID:</strong> {forecastInfo?.id || '-'}<br/>
        <strong>Can Submit Data:</strong> {forecastInfo?.canSubmitData ? '✅ Yes' : '❌ No'}<br/>
        <strong>Can Generate Forecast:</strong> {forecastInfo?.canGenerateForecast ? '✅ Yes' : '❌ No'}<br/>
        <strong>Submitted Stations:</strong> {forecastInfo?.submittedStations || '-'}
      </div>
      <button className="btn" onClick={onRefresh}>
        🔄 Refresh Info
      </button>
    </div>
  );
};
