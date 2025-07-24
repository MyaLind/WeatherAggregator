'use client';

import React from 'react';
import { StationInfo } from '@/types';

interface StationsListProps {
  stations: StationInfo[];
  onRefresh: () => void;
}

export const StationsList: React.FC<StationsListProps> = ({ stations, onRefresh }) => {
  return (
    <div className="card">
      <h2>🏢 Weather Stations</h2>
      <div className="station-list">
        {stations.length === 0 ? (
          <div className="status info">No weather stations registered yet</div>
        ) : (
          stations.map((station, index) => (
            <div key={index} className="station-item">
              <h4>Station {index + 1}: {station.location}</h4>
              <div className="station-info">
                <strong>Address:</strong> {station.address.substring(0, 10)}...<br/>
                <strong>Active:</strong> {station.isActive ? '✅ Yes' : '❌ No'}<br/>
                <strong>Submitted This Period:</strong> {station.dataSubmissions > 0 ? '✅ Yes' : '❌ No'}<br/>
                <strong>Total Submissions:</strong> {station.totalSubmissions}
              </div>
            </div>
          ))
        )}
      </div>
      <button className="btn" onClick={onRefresh}>
        🔄 Refresh Stations
      </button>
    </div>
  );
};
