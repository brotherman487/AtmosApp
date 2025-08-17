import { Tabs } from 'expo-router';
import { Chrome as Home, Brain, Globe, Activity, User, Mail } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useMemo } from 'react';

export default function TabLayout() {
  const tabBarStyle = useMemo(() => ({
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: Platform.OS === 'ios' ? 25 : 32,
    marginHorizontal: Platform.OS === 'ios' ? 20 : 16,
    marginBottom: Platform.OS === 'ios' ? 20 : 16,
    height: Platform.OS === 'ios' ? 70 : 60,
    paddingBottom: Platform.OS === 'ios' ? 16 : 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
    borderTopWidth: 0,
    elevation: Platform.OS === 'ios' ? 0 : 8,
    boxShadow: Platform.OS === 'ios' ? '0px -2px 20px rgba(125, 211, 252, 0.2)' : '0px -2px 24px rgba(125, 211, 252, 0.15)',
    position: 'absolute' as const,
  }), []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: '#7dd3fc',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
        tabBarShowLabel: false,
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Home size={24} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Brain size={24} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="rhythm"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Activity size={24} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Mail size={24} color={color} strokeWidth={1.5} />
          ),
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="environment"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Globe size={24} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ size, color }) => (
            <User size={24} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}