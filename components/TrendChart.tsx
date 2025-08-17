import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { OVRScore } from '../types/ovr';
import { DesignSystem, createGlassMorphism } from '../constants/design';

const { width } = Dimensions.get('window');

interface TrendChartProps {
  data: OVRScore[];
  title?: string;
  period?: 'day' | 'week' | 'month';
  height?: number;
  showTrendIndicator?: boolean;
}

const TrendChart: React.FC<TrendChartProps> = ({ 
  data, 
  title = "OVR Trend", 
  period = 'day',
  height = 120,
  showTrendIndicator = true 
}) => {
  if (data.length < 2) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Not enough data</Text>
        </View>
      </View>
    );
  }

  // Calculate chart dimensions
  const chartWidth = width - 80;
  const chartHeight = height - 60; // Leave space for title and labels
  const pointWidth = chartWidth / (data.length - 1);

  // Normalize data for chart
  const values = data.map(d => d.overall);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = Math.max(1, maxValue - minValue);

  // Calculate trend
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  const trendChange = lastValue - firstValue;
  const trendPercentage = ((trendChange / firstValue) * 100);

  const getTrendIcon = () => {
    if (trendChange > 1) return <TrendingUp size={16} color={DesignSystem.colors.success} />;
    if (trendChange < -1) return <TrendingDown size={16} color={DesignSystem.colors.error} />;
    return <Minus size={16} color={DesignSystem.colors.primary.cyan} />;
  };

  const getTrendColor = () => {
    if (trendChange > 1) return DesignSystem.colors.success;
    if (trendChange < -1) return DesignSystem.colors.error;
    return DesignSystem.colors.primary.cyan;
  };

  const renderChart = () => {
    const points = data.map((item, index) => {
      const x = index * pointWidth;
      const normalizedValue = (item.overall - minValue) / range;
      const y = chartHeight - (normalizedValue * chartHeight);
      return { x, y, value: item.overall };
    });

    return (
      <View style={[styles.chartContainer, { width: chartWidth, height: chartHeight }]}>
        {/* Chart Line */}
        <View style={styles.chartLine}>
          {points.map((point, index) => {
            if (index === 0) return null;
            
            const prevPoint = points[index - 1];
            const lineWidth = Math.sqrt(
              Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
            );
            const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
            
            return (
              <View
                key={index}
                style={[
                  styles.lineSegment,
                  {
                    position: 'absolute',
                    left: prevPoint.x,
                    top: prevPoint.y,
                    width: lineWidth,
                    transform: [{ rotate: `${angle}rad` }],
                  }
                ]}
              />
            );
          })}
        </View>

        {/* Chart Points */}
        {points.map((point, index) => (
          <View
            key={index}
            style={[
              styles.chartPoint,
              {
                position: 'absolute',
                left: point.x - 3,
                top: point.y - 3,
                backgroundColor: getTrendColor(),
              }
            ]}
          />
        ))}

        {/* Gradient Fill */}
        <LinearGradient
          colors={[`${getTrendColor()}20`, `${getTrendColor()}05`, 'transparent']}
          style={[
            styles.gradientFill,
            { width: chartWidth, height: chartHeight }
          ]}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { height }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showTrendIndicator && (
          <View style={styles.trendIndicator}>
            {getTrendIcon()}
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {trendChange > 0 ? '+' : ''}{trendChange.toFixed(1)}
            </Text>
            <Text style={styles.trendPercentage}>
              ({trendPercentage > 0 ? '+' : ''}{trendPercentage.toFixed(1)}%)
            </Text>
          </View>
        )}
      </View>

      {/* Chart */}
      <View style={styles.chartWrapper}>
        {renderChart()}
      </View>

      {/* Value Labels */}
      <View style={styles.valueLabels}>
        <Text style={styles.valueLabel}>{minValue}</Text>
        <Text style={styles.valueLabel}>{maxValue}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...createGlassMorphism(0.06),
    borderRadius: DesignSystem.radius.xl,
    padding: DesignSystem.spacing.lg,
    margin: DesignSystem.spacing.md,
    ...DesignSystem.shadows.soft,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  title: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading3,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
  },
  trendText: {
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  trendPercentage: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
  },
  chartWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    position: 'relative',
  },
  chartLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  lineSegment: {
    height: 2,
    backgroundColor: DesignSystem.colors.primary.cyan,
    borderRadius: 1,
  },
  chartPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: DesignSystem.colors.neutral.space,
  },
  gradientFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  valueLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: DesignSystem.spacing.sm,
  },
  valueLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.body2,
    opacity: 0.6,
  },
});

export default TrendChart;
