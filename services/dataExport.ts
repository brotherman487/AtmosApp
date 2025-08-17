import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { SensorData } from '../types';
import { OVRScore } from '../types/ovr';

interface ExportData {
  version: string;
  timestamp: number;
  user: {
    preferences: any;
    settings: any;
  };
  data: {
    ovrHistory: OVRScore[];
    sensorData: SensorData[];
    offlineData: any;
  };
  metadata: {
    totalRecords: number;
    dateRange: {
      start: number;
      end: number;
    };
  };
}

class DataExportService {
  private static instance: DataExportService;
  private readonly VERSION = '1.0.0';

  private constructor() {}

  static getInstance(): DataExportService {
    if (!DataExportService.instance) {
      DataExportService.instance = new DataExportService();
    }
    return DataExportService.instance;
  }

  async exportData(): Promise<string> {
    try {
      // Gather all data
      const exportData: ExportData = {
        version: this.VERSION,
        timestamp: Date.now(),
        user: {
          preferences: await this.getUserPreferences(),
          settings: await this.getUserSettings(),
        },
        data: {
          ovrHistory: await this.getOVRHistory(),
          sensorData: await this.getSensorData(),
          offlineData: await this.getOfflineData(),
        },
        metadata: {
          totalRecords: 0,
          dateRange: { start: 0, end: 0 },
        },
      };

      // Calculate metadata
      const allRecords = [
        ...exportData.data.ovrHistory,
        ...exportData.data.sensorData,
      ];
      exportData.metadata.totalRecords = allRecords.length;

      if (allRecords.length > 0) {
        const timestamps = allRecords.map(record => record.timestamp);
        exportData.metadata.dateRange = {
          start: Math.min(...timestamps),
          end: Math.max(...timestamps),
        };
      }

      // Create JSON file
      const jsonData = JSON.stringify(exportData, null, 2);
      const fileName = `atmos_backup_${new Date().toISOString().split('T')[0]}.json`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, jsonData);

      return filePath;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  async shareExport(): Promise<void> {
    try {
      const filePath = await this.exportData();
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/json',
          dialogTitle: 'Share Atmos Data Backup',
        });
      } else {
        throw new Error('Sharing not available on this device');
      }
    } catch (error) {
      console.error('Error sharing export:', error);
      throw error;
    }
  }

  async importData(): Promise<void> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        throw new Error('No file selected');
      }

      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const importData: ExportData = JSON.parse(fileContent);

      // Validate import data
      if (!this.validateImportData(importData)) {
        throw new Error('Invalid backup file format');
      }

      // Import data
      await this.importUserData(importData.user);
      await this.importOVRHistory(importData.data.ovrHistory);
      await this.importSensorData(importData.data.sensorData);
      await this.importOfflineData(importData.data.offlineData);

    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  private validateImportData(data: any): data is ExportData {
    return (
      data &&
      typeof data.version === 'string' &&
      typeof data.timestamp === 'number' &&
      data.user &&
      data.data &&
      Array.isArray(data.data.ovrHistory) &&
      Array.isArray(data.data.sensorData)
    );
  }

  private async getUserPreferences(): Promise<any> {
    try {
      const preferences = await AsyncStorage.getItem('user_preferences');
      return preferences ? JSON.parse(preferences) : {};
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {};
    }
  }

  private async getUserSettings(): Promise<any> {
    try {
      const settings = await AsyncStorage.getItem('user_settings');
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Error getting user settings:', error);
      return {};
    }
  }

  private async getOVRHistory(): Promise<OVRScore[]> {
    try {
      const history = await AsyncStorage.getItem('ovr_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting OVR history:', error);
      return [];
    }
  }

  private async getSensorData(): Promise<SensorData[]> {
    try {
      const data = await AsyncStorage.getItem('sensor_data');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting sensor data:', error);
      return [];
    }
  }

  private async getOfflineData(): Promise<any> {
    try {
      const data = await AsyncStorage.getItem('offline_data');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting offline data:', error);
      return {};
    }
  }

  private async importUserData(userData: any): Promise<void> {
    if (userData.preferences) {
      await AsyncStorage.setItem('user_preferences', JSON.stringify(userData.preferences));
    }
    if (userData.settings) {
      await AsyncStorage.setItem('user_settings', JSON.stringify(userData.settings));
    }
  }

  private async importOVRHistory(history: OVRScore[]): Promise<void> {
    if (history.length > 0) {
      await AsyncStorage.setItem('ovr_history', JSON.stringify(history));
    }
  }

  private async importSensorData(data: SensorData[]): Promise<void> {
    if (data.length > 0) {
      await AsyncStorage.setItem('sensor_data', JSON.stringify(data));
    }
  }

  private async importOfflineData(data: any): Promise<void> {
    if (data && Object.keys(data).length > 0) {
      await AsyncStorage.setItem('offline_data', JSON.stringify(data));
    }
  }

  async getBackupInfo(): Promise<{
    lastBackup: number | null;
    totalRecords: number;
    dataSize: string;
  }> {
    try {
      const lastBackup = await AsyncStorage.getItem('last_backup_timestamp');
      const totalRecords = await this.getTotalRecords();
      const dataSize = await this.getDataSize();

      return {
        lastBackup: lastBackup ? parseInt(lastBackup) : null,
        totalRecords,
        dataSize,
      };
    } catch (error) {
      console.error('Error getting backup info:', error);
      return {
        lastBackup: null,
        totalRecords: 0,
        dataSize: '0 KB',
      };
    }
  }

  private async getTotalRecords(): Promise<number> {
    try {
      const ovrHistory = await this.getOVRHistory();
      const sensorData = await this.getSensorData();
      return ovrHistory.length + sensorData.length;
    } catch (error) {
      return 0;
    }
  }

  private async getDataSize(): Promise<string> {
    try {
      const allData = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of allData) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += new Blob([value]).size;
        }
      }

      return this.formatBytes(totalSize);
    } catch (error) {
      return '0 KB';
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const dataExport = DataExportService.getInstance();
