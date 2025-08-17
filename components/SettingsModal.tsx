import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft,
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
  Users,
  Trophy
} from 'lucide-react-native';
import { DesignSystem, createGlassMorphism } from '../constants/design';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const [settings, setSettings] = useState<Record<string, boolean | string>>({
    voiceNudges: true,
    hapticFeedback: true,
    travelerMode: false,
    nightMode: true,
    autoSync: true,
    privacyMode: false,
    soundscapes: true,
    emergencyShield: false,
    cameraAccess: false,
    locationSharing: false,
    biometricLock: true,
    emergencyContacts: true,
    sosMode: false,
    dataEncryption: true,
    dataSharing: false,
    analyticsOptIn: true,
    dataRetention: '90days',
    ovrCalculation: 'standard',
    deviceAutoSync: true,
    sensorCalibration: true,
    batteryOptimization: true,
    syncFrequency: 'realtime',
    pushNotifications: true,
    quietHours: true,
    priorityAlerts: true,
    insightFrequency: 'daily',
    friendVisibility: true,
    leaderboardParticipation: true,
    socialSharing: false,
    communityFeatures: true,
    aiLearning: true,
    customRhythms: false,
    personalInsights: true,
    goalReminders: true
  });

  type SettingsKey = keyof typeof settings;
  type SettingValue = boolean | string;

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

  type SettingItem = {
    key?: SettingsKey;
    title: string;
    description: string;
    type: 'toggle' | 'navigation' | 'select';
    options?: { label: string; value: string }[];
    icon: React.ReactNode;
    category: string;
  };

  const settingsSections: SettingItem[] = [
    // Personalization
    { key: 'voiceNudges', title: 'Voice Nudges', description: 'Gentle voice reminders', type: 'toggle', icon: <Mic size={20} color="#3b82f6" />, category: 'Personalization' },
    { key: 'hapticFeedback', title: 'Haptic Feedback', description: 'Vibrate on important events', type: 'toggle', icon: <Zap size={20} color="#f59e0b" />, category: 'Personalization' },
    { key: 'nightMode', title: 'Dark Mode', description: 'Easier on the eyes at night', type: 'toggle', icon: <Moon size={20} color="#6366f1" />, category: 'Personalization' },
    { key: 'soundscapes', title: 'Ambient Soundscapes', description: 'Background nature sounds', type: 'toggle', icon: <Volume2 size={20} color="#10b981" />, category: 'Personalization' },
    
    // Privacy & Security
    { key: 'biometricLock', title: 'Biometric Lock', description: 'Use fingerprint or face ID', type: 'toggle', icon: <Shield size={20} color="#ef4444" />, category: 'Privacy & Security' },
    { key: 'dataEncryption', title: 'Data Encryption', description: 'Encrypt all personal data', type: 'toggle', icon: <Shield size={20} color="#8b5cf6" />, category: 'Privacy & Security' },
    { key: 'locationSharing', title: 'Location Sharing', description: 'Share location with friends', type: 'toggle', icon: <Globe size={20} color="#06b6d4" />, category: 'Privacy & Security' },
    { key: 'emergencyContacts', title: 'Emergency Contacts', description: 'Allow emergency access', type: 'toggle', icon: <Heart size={20} color="#f97316" />, category: 'Privacy & Security' },
    
    // Notifications
    { key: 'pushNotifications', title: 'Push Notifications', description: 'Receive app notifications', type: 'toggle', icon: <Bell size={20} color="#3b82f6" />, category: 'Notifications' },
    { key: 'quietHours', title: 'Quiet Hours', description: 'Silence notifications at night', type: 'toggle', icon: <Moon size={20} color="#6366f1" />, category: 'Notifications' },
    { key: 'priorityAlerts', title: 'Priority Alerts', description: 'Critical health notifications', type: 'toggle', icon: <Activity size={20} color="#ef4444" />, category: 'Notifications' },
    
    // Data & Analytics
    { key: 'dataSharing', title: 'Data Sharing', description: 'Share anonymous data for research', type: 'toggle', icon: <BarChart3 size={20} color="#10b981" />, category: 'Data & Analytics' },
    { key: 'analyticsOptIn', title: 'Analytics', description: 'Help improve Atmos', type: 'toggle', icon: <Sparkles size={20} color="#a855f7" />, category: 'Data & Analytics' },
    
    // Social Features
    { key: 'friendVisibility', title: 'Friend Visibility', description: 'Show profile to friends', type: 'toggle', icon: <Users size={20} color="#3b82f6" />, category: 'Social Features' },
    { key: 'leaderboardParticipation', title: 'Leaderboards', description: 'Participate in challenges', type: 'toggle', icon: <Trophy size={20} color="#f59e0b" />, category: 'Social Features' },
    { key: 'socialSharing', title: 'Social Sharing', description: 'Share achievements', type: 'toggle', icon: <Globe size={20} color="#06b6d4" />, category: 'Social Features' },
    
    // Advanced Features
    { key: 'aiLearning', title: 'AI Learning', description: 'Personalize with AI insights', type: 'toggle', icon: <Sparkles size={20} color="#a855f7" />, category: 'Advanced Features' },
    { key: 'customRhythms', title: 'Custom Rhythms', description: 'Create personal patterns', type: 'toggle', icon: <Activity size={20} color="#10b981" />, category: 'Advanced Features' },
    { key: 'personalInsights', title: 'Personal Insights', description: 'Deep dive analytics', type: 'toggle', icon: <BarChart3 size={20} color="#3b82f6" />, category: 'Advanced Features' },
  ];

  const groupedSettings = settingsSections.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SettingItem[]>);

  const renderSettingItem = (item: SettingItem) => (
    <View key={item.title} style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          {item.icon}
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingDescription}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.settingRight}>
        {item.type === 'toggle' && item.key && (
          <Switch
            value={settings[item.key] as boolean}
            onValueChange={() => toggleSetting(item.key!)}
            trackColor={{ false: DesignSystem.colors.alpha[8], true: 'rgba(125, 211, 252, 0.3)' }}
            thumbColor={settings[item.key] as boolean ? DesignSystem.colors.primary.cyan : DesignSystem.colors.neutral.silver}
          />
        )}
        {item.type === 'navigation' && (
          <ChevronRight size={20} color={DesignSystem.colors.neutral.silver} />
        )}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
      transparent={false}
    >
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={DesignSystem.colors.primary.cyan} />
            </TouchableOpacity>
          </View>

          {/* Settings Content */}
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {Object.entries(groupedSettings).map(([category, items]) => (
              <View key={category} style={styles.section}>
                <Text style={styles.sectionTitle}>{category}</Text>
                <View style={styles.sectionContent}>
                  {items.map(renderSettingItem)}
                </View>
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 32 : DesignSystem.spacing.md,
    paddingBottom: DesignSystem.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.alpha[8],
  },
  backButton: {
    padding: DesignSystem.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingBottom: DesignSystem.spacing['4xl'],
  },
  section: {
    marginTop: DesignSystem.spacing.xl,
  },
  sectionTitle: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.heading1,
    fontWeight: '600',
    marginBottom: DesignSystem.spacing.md,
  },
  sectionContent: {
    ...createGlassMorphism(0.06),
    borderRadius: DesignSystem.radius.lg,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.alpha[8],
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: DesignSystem.radius.md,
    backgroundColor: DesignSystem.colors.alpha[8],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: DesignSystem.spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.body1,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.caption,
  },
  settingRight: {
    alignItems: 'center',
  },
});

export default SettingsModal;
