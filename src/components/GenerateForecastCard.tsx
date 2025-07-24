'use client';

import React, { useState } from 'react';

interface GenerateForecastCardProps {
  loading: boolean;
  error: string | null;
  onGenerate: () => Promise<void>;
}

export const GenerateForecastCard: React.FC<GenerateForecastCardProps> = ({
  loading,
  error,
  onGenerate
}) => {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  const handleGenerate = async () => {
    setStatus({ type: 'info', message: 'Submitting transaction...' });

    try {
      await onGenerate();
      setStatus({ type: 'success', message: 'Regional forecast generation initiated!' });
    } catch (err) {
      setStatus({ type: 'error', message: error || 'Failed to generate forecast' });
    }
  };

  return (
    <div className="card">
      <h2>🎯 Generate Regional Forecast</h2>
      <p style={{ marginBottom: '20px', color: '#718096' }}>
        Aggregate data from all stations to generate regional forecast
      </p>

      <button
        className="btn"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? <><span className="loading"></span>Generating...</> : '⚡ Generate Forecast'}
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
    </div>
  );
};
