'use client';

import React, { useState } from 'react';

interface RegisterStationCardProps {
  account: string | null;
  loading: boolean;
  error: string | null;
  onRegister: (address: string, location: string) => Promise<void>;
}

export const RegisterStationCard: React.FC<RegisterStationCardProps> = ({
  account,
  loading,
  error,
  onRegister
}) => {
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account || !location) {
      setStatus({ type: 'error', message: 'Please fill in station location' });
      return;
    }

    setStatus({ type: 'info', message: 'Submitting transaction...' });

    try {
      await onRegister(account, location);
      setStatus({ type: 'success', message: 'Weather station registered successfully!' });
      setLocation('');
    } catch (err) {
      setStatus({ type: 'error', message: error || 'Failed to register station' });
    }
  };

  return (
    <div className="card">
      <h2>🏢 Register Weather Station</h2>
      <p style={{ marginBottom: '20px', color: '#718096' }}>
        Register your address as a weather station (Owner only)
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="stationAddress">Station Address</label>
          <input
            type="text"
            id="stationAddress"
            value={account || ''}
            readOnly
            placeholder="Connect wallet first"
          />
        </div>

        <div className="form-group">
          <label htmlFor="stationLocation">Station Location</label>
          <input
            type="text"
            id="stationLocation"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., City Center Station"
          />
        </div>

        <button type="submit" className="btn" disabled={loading || !account}>
          {loading ? <><span className="loading"></span>Registering...</> : '📝 Register Station'}
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
