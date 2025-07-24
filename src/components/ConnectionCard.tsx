'use client';

import React from 'react';

interface ConnectionCardProps {
  isConnected: boolean;
  account: string | null;
  network: string;
  onConnect: () => void;
}

export const ConnectionCard: React.FC<ConnectionCardProps> = ({
  isConnected,
  account,
  network,
  onConnect
}) => {
  return (
    <div className="card">
      <h2>🔗 Connection Status</h2>
      <div>
        {!isConnected ? (
          <button className="btn" onClick={onConnect}>
            Connect Wallet
          </button>
        ) : (
          <div className="status info">
            <strong>Network:</strong> {network}<br/>
            <strong>Account:</strong> {account ? `${account.substring(0, 6)}...${account.substring(38)}` : '-'}
          </div>
        )}
      </div>
    </div>
  );
};
