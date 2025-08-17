import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Brain,
  Wind,
  Droplets,
  Sun,
  Moon,
  Cloud,
  Navigation,
  Heart,
  Activity,
  Coffee,
  Zap,
  TrendingUp,
  Clock,
  MapPin,
  Target,
  Sparkles,
  ChevronRight,
  BarChart3,
  Calendar,
  Thermometer,
  Waves,
  ArrowUpRight
} from 'lucide-react-native';
import ProductivityOVRChart from '../../components/ProductivityOVRChart';
import ActionHistory from '../../components/ActionHistory';
import { hapticFeedback } from '../../utils/haptics';

const { width, height } = Dimensions.get('window');

interface InsightCard {
  id: string;
  type: 'environment' | 'body' | 'rhythm';
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: [string, string, string];
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  time?: string;
  location?: string;
  impact?: string;
}

const InsightsScreen = () => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [hoursTimeframe, setHoursTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [tasksTimeframe, setTasksTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const [animations] = useState({
    fadeIn: new Animated.Value(0),
    parallax: new Animated.Value(0),
    pulse: new Animated.Value(1),
  });

  // Main rhythm recommendation
  const mainRecommendation = {
    title: "Your Symbiotic Co-Pilot",
    action: "Leave at 8:30 AM tomorrow",
    reason: "to maintain your optimal flow state and avoid traffic patterns",
    icon: <Navigation size={28} color="#7dd3fc" strokeWidth={1.5} />,
    impact: "High Impact"
  };

  // Daily insights data
  const dailyInsights: InsightCard[] = [
    {
      id: '1',
      type: 'environment',
      icon: <Wind size={22} color="#7dd3fc" strokeWidth={1.5} />,
      title: 'Air Quality Peak',
      description: 'Air quality improves significantly at 3 PM — perfect timing for your outdoor meditation session.',
      gradient: ['rgba(14, 165, 233, 0.15)', 'rgba(2, 132, 199, 0.08)', 'rgba(2, 132, 199, 0.08)'],
      priority: 'high',
      actionable: true,
      time: '3:00 PM',
      impact: 'High Impact'
    },
    {
      id: '2',
      type: 'body',
      icon: <Activity size={22} color="#a78bfa" strokeWidth={1.5} />,
      title: 'Energy Optimization',
      description: 'Your bio-rhythm shows peak performance at 2 PM. Schedule important tasks during this window.',
      gradient: ['rgba(167, 139, 250, 0.15)', 'rgba(139, 92, 246, 0.08)', 'rgba(139, 92, 246, 0.08)'],
      priority: 'high',
      actionable: true,
      time: '2:00 PM',
      impact: 'High Impact'
    },
    {
      id: '3',
      type: 'rhythm',
      icon: <Coffee size={22} color="#f59e0b" strokeWidth={1.5} />,
      title: 'Habit Alignment',
      description: 'You usually have coffee at 9 AM. The Mindful Brew cafe is open now (0.4 mi away).',
      gradient: ['rgba(245, 158, 11, 0.15)', 'rgba(217, 119, 6, 0.08)', 'rgba(217, 119, 6, 0.08)'],
      priority: 'medium',
      actionable: true,
      location: '0.4 mi',
      impact: 'Medium Impact'
    },
    {
      id: '4',
      type: 'environment',
      icon: <Cloud size={22} color="#7dd3fc" strokeWidth={1.5} />,
      title: 'Weather Alert',
      description: 'Rain expected at 9 AM tomorrow — leave by 8:30 to avoid traffic and stay dry.',
      gradient: ['rgba(14, 165, 233, 0.15)', 'rgba(2, 132, 199, 0.08)', 'rgba(2, 132, 199, 0.08)'],
      priority: 'medium',
      actionable: true,
      time: '8:30 AM',
      impact: 'Medium Impact'
    },
    {
      id: '5',
      type: 'body',
      icon: <Heart size={22} color="#a78bfa" strokeWidth={1.5} />,
      title: 'Recovery Window',
      description: 'Your stress levels are elevated. Consider a 10-minute breathing session in the next hour.',
      gradient: ['rgba(167, 139, 250, 0.15)', 'rgba(139, 92, 246, 0.08)', 'rgba(139, 92, 246, 0.08)'],
      priority: 'high',
      actionable: true,
      time: 'Next hour',
      impact: 'High Impact'
    },
    {
      id: '6',
      type: 'rhythm',
      icon: <Target size={22} color="#f59e0b" strokeWidth={1.5} />,
      title: 'Route Optimization',
      description: 'Your jogging route ahead has poor air quality. Take a right turn for cleaner breathing.',
      gradient: ['rgba(245, 158, 11, 0.15)', 'rgba(217, 119, 6, 0.08)', 'rgba(217, 119, 6, 0.08)'],
      priority: 'medium',
      actionable: true,
      location: 'Route change',
      impact: 'Medium Impact'
    }
  ];

  // Task management data - aligned with app data
  const taskData = {
    totalHours: 24.9,
    hoursPerDay: [
      { day: 'Mo', hours: 4.2, primaryHours: 3.5, secondaryHours: 0.7 },
      { day: 'Tu', hours: 3.5, primaryHours: 3.0, secondaryHours: 0.5 },
      { day: 'We', hours: 2.3, primaryHours: 1.5, secondaryHours: 0.8 },
      { day: 'Th', hours: 5.5, primaryHours: 4.5, secondaryHours: 1.0 },
      { day: 'Fr', hours: 4.5, primaryHours: 3.8, secondaryHours: 0.7 },
      { day: 'Sa', hours: 5.4, primaryHours: 4.2, secondaryHours: 1.2 },
    ],
    taskCompletion: {
      completed: 14,
      total: 20,
      inProgress: 4,
      pending: 2
    }
  };

  // Data for different timeframes
  const getHoursData = (timeframe: 'week' | 'month' | 'year') => {
    switch (timeframe) {
      case 'week':
        return {
          totalHours: 24.9,
          hoursPerDay: [
            { day: 'Mo', hours: 4.2, primaryHours: 3.5, secondaryHours: 0.7 },
            { day: 'Tu', hours: 3.5, primaryHours: 3.0, secondaryHours: 0.5 },
            { day: 'We', hours: 2.3, primaryHours: 1.5, secondaryHours: 0.8 },
            { day: 'Th', hours: 5.5, primaryHours: 4.5, secondaryHours: 1.0 },
            { day: 'Fr', hours: 4.5, primaryHours: 3.8, secondaryHours: 0.7 },
            { day: 'Sa', hours: 5.4, primaryHours: 4.2, secondaryHours: 1.2 },
          ]
        };
      case 'month':
        return {
          totalHours: 98.7,
          hoursPerDay: [
            { day: 'W1', hours: 24.9, primaryHours: 20.5, secondaryHours: 4.4 },
            { day: 'W2', hours: 26.3, primaryHours: 22.1, secondaryHours: 4.2 },
            { day: 'W3', hours: 23.8, primaryHours: 19.7, secondaryHours: 4.1 },
            { day: 'W4', hours: 23.7, primaryHours: 19.5, secondaryHours: 4.2 },
          ]
        };
      case 'year':
        return {
          totalHours: 1184.4,
          hoursPerDay: [
            { day: 'Jan', hours: 98.7, primaryHours: 81.8, secondaryHours: 16.9 },
            { day: 'Feb', hours: 89.2, primaryHours: 74.1, secondaryHours: 15.1 },
            { day: 'Mar', hours: 102.3, primaryHours: 85.2, secondaryHours: 17.1 },
            { day: 'Apr', hours: 95.8, primaryHours: 79.6, secondaryHours: 16.2 },
            { day: 'May', hours: 108.9, primaryHours: 90.5, secondaryHours: 18.4 },
            { day: 'Jun', hours: 92.1, primaryHours: 76.4, secondaryHours: 15.7 },
          ]
        };
      default:
        return {
          totalHours: 24.9,
          hoursPerDay: [
            { day: 'Mo', hours: 4.2, primaryHours: 3.5, secondaryHours: 0.7 },
            { day: 'Tu', hours: 3.5, primaryHours: 3.0, secondaryHours: 0.5 },
            { day: 'We', hours: 2.3, primaryHours: 1.5, secondaryHours: 0.8 },
            { day: 'Th', hours: 5.5, primaryHours: 4.5, secondaryHours: 1.0 },
            { day: 'Fr', hours: 4.5, primaryHours: 3.8, secondaryHours: 0.7 },
            { day: 'Sa', hours: 5.4, primaryHours: 4.2, secondaryHours: 1.2 },
          ]
        };
    }
  };

  const getTasksData = (timeframe: 'week' | 'month' | 'year') => {
    switch (timeframe) {
      case 'week':
        return {
          completed: 14,
          total: 20,
          inProgress: 4,
          pending: 2
        };
      case 'month':
        return {
          completed: 67,
          total: 85,
          inProgress: 12,
          pending: 6
        };
      case 'year':
        return {
          completed: 812,
          total: 1020,
          inProgress: 145,
          pending: 63
        };
      default:
        return {
          completed: 14,
          total: 20,
          inProgress: 4,
          pending: 2
        };
    }
  };

  // App usage and task data - recalculate when timeframes change
  const appData = React.useMemo(() => ({
    ...getHoursData(hoursTimeframe),
    taskCompletion: getTasksData(tasksTimeframe)
  }), [hoursTimeframe, tasksTimeframe]);

  useEffect(() => {
    // Fade in animation
    Animated.timing(animations.fadeIn, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Parallax animation
    Animated.loop(
      Animated.timing(animations.parallax, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#7dd3fc';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'environment': return '#7dd3fc';
      case 'body': return '#a78bfa';
      case 'rhythm': return '#f59e0b';
      default: return '#7dd3fc';
    }
  };

  const handleHoursTimeframeChange = () => {
    hapticFeedback.light();
    const timeframes: ('week' | 'month' | 'year')[] = ['week', 'month', 'year'];
    const currentIndex = timeframes.indexOf(hoursTimeframe);
    const nextIndex = (currentIndex + 1) % timeframes.length;
    setHoursTimeframe(timeframes[nextIndex]);
  };

  const handleTasksTimeframeChange = () => {
    hapticFeedback.light();
    const timeframes: ('week' | 'month' | 'year')[] = ['week', 'month', 'year'];
    const currentIndex = timeframes.indexOf(tasksTimeframe);
    const nextIndex = (currentIndex + 1) % timeframes.length;
    setTasksTimeframe(timeframes[nextIndex]);
  };

  const getTimeframeLabel = (timeframe: 'week' | 'month' | 'year') => {
    switch (timeframe) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      default: return 'This Week';
    }
  };

  const getYAxisLabels = (timeframe: 'week' | 'month' | 'year') => {
    switch (timeframe) {
      case 'week':
        return ['6', '4', '2', '0'];
      case 'month':
        return ['30', '20', '10', '0'];
      case 'year':
        return ['120', '80', '40', '0'];
      default:
        return ['6', '4', '2', '0'];
    }
  };

  const getMaxHours = (timeframe: 'week' | 'month' | 'year') => {
    switch (timeframe) {
      case 'week':
        return 6;
      case 'month':
        return 30;
      case 'year':
        return 120;
      default:
        return 6;
    }
  };



  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.96],
    extrapolate: 'clamp',
  });

  const parallaxOffset = animations.parallax.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const InsightCard: React.FC<{ insight: InsightCard; index: number }> = ({ insight, index }) => {
    const cardScale = scrollY.interpolate({
      inputRange: [index * 120, (index + 1) * 120],
      outputRange: [1, 0.98],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.insightCard,
          {
            transform: [{ scale: cardScale }],
            opacity: animations.fadeIn,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.cardTouchable}
          onPress={() => {
            hapticFeedback.light();
            setSelectedInsight(selectedInsight === insight.id ? null : insight.id);
            Alert.alert(
              insight.title,
              insight.description,
              [
                { text: 'Dismiss', style: 'cancel' },
                { text: 'Take Action', onPress: () => hapticFeedback.success() }
              ]
            );
          }}
          activeOpacity={0.95}
        >
          <LinearGradient
            colors={insight.gradient}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Priority indicator */}
            <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(insight.priority) }]} />
            
            {/* Card content */}
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${getTypeColor(insight.type)}15` }]}>
                  {insight.icon}
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle}>{insight.title}</Text>
                    <Text style={[styles.impactBadge, { color: getPriorityColor(insight.priority) }]}>
                      {insight.impact}
                    </Text>
                  </View>
                  <Text style={styles.cardDescription}>{insight.description}</Text>
                </View>
                <ArrowUpRight size={18} color="rgba(255, 255, 255, 0.5)" />
              </View>
              
              {/* Action details */}
              {(insight.time || insight.location) && (
                <View style={styles.actionDetails}>
                  {insight.time && (
                    <View style={styles.detailItem}>
                      <Clock size={14} color="rgba(255, 255, 255, 0.7)" strokeWidth={1.5} />
                      <Text style={styles.detailText}>{insight.time}</Text>
                    </View>
                  )}
                  {insight.location && (
                    <View style={styles.detailItem}>
                      <MapPin size={14} color="rgba(255, 255, 255, 0.7)" strokeWidth={1.5} />
                      <Text style={styles.detailText}>{insight.location}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <Animated.View style={[styles.backgroundGradient, { transform: [{ translateY: parallaxOffset }] }]}>
        <LinearGradient
          colors={['#0f0f23', '#1a1a2e', '#16213e']}
          style={styles.gradientBackground}
        />
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            { transform: [{ scale: headerScale }] }
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconContainer}>
                <Brain size={26} color="#7dd3fc" strokeWidth={1.5} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Symbiotic Insights</Text>
                <Text style={styles.headerSubtitle}>AI-powered guidance for optimal living</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                hapticFeedback.light();
                Alert.alert('AI Enhancement', 'AI enhancement features coming soon!');
              }}
            >
              <Sparkles size={20} color="#7dd3fc" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Main Recommendation */}
          <Animated.View 
            style={[
              styles.mainRecommendation,
              { opacity: animations.fadeIn }
            ]}
          >
            <LinearGradient
              colors={['rgba(125, 211, 252, 0.12)', 'rgba(125, 211, 252, 0.04)']}
              style={styles.recommendationGradient}
            >
              <View style={styles.recommendationHeader}>
                <View style={styles.recommendationIcon}>
                  {mainRecommendation.icon}
                </View>
                <View style={styles.recommendationContent}>
                  <View style={styles.recommendationTitleRow}>
                    <Text style={styles.recommendationTitle}>{mainRecommendation.title}</Text>
                    <Text style={styles.recommendationImpact}>{mainRecommendation.impact}</Text>
                  </View>
                  <Text style={styles.recommendationAction}>{mainRecommendation.action}</Text>
                  <Text style={styles.recommendationReason}>{mainRecommendation.reason}</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Daily Insights */}
          <View style={styles.insightsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Guidance</Text>
              <Text style={styles.sectionSubtitle}>6 actionable insights for optimal living</Text>
            </View>
            {dailyInsights.map((insight, index) => (
              <InsightCard key={insight.id} insight={insight} index={index} />
            ))}
          </View>

          {/* Productivity vs OVR Trends */}
          <ProductivityOVRChart
            ovrData={[85, 87, 83, 89, 91, 88, 92, 90]}
            events={[]}
          />

          {/* Action History */}
          <ActionHistory history={[]} />

          {/* App Usage & Task Interface */}
          <View style={styles.trendsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>App Usage & Tasks</Text>
              <Text style={styles.sectionSubtitle}>Your time spent and task completion</Text>
            </View>
            
            {/* Hours Spent Section */}
            <View style={styles.taskSection}>
                             <View style={styles.taskHeader}>
                 <View style={styles.taskHeaderLeft}>
                   <Text style={styles.taskTitle}>Hours Spent</Text>
                   <Text style={styles.taskValue}>{appData.totalHours}</Text>
                 </View>
                                   <TouchableOpacity 
                    style={styles.timeFilterButton}
                    onPress={handleHoursTimeframeChange}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.timeFilterText}>{getTimeframeLabel(hoursTimeframe)}</Text>
                    <ChevronRight size={14} color="rgba(255, 255, 255, 0.6)" />
                  </TouchableOpacity>
               </View>
              
                             {/* Hours Bar Chart */}
               <View style={styles.barChartSection}>
                 <View style={styles.barChartGrid}>
                   {appData.hoursPerDay.map((day, index) => (
                     <View key={index} style={styles.barChartDay}>
                       <View style={styles.barContainer}>
                         <View style={[styles.barPrimary, { height: `${(day.primaryHours / getMaxHours(hoursTimeframe)) * 100}%` }]} />
                         <View style={[styles.barSecondary, { height: `${(day.secondaryHours / getMaxHours(hoursTimeframe)) * 100}%` }]} />
                       </View>
                     </View>
                   ))}
                 </View>
                 <View style={styles.yAxis}>
                   {getYAxisLabels(hoursTimeframe).map((label, index) => (
                     <Text key={index} style={styles.yAxisLabel}>{label}</Text>
                   ))}
                 </View>
               </View>
               <View style={styles.barChartLabelContainer}>
                 <Text style={styles.barChartLabel}>Mon - Sun</Text>
               </View>
            </View>
            
                         {/* Task Completion Section */}
             <View style={styles.taskSection}>
                               <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle}>Task Completion</Text>
                  <TouchableOpacity 
                    style={styles.timeFilterButton}
                    onPress={handleTasksTimeframeChange}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.timeFilterText}>{getTimeframeLabel(tasksTimeframe)}</Text>
                    <ChevronRight size={14} color="rgba(255, 255, 255, 0.6)" />
                  </TouchableOpacity>
                </View>
              
              {/* Donut Chart */}
              <View style={styles.donutChartSection}>
                <View style={styles.donutChart}>
                  <View style={styles.donutCenter}>
                    <Text style={styles.donutCenterValue}>{appData.taskCompletion.completed}</Text>
                    <Text style={styles.donutCenterLabel}>OUT OF {appData.taskCompletion.total}</Text>
                  </View>
                  <View style={styles.donutRing}>
                    <View style={[styles.donutSegment, styles.donutSegmentCompleted]} />
                    <View style={[styles.donutSegment, styles.donutSegmentInProgress]} />
                    <View style={[styles.donutSegment, styles.donutSegmentPending]} />
                  </View>
                </View>
              </View>
              
              {/* Task Legend */}
              <View style={styles.taskLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotCompleted]} />
                  <Text style={styles.legendText}>{appData.taskCompletion.completed} Completed</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotInProgress]} />
                  <Text style={styles.legendText}>{appData.taskCompletion.inProgress} In Progress</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendDotPending]} />
                  <Text style={styles.legendText}>{appData.taskCompletion.pending} Pending</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Platform.OS === 'ios' ? 24 : 20,
    paddingTop: Platform.OS === 'ios' ? 48 : 20,
    marginBottom: Platform.OS === 'ios' ? 28 : 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.2)',
  },
  headerTitle: {
    fontSize: Platform.OS === 'ios' ? 26 : 24,
    fontFamily: 'Inter-Light',
    color: '#ffffff',
    letterSpacing: Platform.OS === 'ios' ? -1 : -0.8,
    marginBottom: Platform.OS === 'ios' ? 3 : 2,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.2,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(125, 211, 252, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.15)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Platform.OS === 'ios' ? 24 : 20,
    paddingBottom: Platform.OS === 'ios' ? 120 : 120,
  },
  mainRecommendation: {
    marginBottom: Platform.OS === 'ios' ? 36 : 32,
    borderRadius: Platform.OS === 'ios' ? 28 : 24,
    overflow: 'hidden',
  },
  recommendationGradient: {
    padding: Platform.OS === 'ios' ? 28 : 24,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.15)',
    borderRadius: Platform.OS === 'ios' ? 28 : 24,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  recommendationIcon: {
    width: Platform.OS === 'ios' ? 60 : 56,
    height: Platform.OS === 'ios' ? 60 : 56,
    borderRadius: Platform.OS === 'ios' ? 30 : 28,
    backgroundColor: 'rgba(125, 211, 252, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Platform.OS === 'ios' ? 24 : 20,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.25)',
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recommendationTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.2,
  },
  recommendationImpact: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    letterSpacing: 0.2,
  },
  recommendationAction: {
    fontSize: Platform.OS === 'ios' ? 24 : 22,
    fontFamily: 'Inter-SemiBold',
    color: '#7dd3fc',
    marginBottom: Platform.OS === 'ios' ? 10 : 8,
    letterSpacing: Platform.OS === 'ios' ? -0.4 : -0.3,
  },
  recommendationReason: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  insightsSection: {
    marginBottom: Platform.OS === 'ios' ? 36 : 32,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Platform.OS === 'ios' ? 22 : 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: Platform.OS === 'ios' ? 6 : 4,
    letterSpacing: Platform.OS === 'ios' ? -0.4 : -0.3,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.1,
  },
  insightCard: {
    marginBottom: Platform.OS === 'ios' ? 18 : 16,
    borderRadius: Platform.OS === 'ios' ? 24 : 20,
    overflow: 'hidden',
  },
  cardTouchable: {
    borderRadius: Platform.OS === 'ios' ? 24 : 20,
  },
  cardGradient: {
    padding: Platform.OS === 'ios' ? 24 : 20,
    borderRadius: Platform.OS === 'ios' ? 24 : 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
  },
  priorityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 4 : 3,
    borderTopLeftRadius: Platform.OS === 'ios' ? 24 : 20,
    borderTopRightRadius: Platform.OS === 'ios' ? 24 : 20,
  },
  cardContent: {
    marginTop: Platform.OS === 'ios' ? 4 : 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Platform.OS === 'ios' ? 18 : 16,
  },
  iconContainer: {
    width: Platform.OS === 'ios' ? 48 : 44,
    height: Platform.OS === 'ios' ? 48 : 44,
    borderRadius: Platform.OS === 'ios' ? 24 : 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Platform.OS === 'ios' ? 18 : 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: Platform.OS === 'ios' ? 17 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    letterSpacing: Platform.OS === 'ios' ? -0.3 : -0.2,
    flex: 1,
  },
  impactBadge: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    letterSpacing: 0.2,
  },
  cardDescription: {
    fontSize: Platform.OS === 'ios' ? 15 : 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: Platform.OS === 'ios' ? 22 : 20,
    letterSpacing: 0.1,
  },
  actionDetails: {
    flexDirection: 'row',
    gap: Platform.OS === 'ios' ? 24 : 20,
    paddingTop: Platform.OS === 'ios' ? 14 : 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: Platform.OS === 'ios' ? 14 : 13,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.1,
  },
  trendsSection: {
    marginBottom: Platform.OS === 'ios' ? 36 : 32,
  },
  taskSection: {
    marginBottom: Platform.OS === 'ios' ? 28 : 24,
    padding: Platform.OS === 'ios' ? 24 : 20,
    borderRadius: Platform.OS === 'ios' ? 20 : 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Platform.OS === 'ios' ? 24 : 20,
  },
  taskHeaderLeft: {
    flex: 1,
  },
  taskTitle: {
    fontSize: Platform.OS === 'ios' ? 17 : 16,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Platform.OS === 'ios' ? 6 : 4,
    letterSpacing: 0.1,
  },
  taskValue: {
    fontSize: Platform.OS === 'ios' ? 36 : 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    letterSpacing: Platform.OS === 'ios' ? -0.6 : -0.5,
  },
     
               timeFilterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Platform.OS === 'ios' ? 10 : 8,
      paddingHorizontal: Platform.OS === 'ios' ? 18 : 16,
      paddingVertical: Platform.OS === 'ios' ? 12 : 10,
      borderRadius: Platform.OS === 'ios' ? 14 : 12,
      backgroundColor: 'rgba(125, 211, 252, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(125, 211, 252, 0.2)',
      shadowColor: '#7dd3fc',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
      timeFilterText: {
      fontSize: Platform.OS === 'ios' ? 14 : 13,
      fontFamily: 'Inter-SemiBold',
      color: '#7dd3fc',
      letterSpacing: 0.1,
    },
  barChartSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Platform.OS === 'ios' ? 18 : 16,
    height: Platform.OS === 'ios' ? 140 : 120,
  },
  barChartGrid: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Platform.OS === 'ios' ? 10 : 8,
    height: '100%',
  },
  barChartDay: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  barContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column-reverse',
    gap: 2,
  },
  barPrimary: {
    backgroundColor: '#7dd3fc',
    borderRadius: 2,
    minHeight: 4,
  },
  barSecondary: {
    backgroundColor: '#a78bfa',
    borderRadius: 2,
    minHeight: 4,
  },
  barDayLabel: {
    fontSize: Platform.OS === 'ios' ? 11 : 10,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: Platform.OS === 'ios' ? 10 : 8,
    letterSpacing: 0.1,
  },
  yAxis: {
    width: 20,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
     yAxisLabel: {
     fontSize: Platform.OS === 'ios' ? 11 : 10,
     fontFamily: 'Inter-Regular',
     color: 'rgba(255, 255, 255, 0.5)',
     letterSpacing: 0.1,
   },
   barChartLabelContainer: {
     alignItems: 'center',
     marginTop: Platform.OS === 'ios' ? 12 : 10,
   },
   barChartLabel: {
     fontSize: Platform.OS === 'ios' ? 12 : 11,
     fontFamily: 'Inter-Medium',
     color: 'rgba(255, 255, 255, 0.6)',
     letterSpacing: 0.1,
   },
  donutChartSection: {
    alignItems: 'center',
    marginVertical: Platform.OS === 'ios' ? 24 : 20,
  },
  donutChart: {
    width: Platform.OS === 'ios' ? 140 : 120,
    height: Platform.OS === 'ios' ? 140 : 120,
    borderRadius: Platform.OS === 'ios' ? 70 : 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  donutCenter: {
    alignItems: 'center',
  },
  donutCenterValue: {
    fontSize: Platform.OS === 'ios' ? 28 : 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    letterSpacing: Platform.OS === 'ios' ? -0.4 : -0.3,
  },
  donutCenterLabel: {
    fontSize: Platform.OS === 'ios' ? 11 : 10,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.1,
  },
  donutRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Platform.OS === 'ios' ? 70 : 60,
    borderWidth: Platform.OS === 'ios' ? 10 : 8,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  donutSegment: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: Platform.OS === 'ios' ? 70 : 60,
    borderWidth: Platform.OS === 'ios' ? 10 : 8,
    borderColor: 'transparent',
  },
  donutSegmentCompleted: {
    borderTopColor: '#7dd3fc',
    borderRightColor: '#7dd3fc',
    transform: [{ rotate: '0deg' }],
  },
  donutSegmentInProgress: {
    borderBottomColor: '#a78bfa',
    borderLeftColor: '#a78bfa',
    transform: [{ rotate: '180deg' }],
  },
  donutSegmentPending: {
    borderTopColor: '#f59e0b',
    borderRightColor: '#f59e0b',
    transform: [{ rotate: '270deg' }],
  },
  taskLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: Platform.OS === 'ios' ? 20 : 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Platform.OS === 'ios' ? 8 : 6,
  },
  legendDot: {
    width: Platform.OS === 'ios' ? 10 : 8,
    height: Platform.OS === 'ios' ? 10 : 8,
    borderRadius: Platform.OS === 'ios' ? 5 : 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  legendDotCompleted: {
    backgroundColor: '#7dd3fc',
  },
  legendDotInProgress: {
    backgroundColor: '#a78bfa',
  },
  legendDotPending: {
    backgroundColor: '#f59e0b',
  },
           legendText: {
      fontSize: Platform.OS === 'ios' ? 12 : 11,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.6)',
      letterSpacing: 0.1,
    },
       
 });

export default InsightsScreen;
