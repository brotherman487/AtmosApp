import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Mic, Heart, Brain, Wind, Sparkles, MessageCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const NudgesScreen = () => {
  const [activeInsight, setActiveInsight] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [animations] = useState({
    glow: new Animated.Value(0.3),
    pulse: new Animated.Value(1),
  });

  const insightData = [
    {
      id: 1,
      type: 'reflection',
      timestamp: '3 minutes ago',
      title: 'Morning Reflection',
      content: "What intention will guide your day?",
      response: "To move through the world with gentle awareness, like water finding its natural path.",
      icon: <Heart size={18} color="#f472b6" strokeWidth={1.5} />,
      mood: 'grateful',
      color: '#f472b6'
    },
    {
      id: 2,
      type: 'insight',
      timestamp: '1 hour ago',
      title: 'Rhythm Insight',
      content: "Your energy is perfectly aligned with the morning light. The air quality is pristine - ideal for mindful movement.",
      icon: <Brain size={18} color="#10b981" strokeWidth={1.5} />,
      mood: 'focused',
      color: '#10b981'
    },
    {
      id: 3,
      type: 'nudge',
      timestamp: '2 hours ago',
      title: 'Breathing Space',
      content: "Take three conscious breaths. Feel the exceptional air quality around you - 92 AQI.",
      icon: <Wind size={18} color="#7dd3fc" strokeWidth={1.5} />,
      mood: 'calm',
      color: '#7dd3fc'
    },
    {
      id: 4,
      type: 'wisdom',
      timestamp: 'Yesterday evening',
      title: 'Evening Wisdom',
      content: "How did your rhythm feel today?",
      response: "Like a gentle dance with the elements. I felt most alive during the golden hour walk by the river.",
      icon: <Sparkles size={18} color="#a78bfa" strokeWidth={1.5} />,
      mood: 'peaceful',
      color: '#a78bfa'
    }
  ];

  useEffect(() => {
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
  }, []);

  const handleVoiceReflection = () => {
    setIsRecording(!isRecording);
    setTimeout(() => setIsRecording(false), 3000);
  };

  const handleInsightPress = (id) => {
    setActiveInsight(activeInsight === id ? null : id);
  };

  return (
    <LinearGradient
      colors={['#0f0f23', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Insights</Text>
          <Text style={styles.subtitle}>Your inner wisdom stream</Text>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Voice Reflection Card */}
          <TouchableOpacity
            style={[
              styles.voiceCard,
              isRecording && styles.voiceCardActive
            ]}
            onPress={handleVoiceReflection}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.voiceGlow,
                {
                  opacity: isRecording ? animations.glow : 0.2,
                  shadowColor: '#7dd3fc',
                }
              ]}
            />
            <View style={styles.voiceIconContainer}>
              <Mic size={22} color="#ffffff" strokeWidth={1.5} />
            </View>
            <View style={styles.voiceTextContainer}>
              <Text style={styles.voiceTitle}>
                {isRecording ? 'Listening to your heart...' : 'Share a reflection'}
              </Text>
              <Text style={styles.voiceSubtitle}>
                {isRecording ? 'Speak your truth' : 'What moved you today?'}
              </Text>
            </View>
            {isRecording && (
              <View style={styles.waveform}>
                <View style={[styles.wave, { height: 12 }]} />
                <View style={[styles.wave, { height: 20 }]} />
                <View style={[styles.wave, { height: 8 }]} />
                <View style={[styles.wave, { height: 16 }]} />
                <View style={[styles.wave, { height: 6 }]} />
              </View>
            )}
          </TouchableOpacity>

          {/* Insights Feed */}
          <View style={styles.feedContainer}>
            <Text style={styles.feedTitle}>Recent Insights</Text>
            
            {insightData.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.insightCard,
                  activeInsight === item.id && styles.insightCardActive
                ]}
                onPress={() => handleInsightPress(item.id)}
                activeOpacity={0.9}
              >
                <View style={styles.insightHeader}>
                  <View style={[styles.insightIcon, { backgroundColor: `${item.color}20` }]}>
                    {item.icon}
                  </View>
                  <View style={styles.insightInfo}>
                    <Text style={styles.insightTitle}>{item.title}</Text>
                    <Text style={styles.insightTimestamp}>{item.timestamp}</Text>
                  </View>
                  <View style={[
                    styles.moodIndicator,
                    { backgroundColor: item.color }
                  ]} />
                </View>
                
                <Text style={styles.insightContent}>{item.content}</Text>
                
                {item.response && activeInsight === item.id && (
                  <View style={styles.responseContainer}>
                    <View style={styles.responseIcon}>
                      <MessageCircle size={14} color={item.color} strokeWidth={1.5} />
                    </View>
                    <Text style={[styles.responseText, { color: item.color }]}>
                      "{item.response}"
                    </Text>
                  </View>
                )}

                {activeInsight === item.id && (
                  <View style={styles.insightActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Heart size={14} color="rgba(255, 255, 255, 0.6)" strokeWidth={1.5} />
                      <Text style={styles.actionText}>Reflect</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Zap size={14} color="rgba(255, 255, 255, 0.6)" strokeWidth={1.5} />
                      <Text style={styles.actionText}>Apply</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Wisdom Prompt */}
          <View style={styles.wisdomPrompt}>
            <View style={styles.wisdomHeader}>
              <Sparkles size={16} color="#f59e0b" strokeWidth={1.5} />
              <Text style={styles.wisdomTitle}>Evening Reflection</Text>
            </View>
            <Text style={styles.wisdomText}>
              As the day settles, what moment brought you closest to your authentic self?
            </Text>
            <TouchableOpacity style={styles.wisdomButton}>
              <Text style={styles.wisdomButtonText}>Reflect Now</Text>
            </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Light',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  voiceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  voiceCardActive: {
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
    borderColor: 'rgba(125, 211, 252, 0.3)',
  },
  voiceGlow: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 25,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  voiceIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  voiceTextContainer: {
    flex: 1,
  },
  voiceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  voiceSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.1,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  wave: {
    width: 2,
    backgroundColor: '#7dd3fc',
    marginHorizontal: 1,
    borderRadius: 1,
    opacity: 0.8,
  },
  feedContainer: {
    marginBottom: 40,
  },
  feedTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  insightCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  insightCardActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightInfo: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  insightTimestamp: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.2,
  },
  moodIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  insightContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 22,
    marginBottom: 12,
    letterSpacing: 0.1,
  },
  responseContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(125, 211, 252, 0.5)',
  },
  responseIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  responseText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    fontStyle: 'italic',
    letterSpacing: 0.1,
  },
  insightActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 6,
    letterSpacing: 0.2,
  },
  wisdomPrompt: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    marginBottom: 20,
  },
  wisdomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wisdomTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#f59e0b',
    marginLeft: 8,
    letterSpacing: -0.2,
  },
  wisdomText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 22,
    marginBottom: 16,
    letterSpacing: 0.1,
  },
  wisdomButton: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  wisdomButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#f59e0b',
    letterSpacing: 0.2,
  },
});

export default NudgesScreen;