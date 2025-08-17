import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Thermometer, Brain, Wind, Activity, Battery, Wifi, Zap } from 'lucide-react-native';
import { SensorData, WearableStatus } from '../types';
import { wearableService } from '../services/wearableService';

const { width } = Dimensions.get('window');

interface SensorDashboardProps {
  onSensorAlert?: (sensor: keyof SensorData, value: number) => void;
  onWearableStatusChange?: (status: WearableStatus) => void;
}

const SensorDashboard: React.FC<SensorDashboardProps> = ({ 
  onSensorAlert, 
  onWearableStatusChange 
}) => {
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [wearableStatus, setWearableStatus] = useState<WearableStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    initializeWearable();
    return () => {
      wearableService.disconnect();
    };
  }, []);

  const initializeWearable = async () => {
    try {
      // Set up subscription first
      const unsubscribe = wearableService.subscribe((data: SensorData) => {
        setCurrentData(data);
        checkForAlerts(data);
      });

      // Then connect to wearable
      const connected = await wearableService.connect();
      setIsConnected(connected);
      
      if (connected) {
        const status = wearableService.getWearableStatus();
        setWearableStatus(status);
        onWearableStatusChange?.(status);
      }

      return unsubscribe;
    } catch (error) {
      console.error('Failed to connect to wearable:', error);
    }
  };

  const checkForAlerts = (data: SensorData) => {
    if (data.stressIndex > 80) {
      onSensorAlert?.('stressIndex', data.stressIndex);
    }
    if (data.heartRate > 100 || data.heartRate < 50) {
      onSensorAlert?.('heartRate', data.heartRate);
    }
    if (data.airQuality < 40) {
      onSensorAlert?.('airQuality', data.airQuality);
    }
  };

  const getStatusColor = (value: number, thresholds: { low: number; medium: number; high: number }) => {
    if (value <= thresholds.low) return '#10b981';
    if (value <= thresholds.medium) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusIcon = (value: number, thresholds: { low: number; medium: number; high: number }) => {
    if (value <= thresholds.low) return '🟢';
    if (value <= thresholds.medium) return '🟡';
    return '🔴';
  };

  const renderSensorCard = (
    title: string,
    value: number | string,
    unit: string,
    icon: React.ReactNode,
    color: string,
    status?: string
  ) => (
    <View 
      style={[
        styles.sensorCard,
        { borderColor: color + '40' },
      ]}
    >
      <View style={styles.sensorHeader}>
        {icon}
        <Text style={styles.sensorTitle}>{title}</Text>
        {status && <Text style={[styles.statusText, { color }]}>{status}</Text>}
      </View>
      <View style={styles.sensorValue}>
        <Text style={[styles.valueText, { color }]}>{value}</Text>
        <Text style={styles.unitText}>{unit}</Text>
      </View>
    </View>
  );

  const renderWearableStatus = () => {
    if (!wearableStatus) return null;

    return (
      <View style={styles.wearableStatus}>
        <View style={styles.statusRow}>
          <Battery size={16} color="#7dd3fc" />
          <Text style={styles.statusText}>{wearableStatus.batteryLevel}%</Text>
          <Wifi size={16} color="#7dd3fc" />
          <Text style={styles.statusText}>{wearableStatus.signalStrength}%</Text>
        </View>
        <Text style={styles.firmwareText}>v{wearableStatus.firmwareVersion}</Text>
      </View>
    );
  };

  if (!isConnected) {
    return (
      <View style={styles.connectingContainer}>
        <View style={styles.connectingIcon}>
          <Zap size={32} color="#7dd3fc" />
        </View>
        <Text style={styles.connectingText}>Connecting to Atmos...</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeWearable}>
          <Text style={styles.retryButtonText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Initializing sensors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(125, 211, 252, 0.1)', 'rgba(125, 211, 252, 0.05)', 'transparent']}
        style={styles.background}
      />
      
      {renderWearableStatus()}

      <View style={styles.sensorGrid}>
        {renderSensorCard(
          'Heart Rate',
          Math.round(currentData.heartRate),
          'BPM',
          <Heart size={20} color="#ef4444" />,
          getStatusColor(currentData.heartRate, { low: 60, medium: 80, high: 100 }),
          getStatusIcon(currentData.heartRate, { low: 60, medium: 80, high: 100 })
        )}

        {renderSensorCard(
          'Skin Temp',
          currentData.skinTemperature.toFixed(1),
          '°C',
          <Thermometer size={20} color="#f97316" />,
          getStatusColor(currentData.skinTemperature, { low: 36, medium: 37.5, high: 39 }),
          getStatusIcon(currentData.skinTemperature, { low: 36, medium: 37.5, high: 39 })
        )}

        {renderSensorCard(
          'Stress Index',
          Math.round(currentData.stressIndex),
          '%',
          <Brain size={20} color="#a855f7" />,
          getStatusColor(currentData.stressIndex, { low: 30, medium: 60, high: 80 }),
          getStatusIcon(currentData.stressIndex, { low: 30, medium: 60, high: 80 })
        )}

        {renderSensorCard(
          'Air Quality',
          Math.round(currentData.airQuality),
          'AQI',
          <Wind size={20} color="#10b981" />,
          getStatusColor(currentData.airQuality, { low: 50, medium: 70, high: 90 }),
          getStatusIcon(currentData.airQuality, { low: 50, medium: 70, high: 90 })
        )}

        {renderSensorCard(
          'Movement',
          Math.round(currentData.movement),
          '%',
          <Activity size={20} color="#06b6d4" />,
          getStatusColor(currentData.movement, { low: 20, medium: 50, high: 80 }),
          getStatusIcon(currentData.movement, { low: 20, medium: 50, high: 80 })
        )}

        {currentData.sleepQuality !== undefined && renderSensorCard(
          'Sleep Quality',
          Math.round(currentData.sleepQuality),
          '%',
          <Zap size={20} color="#f59e0b" />,
          getStatusColor(currentData.sleepQuality, { low: 60, medium: 75, high: 85 }),
          getStatusIcon(currentData.sleepQuality, { low: 60, medium: 75, high: 85 })
        )}
      </View>

      <View style={styles.liveIndicator}>
        <View style={styles.liveDot} />
        <Text style={styles.liveText}>LIVE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.2)',
    margin: 16,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  wearableStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
    borderRadius: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    color: '#7dd3fc',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  firmwareText: {
    color: '#7dd3fc',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
  },
  sensorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  sensorCard: {
    width: (width - 80) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 100,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sensorTitle: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    flex: 1,
  },
  sensorValue: {
    alignItems: 'center',
  },
  valueText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  unitText: {
    color: '#7dd3fc',
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  liveText: {
    color: '#ef4444',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  connectingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  connectingIcon: {
    marginBottom: 16,
  },
  connectingText: {
    color: '#7dd3fc',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: 'rgba(125, 211, 252, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7dd3fc',
  },
  retryButtonText: {
    color: '#7dd3fc',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    color: '#7dd3fc',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});

export default SensorDashboard; 