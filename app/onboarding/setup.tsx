import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Zap, MessageCircle, Smartphone, Globe, Sun, Moon } from 'lucide-react-native';

const SetupScreen = () => {
  const [preferences, setPreferences] = useState({
    nudgeStyle: 'voice',
    travelerMode: false,
    rhythmPreference: 'morning'
  });

  const nudgeStyles = [
    {
      key: 'voice',
      title: 'Voice-First',
      description: 'Gentle spoken guidance',
      icon: <MessageCircle size={24} color="#ffffff" strokeWidth={1.5} />
    },
    {
      key: 'haptic',
      title: 'Haptic Pulse',
      description: 'Subtle vibrations and LED',
      icon: <Zap size={24} color="#ffffff" strokeWidth={1.5} />
    },
    {
      key: 'app',
      title: 'App Alerts',
      description: 'Visual notifications only',
      icon: <Smartphone size={24} color="#ffffff" strokeWidth={1.5} />
    }
  ];

  const rhythmPreferences = [
    {
      key: 'morning',
      title: 'Morning Person',
      description: 'Peak energy before noon',
      icon: <Sun size={24} color="#ffffff" strokeWidth={1.5} />
    },
    {
      key: 'evening',
      title: 'Night Owl',
      description: 'Come alive after sunset',
      icon: <Moon size={24} color="#ffffff" strokeWidth={1.5} />
    }
  ];

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Teach Atmos Your Rhythm</Text>
          <Text style={styles.subtitle}>
            Help us understand how you like to receive guidance and when you're most in flow.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How should Atmos nudge you?</Text>
          {nudgeStyles.map((style) => (
            <TouchableOpacity
              key={style.key}
              style={[
                styles.optionItem,
                preferences.nudgeStyle === style.key && styles.optionItemActive
              ]}
              onPress={() => handlePreferenceChange('nudgeStyle', style.key)}
            >
              <View style={styles.optionIcon}>
                {style.icon}
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{style.title}</Text>
                <Text style={styles.optionDescription}>{style.description}</Text>
              </View>
              <View style={[
                styles.radio,
                preferences.nudgeStyle === style.key && styles.radioActive
              ]}>
                {preferences.nudgeStyle === style.key && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>When do you feel most alive?</Text>
          {rhythmPreferences.map((rhythm) => (
            <TouchableOpacity
              key={rhythm.key}
              style={[
                styles.optionItem,
                preferences.rhythmPreference === rhythm.key && styles.optionItemActive
              ]}
              onPress={() => handlePreferenceChange('rhythmPreference', rhythm.key)}
            >
              <View style={styles.optionIcon}>
                {rhythm.icon}
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{rhythm.title}</Text>
                <Text style={styles.optionDescription}>{rhythm.description}</Text>
              </View>
              <View style={[
                styles.radio,
                preferences.rhythmPreference === rhythm.key && styles.radioActive
              ]}>
                {preferences.rhythmPreference === rhythm.key && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.toggleItem,
              preferences.travelerMode && styles.toggleItemActive
            ]}
            onPress={() => handlePreferenceChange('travelerMode', !preferences.travelerMode)}
          >
            <View style={styles.toggleIcon}>
              <Globe size={24} color="#ffffff" strokeWidth={1.5} />
            </View>
            <View style={styles.toggleText}>
              <Text style={styles.toggleTitle}>Traveler Mode</Text>
              <Text style={styles.toggleDescription}>
                Sync rhythm across time zones and discover calm zones wherever you go
              </Text>
            </View>
            <View style={[
              styles.toggle,
              preferences.travelerMode && styles.toggleActive
            ]}>
              <View style={[
                styles.toggleThumb,
                preferences.travelerMode && styles.toggleThumbActive
              ]} />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={styles.buttonText}>Begin Your Journey</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.7,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#4ade80',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  toggleIcon: {
    marginRight: 12,
  },
  toggleText: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 2,
  },
  toggleDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.7,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#4ade80',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  finishButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 20,
    marginBottom: 40,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default SetupScreen;