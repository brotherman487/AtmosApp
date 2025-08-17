import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CheckCircle,
  XCircle,
  Clock,
  Target,
  TrendingUp,
  TrendingDown,
  Brain,
  Heart,
  Activity,
  Calendar,
  ArrowUpRight,
  Star,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ActionHistoryItem {
  id: string;
  title: string;
  description: string;
  time: string;
  ovrImpact: number;
  completed: boolean;
  category: 'focus' | 'break' | 'optimization' | 'social' | 'health';
  icon: React.ReactNode;
  gradient: [string, string, string];
  followRate: number; // Percentage of times this suggestion was followed
  successRate: number; // Percentage of times this led to positive OVR impact
}

interface ActionHistoryProps {
  history?: ActionHistoryItem[];
}

const ActionHistory: React.FC<ActionHistoryProps> = ({
  history = [],
}) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Sample history data
  const sampleHistory: ActionHistoryItem[] = [
    {
      id: '1',
      title: 'Deep Work Session',
      description: 'Focus mode during peak cognitive hours',
      time: '2 hours ago',
      ovrImpact: 12,
      completed: true,
      category: 'focus',
      icon: <Brain size={20} color="#7dd3fc" strokeWidth={1.5} />,
      gradient: ['rgba(125, 211, 252, 0.2)', 'rgba(125, 211, 252, 0.1)', 'rgba(125, 211, 252, 0.05)'],
      followRate: 85,
      successRate: 92,
    },
    {
      id: '2',
      title: 'Mindful Break',
      description: '15-minute walk to refresh energy',
      time: '4 hours ago',
      ovrImpact: 8,
      completed: true,
      category: 'break',
      icon: <Heart size={20} color="#10b981" strokeWidth={1.5} />,
      gradient: ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)'],
      followRate: 78,
      successRate: 88,
    },
    {
      id: '3',
      title: 'Environment Sync',
      description: 'Outdoor activity during peak air quality',
      time: '6 hours ago',
      ovrImpact: 15,
      completed: false,
      category: 'optimization',
      icon: <Activity size={20} color="#f59e0b" strokeWidth={1.5} />,
      gradient: ['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)'],
      followRate: 45,
      successRate: 95,
    },
    {
      id: '4',
      title: 'Hydration Reminder',
      description: 'Drink water based on activity level',
      time: '8 hours ago',
      ovrImpact: 5,
      completed: true,
      category: 'health',
      icon: <Heart size={20} color="#a78bfa" strokeWidth={1.5} />,
      gradient: ['rgba(167, 139, 250, 0.2)', 'rgba(167, 139, 250, 0.1)', 'rgba(167, 139, 250, 0.05)'],
      followRate: 92,
      successRate: 76,
    },
  ];

  const displayHistory = history.length > 0 ? history : sampleHistory;
  const filteredHistory = showCompleted 
    ? displayHistory 
    : displayHistory.filter(item => !item.completed);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [showCompleted]);

  const handleItemPress = (item: ActionHistoryItem) => {
    setSelectedItem(selectedItem === item.id ? null : item.id);
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 10) return '#10b981';
    if (impact >= 5) return '#f59e0b';
    if (impact >= 0) return '#7dd3fc';
    return '#ef4444';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return '#10b981';
    if (rate >= 75) return '#f59e0b';
    if (rate >= 60) return '#7dd3fc';
    return '#ef4444';
  };

  const renderHistoryItem = (item: ActionHistoryItem, index: number) => (
    <Animated.View
      key={item.id}
      style={[
        styles.historyItem,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, index * 10],
            })},
          ],
        },
      ]}
    >
      <LinearGradient
        colors={item.gradient}
        style={styles.itemGradient}
      >
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.8}
        >
          <View style={styles.itemHeader}>
            <View style={styles.itemIconContainer}>
              {item.icon}
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
            <View style={styles.itemStatus}>
              {item.completed ? (
                <CheckCircle size={20} color="#10b981" strokeWidth={1.5} />
              ) : (
                <XCircle size={20} color="#ef4444" strokeWidth={1.5} />
              )}
            </View>
          </View>
          
          <Text style={styles.itemDescription}>{item.description}</Text>
          
          <View style={styles.itemMetrics}>
            <View style={styles.metricContainer}>
              <Target size={14} color="rgba(255, 255, 255, 0.7)" strokeWidth={1.5} />
              <Text style={styles.metricLabel}>Impact:</Text>
              <Text style={[
                styles.metricValue,
                { color: getImpactColor(item.ovrImpact) }
              ]}>
                {item.ovrImpact >= 0 ? '+' : ''}{item.ovrImpact} OVR
              </Text>
            </View>
            
            <View style={styles.metricContainer}>
              <TrendingUp size={14} color="rgba(255, 255, 255, 0.7)" strokeWidth={1.5} />
              <Text style={styles.metricLabel}>Success:</Text>
              <Text style={[
                styles.metricValue,
                { color: getSuccessRateColor(item.successRate) }
              ]}>
                {item.successRate}%
              </Text>
            </View>
          </View>
          
          {selectedItem === item.id && (
            <Animated.View
              style={[
                styles.itemDetails,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: fadeAnim }],
                },
              ]}
            >
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Follow Rate</Text>
                  <Text style={styles.detailValue}>{item.followRate}%</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Success Rate</Text>
                  <Text style={styles.detailValue}>{item.successRate}%</Text>
                </View>
              </View>
              
              <View style={styles.recommendationContainer}>
                <Star size={14} color="#f59e0b" strokeWidth={1.5} />
                <Text style={styles.recommendationText}>
                  {item.followRate > 80 ? 'Highly recommended' : 
                   item.followRate > 60 ? 'Good choice' : 'Consider alternatives'}
                </Text>
              </View>
            </Animated.View>
          )}
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  const renderStats = () => {
    const totalActions = displayHistory.length;
    const completedActions = displayHistory.filter(item => item.completed).length;
    const totalImpact = displayHistory.reduce((sum, item) => sum + item.ovrImpact, 0);
    const avgSuccessRate = displayHistory.reduce((sum, item) => sum + item.successRate, 0) / totalActions;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completedActions}/{totalActions}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalImpact >= 0 ? '+' : ''}{totalImpact}</Text>
          <Text style={styles.statLabel}>Total Impact</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Math.round(avgSuccessRate)}%</Text>
          <Text style={styles.statLabel}>Avg Success</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Clock size={20} color="#7dd3fc" strokeWidth={1.5} />
          <Text style={styles.headerTitle}>Action History</Text>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowCompleted(!showCompleted)}
          activeOpacity={0.8}
        >
          <Text style={styles.filterText}>
            {showCompleted ? 'Show All' : 'Show Completed'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {renderStats()}
      
      <ScrollView
        style={styles.historyList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.historyContent}
      >
        {filteredHistory.map((item, index) => renderHistoryItem(item, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: Platform.OS === 'ios' ? 18 : 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  filterButton: {
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.2)',
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#7dd3fc',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Platform.OS === 'ios' ? 20 : 22,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
  historyList: {
    maxHeight: 400,
  },
  historyContent: {
    gap: 12,
  },
  historyItem: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemGradient: {
    padding: 16,
  },
  itemContent: {
    gap: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: Platform.OS === 'ios' ? 15 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 2,
  },
  itemTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  itemStatus: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDescription: {
    fontSize: Platform.OS === 'ios' ? 13 : 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: Platform.OS === 'ios' ? 18 : 20,
  },
  itemMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  metricValue: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  itemDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  recommendationText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#f59e0b',
  },
});

export default ActionHistory;
