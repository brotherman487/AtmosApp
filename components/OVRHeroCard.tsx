import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Activity, ChevronRight } from 'lucide-react-native';
import { OVRScore } from '../types/ovr';
import { DesignSystem, createGlassMorphism } from '../constants/design';

const { width } = Dimensions.get('window');

interface OVRHeroCardProps {
  ovrScore: OVRScore;
  onPress?: () => void;
}

const OVRHeroCard: React.FC<OVRHeroCardProps> = ({ ovrScore, onPress }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#059669';
    if (score >= 70) return '#f59e0b';
    if (score >= 60) return '#f97316';
    if (score >= 50) return '#ef4444';
    return '#dc2626';
  };

  const getScoreCategory = (score: number) => {
    if (score >= 90) return 'ELITE';
    if (score >= 80) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 60) return 'FAIR';
    if (score >= 50) return 'AVERAGE';
    return 'NEEDS ATTENTION';
  };

  const getGradientColors = (score: number): [string, string, string] => {
    if (score >= 90) return ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)', 'transparent'];
    if (score >= 80) return ['rgba(5, 150, 105, 0.2)', 'rgba(5, 150, 105, 0.1)', 'transparent'];
    if (score >= 70) return ['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.1)', 'transparent'];
    if (score >= 60) return ['rgba(249, 115, 22, 0.2)', 'rgba(249, 115, 22, 0.1)', 'transparent'];
    return ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)', 'transparent'];
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} color="#10b981" />;
    if (change < 0) return <TrendingDown size={16} color="#ef4444" />;
    return <Activity size={16} color="#7dd3fc" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return '#10b981';
    if (change < 0) return '#ef4444';
    return '#7dd3fc';
  };

  const progressPercentage = (ovrScore.overall / 99) * 100;
  const strokeWidth = 8;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <LinearGradient 
        colors={getGradientColors(ovrScore.overall)} 
        style={styles.background} 
      />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.ovrLabel}>OVERALL ALIGNMENT</Text>
          <Text style={styles.ovrAcronym}>OVR</Text>
        </View>

        {/* Main Score with Circular Progress */}
        <View style={styles.scoreContainer}>
          <View style={styles.circularProgress}>
            {/* Background Circle */}
            <View style={[styles.progressCircle, { borderColor: DesignSystem.colors.alpha[10] }]} />
            
            {/* Progress Circle */}
            <View style={[
              styles.progressCircle,
              {
                borderColor: getScoreColor(ovrScore.overall),
                borderWidth: strokeWidth,
                transform: [{ rotate: '-90deg' }],
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: getScoreColor(ovrScore.overall),
                borderRadius: radius + strokeWidth,
                width: (radius + strokeWidth) * 2,
                height: (radius + strokeWidth) * 2,
                position: 'absolute',
              }
            ]} />
            
            {/* Score Display */}
            <View style={styles.scoreDisplay}>
              <Text style={[styles.scoreNumber, { color: getScoreColor(ovrScore.overall) }]}>
                {ovrScore.overall}
              </Text>
              <Text style={styles.scoreMax}>/99</Text>
            </View>
          </View>
        </View>

        {/* Category Badge */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>
            {getScoreCategory(ovrScore.overall)}
          </Text>
        </View>

        {/* Change Indicators */}
        <View style={styles.changeContainer}>
          <View style={styles.changeRow}>
            {getChangeIcon(ovrScore.change)}
            <Text style={[styles.changeText, { color: getChangeColor(ovrScore.change) }]}>
              {ovrScore.change > 0 ? `+${ovrScore.change}` : ovrScore.change}
            </Text>
            <Text style={styles.changeLabel}>today</Text>
          </View>
          
          {ovrScore.microTrend !== undefined && Math.abs(ovrScore.microTrend) > 0.1 && (
            <View style={styles.microTrendContainer}>
              <Text style={[styles.microTrendArrow, { color: ovrScore.microTrend > 0 ? '#10b981' : '#ef4444' }]}>
                {ovrScore.microTrend > 0 ? '↗' : '↘'}
              </Text>
              <Text style={styles.microTrendValue}>
                {Math.abs(ovrScore.microTrend).toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Sub-scores Quick Overview */}
        <View style={styles.subScoresOverview}>
          <View style={styles.subScoreItem}>
            <Text style={styles.subScoreLabel}>Bio</Text>
            <Text style={[styles.subScoreValue, { color: getScoreColor(ovrScore.biological) }]}>
              {ovrScore.biological}
            </Text>
          </View>
          <View style={styles.subScoreItem}>
            <Text style={styles.subScoreLabel}>Emo</Text>
            <Text style={[styles.subScoreValue, { color: getScoreColor(ovrScore.emotional) }]}>
              {ovrScore.emotional}
            </Text>
          </View>
          <View style={styles.subScoreItem}>
            <Text style={styles.subScoreLabel}>Env</Text>
            <Text style={[styles.subScoreValue, { color: getScoreColor(ovrScore.environmental) }]}>
              {ovrScore.environmental}
            </Text>
          </View>
          <View style={styles.subScoreItem}>
            <Text style={styles.subScoreLabel}>Fin</Text>
            <Text style={[styles.subScoreValue, { color: getScoreColor(ovrScore.financial) }]}>
              {ovrScore.financial}
            </Text>
          </View>
        </View>


      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...createGlassMorphism(0.12),
    borderRadius: DesignSystem.radius['3xl'],
    marginBottom: DesignSystem.spacing['2xl'],
    overflow: 'hidden',
    ...DesignSystem.shadows.medium,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: DesignSystem.radius['3xl'],
  },
  content: {
    padding: DesignSystem.spacing['3xl'],
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: DesignSystem.spacing['2xl'],
  },
  ovrLabel: {
    color: DesignSystem.colors.primary.cyan,
    ...DesignSystem.typography.micro,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: DesignSystem.spacing.xs,
  },
  ovrAcronym: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading1,
    letterSpacing: 2,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: DesignSystem.spacing['2xl'],
  },
  circularProgress: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    borderColor: DesignSystem.colors.alpha[10],
  },
  scoreDisplay: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreNumber: {
    ...DesignSystem.typography.display,
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 48,
  },
  scoreMax: {
    color: DesignSystem.colors.primary.cyan,
    ...DesignSystem.typography.heading3,
    opacity: 0.8,
  },
  categoryContainer: {
    ...createGlassMorphism(0.15),
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.radius.full,
    marginBottom: DesignSystem.spacing.lg,
  },
  categoryText: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.caption,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DesignSystem.spacing.md,
    marginBottom: DesignSystem.spacing['2xl'],
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
  },
  changeText: {
    ...DesignSystem.typography.heading3,
    fontWeight: '700',
  },
  changeLabel: {
    color: DesignSystem.colors.primary.cyan,
    ...DesignSystem.typography.body2,
    opacity: 0.8,
  },
  microTrendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DesignSystem.spacing.sm,
    paddingVertical: DesignSystem.spacing.xs,
    ...createGlassMorphism(0.08),
    borderRadius: DesignSystem.radius.sm,
  },
  microTrendArrow: {
    ...DesignSystem.typography.caption,
    fontWeight: '700',
  },
  microTrendValue: {
    color: DesignSystem.colors.primary.cyan,
    ...DesignSystem.typography.micro,
    marginLeft: 2,
    opacity: 0.8,
  },
  subScoresOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: DesignSystem.spacing.lg,
  },
  subScoreItem: {
    alignItems: 'center',
  },
  subScoreLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    textTransform: 'uppercase',
    marginBottom: DesignSystem.spacing.xs,
  },
  subScoreValue: {
    ...DesignSystem.typography.heading3,
    fontWeight: '700',
  },

});

export default OVRHeroCard;
