import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBluetooth } from '../../hooks/useBluetooth';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {
  HeartIcon,
  Battery100Icon,
  ArrowPathIcon,
  BluetoothIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  SpeakerWaveIcon,
  BellAlertIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const WearableDevice = () => {
  const navigate = useNavigate();
  const {
    devices,
    connected,
    batteryLevel,
    heartRate,
    deviceInfo,
    scanning,
    supported,
    error,
    requestDevice,
    connect,
    disconnect,
    scanDevices,
    refreshBatteryLevel,
    refreshHeartRate,
    getDeviceName
  } = useBluetooth();

  const [heartRateHistory, setHeartRateHistory] = useState([]);
  const [healthData, setHealthData] = useState({
    steps: 6842,
    calories: 324,
    distance: 5.2,
    sleep: 7.5
  });

  useEffect(() => {
    if (heartRate) {
      setHeartRateHistory(prev => [...prev, heartRate].slice(-20));
    }
  }, [heartRate]);

  const handleScan = async () => {
    const result = await scanDevices(10000);
    if (result.length > 0) {
      toast.success(`Found ${result.length} devices`);
    } else {
      toast.info('No devices found');
    }
  };

  const handleConnect = async (deviceId) => {
    await requestDevice();
    await connect();
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info('Device disconnected');
  };

  const handleRefreshData = async () => {
    await refreshBatteryLevel();
    await refreshHeartRate();
    toast.success('Data refreshed');
  };

  const getHeartRateStatus = () => {
    if (!heartRate) return { color: 'text-gray-400', text: '--' };
    if (heartRate.rate < 60) return { color: 'text-success', text: 'Resting' };
    if (heartRate.rate < 100) return { color: 'text-primary-500', text: 'Normal' };
    if (heartRate.rate < 120) return { color: 'text-warning', text: 'Elevated' };
    return { color: 'text-danger', text: 'High' };
  };

  const getBatteryColor = () => {
    if (!batteryLevel) return 'bg-gray-200';
    if (batteryLevel > 60) return 'bg-success';
    if (batteryLevel > 20) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          ⌚ Wearable Device
        </h1>
        <p className="text-gray-600 mt-1">
          Connect to smartwatches and fitness bands for real-time health monitoring
        </p>
      </div>

      {/* Bluetooth Status */}
      <Card className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BluetoothIcon className={`w-6 h-6 ${supported ? 'text-primary-500' : 'text-gray-400'}`} />
          <div>
            <p className="font-medium">Bluetooth Status</p>
            <p className="text-sm text-gray-500">
              {supported ? 'Supported' : 'Not supported on this device'}
            </p>
          </div>
        </div>
        {connected && (
          <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm">
            Connected to {getDeviceName()}
          </span>
        )}
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device List */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">Available Devices</h3>

          {!supported ? (
            <div className="text-center py-8">
              <XCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Bluetooth not supported</p>
            </div>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={handleScan}
                loading={scanning}
                className="w-full mb-4"
              >
                <ArrowPathIcon className="w-5 h-5 mr-2" />
                Scan for Devices
              </Button>

              {devices.length === 0 ? (
                <div className="text-center py-8">
                  <DevicePhoneMobileIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No devices found</p>
                  <p className="text-xs text-gray-400 mt-2">Click scan to search for devices</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {devices.map((device) => (
                    <div
                      key={device.id}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        device.connected
                          ? 'border-success bg-success/5'
                          : 'border-gray-200 hover:border-primary-500'
                      }`}
                      onClick={() => device.connected ? handleDisconnect() : handleConnect(device.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <BluetoothIcon className={`w-5 h-5 ${
                            device.connected ? 'text-success' : 'text-gray-400'
                          }`} />
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-xs text-gray-500">Signal: {device.rssi} dBm</p>
                          </div>
                        </div>
                        {device.connected && (
                          <CheckCircleIcon className="w-5 h-5 text-success" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Card>

        {/* Health Data */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Real-time Health Data</h3>
            {connected && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshData}
              >
                <ArrowPathIcon className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            )}
          </div>

          {!connected ? (
            <div className="text-center py-12">
              <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-700 mb-2">No Device Connected</h4>
              <p className="text-gray-500 mb-4">Connect a wearable device to see your health data</p>
              <Button
                variant="primary"
                onClick={handleScan}
              >
                <BluetoothIcon className="w-5 h-5 mr-2" />
                Find Devices
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Vital Signs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <HeartIconSolid className={`w-8 h-8 mx-auto mb-2 ${getHeartRateStatus().color}`} />
                  <p className="text-2xl font-bold">{heartRate?.rate || '--'}</p>
                  <p className="text-xs text-gray-600">Heart Rate (bpm)</p>
                  <p className={`text-xs mt-1 ${getHeartRateStatus().color}`}>
                    {getHeartRateStatus().text}
                  </p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Battery100Icon className="w-8 h-8 mx-auto text-primary-500 mb-2" />
                  <p className="text-2xl font-bold">{batteryLevel || '--'}%</p>
                  <p className="text-xs text-gray-600">Battery</p>
                  <div className="w-full h-1 bg-gray-200 mt-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getBatteryColor()}`}
                      style={{ width: `${batteryLevel || 0}%` }}
                    />
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <svg className="w-8 h-8 mx-auto text-warning mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-2xl font-bold">{healthData.steps.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Steps</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <svg className="w-8 h-8 mx-auto text-success mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-2xl font-bold">{healthData.calories}</p>
                  <p className="text-xs text-gray-600">Calories</p>
                </div>
              </div>

              {/* Heart Rate Graph */}
              {heartRateHistory.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Heart Rate Trend (Last 20 readings)</h4>
                  <div className="h-24 flex items-end gap-1">
                    {heartRateHistory.map((hr, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-primary-500 rounded-t"
                        style={{ height: `${(hr.rate / 120) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Device Info */}
              {deviceInfo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Device Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {deviceInfo.manufacturer && (
                      <>
                        <span className="text-gray-500">Manufacturer</span>
                        <span>{deviceInfo.manufacturer}</span>
                      </>
                    )}
                    {deviceInfo.model && (
                      <>
                        <span className="text-gray-500">Model</span>
                        <span>{deviceInfo.model}</span>
                      </>
                    )}
                    {deviceInfo.firmware && (
                      <>
                        <span className="text-gray-500">Firmware</span>
                        <span>{deviceInfo.firmware}</span>
                      </>
                    )}
                    {deviceInfo.serial && (
                      <>
                        <span className="text-gray-500">Serial</span>
                        <span>{deviceInfo.serial}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Safety Features */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-primary-50 rounded-lg">
                  <BellAlertIcon className="w-5 h-5 text-primary-600 mb-2" />
                  <p className="font-medium text-sm">Fall Detection</p>
                  <p className="text-xs text-gray-600">Active - Auto SOS on fall</p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <HeartIcon className="w-5 h-5 text-success mb-2" />
                  <p className="font-medium text-sm">Heart Rate Alert</p>
                  <p className="text-xs text-gray-600">Notify on abnormal HR</p>
                </div>
              </div>

              {/* Disconnect Button */}
              <Button
                variant="danger"
                className="w-full"
                onClick={handleDisconnect}
              >
                Disconnect Device
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-danger/10 text-danger p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default WearableDevice;
