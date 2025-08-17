import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Heart, Brain, Wind, Zap, Clock, MapPin, ArrowRight } from 'lucide-react-native';
import { hapticFeedback } from '../utils/haptics';

const { width, height } = Dimensions.get('window');

interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
  gradient: [string, string, string];
}

interface FollowUpQuestion {
  id: string;
  question: string;
  options: string[];
  icon: React.ReactNode;
}

interface SymbioticAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface MoodLogPopupProps {
  visible: boolean;
  onClose: () => void;
  onMoodLogged?: (mood: Mood) => void;
}

const MoodLogPopup: React.FC<MoodLogPopupProps> = ({
  visible,
  onClose,
  onMoodLogged,
}) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [currentStep, setCurrentStep] = useState<'mood' | 'followup' | 'action'>('mood');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const moods: Mood[] = [
    {
      id: 'happy',
      emoji: '😀',
      label: 'Happy',
      color: '#10b981',
      gradient: ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)'],
    },
    {
      id: 'energized',
      emoji: '💪',
      label: 'Energized',
      color: '#f59e0b',
      gradient: ['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)'],
    },
    {
      id: 'neutral',
      emoji: '😐',
      label: 'Neutral',
      color: '#7dd3fc',
      gradient: ['rgba(125, 211, 252, 0.2)', 'rgba(125, 211, 252, 0.1)', 'rgba(125, 211, 252, 0.05)'],
    },
    {
      id: 'tired',
      emoji: '😴',
      label: 'Tired',
      color: '#a78bfa',
      gradient: ['rgba(167, 139, 250, 0.2)', 'rgba(167, 139, 250, 0.1)', 'rgba(167, 139, 250, 0.05)'],
    },
    {
      id: 'sad',
      emoji: '😞',
      label: 'Sad',
      color: '#6366f1',
      gradient: ['rgba(99, 102, 241, 0.2)', 'rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 0.05)'],
    },
    {
      id: 'stressed',
      emoji: '😡',
      label: 'Stressed',
      color: '#ef4444',
      gradient: ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)'],
    },
  ];

  const getFollowUpQuestion = (moodId: string): FollowUpQuestion | null => {
    const questions = {
      happy: {
        id: 'happy-followup',
        question: 'Want to save this moment as a highlight?',
        options: ['Yes, save it', 'Not now'],
        icon: <Heart size={20} color="#10b981" />,
      },
             energized: {
         id: 'energized-followup',
         question: 'Nearby gym is quiet — want directions?',
         options: ['Show me', 'Maybe later'],
         icon: <Zap size={20} color="#f59e0b" />,
       },
       neutral: {
         id: 'neutral-followup',
         question: 'Want to check your current OVR status?',
         options: ['Yes, show me', 'Not now'],
         icon: <Brain size={20} color="#7dd3fc" />,
       },
      stressed: {
        id: 'stressed-followup',
        question: "What's causing stress?",
        options: ['Work', 'Health', 'Social', 'Skip'],
        icon: <Brain size={20} color="#ef4444" />,
      },
      sad: {
        id: 'sad-followup',
        question: 'Want to step outside for fresh air?',
        options: ['Yes, let\'s go', 'Not right now'],
        icon: <Wind size={20} color="#6366f1" />,
      },
      tired: {
        id: 'tired-followup',
        question: 'Want me to adjust tomorrow\'s rhythm for more recovery?',
        options: ['Yes, optimize', 'Keep current'],
        icon: <Clock size={20} color="#a78bfa" />,
      },
    };
    return questions[moodId as keyof typeof questions] || null;
  };

  const getSymbioticAction = (moodId: string): SymbioticAction | null => {
    const actions = {
      happy: {
        id: 'happy-action',
        title: 'Share this moment',
        description: 'Send a positive vibe to your friends',
        icon: <Heart size={24} color="#10b981" />,
        color: '#10b981',
      },
             energized: {
         id: 'energized-action',
         title: 'Quick workout',
         description: 'Channel this energy into movement',
         icon: <Zap size={24} color="#f59e0b" />,
         color: '#f59e0b',
       },
       neutral: {
         id: 'neutral-action',
         title: 'OVR Check-in',
         description: 'Review your current vitality status',
         icon: <Brain size={24} color="#7dd3fc" />,
         color: '#7dd3fc',
       },
      stressed: {
        id: 'stressed-action',
        title: '2-min breath reset',
        description: 'Quick stress relief technique',
        icon: <Brain size={24} color="#ef4444" />,
        color: '#ef4444',
      },
      sad: {
        id: 'sad-action',
        title: 'Fresh air walk',
        description: 'Step outside — improves OVR by 3.2 points',
        icon: <Wind size={24} color="#6366f1" />,
        color: '#6366f1',
      },
      tired: {
        id: 'tired-action',
        title: 'Power nap reminder',
        description: 'Set a 20-min recovery timer',
        icon: <Clock size={24} color="#a78bfa" />,
        color: '#a78bfa',
      },
    };
    return actions[moodId as keyof typeof actions] || null;
  };

  useEffect(() => {
    if (visible) {
      setCurrentStep('mood');
      setSelectedMood(null);
      setSelectedOption(null);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleMoodSelect = (mood: Mood) => {
    hapticFeedback.light();
    setSelectedMood(mood);
    onMoodLogged?.(mood);
    
    // Auto-advance to follow-up after a brief delay
    setTimeout(() => {
      setCurrentStep('followup');
    }, 500);
  };

  const handleOptionSelect = (option: string) => {
    hapticFeedback.light();
    setSelectedOption(option);
    
    // Auto-advance to action after a brief delay
    setTimeout(() => {
      setCurrentStep('action');
    }, 500);
  };

  const handleActionPress = () => {
    hapticFeedback.success();
    // Close the popup after action
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSkip = () => {
    hapticFeedback.light();
    setCurrentStep('action');
  };

  const renderMoodWheel = () => (
    <View style={styles.moodWheelContainer}>
      <Text style={styles.stepTitle}>How are you feeling?</Text>
      <Text style={styles.stepSubtitle}>Tap to log your mood instantly</Text>
      
      <View style={styles.moodGrid}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodButton,
              selectedMood?.id === mood.id && styles.moodButtonSelected,
            ]}
            onPress={() => handleMoodSelect(mood)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={mood.gradient}
              style={styles.moodGradient}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={[
                styles.moodLabel,
                { color: mood.color }
              ]}>
                {mood.label}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFollowUp = () => {
    if (!selectedMood) return null;
    
    const followUp = getFollowUpQuestion(selectedMood.id);
    if (!followUp) return null;

    return (
      <Animated.View 
        style={[
          styles.followUpContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <LinearGradient
          colors={selectedMood.gradient}
          style={styles.followUpCard}
        >
          <View style={styles.followUpHeader}>
            {followUp.icon}
            <Text style={styles.followUpQuestion}>{followUp.question}</Text>
          </View>
          
          <View style={styles.optionsContainer}>
            {followUp.options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  selectedOption === option && styles.optionButtonSelected,
                ]}
                onPress={() => handleOptionSelect(option)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.optionText,
                  selectedOption === option && styles.optionTextSelected,
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderAction = () => {
    if (!selectedMood) return null;
    
    const action = getSymbioticAction(selectedMood.id);
    if (!action) return null;

    return (
      <Animated.View 
        style={[
          styles.actionContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <LinearGradient
          colors={selectedMood.gradient}
          style={styles.actionCard}
        >
          <View style={styles.actionHeader}>
            {action.icon}
            <Text style={styles.actionTitle}>{action.title}</Text>
          </View>
          
          <Text style={styles.actionDescription}>{action.description}</Text>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: action.color }]}
            onPress={handleActionPress}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Take Action</Text>
            <ArrowRight size={16} color="#ffffff" />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.9)']}
          style={styles.background}
        >
          <SafeAreaView style={styles.container}>
                         {/* Header */}
             <View style={styles.header}>
               <TouchableOpacity
                 style={styles.closeButton}
                 onPress={onClose}
                 activeOpacity={0.7}
               >
                                   <ArrowLeft size={24} color="#ffffff" />
               </TouchableOpacity>
             </View>

            {/* Content */}
            <ScrollView 
              style={styles.content}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentContainer}
            >
              <Animated.View
                style={[
                  styles.mainContent,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { translateY: slideAnim },
                      { scale: scaleAnim },
                    ],
                  }
                ]}
              >
                {currentStep === 'mood' && renderMoodWheel()}
                {currentStep === 'followup' && renderFollowUp()}
                {currentStep === 'action' && renderAction()}
              </Animated.View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 97 : 16,
    paddingBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 60 : 40,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  moodWheelContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: Platform.OS === 'ios' ? 26 : 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: Platform.OS === 'ios' ? 6 : 8,
    letterSpacing: -0.5,
  },
  stepSubtitle: {
    fontSize: Platform.OS === 'ios' ? 15 : 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: Platform.OS === 'ios' ? 32 : 40,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Platform.OS === 'ios' ? 12 : 16,
    maxWidth: width - 80,
  },
  moodButton: {
    width: (width - 80) / 3,
    aspectRatio: 1,
    borderRadius: Platform.OS === 'ios' ? 18 : 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  moodButtonSelected: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ scale: 1.05 }],
  },
  moodGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Platform.OS === 'ios' ? 10 : 12,
  },
  moodEmoji: {
    fontSize: Platform.OS === 'ios' ? 28 : 32,
    marginBottom: Platform.OS === 'ios' ? 6 : 8,
  },
  moodLabel: {
    fontSize: Platform.OS === 'ios' ? 11 : 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  followUpContainer: {
    marginTop: 20,
  },
  followUpCard: {
    borderRadius: Platform.OS === 'ios' ? 20 : 24,
    padding: Platform.OS === 'ios' ? 20 : 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  followUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  followUpQuestion: {
    fontSize: Platform.OS === 'ios' ? 17 : 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    flex: 1,
    lineHeight: Platform.OS === 'ios' ? 22 : 24,
  },
  optionsContainer: {
    gap: Platform.OS === 'ios' ? 10 : 12,
  },
  optionButton: {
    paddingVertical: Platform.OS === 'ios' ? 12 : 14,
    paddingHorizontal: Platform.OS === 'ios' ? 18 : 20,
    borderRadius: Platform.OS === 'ios' ? 10 : 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  optionText: {
    fontSize: Platform.OS === 'ios' ? 15 : 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    textAlign: 'center',
  },
  optionTextSelected: {
    fontFamily: 'Inter-SemiBold',
  },
  skipButton: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  actionContainer: {
    marginTop: 20,
  },
  actionCard: {
    borderRadius: Platform.OS === 'ios' ? 20 : 24,
    padding: Platform.OS === 'ios' ? 20 : 24,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  actionTitle: {
    fontSize: Platform.OS === 'ios' ? 19 : 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    flex: 1,
  },
  actionDescription: {
    fontSize: Platform.OS === 'ios' ? 15 : 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: Platform.OS === 'ios' ? 20 : 22,
    marginBottom: Platform.OS === 'ios' ? 20 : 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.OS === 'ios' ? 14 : 16,
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 24,
    borderRadius: Platform.OS === 'ios' ? 14 : 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: Platform.OS === 'ios' ? 15 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});

export default MoodLogPopup;
