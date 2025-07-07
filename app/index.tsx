import { router } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = false; // This would come from storage
    
    if (!hasCompletedOnboarding) {
      router.replace('/onboarding');
    } else {
      router.replace('/(tabs)');
    }
  }, []);

  return null;
}