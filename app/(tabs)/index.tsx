import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wind, Droplets, Sun, Volume2, Mic, Heart, Brain } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const [rhythmScore, setRhythmScore] = useState(87);
  const [isListening, setIsListening] = useState(false);
  const [animations] = useState({
    aura: new Animated.Value(1),
    pulse: new Animated.Value(1),
    glow: new Animated.Value(0.3),
    breathe: new Animated.Value(1),
  });

  const environmentalData = {
    airQuality: { value: 92, status: 'Excellent', color: '#10b981' },
    noise: { value: 28, status: 'Serene', color: '#7dd3fc' },
    weather: { value: 21, status: 'Perfect', color: '#f59e0b' },
    humidity: { value: 45, status: 'Ideal', color: '#a78bfa' },
  };

  const timeOfDay = new Date().getHours();
  const greeting = timeOfDay < 12 ? 'Good Morning' : timeOfDay < 17 ? 'Good Afternoon' : 'Good Evening';

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

    // Breathing animation for environmental cards
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.breathe, {
          toValue: 1.02,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(animations.breathe, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleVoicePress = () => {
    setIsListening(!isListening);
    
    if (Platform.OS !== 'web') {
      // Haptic feedback would go here for native platforms
    }
    
    // Simulate voice interaction
    setTimeout(() => setIsListening(false), 3000);
  };

  const getRhythmColor = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    if (score >= 50) return '#f97316';
    return '#ef4444';
  };

  const getTimeBasedGradient = () => {
    if (timeOfDay < 6) return ['#0f0f23', '#1a1a2e', '#16213e']; // Deep night
    if (timeOfDay < 12) return ['#1a1a2e', '#2563eb', '#3b82f6']; // Morning
    if (timeOfDay < 17) return ['#1e293b', '#0ea5e9', '#06b6d4']; // Afternoon
    return ['#0f0f23', '#7c3aed', '#a855f7']; // Evening
  };

  return (
    <LinearGradient
      colors={getTimeBasedGradient()}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.statusText}>You're in perfect rhythm with the world</Text>
          </View>

          {/* Rhythm Ring */}
          <View style={styles.rhythmContainer}>
            <Animated.View
              style={[
                styles.rhythmRing,
                {
                  transform: [{ scale: animations.aura }],
                }
              ]}
            >
              <Animated.View
                style={[
                  styles.rhythmGlow,
                  {
                    opacity: animations.glow,
                    shadowColor: getRhythmColor(rhythmScore),
                  }
                ]}
              />
              <View style={[styles.rhythmInner, { borderColor: getRhythmColor(rhythmScore) }]}>
                <Text style={[styles.rhythmScore, { color: getRhythmColor(rhythmScore) }]}>
                  {rhythmScore}
                </Text>
                <Text style={styles.rhythmLabel}>Rhythm Score</Text>
                <View style={styles.rhythmIndicator}>
                  <Heart size={12} color={getRhythmColor(rhythmScore)} strokeWidth={1.5} />
                  <Text style={[styles.rhythmStatus, { color: getRhythmColor(rhythmScore) }]}>
                    Excellent
                  </Text>
                </View>
              </View>
            </Animated.View>
          </View>

          {/* Environmental Metrics */}
          <View style={styles.metricsGrid}>
            <Animated.View style={[styles.metricCard, { transform: [{ scale: animations.breathe }] }]}>
              <View style={styles.metricHeader}>
                <Wind size={16} color={environmentalData.airQuality.color} strokeWidth={1.5} />
                <Text style={styles.metricLabel}>Air Quality</Text>
              </View>
              <Text style={[styles.metricValue, { color: environmentalData.airQuality.color }]}>
                {environmentalData.airQuality.value}
              </Text>
              <Text style={styles.metricStatus}>{environmentalData.airQuality.status}</Text>
            </Animated.View>

            <Animated.View style={[styles.metricCard, { transform: [{ scale: animations.breathe }] }]}>
              <View style={styles.metricHeader}>
                <Volume2 size={16} color={environmentalData.noise.color} strokeWidth={1.5} />
                <Text style={styles.metricLabel}>Noise Level</Text>
              </View>
              <Text style={[styles.metricValue, { color: environmentalData.noise.color }]}>
                {environmentalData.noise.value}dB
              </Text>
              <Text style={styles.metricStatus}>{environmentalData.noise.status}</Text>
            </Animated.View>

            <Animated.View style={[styles.metricCard, { transform: [{ scale: animations.breathe }] }]}>
              <View style={styles.metricHeader}>
                <Sun size={16} color={environmentalData.weather.color} strokeWidth={1.5} />
                <Text style={styles.metricLabel}>Temperature</Text>
              </View>
              <Text style={[styles.metricValue, { color: environmentalData.weather.color }]}>
                {environmentalData.weather.value}°C
              </Text>
              <Text style={styles.metricStatus}>{environmentalData.weather.status}</Text>
            </Animated.View>

            <Animated.View style={[styles.metricCard, { transform: [{ scale: animations.breathe }] }]}>
              <View style={styles.metricHeader}>
                <Droplets size={16} color={environmentalData.humidity.color} strokeWidth={1.5} />
                <Text style={styles.metricLabel}>Humidity</Text>
              </View>
              <Text style={[styles.metricValue, { color: environmentalData.humidity.color }]}>
                {environmentalData.humidity.value}%
              </Text>
              <Text style={styles.metricStatus}>{environmentalData.humidity.status}</Text>
            </Animated.View>
          </View>

          {/* Voice Interaction */}
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isListening && styles.voiceButtonActive
            ]}
            onPress={handleVoicePress}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.voiceIcon,
                {
                  transform: [{ scale: isListening ? animations.pulse : 1 }]
                }
              ]}
            >
              <Mic size={20} color="#ffffff" strokeWidth={1.5} />
            </Animated.View>
            <Text style={styles.voiceText}>
              {isListening ? 'Listening to your soul...' : 'Share a reflection'}
            </Text>
            {isListening && (
              <View style={styles.listeningIndicator}>
                <View style={[styles.wave, { animationDelay: '0ms' }]} />
                <View style={[styles.wave, { animationDelay: '150ms' }]} />
                <View style={[styles.wave, { animationDelay: '300ms' }]} />
              </View>
            )}
          </TouchableOpacity>

          {/* Today's Wisdom */}
          <View style={styles.wisdomContainer}>
            <View style={styles.wisdomHeader}>
              <Brain size={18} color="#7dd3fc" strokeWidth={1.5} />
              <Text style={styles.wisdomTitle}>Today's Wisdom</Text>
            </View>
            
            <View style={styles.wisdomCard}>
              <Text style={styles.wisdomText}>
                Your rhythm is strongest during the golden hour. The air quality peaks at 92 - perfect for mindful movement.
              </Text>
            </View>
            
            <View style={styles.wisdomCard}>
              <Text style={styles.wisdomText}>
                Your body craves stillness between 2-4 PM. Honor this natural dip with gentle breathing.
              </Text>
            </View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Account for tab bar
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Light',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  statusText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    letterSpacing: 0.2,
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 6,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  metricStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.2,
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
});

export default HomeScreen;