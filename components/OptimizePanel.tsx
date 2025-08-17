import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Zap, Brain, Heart, Wind, DollarSign, TrendingUp, Target, Lightbulb, CheckCircle, Clock, Star, ArrowLeft } from 'lucide-react-native';
import { OVRScore } from '../types/ovr';
import { ovrService } from '../services/ovrService';
import { DesignSystem, createGlassMorphism } from '../constants/design';
import { hapticFeedback } from '../utils/haptics';

const { width } = Dimensions.get('window');

interface OptimizationRecommendation {
  id: string;
  domain: 'biological' | 'emotional' | 'environmental' | 'financial';
  title: string;
  description: string;
  impact: number; // Expected OVR improvement
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: string;
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
}

interface OptimizePanelProps {
  ovrScore: OVRScore;
  onClose: () => void;
}

const OptimizePanel: React.FC<OptimizePanelProps> = ({ ovrScore, onClose }) => {
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);


  useEffect(() => {
    generateRecommendations();
  }, [ovrScore]);

  const generateRecommendations = () => {
    const mockRecommendations: OptimizationRecommendation[] = [
      // Biological optimizations
      {
        id: 'bio-1',
        domain: 'biological',
        title: 'Optimize Sleep Schedule',
        description: 'Your sleep debt is affecting recovery. Aim for 7-9 hours with consistent bedtime.',
        impact: 3.2,
        difficulty: 'medium',
        timeRequired: '1 week',
        priority: 'high'
      },
      {
        id: 'bio-2',
        domain: 'biological',
        title: 'Hydration Boost',
        description: 'Increase water intake by 500ml daily to improve cellular function.',
        impact: 1.8,
        difficulty: 'easy',
        timeRequired: 'Immediate',
        priority: 'medium'
      },
      {
        id: 'bio-3',
        domain: 'biological',
        title: 'Stress Management',
        description: 'Practice 10-minute breathing exercises twice daily.',
        impact: 2.5,
        difficulty: 'easy',
        timeRequired: '2 weeks',
        priority: 'high'
      },
      // Emotional optimizations
      {
        id: 'emo-1',
        domain: 'emotional',
        title: 'Social Connection',
        description: 'Schedule 2 meaningful conversations this week.',
        impact: 2.1,
        difficulty: 'easy',
        timeRequired: '1 week',
        priority: 'medium'
      },
      {
        id: 'emo-2',
        domain: 'emotional',
        title: 'Gratitude Practice',
        description: 'Write down 3 things you\'re grateful for daily.',
        impact: 1.5,
        difficulty: 'easy',
        timeRequired: '2 weeks',
        priority: 'low'
      },
      // Environmental optimizations
      {
        id: 'env-1',
        domain: 'environmental',
        title: 'Air Quality Optimization',
        description: 'Your air quality is excellent. Maintain current levels.',
        impact: 0.5,
        difficulty: 'easy',
        timeRequired: 'Ongoing',
        priority: 'low'
      },
      {
        id: 'env-2',
        domain: 'environmental',
        title: 'Natural Light Exposure',
        description: 'Spend 30 minutes outdoors in natural light daily.',
        impact: 1.2,
        difficulty: 'easy',
        timeRequired: '1 week',
        priority: 'medium'
      },
      // Financial optimizations
      {
        id: 'fin-1',
        domain: 'financial',
        title: 'Emergency Fund',
        description: 'Increase emergency savings by $500 this month.',
        impact: 2.8,
        difficulty: 'medium',
        timeRequired: '1 month',
        priority: 'high'
      },
      {
        id: 'fin-2',
        domain: 'financial',
        title: 'Investment Review',
        description: 'Review and rebalance your investment portfolio.',
        impact: 1.9,
        difficulty: 'hard',
        timeRequired: '2 weeks',
        priority: 'medium'
      }
    ];

    setRecommendations(mockRecommendations);
  };

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'biological': return <Brain size={20} color="#a855f7" />;
      case 'emotional': return <Heart size={20} color="#ef4444" />;
      case 'environmental': return <Wind size={20} color="#10b981" />;
      case 'financial': return <DollarSign size={20} color="#f59e0b" />;
      default: return <Zap size={20} color="#7dd3fc" />;
    }
  };

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'biological': return '#a855f7';
      case 'emotional': return '#ef4444';
      case 'environmental': return '#10b981';
      case 'financial': return '#f59e0b';
      default: return '#7dd3fc';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#7dd3fc';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#7dd3fc';
    }
  };

  const totalPotentialImpact = recommendations.reduce((sum, rec) => sum + rec.impact, 0);

     const renderRecommendation = (recommendation: OptimizationRecommendation) => (
     <TouchableOpacity 
       key={recommendation.id} 
       style={styles.recommendationCard}
       onPress={() => {
         hapticFeedback.light();
         Alert.alert(
           recommendation.title,
           `${recommendation.description}\n\nImpact: +${recommendation.impact.toFixed(1)} OVR\nDifficulty: ${recommendation.difficulty}\nTime Required: ${recommendation.timeRequired}`,
           [
             { text: 'Close', style: 'cancel' },
             { 
               text: 'Start Now', 
               onPress: () => {
                 hapticFeedback.success();
                 Alert.alert(
                   'Optimization Started',
                   `You've started working on: ${recommendation.title}`,
                   [{ text: 'OK' }]
                 );
               }
             }
           ]
         );
       }}
       activeOpacity={0.9}
     >
      <View style={styles.recommendationHeader}>
        <View style={styles.recommendationTitleRow}>
          {getDomainIcon(recommendation.domain)}
          <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
        </View>
        <View style={styles.recommendationMeta}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(recommendation.priority) + '20' }]}>
            <Text style={[styles.priorityText, { color: getPriorityColor(recommendation.priority) }]}>
              {recommendation.priority.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.recommendationDescription}>{recommendation.description}</Text>

      <View style={styles.recommendationStats}>
        <View style={styles.statItem}>
          <TrendingUp size={14} color="#10b981" />
          <Text style={styles.statText}>+{recommendation.impact.toFixed(1)} OVR</Text>
        </View>
        <View style={styles.statItem}>
          <Target size={14} color={getDifficultyColor(recommendation.difficulty)} />
          <Text style={[styles.statText, { color: getDifficultyColor(recommendation.difficulty) }]}>
            {recommendation.difficulty}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Clock size={14} color="#7dd3fc" />
          <Text style={styles.statText}>{recommendation.timeRequired}</Text>
        </View>
      </View>

             <TouchableOpacity 
         style={styles.actionButton} 
         onPress={() => {
           hapticFeedback.light();
           Alert.alert(
             'Start Optimization',
             `Begin "${recommendation.title}" optimization?`,
             [
               { text: 'Cancel', style: 'cancel' },
               { 
                 text: 'Start', 
                 onPress: () => {
                   hapticFeedback.success();
                   Alert.alert(
                     'Optimization Started',
                     `You've started working on: ${recommendation.title}`,
                     [{ text: 'OK' }]
                   );
                 }
               }
             ]
           );
         }}
         activeOpacity={0.7}
       >
                  <Text style={styles.actionButtonText}>Start Optimization</Text>
       </TouchableOpacity>
     </TouchableOpacity>
   );

  return (
    <LinearGradient colors={['#0a0a0a', '#161616', '#2a2a2a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
                 {/* Header */}
         <View style={styles.header}>
           <TouchableOpacity 
             style={styles.backButton} 
             onPress={() => {
               hapticFeedback.light();
               onClose();
             }} 
             activeOpacity={0.7}
           >
             <ArrowLeft size={24} color={DesignSystem.colors.primary.cyan} />
           </TouchableOpacity>
         </View>

                 {/* Recommendations */}
         <ScrollView style={styles.recommendationsList} showsVerticalScrollIndicator={false}>
           <View style={styles.recommendationsHeader}>
             <Lightbulb size={24} color={DesignSystem.colors.primary.cyan} />
             <Text style={styles.recommendationsTitle}>
               Personalized Recommendations ({recommendations.length})
             </Text>
           </View>

                     {recommendations.map(renderRecommendation)}

          {/* Quick Wins Section */}
          <View style={styles.quickWinsSection}>
            <View style={styles.quickWinsHeader}>
              <Star size={20} color="#f59e0b" />
              <Text style={styles.quickWinsTitle}>Quick Wins</Text>
            </View>
            <Text style={styles.quickWinsDescription}>
              Start with these easy optimizations for immediate impact on your OVR score.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: Platform.OS === 'ios' ? 16 : 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backButton: {
    padding: 4,
  },
  recommendationsList: {
    flex: 1,
    paddingHorizontal: Platform.OS === 'ios' ? 16 : 12,
    paddingTop: Platform.OS === 'ios' ? 4 : 2,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Platform.OS === 'ios' ? 12 : 10,
    marginBottom: Platform.OS === 'ios' ? 12 : 10,
    paddingVertical: Platform.OS === 'ios' ? 6 : 4,
  },
  recommendationsTitle: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading3,
    fontWeight: '600',
  },
  recommendationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: Platform.OS === 'ios' ? 18 : 16,
    marginBottom: Platform.OS === 'ios' ? 12 : 10,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Platform.OS === 'ios' ? 16 : 12,
  },
  recommendationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Platform.OS === 'ios' ? 10 : 8,
    flex: 1,
  },
  recommendationTitle: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading1,
    fontWeight: '600',
    flex: 1,
  },
  recommendationMeta: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: DesignSystem.radius.sm,
  },
  priorityText: {
    ...DesignSystem.typography.micro,
    fontWeight: '600',
  },
  recommendationDescription: {
    color: DesignSystem.colors.neutral.platinum,
    fontSize: Platform.OS === 'ios' ? 15 : 14,
    fontFamily: 'Inter-Regular',
    lineHeight: Platform.OS === 'ios' ? 22 : 20,
    marginBottom: Platform.OS === 'ios' ? 16 : 14,
  },
  recommendationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Platform.OS === 'ios' ? 16 : 14,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Platform.OS === 'ios' ? 6 : 4,
  },
  statText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.caption,
  },
  actionButton: {
    backgroundColor: DesignSystem.colors.primary.cyan,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#7dd3fc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#000',
    ...DesignSystem.typography.body2,
    fontWeight: '600',
  },
  quickWinsSection: {
    marginTop: Platform.OS === 'ios' ? 20 : 16,
    marginBottom: Platform.OS === 'ios' ? 24 : 20,
    padding: Platform.OS === 'ios' ? 16 : 14,
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.15)',
  },
  quickWinsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Platform.OS === 'ios' ? 10 : 8,
    marginBottom: Platform.OS === 'ios' ? 12 : 8,
  },
  quickWinsTitle: {
    color: '#f59e0b',
    ...DesignSystem.typography.heading1,
    fontWeight: '600',
  },
  quickWinsDescription: {
    color: DesignSystem.colors.neutral.platinum,
    ...DesignSystem.typography.body2,
    lineHeight: Platform.OS === 'ios' ? 22 : 20,
  },
});

export default OptimizePanel;
