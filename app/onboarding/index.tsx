import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Wind, Waves, Sun, Moon, Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animations] = useState({
    breathe: new Animated.Value(1),
    rotate: new Animated.Value(0),
    fade: new Animated.Value(0)
  });

  useEffect(() => {
    // Breathing animation
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

    // Rotation animation
    Animated.loop(
      Animated.timing(animations.rotate, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Fade in animation
    Animated.timing(animations.fade, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const onboardingSteps = [
    {
      title: "Welcome to Atmos",
      subtitle: "Your conscious living companion for mindful harmony",
      icon: <Sparkles size={48} color="#7dd3fc" strokeWidth={1.5} />,
      color: '#7dd3fc'
    },
    {
      title: "Breathe with the World",
      subtitle: "Sync with air quality, weather, and ambient sounds",
      icon: <Wind size={48} color="#10b981" strokeWidth={1.5} />,
      color: '#10b981'
    },
    {
      title: "Find Your Rhythm",
      subtitle: "Discover calm zones and sacred spaces for renewal",
      icon: <Sun size={48} color="#f59e0b" strokeWidth={1.5} />,
      color: '#f59e0b'
    },
    {
      title: "Voice-First Wisdom",
      subtitle: "Speak your reflections, receive gentle guidance",
      icon: <Moon size={48} color="#a78bfa" strokeWidth={1.5} />,
      color: '#a78bfa'
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

  const spin = animations.rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <LinearGradient
      colors={['#0f0f23', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.backgroundOrb,
          {
            transform: [
              { scale: animations.breathe },
              { rotate: spin }
            ],
            backgroundColor: `${currentStepData.color}10`,
          }
        ]}
      />
      
      <Animated.View 
        style={[
          styles.content,
          { opacity: animations.fade }
        ]}
      >
        <View style={styles.iconContainer}>
          <Animated.View 
            style={[
              styles.iconCircle,
              {
                transform: [{ scale: animations.breathe }],
                backgroundColor: `${currentStepData.color}15`,
                borderColor: `${currentStepData.color}30`,
              }
            ]}
          >
            {currentStepData.icon}
          </Animated.View>
          <Animated.View
            style={[
              styles.iconGlow,
              {
                opacity: animations.glow,
                shadowColor: currentStepData.color,
              }
            ]}
          />
        </View>

        <Text style={styles.title}>{currentStepData.title}</Text>
        <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>

        <View style={styles.indicators}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentStep && [styles.activeIndicator, { backgroundColor: currentStepData.color }]
              ]}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.nextButton, { borderColor: `${currentStepData.color}40` }]} 
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Continue'}
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
  backgroundOrb: {
    position: 'absolute',
    width: width * 2,
    height: width * 2,
    borderRadius: width,
    top: -width * 0.8,
    left: -width * 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 50,
    position: 'relative',
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  iconGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 15,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Light',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
    marginBottom: 50,
    letterSpacing: 0.2,
  },
  indicators: {
    flexDirection: 'row',
    marginBottom: 50,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginHorizontal: 3,
  },
  activeIndicator: {
    width: 20,
    borderRadius: 3,
  },
  nextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

export default OnboardingScreen;