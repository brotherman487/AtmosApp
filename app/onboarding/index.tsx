import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Brain, Cpu, Heart, Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animations] = useState({
    breathe: new Animated.Value(1),
    fade: new Animated.Value(0),
    glow: new Animated.Value(0.3),
    neuralFlow: new Animated.Value(0),
    aiPulse: new Animated.Value(0),
    slide: new Animated.Value(50)
  });

  useEffect(() => {
    // Breathing animation synchronized with AI "breath"
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.breathe, {
          toValue: 1.2,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.breathe, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation
    Animated.timing(animations.fade, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Slide up animation
    Animated.timing(animations.slide, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Neural flow animation
    Animated.loop(
      Animated.timing(animations.neuralFlow, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    // AI pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.aiPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.aiPulse, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const onboardingSteps = [
    {
      title: "Your AI Companion",
      subtitle: "An invisible intelligence that learns to breathe with you",
      icon: <Brain size={40} color="#7dd3fc" strokeWidth={1.5} />,
      color: '#7dd3fc',
      gradient: ['#0f0f23', '#1a1a2e', '#16213e'] as const,
    },
    {
      title: "Learning Your Rhythms",
      subtitle: "Watching, sensing, adapting to become your perfect companion",
      icon: <Cpu size={40} color="#10b981" strokeWidth={1.5} />,
      color: '#10b981',
      gradient: ['#1a1a2e', '#16213e', '#0f3460'] as const,
    },
    {
      title: "Symbiotic Connection",
      subtitle: "A living extension of your consciousness that grows wiser with every breath",
      icon: <Heart size={40} color="#a855f7" strokeWidth={1.5} />,
      color: '#a855f7',
      gradient: ['#16213e', '#0f3460', '#1a1a2e'] as const,
    },
    {
      title: "Begin Your Journey",
      subtitle: "Step into a world where technology disappears, leaving only gentle guidance",
      icon: <Sparkles size={40} color="#f59e0b" strokeWidth={1.5} />,
      color: '#f59e0b',
      gradient: ['#0f0f23', '#1a1a2e', '#16213e'] as const,
    }
  ];

  const currentStepData = onboardingSteps[currentStep];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/onboarding/permissions');
    }
  };

  const breatheScale = animations.breathe.interpolate({
    inputRange: [1, 1.2],
    outputRange: [1, 1.2]
  });

  const neuralOpacity = animations.neuralFlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.05, 0.15]
  });

  const neuralRotation = animations.neuralFlow.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const aiPulseScale = animations.aiPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05]
  });

  const glowOpacity = animations.glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6]
  });

  return (
    <LinearGradient
      colors={currentStepData.gradient}
      style={styles.container}
    >
      {/* Subtle Neural Background */}
      <Animated.View 
        style={[
          styles.neuralBackground,
          {
            opacity: neuralOpacity,
            transform: [{ rotate: neuralRotation }]
          }
        ]}
      />
      
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: animations.fade,
            transform: [{ translateY: animations.slide }]
          }
        ]}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && [styles.activeProgressDot, { backgroundColor: currentStepData.color }]
              ]}
            />
          ))}
        </View>

        {/* Main Content Card */}
        <View style={styles.mainCard}>
          {/* Icon Container */}
          <View style={styles.iconContainer}>
            <Animated.View 
              style={[
                styles.iconOrb,
                {
                  transform: [
                    { scale: breatheScale },
                    { scale: aiPulseScale }
                  ],
                  backgroundColor: `${currentStepData.color}15`,
                  borderColor: `${currentStepData.color}30`,
                }
              ]}
            >
              {currentStepData.icon}
            </Animated.View>
            
            {/* Subtle Glow Effect */}
            <Animated.View
              style={[
                styles.iconGlow,
                {
                  opacity: glowOpacity,
                  backgroundColor: currentStepData.color,
                }
              ]}
            />
          </View>

          {/* Text Content */}
          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity 
          style={[
            styles.ctaButton, 
            { 
              backgroundColor: currentStepData.color,
              shadowColor: currentStepData.color,
            }
          ]} 
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaText}>
            {currentStep === onboardingSteps.length - 1 ? 'Begin Journey' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  neuralBackground: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    top: -width * 0.4,
    left: -width * 0.25,
    borderWidth: 0.5,
    borderColor: 'rgba(125, 211, 252, 0.1)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: 60,
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeProgressDot: {
    width: 24,
  },
  mainCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    marginBottom: 60,
    width: '100%',
    maxWidth: 320,
  },
  iconContainer: {
    marginBottom: 32,
    position: 'relative',
  },
  iconOrb: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  iconGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.3,
    top: -10,
    left: -10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  ctaButton: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    maxWidth: 280,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

export default OnboardingScreen;