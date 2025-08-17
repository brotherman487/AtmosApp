import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Mic, MapPin, Bell, Shield, Check } from 'lucide-react-native';

const PermissionsScreen = () => {
  const [permissions, setPermissions] = useState({
    microphone: false,
    location: false,
    notifications: false,
  } as const);

  const [animations] = useState({
    fade: new Animated.Value(0),
    slide: new Animated.Value(50),
    check: new Animated.Value(0)
  });

  type PermissionKey = keyof typeof permissions;

  useEffect(() => {
    // Fade in animation
    Animated.timing(animations.fade, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Slide up animation
    Animated.timing(animations.slide, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const permissionItems: Array<{
    key: PermissionKey;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      key: 'microphone',
      title: 'Voice Intelligence',
      description: 'Your AI learns your communication patterns and emotional states',
      icon: <Mic size={24} color="#ffffff" strokeWidth={1.5} />,
      color: '#4ade80',
    },
    {
      key: 'location',
      title: 'Environmental Awareness',
      description: 'Your AI adapts to your surroundings and activity patterns',
      icon: <MapPin size={24} color="#ffffff" strokeWidth={1.5} />,
      color: '#60a5fa',
    },
    {
      key: 'notifications',
      title: 'Intelligent Guidance',
      description: 'Receive gentle nudges and insights when you need them most',
      icon: <Bell size={24} color="#ffffff" strokeWidth={1.5} />,
      color: '#a855f7',
    },
  ];

  const togglePermission = (key: PermissionKey) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    // Animate check mark
    Animated.sequence([
      Animated.timing(animations.check, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animations.check, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = () => {
    const grantedPermissions = Object.values(permissions).filter(Boolean).length;
    
    if (grantedPermissions === 0) {
      Alert.alert(
        'Unlock Your AI\'s Potential',
        'Grant at least one permission to unlock your symbiotic relationship with Atmos.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    router.replace('/onboarding/setup');
  };

  const grantedCount = Object.values(permissions).filter(Boolean).length;

  return (
    <LinearGradient
      colors={['#0f0f23', '#1a1a2e', '#16213e'] as const}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: animations.fade,
            transform: [{ translateY: animations.slide }]
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Unlock Your AI's Potential</Text>
          <Text style={styles.subtitle}>
            Grant permissions to help your AI companion learn and adapt to your unique patterns
          </Text>
        </View>

        {/* Permissions List */}
        <ScrollView style={styles.permissionsList} showsVerticalScrollIndicator={false}>
          {permissionItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.permissionCard,
                permissions[item.key] && [styles.permissionCardActive, { borderColor: item.color }]
              ]}
              onPress={() => togglePermission(item.key)}
              activeOpacity={0.8}
            >
              <View style={[styles.permissionIcon, { backgroundColor: item.color }]}>
                {item.icon}
              </View>
              
              <View style={styles.permissionContent}>
                <Text style={styles.permissionTitle}>{item.title}</Text>
                <Text style={styles.permissionDescription}>{item.description}</Text>
              </View>

              <View style={[
                styles.checkContainer,
                permissions[item.key] && [styles.checkContainerActive, { backgroundColor: item.color }]
              ]}>
                {permissions[item.key] && (
                  <Check size={16} color="#ffffff" strokeWidth={2.5} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Privacy Note */}
        <View style={styles.privacyContainer}>
          <Shield size={16} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.privacyText}>
            Your data is encrypted and used only to personalize your AI experience
          </Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity 
          style={[
            styles.ctaButton,
            grantedCount > 0 && styles.ctaButtonActive
          ]} 
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.ctaText,
            grantedCount > 0 && styles.ctaTextActive
          ]}>
            Continue ({grantedCount}/3)
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  permissionsList: {
    flex: 1,
    marginBottom: 24,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
  },
  permissionCardActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 2,
  },
  permissionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkContainerActive: {
    backgroundColor: 'transparent',
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 20,
  },
  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 40,
  },
  ctaButtonActive: {
    backgroundColor: '#7dd3fc',
    borderColor: '#7dd3fc',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  ctaTextActive: {
    color: '#000000',
  },
});

export default PermissionsScreen;