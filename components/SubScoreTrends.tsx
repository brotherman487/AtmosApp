import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, Heart, Wind, DollarSign, TrendingUp, TrendingDown } from 'lucide-react-native';
import { OVRBreakdown } from '../types/ovr';
import { DesignSystem, createGlassMorphism } from '../constants/design';

const { width } = Dimensions.get('window');

interface SubScoreTrendsProps {
  ovrBreakdown: OVRBreakdown | null;
  selectedDomain: 'biological' | 'emotional' | 'environmental' | 'financial';
  onDomainSelect: (domain: 'biological' | 'emotional' | 'environmental' | 'financial') => void;
  showChart?: boolean;
}

const SubScoreTrends: React.FC<SubScoreTrendsProps> = ({ 
  ovrBreakdown, 
  selectedDomain, 
  onDomainSelect,
  showChart = true
}) => {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  const domains = [
    {
      key: 'biological' as const,
      label: 'Biological',
      icon: <Brain size={16} color="#a855f7" />,
      color: '#a855f7',
      description: 'Sleep, activity, recovery'
    },
    {
      key: 'emotional' as const,
      label: 'Emotional',
      icon: <Heart size={16} color="#ef4444" />,
      color: '#ef4444',
      description: 'Mood, stress, resilience'
    },
    {
      key: 'environmental' as const,
      label: 'Environmental',
      icon: <Wind size={16} color="#10b981" />,
      color: '#10b981',
      description: 'Air quality, comfort'
    },
    {
      key: 'financial' as const,
      label: 'Financial',
      icon: <DollarSign size={16} color="#f59e0b" />,
      color: '#f59e0b',
      description: 'Savings, debt, growth'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#059669';
    if (score >= 70) return '#f59e0b';
    if (score >= 60) return '#f97316';
    if (score >= 50) return '#ef4444';
    return '#dc2626';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={12} color="#10b981" />;
    if (change < 0) return <TrendingDown size={12} color="#ef4444" />;
    return null;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return '#10b981';
    if (change < 0) return '#ef4444';
    return '#7dd3fc';
  };

  const renderDomainTabs = () => (
    <View style={styles.tabsContainer}>
      {domains.map((domain) => {
        const isSelected = selectedDomain === domain.key;
        const score = ovrBreakdown?.[domain.key]?.score || 0;
        
        return (
          <TouchableOpacity
            key={domain.key}
            style={[
              styles.domainTab,
              isSelected && { borderColor: domain.color + '40' }
            ]}
            onPress={() => onDomainSelect(domain.key)}
            activeOpacity={0.7}
          >
            <View style={styles.domainTabHeader}>
              {React.cloneElement(domain.icon, { size: Platform.OS === 'ios' ? 20 : 16 })}
            </View>
            <Text style={[styles.domainScore, { color: getScoreColor(score) }]}>
              {score}
            </Text>
            {isSelected && (
              <View style={[styles.selectedIndicator, { backgroundColor: domain.color }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderTrendChart = () => {
    if (!ovrBreakdown) return null;
    
    const domain = ovrBreakdown[selectedDomain];
    const trends = domain.trends.weekly || domain.trends.daily || [];
    
    if (trends.length < 2) return null;

    const values = trends;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    const chartHeight = 80;
    const chartWidth = width - 80;
    const barWidth = chartWidth / values.length;
    const spacing = 2;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartArea}>
          {values.map((value, index) => {
            const height = ((value - min) / range) * chartHeight;
            const isSelected = selectedPoint === index;
            const domainColor = domains.find(d => d.key === selectedDomain)?.color || '#7dd3fc';
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.chartBar,
                  {
                    width: barWidth - spacing,
                    height: Math.max(height, 3),
                    backgroundColor: isSelected 
                      ? domainColor 
                      : domainColor + '60',
                    borderColor: isSelected ? domainColor : 'transparent',
                  }
                ]}
                onPress={() => setSelectedPoint(isSelected ? null : index)}
                activeOpacity={0.7}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const renderSelectedPoint = () => {
    if (selectedPoint === null || !ovrBreakdown) return null;
    
    const domain = ovrBreakdown[selectedDomain];
    const trends = domain.trends.weekly || domain.trends.daily || [];
    const point = trends[selectedPoint];
    const change = selectedPoint > 0 ? point - trends[selectedPoint - 1] : 0;
    const domainColor = domains.find(d => d.key === selectedDomain)?.color || '#7dd3fc';
    
    return (
      <View style={styles.selectedPointContainer}>
        <View style={[styles.selectedPointCard, { borderColor: domainColor + '20' }]}>
          <Text style={styles.selectedPointLabel}>
            {selectedPoint === trends.length - 1 ? 'Current' : `Day ${selectedPoint + 1}`}
          </Text>
          <Text style={[styles.selectedPointValue, { color: getScoreColor(point) }]}>
            {point}
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

  const renderDomainInsights = () => {
    if (!ovrBreakdown) return null;
    
    const domain = ovrBreakdown[selectedDomain];
    const insights = domain.insights || [];
    
    return (
      <View style={styles.insightsContainer}>
        <Text style={styles.insightsTitle}>Key Insights</Text>
        {insights.slice(0, 2).map((insight, index) => (
          <View key={index} style={styles.insightItem}>
            <Text style={styles.insightText}>{insight}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderComponents = () => {
    if (!ovrBreakdown) return null;
    
    const domain = ovrBreakdown[selectedDomain];
    const components = domain.components;
    
    return (
      <View style={styles.componentsContainer}>
        <Text style={styles.componentsTitle}>Components</Text>
        <View style={styles.componentsGrid}>
          {Object.entries(components).map(([key, value]) => (
            <View key={key} style={styles.componentItem}>
              <Text style={styles.componentLabel}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Text>
              <Text style={[styles.componentValue, { color: getScoreColor(value) }]}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={DesignSystem.gradients.accent} style={styles.background} />
      
      <View style={styles.content}>
        {renderDomainTabs()}
        
        {showChart && (
          <View style={styles.chartSection}>
            {renderTrendChart()}
            {renderSelectedPoint()}
          </View>
        )}
        
        <View style={styles.detailsSection}>
          {renderComponents()}
          {renderDomainInsights()}
        </View>
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
    padding: Platform.OS === 'ios' ? 20 : DesignSystem.spacing['2xl'],
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Platform.OS === 'ios' ? 24 : DesignSystem.spacing['2xl'],
    gap: Platform.OS === 'ios' ? 6 : DesignSystem.spacing.sm,
  },
  domainTab: {
    flex: 1,
    ...createGlassMorphism(0.06),
    borderRadius: DesignSystem.radius.lg,
    padding: Platform.OS === 'ios' ? 12 : DesignSystem.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
    minHeight: Platform.OS === 'ios' ? 70 : undefined,
  },
  domainTabHeader: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 6 : DesignSystem.spacing.xs,
  },
  domainLabel: {
    ...DesignSystem.typography.micro,
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: Platform.OS === 'ios' ? 10 : undefined,
  },
  domainScore: {
    ...DesignSystem.typography.heading3,
    fontWeight: '700',
    fontSize: Platform.OS === 'ios' ? 26 : undefined,
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: -1,
    left: '50%',
    width: 20,
    height: 2,
    borderRadius: 1,
    transform: [{ translateX: -10 }],
  },
  chartSection: {
    position: 'relative',
    marginBottom: DesignSystem.spacing['2xl'],
  },
  chartContainer: {
    height: 100,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
    paddingBottom: DesignSystem.spacing.sm,
  },
  chartBar: {
    borderRadius: DesignSystem.radius.xs,
    borderWidth: 1,
  },
  selectedPointContainer: {
    position: 'absolute',
    top: -50,
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
    minWidth: 100,
    borderWidth: 1,
  },
  selectedPointLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    marginBottom: DesignSystem.spacing.xs,
  },
  selectedPointValue: {
    ...DesignSystem.typography.heading3,
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
  detailsSection: {
    gap: DesignSystem.spacing.lg,
  },
  componentsContainer: {
    paddingTop: DesignSystem.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: DesignSystem.colors.alpha[8],
  },
  componentsTitle: {
    ...DesignSystem.typography.caption,
    color: DesignSystem.colors.neutral.platinum,
    fontWeight: '600',
    marginBottom: DesignSystem.spacing.md,
    textTransform: 'uppercase',
  },
  componentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Platform.OS === 'ios' ? 12 : DesignSystem.spacing.md,
  },
  componentItem: {
    flex: 1,
    minWidth: Platform.OS === 'ios' ? (width - 80) / 2 : (width - 120) / 2,
    alignItems: 'center',
    padding: Platform.OS === 'ios' ? 16 : DesignSystem.spacing.md,
    ...createGlassMorphism(0.04),
    borderRadius: DesignSystem.radius.lg,
  },
  componentLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.xs,
  },
  componentValue: {
    ...DesignSystem.typography.heading3,
    fontWeight: '700',
  },
  insightsContainer: {
    paddingTop: DesignSystem.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: DesignSystem.colors.alpha[8],
  },
  insightsTitle: {
    ...DesignSystem.typography.caption,
    color: DesignSystem.colors.neutral.platinum,
    fontWeight: '600',
    marginBottom: DesignSystem.spacing.md,
    textTransform: 'uppercase',
  },
  insightItem: {
    padding: DesignSystem.spacing.md,
    ...createGlassMorphism(0.04),
    borderRadius: DesignSystem.radius.lg,
    marginBottom: DesignSystem.spacing.sm,
  },
  insightText: {
    ...DesignSystem.typography.body2,
    color: DesignSystem.colors.neutral.silver,
    lineHeight: 18,
  },
});

export default SubScoreTrends;
