import { SensorData, WearableStatus, AIInsight } from '../types';

class WearableService {
  private static instance: WearableService;
  private listeners: Array<(data: SensorData) => void> = [];
  private isConnected = false;
  private dataInterval: ReturnType<typeof setInterval> | null = null;
  private mockData: SensorData[] = [];

  // Simulated wearable status
  private wearableStatus: WearableStatus = {
    connected: false,
    batteryLevel: 85,
    lastSync: Date.now(),
    firmwareVersion: '2.1.0',
    signalStrength: 92,
  };

  // Mock sensor data for development
  private async generateMockSensorData(): Promise<SensorData> {
    const now = Date.now();
    const timeOfDay = new Date().getHours();
    
    // Simulate realistic sensor readings based on time of day
    let baseHeartRate = 65;
    let baseStress = 30;
    
    if (timeOfDay < 6) {
      // Early morning - lower heart rate, higher stress
      baseHeartRate = 58;
      baseStress = 45;
    } else if (timeOfDay < 12) {
      // Morning - moderate heart rate, lower stress
      baseHeartRate = 72;
      baseStress = 25;
    } else if (timeOfDay < 18) {
      // Afternoon - higher heart rate, moderate stress
      baseHeartRate = 78;
      baseStress = 35;
    } else {
      // Evening - moderate heart rate, higher stress
      baseHeartRate = 68;
      baseStress = 40;
    }

    const baseSensorData: SensorData = {
      timestamp: Date.now(),
      heartRate: Math.round(60 + Math.random() * 40),
      skinTemperature: Math.round((36.5 + Math.random() * 2) * 10) / 10, // Keep one decimal for temperature
      stressIndex: Math.round(Math.max(0, Math.min(100, baseStress + Math.random() * 30 - 15))),
      airQuality: Math.round(70 + Math.random() * 30),
      movement: Math.round(Math.random() * 100),
      sleepQuality: timeOfDay < 6 ? Math.round(85 + Math.random() * 15) : undefined,
      moodScore: Math.round(50 + Math.random() * 50),
      location: {
        latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
        altitude: 10 + Math.random() * 50,
      },
    };

    // Enhance with real data sources if available
    try {
      // Import services dynamically to avoid circular dependencies
      const { environmentalService } = await import('./environmentalService');
      const { healthService } = await import('./healthService');
      
      // Update with environmental data
      let enhancedData = await environmentalService.updateSensorDataWithEnvironmentalData(baseSensorData);
      
      // Update with health data
      enhancedData = await healthService.updateSensorDataWithHealthData(enhancedData);
      
      return enhancedData;
    } catch (error) {
      console.log('Using base sensor data (real services not available):', error);
      return baseSensorData;
    }
  }

  // Connect to wearable (simulated)
  async connect(): Promise<boolean> {
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.isConnected = true;
      this.wearableStatus.connected = true;
      this.wearableStatus.lastSync = Date.now();
      
      // Start real-time data stream
      this.startDataStream();
      
      return true;
    } catch (error) {
      console.error('Failed to connect to wearable:', error);
      return false;
    }
  }

  // Disconnect from wearable
  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.wearableStatus.connected = false;
    this.stopDataStream();
  }

  // Start real-time data stream
  private startDataStream(): void {
    if (this.dataInterval) return;
    
    this.dataInterval = setInterval(async () => {
      if (!this.isConnected) return;
      
      const sensorData = await this.generateMockSensorData();
      this.mockData.push(sensorData);
      
      // Keep only last 1000 readings
      if (this.mockData.length > 1000) {
        this.mockData = this.mockData.slice(-1000);
      }
      
      // Notify all listeners
      this.listeners.forEach(listener => listener(sensorData));
      
      // Update wearable status
      this.wearableStatus.batteryLevel = Math.max(0, this.wearableStatus.batteryLevel - 0.01);
      this.wearableStatus.lastSync = Date.now();
    }, 2000); // Update every 2 seconds
  }

  // Stop data stream
  private stopDataStream(): void {
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
      this.dataInterval = null;
    }
  }

  // Subscribe to real-time sensor data
  subscribe(listener: (data: SensorData) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Get current wearable status
  getWearableStatus(): WearableStatus {
    return { ...this.wearableStatus };
  }

  // Get historical sensor data
  getHistoricalData(limit: number = 100): SensorData[] {
    return [...this.mockData].slice(-limit);
  }

  // Get latest sensor reading
  getLatestData(): SensorData | null {
    return this.mockData.length > 0 ? this.mockData[this.mockData.length - 1] : null;
  }

  // Simulate emergency alert
  async triggerEmergencyAlert(): Promise<void> {
    // This would integrate with actual emergency systems
    console.log('Emergency alert triggered');
  }

  // Update firmware (simulated)
  async updateFirmware(): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      this.wearableStatus.firmwareVersion = '2.1.1';
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get connection quality
  getConnectionQuality(): 'excellent' | 'good' | 'fair' | 'poor' {
    const strength = this.wearableStatus.signalStrength;
    if (strength >= 90) return 'excellent';
    if (strength >= 70) return 'good';
    if (strength >= 50) return 'fair';
    return 'poor';
  }
}

// Export singleton instance
export const wearableService = new WearableService();
export default WearableService; 