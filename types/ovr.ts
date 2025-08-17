// Atmos OVR (Overall Alignment) System Types

export interface OVRScore {
  overall: number; // 0-99 Overall Alignment Score
  biological: number; // 0-99 Biological Index
  emotional: number; // 0-99 Emotional Index
  environmental: number; // 0-99 Environmental Index
  financial: number; // 0-99 Financial Vitality Index
  timestamp: number;
  change: number; // Daily change (+/-)
  explanation: string; // Why the score changed
  microTrend?: number; // Subtle trend indicator (-2 to +2)
}

export interface OVRBreakdown {
  biological: {
    score: number;
    components: {
      sleepQuality: number;
      activityBalance: number;
      recovery: number;
      heartRateVariability: number;
    };
    trends: {
      daily: number[];
      weekly: number[];
      monthly: number[];
    };
    insights: string[];
  };
  emotional: {
    score: number;
    components: {
      moodStability: number;
      stressLevels: number;
      positiveInteractions: number;
      emotionalResilience: number;
    };
    trends: {
      daily: number[];
      weekly: number[];
      monthly: number[];
    };
    insights: string[];
  };
  environmental: {
    score: number;
    components: {
      airQuality: number;
      noiseLevels: number;
      temperatureComfort: number;
      daylightExposure: number;
    };
    trends: {
      daily: number[];
      weekly: number[];
      monthly: number[];
    };
    insights: string[];
  };
  financial: {
    score: number;
    components: {
      savingsProgress: number;
      debtRatio: number;
      budgetAdherence: number;
      incomeGrowth: number;
    };
    trends: {
      daily: number[];
      weekly: number[];
      monthly: number[];
    };
    insights: string[];
    goals: FinancialGoal[];
    recentTransactions: FinancialTransaction[];
  };
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: number;
  category: 'savings' | 'debt' | 'investment' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number; // 0-100%
}

export interface FinancialTransaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  timestamp: number;
  type: 'income' | 'expense' | 'transfer';
  impact: 'positive' | 'negative' | 'neutral';
}

export interface OVRTrend {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  data: OVRScore[];
  summary: {
    average: number;
    trend: 'improving' | 'declining' | 'stable';
    change: number;
    highlights: string[];
    recommendations: string[];
  };
}

export interface OVRPrompt {
  id: string;
  type: 'improvement' | 'maintenance' | 'warning' | 'celebration';
  score: number;
  message: string;
  action: string;
  category: 'biological' | 'emotional' | 'environmental' | 'financial' | 'overall';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  read: boolean;
}

export interface OVRWeights {
  biological: number; // Default: 0.25 (25%)
  emotional: number; // Default: 0.25 (25%)
  environmental: number; // Default: 0.25 (25%)
  financial: number; // Default: 0.25 (25%)
}

export interface OVRConfig {
  weights: OVRWeights;
  updateFrequency: 'realtime' | 'hourly' | 'daily' | 'smart';
  goalSettings: {
    targetOVR: number;
    dailyImprovement: number;
    weeklyImprovement: number;
  };
  notifications: {
    scoreChanges: boolean;
    goalAchievements: boolean;
    weeklyReports: boolean;
    monthlyInsights: boolean;
  };
  smartUpdate?: {
    minIntervalMs: number;
    maxIntervalMs: number;
    movingAverageWindow: number;
    thresholdSensitivity: number;
    microTrendSensitivity: number;
  };
} 