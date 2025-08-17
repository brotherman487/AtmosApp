import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, Heart, Wind, DollarSign, Eye, EyeOff, BarChart3 } from 'lucide-react-native';
import { OVRScore } from '../types/ovr';
import { DesignSystem, createGlassMorphism } from '../constants/design';

const { width: screenWidth } = Dimensions.get('window');

interface ScoreBreakdownProps {
  data: OVRScore[];
  timeRange: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  onScoreToggle?: (scoreKey: string, visible: boolean) => void;
  height?: number;
}

interface SubScoreConfig {
  key: keyof Omit<OVRScore, 'timestamp' | 'change' | 'explanation' | 'microTrend'>;
  label: string;
  color: string;
  icon: React.ReactNode;
  visible: boolean;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({
  data,
  timeRange,
  onScoreToggle,
  height = 200,
}) => {
  const [subScores, setSubScores] = useState<SubScoreConfig[]>([
    {
      key: 'biological',
      label: 'Biological',
      color: '#10b981',
      icon: <Brain size={16} color="#10b981" />,
      visible: true,
      trend: 'up',
      change: 0,
    },
    {
      key: 'emotional',
      label: 'Emotional',
      color: '#3b82f6',
      icon: <Heart size={16} color="#3b82f6" />,
      visible: true,
      trend: 'stable',
      change: 0,
    },
    {
      key: 'environmental',
      label: 'Environmental',
      color: '#f59e0b',
      icon: <Wind size={16} color="#f59e0b" />,
      visible: true,
      trend: 'up',
      change: 0,
    },
    {
      key: 'financial',
      label: 'Financial',
      color: '#ef4444',
      icon: <DollarSign size={16} color="#ef4444" />,
      visible: true,
      trend: 'down',
      change: 0,
    },
  ]);

  const [animations] = useState(
    subScores.reduce((acc, score) => ({
      ...acc,
      [score.key]: {
        opacity: new Animated.Value(1),
        scale: new Animated.Value(1),
        barScale: new Animated.Value(0),
      }
    }), {} as Record<string, { opacity: Animated.Value; scale: Animated.Value; barScale: Animated.Value }>)
  );

  useEffect(() => {
    calculateTrends();
    animateBars();
  }, [data]);

  const calculateTrends = () => {
    if (data.length < 2) return;

    const updatedScores = subScores.map(score => {
      const values = data.map(d => d[score.key] as number).filter(v => typeof v === 'number');
      if (values.length < 2) return score;

      const firstValue = values[0];
      const lastValue = values[values.length - 1];
      const change = lastValue - firstValue;
      const trend: 'up' | 'down' | 'stable' = change > 1 ? 'up' : change < -1 ? 'down' : 'stable';

      return { ...score, trend, change };
    });

    setSubScores(updatedScores);
  };

  const animateBars = () => {
    subScores.forEach(score => {
      const anim = animations[score.key];
      if (anim) {
        anim.barScale.setValue(0);
        Animated.timing(anim.barScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  const toggleScoreVisibility = (scoreKey: string) => {
    const updatedScores = subScores.map(score => {
      if (score.key === scoreKey) {
        const newVisible = !score.visible;
        
        // Animate visibility
        const anim = animations[scoreKey];
        if (anim) {
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: newVisible ? 1 : 0.3,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.spring(anim.scale, {
              toValue: newVisible ? 1 : 0.95,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start();
        }

        onScoreToggle?.(scoreKey, newVisible);
        return { ...score, visible: newVisible };
      }
      return score;
    });

    setSubScores(updatedScores);
  };

  const getCurrentValue = (scoreKey: keyof OVRScore) => {
    if (data.length === 0) return 0;
    const latestData = data[data.length - 1];
    return typeof latestData[scoreKey] === 'number' ? latestData[scoreKey] as number : 0;
  };

  const getAverageValue = (scoreKey: keyof OVRScore) => {
    if (data.length === 0) return 0;
    const values = data.map(d => d[scoreKey]).filter(v => typeof v === 'number') as number[];
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const renderMiniChart = (scoreKey: keyof OVRScore, color: string) => {
    if (data.length < 2) return null;

    const values = data.map(d => d[scoreKey]).filter(v => typeof v === 'number') as number[];
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = Math.max(1, maxValue - minValue);

    const chartWidth = 60;
    const chartHeight = 24;
    const pointWidth = chartWidth / Math.max(1, values.length - 1);

    return (
      <View style={styles.miniChart}>
        {values.map((value, index) => {
          if (index === 0) return null;
          
          const prevValue = values[index - 1];
          const x1 = (index - 1) * pointWidth;
          const y1 = chartHeight - ((prevValue - minValue) / range) * chartHeight;
          const x2 = index * pointWidth;
          const y2 = chartHeight - ((value - minValue) / range) * chartHeight;
          
          const lineWidth = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          const angle = Math.atan2(y2 - y1, x2 - x1);
          
          return (
            <View
              key={index}
              style={[
                styles.miniChartLine,
                {
                  position: 'absolute',
                  left: x1,
                  top: y1,
                  width: lineWidth,
                  backgroundColor: color,
                  transform: [{ rotate: `${angle}rad` }],
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  const renderScoreCard = (score: SubScoreConfig) => {
    const currentValue = getCurrentValue(score.key);
    const averageValue = getAverageValue(score.key);
    const anim = animations[score.key];

    return (
      <Animated.View
        key={score.key}
        style={[
          styles.scoreCard,
          {
            borderColor: score.color + '40',
            opacity: anim?.opacity || 1,
            transform: [{ scale: anim?.scale || 1 }],
          }
        ]}
      >
        <TouchableOpacity
          style={styles.scoreCardContent}
          onPress={() => toggleScoreVisibility(score.key)}
          activeOpacity={0.8}
        >
          {/* Header */}
          <View style={styles.scoreCardHeader}>
            <View style={styles.scoreCardTitle}>
              {score.icon}
              <Text style={styles.scoreCardLabel}>{score.label}</Text>
            </View>
            <TouchableOpacity
              style={styles.visibilityToggle}
              onPress={() => toggleScoreVisibility(score.key)}
              activeOpacity={0.7}
            >
              {score.visible ? (
                <Eye size={14} color={DesignSystem.colors.neutral.silver} />
              ) : (
                <EyeOff size={14} color={DesignSystem.colors.neutral.silver} />
              )}
            </TouchableOpacity>
          </View>

          {/* Current Value */}
          <View style={styles.scoreValue}>
            <Text style={[styles.scoreNumber, { color: score.color }]}>
              {Math.round(currentValue)}
            </Text>
            <View style={styles.scoreTrend}>
              <Text style={[
                styles.scoreTrendText,
                { color: score.trend === 'up' ? DesignSystem.colors.success : 
                         score.trend === 'down' ? DesignSystem.colors.error : 
                         DesignSystem.colors.neutral.silver }
              ]}>
                {score.trend === 'up' ? '↗' : score.trend === 'down' ? '↘' : '→'}
              </Text>
              <Text style={styles.scoreChange}>
                {score.change > 0 ? '+' : ''}{score.change.toFixed(1)}
              </Text>
            </View>
          </View>

          {/* Mini Chart */}
          <View style={styles.miniChartContainer}>
            {renderMiniChart(score.key, score.color)}
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: score.color,
                    transform: [{
                      scaleX: anim?.barScale || 0
                    }],
                    width: `${Math.min(100, (currentValue / 99) * 100)}%`,
                  }
                ]}
              />
            </View>
            <Text style={styles.averageText}>
              Avg: {averageValue.toFixed(1)}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <BarChart3 size={20} color={DesignSystem.colors.primary.cyan} />
        <Text style={styles.headerTitle}>Score Breakdown</Text>
      </View>
      <Text style={styles.headerSubtitle}>
        {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} analysis
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { height }]}>
      <LinearGradient colors={DesignSystem.gradients.card} style={styles.background} />
      
      {renderHeader()}
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {subScores.map(renderScoreCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...createGlassMorphism(0.06),
    borderRadius: DesignSystem.radius.xl,
    margin: DesignSystem.spacing.lg,
    overflow: 'hidden',
    ...DesignSystem.shadows.soft,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: DesignSystem.spacing.lg,
    paddingBottom: DesignSystem.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  headerTitle: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading3,
  },
  headerSubtitle: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.caption,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingBottom: DesignSystem.spacing.lg,
    gap: DesignSystem.spacing.md,
  },
  scoreCard: {
    width: 160,
    backgroundColor: DesignSystem.colors.alpha[5],
    borderRadius: DesignSystem.radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  scoreCardContent: {
    padding: DesignSystem.spacing.lg,
  },
  scoreCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  scoreCardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
    flex: 1,
  },
  scoreCardLabel: {
    color: DesignSystem.colors.neutral.platinum,
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  visibilityToggle: {
    padding: DesignSystem.spacing.xs,
    borderRadius: DesignSystem.radius.xs,
    backgroundColor: DesignSystem.colors.alpha[5],
  },
  scoreValue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  scoreNumber: {
    ...DesignSystem.typography.heading2,
    fontWeight: '700',
  },
  scoreTrend: {
    alignItems: 'center',
    gap: 2,
  },
  scoreTrendText: {
    ...DesignSystem.typography.caption,
    fontWeight: '700',
  },
  scoreChange: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
  },
  miniChartContainer: {
    height: 24,
    marginBottom: DesignSystem.spacing.md,
  },
  miniChart: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  miniChartLine: {
    height: 1.5,
    borderRadius: 1,
  },
  progressContainer: {
    gap: DesignSystem.spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: DesignSystem.colors.alpha[8],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    width: '0%',
  },
  averageText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    textAlign: 'center',
  },
});

export default ScoreBreakdown;
