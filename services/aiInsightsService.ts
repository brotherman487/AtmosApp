import { SensorData, AIInsight, DailyRhythm, LongTermPattern } from '../types';

class AIInsightsService {
  private static instance: AIInsightsService;
  private insights: AIInsight[] = [];
  private patterns: LongTermPattern[] = [];

  // Generate AI insights based on sensor data
  generateInsights(sensorData: SensorData, historicalData: SensorData[]): AIInsight[] {
    const newInsights: AIInsight[] = [];
    const now = Date.now();

    // Stress level analysis
    if (sensorData.stressIndex > 70) {
      newInsights.push({
        id: `stress-${now}`,
        type: 'warning',
        priority: 'high',
        title: 'Elevated Stress Detected',
        content: `Your stress level is ${sensorData.stressIndex}% - consider taking a 2-minute breathing break or moving to a quieter environment.`,
        action: 'Take a breathing break',
        sensorTrigger: 'stressIndex',
        threshold: 70,
        timestamp: now,
        read: false,
        category: 'health'
      });
    }

    // Heart rate variability analysis
    if (historicalData.length > 10) {
      const recentHR = historicalData.slice(-10).map(d => d.heartRate);
      const hrVariability = Math.std(recentHR);
      
      if (hrVariability < 5) {
        newInsights.push({
          id: `hrv-${now}`,
          type: 'insight',
          priority: 'medium',
          title: 'Low Heart Rate Variability',
          content: 'Your heart rate is very consistent, which may indicate you need more physical activity or stress management.',
          action: 'Consider light exercise',
          sensorTrigger: 'heartRate',
          threshold: 5,
          timestamp: now,
          read: false,
          category: 'health'
        });
      }
    }

    // Air quality warnings
    if (sensorData.airQuality < 50) {
      newInsights.push({
        id: `air-${now}`,
        type: 'warning',
        priority: 'medium',
        title: 'Poor Air Quality',
        content: `Air quality is ${sensorData.airQuality} - consider moving to a better ventilated area or wearing a mask.`,
        action: 'Move to better air quality',
        sensorTrigger: 'airQuality',
        threshold: 50,
        timestamp: now,
        read: false,
        category: 'environment'
      });
    }

    // Movement optimization
    if (sensorData.movement < 20) {
      newInsights.push({
        id: `movement-${now}`,
        type: 'nudge',
        priority: 'low',
        title: 'Low Activity Level',
        content: 'You\'ve been sedentary for a while. A 5-minute walk could boost your energy and reduce stress.',
        action: 'Take a short walk',
        sensorTrigger: 'movement',
        threshold: 20,
        timestamp: now,
        read: false,
        category: 'health'
      });
    }

    // Sleep quality insights (early morning)
    const timeOfDay = new Date().getHours();
    if (timeOfDay < 8 && sensorData.sleepQuality !== undefined) {
      if (sensorData.sleepQuality < 70) {
        newInsights.push({
          id: `sleep-${now}`,
          type: 'optimization',
          priority: 'medium',
          title: 'Sleep Quality Below Optimal',
          content: `Your sleep quality was ${sensorData.sleepQuality}% last night. Consider adjusting your evening routine.`,
          action: 'Review evening habits',
          sensorTrigger: 'sleepQuality',
          threshold: 70,
          timestamp: now,
          read: false,
          category: 'longevity'
        });
      }
    }

    // Environmental optimization
    if (sensorData.airQuality > 85 && sensorData.stressIndex < 40) {
      newInsights.push({
        id: `optimal-${now}`,
        type: 'insight',
        priority: 'low',
        title: 'Optimal Conditions',
        content: 'Perfect environment detected! Your stress is low and air quality is excellent. Great time for focused work.',
        action: 'Capitalize on optimal conditions',
        timestamp: now,
        read: false,
        category: 'rhythm'
      });
    }

    // Add new insights to the list
    this.insights.push(...newInsights);
    
    // Keep only last 100 insights
    if (this.insights.length > 100) {
      this.insights = this.insights.slice(-100);
    }

    return newInsights;
  }

  // Analyze long-term patterns
  analyzePatterns(historicalData: SensorData[], period: 'week' | 'month' | 'quarter' | 'year'): LongTermPattern {
    const now = Date.now();
    const periodMs = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      quarter: 90 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000
    };

    const cutoffTime = now - periodMs[period];
    const periodData = historicalData.filter(d => d.timestamp > cutoffTime);

    if (periodData.length === 0) {
      return {
        period,
        data: { stressTrend: [], sleepQuality: [], environmentalScore: [], energyLevels: [] },
        correlations: []
      };
    }

    // Group data by day
    const dailyData = this.groupDataByDay(periodData);
    
    // Calculate trends
    const stressTrend = dailyData.map(d => d.averageStress);
    const sleepQuality = dailyData.map(d => d.averageSleepQuality).filter(q => q !== undefined);
    const environmentalScore = dailyData.map(d => d.averageAirQuality);
    const energyLevels = dailyData.map(d => 100 - d.averageStress); // Inverse of stress

    // Find correlations
    const correlations = this.findCorrelations(dailyData);

    return {
      period,
      data: { stressTrend, sleepQuality, environmentalScore, energyLevels },
      correlations
    };
  }

  // Group sensor data by day
  private groupDataByDay(data: SensorData[]) {
    const dailyGroups: { [key: string]: SensorData[] } = {};
    
    data.forEach(reading => {
      const date = new Date(reading.timestamp).toDateString();
      if (!dailyGroups[date]) {
        dailyGroups[date] = [];
      }
      dailyGroups[date].push(reading);
    });

    return Object.values(dailyGroups).map(dayData => ({
      averageStress: dayData.reduce((sum, d) => sum + d.stressIndex, 0) / dayData.length,
      averageSleepQuality: dayData.find(d => d.sleepQuality !== undefined)?.sleepQuality,
      averageAirQuality: dayData.reduce((sum, d) => sum + d.airQuality, 0) / dayData.length,
      averageHeartRate: dayData.reduce((sum, d) => sum + d.heartRate, 0) / dayData.length,
      averageMovement: dayData.reduce((sum, d) => sum + d.movement, 0) / dayData.length,
    }));
  }

  // Find correlations in daily data
  private findCorrelations(dailyData: any[]) {
    const correlations = [];

    // Sleep quality vs stress correlation
    const sleepStressData = dailyData.filter(d => d.averageSleepQuality !== undefined);
    if (sleepStressData.length > 3) {
      const correlation = this.calculateCorrelation(
        sleepStressData.map(d => d.averageSleepQuality),
        sleepStressData.map(d => d.averageStress)
      );
      
      if (Math.abs(correlation) > 0.6) {
        correlations.push({
          description: `Strong ${correlation > 0 ? 'positive' : 'negative'} correlation between sleep quality and stress levels`,
          confidence: Math.abs(correlation),
          actionable: true
        });
      }
    }

    // Movement vs stress correlation
    const movementStressData = dailyData.filter(d => d.averageMovement > 0);
    if (movementStressData.length > 3) {
      const correlation = this.calculateCorrelation(
        movementStressData.map(d => d.averageMovement),
        movementStressData.map(d => d.averageStress)
      );
      
      if (correlation < -0.5) {
        correlations.push({
          description: 'Higher movement correlates with lower stress levels',
          confidence: Math.abs(correlation),
          actionable: true
        });
      }
    }

    return correlations;
  }

  // Calculate correlation coefficient
  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;
    
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  // Get all insights
  getAllInsights(): AIInsight[] {
    return [...this.insights];
  }

  // Get unread insights
  getUnreadInsights(): AIInsight[] {
    return this.insights.filter(insight => !insight.read);
  }

  // Mark insight as read
  markAsRead(insightId: string): void {
    const insight = this.insights.find(i => i.id === insightId);
    if (insight) {
      insight.read = true;
    }
  }

  // Get insights by category
  getInsightsByCategory(category: AIInsight['category']): AIInsight[] {
    return this.insights.filter(insight => insight.category === category);
  }

  // Get insights by priority
  getInsightsByPriority(priority: AIInsight['priority']): AIInsight[] {
    return this.insights.filter(insight => insight.priority === priority);
  }

  // Clear old insights
  clearOldInsights(olderThanDays: number = 30): void {
    const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
    this.insights = this.insights.filter(insight => insight.timestamp > cutoffTime);
  }
}

// Add Math.std polyfill for standard deviation
declare global {
  interface Math {
    std(array: number[]): number;
  }
}

Math.std = function(array: number[]): number {
  const n = array.length;
  if (n === 0) return 0;
  
  const mean = array.reduce((a, b) => a + b, 0) / n;
  const variance = array.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n;
  
  return Math.sqrt(variance);
};

export const aiInsightsService = new AIInsightsService();
export default AIInsightsService; 