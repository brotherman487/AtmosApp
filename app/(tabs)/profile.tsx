import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  User, 
  Settings,
  Heart,
  Trophy,
  Calendar,
  MapPin,
  Sparkles,
  ChevronRight,
  Edit3,
  Camera,
  Bell,
  Shield,
  Zap,
  Globe,
  Activity,
  BarChart3,
  Target,
  Users,
  Award,
  Star,
  Clock,
  TrendingUp,
  Sun
} from 'lucide-react-native';
import { DesignSystem, createGlassMorphism } from '../../constants/design';
import { SettingsModal } from '../../components';
import { useOnboarding } from '../../hooks/useOnboarding';
import { hapticFeedback } from '../../utils/haptics';

const ProfileScreen = () => {
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const { resetOnboarding } = useOnboarding();

  const navigateToSettings = () => {
    router.push('/settings');
  };

  const openSettingsModal = () => {
    setSettingsModalVisible(true);
  };

  const closeSettingsModal = () => {
    setSettingsModalVisible(false);
  };

  const profileStats = [
    { icon: <Heart size={16} color="#ef4444" />, label: 'Days Active', value: '47' },
    { icon: <Trophy size={16} color="#f59e0b" />, label: 'Achievements', value: '12' },
    { icon: <Target size={16} color="#10b981" />, label: 'Goals Met', value: '8' },
    { icon: <TrendingUp size={16} color="#3b82f6" />, label: 'Streak', value: '15' },
  ];

  const recentAchievements = [
    { title: 'Mindful Morning', description: '7 days of morning meditation', icon: <Sun size={20} color="#f59e0b" />, date: '2 days ago' },
    { title: 'Rhythm Master', description: 'Perfect OVR for 3 days', icon: <Sparkles size={20} color="#a855f7" />, date: '1 week ago' },
    { title: 'Zone Explorer', description: 'Discovered 5 calm zones', icon: <Globe size={20} color="#06b6d4" />, date: '2 weeks ago' },
  ];

  const quickActions = [
    { 
      title: 'Edit Profile', 
      icon: <Edit3 size={20} color="#3b82f6" />, 
      action: () => {
        hapticFeedback.light();
        Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
      }
    },
    { 
      title: 'Take Photo', 
      icon: <Camera size={20} color="#10b981" />, 
      action: () => {
        hapticFeedback.light();
        Alert.alert('Camera', 'Camera feature coming soon!');
      }
    },
    { 
      title: 'Notifications', 
      icon: <Bell size={20} color="#f59e0b" />, 
      action: () => {
        hapticFeedback.light();
        openSettingsModal();
      }
    },
    { 
      title: 'Privacy', 
      icon: <Shield size={20} color="#ef4444" />, 
      action: () => {
        hapticFeedback.light();
        Alert.alert('Privacy Settings', 'Privacy settings coming soon!');
      }
    },
    { 
      title: 'Reset Onboarding', 
      icon: <Activity size={20} color="#a855f7" />, 
      action: () => {
        hapticFeedback.medium();
        Alert.alert(
          'Reset Onboarding',
          'This will reset your onboarding experience. Continue?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Reset', 
              onPress: () => {
                resetOnboarding();
                hapticFeedback.success();
              }
            }
          ]
        );
      }
    },
  ];

  return (
    <LinearGradient
      colors={['#0f0f23', '#1a1a2e', '#16213e']}
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
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.subtitle}>Your mindful journey</Text>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <TouchableOpacity 
              style={styles.settingsIcon}
              onPress={() => {
                hapticFeedback.light();
                openSettingsModal();
              }}
              activeOpacity={0.7}
            >
              <Settings size={20} color="#7dd3fc" strokeWidth={1.5} />
            </TouchableOpacity>
            <View style={styles.profileAvatar}>
              <User size={40} color="#7dd3fc" strokeWidth={2} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Mindful Soul</Text>
              <Text style={styles.profileLocation}>Miami, FL</Text>
              <Text style={styles.profileStatus}>In perfect rhythm</Text>
              <Text style={styles.profileJoined}>Joined 47 days ago</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsContainer}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <View style={styles.statIcon}>
                  {stat.icon}
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.quickActionItem}
                  onPress={action.action}
                  activeOpacity={0.8}
                >
                  <View style={styles.quickActionIcon}>
                    {action.icon}
                  </View>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
            {recentAchievements.map((achievement, index) => (
              <View key={index} style={styles.achievementItem}>
                <View style={styles.achievementIcon}>
                  {achievement.icon}
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
                <Text style={styles.achievementDate}>{achievement.date}</Text>
              </View>
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

      {/* Settings Modal */}
      <SettingsModal 
        visible={settingsModalVisible}
        onClose={closeSettingsModal}
      />
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    paddingBottom: Platform.OS === 'ios' ? 160 : 140,
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
    marginBottom: 40,
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
  profileCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 32,
    padding: 32,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.2)',
    boxShadow: '0px 0px 24px rgba(125, 211, 252, 0.2)',
  },
  settingsIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  profileAvatar: {
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
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  profileLocation: {
    fontSize: 15,
    color: '#7dd3fc',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  profileStatus: {
    fontSize: 14,
    color: '#10b981',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  profileJoined: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 12,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    borderRadius: 20,
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    textAlign: 'center',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  achievementIcon: {
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  achievementDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  appInfo: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 32,
    borderRadius: 24,
    marginBottom: 24,
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

export default ProfileScreen;
