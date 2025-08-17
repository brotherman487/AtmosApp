import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Crown, Medal, Award, ChevronRight, Users } from 'lucide-react-native';
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
}

interface FriendLeaderboardCardProps {
  friends: Friend[];
  userRank: number;
  userOVR: number;
  onPress: () => void;
  style?: any;
}

const FriendLeaderboardCard: React.FC<FriendLeaderboardCardProps> = ({
  friends,
  userRank,
  userOVR,
  onPress,
  style,
}) => {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

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
      case 1: return <Crown size={16} color="#fbbf24" strokeWidth={2} />;
      case 2: return <Medal size={16} color="#94a3b8" strokeWidth={2} />;
      case 3: return <Award size={16} color="#d97706" strokeWidth={2} />;
      default: return null;
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={12} color="#10b981" />;
    if (change < 0) return <TrendingDown size={12} color="#ef4444" />;
    return null;
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
          <Text style={[styles.friendName, { color: isUser ? DesignSystem.colors.neutral.pearl : DesignSystem.colors.neutral.platinum }]}>
            {friend.name}
          </Text>
          {isSelected && (
            <View style={styles.subScoresRow}>
              <View style={styles.subScore}>
                <Text style={[styles.subScoreText, { color: '#10b981' }]}>
                  {friend.subScores.biological}
                </Text>
              </View>
              <View style={styles.subScore}>
                <Text style={[styles.subScoreText, { color: '#3b82f6' }]}>
                  {friend.subScores.emotional}
                </Text>
              </View>
              <View style={styles.subScore}>
                <Text style={[styles.subScoreText, { color: '#f59e0b' }]}>
                  {friend.subScores.financial}
                </Text>
              </View>
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
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.9}>
      <LinearGradient colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']} style={styles.background} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Users size={20} color={DesignSystem.colors.primary.cyan} strokeWidth={1.5} />
          <Text style={styles.title}>Friends Ranking</Text>
        </View>
        <ChevronRight size={16} color={DesignSystem.colors.neutral.silver} />
      </View>

      <View style={styles.content}>
        {friends.slice(0, 3).map((friend, index) => renderFriendRow(friend, index))}
        
        {userRank > 3 && (
          <View style={styles.userPosition}>
            <Text style={styles.userPositionText}>
              Your position: #{userRank}
            </Text>
          </View>
        )}
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
    borderRadius: DesignSystem.radius.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  title: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading3,
    fontWeight: '600',
  },
  content: {
    gap: DesignSystem.spacing.sm,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DesignSystem.spacing.sm,
    paddingHorizontal: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.radius.md,
    backgroundColor: DesignSystem.colors.alpha[5],
  },
  friendRowSelected: {
    backgroundColor: DesignSystem.colors.alpha[8],
    borderWidth: 1,
    borderColor: DesignSystem.colors.alpha[15],
  },
  userRow: {
    backgroundColor: `rgba(125, 211, 252, 0.1)`,
    borderWidth: 1,
    borderColor: `rgba(125, 211, 252, 0.2)`,
  },
  rankSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.xs,
    width: 40,
  },
  rankText: {
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  friendInfo: {
    flex: 1,
    marginLeft: DesignSystem.spacing.sm,
  },
  friendName: {
    ...DesignSystem.typography.body2,
    fontWeight: '500',
  },
  subScoresRow: {
    flexDirection: 'row',
    gap: DesignSystem.spacing.sm,
    marginTop: DesignSystem.spacing.xs,
  },
  subScore: {
    backgroundColor: DesignSystem.colors.alpha[8],
    paddingHorizontal: DesignSystem.spacing.xs,
    paddingVertical: 2,
    borderRadius: DesignSystem.radius.sm,
  },
  subScoreText: {
    ...DesignSystem.typography.micro,
    fontWeight: '600',
  },
  scoreSection: {
    alignItems: 'flex-end',
    gap: DesignSystem.spacing.xs,
  },
  ovrScore: {
    ...DesignSystem.typography.heading3,
    fontWeight: '700',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  changeText: {
    ...DesignSystem.typography.micro,
    fontWeight: '600',
  },
  userPosition: {
    alignItems: 'center',
    paddingTop: DesignSystem.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: DesignSystem.colors.alpha[8],
  },
  userPositionText: {
    color: DesignSystem.colors.primary.cyan,
    ...DesignSystem.typography.caption,
    fontWeight: '500',
  },
});

export default FriendLeaderboardCard;
