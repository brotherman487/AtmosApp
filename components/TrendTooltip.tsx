import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, ViewStyle, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { DesignSystem, createGlassMorphism } from '../constants/design';

interface ChartPoint {
  x: number;
  y: number;
  value: number;
  timestamp: number;
  data: {
    overall: number;
    biological: number;
    emotional: number;
    environmental: number;
    financial: number;
    change: number;
    explanation: string;
    microTrend?: number;
  };
}

interface TrendTooltipProps {
  point: ChartPoint;
  visible: boolean;
  onClose: () => void;
  style?: ViewStyle;
  showSubScores?: boolean;
  compact?: boolean;
}

const TrendTooltip: React.FC<TrendTooltipProps> = ({
  point,
  visible,
  onClose,
  style,
  showSubScores = true,
  compact = false,
}) => {
  const [animations] = useState({
    fade: new Animated.Value(0),
    scale: new Animated.Value(0.8),
    slide: new Animated.Value(-10),
  });

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(animations.fade, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(animations.scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(animations.slide, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(animations.fade, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(animations.scale, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0.5) return <TrendingUp size={12} color={DesignSystem.colors.success} />;
    if (change < -0.5) return <TrendingDown size={12} color={DesignSystem.colors.error} />;
    return <Minus size={12} color={DesignSystem.colors.neutral.silver} />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0.5) return DesignSystem.colors.success;
    if (change < -0.5) return DesignSystem.colors.error;
    return DesignSystem.colors.neutral.silver;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return DesignSystem.colors.success;
    if (score >= 70) return DesignSystem.colors.primary.gold;
    if (score >= 55) return DesignSystem.colors.warning;
    return DesignSystem.colors.error;
  };

  const renderMainScore = () => (
    <View style={styles.mainScore}>
      <View style={styles.scoreRow}>
        <Text style={[styles.scoreValue, { color: getScoreColor(point.data.overall) }]}>
          {point.data.overall}
        </Text>
        <View style={styles.trendIndicator}>
          {getTrendIcon(point.data.change)}
          <Text style={[styles.changeText, { color: getTrendColor(point.data.change) }]}>
            {point.data.change > 0 ? '+' : ''}{point.data.change}
          </Text>
        </View>
      </View>
      <Text style={styles.scoreLabel}>Overall Alignment</Text>
    </View>
  );

  const renderSubScores = () => {
    if (!showSubScores || compact) return null;

    const subScores = [
      { key: 'biological', label: 'Bio', color: '#10b981', value: point.data.biological },
      { key: 'emotional', label: 'Emo', color: '#3b82f6', value: point.data.emotional },
      { key: 'environmental', label: 'Env', color: '#f59e0b', value: point.data.environmental },
      { key: 'financial', label: 'Fin', color: '#ef4444', value: point.data.financial },
    ];

    return (
      <View style={styles.subScores}>
        <Text style={styles.subScoresTitle}>Breakdown</Text>
        <View style={styles.subScoresGrid}>
          {subScores.map(score => (
            <View key={score.key} style={styles.subScoreItem}>
              <View style={[styles.subScoreDot, { backgroundColor: score.color }]} />
              <Text style={styles.subScoreLabel}>{score.label}</Text>
              <Text style={[styles.subScoreValue, { color: score.color }]}>
                {score.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderMicroTrend = () => {
    if (!point.data.microTrend || Math.abs(point.data.microTrend) < 0.1) return null;

    const isPositive = point.data.microTrend > 0;
    const strength = Math.abs(point.data.microTrend);

    return (
      <View style={styles.microTrend}>
        <Text style={styles.microTrendLabel}>Micro-trend</Text>
        <View style={styles.microTrendValue}>
          <Text style={[styles.microTrendArrow, { color: isPositive ? DesignSystem.colors.success : DesignSystem.colors.error }]}>
            {isPositive ? '↗' : '↘'}
          </Text>
          <Text style={styles.microTrendNumber}>
            {strength.toFixed(1)}
          </Text>
        </View>
      </View>
    );
  };

  const renderTimestamp = () => (
    <View style={styles.timestamp}>
      <Text style={styles.timestampText}>
        {formatTimestamp(point.timestamp)}
      </Text>
    </View>
  );

  const renderExplanation = () => {
    if (compact || !point.data.explanation) return null;

    return (
      <View style={styles.explanation}>
        <Text style={styles.explanationText} numberOfLines={2}>
          {point.data.explanation}
        </Text>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: animations.fade,
          transform: [
            { scale: animations.scale },
            { translateY: animations.slide },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.9)', 'rgba(0, 0, 0, 0.8)']}
        style={styles.background}
      />
      
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <X size={14} color={DesignSystem.colors.neutral.silver} />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        {renderTimestamp()}
        {renderMainScore()}
        {renderMicroTrend()}
        {renderSubScores()}
        {renderExplanation()}
      </View>

      {/* Pointer Arrow */}
      <View style={styles.arrow} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 200,
    maxWidth: 280,
    borderRadius: DesignSystem.radius.lg,
    overflow: 'hidden',
    ...DesignSystem.shadows.strong,
    zIndex: 1000,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  closeButton: {
    position: 'absolute',
    top: DesignSystem.spacing.sm,
    right: DesignSystem.spacing.sm,
    padding: DesignSystem.spacing.xs,
    borderRadius: DesignSystem.radius.xs,
    backgroundColor: DesignSystem.colors.alpha[8],
    zIndex: 1,
  },
  content: {
    padding: DesignSystem.spacing.lg,
    paddingTop: DesignSystem.spacing['2xl'], // Space for close button
  },
  timestamp: {
    marginBottom: DesignSystem.spacing.md,
  },
  timestampText: {
    color: DesignSystem.colors.primary.cyan,
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  mainScore: {
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.lg,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
    marginBottom: DesignSystem.spacing.xs,
  },
  scoreValue: {
    ...DesignSystem.typography.heading1,
    fontWeight: '700',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
    backgroundColor: DesignSystem.colors.alpha[8],
    paddingHorizontal: DesignSystem.spacing.sm,
    paddingVertical: DesignSystem.spacing.xs,
    borderRadius: DesignSystem.radius.sm,
  },
  changeText: {
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  scoreLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.caption,
  },
  microTrend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
    padding: DesignSystem.spacing.sm,
    backgroundColor: DesignSystem.colors.alpha[5],
    borderRadius: DesignSystem.radius.sm,
  },
  microTrendLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
  },
  microTrendValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
  },
  microTrendArrow: {
    ...DesignSystem.typography.caption,
    fontWeight: '700',
  },
  microTrendNumber: {
    color: DesignSystem.colors.neutral.platinum,
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  subScores: {
    marginBottom: DesignSystem.spacing.md,
  },
  subScoresTitle: {
    color: DesignSystem.colors.neutral.platinum,
    ...DesignSystem.typography.caption,
    fontWeight: '600',
    marginBottom: DesignSystem.spacing.sm,
  },
  subScoresGrid: {
    gap: DesignSystem.spacing.sm,
  },
  subScoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  subScoreDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  subScoreLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    flex: 1,
  },
  subScoreValue: {
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  explanation: {
    padding: DesignSystem.spacing.sm,
    backgroundColor: DesignSystem.colors.alpha[5],
    borderRadius: DesignSystem.radius.sm,
    borderLeftWidth: 2,
    borderLeftColor: DesignSystem.colors.primary.cyan,
  },
  explanationText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    lineHeight: 14,
  },
  arrow: {
    position: 'absolute',
    bottom: -5,
    left: '50%',
    marginLeft: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(0, 0, 0, 0.9)',
  },
});

export default TrendTooltip;
