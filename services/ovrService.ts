import { OVRScore, OVRBreakdown, OVRWeights, OVRConfig, FinancialGoal } from '../types/ovr';
import { SensorData } from '../types';

interface ThresholdAlert {
  id: string;
  timestamp: number;
  domain: 'biological' | 'emotional' | 'environmental' | 'financial' | 'overall';
  threshold: number;
  currentValue: number;
  previousValue: number;
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

interface TrendSummary {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: number;
  endDate: number;
  avgOVR: number;
  macroOVR: number; // long-term smoothed average
  trend: 'improving' | 'stable' | 'declining';
  trendStrength: number; // 0-1
  microTrend: number; // subtle change indicator
  domainTrends: {
    biological: number;
    emotional: number;
    environmental: number;
    financial: number;
  };
}

interface RawReading {
  timestamp: number;
  biological: number;
  emotional: number;
  environmental: number;
  financial: number;
  overall: number;
}

class OVRService {
  private static instance: OVRService;
  private currentOVR: OVRScore | null = null;
  private ovrHistory: OVRScore[] = [];
  private rawReadings: RawReading[] = [];
  private lastOVRUpdate: number = 0;
  private thresholdAlerts: ThresholdAlert[] = [];
  private trendSummaries: TrendSummary[] = [];
  private config: OVRConfig;

  constructor() {
    this.config = {
      weights: {
        biological: 0.3,
        emotional: 0.25,
        environmental: 0.2,
        financial: 0.25
      },
      updateFrequency: 'smart', // intelligent 5-15 minute intervals
      goalSettings: {
        targetOVR: 85,
        dailyImprovement: 2,
        weeklyImprovement: 8
      },
      notifications: {
        scoreChanges: true,
        goalAchievements: true,
        weeklyReports: true,
        monthlyInsights: true
      },
      // New intelligent update settings
      smartUpdate: {
        minIntervalMs: 5 * 60 * 1000, // 5 minutes minimum
        maxIntervalMs: 15 * 60 * 1000, // 15 minutes maximum
        movingAverageWindow: 10, // readings for smoothing
        thresholdSensitivity: 3, // points for real-time alerts
        microTrendSensitivity: 1.5, // points for micro-trend detection
      }
    };
  }

  // Intelligent OVR calculation with smart update intervals
  async calculateOVR(sensorData: SensorData, financialData?: any): Promise<OVRScore> {
    const now = Date.now();
    const biological = this.calculateBiologicalScore(sensorData);
    const emotional = this.calculateEmotionalScore(sensorData);
    const environmental = this.calculateEnvironmentalScore(sensorData);
    const financial = await this.calculateFinancialScore(financialData);

    // Store raw reading for moving average calculation
    const rawReading: RawReading = {
      timestamp: now,
      biological,
      emotional,
      environmental,
      financial,
      overall: Math.round(
        biological * this.config.weights.biological +
        emotional * this.config.weights.emotional +
        environmental * this.config.weights.environmental +
        financial * this.config.weights.financial
      )
    };

    this.rawReadings.push(rawReading);
    if (this.rawReadings.length > 100) {
      this.rawReadings = this.rawReadings.slice(-100);
    }

    // Check for threshold alerts in real-time (don't wait for OVR update)
    this.checkThresholdAlerts(rawReading);

    // Only update main OVR at intelligent intervals
    if (this.shouldUpdateOVR(now)) {
      return this.updateSmoothedOVR(now);
    }

    // Return current OVR if no update needed, or create initial one
    return this.currentOVR || this.updateSmoothedOVR(now);
  }

  // Determine if OVR should be updated based on intelligent criteria
  private shouldUpdateOVR(currentTime: number): boolean {
    const timeSinceLastUpdate = currentTime - this.lastOVRUpdate;
    const { minIntervalMs, maxIntervalMs } = this.config.smartUpdate!;

    // Always update if we've hit the minimum interval
    if (timeSinceLastUpdate >= maxIntervalMs) {
      return true;
    }

    // Don't update if minimum interval hasn't passed
    if (timeSinceLastUpdate < minIntervalMs) {
      return false;
    }

    // Update early if there's significant change in raw readings
    const recentReadings = this.rawReadings.slice(-5);
    if (recentReadings.length >= 3) {
      const variance = this.calculateVariance(recentReadings.map(r => r.overall));
      return variance > 10; // Update if significant variance detected
    }

    return false;
  }

  // Update OVR with smoothed moving average
  private updateSmoothedOVR(currentTime: number): OVRScore {
    const { movingAverageWindow } = this.config.smartUpdate!;
    const recentReadings = this.rawReadings.slice(-movingAverageWindow);
    
    if (recentReadings.length === 0) {
      // Fallback if no readings available
      return this.createFallbackOVR(currentTime);
    }

    // Calculate smoothed scores using moving average
    const smoothedBio = this.calculateMovingAverage(recentReadings.map(r => r.biological));
    const smoothedEmo = this.calculateMovingAverage(recentReadings.map(r => r.emotional));
    const smoothedEnv = this.calculateMovingAverage(recentReadings.map(r => r.environmental));
    const smoothedFin = this.calculateMovingAverage(recentReadings.map(r => r.financial));

    const smoothedOverall = Math.round(
      smoothedBio * this.config.weights.biological +
      smoothedEmo * this.config.weights.emotional +
      smoothedEnv * this.config.weights.environmental +
      smoothedFin * this.config.weights.financial
    );

    // Calculate change and micro-trend
    const change = this.currentOVR ? smoothedOverall - this.currentOVR.overall : 0;
    const microTrend = this.calculateMicroTrend();
    
    const explanation = this.generateExplanation(change, {
      biological: smoothedBio,
      emotional: smoothedEmo,
      environmental: smoothedEnv,
      financial: smoothedFin
    });

    const newOVR: OVRScore = {
      overall: smoothedOverall,
      biological: smoothedBio,
      emotional: smoothedEmo,
      environmental: smoothedEnv,
      financial: smoothedFin,
      timestamp: currentTime,
      change,
      explanation,
      microTrend // Add micro-trend indicator
    };

    // Update history and tracking
    this.ovrHistory.push(newOVR);
    if (this.ovrHistory.length > 1000) {
      this.ovrHistory = this.ovrHistory.slice(-1000);
    }

    this.currentOVR = newOVR;
    this.lastOVRUpdate = currentTime;
    
    // Generate trend summaries periodically
    this.updateTrendSummaries();

    return newOVR;
  }

  // Calculate Biological Index (0-99)
  private calculateBiologicalScore(sensorData: SensorData): number {
    let score = 50; // Base score

    // Sleep Quality (0-100)
    if (sensorData.sleepQuality !== undefined) {
      score += (sensorData.sleepQuality - 50) * 0.3;
    }

    // Heart Rate Variability (lower is better for stress)
    const hrVariability = this.calculateHRV(sensorData);
    if (hrVariability > 0) {
      score += Math.min(hrVariability * 0.2, 20);
    }

    // Activity Balance (movement vs rest)
    const activityScore = Math.min(sensorData.movement / 100 * 20, 20);
    score += activityScore;

    // Recovery (inverse of stress)
    const recoveryScore = Math.max(0, (100 - sensorData.stressIndex) * 0.2);
    score += recoveryScore;

    return Math.max(0, Math.min(99, Math.round(score)));
  }

  // Calculate Emotional Index (0-99)
  private calculateEmotionalScore(sensorData: SensorData): number {
    let score = 50; // Base score

    // Stress Levels (inverse relationship)
    const stressScore = Math.max(0, (100 - sensorData.stressIndex) * 0.4);
    score += stressScore;

    // Mood Score (if available)
    if (sensorData.moodScore !== undefined) {
      score += (sensorData.moodScore - 50) * 0.3;
    }

    // Heart Rate Stability (lower variability = more stable)
    const hrStability = Math.max(0, 20 - this.calculateHRV(sensorData) * 0.1);
    score += hrStability;

    // Activity-Emotion Correlation
    if (sensorData.movement > 50 && sensorData.stressIndex < 60) {
      score += 10; // Bonus for active + low stress
    }

    return Math.max(0, Math.min(99, Math.round(score)));
  }

  // Calculate Environmental Index (0-99)
  private calculateEnvironmentalScore(sensorData: SensorData): number {
    let score = 50; // Base score

    // Air Quality (0-100)
    const airQualityScore = (sensorData.airQuality / 100) * 30;
    score += airQualityScore;

    // Noise Levels (lower is better)
    const noiseScore = Math.max(0, (100 - sensorData.movement) * 0.2);
    score += noiseScore;

    // Temperature Comfort (assuming 36.5-37.5°C is optimal)
    const tempDiff = Math.abs(sensorData.skinTemperature - 37);
    const tempScore = Math.max(0, 20 - tempDiff * 4);
    score += tempScore;

    // Daylight Exposure (time-based)
    const hour = new Date().getHours();
    const daylightScore = hour >= 6 && hour <= 18 ? 20 : 10;
    score += daylightScore;

    return Math.max(0, Math.min(99, Math.round(score)));
  }

  // Calculate Financial Vitality Index (0-99)
  private async calculateFinancialScore(financialData?: any): Promise<number> {
    try {
      // Try to get real financial data
      const { financialService } = await import('./financialService');
      const metrics = await financialService.getFinancialMetrics();
      return financialService.calculateFinancialScore(metrics);
    } catch (error) {
      console.log('Using fallback financial calculation:', error);
      
      if (!financialData) {
        return 50; // Default score if no financial data
      }

      let score = 50; // Base score

      // Mock financial calculations (replace with real API data)
      const savingsProgress = financialData.savingsProgress || 50;
      const debtRatio = financialData.debtRatio || 0.3;
      const budgetAdherence = financialData.budgetAdherence || 70;
      const incomeGrowth = financialData.incomeGrowth || 0;

      // Savings Progress (0-30 points)
      score += (savingsProgress / 100) * 30;

      // Debt Ratio (0-20 points, lower is better)
      const debtScore = Math.max(0, 20 - (debtRatio * 50));
      score += debtScore;

      // Budget Adherence (0-20 points)
      score += (budgetAdherence / 100) * 20;

      // Income Growth (0-10 points)
      const growthScore = Math.min(10, Math.max(0, incomeGrowth * 10));
      score += growthScore;

      return Math.max(0, Math.min(99, Math.round(score)));
    }
  }

  // Calculate Heart Rate Variability
  private calculateHRV(sensorData: SensorData): number {
    // Mock HRV calculation (replace with actual algorithm)
    const baseHRV = 15;
    const stressImpact = sensorData.stressIndex / 100;
    return Math.max(0, baseHRV - (stressImpact * 10));
  }

  // Generate explanation for score changes
  private generateExplanation(change: number, scores: { biological: number; emotional: number; environmental: number; financial: number }): string {
    if (change === 0) return "Score maintained - consistent performance across all areas";

    const improvements: string[] = [];
    const declines: string[] = [];

    if (scores.biological > 70) improvements.push("excellent biological health");
    if (scores.biological < 40) declines.push("biological challenges");

    if (scores.emotional > 70) improvements.push("strong emotional balance");
    if (scores.emotional < 40) declines.push("emotional stress");

    if (scores.environmental > 70) improvements.push("optimal environment");
    if (scores.environmental < 40) declines.push("environmental factors");

    if (scores.financial > 70) improvements.push("financial progress");
    if (scores.financial < 40) declines.push("financial concerns");

    if (change > 0) {
      return `+${change}: ${improvements.join(", ")}`;
    } else {
      return `${change}: ${declines.join(", ")}`;
    }
  }

  // Get current OVR score
  getCurrentOVR(): OVRScore | null {
    return this.currentOVR;
  }

  // Get OVR history
  getOVRHistory(limit: number = 100): OVRScore[] {
    // If we don't have enough history, generate mock data
    if (this.ovrHistory.length < limit) {
      const mockHistory: OVRScore[] = [];
      const baseScore = this.currentOVR?.overall || 87;
      
      for (let i = limit - 1; i >= 0; i--) {
        const timestamp = Date.now() - (i * 60 * 60 * 1000); // Hourly data
        const variation = (Math.random() - 0.5) * 10; // ±5 points variation
        const score = Math.max(50, Math.min(99, baseScore + variation));
        
        mockHistory.push({
          timestamp,
          overall: Math.round(score),
          biological: Math.round(score + (Math.random() - 0.5) * 8),
          emotional: Math.round(score + (Math.random() - 0.5) * 8),
          environmental: Math.round(score + (Math.random() - 0.5) * 8),
          financial: Math.round(score + (Math.random() - 0.5) * 8),
          change: i === 0 ? 0 : Math.round((Math.random() - 0.5) * 4),
          microTrend: Math.round((Math.random() - 0.5) * 2 * 10) / 10,
          explanation: 'Historical data for trend analysis'
        });
      }
      
      return mockHistory;
    }
    
    return this.ovrHistory.slice(-limit);
  }

  // Get OVR trends
  getOVRTrends(period: 'day' | 'week' | 'month'): OVRScore[] {
    const now = Date.now();
    const periodMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = now - periodMs[period];
    return this.ovrHistory.filter(score => score.timestamp > cutoff);
  }

  // Update OVR weights
  updateWeights(weights: Partial<OVRWeights>): void {
    this.config.weights = { ...this.config.weights, ...weights };
  }

  // Get OVR configuration
  getConfig(): OVRConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(config: Partial<OVRConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Generate mock financial data for development
  generateMockFinancialData() {
    return {
      savingsProgress: 65 + Math.random() * 30,
      debtRatio: 0.2 + Math.random() * 0.3,
      budgetAdherence: 70 + Math.random() * 25,
      incomeGrowth: Math.random() * 0.1
    };
  }

  // Get score category label
  getScoreCategory(score: number): string {
    if (score >= 90) return 'Elite';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Average';
    if (score >= 40) return 'Below Average';
    if (score >= 30) return 'Poor';
    return 'Critical';
  }

  // Get score color
  getScoreColor(score: number): string {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    if (score >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  }

  // === NEW INTELLIGENT OVR METHODS ===

  // Calculate moving average for smoothing
  private calculateMovingAverage(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / values.length);
  }

  // Calculate variance for change detection
  private calculateVariance(values: number[]): number {
    if (values.length < 2) return 0;
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
    return variance;
  }

  // Calculate micro-trend indicator
  private calculateMicroTrend(): number {
    if (this.rawReadings.length < 3) return 0;
    
    const recent = this.rawReadings.slice(-3);
    const trend = (recent[2].overall - recent[0].overall) / 2;
    return Math.max(-2, Math.min(2, Math.round(trend * 10) / 10));
  }

  // Check for threshold alerts in real-time
  private checkThresholdAlerts(reading: RawReading): void {
    const { thresholdSensitivity } = this.config.smartUpdate!;
    const lastReading = this.rawReadings[this.rawReadings.length - 2];
    
    if (!lastReading) return;

    // Check each domain for threshold crossings
    const domains: Array<keyof Omit<RawReading, 'timestamp'>> = ['biological', 'emotional', 'environmental', 'financial', 'overall'];
    
    domains.forEach(domain => {
      const current = reading[domain];
      const previous = lastReading[domain];
      const change = Math.abs(current - previous);
      
      if (change >= thresholdSensitivity) {
        const alert: ThresholdAlert = {
          id: `${domain}-${Date.now()}`,
          timestamp: reading.timestamp,
          domain: domain as any,
          threshold: thresholdSensitivity,
          currentValue: current,
          previousValue: previous,
          severity: change >= 10 ? 'critical' : change >= 5 ? 'warning' : 'info',
          message: this.generateAlertMessage(domain as any, current, previous, change)
        };

        this.thresholdAlerts.push(alert);
        if (this.thresholdAlerts.length > 50) {
          this.thresholdAlerts = this.thresholdAlerts.slice(-50);
        }
      }
    });
  }

  // Generate alert message
  private generateAlertMessage(domain: string, current: number, previous: number, change: number): string {
    const direction = current > previous ? 'increased' : 'decreased';
    const magnitude = change >= 10 ? 'significantly' : change >= 5 ? 'notably' : 'slightly';
    return `${domain.charAt(0).toUpperCase() + domain.slice(1)} score ${magnitude} ${direction} by ${change.toFixed(1)} points`;
  }

  // Update trend summaries
  private updateTrendSummaries(): void {
    const now = Date.now();
    const lastSummary = this.trendSummaries[this.trendSummaries.length - 1];
    
    // Generate daily summary if needed
    if (!lastSummary || now - lastSummary.endDate > 24 * 60 * 60 * 1000) {
      this.generateTrendSummary('daily', now);
    }
    
    // Generate weekly summary on Sundays
    const dayOfWeek = new Date(now).getDay();
    if (dayOfWeek === 0) { // Sunday
      this.generateTrendSummary('weekly', now);
    }
  }

  // Generate trend summary for a period
  private generateTrendSummary(period: 'daily' | 'weekly' | 'monthly', endTime: number): void {
    const periodMs = period === 'daily' ? 24 * 60 * 60 * 1000 : 
                    period === 'weekly' ? 7 * 24 * 60 * 60 * 1000 : 
                    30 * 24 * 60 * 60 * 1000;
    
    const startTime = endTime - periodMs;
    const periodData = this.ovrHistory.filter(ovr => ovr.timestamp >= startTime && ovr.timestamp <= endTime);
    
    if (periodData.length === 0) return;

    const avgOVR = this.calculateMovingAverage(periodData.map(d => d.overall));
    const macroOVR = this.calculateMacroOVR(period);
    const trendDirection = this.calculateTrendDirection(periodData);
    const trendStrength = this.calculateTrendStrength(periodData);

    const summary: TrendSummary = {
      period,
      startDate: startTime,
      endDate: endTime,
      avgOVR,
      macroOVR,
      trend: trendDirection,
      trendStrength,
      microTrend: this.calculateMicroTrend(),
      domainTrends: {
        biological: this.calculateMovingAverage(periodData.map(d => d.biological)),
        emotional: this.calculateMovingAverage(periodData.map(d => d.emotional)),
        environmental: this.calculateMovingAverage(periodData.map(d => d.environmental)),
        financial: this.calculateMovingAverage(periodData.map(d => d.financial)),
      }
    };

    this.trendSummaries.push(summary);
    if (this.trendSummaries.length > 100) {
      this.trendSummaries = this.trendSummaries.slice(-100);
    }
  }

  // Calculate macro (long-term) OVR
  private calculateMacroOVR(period: 'daily' | 'weekly' | 'monthly'): number {
    const windowSize = period === 'daily' ? 7 : period === 'weekly' ? 4 : 3;
    const recentSummaries = this.trendSummaries.slice(-windowSize);
    if (recentSummaries.length === 0) return this.currentOVR?.overall || 50;
    return this.calculateMovingAverage(recentSummaries.map(s => s.avgOVR));
  }

  // Calculate trend direction
  private calculateTrendDirection(data: OVRScore[]): 'improving' | 'stable' | 'declining' {
    if (data.length < 2) return 'stable';
    
    const first = data[0].overall;
    const last = data[data.length - 1].overall;
    const change = last - first;
    
    if (change > 2) return 'improving';
    if (change < -2) return 'declining';
    return 'stable';
  }

  // Calculate trend strength
  private calculateTrendStrength(data: OVRScore[]): number {
    if (data.length < 2) return 0;
    
    const values = data.map(d => d.overall);
    const variance = this.calculateVariance(values);
    return Math.min(1, variance / 100); // Normalize to 0-1
  }

  // Create fallback OVR when no readings available
  private createFallbackOVR(timestamp: number): OVRScore {
    return {
      overall: 50,
      biological: 50,
      emotional: 50,
      environmental: 50,
      financial: 50,
      timestamp,
      change: 0,
      explanation: "Initializing OVR system...",
      microTrend: 0
    };
  }

  // Get threshold alerts
  getThresholdAlerts(limit: number = 10): ThresholdAlert[] {
    return this.thresholdAlerts.slice(-limit);
  }

  // Get trend summaries
  getTrendSummaries(period?: 'daily' | 'weekly' | 'monthly'): TrendSummary[] {
    if (!period) return this.trendSummaries;
    return this.trendSummaries.filter(s => s.period === period);
  }

  // Get micro-trend indicator for current OVR
  getMicroTrend(): number {
    return this.currentOVR?.microTrend || 0;
  }

  // Get OVR breakdown with detailed domain information
  getOVRBreakdown(): OVRBreakdown {
    const current = this.currentOVR;
    if (!current) {
      return this.createDefaultBreakdown();
    }

    return {
      biological: {
        score: current.biological,
        components: {
          sleepQuality: Math.round(70 + Math.random() * 20),
          activityBalance: Math.round(65 + Math.random() * 25),
          recovery: Math.round(75 + Math.random() * 15),
          heartRateVariability: Math.round(80 + Math.random() * 15),
        },
        trends: {
          daily: this.generateMockTrends(24),
          weekly: this.generateMockTrends(7),
          monthly: this.generateMockTrends(30),
        },
        insights: [
          "Sleep quality is optimal for recovery",
          "Activity levels are well balanced",
          "Heart rate variability indicates good stress management"
        ]
      },
      emotional: {
        score: current.emotional,
        components: {
          moodStability: Math.round(75 + Math.random() * 20),
          stressLevels: Math.round(70 + Math.random() * 25),
          positiveInteractions: Math.round(80 + Math.random() * 15),
          emotionalResilience: Math.round(75 + Math.random() * 20),
        },
        trends: {
          daily: this.generateMockTrends(24),
          weekly: this.generateMockTrends(7),
          monthly: this.generateMockTrends(30),
        },
        insights: [
          "Emotional stability is maintaining positive trends",
          "Stress management techniques are effective",
          "Social interactions are contributing to emotional well-being"
        ]
      },
      environmental: {
        score: current.environmental,
        components: {
          airQuality: Math.round(85 + Math.random() * 10),
          noiseLevels: Math.round(75 + Math.random() * 20),
          temperatureComfort: Math.round(80 + Math.random() * 15),
          daylightExposure: Math.round(70 + Math.random() * 25),
        },
        trends: {
          daily: this.generateMockTrends(24),
          weekly: this.generateMockTrends(7),
          monthly: this.generateMockTrends(30),
        },
        insights: [
          "Air quality is consistently excellent",
          "Environmental factors are supporting optimal performance",
          "Light exposure patterns are well balanced"
        ]
      },
      financial: {
        score: current.financial,
        components: {
          savingsProgress: Math.round(70 + Math.random() * 25),
          debtRatio: Math.round(75 + Math.random() * 20),
          budgetAdherence: Math.round(80 + Math.random() * 15),
          incomeGrowth: Math.round(65 + Math.random() * 30),
        },
        trends: {
          daily: this.generateMockTrends(24),
          weekly: this.generateMockTrends(7),
          monthly: this.generateMockTrends(30),
        },
        insights: [
          "Savings goals are on track",
          "Budget adherence is strong",
          "Financial planning is showing positive results"
        ],
        goals: this.generateMockFinancialGoals(),
        recentTransactions: this.generateMockTransactions()
      }
    };
  }

  // Generate mock trends for development
  private generateMockTrends(points: number): number[] {
    const trends: number[] = [];
    let baseValue = 75 + Math.random() * 15;
    
    for (let i = 0; i < points; i++) {
      const variation = (Math.random() - 0.5) * 10;
      trends.push(Math.max(0, Math.min(99, Math.round(baseValue + variation))));
      baseValue += (Math.random() - 0.5) * 2; // Slight trend
    }
    
    return trends;
  }

  // Generate mock financial goals
  private generateMockFinancialGoals(): FinancialGoal[] {
    return [
      {
        id: 'emergency-fund',
        name: 'Emergency Fund',
        targetAmount: 10000,
        currentAmount: 7500,
        targetDate: Date.now() + (90 * 24 * 60 * 60 * 1000),
        category: 'emergency',
        priority: 'high',
        progress: 75
      },
      {
        id: 'vacation-savings',
        name: 'Vacation Fund',
        targetAmount: 5000,
        currentAmount: 3200,
        targetDate: Date.now() + (180 * 24 * 60 * 60 * 1000),
        category: 'savings',
        priority: 'medium',
        progress: 64
      }
    ];
  }

  // Generate mock transactions
  private generateMockTransactions(): any[] {
    return [
      {
        id: '1',
        amount: 150,
        category: 'Food',
        description: 'Grocery shopping',
        timestamp: Date.now() - (2 * 60 * 60 * 1000),
        type: 'expense',
        impact: 'neutral'
      },
      {
        id: '2',
        amount: 2500,
        category: 'Income',
        description: 'Salary deposit',
        timestamp: Date.now() - (24 * 60 * 60 * 1000),
        type: 'income',
        impact: 'positive'
      }
    ];
  }

  // Create default breakdown when no OVR data available
  private createDefaultBreakdown(): OVRBreakdown {
    return {
      biological: {
        score: 50,
        components: { sleepQuality: 50, activityBalance: 50, recovery: 50, heartRateVariability: 50 },
        trends: { daily: [], weekly: [], monthly: [] },
        insights: []
      },
      emotional: {
        score: 50,
        components: { moodStability: 50, stressLevels: 50, positiveInteractions: 50, emotionalResilience: 50 },
        trends: { daily: [], weekly: [], monthly: [] },
        insights: []
      },
      environmental: {
        score: 50,
        components: { airQuality: 50, noiseLevels: 50, temperatureComfort: 50, daylightExposure: 50 },
        trends: { daily: [], weekly: [], monthly: [] },
        insights: []
      },
      financial: {
        score: 50,
        components: { savingsProgress: 50, debtRatio: 50, budgetAdherence: 50, incomeGrowth: 50 },
        trends: { daily: [], weekly: [], monthly: [] },
        insights: [],
        goals: [],
        recentTransactions: []
      }
    };
  }

  // Clear old data (for maintenance)
  clearOldData(retentionDays: number = 30): void {
    const cutoff = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
    this.rawReadings = this.rawReadings.filter(r => r.timestamp > cutoff);
    this.ovrHistory = this.ovrHistory.filter(h => h.timestamp > cutoff);
    this.thresholdAlerts = this.thresholdAlerts.filter(a => a.timestamp > cutoff);
    this.trendSummaries = this.trendSummaries.filter(s => s.endDate > cutoff);
  }
}

export const ovrService = new OVRService();
export default OVRService; 