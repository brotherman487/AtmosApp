import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, TrendingUp, TrendingDown, Crown, Medal, Award, Trophy, Star, Calendar, Users, Zap, ArrowLeft } from 'lucide-react-native';
import { DesignSystem, createGlassMorphism } from '../constants/design';

const { width } = Dimensions.get('window');

interface Friend {
  id: string;
  name: string;
  ovrScore: number;
  rank: number;
  change: number;
  avatar?: string;
  isUser: boolean;
  subScores: {
    biological: number;
    emotional: number;
    environmental: number;
    financial: number;
  };
  streak?: number;
  badges?: string[];
}

interface FriendLeaderboardFullProps {
  visible: boolean;
  onClose: () => void;
  friends: Friend[];
  userRank: number;
  userOVR: number;
}

type TimeRange = 'daily' | 'weekly' | 'monthly';

const FriendLeaderboardFull: React.FC<FriendLeaderboardFullProps> = ({
  visible,
  onClose,
  friends,
  userRank,
  userOVR,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('weekly');
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const timeRanges = [
    { key: 'daily', label: 'Today', icon: <Calendar size={16} color={DesignSystem.colors.neutral.silver} /> },
    { key: 'weekly', label: 'This Week', icon: <Calendar size={16} color={DesignSystem.colors.neutral.silver} /> },
    { key: 'monthly', label: 'This Month', icon: <Calendar size={16} color={DesignSystem.colors.neutral.silver} /> },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#059669';
    if (score >= 70) return '#f59e0b';
    if (score >= 60) return '#f97316';
    if (score >= 50) return '#ef4444';
    return '#dc2626';
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown size={20} color="#fbbf24" strokeWidth={2} />;
      case 2: return <Medal size={20} color="#94a3b8" strokeWidth={2} />;
      case 3: return <Award size={20} color="#d97706" strokeWidth={2} />;
      default: return null;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={14} color="#10b981" />;
    if (change < 0) return <TrendingDown size={14} color="#ef4444" />;
    return null;
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'weekly_top': return <Trophy size={12} color="#fbbf24" />;
      case 'streak_7': return <Zap size={12} color="#10b981" />;
      case 'improvement': return <Star size={12} color="#a78bfa" />;
      default: return null;
    }
  };

  const renderFriendRow = (friend: Friend, index: number) => {
    const isSelected = selectedFriend === friend.id;
    const isUser = friend.isUser;
    
    return (
      <TouchableOpacity
        key={friend.id}
        style={[
          styles.friendRow,
          isSelected && styles.friendRowSelected,
          isUser && styles.userRow
        ]}
        onPress={() => setSelectedFriend(isSelected ? null : friend.id)}
        activeOpacity={0.8}
      >
        <View style={styles.rankSection}>
          {getRankIcon(friend.rank)}
          <Text style={[styles.rankText, { color: isUser ? DesignSystem.colors.primary.cyan : DesignSystem.colors.neutral.silver }]}>
            #{friend.rank}
          </Text>
        </View>
        
        <View style={styles.friendInfo}>
          <View style={styles.friendHeader}>
            <Text style={[styles.friendName, { color: isUser ? DesignSystem.colors.neutral.pearl : DesignSystem.colors.neutral.platinum }]}>
              {friend.name}
            </Text>
            {friend.badges && friend.badges.length > 0 && (
              <View style={styles.badgesContainer}>
                {friend.badges.map((badge, badgeIndex) => (
                  <View key={badgeIndex} style={styles.badge}>
                    {getBadgeIcon(badge)}
                  </View>
                ))}
              </View>
            )}
          </View>
          
          {isSelected && (
            <View style={styles.subScoresRow}>
              <View style={styles.subScore}>
                <Text style={styles.subScoreLabel}>Bio</Text>
                <Text style={[styles.subScoreValue, { color: '#10b981' }]}>
                  {friend.subScores.biological}
                </Text>
              </View>
              <View style={styles.subScore}>
                <Text style={styles.subScoreLabel}>Emo</Text>
                <Text style={[styles.subScoreValue, { color: '#3b82f6' }]}>
                  {friend.subScores.emotional}
                </Text>
              </View>
              <View style={styles.subScore}>
                <Text style={styles.subScoreLabel}>Env</Text>
                <Text style={[styles.subScoreValue, { color: '#f59e0b' }]}>
                  {friend.subScores.environmental}
                </Text>
              </View>
              <View style={styles.subScore}>
                <Text style={styles.subScoreLabel}>Fin</Text>
                <Text style={[styles.subScoreValue, { color: '#ef4444' }]}>
                  {friend.subScores.financial}
                </Text>
              </View>
            </View>
          )}
          
          {friend.streak && friend.streak > 1 && (
            <View style={styles.streakContainer}>
              <Zap size={12} color="#fbbf24" />
              <Text style={styles.streakText}>{friend.streak} day streak</Text>
            </View>
          )}
        </View>
        
        <View style={styles.scoreSection}>
          <Text style={[styles.ovrScore, { color: getScoreColor(friend.ovrScore) }]}>
            {friend.ovrScore}
          </Text>
          {friend.change !== 0 && (
            <View style={styles.changeIndicator}>
              {getChangeIcon(friend.change)}
              <Text style={[styles.changeText, { color: friend.change > 0 ? '#10b981' : '#ef4444' }]}>
                {Math.abs(friend.change)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <LinearGradient colors={['#0a0a0a', '#161616', '#2a2a2a']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <ArrowLeft size={24} color={DesignSystem.colors.primary.cyan} />
            </TouchableOpacity>
          </View>

          {/* Time Range Selector */}
          <View style={styles.timeRangeContainer}>
            {timeRanges.map((range) => (
              <TouchableOpacity
                key={range.key}
                style={[
                  styles.timeRangeButton,
                  selectedTimeRange === range.key && styles.timeRangeButtonActive
                ]}
                onPress={() => setSelectedTimeRange(range.key as TimeRange)}
                activeOpacity={0.8}
              >
                {range.icon}
                <Text style={[
                  styles.timeRangeText,
                  selectedTimeRange === range.key && styles.timeRangeTextActive
                ]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* User Position Summary */}
          <View style={styles.userSummary}>
            <View style={styles.userSummaryContent}>
              <Text style={styles.userSummaryLabel}>Your Position</Text>
              <Text style={styles.userSummaryRank}>#{userRank}</Text>
              <Text style={[styles.userSummaryScore, { color: getScoreColor(userOVR) }]}>
                {userOVR} OVR
              </Text>
            </View>
          </View>

          {/* Leaderboard */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.leaderboardContainer}>
              {friends.map((friend, index) => renderFriendRow(friend, index))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
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
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 28 : DesignSystem.spacing.md,
    paddingBottom: DesignSystem.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.alpha[8],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  title: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading2,
    fontWeight: '600',
  },
  backButton: {
    ...createGlassMorphism(0.08),
    width: 40,
    height: 40,
    borderRadius: DesignSystem.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.md,
    gap: DesignSystem.spacing.sm,
  },
  timeRangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.radius.lg,
    backgroundColor: DesignSystem.colors.alpha[5],
    borderWidth: 1,
    borderColor: DesignSystem.colors.alpha[8],
  },
  timeRangeButtonActive: {
    backgroundColor: `rgba(125, 211, 252, 0.1)`,
    borderColor: `rgba(125, 211, 252, 0.3)`,
  },
  timeRangeText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.caption,
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: DesignSystem.colors.primary.cyan,
  },
  userSummary: {
    marginHorizontal: DesignSystem.spacing.lg,
    marginBottom: DesignSystem.spacing.lg,
  },
  userSummaryContent: {
    ...createGlassMorphism(0.08),
    padding: DesignSystem.spacing.lg,
    borderRadius: DesignSystem.radius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `rgba(125, 211, 252, 0.2)`,
  },
  userSummaryLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.caption,
    marginBottom: DesignSystem.spacing.xs,
  },
  userSummaryRank: {
    color: DesignSystem.colors.primary.cyan,
    ...DesignSystem.typography.heading1,
    fontWeight: '700',
    marginBottom: DesignSystem.spacing.xs,
  },
  userSummaryScore: {
    ...DesignSystem.typography.heading3,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  leaderboardContainer: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingBottom: DesignSystem.spacing['2xl'],
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DesignSystem.spacing.md,
    paddingHorizontal: DesignSystem.spacing.md,
    borderRadius: DesignSystem.radius.lg,
    backgroundColor: DesignSystem.colors.alpha[5],
    marginBottom: DesignSystem.spacing.sm,
    borderWidth: 1,
    borderColor: DesignSystem.colors.alpha[8],
  },
  friendRowSelected: {
    backgroundColor: DesignSystem.colors.alpha[8],
    borderColor: DesignSystem.colors.alpha[15],
  },
  userRow: {
    backgroundColor: `rgba(125, 211, 252, 0.1)`,
    borderColor: `rgba(125, 211, 252, 0.3)`,
  },
  rankSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
    width: 50,
  },
  rankText: {
    ...DesignSystem.typography.body2,
    fontWeight: '600',
  },
  friendInfo: {
    flex: 1,
    marginLeft: DesignSystem.spacing.md,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendName: {
    ...DesignSystem.typography.body1,
    fontWeight: '500',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: DesignSystem.spacing.xs,
  },
  badge: {
    backgroundColor: DesignSystem.colors.alpha[8],
    padding: 4,
    borderRadius: DesignSystem.radius.sm,
  },
  subScoresRow: {
    flexDirection: 'row',
    gap: DesignSystem.spacing.md,
    marginTop: DesignSystem.spacing.sm,
  },
  subScore: {
    alignItems: 'center',
  },
  subScoreLabel: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
    marginBottom: 2,
  },
  subScoreValue: {
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
    marginTop: DesignSystem.spacing.xs,
  },
  streakText: {
    color: '#fbbf24',
    ...DesignSystem.typography.micro,
    fontWeight: '500',
  },
  scoreSection: {
    alignItems: 'flex-end',
    gap: DesignSystem.spacing.xs,
  },
  ovrScore: {
    ...DesignSystem.typography.heading2,
    fontWeight: '700',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeText: {
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
});

export default FriendLeaderboardFull;
