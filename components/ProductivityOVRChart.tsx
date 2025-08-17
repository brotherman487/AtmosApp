import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BarChart3,
  Calendar,
  Heart,
  Brain,
  Activity,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ProductivityEvent {
  id: string;
  type: 'calendar' | 'mood' | 'suggestion' | 'task';
  title: string;
  time: string;
  ovrImpact: number;
  completed: boolean;
  category: 'focus' | 'break' | 'optimization' | 'social' | 'health';
  icon: React.ReactNode;
  color: string;
}

interface ProductivityOVRChartProps {
  ovrData: number[];
  events: ProductivityEvent[];
}

const ProductivityOVRChart: React.FC<ProductivityOVRChartProps> = ({
  ovrData = [85, 87, 83, 89, 91, 88, 92, 90],
  events = [],
}) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Sample events data
  const sampleEvents: ProductivityEvent[] = [
    {
      id: '1',
      type: 'suggestion',
      title: 'Deep Work Session',
      time: '10:30 AM',
      ovrImpact: 12,
      completed: true,
      category: 'focus',
      icon: <Brain size={16} color="#7dd3fc" strokeWidth={1.5} />,
      color: '#7dd3fc',
    },
    {
      id: '2',
      type: 'mood',
      title: 'Logged: Energized',
      time: '11:15 AM',
      ovrImpact: 8,
      completed: true,
      category: 'health',
      icon: <Heart size={16} color="#10b981" strokeWidth={1.5} />,
      color: '#10b981',
    },
    {
      id: '3',
      type: 'calendar',
      title: 'Team Meeting',
      time: '2:00 PM',
      ovrImpact: -3,
      completed: true,
      category: 'social',
      icon: <Calendar size={16} color="#f59e0b" strokeWidth={1.5} />,
      color: '#f59e0b',
    },
    {
      id: '4',
      type: 'suggestion',
      title: 'Mindful Break',
      time: '3:30 PM',
      ovrImpact: 15,
      completed: false,
      category: 'break',
      icon: <Activity size={16} color="#a78bfa" strokeWidth={1.5} />,
      color: '#a78bfa',
    },
  ];

  const displayEvents = events.length > 0 ? events : sampleEvents;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleEventPress = (event: ProductivityEvent) => {
    setSelectedEvent(event.id);
    setShowDetails(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'focus': return '#7dd3fc';
      case 'break': return '#a78bfa';
      case 'optimization': return '#f59e0b';
      case 'social': return '#10b981';
      case 'health': return '#ef4444';
      default: return '#7dd3fc';
    }
  };

  const renderChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Productivity vs OVR Trends</Text>
        <Text style={styles.chartSubtitle}>Last 7 days</Text>
      </View>
      
      <View style={styles.chartArea}>
        <View style={styles.yAxis}>
          <Text style={styles.yAxisLabel}>100</Text>
          <Text style={styles.yAxisLabel}>90</Text>
          <Text style={styles.yAxisLabel}>80</Text>
          <Text style={styles.yAxisLabel}>70</Text>
        </View>
        
        <View style={styles.chartContent}>
          <View style={styles.gridLines}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>
          
          <View style={styles.ovrLine}>
            {ovrData.map((value, index) => (
              <View key={index} style={styles.dataPoint}>
                <View style={[styles.point, { backgroundColor: '#7dd3fc' }]} />
                {index < ovrData.length - 1 && (
                  <View style={[styles.line, { backgroundColor: '#7dd3fc' }]} />
                )}
              </View>
            ))}
          </View>
          
          <View style={styles.eventsOverlay}>
            {displayEvents.map((event, index) => (
              <TouchableOpacity
                key={event.id}
                style={[
                  styles.eventMarker,
                  {
                    backgroundColor: event.color,
                    left: `${(index / displayEvents.length) * 100}%`,
                  },
                ]}
                onPress={() => handleEventPress(event)}
                activeOpacity={0.8}
              >
                {event.completed ? (
                  <CheckCircle size={12} color="#ffffff" strokeWidth={2} />
                ) : (
                  <XCircle size={12} color="#ffffff" strokeWidth={2} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.xAxis}>
          <Text style={styles.xAxisLabel}>Mon - Sun</Text>
        </View>
      </View>
    </View>
  );

  const renderEventDetails = () => {
    if (!selectedEvent || !showDetails) return null;
    
    const event = displayEvents.find(e => e.id === selectedEvent);
    if (!event) return null;

    return (
      <Animated.View
        style={[
          styles.detailsContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.detailsCard}
        >
          <View style={styles.detailsHeader}>
            <View style={styles.detailsIconContainer}>
              {event.icon}
            </View>
            <View style={styles.detailsInfo}>
              <Text style={styles.detailsTitle}>{event.title}</Text>
              <Text style={styles.detailsTime}>{event.time}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDetails(false)}
            >
              <XCircle size={20} color="rgba(255, 255, 255, 0.6)" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.detailsContent}>
            <View style={styles.impactRow}>
              <Target size={16} color="rgba(255, 255, 255, 0.7)" strokeWidth={1.5} />
              <Text style={styles.impactLabel}>OVR Impact:</Text>
              <Text style={[
                styles.impactValue,
                { color: event.ovrImpact >= 0 ? '#10b981' : '#ef4444' }
              ]}>
                {event.ovrImpact >= 0 ? '+' : ''}{event.ovrImpact} points
              </Text>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Status:</Text>
              <View style={styles.statusContainer}>
                {event.completed ? (
                  <CheckCircle size={16} color="#10b981" strokeWidth={1.5} />
                ) : (
                  <XCircle size={16} color="#ef4444" strokeWidth={1.5} />
                )}
                <Text style={[
                  styles.statusText,
                  { color: event.completed ? '#10b981' : '#ef4444' }
                ]}>
                  {event.completed ? 'Completed' : 'Pending'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderLegend = () => (
    <View style={styles.legendContainer}>
      <Text style={styles.legendTitle}>Event Types</Text>
      <View style={styles.legendItems}>
        {[
          { icon: <Brain size={14} color="#7dd3fc" strokeWidth={1.5} />, label: 'Focus', color: '#7dd3fc' },
          { icon: <Heart size={14} color="#10b981" strokeWidth={1.5} />, label: 'Mood', color: '#10b981' },
          { icon: <Calendar size={14} color="#f59e0b" strokeWidth={1.5} />, label: 'Calendar', color: '#f59e0b' },
          { icon: <Activity size={14} color="#a78bfa" strokeWidth={1.5} />, label: 'Suggestion', color: '#a78bfa' },
        ].map((item, index) => (
          <View key={index} style={styles.legendItem}>
            {item.icon}
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderChart()}
      {renderEventDetails()}
      {renderLegend()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: Platform.OS === 'ios' ? 18 : 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  chartArea: {
    flexDirection: 'row',
    height: 200,
  },
  yAxis: {
    width: 30,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  yAxisLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  chartContent: {
    flex: 1,
    marginLeft: 10,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridLine: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  ovrLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    paddingVertical: 10,
  },
  dataPoint: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  point: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  line: {
    position: 'absolute',
    bottom: 3,
    width: '100%',
    height: 2,
  },
  eventsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  eventMarker: {
    position: 'absolute',
    top: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  xAxis: {
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  xAxisLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  detailsContainer: {
    marginTop: 16,
  },
  detailsCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailsInfo: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: Platform.OS === 'ios' ? 15 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 2,
  },
  detailsTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  closeButton: {
    padding: 4,
  },
  detailsContent: {
    gap: 8,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  impactLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  impactValue: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  legendContainer: {
    marginTop: 16,
  },
  legendTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default ProductivityOVRChart;
