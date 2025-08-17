import { AtmosAge } from '../types';
import { OVRScore } from '../types/ovr';
import { SensorData } from '../types';

class AtmosAgeService {
  private static instance: AtmosAgeService;
  private currentAtmosAge: AtmosAge | null = null;
  private atmosAgeHistory: AtmosAge[] = [];
  private userChronologicalAge: number = 30; // Default, should be set from user profile

  constructor() {
    // Initialize with default chronological age
    // In a real app, this would come from user profile
    this.userChronologicalAge = 30;
  }

  // Calculate Atmos Age based on current health metrics
  async calculateAtmosAge(ovrScore: OVRScore, sensorData: SensorData): Promise<AtmosAge> {
    const now = Date.now();
    
    // Calculate biological age based on OVR scores and sensor data
    const biologicalAge = this.calculateBiologicalAge(ovrScore, sensorData);
    
    // Calculate age difference
    const ageDifference = biologicalAge - this.userChronologicalAge;
    
    // Calculate pace of aging (how fast/slow you're aging compared to chronological time)
    const paceOfAging = this.calculatePaceOfAging(ageDifference);
    
    // Calculate individual factor impacts
    const factors = this.calculateAgingFactors(ovrScore, sensorData);
    
    // Generate insights and recommendations
    const insights = this.generateInsights(biologicalAge, ageDifference, factors);
    const recommendations = this.generateRecommendations(factors, ageDifference);
    
    // Update trends
    this.updateTrends(biologicalAge, paceOfAging);
    
    const atmosAge: AtmosAge = {
      biologicalAge: Math.round(biologicalAge * 10) / 10, // Round to 1 decimal
      chronologicalAge: this.userChronologicalAge,
      ageDifference: Math.round(ageDifference * 10) / 10,
      paceOfAging: Math.round(paceOfAging * 10) / 10,
      factors,
      trends: {
        weekly: this.atmosAgeHistory.slice(-7).map(a => a.biologicalAge),
        monthly: this.atmosAgeHistory.slice(-30).map(a => a.biologicalAge),
        paceOfAging: this.atmosAgeHistory.slice(-30).map(a => a.paceOfAging),
      },
      insights,
      recommendations,
      lastUpdated: now
    };

    // Update current and history
    this.currentAtmosAge = atmosAge;
    this.atmosAgeHistory.push(atmosAge);
    
    // Keep history manageable
    if (this.atmosAgeHistory.length > 365) {
      this.atmosAgeHistory = this.atmosAgeHistory.slice(-365);
    }

    return atmosAge;
  }

  // Calculate biological age based on health metrics
  private calculateBiologicalAge(ovrScore: OVRScore, sensorData: SensorData): number {
    let baseAge = this.userChronologicalAge;
    
    // Sleep quality impact (-10 to +10 years)
    const sleepImpact = this.calculateSleepImpact(sensorData.sleepQuality);
    baseAge += sleepImpact;
    
    // Stress impact (-8 to +8 years)
    const stressImpact = this.calculateStressImpact(sensorData.stressIndex);
    baseAge += stressImpact;
    
    // Activity impact (-5 to +5 years)
    const activityImpact = this.calculateActivityImpact(sensorData.movement);
    baseAge += activityImpact;
    
    // Environmental impact (-3 to +3 years)
    const environmentalImpact = this.calculateEnvironmentalImpact(sensorData.airQuality);
    baseAge += environmentalImpact;
    
    // OVR score impact (-5 to +5 years)
    const ovrImpact = this.calculateOVRImpact(ovrScore.overall);
    baseAge += ovrImpact;
    
    // Heart rate variability impact (-3 to +3 years)
    const hrvImpact = this.calculateHRVImpact(sensorData);
    baseAge += hrvImpact;
    
    // Ensure biological age stays within reasonable bounds
    return Math.max(18, Math.min(100, baseAge));
  }

  // Calculate sleep quality impact on aging
  private calculateSleepImpact(sleepQuality?: number): number {
    if (!sleepQuality) return 0;
    
    // Sleep quality 0-100, optimal is 85-95
    if (sleepQuality >= 90) return -8; // Excellent sleep makes you younger
    if (sleepQuality >= 80) return -4;
    if (sleepQuality >= 70) return -2;
    if (sleepQuality >= 60) return 0;
    if (sleepQuality >= 50) return 2;
    if (sleepQuality >= 40) return 4;
    return 6; // Poor sleep ages you
  }

  // Calculate stress impact on aging
  private calculateStressImpact(stressIndex: number): number {
    // Stress index 0-100, lower is better
    if (stressIndex <= 20) return -6; // Very low stress = younger
    if (stressIndex <= 35) return -3;
    if (stressIndex <= 50) return 0;
    if (stressIndex <= 65) return 2;
    if (stressIndex <= 80) return 4;
    return 6; // High stress ages you
  }

  // Calculate activity impact on aging
  private calculateActivityImpact(movement: number): number {
    // Movement 0-100, optimal is 60-80
    if (movement >= 75) return -3; // High activity = younger
    if (movement >= 60) return -1;
    if (movement >= 45) return 0;
    if (movement >= 30) return 1;
    return 3; // Low activity ages you
  }

  // Calculate environmental impact on aging
  private calculateEnvironmentalImpact(airQuality: number): number {
    // Air quality 0-100, higher is better
    if (airQuality >= 90) return -2; // Excellent air = younger
    if (airQuality >= 80) return -1;
    if (airQuality >= 70) return 0;
    if (airQuality >= 60) return 1;
    return 2; // Poor air quality ages you
  }

  // Calculate OVR score impact on aging
  private calculateOVRImpact(ovrScore: number): number {
    if (ovrScore >= 90) return -4; // Elite OVR = younger
    if (ovrScore >= 80) return -2;
    if (ovrScore >= 70) return -1;
    if (ovrScore >= 60) return 0;
    if (ovrScore >= 50) return 1;
    if (ovrScore >= 40) return 2;
    return 3; // Low OVR ages you
  }

  // Calculate heart rate variability impact
  private calculateHRVImpact(sensorData: SensorData): number {
    // Mock HRV calculation (in real app, this would use actual HRV data)
    const baseHRV = 15;
    const stressImpact = sensorData.stressIndex / 100;
    const hrv = Math.max(0, baseHRV - (stressImpact * 10));
    
    if (hrv >= 12) return -2; // High HRV = younger
    if (hrv >= 8) return -1;
    if (hrv >= 5) return 0;
    return 1; // Low HRV ages you
  }

  // Calculate pace of aging
  private calculatePaceOfAging(ageDifference: number): number {
    // Normal pace is 1.0x
    // If you're 5 years younger than chronological age, pace is 0.8x (slower aging)
    // If you're 5 years older than chronological age, pace is 1.2x (faster aging)
    
    const normalizedDifference = ageDifference / 5; // 5 years = 0.2x change
    return Math.max(0.5, Math.min(2.0, 1.0 - normalizedDifference));
  }

  // Calculate individual aging factors
  private calculateAgingFactors(ovrScore: OVRScore, sensorData: SensorData) {
    return {
      sleepQuality: this.calculateSleepImpact(sensorData.sleepQuality),
      stressLevels: this.calculateStressImpact(sensorData.stressIndex),
      activityLevels: this.calculateActivityImpact(sensorData.movement),
      environmentalQuality: this.calculateEnvironmentalImpact(sensorData.airQuality),
      financialStress: this.calculateFinancialStressImpact(ovrScore.financial),
    };
  }

  // Calculate financial stress impact
  private calculateFinancialStressImpact(financialScore: number): number {
    if (financialScore >= 80) return -1; // Good finances = slightly younger
    if (financialScore >= 60) return 0;
    if (financialScore >= 40) return 1;
    return 2; // Financial stress ages you
  }

  // Generate AI insights about aging
  private generateInsights(biologicalAge: number, ageDifference: number, factors: any): string[] {
    const insights: string[] = [];
    
    if (ageDifference < -3) {
      insights.push("Your biological age is significantly younger than your chronological age - excellent work!");
    } else if (ageDifference < 0) {
      insights.push("You're aging slower than average - keep up the healthy habits!");
    } else if (ageDifference > 3) {
      insights.push("Your biological age is higher than your chronological age - focus on stress management and sleep.");
    } else {
      insights.push("Your biological age aligns well with your chronological age.");
    }

    // Factor-specific insights
    if (factors.sleepQuality < -5) {
      insights.push("Your excellent sleep quality is significantly reducing your biological age.");
    } else if (factors.sleepQuality > 3) {
      insights.push("Improving sleep quality could significantly reduce your biological age.");
    }

    if (factors.stressLevels < -4) {
      insights.push("Your low stress levels are contributing to slower aging.");
    } else if (factors.stressLevels > 4) {
      insights.push("High stress levels are accelerating your biological aging.");
    }

    if (factors.activityLevels < -2) {
      insights.push("Your high activity levels are keeping you biologically younger.");
    }

    return insights;
  }

  // Generate actionable recommendations
  private generateRecommendations(factors: any, ageDifference: number): string[] {
    const recommendations: string[] = [];
    
    if (factors.sleepQuality > 2) {
      recommendations.push("Aim for 7-9 hours of quality sleep per night to reduce biological age.");
    }
    
    if (factors.stressLevels > 3) {
      recommendations.push("Practice stress management techniques like meditation or deep breathing.");
    }
    
    if (factors.activityLevels > 2) {
      recommendations.push("Increase daily physical activity to 150+ minutes of moderate exercise.");
    }
    
    if (factors.environmentalQuality > 1) {
      recommendations.push("Improve indoor air quality with air purifiers or better ventilation.");
    }
    
    if (factors.financialStress > 1) {
      recommendations.push("Consider financial planning to reduce stress-related aging.");
    }

    if (ageDifference > 2) {
      recommendations.push("Focus on comprehensive lifestyle changes to reduce biological age.");
    }

    return recommendations;
  }

  // Update trends with new data
  private updateTrends(biologicalAge: number, paceOfAging: number): void {
    // Trends are automatically updated when we add to history
    // This method could be used for additional trend calculations
  }

  // Get current Atmos Age
  getCurrentAtmosAge(): AtmosAge | null {
    return this.currentAtmosAge;
  }

  // Get Atmos Age history
  getAtmosAgeHistory(limit: number = 30): AtmosAge[] {
    return this.atmosAgeHistory.slice(-limit);
  }

  // Set user's chronological age
  setChronologicalAge(age: number): void {
    this.userChronologicalAge = age;
  }

  // Get user's chronological age
  getChronologicalAge(): number {
    return this.userChronologicalAge;
  }

  // Get age category
  getAgeCategory(biologicalAge: number): string {
    if (biologicalAge < 25) return 'Exceptionally Young';
    if (biologicalAge < 30) return 'Very Young';
    if (biologicalAge < 35) return 'Young';
    if (biologicalAge < 40) return 'Young Adult';
    if (biologicalAge < 45) return 'Adult';
    if (biologicalAge < 50) return 'Mature Adult';
    if (biologicalAge < 55) return 'Middle Age';
    if (biologicalAge < 60) return 'Senior';
    return 'Elder';
  }

  // Get pace of aging description
  getPaceDescription(pace: number): string {
    if (pace <= 0.7) return 'Exceptionally Slow';
    if (pace <= 0.85) return 'Slow';
    if (pace <= 1.0) return 'Normal';
    if (pace <= 1.15) return 'Fast';
    return 'Very Fast';
  }

  // Generate mock Atmos Age for development
  generateMockAtmosAge(): AtmosAge {
    const chronologicalAge = this.userChronologicalAge;
    const biologicalAge = chronologicalAge + (Math.random() - 0.5) * 10; // ±5 years variation
    const ageDifference = biologicalAge - chronologicalAge;
    const paceOfAging = 1.0 + (ageDifference / 10); // Normalize pace

    return {
      biologicalAge: Math.round(biologicalAge * 10) / 10,
      chronologicalAge,
      ageDifference: Math.round(ageDifference * 10) / 10,
      paceOfAging: Math.round(paceOfAging * 10) / 10,
      factors: {
        sleepQuality: (Math.random() - 0.5) * 8,
        stressLevels: (Math.random() - 0.5) * 6,
        activityLevels: (Math.random() - 0.5) * 4,
        environmentalQuality: (Math.random() - 0.5) * 2,
        financialStress: (Math.random() - 0.5) * 2,
      },
      trends: {
        weekly: Array.from({ length: 7 }, () => biologicalAge + (Math.random() - 0.5) * 2),
        monthly: Array.from({ length: 30 }, () => biologicalAge + (Math.random() - 0.5) * 3),
        paceOfAging: Array.from({ length: 30 }, () => paceOfAging + (Math.random() - 0.5) * 0.2),
      },
      insights: [
        "Your biological age is well-maintained through consistent healthy habits.",
        "Sleep quality is contributing positively to your biological age.",
        "Consider increasing physical activity for further age reduction."
      ],
      recommendations: [
        "Maintain current sleep schedule for optimal biological age.",
        "Continue stress management practices.",
        "Add 30 minutes of moderate exercise daily."
      ],
      lastUpdated: Date.now()
    };
  }
}

export const atmosAgeService = new AtmosAgeService();
export default AtmosAgeService;
