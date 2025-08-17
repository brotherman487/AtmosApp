import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Brain, Heart, Wind, Activity, Zap } from 'lucide-react-native';
import { hapticFeedback } from '../../utils/haptics';
import { AIInsight, SensorData } from '../../types';
import { aiInsightsService } from '../../services/aiInsightsService';
import { wearableService } from '../../services/wearableService';

const { width } = Dimensions.get('window');

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  type?: 'insight' | 'nudge' | 'warning' | 'optimization';
  sensorData?: Partial<SensorData>;
}

const MessagesScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentInsights, setCurrentInsights] = useState<AIInsight[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Initialize with AI insights
    initializeAICompanion();
    
    // Subscribe to real-time sensor data for AI insights
    const unsubscribe = wearableService.subscribe((sensorData: SensorData) => {
      const historicalData = wearableService.getHistoricalData(100);
      const newInsights = aiInsightsService.generateInsights(sensorData, historicalData);
      
      if (newInsights.length > 0) {
        setCurrentInsights(prev => [...newInsights, ...prev]);
        // Add critical insights as bot messages
        const criticalInsights = newInsights.filter(insight => insight.priority === 'critical' || insight.priority === 'high');
        criticalInsights.forEach(insight => {
          addBotMessage(insight.content, 'warning', sensorData);
        });
      }
    });

    return unsubscribe;
  }, []);

  const initializeAICompanion = () => {
    const welcomeMessages: Message[] = [
      {
        id: 1,
        text: "Hello! I'm your Atmos AI companion. I'm here to help you optimize your health, safety, and longevity through real-time insights from your wearable sensors.",
        sender: 'bot',
        timestamp: Date.now(),
        type: 'insight'
      },
      {
        id: 2,
        text: "I'll analyze your stress levels, heart rate, air quality, and movement patterns to provide personalized recommendations. How can I assist you today?",
        sender: 'bot',
        timestamp: Date.now(),
        type: 'insight'
      }
    ];
    setMessages(welcomeMessages);
  };

  const addBotMessage = (text: string, type: Message['type'] = 'insight', sensorData?: Partial<SensorData>) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      sender: 'bot',
      timestamp: Date.now(),
      type,
      sensorData
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;
    
    hapticFeedback.light();
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    // Simulate AI processing and response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userInput);
      addBotMessage(aiResponse.text, aiResponse.type, aiResponse.sensorData);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    // Health-related queries
    if (input.includes('stress') || input.includes('anxiety')) {
      const latestData = wearableService.getLatestData();
      if (latestData && latestData.stressIndex > 60) {
        return {
          text: `I can see your stress level is currently ${latestData.stressIndex}%, which is elevated. Let me suggest a quick 2-minute breathing exercise to help you find calm. Would you like me to guide you through it?`,
          type: 'warning' as const,
          sensorData: { stressIndex: latestData.stressIndex }
        };
      }
      return {
        text: "Your stress levels are within a healthy range. Is there something specific you'd like to discuss or work on?",
        type: 'insight' as const
      };
    }
    
    if (input.includes('heart') || input.includes('pulse')) {
      const latestData = wearableService.getLatestData();
      if (latestData) {
        return {
          text: `Your current heart rate is ${Math.round(latestData.heartRate)} BPM. This is ${latestData.heartRate > 80 ? 'elevated' : 'normal'} for your current activity level. ${latestData.heartRate > 80 ? 'Consider taking a moment to breathe deeply.' : 'You are doing great!'}`,
          type: 'insight' as const,
          sensorData: { heartRate: latestData.heartRate }
        };
      }
    }
    
    if (input.includes('air') || input.includes('quality')) {
      const latestData = wearableService.getLatestData();
      if (latestData) {
        const quality = latestData.airQuality > 70 ? 'good' : latestData.airQuality > 50 ? 'moderate' : 'poor';
        return {
          text: `Current air quality is ${latestData.airQuality} AQI, which is ${quality}. ${latestData.airQuality < 50 ? 'Consider moving to a better ventilated area or wearing a mask.' : 'The environment is supportive for your activities.'}`,
          type: 'insight' as const,
          sensorData: { airQuality: latestData.airQuality }
        };
      }
    }
    
    if (input.includes('energy') || input.includes('tired')) {
      const latestData = wearableService.getLatestData();
      if (latestData) {
        const energyLevel = 100 - latestData.stressIndex;
        return {
          text: `Based on your current stress levels, your energy is at about ${energyLevel}%. ${energyLevel < 40 ? 'You might benefit from a short walk or some gentle movement to boost your energy.' : 'Your energy levels are good for focused work.'}`,
          type: 'optimization' as const,
          sensorData: { stressIndex: latestData.stressIndex }
        };
      }
    }
    
    // Default response
    return {
      text: "I'm here to help you optimize your well-being. You can ask me about your stress levels, heart rate, air quality, energy levels, or any other health concerns. What would you like to know?",
      type: 'insight' as const
    };
  };

  const getTypeColor = (type: Message['type']) => {
    switch (type) {
      case 'warning':
        return '#ef4444';
      case 'optimization':
        return '#10b981';
      case 'nudge':
        return '#f59e0b';
      default:
        return '#7dd3fc';
    }
  };

  const Content = (
    <View style={styles.flexColumn}>
      {/* Top Bar with Exit Arrow */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => {
          hapticFeedback.light();
          router.back();
        }} style={styles.backButton}>
          <ArrowLeft size={24} color="#7dd3fc" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>AI Companion</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView style={styles.messagesContainer} contentContainerStyle={{ padding: 20, flexGrow: 1, paddingBottom: 80 }}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userBubble : styles.botBubble,
            ]}
          >
            {msg.type && msg.type !== 'insight' && (
              <View style={styles.messageTypeIndicator}>
                {msg.type === 'warning' && <Zap size={14} color="#ef4444" />}
                {msg.type === 'optimization' && <Brain size={14} color="#10b981" />}
                {msg.type === 'nudge' && <Heart size={14} color="#f59e0b" />}
                <Text style={[styles.messageTypeText, { color: getTypeColor(msg.type) }]}>
                  {msg.type.toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.messageText}>{msg.text}</Text>
            {msg.sensorData && (
              <View style={styles.sensorDataPreview}>
                {msg.sensorData.stressIndex && (
                  <View style={styles.sensorItem}>
                    <Brain size={12} color="#a855f7" />
                    <Text style={styles.sensorText}>Stress: {Math.round(msg.sensorData.stressIndex)}%</Text>
                  </View>
                )}
                {msg.sensorData.heartRate && (
                  <View style={styles.sensorItem}>
                    <Heart size={12} color="#ef4444" />
                    <Text style={styles.sensorText}>HR: {Math.round(msg.sensorData.heartRate)} BPM</Text>
                  </View>
                )}
                {msg.sensorData.airQuality && (
                  <View style={styles.sensorItem}>
                    <Wind size={12} color="#10b981" />
                    <Text style={styles.sensorText}>AQI: {Math.round(msg.sensorData.airQuality)}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}
        {isTyping && (
          <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>Atmos is typing</Text>
              <View style={styles.typingDots}>
                <View style={[styles.dot, { backgroundColor: '#7dd3fc' }]} />
                <View style={[styles.dot, { backgroundColor: '#7dd3fc' }]} />
                <View style={[styles.dot, { backgroundColor: '#7dd3fc' }]} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <View style={[styles.inputBar, { marginBottom: 12 }]}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask Atmos anything..."
          placeholderTextColor="#7dd3fc99"
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Send size={22} color="#0f0f23" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#0f0f23', '#1a1a2e', '#16213e']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {Platform.OS === 'ios' || Platform.OS === 'android' ? (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            {Content}
          </KeyboardAvoidingView>
        ) : (
          Content
        )}
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
  flexColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 16 : 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(125, 211, 252, 0.08)',
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    zIndex: 2,
  },
  backButton: {
    padding: 4,
    width: 32,
    alignItems: 'flex-start',
  },
  topBarTitle: {
    color: '#7dd3fc',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  userBubble: {
    backgroundColor: 'rgba(125, 211, 252, 0.25)',
    alignSelf: 'flex-end',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  botBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    alignSelf: 'flex-start',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.98)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(125, 211, 252, 0.08)',
    borderRadius: 18,
    margin: 8,
    boxShadow: '0px 0px 12px rgba(125, 211, 252, 0.10)',
    elevation: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.13)',
  },
  sendButton: {
    backgroundColor: '#7dd3fc',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 0px 8px rgba(125, 211, 252, 0.15)',
    elevation: 4,
  },
  messageTypeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  messageTypeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sensorDataPreview: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.2)',
  },
  sensorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sensorText: {
    color: '#7dd3fc',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
  typingBubble: {
    opacity: 0.7,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    color: '#7dd3fc',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
});

export default MessagesScreen; 