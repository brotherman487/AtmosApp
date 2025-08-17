import { useState, useEffect } from 'react';
import { storageGet, storageSet, StorageKeys } from '../services/storage';

export const useOnboarding = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await storageGet(StorageKeys.OnboardingCompleted, false);
      console.log('Onboarding status check:', completed);
      setIsOnboardingCompleted(completed === true);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsOnboardingCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      console.log('Completing onboarding...');
      await storageSet(StorageKeys.OnboardingCompleted, true);
      setIsOnboardingCompleted(true);
      console.log('Onboarding completed successfully');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      console.log('Resetting onboarding...');
      await storageSet(StorageKeys.OnboardingCompleted, false);
      setIsOnboardingCompleted(false);
      console.log('Onboarding reset successfully');
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  return {
    isOnboardingCompleted,
    isLoading,
    completeOnboarding,
    resetOnboarding,
  };
};
