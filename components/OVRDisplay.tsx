import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Minus, Zap, Brain, Heart, Wind, DollarSign, BarChart3 } from 'lucide-react-native';
import { OVRScore, OVRBreakdown } from '../types/ovr';
import { ovrService } from '../services/ovrService';
import { DesignSystem, createGlassMorphism } from '../constants/design';

const { width } = Dimensions.get('window');

interface OVRDisplayProps {
  ovrScore: OVRScore;
  onOVRTap?: () => void;
  onBreakdownPress?: () => void;
  expanded?: boolean;
  showTrends?: boolean;
}

const OVRDisplay: React.FC<OVRDisplayProps> = ({ 
  ovrScore,
  onOVRTap, 
  onBreakdownPress,
  expanded = false,
  showTrends = false
}) => {
  const [history, setHistory] = useState<OVRScore[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');

  useEffect(() => {
    setHistory(ovrService.getOVRHistory(20));
  }, [ovrScore]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#059669';
    if (score >= 70) return '#f59e0b';
    if (score >= 60) return '#f97316';
    if (score >= 50) return '#ef4444';
    if (score >= 40) return '#dc2626';
    if (score >= 30) return '#b91c1c';
    return '#991b1b';
  };

  const getScoreCategory = (score: number) => {
    if (score >= 90) return 'ELITE';
    if (score >= 80) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 60) return 'FAIR';
    if (score >= 50) return 'AVERAGE';
    if (score >= 40) return 'BELOW AVERAGE';
    if (score >= 30) return 'POOR';
    return 'CRITICAL';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} color="#10b981" />;
    if (change < 0) return <TrendingDown size={16} color="#ef4444" />;
    return <Minus size={16} color="#7dd3fc" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return '#10b981';
    if (change < 0) return '#ef4444';
    return '#7dd3fc';
  };

  const renderSparkline = () => {
    if (history.length < 2) return null;
    const values = history.map(h => h.overall);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    const points = values.slice(-16);

    return (
      <View style={styles.sparkContainer}>
        {points.map((v, i) => {
          const height = ((v - min) / range) * 20 + 2;
          return <View key={i} style={[styles.sparkBar, { height }]} />
        })}
      </View>
    );
  };

  const renderMicroTrend = (microTrend: number) => {
    if (Math.abs(microTrend) < 0.1) return null;
    
    const isPositive = microTrend > 0;
    const strength = Math.abs(microTrend);
    const opacity = Math.min(1, strength / 2); // Fade based on strength
    
    return (
      <View style={[styles.microTrendContainer, { opacity }]}>
        <Text style={[styles.microTrendArrow, { color: isPositive ? '#10b981' : '#ef4444' }]}>
          {isPositive ? '↗' : '↘'}
        </Text>
        <Text style={styles.microTrendValue}>
          {strength.toFixed(1)}
        </Text>
      </View>
    );
  };

  const renderMainScore = () => (
    <TouchableOpacity style={styles.mainScoreContainer} onPress={onOVRTap} activeOpacity={0.9}>
      <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']} style={styles.mainScoreBackground} />
      
      <View style={styles.scoreHeader}>
        <Text style={styles.ovrLabel}>OVERALL ALIGNMENT</Text>
        <Text style={styles.ovrAcronym}>OVR</Text>
      </View>

      <View style={styles.scoreDisplay}>
        <Text style={[styles.scoreNumber, { color: getScoreColor(ovrScore.overall) }]}>
          {ovrScore.overall}
        </Text>
        <Text style={styles.scoreMax}>/99</Text>
      </View>

      <View style={styles.scoreCategory}>
        <Text style={styles.categoryText}>
          {getScoreCategory(ovrScore.overall)}
        </Text>
      </View>

      <View style={styles.scoreChangeRow}>
        <View style={styles.scoreChange}>
          {getChangeIcon(ovrScore.change)}
          <Text style={[styles.changeText, { color: getChangeColor(ovrScore.change) }]}>
            {ovrScore.change > 0 ? `+${ovrScore.change}` : ovrScore.change}
          </Text>
          <Text style={styles.changeLabel}>today</Text>
          {ovrScore.microTrend !== undefined && renderMicroTrend(ovrScore.microTrend)}
        </View>
        {renderSparkline()}
      </View>

      <View style={styles.explanationContainer}>
        <Text style={styles.explanationText}>{ovrScore.explanation}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTrendsSection = () => {
    if (!showTrends) return null;

    const timeframes = [
      { key: 'day', label: 'Day', dataPoints: 24 },
      { key: 'week', label: 'Week', dataPoints: 7 },
      { key: 'month', label: 'Month', dataPoints: 30 },
      { key: 'year', label: 'Year', dataPoints: 12 }
    ];

    const getDataPoints = (timeframe: string) => {
      switch (timeframe) {
        case 'day': return 24;
        case 'week': return 7;
        case 'month': return 30;
        case 'year': return 12;
        default: return 7;
      }
    };

    const renderTrendChart = () => {
      const trendHistory = ovrService.getOVRHistory(getDataPoints(selectedTimeframe));
      const values = trendHistory.map(h => h.overall);
      
      if (values.length === 0) {
        return (
          <View style={styles.trendChartContainer}>
            <Text style={styles.trendChartLabel}>No trend data available</Text>
          </View>
        );
      }
      
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = Math.max(1, max - min);
      const chartHeight = 100;
      const chartWidth = width - 80;
      const barWidth = chartWidth / values.length;
      const spacing = 2;

      return (
        <View style={styles.trendChartContainer}>
          <View style={styles.trendChartArea}>
            {values.map((value, index) => {
              const height = ((value - min) / range) * chartHeight;
              return (
                <View
                  key={index}
                  style={[
                    styles.trendChartBar,
                    {
                      width: barWidth - spacing,
                      height: Math.max(height, 4),
                      backgroundColor: getScoreColor(value) + '80',
                    }
                  ]}
                />
              );
            })}
          </View>
          <View style={styles.trendChartLabels}>
            <Text style={styles.trendChartLabel}>Low: {min}</Text>
            <Text style={styles.trendChartLabel}>High: {max}</Text>
          </View>
        </View>
      );
    };

    const renderTimeframeSelector = () => (
      <View style={styles.timeframeSelector}>
        {timeframes.map((timeframe) => (
          <TouchableOpacity
            key={timeframe.key}
            style={[
              styles.timeframeButton,
              selectedTimeframe === timeframe.key && styles.timeframeButtonActive
            ]}
            onPress={() => setSelectedTimeframe(timeframe.key as any)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.timeframeButtonText,
              selectedTimeframe === timeframe.key && styles.timeframeButtonTextActive
            ]}>
              {timeframe.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );

    const renderTrendStats = () => {
      const trendHistory = ovrService.getOVRHistory(getDataPoints(selectedTimeframe));
      const values = trendHistory.map(h => h.overall);
      
      if (values.length === 0) {
        return (
          <View style={styles.trendStatsContainer}>
            <Text style={styles.trendChartLabel}>No data available</Text>
          </View>
        );
      }
      
      const current = values[values.length - 1];
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      const change = values.length > 1 ? current - values[values.length - 2] : 0;

      return (
        <View style={styles.trendStatsContainer}>
          <View style={styles.trendStat}>
            <Text style={styles.trendStatLabel}>Current</Text>
            <Text style={[styles.trendStatValue, { color: getScoreColor(current) }]}>
              {current}
            </Text>
          </View>
          <View style={styles.trendStat}>
            <Text style={styles.trendStatLabel}>Average</Text>
            <Text style={styles.trendStatValue}>
              {average.toFixed(1)}
            </Text>
          </View>
          <View style={styles.trendStat}>
            <Text style={styles.trendStatLabel}>Change</Text>
            <View style={styles.trendStatChange}>
              {getChangeIcon(change)}
              <Text style={[styles.trendStatValue, { color: getChangeColor(change) }]}>
                {change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
      );
    };

    return (
      <View style={styles.trendsContainer}>
        <View style={styles.trendsHeader}>
          <BarChart3 size={20} color={DesignSystem.colors.primary.cyan} />
          <Text style={styles.trendsTitle}>OVR Trends</Text>
        </View>
        
        {renderTimeframeSelector()}
        {renderTrendStats()}
        {renderTrendChart()}
      </View>
    );
  };

  const renderSubScores = () => {
    const subScores = [
      { label: 'Biological', score: ovrScore.biological, icon: <Brain size={16} color="#a855f7" />, color: '#a855f7' },
      { label: 'Emotional', score: ovrScore.emotional, icon: <Heart size={16} color="#ef4444" />, color: '#ef4444' },
      { label: 'Environmental', score: ovrScore.environmental, icon: <Wind size={16} color="#10b981" />, color: '#10b981' },
      { label: 'Financial', score: ovrScore.financial, icon: <DollarSign size={16} color="#f59e0b" />, color: '#f59e0b' },
    ];

    return (
      <View style={styles.subScoresContainer}>
        <Text style={styles.subScoresTitle}>Performance Breakdown</Text>
        <View style={styles.subScoresGrid}>
          {subScores.map((subScore, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.subScoreCard, { borderColor: subScore.color + '40' }]}
              onPress={onBreakdownPress}
              activeOpacity={0.7}
            >
              <View style={styles.subScoreHeader}>
                {subScore.icon}
                <Text style={styles.subScoreLabel}>{subScore.label}</Text>
              </View>
              <Text style={[styles.subScoreNumber, { color: subScore.color }]}>
                {subScore.score}
              </Text>
              <View style={[styles.subScoreBar, { backgroundColor: subScore.color + '20' }]}>
                <View style={[styles.subScoreBarFill, { backgroundColor: subScore.color, width: `${(subScore.score / 99) * 100}%` }]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['rgba(125, 211, 252, 0.1)', 'rgba(125, 211, 252, 0.05)', 'transparent']} style={styles.background} />
      {renderMainScore()}
      {expanded && renderSubScores()}
      {renderTrendsSection()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: DesignSystem.spacing['2xl'], 
    borderRadius: DesignSystem.radius['3xl'], 
    ...createGlassMorphism(0.08),
    margin: DesignSystem.spacing.lg,
    ...DesignSystem.shadows.medium,
  },
  background: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    borderRadius: DesignSystem.radius['3xl'] 
  },
  mainScoreContainer: { 
    alignItems: 'center', 
    paddingVertical: DesignSystem.spacing['3xl'] 
  },
  mainScoreBackground: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    borderRadius: DesignSystem.radius['3xl'] 
  },
  scoreHeader: { 
    alignItems: 'center', 
    marginBottom: DesignSystem.spacing['2xl'] 
  },
  ovrLabel: { 
    color: DesignSystem.colors.primary.cyan, 
    ...DesignSystem.typography.micro,
    textTransform: 'uppercase',
    marginBottom: DesignSystem.spacing.xs 
  },
  ovrAcronym: { 
    color: DesignSystem.colors.neutral.pearl, 
    ...DesignSystem.typography.heading2,
    letterSpacing: 2 
  },
  scoreDisplay: { 
    flexDirection: 'row', 
    alignItems: 'baseline', 
    marginBottom: DesignSystem.spacing['2xl'] 
  },
  scoreNumber: { 
    ...DesignSystem.typography.display,
    fontSize: 80,
    fontWeight: '900',
    lineHeight: 80,
  },
  scoreMax: { 
    color: DesignSystem.colors.primary.cyan, 
    ...DesignSystem.typography.heading2,
    marginLeft: DesignSystem.spacing.xs 
  },
  scoreCategory: { 
    ...createGlassMorphism(0.12),
    paddingHorizontal: DesignSystem.spacing.lg, 
    paddingVertical: DesignSystem.spacing.sm, 
    borderRadius: DesignSystem.radius.full, 
    marginBottom: DesignSystem.spacing.sm 
  },
  categoryText: { 
    color: DesignSystem.colors.neutral.pearl, 
    ...DesignSystem.typography.caption,
    textTransform: 'uppercase',
  },
  scoreChangeRow: { 
    width: '100%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: DesignSystem.spacing['2xl'] 
  },
  scoreChange: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: DesignSystem.spacing.sm 
  },
  changeText: { 
    ...DesignSystem.typography.heading3,
    fontWeight: '700',
  },
  changeLabel: { 
    color: DesignSystem.colors.primary.cyan, 
    ...DesignSystem.typography.body2,
    opacity: 0.8 
  },
  explanationContainer: { 
    ...createGlassMorphism(0.06),
    backgroundColor: `rgba(125, 211, 252, 0.08)`,
    padding: DesignSystem.spacing.lg, 
    borderRadius: DesignSystem.radius.xl,
  },
  explanationText: { 
    color: DesignSystem.colors.primary.cyan, 
    ...DesignSystem.typography.body2,
    textAlign: 'center', 
    lineHeight: 22,
    opacity: 0.9,
  },
  subScoresContainer: { 
    marginTop: DesignSystem.spacing['3xl'], 
    paddingTop: DesignSystem.spacing['3xl'], 
    borderTopWidth: 1, 
    borderTopColor: DesignSystem.colors.alpha[8] 
  },
  subScoresTitle: { 
    color: DesignSystem.colors.neutral.pearl, 
    ...DesignSystem.typography.heading3,
    marginBottom: DesignSystem.spacing['2xl'], 
    textAlign: 'center' 
  },
  subScoresGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    gap: DesignSystem.spacing.md 
  },
  subScoreCard: { 
    width: (width - 80) / 2, 
    ...createGlassMorphism(0.06),
    borderRadius: DesignSystem.radius.xl, 
    padding: DesignSystem.spacing.lg, 
    alignItems: 'center', 
    minHeight: 120,
    ...DesignSystem.shadows.soft,
  },
  subScoreHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: DesignSystem.spacing.sm, 
    marginBottom: DesignSystem.spacing.md 
  },
  subScoreLabel: { 
    color: DesignSystem.colors.neutral.platinum, 
    ...DesignSystem.typography.caption 
  },
  subScoreNumber: { 
    ...DesignSystem.typography.heading2,
    fontWeight: '700',
    marginBottom: DesignSystem.spacing.md 
  },
  subScoreBar: { 
    width: '100%', 
    height: 6, 
    borderRadius: DesignSystem.radius.xs, 
    overflow: 'hidden',
    backgroundColor: DesignSystem.colors.alpha[8],
  },
  subScoreBarFill: { 
    height: '100%', 
    borderRadius: DesignSystem.radius.xs 
  },
  sparkContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    gap: 3, 
    height: 28, 
    paddingHorizontal: DesignSystem.spacing.sm, 
    paddingVertical: DesignSystem.spacing.xs, 
    ...createGlassMorphism(0.05),
    borderRadius: DesignSystem.radius.sm,
  },
  sparkBar: { 
    width: 3, 
    borderRadius: 2, 
    backgroundColor: DesignSystem.colors.primary.cyan, 
    minHeight: 2 
  },
  microTrendContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: DesignSystem.spacing.sm, 
    paddingHorizontal: DesignSystem.spacing.xs, 
    paddingVertical: DesignSystem.spacing.xs, 
    ...createGlassMorphism(0.03),
    borderRadius: DesignSystem.radius.sm 
  },
  microTrendArrow: { 
    ...DesignSystem.typography.caption,
    fontWeight: '700',
  },
  microTrendValue: { 
    color: DesignSystem.colors.primary.cyan, 
    ...DesignSystem.typography.micro,
    marginLeft: 2, 
    opacity: 0.8 
  },
  trendsContainer: {
    marginTop: DesignSystem.spacing['3xl'],
    paddingTop: DesignSystem.spacing['3xl'],
    borderTopWidth: 1,
    borderTopColor: DesignSystem.colors.alpha[8]
  },
  trendsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
    marginBottom: DesignSystem.spacing['2xl']
  },
  trendsTitle: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading3,
  },
  timeframeSelector: {
    flexDirection: 'row',
    gap: DesignSystem.spacing.sm,
    marginBottom: DesignSystem.spacing['2xl']
  },
  timeframeButton: {
    ...createGlassMorphism(0.06),
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.radius.full,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  timeframeButtonActive: {
    borderColor: DesignSystem.colors.primary.cyan,
    backgroundColor: `rgba(125, 211, 252, 0.1)`
  },
  timeframeButtonText: {
    color: DesignSystem.colors.neutral.platinum,
    ...DesignSystem.typography.caption,
    textTransform: 'uppercase'
  },
  timeframeButtonTextActive: {
    color: DesignSystem.colors.primary.cyan,
    fontWeight: '600'
  },
  trendStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: DesignSystem.spacing['2xl'],
    paddingHorizontal: DesignSystem.spacing.lg
  },
  trendStat: {
    alignItems: 'center'
  },
  trendStatLabel: {
    color: DesignSystem.colors.primary.cyan,
    ...DesignSystem.typography.caption,
    marginBottom: DesignSystem.spacing.xs,
    opacity: 0.8
  },
  trendStatValue: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading3,
    fontWeight: '700'
  },
  trendStatChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs
  },
  trendChartContainer: {
    ...createGlassMorphism(0.06),
    padding: DesignSystem.spacing.lg,
    borderRadius: DesignSystem.radius.xl,
    marginBottom: DesignSystem.spacing.lg
  },
  trendChartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 2,
    marginBottom: DesignSystem.spacing.md
  },
  trendChartBar: {
    borderRadius: DesignSystem.radius.xs,
    minHeight: 4
  },
  trendChartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  trendChartLabel: {
    color: DesignSystem.colors.primary.cyan,
    ...DesignSystem.typography.caption,
    opacity: 0.7
  },
});

export default OVRDisplay;