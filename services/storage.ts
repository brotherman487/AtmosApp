import AsyncStorage from '@react-native-async-storage/async-storage';

const NAMESPACE = 'atmos';

function makeKey(key: string): string {
  return `${NAMESPACE}:${key}`;
}

export async function storageSet<T>(key: string, value: T): Promise<void> {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(makeKey(key), json);
  } catch (error) {
    console.error('storageSet error', key, error);
  }
}

export async function storageGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(makeKey(key));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error('storageGet error', key, error);
    return fallback;
  }
}

export async function storageRemove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(makeKey(key));
  } catch (error) {
    console.error('storageRemove error', key, error);
  }
}

export const StorageKeys = {
  OnboardingCompleted: 'onboarding:completed',
  Settings: 'app:settings',
} as const;

// Default export for the storage service
const StorageService = {
  set: storageSet,
  get: storageGet,
  remove: storageRemove,
  keys: StorageKeys,
};

export default StorageService; 