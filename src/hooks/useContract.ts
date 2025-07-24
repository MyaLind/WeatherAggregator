'use client';

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { StationInfo, ForecastInfo, WeatherForecast, ContractInfo, WeatherData } from '@/types';

export const useContract = (contract: ethers.Contract | null, account: string | null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: any): string => {
    let errorMessage = error.message;

    if (errorMessage.includes('Station already registered')) {
      return 'This station address is already registered';
    } else if (errorMessage.includes('Not authorized')) {
      return 'Access denied: You are not authorized';
    } else if (errorMessage.includes('Already submitted')) {
      return 'You have already submitted data for this period';
    } else if (errorMessage.includes('Cannot submit data')) {
      return 'Data submission window is closed';
    } else if (errorMessage.includes('Cannot generate forecast')) {
      return 'Cannot generate forecast at this time';
    } else if (errorMessage.includes('user rejected')) {
      return 'Transaction was rejected';
    } else if (errorMessage.includes('insufficient funds')) {
      return 'Insufficient funds for gas fees';
    }

    const match = errorMessage.match(/execution reverted: (.+?)"/);
    if (match) {
      return match[1];
    }

    return errorMessage;
  };

  const getContractInfo = useCallback(async (): Promise<ContractInfo | null> => {
    if (!contract) return null;

    try {
      const [owner, stationCount, timeWindowEnabled] = await Promise.all([
        contract.owner(),
        contract.stationCount(),
        contract.timeWindowEnabled()
      ]);

      return {
        address: contract.address,
        owner,
        totalStations: stationCount.toNumber(),
        timeWindowEnabled
      };
    } catch (err: any) {
      setError(handleError(err));
      return null;
    }
  }, [contract]);

  const getForecastInfo = useCallback(async (): Promise<ForecastInfo | null> => {
    if (!contract) return null;

    try {
      const info = await contract.getCurrentForecastInfo();
      const canSubmit = await contract.canSubmitData();
      const canGenerate = await contract.canGenerateForecast();

      return {
        id: info[0].toNumber(),
        canSubmitData: canSubmit,
        canGenerateForecast: canGenerate,
        submittedStations: info[3].toNumber()
      };
    } catch (err: any) {
      setError(handleError(err));
      return null;
    }
  }, [contract]);

  const registerStation = useCallback(async (address: string, location: string): Promise<boolean> => {
    if (!contract) return false;

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.registerStation(address, location);
      await tx.wait();
      return true;
    } catch (err: any) {
      setError(handleError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const submitWeatherData = useCallback(async (data: WeatherData): Promise<boolean> => {
    if (!contract) return false;

    setLoading(true);
    setError(null);

    try {
      const tempValue = Math.round(data.temperature * 100);
      const humidityValue = Math.round(data.humidity * 100);
      const pressureValue = Math.round(data.pressure * 100);
      const windSpeedValue = Math.round(data.windSpeed);

      const tx = await contract.submitWeatherData(
        tempValue,
        humidityValue,
        pressureValue,
        windSpeedValue
      );
      await tx.wait();
      return true;
    } catch (err: any) {
      setError(handleError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const generateForecast = useCallback(async (): Promise<boolean> => {
    if (!contract) return false;

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.generateRegionalForecast();
      await tx.wait();
      return true;
    } catch (err: any) {
      setError(handleError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const toggleTimeWindow = useCallback(async (enabled: boolean): Promise<boolean> => {
    if (!contract) return false;

    setLoading(true);
    setError(null);

    try {
      const tx = await contract.setTimeWindowEnabled(enabled);
      await tx.wait();
      return true;
    } catch (err: any) {
      setError(handleError(err));
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const getStations = useCallback(async (): Promise<StationInfo[]> => {
    if (!contract) return [];

    try {
      const count = await contract.stationCount();
      const stations: StationInfo[] = [];

      for (let i = 1; i <= count.toNumber(); i++) {
        try {
          const info = await contract.getStationInfo(i);
          const hasSubmitted = await contract.hasStationSubmitted(i);

          stations.push({
            address: info[0],
            location: info[1],
            isActive: info[2],
            dataSubmissions: hasSubmitted ? 1 : 0,
            totalSubmissions: info[4].toNumber()
          });
        } catch (err) {
          console.error(`Error loading station ${i}:`, err);
        }
      }

      return stations;
    } catch (err: any) {
      setError(handleError(err));
      return [];
    }
  }, [contract]);

  const getForecasts = useCallback(async (limit: number = 5): Promise<WeatherForecast[]> => {
    if (!contract) return [];

    try {
      const count = await contract.forecastCount();
      const forecasts: WeatherForecast[] = [];
      const startFrom = Math.max(1, count.toNumber() - limit);

      for (let i = count.toNumber() - 1; i >= startFrom; i--) {
        try {
          const forecast = await contract.getRegionalForecast(i);

          if (forecast[6]) {
            forecasts.push({
              temperature: forecast[0].toNumber() / 100,
              humidity: forecast[1].toNumber() / 100,
              pressure: forecast[2].toNumber() / 100,
              windSpeed: forecast[3].toNumber(),
              timestamp: forecast[4].toNumber(),
              participatingStations: forecast[5].toNumber(),
              isGenerated: forecast[6]
            });
          }
        } catch (err) {
          console.error(`Error loading forecast ${i}:`, err);
        }
      }

      return forecasts;
    } catch (err: any) {
      setError(handleError(err));
      return [];
    }
  }, [contract]);

  const isOwner = useCallback(async (): Promise<boolean> => {
    if (!contract || !account) return false;

    try {
      const owner = await contract.owner();
      return account.toLowerCase() === owner.toLowerCase();
    } catch (err) {
      return false;
    }
  }, [contract, account]);

  return {
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
    isOwner,
    clearError: () => setError(null)
  };
};
