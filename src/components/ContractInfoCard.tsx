'use client';

import React from 'react';
import { ContractInfo } from '@/types';

interface ContractInfoCardProps {
  contractInfo: ContractInfo | null;
  isOwner: boolean;
  userStatus: string;
  onRefresh: () => void;
  onToggleTimeWindow: () => void;
}

export const ContractInfoCard: React.FC<ContractInfoCardProps> = ({
  contractInfo,
  isOwner,
  userStatus,
  onRefresh,
  onToggleTimeWindow
}) => {
  return (
    <div className="card">
      <h2>ℹ️ Contract Information</h2>
      <div className="status info">
        <strong>Contract Address:</strong> {contractInfo?.address ? `${contractInfo.address.substring(0, 10)}...` : '-'}<br/>
        <strong>Owner:</strong> {contractInfo?.owner ? `${contractInfo.owner.substring(0, 10)}...` : '-'}<br/>
        <strong>Total Stations:</strong> {contractInfo?.totalStations || '-'}<br/>
        <strong>Your Status:</strong> {userStatus}<br/>
        <strong>Time Window:</strong> {contractInfo?.timeWindowEnabled ? '✅ Enabled' : '❌ Disabled'}
      </div>
      <button className="btn" onClick={onRefresh}>
        🔄 Refresh Info
      </button>
      {isOwner && (
        <button className="btn" onClick={onToggleTimeWindow} style={{ marginTop: '10px' }}>
          ⏰ Toggle Time Window
        </button>
      )}
    </div>
  );
};
