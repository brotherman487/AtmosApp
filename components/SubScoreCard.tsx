import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, Heart, Wind, DollarSign, TrendingUp, TrendingDown, Minus, Award } from 'lucide-react-native';
import { OVRScore } from '../types/ovr';
import { DesignSystem, createGlassMorphism } from '../constants/design';

const { width } = Dimensions.get('window');

interface SubScoreCardProps {
  type: 'biological' | 'emotional' | 'environmental' | 'financial';
  currentValue: number;
  history?: number[];
  change?: number;
  achievement?: string;
  onTap?: () => void;
  expanded?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const SubScoreCard: React.FC<SubScoreCardProps> = ({
  type,
  currentValue,
  history = [],
  change = 0,
  achievement,
  onTap,
  expanded = false,
  size = 'medium',
}) => {
  const [animations] = useState({
    card: new Animated.Value(0),
    chart: new Animated.Value(0),
    badge: new Animated.Value(0),
  });

  const [isExpanded, setIsExpanded] = useState(expanded);

  // Configuration for each score type
  const scoreConfig = {
    biological: {
      label: 'Biological',
      icon: <Brain size={18} color="#10b981" />,
      color: '#10b981',
      gradient: ['rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0.05)', 'transparent'] as const,
    },
    emotional: {
      label: 'Emotional', 
      icon: <Heart size={18} color="#3b82f6" />,
      color: '#3b82f6',
      gradient: ['rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0.05)', 'transparent'] as const,
    },
    environmental: {
      label: 'Environmental',
      icon: <Wind size={18} color="#f59e0b" />,
      color: '#f59e0b',
      gradient: ['rgba(245, 158, 11, 0.15)', 'rgba(245, 158, 11, 0.05)', 'transparent'] as const,
    },
    financial: {
      label: 'Financial',
      icon: <DollarSign size={18} color="#ef4444" />,
      color: '#ef4444',
      gradient: ['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.05)', 'transparent'] as const,
    },
  };

  const config = scoreConfig[type];

  // Size configurations
  const sizeConfig = {
    small: { width: (width - 60) / 3, height: 100, fontSize: 16 },
    medium: { width: (width - 60) / 2, height: 140, fontSize: 20 },
    large: { width: width - 40, height: 180, fontSize: 24 },
  };

  const cardSize = sizeConfig[size];

  useEffect(() => {
    // Animate card entry
    animations.card.setValue(0);
    Animated.spring(animations.card, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Animate achievement badge if present
    if (achievement) {
      animations.badge.setValue(0);
      Animated.timing(animations.badge, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [achievement]);

  useEffect(() => {
    // Animate chart when expanded
    if (isExpanded && history.length > 1) {
      animations.chart.setValue(0);
      Animated.timing(animations.chart, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }).start();
    }
  }, [isExpanded, history]);

  const handleTap = () => {
    setIsExpanded(!isExpanded);
    onTap?.();
  };

  const getTrendIcon = () => {
    if (change > 1) return <TrendingUp size={14} color={DesignSystem.colors.success} />;
    if (change < -1) return <TrendingDown size={14} color={DesignSystem.colors.error} />;
    return <Minus size={14} color={DesignSystem.colors.neutral.silver} />;
  };

  const getTrendColor = () => {
    if (change > 1) return DesignSystem.colors.success;
    if (change < -1) return DesignSystem.colors.error;
    return DesignSystem.colors.neutral.silver;
  };

  const getScoreStatus = () => {
    if (currentValue >= 85) return 'Excellent';
    if (currentValue >= 70) return 'Good';
    if (currentValue >= 55) return 'Fair';
    return 'Needs Focus';
  };

  const renderMiniChart = () => {
    if (!isExpanded || history.length < 2) return null;

    const chartHeight = 40;
    const chartWidth = cardSize.width - 32;
    const values = history.slice(-8); // Show last 8 data points
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = Math.max(1, maxValue - minValue);

    return (
      <Animated.View
        style={[
          styles.miniChart,
          {
            width: chartWidth,
            height: chartHeight,
            opacity: animations.chart,
          }
        ]}
      >
        {values.map((value, index) => {
          if (index === 0) return null;
          
          const prevValue = values[index - 1];
          const x1 = ((index - 1) / (values.length - 1)) * chartWidth;
          const y1 = chartHeight - ((prevValue - minValue) / range) * chartHeight;
          const x2 = (index / (values.length - 1)) * chartWidth;
          const y2 = chartHeight - ((value - minValue) / range) * chartHeight;
          
          const lineWidth = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          const angle = Math.atan2(y2 - y1, x2 - x1);
          
          return (
            <Animated.View
              key={index}
                               style={[
                   styles.chartLine,
                   {
                     position: 'absolute',
                     left: x1,
                     top: y1,
                     width: lineWidth,
                     backgroundColor: config.color,
                     transform: [
                       { rotate: `${angle}rad` },
                       {
                         scaleX: animations.chart.interpolate({
                           inputRange: [0, 1],
                           outputRange: [0, 1],
                         }),
                       }
                     ],
                   }
                 ]}
            />
          );
        })}
        
        {/* Chart points */}
        {values.map((value, index) => {
          const x = (index / (values.length - 1)) * chartWidth;
          const y = chartHeight - ((value - minValue) / range) * chartHeight;
          
          return (
            <Animated.View
              key={`point-${index}`}
              style={[
                styles.chartPoint,
                {
                  position: 'absolute',
                  left: x - 2,
                  top: y - 2,
                  backgroundColor: config.color,
                  transform: [
                    {
                      scale: animations.chart.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    }
                  ],
                }
              ]}
            />
          );
        })}
      </Animated.View>
    );
  };

  const renderAchievementBadge = () => {
    if (!achievement) return null;

    return (
      <Animated.View
        style={[
          styles.achievementBadge,
          {
            transform: [
              {
                scale: animations.badge.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1.2, 1],
                }),
              }
            ],
          }
        ]}
      >
        <Award size={12} color={DesignSystem.colors.primary.gold} />
      </Animated.View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: cardSize.width,
          height: isExpanded ? cardSize.height + 60 : cardSize.height,
          borderColor: config.color + '40',
          transform: [{ scale: animations.card }],
        }
      ]}
    >
      <LinearGradient colors={config.gradient} style={styles.background} />
      
      <TouchableOpacity
        style={styles.content}
        onPress={handleTap}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {React.cloneElement(config.icon, { size: Platform.OS === 'ios' ? 20 : 18 })}
          </View>
          {renderAchievementBadge()}
        </View>

        {/* Main Value */}
        <View style={styles.valueSection}>
          <Text style={[styles.value, { color: config.color, fontSize: cardSize.fontSize }]}>
            {Math.round(currentValue)}
          </Text>
          <Text style={styles.status}>
            {getScoreStatus()}
          </Text>
        </View>

        {/* Trend Indicator */}
        <View style={styles.trendSection}>
          <View style={styles.trend}>
            {getTrendIcon()}
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {change > 0 ? '+' : ''}{change.toFixed(1)}
            </Text>
          </View>
          <Text style={styles.trendLabel}>24h</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: config.color,
                  width: `${Math.min(100, (currentValue / 99) * 100)}%`,
                }
              ]}
            />
          </View>
        </View>

        {/* Mini Chart (when expanded) */}
        {renderMiniChart()}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...createGlassMorphism(0.06),
    borderRadius: DesignSystem.radius.lg,
    borderWidth: 1,
    margin: DesignSystem.spacing.xs,
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
  content: {
    flex: 1,
    padding: DesignSystem.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 8 : DesignSystem.spacing.md,
  },
  headerLeft: {
    alignItems: 'center',
  },
  label: {
    color: DesignSystem.colors.neutral.platinum,
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  achievementBadge: {
    backgroundColor: DesignSystem.colors.primary.gold + '20',
    borderRadius: DesignSystem.radius.sm,
    padding: 4,
    borderWidth: 1,
    borderColor: DesignSystem.colors.primary.gold + '40',
  },
  valueSection: {
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  value: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    marginBottom: 4,
  },
  status: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
  },
  trendSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.sm,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  trendLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
  },
  progressContainer: {
    marginBottom: DesignSystem.spacing.md,
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
  },
  miniChart: {
    marginTop: DesignSystem.spacing.sm,
    position: 'relative',
  },
  chartLine: {
    height: 2,
    borderRadius: 1,
  },
  chartPoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: DesignSystem.colors.neutral.space,
  },
});

export default SubScoreCard;
