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
  Calendar,
  Clock,
  MapPin,
  Zap,
  Brain,
  Heart,
  CheckCircle,
  ArrowRight,
  Target,
  Coffee,
  BookOpen,
  Activity,
} from 'lucide-react-native';
import { hapticFeedback } from '../utils/haptics';

const { width } = Dimensions.get('window');

interface SmartSuggestion {
  id: string;
  type: 'task' | 'mood' | 'navigation' | 'optimization' | 'break' | 'focus';
  title: string;
  description: string;
  time: string;
  location?: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
  icon: React.ReactNode;
  gradient: [string, string, string];
  action: string;
  completed?: boolean;
}

interface SmartScheduleWidgetProps {
  ovrScore?: number;
  currentMood?: string;
  energyLevel?: number;
}

const SmartScheduleWidget: React.FC<SmartScheduleWidgetProps> = ({
  ovrScore = 85,
  currentMood = 'energized',
  energyLevel = 78,
}) => {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Generate AI suggestions based on OVR, mood, and energy
  const generateSuggestions = (): SmartSuggestion[] => {
    const baseSuggestions: SmartSuggestion[] = [
      {
        id: '1',
        type: 'focus',
        title: 'Deep Work Session',
        description: 'Your cognitive performance peaks in 30 minutes. Perfect for complex tasks.',
        time: '10:30 AM',
        priority: 'high',
        impact: '+12 OVR',
        icon: <Brain size={20} color="#7dd3fc" strokeWidth={1.5} />,
        gradient: ['rgba(125, 211, 252, 0.2)', 'rgba(125, 211, 252, 0.1)', 'rgba(125, 211, 252, 0.05)'],
        action: 'Start Focus Mode',
      },
      {
        id: '2',
        type: 'break',
        title: 'Mindful Break',
        description: 'Energy dip detected. Take a 15-minute walk to refresh.',
        time: '11:45 AM',
        priority: 'medium',
        impact: '+8 OVR',
        icon: <Heart size={20} color="#10b981" strokeWidth={1.5} />,
        gradient: ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)'],
        action: 'Start Break',
      },
      {
        id: '3',
        type: 'optimization',
        title: 'Environment Sync',
        description: 'Air quality peaks at 2 PM. Schedule outdoor activities.',
        time: '2:00 PM',
        priority: 'high',
        impact: '+15 OVR',
        icon: <Activity size={20} color="#f59e0b" strokeWidth={1.5} />,
        gradient: ['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)'],
        action: 'View Details',
      },
    ];

    // Adjust suggestions based on current state
    if (energyLevel < 60) {
      baseSuggestions[1].priority = 'high';
      baseSuggestions[1].impact = '+15 OVR';
    }

    if (ovrScore < 75) {
      baseSuggestions[2].priority = 'high';
    }

    return baseSuggestions;
  };

  useEffect(() => {
    setSuggestions(generateSuggestions());
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [ovrScore, currentMood, energyLevel]);

  const handleSuggestionPress = (suggestion: SmartSuggestion) => {
    hapticFeedback.light();
    setSelectedSuggestion(suggestion.id);
    
    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Execute suggestion action
    setTimeout(() => {
      console.log(`Executing: ${suggestion.action}`);
      hapticFeedback.success();
      setSelectedSuggestion(null);
    }, 200);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#7dd3fc';
    }
  };

  const renderSuggestion = (suggestion: SmartSuggestion, index: number) => (
    <Animated.View
      key={suggestion.id}
      style={[
        styles.suggestionCard,
        {
          opacity: fadeAnim,
          transform: [
            { scale: selectedSuggestion === suggestion.id ? scaleAnim : 1 },
            { translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            })},
          ],
        },
      ]}
    >
      <LinearGradient
        colors={suggestion.gradient}
        style={styles.suggestionGradient}
      >
        <TouchableOpacity
          style={styles.suggestionContent}
          onPress={() => handleSuggestionPress(suggestion)}
          activeOpacity={0.8}
        >
          <View style={styles.suggestionHeader}>
            <View style={styles.suggestionIconContainer}>
              {suggestion.icon}
            </View>
            <View style={styles.suggestionInfo}>
              <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
              <Text style={styles.suggestionTime}>{suggestion.time}</Text>
            </View>
            <View style={styles.suggestionPriority}>
              <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(suggestion.priority) }]} />
            </View>
          </View>
          
          <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
          
          <View style={styles.suggestionFooter}>
            <View style={styles.impactContainer}>
              <Target size={14} color="rgba(255, 255, 255, 0.7)" strokeWidth={1.5} />
              <Text style={styles.impactText}>{suggestion.impact}</Text>
            </View>
            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>{suggestion.action}</Text>
              <ArrowRight size={14} color="rgba(255, 255, 255, 0.7)" strokeWidth={1.5} />
            </View>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Calendar size={20} color="#7dd3fc" strokeWidth={1.5} />
          <Text style={styles.headerTitle}>Today's Smart Schedule</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerSubtitle}>AI-Powered</Text>
        </View>
      </View>
      
      <View style={styles.suggestionsContainer}>
        {suggestions.map((suggestion, index) => renderSuggestion(suggestion, index))}
      </View>
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
  headerRight: {
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.2)',
  },
  headerSubtitle: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#7dd3fc',
    letterSpacing: 0.5,
  },
  suggestionsContainer: {
    gap: 12,
  },
  suggestionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  suggestionGradient: {
    padding: 16,
  },
  suggestionContent: {
    gap: 12,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  suggestionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: Platform.OS === 'ios' ? 15 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 2,
  },
  suggestionTime: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  suggestionPriority: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  suggestionDescription: {
    fontSize: Platform.OS === 'ios' ? 13 : 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: Platform.OS === 'ios' ? 18 : 20,
  },
  suggestionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  impactText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default SmartScheduleWidget;
