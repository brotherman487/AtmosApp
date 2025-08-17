import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react-native';
import { OVRScore } from '../types/ovr';
import { ovrService } from '../services/ovrService';
import { DesignSystem, createGlassMorphism } from '../constants/design';

const { width } = Dimensions.get('window');

interface OVRTrendChartProps {
  timeframe: 'day' | 'week' | 'month' | 'year';
  onTimeframeChange?: (timeframe: 'day' | 'week' | 'month' | 'year') => void;
}

const OVRTrendChart: React.FC<OVRTrendChartProps> = ({ timeframe, onTimeframeChange }) => {
  const [ovrHistory, setOvrHistory] = useState<OVRScore[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  useEffect(() => {
    loadOVRHistory();
  }, [timeframe]);

  const loadOVRHistory = async () => {
    try {
      const history = await ovrService.getOVRHistory(getDataPoints());
      setOvrHistory(history);
    } catch (error) {
      console.error('Error loading OVR history:', error);
    }
  };

  const getDataPoints = () => {
    switch (timeframe) {
      case 'day': return 24; // Hourly data
      case 'week': return 7; // Daily data
      case 'month': return 30; // Daily data
      case 'year': return 12; // Monthly data
      default: return 7;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#059669';
    if (score >= 70) return '#f59e0b';
    if (score >= 60) return '#f97316';
    if (score >= 50) return '#ef4444';
    return '#dc2626';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={14} color="#10b981" />;
    if (change < 0) return <TrendingDown size={14} color="#ef4444" />;
    return <Activity size={14} color="#7dd3fc" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return '#10b981';
    if (change < 0) return '#ef4444';
    return '#7dd3fc';
  };

  const renderSparkline = () => {
    if (ovrHistory.length < 2) {
      // Generate sample data if no history available
      const sampleData = generateSampleData();
      return renderChartBars(sampleData);
    }

    const values = ovrHistory.map(h => h.overall);
    return renderChartBars(values);
  };

  const generateSampleData = () => {
    const points = getDataPoints();
    const baseScore = 85;
    return Array.from({ length: points }, (_, i) => {
      // Create more realistic trend data with greater variation
      const trend = Math.sin(i / points * Math.PI * 2) * 8; // More variation
      const noise = (Math.random() - 0.5) * 6; // More noise
      const timeOfDay = Math.sin(i / points * Math.PI) * 3; // Time-based variation
      return Math.max(70, Math.min(99, Math.round(baseScore + trend + noise + timeOfDay)));
    });
  };

  const renderChartBars = (values: number[]) => {
    // Use fixed OVR range (25-100) for consistent scale
    const min = 25;
    const max = 100;
    const range = max - min;
    
    const chartHeight = 120;
    const chartWidth = width - 80;
    const barWidth = Math.max(8, chartWidth / values.length);
    const spacing = Math.max(2, barWidth * 0.1);

    return (
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          <Text style={styles.yAxisLabel}>100</Text>
          <Text style={styles.yAxisLabel}>75</Text>
          <Text style={styles.yAxisLabel}>50</Text>
          <Text style={styles.yAxisLabel}>25</Text>
        </View>
        
        <View style={styles.chartArea}>
          {values.map((value, index) => {
            const height = ((value - min) / range) * chartHeight;
            const isSelected = selectedPoint === index;
            const isLatest = index === values.length - 1;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chartBar,
                  {
                    width: barWidth - spacing,
                    height: Math.max(height, 6),
                    backgroundColor: isSelected 
                      ? getScoreColor(value) 
                      : isLatest
                      ? getScoreColor(value) + 'CC'
                      : getScoreColor(value) + '80',
                    borderColor: isSelected ? getScoreColor(value) : 'transparent',
                    borderWidth: isSelected ? 2 : 0,
                  }
                ]}
                onPress={() => setSelectedPoint(isSelected ? null : index)}
                activeOpacity={0.7}
              />
            );
          })}
        </View>
        
        {/* X-axis labels */}
        <View style={styles.xAxisLabels}>
          {values.map((_, index) => {
            // Show labels at 0, 25%, 50%, 75%, and 100% of the data
            const shouldShow = index === 0 || 
                             index === Math.floor(values.length * 0.25) ||
                             index === Math.floor(values.length * 0.5) ||
                             index === Math.floor(values.length * 0.75) ||
                             index === values.length - 1;
            
            if (shouldShow) {
              const label = getTimeLabel(index);
              return (
                <Text key={index} style={styles.xAxisLabel}>
                  {label}
                </Text>
              );
            }
            return null;
          })}
        </View>
        
        {/* Grid lines */}
        <View style={styles.gridLines}>
          {[0, 25, 50, 75, 100].map((line) => (
            <View
              key={line}
              style={[
                styles.gridLine,
                {
                  bottom: (line / 100) * chartHeight,
                }
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const getTimeLabel = (index: number) => {
    switch (timeframe) {
      case 'day':
        return `${index}:00`;
      case 'week':
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days[index % 7];
      case 'month':
        return `${index + 1}`;
      case 'year':
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[index % 12];
      default:
        return `${index + 1}`;
    }
  };

  const renderSelectedPoint = () => {
    if (selectedPoint === null) return null;
    
    // Use sample data if no history available
    const values = ovrHistory.length > 0 
      ? ovrHistory.map(h => h.overall) 
      : generateSampleData();
    
    if (!values[selectedPoint]) return null;
    
    const value = values[selectedPoint];
    const change = selectedPoint > 0 ? value - values[selectedPoint - 1] : 0;
    
    return (
      <View style={styles.selectedPointContainer}>
        <View style={styles.selectedPointCard}>
          <Text style={styles.selectedPointLabel}>
            {getTimeLabel(selectedPoint)}
          </Text>
          <Text style={[styles.selectedPointValue, { color: getScoreColor(value) }]}>
            {value}
          </Text>
          {change !== 0 && (
            <View style={styles.selectedPointChange}>
              {getChangeIcon(change)}
              <Text style={[styles.selectedPointChangeText, { color: getChangeColor(change) }]}>
                {change > 0 ? `+${change}` : change}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderSummary = () => {
    // Use sample data if no history available
    const values = ovrHistory.length > 0 
      ? ovrHistory.map(h => h.overall) 
      : generateSampleData();
    
    if (values.length === 0) return null;
    
    const current = values[values.length - 1];
    const previous = values[values.length - 2] || current;
    const change = current - previous;
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Current</Text>
          <Text style={[styles.summaryValue, { color: getScoreColor(current) }]}>
            {current}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Average</Text>
          <Text style={[styles.summaryValue, { color: getScoreColor(Math.round(average)) }]}>
            {Math.round(average)}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Change</Text>
          <View style={styles.summaryChange}>
            {getChangeIcon(change)}
            <Text style={[styles.summaryChangeText, { color: getChangeColor(change) }]}>
              {change > 0 ? `+${change}` : change}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={DesignSystem.gradients.accent} style={styles.background} />
      
      <View style={styles.content}>
        {renderSparkline()}
        {renderSelectedPoint()}
        {renderSummary()}
      </View>
    </View>
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
    padding: DesignSystem.spacing['2xl'],
  },
  chartContainer: {
    position: 'relative',
    height: 180,
    marginBottom: DesignSystem.spacing.lg,
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 40,
    height: 120,
    justifyContent: 'space-between',
    width: 40,
    zIndex: 1,
    paddingVertical: 8,
  },
  yAxisLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingBottom: DesignSystem.spacing.sm,
    marginLeft: 45,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 45,
    marginTop: DesignSystem.spacing.sm,
    paddingHorizontal: 10,
  },
  xAxisLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  chartBar: {
    borderRadius: DesignSystem.radius.xs,
    borderWidth: 1,
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 40,
    right: 0,
    bottom: 40,
    zIndex: -1,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: DesignSystem.colors.alpha[8],
  },
  selectedPointContainer: {
    position: 'absolute',
    top: -60,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  selectedPointCard: {
    ...createGlassMorphism(0.15),
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.radius.lg,
    alignItems: 'center',
    minWidth: 120,
  },
  selectedPointLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    marginBottom: DesignSystem.spacing.xs,
  },
  selectedPointValue: {
    ...DesignSystem.typography.heading2,
    fontWeight: '700',
    marginBottom: DesignSystem.spacing.xs,
  },
  selectedPointChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
  },
  selectedPointChangeText: {
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: DesignSystem.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: DesignSystem.colors.alpha[8],
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    textTransform: 'uppercase',
    marginBottom: DesignSystem.spacing.xs,
  },
  summaryValue: {
    ...DesignSystem.typography.heading3,
    fontWeight: '700',
  },
  summaryChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
  },
  summaryChangeText: {
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
});

export default OVRTrendChart;
