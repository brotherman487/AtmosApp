import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import { DesignSystem, createGlassMorphism } from '../constants/design';

const { width } = Dimensions.get('window');

interface RhythmGaugeProps {
  rhythmScore: number;
  size?: 'small' | 'medium' | 'large';
  style?: any;
  onPress?: () => void;
}

const RhythmGauge: React.FC<RhythmGaugeProps> = ({
  rhythmScore,
  size = 'medium',
  style,
  onPress,
}) => {
  const getRhythmColor = () => {
    if (rhythmScore >= 85) return '#10b981';
    if (rhythmScore >= 70) return '#f59e0b';
    if (rhythmScore >= 55) return '#f97316';
    return '#ef4444';
  };

  const getRhythmStatus = () => {
    if (rhythmScore >= 85) return 'EXCELLENT';
    if (rhythmScore >= 70) return 'GOOD';
    if (rhythmScore >= 55) return 'FAIR';
    return 'NEEDS FOCUS';
  };

  const getChangeIcon = (change: number = 2.3) => {
    if (change > 0) return <TrendingUp size={16} color="#10b981" />;
    if (change < 0) return <TrendingDown size={16} color="#ef4444" />;
    return <Minus size={16} color="#7dd3fc" />;
  };

  const getChangeColor = (change: number = 2.3) => {
    if (change > 0) return '#10b981';
    if (change < 0) return '#ef4444';
    return '#7dd3fc';
  };

  const renderSparkline = () => {
    // Simple sparkline representation
    return (
      <View style={styles.sparkContainer}>
        <Activity size={16} color={getRhythmColor()} />
      </View>
    );
  };

  const renderMicroTrend = (microTrend: number = 2.0) => {
    const isPositive = microTrend > 0;
    const strength = Math.abs(microTrend);
    
    return (
      <View style={styles.microTrendContainer}>
        <Text style={[styles.microTrendArrow, { color: isPositive ? '#10b981' : '#ef4444' }]}>
          {isPositive ? '↗' : '↘'}
        </Text>
        <Text style={styles.microTrendValue}>
          {strength.toFixed(1)}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.9}>
      <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']} style={styles.background} />
      
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.rhythmLabel}>RHYTHM ALIGNMENT</Text>
          <Text style={[styles.rhythmValue, { color: getRhythmColor() }]}>
            {Math.round(rhythmScore)}
          </Text>
          <View style={styles.changeRow}>
            {getChangeIcon()}
            <Text style={[styles.changeText, { color: getChangeColor() }]}>
              +1
            </Text>
            {renderMicroTrend()}
          </View>
        </View>
        
        <View style={styles.rightSection}>
          {renderSparkline()}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { 
    ...createGlassMorphism(0.08),
    borderRadius: DesignSystem.radius.xl,
    padding: DesignSystem.spacing.lg,
    marginHorizontal: DesignSystem.spacing.lg,
    marginVertical: DesignSystem.spacing.sm,
    ...DesignSystem.shadows.soft,
  },
  background: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    borderRadius: DesignSystem.radius.xl 
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  rhythmLabel: { 
    color: DesignSystem.colors.primary.cyan, 
    ...DesignSystem.typography.micro,
    textTransform: 'uppercase',
    marginBottom: DesignSystem.spacing.xs,
  },
  rhythmValue: { 
    ...DesignSystem.typography.display,
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 48,
    marginBottom: DesignSystem.spacing.sm,
  },
  changeRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: DesignSystem.spacing.xs,
  },
  changeText: { 
    ...DesignSystem.typography.body2,
    fontWeight: '600',
  },
  sparkContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: DesignSystem.spacing.sm, 
    paddingVertical: DesignSystem.spacing.xs, 
    ...createGlassMorphism(0.05),
    borderRadius: DesignSystem.radius.sm,
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
});

export default RhythmGauge;
