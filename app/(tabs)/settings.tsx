import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Bell, 
  Globe, 
  Shield, 
  Mic, 
  Zap, 
  Moon, 
  Sun,
  ChevronRight,
  Heart,
  Settings as SettingsIcon,
  Sparkles,
  Volume2
} from 'lucide-react-native';

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    voiceNudges: true,
    hapticFeedback: true,
    travelerMode: false,
    nightMode: true,
    autoSync: true,
    privacyMode: false,
    soundscapes: true,
    emergencyShield: false
  });

  const [animations] = useState({
    glow: new Animated.Value(0.3),
    pulse: new Animated.Value(1),
  });

  useEffect(() => {
    // Gentle glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.glow, {
          toValue: 0.7,
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

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.pulse, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.pulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const settingsSections = [
    {
      title: 'Voice & Interaction',
      icon: <Mic size={18} color="#7dd3fc" strokeWidth={1.5} />,
      color: '#7dd3fc',
      items: [
        {
          key: 'voiceNudges',
          title: 'Voice-First Guidance',
          description: 'Receive spoken wisdom and gentle nudges',
          type: 'toggle'
        },
        {
          key: 'soundscapes',
          title: 'Ambient Soundscapes',
          description: 'Environment-based background sounds',
          type: 'toggle'
        },
        {
          key: 'hapticFeedback',
          title: 'Gentle Vibrations',
          description: 'Subtle haptic feedback for interactions',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Environment & Travel',
      icon: <Globe size={18} color="#10b981" strokeWidth={1.5} />,
      color: '#10b981',
      items: [
        {
          key: 'travelerMode',
          title: 'Traveler Mode',
          description: 'Sync rhythm across time zones and locations',
          type: 'toggle'
        },
        {
          key: 'autoSync',
          title: 'Auto Environment Sync',
          description: 'Automatically detect and adapt to location changes',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: <Shield size={18} color="#a78bfa" strokeWidth={1.5} />,
      color: '#a78bfa',
      items: [
        {
          key: 'privacyMode',
          title: 'Privacy Mode',
          description: 'All data stays on your device',
          type: 'toggle'
        },
        {
          key: 'emergencyShield',
          title: 'Emergency Shield',
          description: 'Voice-activated emergency mode',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Personalization',
      icon: <Sparkles size={18} color="#f59e0b" strokeWidth={1.5} />,
      color: '#f59e0b',
      items: [
        {
          key: 'nightMode',
          title: 'Night Mode',
          description: 'Darker theme for evening tranquility',
          type: 'toggle'
        },
        {
          title: 'Rhythm Preferences',
          description: 'Customize your daily flow patterns',
          type: 'navigation'
        },
        {
          title: 'Voice Sensitivity',
          description: 'Adjust voice recognition settings',
          type: 'navigation'
        }
      ]
    }
  ];

  const accountItems = [
    {
      title: 'Account & Data',
      description: 'Manage your Atmos profile',
      icon: <User size={18} color="#ffffff" strokeWidth={1.5} />,
      type: 'navigation'
    },
    {
      title: 'Backup & Sync',
      description: 'Cloud backup and device sync',
      icon: <Zap size={18} color="#ffffff" strokeWidth={1.5} />,
      type: 'navigation'
    },
    {
      title: 'Help & Support',
      description: 'Get help and share feedback',
      icon: <Heart size={18} color="#ffffff" strokeWidth={1.5} />,
      type: 'navigation'
    }
  ];

  return (
    <LinearGradient
      colors={['#0f0f23', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Personalize your Atmos experience</Text>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Card */}
          <Animated.View 
            style={[
              styles.profileCard,
              { transform: [{ scale: animations.pulse }] }
            ]}
          >
            <Animated.View
              style={[
                styles.profileGlow,
                {
                  opacity: animations.glow,
                  shadowColor: '#7dd3fc',
                }
              ]}
            />
            <View style={styles.profileAvatar}>
              <User size={32} color="#7dd3fc" strokeWidth={1.5} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Mindful Soul</Text>
              <Text style={styles.profileStatus}>In perfect rhythm</Text>
              <Text style={styles.profileJoined}>Joined 47 days ago</Text>
            </View>
          </Animated.View>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: `${section.color}20` }]}>
                  {section.icon}
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.settingItem}>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    {item.description && (
                      <Text style={styles.settingDescription}>{item.description}</Text>
                    )}
                  </View>
                  
                  {item.type === 'toggle' && item.key ? (
                    <Switch
                      value={settings[item.key]}
                      onValueChange={() => toggleSetting(item.key)}
                      trackColor={{ false: 'rgba(255, 255, 255, 0.15)', true: section.color }}
                      thumbColor={settings[item.key] ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'}
                      style={styles.switch}
                    />
                  ) : (
                    <ChevronRight size={16} color="rgba(255, 255, 255, 0.5)" strokeWidth={1.5} />
                  )}
                </View>
              ))}
            </View>
          ))}

          {/* Account & Support */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionIcon, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
                <SettingsIcon size={18} color="#ffffff" strokeWidth={1.5} />
              </View>
              <Text style={styles.sectionTitle}>Account & Support</Text>
            </View>
            
            {accountItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.settingItem} activeOpacity={0.8}>
                <View style={styles.settingContent}>
                  <View style={styles.settingTitleContainer}>
                    {item.icon}
                    <Text style={styles.settingTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.settingDescription}>{item.description}</Text>
                </View>
                <ChevronRight size={16} color="rgba(255, 255, 255, 0.5)" strokeWidth={1.5} />
              </TouchableOpacity>
            ))}
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <View style={styles.appIcon}>
              <Sparkles size={24} color="#7dd3fc" strokeWidth={1.5} />
            </View>
            <Text style={styles.appName}>Atmos</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Your conscious living companion. Crafted with love for mindful souls seeking harmony with the world.
            </Text>
          </View>

          {/* Privacy Note */}
          <View style={styles.privacyNote}>
            <Shield size={14} color="#10b981" strokeWidth={1.5} />
            <Text style={styles.privacyText}>
              Your privacy is sacred. All reflections and personal data remain on your device unless you choose to share.
            </Text>
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
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 24,
    borderRadius: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  profileGlow: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(125, 211, 252, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(125, 211, 252, 0.3)',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  profileStatus: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#10b981',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  profileJoined: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 18,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  settingContent: {
    flex: 1,
  },
  settingTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginLeft: 8,
    letterSpacing: -0.1,
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
    letterSpacing: 0.1,
    lineHeight: 18,
  },
  switch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  appInfo: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 28,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  appIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(125, 211, 252, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(125, 211, 252, 0.3)',
  },
  appName: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  appVersion: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  appDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  privacyText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 8,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
});

export default SettingsScreen;