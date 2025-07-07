import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Mic, MapPin, Bell, Shield } from 'lucide-react-native';

const PermissionsScreen = () => {
  const [permissions, setPermissions] = useState({
    microphone: false,
    location: false,
    notifications: false,
  });

  const permissionItems = [
    {
      key: 'microphone',
      title: 'Voice Superpower',
      description: 'Let Atmos hear your reflections and respond with wisdom',
      icon: <Mic size={24} color="#ffffff" strokeWidth={1.5} />,
      color: '#4ade80'
    },
    {
      key: 'location',
      title: 'Environmental Awareness',
      description: 'Sync with local air quality, weather, and noise levels',
      icon: <MapPin size={24} color="#ffffff" strokeWidth={1.5} />,
      color: '#60a5fa'
    },
    {
      key: 'notifications',
      title: 'Gentle Nudges',
      description: 'Receive mindful reminders and rhythm updates',
      icon: <Bell size={24} color="#ffffff" strokeWidth={1.5} />,
      color: '#a78bfa'
    }
  ];

  const handlePermissionToggle = (key: string) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleContinue = () => {
    const grantedPermissions = Object.values(permissions).filter(Boolean).length;
    if (grantedPermissions === 0) {
      Alert.alert('Almost there!', 'Grant at least one permission to unlock your Atmos experience.');
      return;
    }
    router.replace('/onboarding/setup');
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Shield size={48} color="#ffffff" strokeWidth={1.5} />
        <Text style={styles.title}>Unlock Your Superpowers</Text>
        <Text style={styles.subtitle}>
          These permissions help Atmos understand your world and provide personalized guidance.
        </Text>
      </View>

      <View style={styles.permissionsList}>
        {permissionItems.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.permissionItem,
              permissions[item.key] && styles.permissionItemActive
            ]}
            onPress={() => handlePermissionToggle(item.key)}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              {item.icon}
            </View>
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>{item.title}</Text>
              <Text style={styles.permissionDescription}>{item.description}</Text>
            </View>
            <View style={[
              styles.checkbox,
              permissions[item.key] && styles.checkboxActive
            ]}>
              {permissions[item.key] && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <Text style={styles.privacyNote}>
          Your privacy is sacred. All data stays on your device unless you choose to share.
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginTop: 20,
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
  permissionsList: {
    flex: 1,
    marginBottom: 40,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  permissionItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    opacity: 0.7,
    lineHeight: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#4ade80',
    borderColor: '#4ade80',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    textAlign: 'center',
  },
  privacyNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 18,
  },
});

export default PermissionsScreen;