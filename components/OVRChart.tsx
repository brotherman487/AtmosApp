import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  Animated,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react-native';
import { OVRScore } from '../types/ovr';
import { ovrService } from '../services/ovrService';
import { DesignSystem, createGlassMorphism } from '../constants/design';
import TrendTooltip from './TrendTooltip';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export type TimeRange = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
export type ChartType = 'overall' | 'breakdown' | 'comparison';

interface OVRChartProps {
  data?: OVRScore[];
  timeRange?: TimeRange;
  chartType?: ChartType;
  height?: number;
  showControls?: boolean;
  onDataPointPress?: (dataPoint: OVRScore, index: number) => void;
  onTimeRangeChange?: (range: TimeRange) => void;
}

interface ChartPoint {
  x: number;
  y: number;
  value: number;
  timestamp: number;
  data: OVRScore;
}

interface SubScoreConfig {
  key: keyof Omit<OVRScore, 'timestamp' | 'change' | 'explanation' | 'microTrend'>;
  color: string;
  label: string;
  visible: boolean;
}

const OVRChart: React.FC<OVRChartProps> = ({
  data = [],
  timeRange = 'day',
  chartType = 'overall',
  height = 300,
  showControls = true,
  onDataPointPress,
  onTimeRangeChange,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(timeRange);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>(chartType);
  const [chartData, setChartData] = useState<OVRScore[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<ChartPoint | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  
  // Animation values
  const [animations] = useState({
    chartEntry: new Animated.Value(0),
    pointHighlight: new Animated.Value(0),
    tooltipFade: new Animated.Value(0),
  });

  // Sub-score configuration
  const [subScores, setSubScores] = useState<SubScoreConfig[]>([
    { key: 'biological', color: '#10b981', label: 'Biological', visible: true },
    { key: 'emotional', color: '#3b82f6', label: 'Emotional', visible: true },
    { key: 'environmental', color: '#f59e0b', label: 'Environmental', visible: true },
    { key: 'financial', color: '#ef4444', label: 'Financial', visible: true },
  ]);

  // Chart dimensions
  const chartWidth = screenWidth - 40;
  const chartHeight = height - 80; // Leave space for controls
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  useEffect(() => {
    loadChartData();
    animateChartEntry();
  }, [selectedTimeRange, data]);

  const loadChartData = () => {
    // Get data based on time range
    let filteredData: OVRScore[] = [];
    
    if (data.length > 1) {
      filteredData = data;
    } else {
      // Generate sample data for demo - always show something
      filteredData = generateSampleData(selectedTimeRange);
    }

    setChartData(filteredData);
  };

  const generateSampleData = (range: TimeRange): OVRScore[] => {
    const now = Date.now();
    const points = range === 'minute' ? 60 : range === 'hour' ? 24 : range === 'day' ? 30 : 365;
    const interval = range === 'minute' ? 60000 : range === 'hour' ? 3600000 : range === 'day' ? 86400000 : 86400000 * 30;
    
    return Array.from({ length: points }, (_, i) => {
      const timestamp = now - (points - i - 1) * interval;
      const baseScore = 75 + Math.sin(i / 10) * 10 + Math.random() * 10;
      
      return {
        overall: Math.round(baseScore),
        biological: Math.round(baseScore + Math.random() * 10 - 5),
        emotional: Math.round(baseScore + Math.random() * 10 - 5),
        environmental: Math.round(baseScore + Math.random() * 10 - 5),
        financial: Math.round(baseScore + Math.random() * 10 - 5),
        timestamp,
        change: Math.round((Math.random() - 0.5) * 4),
        explanation: 'Generated sample data',
        microTrend: (Math.random() - 0.5) * 2,
      };
    });
  };

  const animateChartEntry = () => {
    animations.chartEntry.setValue(0);
    Animated.spring(animations.chartEntry, {
      toValue: 1,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const calculateChartPoints = (scoreKey: keyof OVRScore = 'overall'): ChartPoint[] => {
    if (chartData.length === 0) return [];

    const values = chartData.map(d => typeof d[scoreKey] === 'number' ? d[scoreKey] as number : d.overall);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = Math.max(1, maxValue - minValue);

    return chartData.map((dataPoint, index) => {
      const value = typeof dataPoint[scoreKey] === 'number' ? dataPoint[scoreKey] as number : dataPoint.overall;
      const x = (index / Math.max(1, chartData.length - 1)) * plotWidth;
      const y = plotHeight - ((value - minValue) / valueRange) * plotHeight;
      
      return {
        x: x + padding.left,
        y: y + padding.top,
        value,
        timestamp: dataPoint.timestamp,
        data: dataPoint,
      };
    });
  };

  const handleChartPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const points = calculateChartPoints();
    
    // Find closest point
    let closestPoint: ChartPoint | null = null;
    let minDistance = Infinity;

    points.forEach(point => {
      const distance = Math.sqrt(
        Math.pow(locationX - point.x, 2) + Math.pow(locationY - point.y, 2)
      );
      
      if (distance < minDistance && distance < 30) { // 30px touch tolerance
        minDistance = distance;
        closestPoint = point;
      }
    });

    if (closestPoint) {
      setSelectedPoint(closestPoint);
      setTooltipVisible(true);
      onDataPointPress?.(closestPoint, points.indexOf(closestPoint));
      
      // Animate point highlight
      animations.pointHighlight.setValue(0);
      Animated.sequence([
        Animated.timing(animations.pointHighlight, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animations.tooltipFade, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setTooltipVisible(false);
      setSelectedPoint(null);
      animations.tooltipFade.setValue(0);
    }
  };

  const renderMainChart = () => {
    const points = calculateChartPoints('overall');
    
    if (points.length < 2) {
      return (
        <View style={styles.noDataFallback}>
          <Text style={styles.noDataText}>Loading chart data...</Text>
        </View>
      );
    }

    return (
      <View style={styles.chartArea}>
        {/* Grid Lines */}
        {renderGridLines()}
        
        {/* Main OVR Line */}
        {renderChartLine(points, DesignSystem.colors.primary.cyan, 3)}
        
        {/* Sub-score Lines (if breakdown view) */}
        {selectedChartType === 'breakdown' && renderSubScoreLines()}
        
        {/* Data Points */}
        {renderDataPoints(points)}
        
        {/* Selected Point Highlight */}
        {selectedPoint && renderSelectedPoint()}
        
        {/* AI Annotations */}
        {renderAIAnnotations()}
      </View>
    );
  };

  const renderChartLine = (points: ChartPoint[], color: string, strokeWidth: number = 2) => {
    if (points.length < 2) return null;

    // Create SVG-like path using Views (simplified for React Native)
    return points.map((point, index) => {
      if (index === 0) return null;
      
      const prevPoint = points[index - 1];
      const lineWidth = Math.sqrt(
        Math.pow(point.x - prevPoint.x, 2) + Math.pow(point.y - prevPoint.y, 2)
      );
      const angle = Math.atan2(point.y - prevPoint.y, point.x - prevPoint.x);
      
      return (
        <Animated.View
          key={`line-${index}`}
          style={[
            styles.chartLineSegment,
            {
              position: 'absolute',
              left: prevPoint.x,
              top: prevPoint.y,
              width: lineWidth,
              height: strokeWidth,
              backgroundColor: color,
              transform: [
                { rotate: `${angle}rad` },
                { 
                  scaleX: animations.chartEntry.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  })
                }
              ],
            }
          ]}
        />
      );
    });
  };

  const renderSubScoreLines = () => {
    return subScores
      .filter(score => score.visible)
      .map(score => {
        const points = calculateChartPoints(score.key);
        return (
          <View key={score.key}>
            {renderChartLine(points, score.color, 2)}
          </View>
        );
      });
  };

  const renderDataPoints = (points: ChartPoint[]) => {
    return points.map((point, index) => (
      <Animated.View
        key={`point-${index}`}
        style={[
          styles.dataPoint,
          {
            position: 'absolute',
            left: point.x - 4,
            top: point.y - 4,
            backgroundColor: DesignSystem.colors.primary.cyan,
            transform: [
              {
                scale: animations.chartEntry.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              }
            ],
          }
        ]}
      />
    ));
  };

  const renderSelectedPoint = () => {
    if (!selectedPoint) return null;
    
    return (
      <Animated.View
        style={[
          styles.selectedPoint,
          {
            position: 'absolute',
            left: selectedPoint.x - 8,
            top: selectedPoint.y - 8,
            transform: [
              {
                scale: animations.pointHighlight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.5],
                }),
              }
            ],
          }
        ]}
      />
    );
  };

  const renderGridLines = () => {
    const gridLines = [];
    const horizontalLines = 5;
    const verticalLines = 6;

    // Horizontal grid lines
    for (let i = 0; i <= horizontalLines; i++) {
      const y = padding.top + (i / horizontalLines) * plotHeight;
      gridLines.push(
        <View
          key={`h-grid-${i}`}
          style={[
            styles.gridLine,
            {
              position: 'absolute',
              left: padding.left,
              top: y,
              width: plotWidth,
              height: 1,
            }
          ]}
        />
      );
    }

    // Vertical grid lines
    for (let i = 0; i <= verticalLines; i++) {
      const x = padding.left + (i / verticalLines) * plotWidth;
      gridLines.push(
        <View
          key={`v-grid-${i}`}
          style={[
            styles.gridLine,
            {
              position: 'absolute',
              left: x,
              top: padding.top,
              width: 1,
              height: plotHeight,
            }
          ]}
        />
      );
    }

    return gridLines;
  };

  const renderAIAnnotations = () => {
    // Sample AI annotations
    const annotations = [
      { x: plotWidth * 0.3, y: plotHeight * 0.4, text: 'Stress spike detected', type: 'warning' },
      { x: plotWidth * 0.7, y: plotHeight * 0.2, text: 'Savings goal achieved', type: 'success' },
    ];

    return annotations.map((annotation, index) => (
      <View
        key={`annotation-${index}`}
        style={[
          styles.aiAnnotation,
          {
            position: 'absolute',
            left: padding.left + annotation.x,
            top: padding.top + annotation.y,
          }
        ]}
      >
        <View style={[
          styles.annotationDot,
          { backgroundColor: annotation.type === 'warning' ? DesignSystem.colors.warning : DesignSystem.colors.success }
        ]} />
        <Text style={styles.annotationText}>{annotation.text}</Text>
      </View>
    ));
  };

  const renderTimeRangeSelector = () => {
    const timeRanges: { key: TimeRange; label: string }[] = [
      { key: 'minute', label: '1M' },
      { key: 'hour', label: '1H' },
      { key: 'day', label: '1D' },
      { key: 'week', label: '1W' },
      { key: 'month', label: '1M' },
      { key: 'year', label: '1Y' },
    ];

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.timeRangeSelector}
        contentContainerStyle={styles.timeRangeSelectorContent}
      >
        {timeRanges.map(range => (
          <TouchableOpacity
            key={range.key}
            style={[
              styles.timeRangeButton,
              selectedTimeRange === range.key && styles.timeRangeButtonActive
            ]}
            onPress={() => {
              setSelectedTimeRange(range.key);
              onTimeRangeChange?.(range.key);
            }}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.timeRangeButtonText,
              selectedTimeRange === range.key && styles.timeRangeButtonTextActive
            ]}>
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderControls = () => {
    if (!showControls) return null;

    return (
      <View style={styles.controls}>
        <View style={styles.controlsLeft}>
          {renderTimeRangeSelector()}
        </View>
        <View style={styles.controlsRight}>
          <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
            <Calendar size={16} color={DesignSystem.colors.primary.cyan} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
            <ZoomIn size={16} color={DesignSystem.colors.primary.cyan} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} activeOpacity={0.7}>
            <RotateCcw size={16} color={DesignSystem.colors.primary.cyan} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { height }]}>
      <LinearGradient colors={DesignSystem.gradients.card} style={styles.background} />
      
      {/* Chart Title */}
      <View style={styles.header}>
        <Text style={styles.title}>OVR Trend Analysis</Text>
        <Text style={styles.subtitle}>
          {selectedTimeRange.charAt(0).toUpperCase() + selectedTimeRange.slice(1)} view • {chartData.length} data points
        </Text>
      </View>

      {/* Interactive Chart */}
      <TouchableOpacity 
        style={[styles.chartContainer, { height: chartHeight }]}
        onPress={handleChartPress}
        activeOpacity={1}
      >
        {renderMainChart()}
      </TouchableOpacity>

      {/* Tooltip */}
      {tooltipVisible && selectedPoint && (
        <TrendTooltip
          point={selectedPoint}
          visible={tooltipVisible}
          onClose={() => setTooltipVisible(false)}
          style={{
            position: 'absolute',
            left: selectedPoint.x + 10,
            top: selectedPoint.y - 60,
          }}
        />
      )}

      {/* Controls */}
      {renderControls()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...createGlassMorphism(0.08),
    borderRadius: DesignSystem.radius.xl,
    margin: DesignSystem.spacing.lg,
    overflow: 'hidden',
    ...DesignSystem.shadows.medium,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    padding: DesignSystem.spacing.lg,
    paddingBottom: DesignSystem.spacing.md,
  },
  title: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading3,
    marginBottom: DesignSystem.spacing.xs,
  },
  subtitle: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.caption,
  },
  chartContainer: {
    position: 'relative',
    marginHorizontal: DesignSystem.spacing.lg,
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  gridLine: {
    backgroundColor: DesignSystem.colors.alpha[5],
  },
  chartLineSegment: {
    borderRadius: 2,
  },
  dataPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: DesignSystem.colors.neutral.space,
  },
  selectedPoint: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: DesignSystem.colors.primary.gold,
    borderWidth: 3,
    borderColor: DesignSystem.colors.neutral.space,
  },
  aiAnnotation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
  },
  annotationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  annotationText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    backgroundColor: DesignSystem.colors.alpha[8],
    paddingHorizontal: DesignSystem.spacing.xs,
    paddingVertical: 2,
    borderRadius: DesignSystem.radius.xs,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: DesignSystem.spacing.lg,
    paddingTop: DesignSystem.spacing.md,
  },
  controlsLeft: {
    flex: 1,
  },
  controlsRight: {
    flexDirection: 'row',
    gap: DesignSystem.spacing.sm,
  },
  controlButton: {
    padding: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.radius.sm,
    backgroundColor: DesignSystem.colors.alpha[5],
    borderWidth: 1,
    borderColor: DesignSystem.colors.alpha[8],
  },
  timeRangeSelector: {
    maxWidth: '80%',
  },
  timeRangeSelectorContent: {
    gap: DesignSystem.spacing.xs,
  },
  timeRangeButton: {
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.radius.sm,
    backgroundColor: DesignSystem.colors.alpha[5],
    borderWidth: 1,
    borderColor: DesignSystem.colors.alpha[8],
  },
  timeRangeButtonActive: {
    backgroundColor: DesignSystem.colors.primary.cyan + '20',
    borderColor: DesignSystem.colors.primary.cyan + '40',
  },
  timeRangeButtonText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.caption,
    fontWeight: '500',
  },
  timeRangeButtonTextActive: {
    color: DesignSystem.colors.primary.cyan,
    fontWeight: '600',
  },
  noDataFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  noDataText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.body2,
    opacity: 0.7,
  },
});

export default OVRChart;
