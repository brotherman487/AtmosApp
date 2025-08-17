import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MessageCircle, Zap, Smartphone, Sun, Moon, Activity, Heart, Brain } from 'lucide-react-native';
import { useOnboarding } from '../../hooks/useOnboarding';

const SetupScreen = () => {
  const { completeOnboarding } = useOnboarding();
  const [preferences, setPreferences] = useState({
    nudgeStyle: 'voice',
    rhythmPreference: 'morning',
    globalConsciousness: true
  });

  const [animations] = useState({
    fade: new Animated.Value(0),
    slide: new Animated.Value(50),
    sync: new Animated.Value(0),
    orb1: new Animated.Value(0),
    orb2: new Animated.Value(0)
  });

  useEffect(() => {
    // Fade in animation
    Animated.timing(animations.fade, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Slide up animation
    Animated.timing(animations.slide, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Orb synchronization animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(animations.orb1, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animations.orb2, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(animations.orb1, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(animations.orb2, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Sync pulse animation
    Animated.loop(
      Animated.timing(animations.sync, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const nudgeStyles = [
    {
      key: 'voice',
      title: 'Voice Intelligence',
      description: 'Your AI speaks wisdom directly to you',
      icon: <MessageCircle size={24} color="#ffffff" strokeWidth={1.5} />,
      color: '#4ade80',
    },
    {
      key: 'haptic',
      title: 'Tactile Awareness',
      description: 'Gentle pulses with intelligent guidance',
      icon: <Zap size={24} color="#ffffff" strokeWidth={1.5} />,
      color: '#60a5fa',
    },
    {
      key: 'app',
      title: 'Visual Intelligence',
      description: 'Elegant visualizations and insights',
      icon: <Smartphone size={24} color="#ffffff" strokeWidth={1.5} />,
      color: '#a855f7',
    }
  ];

  const rhythmPreferences = [
    {
      key: 'morning',
      title: 'Morning Energy',
      description: 'Peak with your early vitality',
      icon: <Sun size={24} color="#ffffff" strokeWidth={1.5} />,
      color: '#f59e0b',
    },
    {
      key: 'evening',
      title: 'Evening Flow',
      description: 'Align with your night rhythms',
      icon: <Moon size={24} color="#ffffff" strokeWidth={1.5} />,
      color: '#8b5cf6',
    },
    {
      key: 'balanced',
      title: 'Balanced Harmony',
      description: 'Adapt throughout your day',
      icon: <Activity size={24} color="#ffffff" strokeWidth={1.5} />,
      color: '#10b981',
    }
  ];

  const handlePreferenceChange = (type: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleFinish = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const syncScale = animations.sync.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1]
  });

  const orb1Scale = animations.orb1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2]
  });

  const orb2Scale = animations.orb2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2]
  });

  return (
    <LinearGradient
      colors={['#0f0f23', '#1a1a2e', '#16213e'] as const}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: animations.fade,
            transform: [{ translateY: animations.slide }]
          }
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Teach Your AI Companion</Text>
            <Text style={styles.subtitle}>
              Help your AI understand your preferences and create a symbiotic connection
            </Text>
          </View>

          {/* Nudge Style Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How should your AI guide you?</Text>
            <View style={styles.optionsGrid}>
              {nudgeStyles.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionCard,
                    preferences.nudgeStyle === option.key && [
                      styles.optionCardActive,
                      { borderColor: option.color }
                    ]
                  ]}
                  onPress={() => handlePreferenceChange('nudgeStyle', option.key)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                    {option.icon}
                  </View>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rhythm Preference */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>When does your consciousness peak?</Text>
            <View style={styles.optionsGrid}>
              {rhythmPreferences.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.optionCard,
                    preferences.rhythmPreference === option.key && [
                      styles.optionCardActive,
                      { borderColor: option.color }
                    ]
                  ]}
                  onPress={() => handlePreferenceChange('rhythmPreference', option.key)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                    {option.icon}
                  </View>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Symbiotic Connection Visualization */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Symbiotic Connection</Text>
            <View style={styles.connectionVisual}>
              <Animated.View 
                style={[
                  styles.userOrb,
                  { transform: [{ scale: orb1Scale }] }
                ]}
              >
                <Heart size={24} color="#ffffff" strokeWidth={1.5} />
              </Animated.View>
              
              <Animated.View 
                style={[
                  styles.connectionLine,
                  { transform: [{ scale: syncScale }] }
                ]}
              />
              
              <Animated.View 
                style={[
                  styles.aiOrb,
                  { transform: [{ scale: orb2Scale }] }
                ]}
              >
                <Brain size={24} color="#ffffff" strokeWidth={1.5} />
              </Animated.View>
            </View>
            <Text style={styles.connectionText}>
              Your AI is learning to sync with your rhythms and consciousness
            </Text>
          </View>

          {/* CTA Button */}
          <TouchableOpacity 
            style={styles.ctaButton} 
            onPress={handleFinish}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaText}>Begin Your Symbiotic Journey</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
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
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsGrid: {
    gap: 16,
  },
  optionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    alignItems: 'center',
  },
  optionCardActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 2,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  connectionVisual: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  userOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 2,
    borderColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionLine: {
    width: 60,
    height: 2,
    backgroundColor: '#7dd3fc',
    borderRadius: 1,
  },
  aiOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(125, 211, 252, 0.2)',
    borderWidth: 2,
    borderColor: '#7dd3fc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: '#7dd3fc',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 40,
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

export default SetupScreen;