// Web Bluetooth API service for wearable devices

class WearableService {
  constructor() {
    this.device = null;
    this.server = null;
    this.services = {};
    this.characteristics = {};
    this.isConnected = false;
    this.onDataReceived = null;
    this.onConnectionChange = null;
  }

  // Check if Bluetooth is supported
  isSupported() {
    return 'bluetooth' in navigator;
  }

  // Request Bluetooth device
  async requestDevice(filters = []) {
    try {
      const options = {
        acceptAllDevices: filters.length === 0,
        optionalServices: [
          'battery_service',
          'heart_rate',
          'device_information',
          '0000180f-0000-1000-8000-00805f9b34fb', // Battery Service
          '0000180d-0000-1000-8000-00805f9b34fb', // Heart Rate Service
          '0000180a-0000-1000-8000-00805f9b34fb', // Device Information
          '0000fee0-0000-1000-8000-00805f9b34fb', // Xiaomi Mi Band
          '0000fee1-0000-1000-8000-00805f9b34fb', // Xiaomi Mi Band 2
          '00001810-0000-1000-8000-00805f9b34fb', // Blood Pressure
          '00001816-0000-1000-8000-00805f9b34fb', // Glucose
          '0000181a-0000-1000-8000-00805f9b34fb', // Body Composition
          '0000181c-0000-1000-8000-00805f9b34fb'  // User Data
        ]
      };

      if (filters.length > 0) {
        options.filters = filters;
      }

      this.device = await navigator.bluetooth.requestDevice(options);
      
      this.device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));
      
      return { success: true, device: this.device };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Connect to device
  async connect() {
    try {
      if (!this.device) {
        throw new Error('No device selected');
      }

      this.server = await this.device.gatt.connect();
      this.isConnected = true;
      
      this.onConnectionChange?.(true);
      
      // Get primary services
      await this.discoverServices();
      
      return { success: true };
    } catch (error) {
      this.isConnected = false;
      return { success: false, error: error.message };
    }
  }

  // Disconnect device
  disconnect() {
    if (this.device && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.isConnected = false;
    this.server = null;
    this.onConnectionChange?.(false);
  }

  // Handle disconnect event
  onDisconnected() {
    this.isConnected = false;
    this.server = null;
    this.onConnectionChange?.(false);
  }

  // Discover all services and characteristics
  async discoverServices() {
    try {
      const services = await this.server.getPrimaryServices();
      
      for (const service of services) {
        this.services[service.uuid] = service;
        
        const characteristics = await service.getCharacteristics();
        this.characteristics[service.uuid] = {};
        
        for (const char of characteristics) {
          this.characteristics[service.uuid][char.uuid] = char;
        }
      }
      
      return { success: true, services: this.services };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Read characteristic
  async readCharacteristic(serviceUuid, characteristicUuid) {
    try {
      const char = this.characteristics[serviceUuid]?.[characteristicUuid];
      if (!char) {
        throw new Error('Characteristic not found');
      }

      const value = await char.readValue();
      return { success: true, value };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Write characteristic
  async writeCharacteristic(serviceUuid, characteristicUuid, value) {
    try {
      const char = this.characteristics[serviceUuid]?.[characteristicUuid];
      if (!char) {
        throw new Error('Characteristic not found');
      }

      await char.writeValue(value);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Subscribe to notifications
  async subscribeToCharacteristic(serviceUuid, characteristicUuid, callback) {
    try {
      const char = this.characteristics[serviceUuid]?.[characteristicUuid];
      if (!char) {
        throw new Error('Characteristic not found');
      }

      await char.startNotifications();
      char.addEventListener('characteristicvaluechanged', callback);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Unsubscribe from notifications
  async unsubscribeFromCharacteristic(serviceUuid, characteristicUuid, callback) {
    try {
      const char = this.characteristics[serviceUuid]?.[characteristicUuid];
      if (!char) {
        throw new Error('Characteristic not found');
      }

      await char.stopNotifications();
      char.removeEventListener('characteristicvaluechanged', callback);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get battery level
  async getBatteryLevel() {
    try {
      const result = await this.readCharacteristic(
        'battery_service',
        'battery_level'
      );

      if (result.success) {
        const batteryLevel = result.value.getUint8(0);
        return { success: true, level: batteryLevel };
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get heart rate
  async getHeartRate() {
    try {
      const result = await this.readCharacteristic(
        'heart_rate',
        'heart_rate_measurement'
      );

      if (result.success) {
        // Parse heart rate measurement (simplified)
        const flags = result.value.getUint8(0);
        const rate = result.value.getUint8(1);
        return { success: true, rate };
      }
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Subscribe to heart rate notifications
  async subscribeToHeartRate(callback) {
    const handleHeartRate = (event) => {
      const value = event.target.value;
      const flags = value.getUint8(0);
      const rate = value.getUint8(1);
      callback({ rate, timestamp: Date.now() });
    };

    return await this.subscribeToCharacteristic(
      'heart_rate',
      'heart_rate_measurement',
      handleHeartRate
    );
  }

  // Get device information
  async getDeviceInfo() {
    try {
      const info = {};

      // Get manufacturer name
      const manufacturer = await this.readCharacteristic(
        'device_information',
        'manufacturer_name_string'
      );
      if (manufacturer.success) {
        info.manufacturer = this.decodeString(manufacturer.value);
      }

      // Get model number
      const model = await this.readCharacteristic(
        'device_information',
        'model_number_string'
      );
      if (model.success) {
        info.model = this.decodeString(model.value);
      }

      // Get serial number
      const serial = await this.readCharacteristic(
        'device_information',
        'serial_number_string'
      );
      if (serial.success) {
        info.serial = this.decodeString(serial.value);
      }

      // Get firmware revision
      const firmware = await this.readCharacteristic(
        'device_information',
        'firmware_revision_string'
      );
      if (firmware.success) {
        info.firmware = this.decodeString(firmware.value);
      }

      // Get hardware revision
      const hardware = await this.readCharacteristic(
        'device_information',
        'hardware_revision_string'
      );
      if (hardware.success) {
        info.hardware = this.decodeString(hardware.value);
      }

      // Get software revision
      const software = await this.readCharacteristic(
        'device_information',
        'software_revision_string'
      );
      if (software.success) {
        info.software = this.decodeString(software.value);
      }

      return { success: true, data: info };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Decode string from DataView
  decodeString(dataView) {
    let result = '';
    for (let i = 0; i < dataView.byteLength; i++) {
      result += String.fromCharCode(dataView.getUint8(i));
    }
    return result;
  }

  // Scan for nearby devices
  async scanForDevices(timeout = 5000) {
    const devices = [];
    
    try {
      const options = {
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'heart_rate']
      };

      const scanner = await navigator.bluetooth.requestLEScan?.({
        acceptAllAdvertisements: true,
        keepRepeatedDevices: true
      });

      if (!scanner) {
        return { success: false, error: 'LEScan not supported' };
      }

      return new Promise((resolve) => {
        setTimeout(() => {
          scanner.stop();
          resolve({ success: true, data: devices });
        }, timeout);

        navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
          devices.push({
            name: event.device.name || 'Unknown Device',
            id: event.device.id,
            rssi: event.rssi,
            txPower: event.txPower
          });
        });
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check if device is connected
  isDeviceConnected() {
    return this.isConnected && this.device?.gatt?.connected;
  }

  // Get device name
  getDeviceName() {
    return this.device?.name || 'Unknown Device';
  }

  // Get device ID
  getDeviceId() {
    return this.device?.id;
  }
}

// Create singleton instance
export const wearableService = new WearableService();
