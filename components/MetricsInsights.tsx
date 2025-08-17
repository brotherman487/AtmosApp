import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, TrendingUp, TrendingDown, Target, Clock, CheckCircle } from 'lucide-react-native';
import { OVRScore } from '../types/ovr';
import { DesignSystem, createGlassMorphism } from '../constants/design';

interface MetricsInsightsProps {
  ovrScore: OVRScore | null;
}

interface Insight {
  id: string;
  type: 'improvement' | 'maintenance' | 'warning' | 'celebration';
  category: 'biological' | 'emotional' | 'environmental' | 'financial' | 'overall';
  title: string;
  description: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: string;
  impact: number; // 1-10 scale
}

const MetricsInsights: React.FC<MetricsInsightsProps> = ({ ovrScore }) => {
  const generateInsights = (): Insight[] => {
    if (!ovrScore) return [];

    const insights: Insight[] = [];

    // Overall OVR insights
    if (ovrScore.overall < 70) {
      insights.push({
        id: '1',
        type: 'warning',
        category: 'overall',
        title: 'OVR Optimization Needed',
        description: 'Your overall alignment score is below optimal levels. Focus on the lowest scoring domains first.',
        action: 'Review domain breakdown',
        priority: 'high',
        estimatedTime: '5 min',
        impact: 8
      });
    } else if (ovrScore.overall >= 90) {
      insights.push({
        id: '2',
        type: 'celebration',
        category: 'overall',
        title: 'Elite Performance',
        description: 'Excellent! Your OVR is in the elite range. Maintain current practices and consider advanced optimization.',
        action: 'Explore advanced metrics',
        priority: 'low',
        estimatedTime: '2 min',
        impact: 3
      });
    }

    // Biological insights
    if (ovrScore.biological < 75) {
      insights.push({
        id: '3',
        type: 'improvement',
        category: 'biological',
        title: 'Recovery Optimization',
        description: 'Biological score suggests recovery needs attention. Consider sleep quality and stress management.',
        action: 'Start recovery session',
        priority: 'high',
        estimatedTime: '10 min',
        impact: 7
      });
    }

    // Emotional insights
    if (ovrScore.emotional < 70) {
      insights.push({
        id: '4',
        type: 'warning',
        category: 'emotional',
        title: 'Stress Management',
        description: 'Emotional score indicates elevated stress. Consider mindfulness or breathing exercises.',
        action: 'Begin stress relief',
        priority: 'critical',
        estimatedTime: '5 min',
        impact: 9
      });
    }

    // Environmental insights
    if (ovrScore.environmental < 80) {
      insights.push({
        id: '5',
        type: 'improvement',
        category: 'environmental',
        title: 'Environment Check',
        description: 'Environmental factors may be affecting your performance. Check air quality and comfort.',
        action: 'Assess environment',
        priority: 'medium',
        estimatedTime: '3 min',
        impact: 6
      });
    }

    // Financial insights
    if (ovrScore.financial < 70) {
      insights.push({
        id: '6',
        type: 'improvement',
        category: 'financial',
        title: 'Financial Health',
        description: 'Financial vitality needs attention. Review spending patterns and savings goals.',
        action: 'Review finances',
        priority: 'high',
        estimatedTime: '15 min',
        impact: 7
      });
    }

    // Positive trends
    if (ovrScore.change > 0) {
      insights.push({
        id: '7',
        type: 'celebration',
        category: 'overall',
        title: 'Positive Momentum',
        description: `Great progress! Your OVR increased by ${ovrScore.change} points today. Keep up the momentum!`,
        action: 'Continue current routine',
        priority: 'low',
        estimatedTime: '1 min',
        impact: 4
      });
    }

    return insights.slice(0, 3); // Show top 3 insights
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'improvement': return '#f59e0b';
      case 'maintenance': return '#7dd3fc';
      case 'warning': return '#ef4444';
      case 'celebration': return '#10b981';
      default: return '#7dd3fc';
    }
  };

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'improvement': return <TrendingUp size={16} color="#f59e0b" />;
      case 'maintenance': return <Target size={16} color="#7dd3fc" />;
      case 'warning': return <TrendingDown size={16} color="#ef4444" />;
      case 'celebration': return <CheckCircle size={16} color="#10b981" />;
      default: return <Zap size={16} color="#7dd3fc" />;
    }
  };

  const getPriorityColor = (priority: Insight['priority']) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#7dd3fc';
      case 'low': return '#10b981';
      default: return '#7dd3fc';
    }
  };

  const insights = generateInsights();

  if (insights.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={DesignSystem.gradients.accent} style={styles.background} />
        <View style={styles.content}>
          <View style={styles.emptyState}>
            <Zap size={24} color={DesignSystem.colors.primary.cyan} />
            <Text style={styles.emptyTitle}>All Systems Optimal</Text>
            <Text style={styles.emptyDescription}>
              Your metrics are performing well. Continue your current routine for sustained excellence.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={DesignSystem.gradients.accent} style={styles.background} />
      
      <View style={styles.content}>
        {insights.map((insight, index) => (
          <TouchableOpacity
            key={insight.id}
            style={[
              styles.insightCard,
              { borderColor: getInsightColor(insight.type) + '20' }
            ]}
            activeOpacity={0.8}
          >
            <View style={styles.insightHeader}>
              <View style={styles.insightTypeContainer}>
                {getInsightIcon(insight.type)}
                <Text style={[
                  styles.insightType,
                  { color: getInsightColor(insight.type) }
                ]}>
                  {insight.type.toUpperCase()}
                </Text>
              </View>
              <View style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(insight.priority) + '20' }
              ]}>
                <Text style={[
                  styles.priorityText,
                  { color: getPriorityColor(insight.priority) }
                ]}>
                  {insight.priority}
                </Text>
              </View>
            </View>
            
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightDescription}>{insight.description}</Text>
            
            <View style={styles.insightFooter}>
              <TouchableOpacity style={[
                styles.actionButton,
                { backgroundColor: getInsightColor(insight.type) + '20' }
              ]}>
                <Text style={[
                  styles.actionText,
                  { color: getInsightColor(insight.type) }
                ]}>
                  {insight.action}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.metadata}>
                <View style={styles.metadataItem}>
                  <Clock size={12} color={DesignSystem.colors.neutral.silver} />
                  <Text style={styles.metadataText}>{insight.estimatedTime}</Text>
                </View>
                <View style={styles.metadataItem}>
                  <Zap size={12} color={DesignSystem.colors.neutral.silver} />
                  <Text style={styles.metadataText}>Impact: {insight.impact}/10</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        {insights.length > 0 && (
          <View style={styles.viewAllContainer}>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Insights</Text>
            </TouchableOpacity>
          </View>
        )}
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: DesignSystem.spacing['3xl'],
  },
  emptyTitle: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading3,
    marginTop: DesignSystem.spacing.lg,
    marginBottom: DesignSystem.spacing.sm,
  },
  emptyDescription: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.body2,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  insightCard: {
    ...createGlassMorphism(0.06),
    borderRadius: DesignSystem.radius.xl,
    padding: DesignSystem.spacing.lg,
    marginBottom: DesignSystem.spacing.lg,
    borderWidth: 1,
    ...DesignSystem.shadows.soft,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  insightTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
  },
  insightType: {
    ...DesignSystem.typography.micro,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priorityBadge: {
    paddingHorizontal: DesignSystem.spacing.sm,
    paddingVertical: DesignSystem.spacing.xs,
    borderRadius: DesignSystem.radius.sm,
  },
  priorityText: {
    ...DesignSystem.typography.micro,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  insightTitle: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading3,
    marginBottom: DesignSystem.spacing.sm,
  },
  insightDescription: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.body2,
    lineHeight: 20,
    marginBottom: DesignSystem.spacing.lg,
  },
  insightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.radius.full,
  },
  actionText: {
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  metadata: {
    flexDirection: 'row',
    gap: DesignSystem.spacing.md,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
  },
  metadataText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    opacity: 0.8,
  },
  viewAllContainer: {
    alignItems: 'center',
    paddingTop: DesignSystem.spacing.lg,
  },
  viewAllButton: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.radius.full,
    backgroundColor: DesignSystem.colors.alpha[8],
    borderWidth: 1,
    borderColor: DesignSystem.colors.alpha[10],
  },
  viewAllText: {
    color: DesignSystem.colors.primary.cyan,
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
});

export default MetricsInsights;
