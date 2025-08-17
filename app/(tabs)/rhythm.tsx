import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, Activity, ChevronRight, Trophy, Target, Zap, Clock } from 'lucide-react-native';
import { hapticFeedback } from '../../utils/haptics';
import { OVRScore, OVRBreakdown } from '../../types/ovr';
import { AtmosAge } from '../../types';
import { ovrService } from '../../services/ovrService';
import { wearableService } from '../../services/wearableService';
import { atmosAgeService } from '../../services/atmosAgeService';
import { DesignSystem, createGlassMorphism } from '../../constants/design';
import {
  OVRHeroCard,
  OVRTrendChart,
  SubScoreTrends,
  LiveMetricsPanel,
  MetricsInsights,
  AchievementsPanel,
  FriendLeaderboardCard,
  AtmosAgeCard
} from '../../components';

const { width } = Dimensions.get('window');

const RhythmScreen = () => {
  const [currentOVR, setCurrentOVR] = useState<OVRScore | null>(null);
  const [ovrBreakdown, setOvrBreakdown] = useState<OVRBreakdown | null>(null);
  const [currentAtmosAge, setCurrentAtmosAge] = useState<AtmosAge | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [selectedSubScore, setSelectedSubScore] = useState<'biological' | 'emotional' | 'environmental' | 'financial'>('biological');
  const [showDetailedChart, setShowDetailedChart] = useState(false);
  const [showAtmosAgeDetails, setShowAtmosAgeDetails] = useState(false);

  useEffect(() => {
    loadOVRData();
    const unsubscribe = wearableService.subscribe(() => {
      // Refresh OVR when sensor data changes
      loadOVRData();
    });
    
    return unsubscribe;
  }, []);

  const loadOVRData = async () => {
    try {
      const ovrData = await ovrService.getCurrentOVR();
      const breakdown = await ovrService.getOVRBreakdown();
      setCurrentOVR(ovrData);
      setOvrBreakdown(breakdown);
      
      // Load Atmos Age data
      if (ovrData) {
        const mockSensorData = {
          timestamp: Date.now(),
          heartRate: 72,
          skinTemperature: 36.8,
          stressIndex: 45,
          airQuality: 85,
          movement: 65,
          sleepQuality: 82,
          moodScore: 78,
        };
        const atmosAge = await atmosAgeService.calculateAtmosAge(ovrData, mockSensorData);
        setCurrentAtmosAge(atmosAge);
      }
    } catch (error) {
      console.error('Error loading OVR data:', error);
    }
  };

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

  const timeframes = [
    { key: 'day', label: '24H', active: selectedTimeframe === 'day' },
    { key: 'week', label: '7D', active: selectedTimeframe === 'week' },
    { key: 'month', label: '30D', active: selectedTimeframe === 'month' },
    { key: 'year', label: 'YTD', active: selectedTimeframe === 'year' },
  ];

  return (
    <LinearGradient colors={DesignSystem.gradients.sophisticated} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Metrics</Text>
            <Text style={styles.subtitle}>Life Alignment Dashboard</Text>
          </View>

          {/* Hero OVR Section */}
          {currentOVR && (
            <OVRHeroCard 
              ovrScore={currentOVR}
              onPress={() => {
                hapticFeedback.light();
                setShowDetailedChart(true);
              }}
            />
          )}

          {/* Atmos Age Section */}
          {currentAtmosAge && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderLeft}>
                  <Clock size={16} color={DesignSystem.colors.primary.cyan} />
                  <Text style={styles.sectionTitle}>Atmos Age</Text>
                </View>
                <Text style={styles.sectionSubtitle}>Biological Age Analysis</Text>
              </View>
              <AtmosAgeCard
                atmosAge={currentAtmosAge}
                onPress={() => {
                  hapticFeedback.light();
                  setShowAtmosAgeDetails(true);
                }}
                size="medium"
                showDetails={false}
              />
            </View>
          )}

          {/* Timeframe Selector */}
          <View style={styles.timeframeContainer}>
            {timeframes.map((timeframe) => (
              <TouchableOpacity
                key={timeframe.key}
                style={[
                  styles.timeframeButton,
                  timeframe.active && styles.timeframeButtonActive
                ]}
                onPress={() => {
                  hapticFeedback.light();
                  setSelectedTimeframe(timeframe.key as any);
                }}
              >
                <Text style={[
                  styles.timeframeText,
                  timeframe.active && styles.timeframeTextActive
                ]}>
                  {timeframe.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* OVR Trend Chart */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>OVR Trends</Text>
              <TouchableOpacity 
                style={styles.expandButton}
                onPress={() => {
                  hapticFeedback.light();
                  setShowDetailedChart(true);
                }}
              >
                <ChevronRight size={16} color={DesignSystem.colors.primary.cyan} />
              </TouchableOpacity>
            </View>
            <OVRTrendChart 
              timeframe={selectedTimeframe}
              onTimeframeChange={setSelectedTimeframe}
            />
          </View>



          {/* Sub-Score Trends */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Domain Performance</Text>
            </View>
            <SubScoreTrends 
              ovrBreakdown={ovrBreakdown}
              selectedDomain={selectedSubScore}
              onDomainSelect={setSelectedSubScore}
              showChart={false}
            />
          </View>

          {/* Live Metrics Panel */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Live Biometrics</Text>
              <Activity size={16} color={DesignSystem.colors.primary.cyan} />
            </View>
            <LiveMetricsPanel />
          </View>

          {/* AI Insights */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Optimization Insights</Text>
              <Zap size={16} color={DesignSystem.colors.primary.cyan} />
            </View>
            <MetricsInsights ovrScore={currentOVR} />
          </View>

          {/* Achievements */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <Trophy size={16} color={DesignSystem.colors.primary.gold} />
            </View>
            <AchievementsPanel ovrScore={currentOVR} />
          </View>

          {/* Friends Leaderboard */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Community</Text>
              <Text style={styles.sectionSubtitle}>Your ranking</Text>
            </View>
            <FriendLeaderboardCard
              friends={[]}
              userRank={4}
              userOVR={currentOVR?.overall || 87}
              onPress={() => {}}
            />
          </View>
        </ScrollView>

        {/* Atmos Age Details Modal */}
        <Modal
          visible={showAtmosAgeDetails}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowAtmosAgeDetails(false)}
        >
          {currentAtmosAge && (
            <LinearGradient colors={DesignSystem.gradients.sophisticated} style={{ flex: 1 }}>
              <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setShowAtmosAgeDetails(false)}
                  >
                    <Text style={styles.closeButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                  <AtmosAgeCard
                    atmosAge={currentAtmosAge}
                    size="large"
                    showDetails={true}
                  />
                </ScrollView>
              </SafeAreaView>
            </LinearGradient>
          )}
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  safeArea: { 
    flex: 1 
  },
  scrollView: { 
    flex: 1 
  },
  content: { 
    paddingHorizontal: Platform.OS === 'ios' ? 16 : DesignSystem.spacing.lg, 
    paddingBottom: DesignSystem.spacing['8xl'] 
  },
  header: { 
    alignItems: 'center', 
    paddingTop: Platform.OS === 'ios' ? 28 : DesignSystem.spacing['2xl'], 
    marginBottom: DesignSystem.spacing['3xl'] 
  },
  title: { 
    ...DesignSystem.typography.display,
    color: DesignSystem.colors.neutral.pearl,
    marginBottom: DesignSystem.spacing.xs,
  },
  subtitle: { 
    ...DesignSystem.typography.body1,
    color: DesignSystem.colors.primary.cyan,
    opacity: 0.8,
  },
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: DesignSystem.spacing['2xl'],
    gap: DesignSystem.spacing.sm,
  },
  timeframeButton: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.sm,
    borderRadius: DesignSystem.radius.full,
    backgroundColor: DesignSystem.colors.alpha[5],
    borderWidth: 1,
    borderColor: DesignSystem.colors.alpha[8],
  },
  timeframeButtonActive: {
    backgroundColor: DesignSystem.colors.primary.cyan + '20',
    borderColor: DesignSystem.colors.primary.cyan + '40',
  },
  timeframeText: {
    ...DesignSystem.typography.caption,
    color: DesignSystem.colors.neutral.silver,
  },
  timeframeTextActive: {
    color: DesignSystem.colors.primary.cyan,
    fontWeight: '600',
  },
  section: {
    marginBottom: Platform.OS === 'ios' ? 40 : DesignSystem.spacing['4xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignSystem.spacing.xl,
    paddingHorizontal: DesignSystem.spacing.sm,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
  },
  sectionTitle: {
    ...DesignSystem.typography.heading2,
    color: DesignSystem.colors.neutral.pearl,
  },
  sectionSubtitle: {
    ...DesignSystem.typography.caption,
    color: DesignSystem.colors.neutral.silver,
    opacity: 0.7,
  },
  expandButton: {
    padding: DesignSystem.spacing.xs,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
  },
  closeButtonText: {
    color: '#7dd3fc',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
});

export default RhythmScreen;