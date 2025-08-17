import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Platform, Modal, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wind, Droplets, Sun, Volume2, Mic, Heart, Brain, Mail, Zap, Activity, TrendingUp, TrendingDown, DollarSign, ChevronRight, BarChart3, Clock, Droplet, FileText, Car } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import SensorDashboard from '../../components/SensorDashboard';
import OVRBreakdown from '../../components/OVRBreakdown';
import FVITracker from '../../components/FVITracker';
import AlertsBadge from '../../components/AlertsBadge';
import SubScoreCard from '../../components/SubScoreCard';
import PromptFeed from '../../components/PromptFeed';
import FriendLeaderboardCard from '../../components/FriendLeaderboardCard';
import FriendLeaderboardFull from '../../components/FriendLeaderboardFull';
import OptimizePanel from '../../components/OptimizePanel';
import AtmosAgeCard from '../../components/AtmosAgeCard';
import MoodLogPopup from '../../components/MoodLogPopup';
import SmartScheduleWidget from '../../components/SmartScheduleWidget';
import { SensorData, WearableStatus, AtmosAge } from '../../types';
import { OVRScore } from '../../types/ovr';
import { ovrService } from '../../services/ovrService';
import { wearableService } from '../../services/wearableService';
import { friendService, Friend } from '../../services/friendService';
import { atmosAgeService } from '../../services/atmosAgeService';
import { hapticFeedback } from '../../utils/haptics';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const router = useRouter();

  const [isListening, setIsListening] = useState(false);
  const [currentSensorData, setCurrentSensorData] = useState<SensorData | null>(null);
  const [wearableStatus, setWearableStatus] = useState<WearableStatus | null>(null);
  const [currentOVR, setCurrentOVR] = useState<OVRScore | null>(null);
  const [currentAtmosAge, setCurrentAtmosAge] = useState<AtmosAge | null>(null);
  const [showOVRBreakdown, setShowOVRBreakdown] = useState(false);
  const [showFVITracker, setShowFVITracker] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showOptimizePanel, setShowOptimizePanel] = useState(false);
  const [showAtmosAgeDetails, setShowAtmosAgeDetails] = useState(false);
  const [showMoodLog, setShowMoodLog] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [userRank, setUserRank] = useState(4);
  const [refreshing, setRefreshing] = useState(false);
  const [subScoreHistory, setSubScoreHistory] = useState({
    biological: [78, 82, 79, 85, 88, 86, 89, 87],
    emotional: [72, 75, 78, 76, 82, 84, 81, 83],
    environmental: [85, 88, 86, 91, 89, 92, 90, 88],
    financial: [68, 71, 69, 74, 76, 73, 78, 75],
  });
  const [animations] = useState({
    aura: new Animated.Value(1),
    pulse: new Animated.Value(1),
    glow: new Animated.Value(0.3),
  });

  const environmentalData = {
    airQuality: { value: 92, status: 'Excellent', color: '#10b981' },
    noise: { value: 28, status: 'Serene', color: '#7dd3fc' },
    weather: { value: 21, status: 'Perfect', color: '#f59e0b' },
    humidity: { value: 45, status: 'Ideal', color: '#a78bfa' },
  };

  const timeOfDay = new Date().getHours();
  const userName = 'James';
  const greeting = timeOfDay < 12 ? `Good Morning ${userName}` : timeOfDay < 17 ? `Good Afternoon ${userName}` : `Good Evening ${userName}`;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    hapticFeedback.light();
    
    try {
      // Refresh all data
      await Promise.all([
        wearableService.connect(),
        ovrService.getCurrentOVR(),
        friendService.getTopFriends(),
      ]);
      
      hapticFeedback.success();
    } catch (error) {
      console.error('Error refreshing data:', error);
      hapticFeedback.error();
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Aura breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.aura, {
          toValue: 1.08,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.aura, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Gentle glow animation
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

    // Initialize services
    let unsubscribe: (() => void) | undefined;
    
    const initServices = async () => {
      try {
        // Set up subscription first
        unsubscribe = wearableService.subscribe(async (sensorData: SensorData) => {
          setCurrentSensorData(sensorData);
          
          // Calculate OVR with mock financial data
          const financialData = ovrService.generateMockFinancialData();
          const ovrScore = ovrService.calculateOVR(sensorData, financialData);
          const ovrResult = await ovrScore;
          setCurrentOVR(ovrResult);
          
          // Calculate Atmos Age
          const atmosAge = await atmosAgeService.calculateAtmosAge(ovrResult, sensorData);
          setCurrentAtmosAge(atmosAge);
        });
        
        // Initialize friends leaderboard
        await loadFriendsData();
        
        // Generate initial mock Atmos Age if no sensor data yet
        if (!currentAtmosAge) {
          const mockAtmosAge = atmosAgeService.generateMockAtmosAge();
          setCurrentAtmosAge(mockAtmosAge);
        }
        
        // Connect to wearable service after setting up subscription
        wearableService.connect().then(() => {
          console.log('Wearable service connected');
        }).catch((error) => {
          console.error('Failed to connect to wearable:', error);
        });
      } catch (error) {
        console.error('Error initializing services:', error);
      }
    };
    
    initServices();
    
    return () => {
      // Cleanup
      unsubscribe?.();
      wearableService.disconnect();
    };
  }, []);

  const loadFriendsData = async () => {
    try {
      const topFriends = await friendService.getTopFriends(3);
      setFriends(topFriends);
      
      // Get user rank
      const leaderboard = await friendService.getLeaderboard();
      setUserRank(leaderboard.userRank);
    } catch (error) {
      console.error('Error loading friends data:', error);
    }
  };

  const handleVoicePress = () => {
    hapticFeedback.light();
    setIsListening(!isListening);
    
    // Simulate voice interaction
    setTimeout(() => {
      setIsListening(false);
      hapticFeedback.success();
      Alert.alert('Voice Command', 'Voice command feature coming soon!');
    }, 3000);
  };

  const handleSensorAlert = (sensor: keyof SensorData, value: number) => {
    console.log(`Sensor alert: ${sensor} = ${value}`);
    // Handle sensor alerts - could trigger notifications, haptics, etc.
  };

  const handleWearableStatusChange = (status: WearableStatus) => {
    setWearableStatus(status);
  };

  const getRhythmColor = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    if (score >= 50) return '#f97316';
    return '#ef4444';
  };

  const getTimeBasedGradient = (): [string, string, string] => {
    if (timeOfDay < 6) return ['#0f0f23', '#1a1a2e', '#16213e']; // Deep night
    if (timeOfDay < 12) return ['#1a1a2e', '#2563eb', '#3b82f6']; // Morning
    if (timeOfDay < 17) return ['#1e293b', '#0ea5e9', '#06b6d4']; // Afternoon
    return ['#0f0f23', '#7c3aed', '#a855f7']; // Evening
  };

  const goal = currentOVR ? ovrService.getConfig().goalSettings.targetOVR : 99;

  return (
    <LinearGradient
      colors={['#0a0a0a', '#161616', '#2a2a2a']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Top Navigation with Alerts */}
        <View style={styles.topNav}>
          <View style={styles.topNavLeft}>
            {/* Logo or App name could go here */}
          </View>
          <AlertsBadge style={styles.alertsBadge} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#7dd3fc"
              colors={["#7dd3fc"]}
            />
          }
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.heroSubtitle}>Your symbiotic intelligence companion</Text>
            
            {/* Hero Metrics Row */}
            <View style={styles.heroMetrics}>
              {/* Main OVR */}
              <View style={styles.ovrHero}>
                <TouchableOpacity
                  onPress={() => {
                    hapticFeedback.light();
                    setShowOVRBreakdown(true);
                  }}
                  activeOpacity={0.9}
                >
                  <View style={styles.ovrMainDisplay}>
                    <Text style={styles.ovrLabel}>OVERALL ALIGNMENT</Text>
                    <Text style={[styles.ovrValue, { color: currentOVR ? ovrService.getScoreColor(currentOVR.overall) : '#7dd3fc' }]}>
                      {currentOVR ? currentOVR.overall : '87'}
                    </Text>
                    <View style={styles.ovrChange}>
                      {(currentOVR?.change || 2.3) > 0 ? (
                        <TrendingUp size={14} color="#10b981" />
                      ) : (currentOVR?.change || 0) < 0 ? (
                        <TrendingDown size={14} color="#ef4444" />
                      ) : (
                        <Activity size={14} color="#7dd3fc" />
                      )}
                      <Text style={styles.ovrChangeText}>
                        {(currentOVR?.change || 2.3) > 0 ? '+' : ''}{currentOVR?.change || 2.3}
                      </Text>
                      {currentOVR?.microTrend && Math.abs(currentOVR.microTrend) > 0.1 && (
                        <Text style={styles.microTrendText}>
                          {currentOVR.microTrend > 0 ? '↗' : '↘'}{Math.abs(currentOVR.microTrend).toFixed(1)}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>


            </View>
          </View>

          {/* Smart Schedule Widget */}
          <SmartScheduleWidget
            ovrScore={currentOVR?.overall || 87}
            currentMood="energized"
            energyLevel={currentSensorData ? Math.round((currentSensorData.heartRate - 60) / 2 + (100 - currentSensorData.stressIndex) / 2) : 78}
          />

          {/* Atmos Age Card */}
          {currentAtmosAge && (
            <AtmosAgeCard
              atmosAge={currentAtmosAge}
              onPress={() => setShowAtmosAgeDetails(true)}
              size="medium"
              showDetails={false}
              preview={true}
            />
          )}

          {/* Friends Leaderboard */}
          <FriendLeaderboardCard
            friends={friends}
            userRank={userRank}
            userOVR={currentOVR ? currentOVR.overall : 87}
            onPress={() => setShowLeaderboard(true)}
          />

          {/* Sub-Score Cards */}
          <View style={styles.subScoresSection}>
            <Text style={styles.sectionTitle}>Performance Breakdown</Text>
            <View style={styles.subScoresGrid}>
              <SubScoreCard
                type="biological"
                currentValue={currentOVR ? currentOVR.biological : 87}
                history={subScoreHistory.biological}
                change={2.3}
                achievement="7-day streak"
                size="medium"
              />
              <SubScoreCard
                type="emotional"
                currentValue={currentOVR ? currentOVR.emotional : 83}
                history={subScoreHistory.emotional}
                change={-0.8}
                size="medium"
              />
              <SubScoreCard
                type="environmental"
                currentValue={currentOVR ? currentOVR.environmental : 88}
                history={subScoreHistory.environmental}
                change={4.1}
                size="medium"
              />
              <SubScoreCard
                type="financial"
                currentValue={currentOVR ? currentOVR.financial : 75}
                history={subScoreHistory.financial}
                change={1.2}
                size="medium"
              />
            </View>
          </View>

          {/* AI Prompt Feed */}
          <PromptFeed 
            maxVisible={2}
            onAction={(id) => {
              console.log('Prompt action:', id);
              return;
            }}
            onDismiss={(id) => {
              console.log('Dismissed:', id);
              return;
            }}
          />

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
              hapticFeedback.light();
              setShowFVITracker(true);
            }}
                activeOpacity={0.8}
              >
                <DollarSign size={24} color="#f59e0b" />
                <Text style={styles.actionLabel}>Financial Goals</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleVoicePress}
                activeOpacity={0.8}
              >
                <Mic size={24} color={isListening ? "#10b981" : "#7dd3fc"} />
                <Text style={styles.actionLabel}>
                  {isListening ? 'Listening...' : 'Voice Command'}
                </Text>
              </TouchableOpacity>
              

              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  hapticFeedback.light();
                  setShowOptimizePanel(true);
                }}
                activeOpacity={0.8}
              >
                <Clock size={24} color="#10b981" />
                <Text style={styles.actionLabel}>Optimize Schedule</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  hapticFeedback.light();
                  Alert.alert(
                    'Hydration Reminder',
                    'Your body needs hydration. Drink 8-12 oz of water now for optimal wellness.',
                    [
                      { text: 'Later', style: 'cancel' },
                      { text: 'Drink Now', onPress: () => hapticFeedback.success() }
                    ]
                  );
                }}
                activeOpacity={0.8}
              >
                <Droplet size={24} color="#7dd3fc" />
                <Text style={styles.actionLabel}>Hydrate now – conditions drying</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  hapticFeedback.light();
                  setShowMoodLog(true);
                }}
                activeOpacity={0.8}
              >
                <FileText size={24} color="#f59e0b" />
                <Text style={styles.actionLabel}>Log mood / energy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  hapticFeedback.light();
                  Alert.alert(
                    'Travel Advisory',
                    'Weather conditions suggest leaving by 8:30 AM to avoid rain and traffic delays.',
                    [
                      { text: 'Dismiss', style: 'cancel' },
                      { text: 'Set Reminder', onPress: () => hapticFeedback.success() }
                    ]
                  );
                }}
                activeOpacity={0.8}
              >
                <Car size={24} color="#ef4444" />
                <Text style={styles.actionLabel}>Leave by 8:30 to beat rain + traffic</Text>
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>

        {/* OVR Breakdown Modal */}
        <Modal
          visible={showOVRBreakdown}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowOVRBreakdown(false)}
        >
          {currentOVR && (
            <OVRBreakdown
              ovrScore={currentOVR}
              onClose={() => setShowOVRBreakdown(false)}
            />
          )}
        </Modal>

        {/* FVI Tracker Modal */}
        <Modal
          visible={showFVITracker}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setShowFVITracker(false)}
        >
          <LinearGradient colors={['#0a0a0a', '#161616', '#2a2a2a']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
              <FVITracker
                onAddGoal={() => console.log('Add financial goal')}
                onGoalPress={(goal) => console.log('Goal pressed:', goal.name)}
                onConnectAccounts={() => console.log('Connect financial accounts')}
                onClose={() => setShowFVITracker(false)}
              />
            </SafeAreaView>
          </LinearGradient>
        </Modal>

        {/* Friends Leaderboard Modal */}
        <FriendLeaderboardFull
          visible={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
          friends={friends}
          userRank={userRank}
          userOVR={currentOVR ? currentOVR.overall : 87}
        />



        {/* Optimize Panel Modal */}
        <Modal
          visible={showOptimizePanel}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setShowOptimizePanel(false)}
        >
          {currentOVR && (
            <OptimizePanel
              ovrScore={currentOVR}
              onClose={() => setShowOptimizePanel(false)}
            />
          )}
        </Modal>

        {/* Mood Log Popup */}
        <MoodLogPopup
          visible={showMoodLog}
          onClose={() => setShowMoodLog(false)}
          onMoodLogged={(mood) => {
            console.log('Mood logged:', mood);
            hapticFeedback.success();
          }}
        />

        {/* Atmos Age Details Modal */}
        <Modal
          visible={showAtmosAgeDetails}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowAtmosAgeDetails(false)}
        >
          {currentAtmosAge && (
            <LinearGradient colors={['#0a0a0a', '#161616', '#2a2a2a']} style={{ flex: 1 }}>
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
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 8,
    paddingBottom: 12,
    zIndex: 10,
  },
  topNavLeft: {
    flex: 1,
  },
  alertsBadge: {
    // Positioned in top right
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Account for tab bar
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  greeting: {
    fontSize: 32,
    fontFamily: 'Inter-Light',
    color: '#ffffff',
    letterSpacing: -1.0,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 32,
  },
  heroMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 20,
  },
  ovrHero: {
    flex: 1,
  },
  ovrMainDisplay: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  ovrLabel: {
    color: '#7dd3fc',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  ovrValue: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    fontWeight: '900',
    marginBottom: 8,
  },
  ovrChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ovrChangeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  microTrendText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#7dd3fc',
    opacity: 0.8,
  },

  subScoresSection: {
    marginVertical: 32,
  },
  subScoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  quickActionsSection: {
    marginTop: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#ffffff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    letterSpacing: -0.5,
    marginBottom: 20,
    textAlign: 'left',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    width: (width - 52) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    marginBottom: 12,
  },
  actionLabel: {
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 16,
  },
  rhythmContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  rhythmRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rhythmGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    boxShadow: '0px 0px 30px rgba(0, 0, 0, 1)',
    elevation: 20,
  },
  rhythmInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  rhythmScore: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
    letterSpacing: -1,
  },
  rhythmLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  rhythmIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rhythmStatus: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  metricCard: {
    width: (width - 52) / 2,
    backgroundColor: 'rgba(16, 24, 39, 0.85)',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 18,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(125, 211, 252, 0.10)',
    boxShadow: '0px 0px 12px rgba(125, 211, 252, 0.08)',
    elevation: 2,
    alignItems: 'center',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: 'rgba(125, 211, 252, 0.7)',
    marginLeft: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
    letterSpacing: -1,
    color: '#fff',
  },
  metricStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.2,
    marginTop: 2,
    textAlign: 'center',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 40,
    alignSelf: 'center',
    backdropFilter: 'blur(10px)',
  },
  voiceButtonActive: {
    backgroundColor: 'rgba(125, 211, 252, 0.15)',
    borderColor: 'rgba(125, 211, 252, 0.3)',
  },
  voiceIcon: {
    marginRight: 12,
  },
  voiceText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    letterSpacing: 0.2,
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  wave: {
    width: 3,
    height: 16,
    backgroundColor: '#7dd3fc',
    marginHorizontal: 1,
    borderRadius: 1.5,
    opacity: 0.7,
  },
  wisdomContainer: {
    marginBottom: 40,
  },
  wisdomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  wisdomTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
    letterSpacing: -0.2,
  },
  wisdomCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
  },
  wisdomText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  rhythmRingModern: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 100,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(125, 211, 252, 0.2)',
    boxShadow: '0px 0px 32px rgba(125, 211, 252, 0.15)',
  },
  rhythmInnerModern: {
    borderRadius: 80,
    borderWidth: 2,
    padding: 32,
    alignItems: 'center',
    backgroundColor: 'rgba(16, 24, 39, 0.7)',
  },
  rhythmScoreModern: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: -1,
  },
  rhythmLabelModern: {
    fontSize: 18,
    color: '#7dd3fc',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  rhythmIndicatorModern: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rhythmStatusModern: {
    fontSize: 16,
    color: '#10b981',
    marginLeft: 6,
    letterSpacing: 0.1,
  },
  inboxIcon: {
    marginLeft: 12,
    padding: 8,
    zIndex: 10,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#fff',
    boxShadow: '0px 0px 4px rgba(16, 185, 129, 0.18)',
  },
  notificationText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  headerTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  fviQuickAccess: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  fviQuickContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fviQuickText: {
    color: '#f59e0b',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    marginLeft: 12,
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

export default HomeScreen;