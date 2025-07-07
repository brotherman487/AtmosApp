import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Calendar, Award, Zap, Sun, Moon, Wind, Activity, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const RhythmScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [animations] = useState({
    pulse: new Animated.Value(1),
    glow: new Animated.Value(0.3),
  });

  const rhythmData = {
    currentScore: 87,
    trend: '+15%',
    weeklyData: [72, 78, 75, 82, 89, 87, 91],
    insights: [
      {
        title: 'Peak Flow State',
        description: 'Your energy peaks between 9-11 AM',
        icon: <Sun size={18} color="#f59e0b" strokeWidth={1.5} />,
        suggestion: 'Schedule deep work during this golden window',
        color: '#f59e0b'
      },
      {
        title: 'Optimal Environment',
        description: 'You thrive in spaces with <35dB noise',
        icon: <Wind size={18} color="#7dd3fc" strokeWidth={1.5} />,
        suggestion: 'Seek quiet sanctuaries for focused tasks',
        color: '#7dd3fc'
      },
      {
        title: 'Recovery Rhythm',
        description: 'Best restoration happens after 7 PM',
        icon: <Moon size={18} color="#a78bfa" strokeWidth={1.5} />,
        suggestion: 'Honor evening stillness with gentle practices',
        color: '#a78bfa'
      }
    ]
  };

  const achievements = [
    { name: 'Morning Ritual', description: '14-day streak', icon: '🌅', unlocked: true, color: '#f59e0b' },
    { name: 'Air Awareness', description: 'Tracked 45 days', icon: '🌬️', unlocked: true, color: '#7dd3fc' },
    { name: 'Rhythm Sync', description: 'Optimal timing 7 days', icon: '🎵', unlocked: true, color: '#10b981' },
    { name: 'Global Wanderer', description: 'Synced in 5 cities', icon: '🌍', unlocked: false, color: '#a78bfa' },
    { name: 'Zen Master', description: 'Perfect week achieved', icon: '🧘', unlocked: false, color: '#f472b6' },
    { name: 'Nature Seeker', description: 'Found 10 calm zones', icon: '🌲', unlocked: false, color: '#10b981' }
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    // Gentle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.pulse, {
          toValue: 1.03,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.pulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.glow, {
          toValue: 0.8,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(animations.glow, {
          toValue: 0.3,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    if (score >= 50) return '#f97316';
    return '#ef4444';
  };

  const renderWeeklyChart = () => {
    const maxScore = Math.max(...rhythmData.weeklyData);
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartBars}>
          {rhythmData.weeklyData.map((score, index) => (
            <Animated.View 
              key={index} 
              style={[
                styles.barContainer,
                { transform: [{ scale: animations.pulse }] }
              ]}
            >
              <View
                style={[
                  styles.bar,
                  {
                    height: (score / maxScore) * 100,
                    backgroundColor: getScoreColor(score)
                  }
                ]}
              />
              <Text style={styles.barLabel}>{weekDays[index]}</Text>
              <Text style={styles.barValue}>{score}</Text>
            </Animated.View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#0f0f23', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Metrics</Text>
          <Text style={styles.subtitle}>Your harmony with the world</Text>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Current Score */}
          <Animated.View 
            style={[
              styles.scoreCard,
              { transform: [{ scale: animations.pulse }] }
            ]}
          >
            <Animated.View
              style={[
                styles.scoreGlow,
                {
                  opacity: animations.glow,
                  shadowColor: getScoreColor(rhythmData.currentScore),
                }
              ]}
            />
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreValue, { color: getScoreColor(rhythmData.currentScore) }]}>
                {rhythmData.currentScore}
              </Text>
              <View style={styles.scoreInfo}>
                <Text style={styles.scoreLabel}>Rhythm Score</Text>
                <View style={styles.trendContainer}>
                  <TrendingUp size={14} color="#10b981" strokeWidth={1.5} />
                  <Text style={[styles.trendText, { color: '#10b981' }]}>
                    {rhythmData.trend} this week
                  </Text>
                </View>
                <Text style={styles.scoreDescription}>Excellent harmony</Text>
              </View>
            </View>
          </Animated.View>

          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {['week', 'month', 'year'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Weekly Chart */}
          {selectedPeriod === 'week' && renderWeeklyChart()}

          {/* Rhythm Insights */}
          <View style={styles.insightsContainer}>
            <Text style={styles.sectionTitle}>Rhythm Insights</Text>
            {rhythmData.insights.map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <View style={[styles.insightIcon, { backgroundColor: `${insight.color}20` }]}>
                    {insight.icon}
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                    <Text style={styles.insightDescription}>{insight.description}</Text>
                  </View>
                </View>
                <Text style={[styles.insightSuggestion, { color: insight.color }]}>
                  {insight.suggestion}
                </Text>
              </View>
            ))}
          </View>

          {/* Achievements */}
          <View style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>Rhythm Symbols</Text>
            <View style={styles.achievementGrid}>
              {achievements.map((achievement, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.achievementCard,
                    !achievement.unlocked && styles.achievementCardLocked,
                    { transform: [{ scale: achievement.unlocked ? animations.pulse : 1 }] }
                  ]}
                >
                  {achievement.unlocked && (
                    <Animated.View
                      style={[
                        styles.achievementGlow,
                        {
                          opacity: animations.glow,
                          shadowColor: achievement.color,
                        }
                      ]}
                    />
                  )}
                  <Text style={[
                    styles.achievementIcon,
                    !achievement.unlocked && styles.achievementIconLocked
                  ]}>
                    {achievement.icon}
                  </Text>
                  <Text style={[
                    styles.achievementName,
                    !achievement.unlocked && styles.achievementNameLocked
                  ]}>
                    {achievement.name}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    !achievement.unlocked && styles.achievementDescriptionLocked
                  ]}>
                    {achievement.description}
                  </Text>
                  {achievement.unlocked && (
                    <View style={[styles.achievementBadge, { backgroundColor: achievement.color }]}>
                      <Award size={10} color="#ffffff" strokeWidth={1.5} />
                    </View>
                  )}
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Rhythm Adjustments */}
          <View style={styles.suggestionsContainer}>
            <Text style={styles.sectionTitle}>Rhythm Adjustments</Text>
            
            <View style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Target size={18} color="#f59e0b" strokeWidth={1.5} />
                <Text style={styles.suggestionTitle}>Optimize Focus Time</Text>
              </View>
              <Text style={styles.suggestionText}>
                Your peak performance window is 9-11 AM. Consider moving important decisions to this time.
              </Text>
            </View>
            
            <View style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Activity size={18} color="#7dd3fc" strokeWidth={1.5} />
                <Text style={styles.suggestionTitle}>Movement Rhythm</Text>
              </View>
              <Text style={styles.suggestionText}>
                Your body craves gentle movement around 3 PM. A mindful walk could boost your evening energy.
              </Text>
            </View>

            <View style={styles.suggestionCard}>
              <View style={styles.suggestionHeader}>
                <Calendar size={18} color="#a78bfa" strokeWidth={1.5} />
                <Text style={styles.suggestionTitle}>Weekly Pattern</Text>
              </View>
              <Text style={styles.suggestionText}>
                Sundays show lower rhythm scores. Consider gentle preparation rituals for the week ahead.
              </Text>
            </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Light',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 28,
    borderRadius: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  scoreGlow: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 28,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 15,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 56,
    fontFamily: 'Inter-Bold',
    marginRight: 24,
    letterSpacing: -2,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  trendText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
    letterSpacing: 0.1,
  },
  scoreDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.2,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 30,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  periodButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  periodButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.2,
  },
  periodButtonTextActive: {
    color: '#ffffff',
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 24,
    borderRadius: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 12,
    marginBottom: 8,
    minHeight: 20,
  },
  barLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  barValue: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.1,
  },
  insightsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  insightDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.1,
  },
  insightSuggestion: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    fontStyle: 'italic',
    letterSpacing: 0.1,
  },
  achievementsContainer: {
    marginBottom: 30,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - 52) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
    overflow: 'hidden',
  },
  achievementCardLocked: {
    opacity: 0.4,
  },
  achievementGlow: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  achievementIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  achievementIconLocked: {
    opacity: 0.5,
  },
  achievementName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  achievementNameLocked: {
    opacity: 0.5,
  },
  achievementDescription: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  achievementDescriptionLocked: {
    opacity: 0.4,
  },
  achievementBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsContainer: {
    marginBottom: 40,
  },
  suggestionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginLeft: 10,
    letterSpacing: -0.2,
  },
  suggestionText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});

export default RhythmScreen;