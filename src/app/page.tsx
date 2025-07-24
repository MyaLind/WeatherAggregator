'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { useContract } from '@/hooks/useContract';
import { getRandomTheme } from '@/utils/themes';
import { ConnectionCard } from '@/components/ConnectionCard';
import { ForecastInfoCard } from '@/components/ForecastInfoCard';
import { ContractInfoCard } from '@/components/ContractInfoCard';
import { RegisterStationCard } from '@/components/RegisterStationCard';
import { SubmitWeatherDataCard } from '@/components/SubmitWeatherDataCard';
import { GenerateForecastCard } from '@/components/GenerateForecastCard';
import { StationsList } from '@/components/StationsList';
import { ForecastHistory } from '@/components/ForecastHistory';
import { StationInfo, ForecastInfo, ContractInfo, WeatherForecast } from '@/types';

export default function Home() {
  const { contract, account, isConnected, network, connectWallet } = useWeb3();
  const {
    loading,
    error,
    getContractInfo,
    getForecastInfo,
    registerStation,
    submitWeatherData,
    generateForecast,
    toggleTimeWindow,
    getStations,
    getForecasts,
    isOwner: checkIsOwner
  } = useContract(contract, account);

  const [theme, setTheme] = useState(getRandomTheme());
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [forecastInfo, setForecastInfo] = useState<ForecastInfo | null>(null);
  const [stations, setStations] = useState<StationInfo[]>([]);
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [userStatus, setUserStatus] = useState('Not authorized');

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-background', theme.background);
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--card-border', theme.cardBorder);
    document.body.style.background = theme.background;

    console.log('🎨 Applied theme:', theme.name);
  }, [theme]);

  // Load data
  const loadData = useCallback(async () => {
    if (!contract) return;

    const [contractData, forecastData, stationsData, forecastsData, ownerStatus] = await Promise.all([
      getContractInfo(),
      getForecastInfo(),
      getStations(),
      getForecasts(),
      checkIsOwner()
    ]);

    if (contractData) setContractInfo(contractData);
    if (forecastData) setForecastInfo(forecastData);
    setStations(stationsData);
    setForecasts(forecastsData);
    setIsOwner(ownerStatus);

    // Determine user status
    if (ownerStatus) {
      setUserStatus('👑 Contract Owner');
    } else if (account) {
      const userStation = stationsData.find(s => s.address.toLowerCase() === account.toLowerCase());
      if (userStation) {
        setUserStatus(userStation.isActive ? '🏢 Active Station' : '❌ Inactive Station');
      } else {
        setUserStatus('Not authorized');
      }
    }
  }, [contract, account, getContractInfo, getForecastInfo, getStations, getForecasts, checkIsOwner]);

  useEffect(() => {
    if (isConnected && contract) {
      loadData();
    }
  }, [isConnected, contract, loadData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!contract) return;

    const interval = setInterval(() => {
      getForecastInfo().then(data => {
        if (data) setForecastInfo(data);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [contract, getForecastInfo]);

  const handleRegisterStation = async (address: string, location: string) => {
    const success = await registerStation(address, location);
    if (success) {
      await loadData();
    }
  };

  const handleSubmitWeatherData = async (data: any) => {
    const success = await submitWeatherData(data);
    if (success) {
      await loadData();
    }
  };

  const handleGenerateForecast = async () => {
    const success = await generateForecast();
    if (success) {
      await loadData();
    }
  };

  const handleToggleTimeWindow = async () => {
    if (!contractInfo) return;
    const success = await toggleTimeWindow(!contractInfo.timeWindowEnabled);
    if (success) {
      await loadData();
    }
  };

  return (
    <>
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      <div className="container">
        <div className="header">
          <h1>🌤️ Confidential Weather Aggregator</h1>
          <p>Secure weather data aggregation using FHE encryption</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '5px' }}>
            ✨ Updated with New Gateway API - Enhanced Security & Performance
          </p>
        </div>

        <div className="grid">
          <ConnectionCard
            isConnected={isConnected}
            account={account}
            network={network}
            onConnect={connectWallet}
          />

          <ForecastInfoCard
            forecastInfo={forecastInfo}
            onRefresh={() => getForecastInfo().then(data => data && setForecastInfo(data))}
          />

          <ContractInfoCard
            contractInfo={contractInfo}
            isOwner={isOwner}
            userStatus={userStatus}
            onRefresh={loadData}
            onToggleTimeWindow={handleToggleTimeWindow}
          />
        </div>

        <RegisterStationCard
          account={account}
          loading={loading}
          error={error}
          onRegister={handleRegisterStation}
        />

        <SubmitWeatherDataCard
          loading={loading}
          error={error}
          onSubmit={handleSubmitWeatherData}
        />

        <GenerateForecastCard
          loading={loading}
          error={error}
          onGenerate={handleGenerateForecast}
        />

        <div className="grid">
          <StationsList
            stations={stations}
            onRefresh={() => getStations().then(setStations)}
          />

          <ForecastHistory
            forecasts={forecasts}
            onRefresh={() => getForecasts().then(setForecasts)}
          />
        </div>
      </div>
    </>
  );
}
