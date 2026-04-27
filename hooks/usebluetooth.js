import { useState, useEffect, useCallback } from 'react';
import { wearableService } from '../services/bluetooth/wearableService';

export const useBluetooth = () => {
  const [device, setDevice] = useState(null);
  const [connected, setConnected] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [heartRate, setHeartRate] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(true);

  // Check if Bluetooth is supported
  useEffect(() => {
    setSupported(wearableService.isSupported());
  }, []);

  // Set up connection change listener
  useEffect(() => {
    wearableService.onConnectionChange = (status) => {
      setConnected(status);
      if (!status) {
        setDevice(null);
        setBatteryLevel(null);
        setHeartRate(null);
        setDeviceInfo(null);
      }
    };

    return () => {
      wearableService.onConnectionChange = null;
    };
  }, []);

  // Request device
  const requestDevice = useCallback(async (filters = []) => {
    try {
      setError(null);
      const result = await wearableService.requestDevice(filters);
      
      if (result.success) {
        setDevice(result.device);
        return result.device;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  // Connect to device
  const connect = useCallback(async () => {
    try {
      setError(null);
      const result = await wearableService.connect();
      
      if (result.success) {
        setConnected(true);
        
        // Get device info
        const info = await wearableService.getDeviceInfo();
        if (info.success) {
          setDeviceInfo(info.data);
        }

        // Get battery level
        const battery = await wearableService.getBatteryLevel();
        if (battery.success) {
          setBatteryLevel(battery.level);
        }

        // Subscribe to heart rate
        await wearableService.subscribeToHeartRate((data) => {
          setHeartRate(data);
        });

        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  // Disconnect device
  const disconnect = useCallback(() => {
    wearableService.disconnect();
    setConnected(false);
    setDevice(null);
    setBatteryLevel(null);
    setHeartRate(null);
    setDeviceInfo(null);
  }, []);

  // Scan for devices
  const scanDevices = useCallback(async (timeout = 5000) => {
    try {
      setScanning(true);
      setError(null);
      
      const result = await wearableService.scanForDevices(timeout);
      
      if (result.success) {
        setDevices(result.data);
        return result.data;
      } else {
        setError(result.error);
        return [];
      }
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setScanning(false);
    }
  }, []);

  // Read characteristic
  const readCharacteristic = useCallback(async (serviceUuid, characteristicUuid) => {
    try {
      setError(null);
      const result = await wearableService.readCharacteristic(serviceUuid, characteristicUuid);
      
      if (result.success) {
        return result.value;
      } else {
        setError(result.error);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  // Write characteristic
  const writeCharacteristic = useCallback(async (serviceUuid, characteristicUuid, value) => {
    try {
      setError(null);
      const result = await wearableService.writeCharacteristic(serviceUuid, characteristicUuid, value);
      
      if (result.success) {
        return true;
      } else {
        setError(result.error);
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  // Get device name
  const getDeviceName = useCallback(() => {
    return wearableService.getDeviceName();
  }, []);

  // Get device ID
  const getDeviceId = useCallback(() => {
    return wearableService.getDeviceId();
  }, []);

  // Check if connected
  const isConnected = useCallback(() => {
    return wearableService.isDeviceConnected();
  }, []);

  // Refresh battery level
  const refreshBatteryLevel = useCallback(async () => {
    if (!connected) return null;
    
    const result = await wearableService.getBatteryLevel();
    if (result.success) {
      setBatteryLevel(result.level);
      return result.level;
    }
    return null;
  }, [connected]);

  // Refresh heart rate
  const refreshHeartRate = useCallback(async () => {
    if (!connected) return null;
    
    const result = await wearableService.getHeartRate();
    if (result.success) {
      setHeartRate({ rate: result.rate, timestamp: Date.now() });
      return result.rate;
    }
    return null;
  }, [connected]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    device,
    connected,
    batteryLevel,
    heartRate,
    deviceInfo,
    scanning,
    devices,
    error,
    supported,

    // Actions
    requestDevice,
    connect,
    disconnect,
    scanDevices,
    readCharacteristic,
    writeCharacteristic,
    refreshBatteryLevel,
    refreshHeartRate,
    clearError,

    // Getters
    getDeviceName,
    getDeviceId,
    isConnected
  };
};
