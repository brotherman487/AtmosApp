import AsyncStorage from '@react-native-async-storage/async-storage';
import { SensorData } from '../types';
import { OVRScore } from '../types/ovr';

interface OfflineData {
  ovrHistory: OVRScore[];
  sensorData: SensorData[];
  lastSync: number;
  pendingActions: any[];
}

class OfflineStorageService {
  private static instance: OfflineStorageService;
  private isOnline: boolean = true;
  private syncQueue: any[] = [];

  private constructor() {
    this.checkOnlineStatus();
  }

  static getInstance(): OfflineStorageService {
    if (!OfflineStorageService.instance) {
      OfflineStorageService.instance = new OfflineStorageService();
    }
    return OfflineStorageService.instance;
  }

  private async checkOnlineStatus() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      this.isOnline = response.ok;
    } catch (error) {
      this.isOnline = false;
    }
  }

  async saveOVRData(ovrScore: OVRScore): Promise<void> {
    try {
      const existingData = await this.getOfflineData();
      existingData.ovrHistory.push(ovrScore);
      
      // Keep only last 100 entries to prevent storage bloat
      if (existingData.ovrHistory.length > 100) {
        existingData.ovrHistory = existingData.ovrHistory.slice(-100);
      }
      
      await this.saveOfflineData(existingData);
      
      if (this.isOnline) {
        // Try to sync with server
        await this.syncToServer(ovrScore);
      } else {
        // Queue for later sync
        this.syncQueue.push({ type: 'ovr', data: ovrScore });
      }
    } catch (error) {
      console.error('Error saving OVR data:', error);
    }
  }

  async saveSensorData(sensorData: SensorData): Promise<void> {
    try {
      const existingData = await this.getOfflineData();
      existingData.sensorData.push(sensorData);
      
      // Keep only last 50 sensor readings
      if (existingData.sensorData.length > 50) {
        existingData.sensorData = existingData.sensorData.slice(-50);
      }
      
      await this.saveOfflineData(existingData);
      
      if (this.isOnline) {
        await this.syncToServer(sensorData);
      } else {
        this.syncQueue.push({ type: 'sensor', data: sensorData });
      }
    } catch (error) {
      console.error('Error saving sensor data:', error);
    }
  }

  async getOfflineOVRHistory(): Promise<OVRScore[]> {
    try {
      const data = await this.getOfflineData();
      return data.ovrHistory;
    } catch (error) {
      console.error('Error getting offline OVR history:', error);
      return [];
    }
  }

  async getOfflineSensorData(): Promise<SensorData[]> {
    try {
      const data = await this.getOfflineData();
      return data.sensorData;
    } catch (error) {
      console.error('Error getting offline sensor data:', error);
      return [];
    }
  }

  async syncWhenOnline(): Promise<void> {
    await this.checkOnlineStatus();
    
    if (this.isOnline && this.syncQueue.length > 0) {
      console.log(`Syncing ${this.syncQueue.length} pending actions...`);
      
      for (const action of this.syncQueue) {
        try {
          await this.syncToServer(action.data);
        } catch (error) {
          console.error('Error syncing action:', error);
        }
      }
      
      this.syncQueue = [];
      const data = await this.getOfflineData();
      data.lastSync = Date.now();
      await this.saveOfflineData(data);
    }
  }

  private async getOfflineData(): Promise<OfflineData> {
    try {
      const data = await AsyncStorage.getItem('offline_data');
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error reading offline data:', error);
    }
    
    return {
      ovrHistory: [],
      sensorData: [],
      lastSync: Date.now(),
      pendingActions: []
    };
  }

  private async saveOfflineData(data: OfflineData): Promise<void> {
    try {
      await AsyncStorage.setItem('offline_data', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }

  private async syncToServer(data: any): Promise<void> {
    // This would be implemented when you have a backend
    // For now, we'll just simulate a successful sync
    console.log('Syncing to server:', data);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  isOffline(): boolean {
    return !this.isOnline;
  }

  getPendingSyncCount(): number {
    return this.syncQueue.length;
  }

  async clearOfflineData(): Promise<void> {
    try {
      await AsyncStorage.removeItem('offline_data');
      this.syncQueue = [];
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }
}

export const offlineStorage = OfflineStorageService.getInstance();
