// Atmos Symbiotic AI Control Hub Types

export interface SensorData {
  timestamp: number;
  heartRate: number;
  skinTemperature: number;
  stressIndex: number;
  airQuality: number;
  movement: number;
  sleepQuality?: number;
  moodScore?: number;
  location?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
}

export interface AtmosAge {
  biologicalAge: number; // Calculated biological age
  chronologicalAge: number; // Actual age
  ageDifference: number; // biologicalAge - chronologicalAge (negative = younger)
  paceOfAging: number; // Rate of aging (0.5x = slower, 2.0x = faster)
  factors: {
    sleepQuality: number; // Impact on aging (-10 to +10 years)
    stressLevels: number; // Impact on aging (-8 to +8 years)
    activityLevels: number; // Impact on aging (-5 to +5 years)
    environmentalQuality: number; // Impact on aging (-3 to +3 years)
    financialStress: number; // Impact on aging (-2 to +2 years)
  };
  trends: {
    weekly: number[]; // Weekly biological age readings
    monthly: number[]; // Monthly biological age readings
    paceOfAging: number[]; // Pace of aging over time
  };
  insights: string[]; // AI-generated insights about aging
  recommendations: string[]; // Actionable recommendations
  lastUpdated: number;
}

export interface AIInsight {
  id: string;
  type: 'nudge' | 'insight' | 'warning' | 'optimization' | 'pattern';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  content: string;
  action?: string;
  sensorTrigger?: keyof SensorData;
  threshold?: number;
  timestamp: number;
  read: boolean;
  category: 'health' | 'safety' | 'longevity' | 'environment' | 'rhythm';
}

export interface WearableStatus {
  connected: boolean;
  batteryLevel: number;
  lastSync: number;
  firmwareVersion: string;
  signalStrength: number;
}

export interface DailyRhythm {
  date: string;
  averageStress: number;
  peakEnergyTime: string;
  recoveryQuality: number;
  environmentalScore: number;
  insights: AIInsight[];
  recommendations: string[];
}

export interface LongTermPattern {
  period: 'week' | 'month' | 'quarter' | 'year';
  data: {
    stressTrend: number[];
    sleepQuality: number[];
    environmentalScore: number[];
    energyLevels: number[];
  };
  correlations: {
    description: string;
    confidence: number;
    actionable: boolean;
  }[];
}

export interface VoiceCommand {
  id: string;
  command: string;
  response: string;
  timestamp: number;
  context: 'health' | 'safety' | 'optimization' | 'general';
}

export interface EnvironmentZone {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  airQuality: number;
  noiseLevel: number;
  stressReduction: number;
  recommendedActivities: string[];
  lastVisit?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  healthGoals: string[];
  preferences: {
    notificationFrequency: 'low' | 'medium' | 'high';
    privacyLevel: 'basic' | 'enhanced' | 'maximum';
    aiPersonality: 'gentle' | 'balanced' | 'proactive';
  };
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
  }>;
}

export interface AppSettings {
  notifications: {
    healthAlerts: boolean;
    environmentalWarnings: boolean;
    dailyInsights: boolean;
    emergencyAlerts: boolean;
  };
  dataSync: {
    cloudSync: boolean;
    offlineMode: boolean;
    dataRetention: number; // days
  };
  aiFeatures: {
    proactiveNudges: boolean;
    patternRecognition: boolean;
    predictiveInsights: boolean;
    voiceAssistant: boolean;
  };
} 