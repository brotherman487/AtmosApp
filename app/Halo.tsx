import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated, Dimensions, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { ArrowLeft, Mic } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { hapticFeedback } from '../utils/haptics';

const haloLogo = require('../assets/splash-logo.png');
const { width } = Dimensions.get('window');

const messages = [
  { from: 'atmos', text: 'Take a deep breath. How are you feeling right now?' },
  { from: 'user', text: 'A bit anxious, but hopeful.' },
  { from: 'atmos', text: 'The world is quiet. Would you like a calming soundscape?' },
];

export default function Halo() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const glowAnim = useRef(new Animated.Value(0.7)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1800, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0.7, duration: 1800, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const handleBack = () => {
    hapticFeedback.light();
    router.back();
  };
  
  const micAnim = useRef(new Animated.Value(0)).current;
  const handleMic = () => {
    hapticFeedback.medium();
    setIsListening(!isListening);
    
    Animated.sequence([
      Animated.timing(micAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(micAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      })
    ]).start();
    
    if (!isListening) {
      Alert.alert('Voice Input', 'Voice recognition coming soon!');
    }
  };
  
  const handleQuickReply = (reply: string) => {
    hapticFeedback.light();
    setInputText(reply);
    
    if (reply === 'Yes') {
      Alert.alert('Calming Soundscape', 'Opening peaceful ambient sounds...');
    } else if (reply === 'Tell me more') {
      Alert.alert('Mindful Guidance', 'I\'m here to help you find peace and balance.');
    } else if (reply === 'Dismiss') {
      setInputText('');
    }
  };

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#111827"]}
      style={styles.bg}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleBack} accessibilityLabel="Back">
          <ArrowLeft size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={handleMic} accessibilityLabel="Voice Input">
          <Mic size={24} color="#7dd3fc" />
        </TouchableOpacity>
      </View>
      {/* Chat */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.chat} contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
          {messages.map((msg, i) =>
            msg.from === 'atmos' ? (
              <View key={i} style={styles.atmosMsgWrap}>
                <Animated.View style={[styles.atmosMsg, { opacity: glowAnim }]}> 
                  <Text style={styles.atmosMsgText}>{msg.text}</Text>
                </Animated.View>
              </View>
            ) : (
              <View key={i} style={styles.userMsgWrap}>
                <View style={styles.userMsg}><Text style={styles.userMsgText}>{msg.text}</Text></View>
              </View>
            )
          )}
          {/* Ambient nudge */}
          <View style={styles.nudgeWrap}><Text style={styles.nudgeText}>Try a mindful check-in</Text></View>
          {/* Quick replies */}
          <View style={styles.quickReplies}>
            <TouchableOpacity style={styles.replyBtn} onPress={() => handleQuickReply('Yes')}><Text style={styles.replyText}>Yes</Text></TouchableOpacity>
            <TouchableOpacity style={styles.replyBtn} onPress={() => handleQuickReply('Tell me more')}><Text style={styles.replyText}>Tell me more</Text></TouchableOpacity>
            <TouchableOpacity style={styles.replyBtn} onPress={() => handleQuickReply('Dismiss')}><Text style={styles.replyText}>Dismiss</Text></TouchableOpacity>
          </View>
        </ScrollView>
        {/* Voice Input */}
        <View style={styles.inputBar}>
          <TextInput 
            style={styles.input} 
            placeholder="Ask Atmos anything…" 
            placeholderTextColor="#7dd3fc"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => {
              hapticFeedback.light();
              Alert.alert('Message Sent', 'Your message has been sent to Atmos.');
              setInputText('');
            }}
          />
          <Animated.View style={[styles.micBtn, {
            backgroundColor: micAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(30,41,59,0.85)', '#38bdf8']
            })
          }]}
          >
            <TouchableOpacity onPress={handleMic} accessibilityLabel="Voice Input">
              <Mic size={22} color="#7dd3fc" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 36,
    paddingBottom: 12,
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
  },
  iconBtn: { padding: 6 },
  logo: { width: 38, height: 38, borderRadius: 19, opacity: 0.95 },
  chat: { flex: 1 },
  atmosMsgWrap: { alignItems: 'flex-start', marginBottom: 18 },
  atmosMsg: {
    backgroundColor: 'rgba(30,41,59,0.85)',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: width * 0.32,
    maxWidth: width * 0.8,
    borderWidth: 1.5,
    borderColor: 'rgba(125,211,252,0.13)',
    marginBottom: 2,
  },
  atmosMsgText: {
    color: '#7dd3fc',
    fontSize: 17,
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.1,
    lineHeight: 25,
  },
  userMsgWrap: { alignItems: 'flex-end', marginBottom: 18 },
  userMsg: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 20,
    minWidth: width * 0.22,
    maxWidth: width * 0.8,
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.08)',
  },
  userMsgText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    letterSpacing: 0.1,
    lineHeight: 25,
  },
  nudgeWrap: { alignItems: 'center', marginVertical: 10 },
  nudgeText: { color: '#7dd3fc', fontSize: 15, fontFamily: 'Inter-Medium', letterSpacing: 0.1 },
  quickReplies: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  replyBtn: {
    backgroundColor: 'rgba(30,41,59,0.85)',
    borderRadius: 16,
    paddingVertical: 7,
    paddingHorizontal: 18,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.18)',
  },
  replyText: { color: '#7dd3fc', fontSize: 15, fontFamily: 'Inter-Medium', letterSpacing: 0.1 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30,41,59,0.95)',
    borderTopWidth: 1,
    borderColor: 'rgba(125,211,252,0.10)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    backgroundColor: 'rgba(30,41,59,0.7)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.10)',
  },
  micBtn: {
    backgroundColor: 'rgba(30,41,59,0.85)',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.18)',
  },
}); 