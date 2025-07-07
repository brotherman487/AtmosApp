import { Tabs } from 'expo-router';
import { Chrome as Home, Zap, Globe, Activity, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
          position: 'absolute',
        },
        tabBarActiveTintColor: '#7dd3fc',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter-Medium',
          marginTop: 4,
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Rhythm',
          tabBarIcon: ({ size, color }) => (
            <Home size={20} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="nudges"
        options={{
          title: 'Insights',
          tabBarIcon: ({ size, color }) => (
            <Zap size={20} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="environment"
        options={{
          title: 'Zones',
          tabBarIcon: ({ size, color }) => (
            <Globe size={20} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="rhythm"
        options={{
          title: 'Metrics',
          tabBarIcon: ({ size, color }) => (
            <Activity size={20} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={20} color={color} strokeWidth={1.5} />
          ),
        }}
      />
    </Tabs>
  );
}