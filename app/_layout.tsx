import React, { useState, useEffect, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { useOnboarding } from '../hooks/useOnboarding';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_300Light,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import SplashScreenCustom from './SplashScreen';
import ErrorBoundary from '../components/ErrorBoundary';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [showSplash, setShowSplash] = useState(true);
  const { isOnboardingCompleted, isLoading } = useOnboarding();
  const router = useRouter();
  const hasNavigated = useRef(false);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Light': Inter_300Light,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Ultra-simplified navigation - no complex dependencies
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading && !showSplash && !hasNavigated.current) {
        hasNavigated.current = true;
        
        console.log('Navigation decision:', { isLoading, showSplash, isOnboardingCompleted });
        
        if (!isOnboardingCompleted) {
          console.log('Navigating to onboarding...');
          router.replace('/onboarding');
        } else {
          console.log('Navigating to main app...');
          router.replace('/(tabs)');
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isLoading, showSplash, isOnboardingCompleted]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (showSplash) {
    return <SplashScreenCustom onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" backgroundColor="transparent" translucent={true} />
    </ErrorBoundary>
  );
}