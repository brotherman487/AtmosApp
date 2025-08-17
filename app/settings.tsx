import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
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
  Users,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Target,
  ArrowLeft
} from 'lucide-react-native';
import { useOnboarding } from '@/hooks/useOnboarding';
import { offlineStorage } from '@/services/offlineStorage';
import LoadingSpinner from '@/components/LoadingSpinner';
import { DesignSystem, createGlassMorphism } from '@/constants/design';

const SettingsScreen = () => {
  const { resetOnboarding } = useOnboarding();
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

  const [isOffline, setIsOffline] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    checkOfflineStatus();
    const interval = setInterval(checkOfflineStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkOfflineStatus = () => {
    setIsOffline(offlineStorage.isOffline());
    setPendingSyncCount(offlineStorage.getPendingSyncCount());
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await offlineStorage.syncWhenOnline();
      checkOfflineStatus();
      Alert.alert('Success', 'Data synchronized successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to sync data. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will reset your onboarding experience. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            await resetOnboarding();
            Alert.alert('Success', 'Onboarding has been reset. Please restart the app.');
          }
        }
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your local data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: async () => {
            await offlineStorage.clearOfflineData();
            Alert.alert('Success', 'All local data has been cleared.');
          }
        }
      ]
    );
  };

  type SettingsKey = keyof typeof settings;
  type SettingValue = boolean | string;

  const handleSettingChange = (key: SettingsKey, value: SettingValue) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    subtitle: string,
    key: SettingsKey,
    type: 'toggle' | 'select' = 'toggle',
    options?: { label: string; value: string }[]
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      {type === 'toggle' ? (
        <Switch
          value={settings[key] as boolean}
          onValueChange={(value) => handleSettingChange(key, value)}
          trackColor={{ false: '#374151', true: DesignSystem.colors.primary.cyan }}
          thumbColor={settings[key] ? '#ffffff' : '#9ca3af'}
        />
      ) : (
        <TouchableOpacity style={styles.selectButton}>
          <Text style={styles.selectButtonText}>
            {typeof settings[key] === 'string' ? settings[key] : 'Select'}
          </Text>
          <ChevronRight size={16} color={DesignSystem.colors.neutral.silver} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#0a0a0a', '#161616', '#2a2a2a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={DesignSystem.colors.primary.cyan} />
            </TouchableOpacity>
            <SettingsIcon size={28} color={DesignSystem.colors.primary.cyan} />
            <Text style={styles.headerTitle}>Settings</Text>
          </View>

          {/* Offline Status */}
          {isOffline && (
            <View style={styles.offlineBanner}>
              <WifiOff size={20} color="#f59e0b" />
              <Text style={styles.offlineText}>You're offline</Text>
              {pendingSyncCount > 0 && (
                <Text style={styles.syncText}>{pendingSyncCount} items pending sync</Text>
              )}
            </View>
          )}

          {/* Data Management */}
          {renderSection('Data & Sync', (
            <>
              <View style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <Wifi size={20} color={isOffline ? "#f59e0b" : "#10b981"} />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Connection Status</Text>
                  <Text style={styles.settingSubtitle}>
                    {isOffline ? 'Offline - Data saved locally' : 'Online - Real-time sync'}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.syncButton} 
                  onPress={handleSync}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <RefreshCw size={16} color={DesignSystem.colors.primary.cyan} />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.settingItem} onPress={handleResetOnboarding}>
                <View style={styles.settingIcon}>
                  <Sparkles size={20} color="#a855f7" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Reset Onboarding</Text>
                  <Text style={styles.settingSubtitle}>Show onboarding flow again</Text>
                </View>
                <ChevronRight size={16} color={DesignSystem.colors.neutral.silver} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
                <View style={styles.settingIcon}>
                  <Trash2 size={20} color="#ef4444" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Clear All Data</Text>
                  <Text style={styles.settingSubtitle}>Permanently delete local data</Text>
                </View>
                <ChevronRight size={16} color={DesignSystem.colors.neutral.silver} />
              </TouchableOpacity>
            </>
          ))}

          {/* Notifications */}
          {renderSection('Notifications', (
            <>
              {renderSettingItem(
                <Bell size={20} color="#a78bfa" />,
                'Push Notifications',
                'Receive alerts and updates',
                'pushNotifications'
              )}
              {renderSettingItem(
                <Mic size={20} color="#4ade80" />,
                'Voice Nudges',
                'Gentle spoken reminders',
                'voiceNudges'
              )}
              {renderSettingItem(
                <Zap size={20} color="#f59e0b" />,
                'Haptic Feedback',
                'Vibration and tactile alerts',
                'hapticFeedback'
              )}
              {renderSettingItem(
                <Moon size={20} color="#6366f1" />,
                'Quiet Hours',
                'Silence notifications at night',
                'quietHours'
              )}
            </>
          ))}

          {/* Privacy & Security */}
          {renderSection('Privacy & Security', (
            <>
              {renderSettingItem(
                <Shield size={20} color="#10b981" />,
                'Data Encryption',
                'Encrypt all stored data',
                'dataEncryption'
              )}
              {renderSettingItem(
                <Shield size={20} color="#8b5cf6" />,
                'Biometric Lock',
                'Use fingerprint or face ID',
                'biometricLock'
              )}
              {renderSettingItem(
                <Globe size={20} color="#06b6d4" />,
                'Privacy Mode',
                'Hide sensitive information',
                'privacyMode'
              )}
              {renderSettingItem(
                <Users size={20} color="#f97316" />,
                'Friend Visibility',
                'Show your profile to friends',
                'friendVisibility'
              )}
            </>
          ))}

          {/* Personalization */}
          {renderSection('Personalization', (
            <>
              {renderSettingItem(
                <Heart size={20} color="#ef4444" />,
                'AI Learning',
                'Improve recommendations',
                'aiLearning'
              )}
              {renderSettingItem(
                <Sparkles size={20} color="#a855f7" />,
                'Custom Rhythms',
                'Create personal patterns',
                'customRhythms'
              )}
              {renderSettingItem(
                <BarChart3 size={20} color="#10b981" />,
                'Personal Insights',
                'Detailed analytics',
                'personalInsights'
              )}
              {renderSettingItem(
                <Target size={20} color="#f59e0b" />,
                'Goal Reminders',
                'Track your objectives',
                'goalReminders'
              )}
            </>
          ))}

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appVersion}>Atmos v1.0.0</Text>
            <Text style={styles.appDescription}>
              Your conscious living companion for mindful harmony
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: Platform.OS === 'ios' ? 24 : 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 24,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.alpha[8],
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 12,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  offlineText: {
    color: '#f59e0b',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  syncText: {
    color: '#f59e0b',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 'auto',
    opacity: 0.8,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 12,
  },
  sectionContent: {
    ...createGlassMorphism(0.06),
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.alpha[8],
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.7,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginRight: 4,
  },
  syncButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    marginTop: 24,
  },
  appVersion: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default SettingsScreen;
