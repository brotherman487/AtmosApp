import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Target, Star, TrendingUp, Calendar, Award, Zap } from 'lucide-react-native';
import { OVRScore } from '../types/ovr';
import { DesignSystem, createGlassMorphism } from '../constants/design';

interface AchievementsPanelProps {
  ovrScore: OVRScore | null;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'ovr' | 'streak' | 'milestone' | 'weekly' | 'monthly';
  unlocked: boolean;
  progress?: number; // 0-100
  target?: number;
  current?: number;
  date?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ ovrScore }) => {
  const generateAchievements = (): Achievement[] => {
    if (!ovrScore) return [];

    const achievements: Achievement[] = [];

    // OVR-based achievements
    if (ovrScore.overall >= 90) {
      achievements.push({
        id: 'elite_ovr',
        title: 'Elite Performer',
        description: 'Achieved OVR score of 90+',
        icon: <Trophy size={16} color="#f59e0b" />,
        category: 'ovr',
        unlocked: true,
        date: new Date().toLocaleDateString(),
        rarity: 'legendary'
      });
    } else if (ovrScore.overall >= 80) {
      achievements.push({
        id: 'excellent_ovr',
        title: 'Excellent Alignment',
        description: 'Achieved OVR score of 80+',
        icon: <Star size={16} color="#10b981" />,
        category: 'ovr',
        unlocked: true,
        date: new Date().toLocaleDateString(),
        rarity: 'epic'
      });
    }

    // Progress achievements
    if (ovrScore.overall >= 70) {
      achievements.push({
        id: 'good_ovr',
        title: 'Good Standing',
        description: 'Achieved OVR score of 70+',
        icon: <Target size={16} color="#7dd3fc" />,
        category: 'ovr',
        unlocked: true,
        date: new Date().toLocaleDateString(),
        rarity: 'rare'
      });
    }

    // Streak achievements (mock data)
    achievements.push({
      id: 'weekly_streak',
      title: 'Weekly Warrior',
      description: 'Maintain OVR above 75 for 7 days',
      icon: <Calendar size={16} color="#a855f7" />,
      category: 'streak',
      unlocked: false,
      progress: 85,
      target: 7,
      current: 6,
      rarity: 'rare'
    });

    achievements.push({
      id: 'monthly_consistency',
      title: 'Monthly Master',
      description: 'Average OVR above 80 for 30 days',
      icon: <TrendingUp size={16} color="#f59e0b" />,
      category: 'monthly',
      unlocked: false,
      progress: 60,
      target: 30,
      current: 18,
      rarity: 'epic'
    });

    // Domain-specific achievements
    if (ovrScore.biological >= 85) {
      achievements.push({
        id: 'biological_expert',
        title: 'Biological Expert',
        description: 'Biological score reached 85+',
        icon: <Zap size={16} color="#a855f7" />,
        category: 'milestone',
        unlocked: true,
        date: new Date().toLocaleDateString(),
        rarity: 'rare'
      });
    }

    if (ovrScore.emotional >= 80) {
      achievements.push({
        id: 'emotional_master',
        title: 'Emotional Master',
        description: 'Emotional score reached 80+',
        icon: <Award size={16} color="#ef4444" />,
        category: 'milestone',
        unlocked: true,
        date: new Date().toLocaleDateString(),
        rarity: 'rare'
      });
    }

    if (ovrScore.environmental >= 90) {
      achievements.push({
        id: 'environmental_champion',
        title: 'Environmental Champion',
        description: 'Environmental score reached 90+',
        icon: <Star size={16} color="#10b981" />,
        category: 'milestone',
        unlocked: true,
        date: new Date().toLocaleDateString(),
        rarity: 'epic'
      });
    }

    if (ovrScore.financial >= 75) {
      achievements.push({
        id: 'financial_wizard',
        title: 'Financial Wizard',
        description: 'Financial score reached 75+',
        icon: <Trophy size={16} color="#f59e0b" />,
        category: 'milestone',
        unlocked: true,
        date: new Date().toLocaleDateString(),
        rarity: 'rare'
      });
    }

    // Improvement achievements
    if (ovrScore.change > 0) {
      achievements.push({
        id: 'daily_improvement',
        title: 'Daily Progress',
        description: `Improved OVR by ${ovrScore.change} points today`,
        icon: <TrendingUp size={16} color="#10b981" />,
        category: 'weekly',
        unlocked: true,
        date: new Date().toLocaleDateString(),
        rarity: 'common'
      });
    }

    return achievements;
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary': return '#f59e0b';
      case 'epic': return '#a855f7';
      case 'rare': return '#10b981';
      case 'common': return '#7dd3fc';
      default: return '#7dd3fc';
    }
  };

  const getRarityBackground = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary': return 'rgba(245, 158, 11, 0.15)';
      case 'epic': return 'rgba(168, 85, 247, 0.15)';
      case 'rare': return 'rgba(16, 185, 129, 0.15)';
      case 'common': return 'rgba(125, 211, 252, 0.15)';
      default: return 'rgba(125, 211, 252, 0.15)';
    }
  };

  const achievements = generateAchievements();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <View style={styles.container}>
      <LinearGradient colors={DesignSystem.gradients.accent} style={styles.background} />
      
      <View style={styles.content}>
        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Trophy size={20} color={DesignSystem.colors.primary.gold} />
            <Text style={styles.summaryNumber}>{unlockedCount}</Text>
            <Text style={styles.summaryLabel}>Unlocked</Text>
          </View>
          <View style={styles.summaryItem}>
            <Target size={20} color={DesignSystem.colors.primary.cyan} />
            <Text style={styles.summaryNumber}>{totalCount}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryItem}>
            <Star size={20} color={DesignSystem.colors.primary.emerald} />
            <Text style={styles.summaryNumber}>
              {Math.round((unlockedCount / totalCount) * 100)}%
            </Text>
            <Text style={styles.summaryLabel}>Progress</Text>
          </View>
        </View>

        {/* Achievements List */}
        <ScrollView 
          style={styles.achievementsList}
          showsVerticalScrollIndicator={false}
        >
          {achievements.map((achievement) => (
            <TouchableOpacity
              key={achievement.id}
              style={[
                styles.achievementCard,
                {
                  borderColor: getRarityColor(achievement.rarity) + '30',
                  backgroundColor: achievement.unlocked 
                    ? getRarityBackground(achievement.rarity)
                    : DesignSystem.colors.alpha[5],
                }
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.achievementHeader}>
                <View style={styles.achievementIcon}>
                  {achievement.icon}
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementTitle,
                    { color: achievement.unlocked ? DesignSystem.colors.neutral.pearl : DesignSystem.colors.neutral.silver }
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
                <View style={[
                  styles.rarityBadge,
                  { backgroundColor: getRarityColor(achievement.rarity) + '20' }
                ]}>
                  <Text style={[
                    styles.rarityText,
                    { color: getRarityColor(achievement.rarity) }
                  ]}>
                    {achievement.rarity}
                  </Text>
                </View>
              </View>

              {achievement.unlocked ? (
                <View style={styles.unlockedInfo}>
                  <Text style={styles.unlockedDate}>
                    Unlocked {achievement.date}
                  </Text>
                </View>
              ) : achievement.progress !== undefined && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${achievement.progress}%`,
                          backgroundColor: getRarityColor(achievement.rarity)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {achievement.current}/{achievement.target}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* View All Button */}
        <View style={styles.viewAllContainer}>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Achievements</Text>
          </TouchableOpacity>
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
    padding: DesignSystem.spacing['2xl'],
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: DesignSystem.spacing['2xl'],
    paddingBottom: DesignSystem.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.alpha[8],
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading2,
    fontWeight: '700',
    marginTop: DesignSystem.spacing.xs,
  },
  summaryLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    textTransform: 'uppercase',
    marginTop: DesignSystem.spacing.xs,
  },
  achievementsList: {
    maxHeight: 300,
  },
  achievementCard: {
    ...createGlassMorphism(0.06),
    borderRadius: DesignSystem.radius.lg,
    padding: DesignSystem.spacing.lg,
    marginBottom: DesignSystem.spacing.md,
    borderWidth: 1,
    ...DesignSystem.shadows.soft,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.sm,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DesignSystem.colors.alpha[10],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: DesignSystem.spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    ...DesignSystem.typography.caption,
    fontWeight: '600',
    marginBottom: DesignSystem.spacing.xs,
  },
  achievementDescription: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    lineHeight: 14,
  },
  rarityBadge: {
    paddingHorizontal: DesignSystem.spacing.sm,
    paddingVertical: DesignSystem.spacing.xs,
    borderRadius: DesignSystem.radius.sm,
  },
  rarityText: {
    ...DesignSystem.typography.micro,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  unlockedInfo: {
    alignItems: 'flex-end',
  },
  unlockedDate: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    opacity: 0.8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: DesignSystem.colors.alpha[8],
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    minWidth: 30,
    textAlign: 'right',
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

export default AchievementsPanel;
