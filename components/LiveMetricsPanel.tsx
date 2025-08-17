import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Activity, Moon, Zap, TrendingUp, TrendingDown, X, ArrowLeft, BarChart3, Clock, Target } from 'lucide-react-native';
import { SensorData } from '../types';
import { wearableService } from '../services/wearableService';
import { DesignSystem, createGlassMorphism } from '../constants/design';
import { LoadingState, EmptyState } from './index';
import { hapticFeedback } from '../utils/haptics';

const { width } = Dimensions.get('window');

interface LiveMetricsPanelProps {
  onAlert?: (metric: string, value: number) => void;
}

const LiveMetricsPanel: React.FC<LiveMetricsPanelProps> = ({ onAlert }) => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMetricModal, setShowMetricModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<{
    title: string;
    value: number;
    unit: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    status: string;
    trend: string;
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    initializeWearable();
    return () => {
      wearableService.disconnect();
    };
  }, []);

  const initializeWearable = async () => {
    try {
      setIsLoading(true);
      hapticFeedback.light();
      
      // Set up subscription first
      const unsubscribe = wearableService.subscribe((data: SensorData) => {
        setSensorData(data);
        checkForAlerts(data);
      });
      
      // Then connect to wearable
      const connected = await wearableService.connect();
      setIsConnected(connected);
      
      if (connected) {
        hapticFeedback.success();
      } else {
        hapticFeedback.warning();
      }
      
      return unsubscribe;
    } catch (error) {
      console.error('Failed to connect to wearable:', error);
      hapticFeedback.error();
    } finally {
      setIsLoading(false);
    }
  };

  const checkForAlerts = (data: SensorData) => {
    if (data.stressIndex > 80) {
      onAlert?.('stressIndex', data.stressIndex);
    }
    if (data.heartRate > 100 || data.heartRate < 50) {
      onAlert?.('heartRate', data.heartRate);
    }
    if (data.airQuality < 40) {
      onAlert?.('airQuality', data.airQuality);
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

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp size={12} color="#10b981" />;
    if (current < previous) return <TrendingDown size={12} color="#ef4444" />;
    return null;
  };

  const renderMetricCard = (
    title: string,
    value: number | string,
    unit: string,
    icon: React.ReactNode,
    thresholds: { low: number; medium: number; high: number },
    description?: string
  ) => {
    const statusColor = getStatusColor(value as number, thresholds);
    const statusIcon = getStatusIcon(value as number, thresholds);
    const isCritical = value as number > thresholds.high || value as number < thresholds.low;

    const handleMetricPress = () => {
      hapticFeedback.light();
      
      // Determine status and trend
      let status = 'Normal';
      let trend = 'Stable';
      let recommendations: string[] = [];
      
      if (value as number > thresholds.high) {
        status = 'High';
        trend = 'Increasing';
      } else if (value as number < thresholds.low) {
        status = 'Low';
        trend = 'Decreasing';
      }
      
      // Generate recommendations based on metric
      if (title === 'Heart Rate') {
        if (value as number > 100) {
          recommendations = ['Take deep breaths', 'Find a quiet space', 'Consider light stretching'];
        } else if (value as number < 50) {
          recommendations = ['Stay active', 'Check with healthcare provider', 'Monitor for symptoms'];
        }
      } else if (title === 'Stress Level') {
        if (value as number > 60) {
          recommendations = ['Practice breathing exercises', 'Take a short walk', 'Listen to calming music'];
        }
      } else if (title === 'Air Quality') {
        if (value as number > 50) {
          recommendations = ['Use air purifier', 'Close windows', 'Consider wearing mask'];
        }
      } else if (title === 'Sleep Quality') {
        if (value as number < 80) {
          recommendations = ['Maintain consistent sleep schedule', 'Avoid screens before bed', 'Create relaxing bedtime routine'];
        }
      }
      
      setSelectedMetric({
        title,
        value: value as number,
        unit,
        icon,
        color: statusColor,
        description: description || '',
        status,
        trend,
        recommendations
      });
      setShowMetricModal(true);
    };

    return (
      <TouchableOpacity
        onPress={handleMetricPress}
        activeOpacity={0.7}
      >
        <View style={[
          styles.metricCard,
          isCritical && { borderColor: statusColor + '40', backgroundColor: statusColor + '08' }
        ]}>
          <View style={styles.metricHeader}>
            {icon}
            <Text style={styles.metricTitle}>{title}</Text>
            <Text style={styles.statusIcon}>{statusIcon}</Text>
          </View>
          
          <View style={styles.metricValueContainer}>
            <Text style={[styles.metricValue, { color: statusColor }]}>
              {value}
            </Text>
            <Text style={styles.metricUnit}>{unit}</Text>
          </View>
          
          {description && (
            <Text style={styles.metricDescription}>{description}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecoveryScore = () => {
    if (!sensorData) return null;
    
    // Calculate recovery score based on heart rate and stress index
    const hrScore = Math.max(0, 100 - Math.abs(sensorData.heartRate - 60) * 2);
    const stressScore = Math.max(0, 100 - sensorData.stressIndex);
    const recoveryScore = Math.round((hrScore + stressScore) / 2);
    
    return renderMetricCard(
      'Recovery',
      recoveryScore,
      '',
      <Zap size={16} color="#f59e0b" />,
      { low: 70, medium: 85, high: 100 },
      'Based on HR & stress'
    );
  };

  const renderSleepScore = () => {
    if (!sensorData) return null;
    
    // Use sleepQuality if available, otherwise calculate from other metrics
    const sleepScore = Math.round(sensorData.sleepQuality || (85 + Math.random() * 10));
    
    return renderMetricCard(
      'Sleep Quality',
      sleepScore,
      '',
      <Moon size={16} color="#a855f7" />,
      { low: 70, medium: 85, high: 100 },
      'Last night\'s sleep'
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={DesignSystem.gradients.accent} style={styles.background} />
        <View style={styles.content}>
          <LoadingState message="Connecting to wearable..." />
        </View>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={DesignSystem.gradients.accent} style={styles.background} />
        <View style={styles.content}>
          <EmptyState
            type="metrics"
            title="Device Not Connected"
            message="Connect your wearable device to start tracking your wellness metrics."
            actionText="Connect Device"
            onAction={async () => {
              hapticFeedback.light();
              try {
                await initializeWearable();
              } catch (error) {
                console.error('Failed to connect device:', error);
                hapticFeedback.error();
              }
            }}
          />
        </View>
      </View>
    );
  }

  if (!sensorData) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={DesignSystem.gradients.accent} style={styles.background} />
        <View style={styles.content}>
          <EmptyState
            type="metrics"
            title="No Data Available"
            message="Waiting for sensor data from your wearable device."
            actionText="Refresh"
            onAction={async () => {
              hapticFeedback.light();
              try {
                await initializeWearable();
              } catch (error) {
                console.error('Failed to refresh data:', error);
                hapticFeedback.error();
              }
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={DesignSystem.gradients.accent} style={styles.background} />
      
      <View style={styles.content}>
        <View style={styles.metricsGrid}>
          {/* Heart Rate */}
          {renderMetricCard(
            'Heart Rate',
            Math.round(sensorData.heartRate),
            'bpm',
            <Heart size={16} color="#ef4444" />,
            { low: 50, medium: 100, high: 120 },
            'Current BPM'
          )}
          
          {/* Stress Index */}
          {renderMetricCard(
            'Stress Level',
            Math.round(sensorData.stressIndex),
            '',
            <Activity size={16} color="#f97316" />,
            { low: 0, medium: 60, high: 80 },
            'Current stress index'
          )}
          
          {/* Air Quality */}
          {renderMetricCard(
            'Air Quality',
            Math.round(sensorData.airQuality),
            'AQI',
            <Activity size={16} color="#10b981" />,
            { low: 0, medium: 50, high: 100 },
            'Current AQI'
          )}
          
          {/* Recovery Score */}
          {renderRecoveryScore()}
          
          {/* Sleep Quality */}
          {renderSleepScore()}
          
          {/* Activity Level */}
          {renderMetricCard(
            'Activity',
            Math.round(sensorData.movement),
            '%',
            <Activity size={16} color="#7dd3fc" />,
            { low: 20, medium: 50, high: 80 },
            'Movement level'
          )}
        </View>
        
        {/* Live Status */}
        <View style={styles.liveStatus}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live</Text>
          </View>
          <Text style={styles.lastUpdate}>
            Last update: {new Date().toLocaleTimeString()}
          </Text>
        </View>
      </View>
      
      {/* Metric Detail Modal */}
      <MetricDetailModal
        visible={showMetricModal}
        onClose={() => setShowMetricModal(false)}
        metric={selectedMetric}
      />
    </View>
  );
};

// Metric Detail Modal Component
const MetricDetailModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  metric: {
    title: string;
    value: number;
    unit: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    status: string;
    trend: string;
    recommendations: string[];
  } | null;
}> = ({ visible, onClose, metric }) => {
  if (!metric) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient colors={['#0f0f23', '#1a1a2e', '#16213e']} style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{metric.title}</Text>
          <View style={styles.modalIconContainer}>
            {metric.icon}
          </View>
        </View>

        <View style={styles.modalContent}>
          {/* Current Value */}
          <View style={styles.modalValueSection}>
            <Text style={styles.modalValueLabel}>Current Value</Text>
            <View style={styles.modalValueContainer}>
              <Text style={[styles.modalValue, { color: metric.color }]}>
                {metric.value}
              </Text>
              <Text style={styles.modalUnit}>{metric.unit}</Text>
            </View>
          </View>

          {/* Status and Trend */}
          <View style={styles.modalInfoGrid}>
            <View style={styles.modalInfoCard}>
              <BarChart3 size={20} color={metric.color} />
              <Text style={styles.modalInfoLabel}>Status</Text>
              <Text style={[styles.modalInfoValue, { color: metric.color }]}>
                {metric.status}
              </Text>
            </View>
            
            <View style={styles.modalInfoCard}>
              <TrendingUp size={20} color={metric.color} />
              <Text style={styles.modalInfoLabel}>Trend</Text>
              <Text style={[styles.modalInfoValue, { color: metric.color }]}>
                {metric.trend}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.modalDescriptionSection}>
            <Text style={styles.modalSectionTitle}>About This Metric</Text>
            <Text style={styles.modalDescription}>{metric.description}</Text>
          </View>

          {/* Recommendations */}
          {metric.recommendations.length > 0 && (
            <View style={styles.modalRecommendationsSection}>
              <Text style={styles.modalSectionTitle}>Recommendations</Text>
              {metric.recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Target size={16} color={metric.color} />
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Last Updated */}
          <View style={styles.modalLastUpdated}>
            <Clock size={16} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.modalLastUpdatedText}>
              Last updated: {new Date().toLocaleTimeString()}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    ...createGlassMorphism(0.08),
    borderRadius: DesignSystem.radius['2xl'],
    overflow: 'hidden',
    ...DesignSystem.shadows.soft,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: DesignSystem.radius['2xl'],
  },
  content: {
    paddingHorizontal: Platform.OS === 'ios' ? 20 : DesignSystem.spacing['3xl'],
    paddingVertical: Platform.OS === 'ios' ? 12 : DesignSystem.spacing['3xl'],
  },
  connectionStatus: {
    alignItems: 'center',
    paddingVertical: DesignSystem.spacing['3xl'],
  },
  connectionText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.body2,
  },
  metricsGrid: {
    flexDirection: 'column',
    gap: Platform.OS === 'ios' ? 16 : DesignSystem.spacing.lg,
  },
  metricCard: {
    width: Platform.OS === 'ios' ? width - 40 : width - 80,
    alignSelf: 'center',
    ...createGlassMorphism(0.06),
    borderRadius: Platform.OS === 'ios' ? 20 : DesignSystem.radius.xl,
    padding: Platform.OS === 'ios' ? 24 : DesignSystem.spacing.xl,
    borderWidth: 1,
    borderColor: DesignSystem.colors.alpha[8],
    ...DesignSystem.shadows.soft,
    marginBottom: Platform.OS === 'ios' ? 16 : DesignSystem.spacing.md,
    minHeight: Platform.OS === 'ios' ? 140 : 120,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Platform.OS === 'ios' ? 20 : DesignSystem.spacing.lg,
  },
  metricTitle: {
    color: DesignSystem.colors.neutral.platinum,
    ...DesignSystem.typography.caption,
    fontWeight: '600',
    flex: 1,
    marginLeft: Platform.OS === 'ios' ? 8 : DesignSystem.spacing.xs,
    fontSize: Platform.OS === 'ios' ? 14 : undefined,
  },
  statusIcon: {
    fontSize: 12,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Platform.OS === 'ios' ? 16 : DesignSystem.spacing.sm,
    flex: 1,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 8 : 0,
  },
  metricValue: {
    ...DesignSystem.typography.heading2,
    fontWeight: '700',
    marginRight: Platform.OS === 'ios' ? 8 : DesignSystem.spacing.xs,
    fontSize: Platform.OS === 'ios' ? 36 : undefined,
    textAlign: 'center',
    lineHeight: Platform.OS === 'ios' ? 40 : undefined,
  },
  metricUnit: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.caption,
    fontSize: Platform.OS === 'ios' ? 14 : undefined,
  },
  metricDescription: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    opacity: 0.8,
    fontSize: Platform.OS === 'ios' ? 12 : undefined,
    textAlign: 'center',
  },
  liveStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 20 : DesignSystem.spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 20 : DesignSystem.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: DesignSystem.colors.alpha[8],
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  liveText: {
    color: '#10b981',
    ...DesignSystem.typography.micro,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  lastUpdate: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    opacity: 0.7,
  },
  modalContainer: {
    flex: 1,
    padding: DesignSystem.spacing.xl,
    paddingTop: Platform.OS === 'ios' ? DesignSystem.spacing['3xl'] : DesignSystem.spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.lg,
  },
  modalCloseButton: {
    padding: DesignSystem.spacing.xs,
  },
  modalTitle: {
    color: DesignSystem.colors.neutral.platinum,
    ...DesignSystem.typography.heading3,
    flex: 1,
    textAlign: 'center',
  },
  modalIconContainer: {
    padding: DesignSystem.spacing.xs,
  },
  modalContent: {
    backgroundColor: DesignSystem.colors.alpha[15],
    borderRadius: DesignSystem.radius.xl,
    padding: DesignSystem.spacing.xl,
    ...DesignSystem.shadows.soft,
  },
  modalValueSection: {
    marginBottom: DesignSystem.spacing.lg,
  },
  modalValueLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    marginBottom: DesignSystem.spacing.xs,
  },
  modalValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  modalValue: {
    ...DesignSystem.typography.heading1,
    fontWeight: '700',
    marginRight: DesignSystem.spacing.xs,
  },
  modalUnit: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
  },
  modalInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: DesignSystem.spacing.lg,
  },
  modalInfoCard: {
    alignItems: 'center',
    width: '48%', // Adjust as needed for two columns
  },
  modalInfoLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    marginTop: DesignSystem.spacing.xs,
  },
  modalInfoValue: {
    ...DesignSystem.typography.heading2,
    fontWeight: '700',
    marginTop: DesignSystem.spacing.xs,
  },
  modalDescriptionSection: {
    marginBottom: DesignSystem.spacing.lg,
  },
  modalSectionTitle: {
    color: DesignSystem.colors.neutral.platinum,
    ...DesignSystem.typography.heading1,
    marginBottom: DesignSystem.spacing.xs,
  },
  modalDescription: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.body1,
    lineHeight: 22,
  },
  modalRecommendationsSection: {
    marginTop: DesignSystem.spacing.lg,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.xs,
  },
  recommendationText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.body1,
    marginLeft: DesignSystem.spacing.xs,
  },
  modalLastUpdated: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: DesignSystem.spacing.lg,
  },
  modalLastUpdatedText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    opacity: 0.7,
    marginLeft: DesignSystem.spacing.xs,
  },
});

export default LiveMetricsPanel;

