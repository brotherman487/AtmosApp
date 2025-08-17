import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Brain, 
  Activity, 
  Globe, 
  User, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle 
} from 'lucide-react-native';
import { hapticFeedback } from '../utils/haptics';
import { DesignSystem } from '../constants/design';

const { width, height } = Dimensions.get('window');

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to Atmos',
    description: 'Your conscious living companion. Discover harmony with the world through mindful insights and wellness tracking.',
    icon: <Sparkles size={60} color="#7dd3fc" strokeWidth={1.5} />,
    color: '#7dd3fc',
  },
  {
    id: 2,
    title: 'Mental Insights',
    description: 'Track your mental wellness with AI-powered insights. Understand your patterns and optimize your daily rhythm.',
    icon: <Brain size={60} color="#a855f7" strokeWidth={1.5} />,
    color: '#a855f7',
  },
  {
    id: 3,
    title: 'Live Metrics',
    description: 'Monitor your vital signs and wellness metrics in real-time. Stay connected to your body\'s signals.',
    icon: <Activity size={60} color="#10b981" strokeWidth={1.5} />,
    color: '#10b981',
  },
  {
    id: 4,
    title: 'Calm Zones',
    description: 'Discover peaceful locations around you. Find your perfect environment for mindfulness and relaxation.',
    icon: <Globe size={60} color="#06b6d4" strokeWidth={1.5} />,
    color: '#06b6d4',
  },
  {
    id: 5,
    title: 'Your Journey',
    description: 'Track your progress, celebrate achievements, and maintain your mindful lifestyle with personalized insights.',
    icon: <User size={60} color="#f59e0b" strokeWidth={1.5} />,
    color: '#f59e0b',
  },
];

interface OnboardingTutorialProps {
  visible: boolean;
  onComplete: () => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({
  visible,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    hapticFeedback.light();
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({
        x: (currentStep + 1) * width,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    hapticFeedback.light();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({
        x: (currentStep - 1) * width,
        animated: true,
      });
    }
  };

  const handleComplete = () => {
    hapticFeedback.success();
    onComplete();
  };

  const handleSkip = () => {
    hapticFeedback.medium();
    onComplete();
  };

  if (!visible) return null;

  return (
    <LinearGradient
      colors={['#0f0f23', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        {/* Content */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newStep = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentStep(newStep);
          }}
          style={styles.scrollView}
        >
          {onboardingSteps.map((step, index) => (
            <View key={step.id} style={styles.stepContainer}>
              <View style={styles.iconContainer}>
                <View style={[styles.iconBackground, { backgroundColor: `${step.color}20` }]}>
                  {step.icon}
                </View>
              </View>
              
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.description}>{step.description}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navigation}>
          {/* Dots */}
          <View style={styles.dotsContainer}>
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStep && styles.activeDot,
                ]}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={styles.navButton}
                onPress={handlePrevious}
                activeOpacity={0.7}
              >
                <ArrowLeft size={24} color="#7dd3fc" />
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.7}
            >
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  <Text style={styles.nextButtonText}>Get Started</Text>
                  <CheckCircle size={24} color="#ffffff" />
                </>
              ) : (
                <>
                  <Text style={styles.nextButtonText}>Next</Text>
                  <ArrowRight size={24} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    width,
    height: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  navigation: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#7dd3fc',
    width: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  navButtonText: {
    color: '#7dd3fc',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7dd3fc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginRight: 8,
  },
});

export default OnboardingTutorial;
