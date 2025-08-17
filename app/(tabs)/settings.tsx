import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Animated, Platform } from 'react-native';
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
  Volume2,
  BarChart3,
  Activity,
  Users
} from 'lucide-react-native';

const SettingsScreen = () => {
  const [settings, setSettings] = useState<Record<string, boolean | string>>({
    voiceNudges: true,
    hapticFeedback: true,
    travelerMode: false,
    nightMode: true,
    autoSync: true,
    privacyMode: false,
    soundscapes: true,
    emergencyShield: false,
    // Privacy & Security
    cameraAccess: false,
    locationSharing: false,
    biometricLock: true,
    emergencyContacts: true,
    sosMode: false,
    dataEncryption: true,
    // Data & Analytics
    dataSharing: false,
    analyticsOptIn: true,
    dataRetention: '90days',
    ovrCalculation: 'standard',
    // Wearable Integration
    deviceAutoSync: true,
    sensorCalibration: true,
    batteryOptimization: true,
    syncFrequency: 'realtime',
    // Notifications & Alerts
    pushNotifications: true,
    quietHours: true,
    priorityAlerts: true,
    insightFrequency: 'daily',
    // Social Features
    friendVisibility: true,
    leaderboardParticipation: true,
    socialSharing: false,
    communityFeatures: true,
    // Advanced Personalization
    aiLearning: true,
    customRhythms: false,
    personalInsights: true,
    goalReminders: true
  });

  type SettingsKey = keyof typeof settings;
  type SettingValue = boolean | string;

  const [animations] = useState({
    glow: new Animated.Value(0.3),
    pulse: new Animated.Value(1),
  });

  useEffect(() => {
    // Animation removed for static card
  }, []);

  const toggleSetting = (key: SettingsKey) => {
    setSettings(prev => ({
      ...prev,
      [key]: typeof prev[key] === 'boolean' ? !(prev[key] as boolean) : prev[key]
    }));
  };

  const updateSetting = (key: SettingsKey, value: SettingValue) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Define the item type properly
  type SettingItem = {
    key?: SettingsKey;
    title: string;
    description: string;
    type: 'toggle' | 'navigation' | 'select';
    options?: { label: string; value: string }[];
  };

  const settingsSections: Array<{
    title: string;
    icon: React.ReactNode;
    color: string;
    items: SettingItem[];
  }> = [
    {
      title: 'Voice & Interaction',
      icon: <Mic size={18} color="#7dd3fc" strokeWidth={1.5} />,
      color: '#7dd3fc',
      items: [
        {
          key: 'voiceNudges' as SettingsKey,
          title: 'Voice-First Guidance',
          description: 'Receive spoken wisdom and gentle nudges',
          type: 'toggle'
        },
        {
          key: 'soundscapes' as SettingsKey,
          title: 'Ambient Soundscapes',
          description: 'Environment-based background sounds',
          type: 'toggle'
        },
        {
          key: 'hapticFeedback' as SettingsKey,
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
          key: 'cameraAccess',
          title: 'Camera Access',
          description: 'Allow Atmos to use camera for environment detection',
          type: 'toggle'
        },
        {
          key: 'locationSharing',
          title: 'Location Sharing',
          description: 'Share location for environmental insights',
          type: 'toggle'
        },
        {
          key: 'biometricLock',
          title: 'Biometric Lock',
          description: 'Use fingerprint or face ID to unlock',
          type: 'toggle'
        },
        {
          key: 'dataEncryption',
          title: 'Data Encryption',
          description: 'Encrypt all personal data',
          type: 'toggle'
        },
        {
          key: 'emergencyShield',
          title: 'Emergency Shield',
          description: 'Voice-activated emergency mode',
          type: 'toggle'
        },
        {
          key: 'emergencyContacts',
          title: 'Emergency Contacts',
          description: 'Manage emergency contact list',
          type: 'navigation'
        },
        {
          key: 'sosMode',
          title: 'SOS Mode',
          description: 'Quick emergency alert system',
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
    },
    {
      title: 'Data & Analytics',
      icon: <BarChart3 size={18} color="#ef4444" strokeWidth={1.5} />,
      color: '#ef4444',
      items: [
        {
          key: 'dataSharing',
          title: 'Data Sharing',
          description: 'Share anonymized data for research',
          type: 'toggle'
        },
        {
          key: 'analyticsOptIn',
          title: 'Analytics',
          description: 'Help improve Atmos with usage data',
          type: 'toggle'
        },
        {
          key: 'dataRetention',
          title: 'Data Retention',
          description: 'How long to keep your data',
          type: 'select',
          options: [
            { label: '30 days', value: '30days' },
            { label: '90 days', value: '90days' },
            { label: '1 year', value: '1year' },
            { label: 'Forever', value: 'forever' }
          ]
        },
        {
          key: 'ovrCalculation',
          title: 'OVR Algorithm',
          description: 'Choose your calculation method',
          type: 'select',
          options: [
            { label: 'Standard', value: 'standard' },
            { label: 'Advanced', value: 'advanced' },
            { label: 'Custom', value: 'custom' }
          ]
        }
      ]
    },
    {
      title: 'Wearable Integration',
      icon: <Activity size={18} color="#8b5cf6" strokeWidth={1.5} />,
      color: '#8b5cf6',
      items: [
        {
          key: 'deviceAutoSync',
          title: 'Auto Sync',
          description: 'Automatically sync with your wearable',
          type: 'toggle'
        },
        {
          key: 'sensorCalibration',
          title: 'Sensor Calibration',
          description: 'Calibrate sensors for accuracy',
          type: 'toggle'
        },
        {
          key: 'batteryOptimization',
          title: 'Battery Optimization',
          description: 'Optimize for longer battery life',
          type: 'toggle'
        },
        {
          key: 'syncFrequency',
          title: 'Sync Frequency',
          description: 'How often to sync data',
          type: 'select',
          options: [
            { label: 'Real-time', value: 'realtime' },
            { label: 'Every 5 minutes', value: '5min' },
            { label: 'Every 15 minutes', value: '15min' },
            { label: 'Manual only', value: 'manual' }
          ]
        }
      ]
    },
    {
      title: 'Notifications & Alerts',
      icon: <Bell size={18} color="#06b6d4" strokeWidth={1.5} />,
      color: '#06b6d4',
      items: [
        {
          key: 'pushNotifications',
          title: 'Push Notifications',
          description: 'Receive notifications on your device',
          type: 'toggle'
        },
        {
          key: 'quietHours',
          title: 'Quiet Hours',
          description: 'Silence notifications during sleep',
          type: 'toggle'
        },
        {
          key: 'priorityAlerts',
          title: 'Priority Alerts',
          description: 'Important alerts only',
          type: 'toggle'
        },
        {
          key: 'insightFrequency',
          title: 'Insight Frequency',
          description: 'How often to receive insights',
          type: 'select',
          options: [
            { label: 'Real-time', value: 'realtime' },
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' }
          ]
        }
      ]
    },
    {
      title: 'Social Features',
      icon: <Users size={18} color="#10b981" strokeWidth={1.5} />,
      color: '#10b981',
      items: [
        {
          key: 'friendVisibility',
          title: 'Friend Visibility',
          description: 'Allow friends to see your status',
          type: 'toggle'
        },
        {
          key: 'leaderboardParticipation',
          title: 'Leaderboard',
          description: 'Participate in community rankings',
          type: 'toggle'
        },
        {
          key: 'socialSharing',
          title: 'Social Sharing',
          description: 'Share achievements on social media',
          type: 'toggle'
        },
        {
          key: 'communityFeatures',
          title: 'Community',
          description: 'Access community features',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Advanced Personalization',
      icon: <Zap size={18} color="#f97316" strokeWidth={1.5} />,
      color: '#f97316',
      items: [
        {
          key: 'aiLearning',
          title: 'AI Learning',
          description: 'Let AI learn your patterns',
          type: 'toggle'
        },
        {
          key: 'customRhythms',
          title: 'Custom Rhythms',
          description: 'Create personalized rhythms',
          type: 'toggle'
        },
        {
          key: 'personalInsights',
          title: 'Personal Insights',
          description: 'Receive personalized insights',
          type: 'toggle'
        },
        {
          key: 'goalReminders',
          title: 'Goal Reminders',
          description: 'Get reminded of your goals',
          type: 'toggle'
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
          <View 
            style={styles.profileCardModern}
          >
            <View style={styles.profileAvatarModern}>
              <User size={40} color="#7dd3fc" strokeWidth={2} />
            </View>
            <View style={styles.profileInfoModern}>
              <Text style={styles.profileNameModern}>Mindful Soul</Text>
              <Text style={styles.profileLocationModern}>Miami, FL</Text>
              <Text style={styles.profileStatusModern}>In perfect rhythm</Text>
              <Text style={styles.profileJoinedModern}>Joined 47 days ago</Text>
            </View>
          </View>

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
                      value={settings[item.key] as boolean}
                      onValueChange={() => toggleSetting(item.key!)}
                      trackColor={{ false: 'rgba(255, 255, 255, 0.15)', true: section.color }}
                      thumbColor={(settings[item.key] as boolean) ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'}
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
    paddingTop: Platform.OS === 'ios' ? 24 : 20,
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
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 1)',
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
  profileLocation: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
    letterSpacing: 0.1,
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
  profileCardModern: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 32,
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.2)',
    boxShadow: '0px 0px 24px rgba(125, 211, 252, 0.2)',
  },
  profileAvatarModern: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(125, 211, 252, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'rgba(125, 211, 252, 0.3)',
  },
  profileInfoModern: {
    flex: 1,
  },
  profileNameModern: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  profileLocationModern: {
    fontSize: 15,
    color: '#7dd3fc',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  profileStatusModern: {
    fontSize: 14,
    color: '#10b981',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  profileJoinedModern: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.1,
  },
});

export default SettingsScreen;