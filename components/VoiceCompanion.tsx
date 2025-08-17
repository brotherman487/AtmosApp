import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, MicOff, Volume2, Brain, Heart, Zap, MessageCircle, AlertTriangle } from 'lucide-react-native';
import { VoiceCommand } from '../types';

const { width } = Dimensions.get('window');

interface VoiceCompanionProps {
  onVoiceCommand?: (command: string) => void;
  onEmergencyCheck?: () => void;
}

const VoiceCompanion: React.FC<VoiceCompanionProps> = ({ 
  onVoiceCommand, 
  onEmergencyCheck 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [animations] = useState({
    pulse: new Animated.Value(1),
    glow: new Animated.Value(0.3),
    wave: new Animated.Value(0),
  });

  useEffect(() => {
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.pulse, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animations.pulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.glow, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(animations.glow, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const startListening = () => {
    setIsListening(true);
    setIsProcessing(false);
    
    // Start wave animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.wave, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.wave, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate voice processing
    setTimeout(() => {
      setIsListening(false);
      setIsProcessing(true);
      
      // Simulate command processing
      setTimeout(() => {
        setIsProcessing(false);
        const mockCommand: VoiceCommand = {
          id: Date.now().toString(),
          command: "How am I feeling right now?",
          response: "Based on your current sensor data, you're experiencing moderate stress levels. Your heart rate is elevated and movement is low. I recommend taking a 2-minute breathing break.",
          timestamp: Date.now(),
          context: 'health'
        };
        setLastCommand(mockCommand);
        onVoiceCommand?.(mockCommand.command);
      }, 2000);
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(false);
    animations.wave.stopAnimation();
  };

  const handleEmergencyCheck = () => {
    onEmergencyCheck?.();
  };

  const quickCommands = [
    {
      icon: <Heart size={20} color="#ef4444" />,
      title: 'Health Check',
      command: 'How is my health right now?',
      color: '#ef4444'
    },
    {
      icon: <Brain size={20} color="#a855f7" />,
      title: 'Stress Level',
      command: 'What\'s my current stress level?',
      color: '#a855f7'
    },
    {
      icon: <Zap size={20} color="#f59e0b" />,
      title: 'Energy Boost',
      command: 'Give me an energy boost',
      color: '#f59e0b'
    },
    {
      icon: <MessageCircle size={20} color="#10b981" />,
      title: 'Motivation',
      command: 'I need motivation',
      color: '#10b981'
    }
  ];

  const renderQuickCommand = (cmd: typeof quickCommands[0], index: number) => (
    <TouchableOpacity
      key={index}
      style={[styles.quickCommand, { borderColor: cmd.color + '40' }]}
      onPress={() => onVoiceCommand?.(cmd.command)}
      activeOpacity={0.7}
    >
      <View style={styles.quickCommandIcon}>
        {cmd.icon}
      </View>
      <Text style={styles.quickCommandTitle}>{cmd.title}</Text>
    </TouchableOpacity>
  );

  const renderVoiceButton = () => {
    if (isProcessing) {
      return (
        <Animated.View style={[styles.voiceButton, styles.processingButton]}>
          <Brain size={32} color="#a855f7" />
          <Text style={styles.processingText}>Processing...</Text>
        </Animated.View>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.voiceButton,
          isListening ? styles.listeningButton : styles.defaultButton
        ]}
        onPress={isListening ? stopListening : startListening}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale: isListening ? animations.pulse : 1 }] }}>
          {isListening ? (
            <Mic size={32} color="#ef4444" />
          ) : (
            <Mic size={32} color="#7dd3fc" />
          )}
        </Animated.View>
        
        {isListening && (
          <Animated.View 
            style={[
              styles.listeningWaves,
              { transform: [{ scale: animations.wave }] }
            ]} 
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(125, 211, 252, 0.1)', 'rgba(125, 211, 252, 0.05)', 'transparent']}
        style={styles.background}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Voice Companion</Text>
        <Text style={styles.subtitle}>Your AI voice assistant</Text>
      </View>

      {/* Main Voice Button */}
      <View style={styles.voiceButtonContainer}>
        {renderVoiceButton()}
        
        <Text style={styles.voiceButtonLabel}>
          {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Tap to speak'}
        </Text>
      </View>

      {/* Quick Commands */}
      <View style={styles.quickCommandsSection}>
        <Text style={styles.sectionTitle}>Quick Commands</Text>
        <View style={styles.quickCommandsGrid}>
          {quickCommands.map(renderQuickCommand)}
        </View>
      </View>

      {/* Emergency Check */}
      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={handleEmergencyCheck}
        activeOpacity={0.7}
      >
        <AlertTriangle size={20} color="#ef4444" />
        <Text style={styles.emergencyButtonText}>Emergency Health Check</Text>
      </TouchableOpacity>

      {/* Last Command Response */}
      {lastCommand && (
        <View style={styles.lastCommandContainer}>
          <Text style={styles.lastCommandTitle}>Last Response</Text>
          <View style={styles.lastCommandContent}>
            <Text style={styles.lastCommandText}>{lastCommand.response}</Text>
            <Text style={styles.lastCommandTime}>
              {new Date(lastCommand.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#7dd3fc',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
  voiceButtonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  voiceButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  defaultButton: {
    backgroundColor: 'rgba(125, 211, 252, 0.2)',
    borderWidth: 2,
    borderColor: '#7dd3fc',
  },
  listeningButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  processingButton: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderWidth: 2,
    borderColor: '#a855f7',
  },
  listeningWaves: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#ef4444',
    opacity: 0.6,
  },
  voiceButtonLabel: {
    color: '#7dd3fc',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  processingText: {
    color: '#a855f7',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
  },
  quickCommandsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  quickCommandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickCommand: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 80,
  },
  quickCommandIcon: {
    marginBottom: 8,
  },
  quickCommandTitle: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 24,
    gap: 8,
  },
  emergencyButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  lastCommandContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.2)',
  },
  lastCommandTitle: {
    color: '#7dd3fc',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  lastCommandContent: {
    gap: 8,
  },
  lastCommandText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  lastCommandTime: {
    color: '#7dd3fc',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    opacity: 0.7,
  },
});

export default VoiceCompanion; 