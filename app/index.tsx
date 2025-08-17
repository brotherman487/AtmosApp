import { router } from 'expo-router';
import { useEffect } from 'react';
import { storageGet, StorageKeys } from '@/services/storage';

export default function Index() {
  useEffect(() => {
    (async () => {
      const hasCompletedOnboarding = await storageGet<boolean>(StorageKeys.OnboardingCompleted, false);
      if (!hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    })();
  }, []);

  return null;
}