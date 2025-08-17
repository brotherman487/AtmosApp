import { SensorData } from '../types';

interface HealthMetrics {
  steps: number;
  calories: number;
  distance: number;
  activeMinutes: number;
  heartRate: number;
  heartRateVariability: number;
  sleepHours: number;
  sleepQuality: number;
  weight?: number;
  bmi?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  bloodOxygen?: number;
  respiratoryRate?: number;
}

interface Workout {
  id: string;
  type: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  calories: number;
  distance?: number;
  averageHeartRate: number;
  maxHeartRate: number;
}

interface SleepSession {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  quality: number;
  stages: {
    deep: number;
    light: number;
    rem: number;
    awake: number;
  };
}

class HealthService {
  private static instance: HealthService;
  private apiKey: string = '';
  private baseUrl: string = '';
  private lastUpdate: number = 0;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes
  private cachedMetrics: HealthMetrics | null = null;

  static getInstance(): HealthService {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  // Set API key and base URL for health service
  setApiKey(apiKey: string, baseUrl: string = ''): void {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  // Get today's health metrics
  async getTodayHealthMetrics(): Promise<HealthMetrics> {
    try {
      // Check cache first
      if (this.cachedMetrics && Date.now() - this.lastUpdate < this.cacheDuration) {
        return this.cachedMetrics;
      }

      // If no API key, return mock data
      if (!this.apiKey) {
        return this.getMockHealthMetrics();
      }

      // In a real implementation, you'd fetch from HealthKit/Google Fit API
      // For now, we'll use mock data
      const metrics = this.getMockHealthMetrics();
      
      // Cache the data
      this.cachedMetrics = metrics;
      this.lastUpdate = Date.now();

      return metrics;
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      return this.getMockHealthMetrics();
    }
  }

  // Get recent workouts
  async getRecentWorkouts(limit: number = 5): Promise<Workout[]> {
    try {
      if (!this.apiKey) {
        return this.getMockWorkouts(limit);
      }

      // In a real implementation, you'd fetch from health API
      return this.getMockWorkouts(limit);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      return this.getMockWorkouts(limit);
    }
  }

  // Get sleep data
  async getSleepData(days: number = 7): Promise<SleepSession[]> {
    try {
      if (!this.apiKey) {
        return this.getMockSleepData(days);
      }

      // In a real implementation, you'd fetch from health API
      return this.getMockSleepData(days);
    } catch (error) {
      console.error('Error fetching sleep data:', error);
      return this.getMockSleepData(days);
    }
  }

  // Update sensor data with real health data
  async updateSensorDataWithHealthData(sensorData: SensorData): Promise<SensorData> {
    try {
      const healthMetrics = await this.getTodayHealthMetrics();
      
      return {
        ...sensorData,
        heartRate: healthMetrics.heartRate,
        // Add movement based on steps
        movement: Math.min(100, (healthMetrics.steps / 10000) * 100),
        // Add sleep quality if available
        sleepQuality: healthMetrics.sleepQuality,
        // Adjust stress based on activity level
        stressIndex: this.calculateActivityBasedStress(
          sensorData.stressIndex,
          healthMetrics
        ),
      };
    } catch (error) {
      console.error('Error updating sensor data with health data:', error);
      return sensorData;
    }
  }

  // Calculate stress based on activity level
  private calculateActivityBasedStress(baseStress: number, healthMetrics: HealthMetrics): number {
    let stressMultiplier = 1;
    
    // Low activity can increase stress
    if (healthMetrics.steps < 5000) stressMultiplier += 0.2;
    if (healthMetrics.steps < 3000) stressMultiplier += 0.3;
    
    // High activity can reduce stress
    if (healthMetrics.steps > 8000) stressMultiplier -= 0.1;
    if (healthMetrics.steps > 12000) stressMultiplier -= 0.2;
    
    // Poor sleep increases stress
    if (healthMetrics.sleepQuality < 70) stressMultiplier += 0.25;
    if (healthMetrics.sleepQuality < 50) stressMultiplier += 0.4;
    
    // High heart rate can indicate stress
    if (healthMetrics.heartRate > 100) stressMultiplier += 0.15;
    if (healthMetrics.heartRate > 120) stressMultiplier += 0.25;

    return Math.min(100, Math.max(0, baseStress * stressMultiplier));
  }

  private getMockHealthMetrics(): HealthMetrics {
    const now = new Date();
    const hour = now.getHours();
    
    // Simulate realistic health data based on time of day
    let baseSteps = 8000;
    let baseHeartRate = 70;
    let baseSleepQuality = 85;
    
    if (hour < 6) {
      baseSteps = 0;
      baseHeartRate = 60;
      baseSleepQuality = 90;
    } else if (hour < 12) {
      baseSteps = 3000;
      baseHeartRate = 75;
      baseSleepQuality = 85;
    } else if (hour < 18) {
      baseSteps = 12000;
      baseHeartRate = 80;
      baseSleepQuality = 80;
    } else {
      baseSteps = 15000;
      baseHeartRate = 75;
      baseSleepQuality = 75;
    }

    const steps = Math.max(0, baseSteps + Math.random() * 2000 - 1000);
    const calories = steps * 0.04 + Math.random() * 100;
    const distance = steps * 0.0008; // km
    const activeMinutes = Math.min(60, steps / 200);

    return {
      steps: Math.round(steps),
      calories: Math.round(calories),
      distance: Math.round(distance * 100) / 100,
      activeMinutes: Math.round(activeMinutes),
      heartRate: Math.round(baseHeartRate + Math.random() * 20 - 10),
      heartRateVariability: 30 + Math.random() * 20,
      sleepHours: 7 + Math.random() * 2,
      sleepQuality: Math.max(0, Math.min(100, baseSleepQuality + Math.random() * 20 - 10)),
      weight: 70 + Math.random() * 10,
      bmi: 22 + Math.random() * 4,
      bloodPressure: {
        systolic: 120 + Math.random() * 20,
        diastolic: 80 + Math.random() * 10,
      },
      bloodOxygen: 95 + Math.random() * 3,
      respiratoryRate: 12 + Math.random() * 4,
    };
  }

  private getMockWorkouts(limit: number): Workout[] {
    const workoutTypes = [
      'Running', 'Walking', 'Cycling', 'Swimming', 'Yoga',
      'Strength Training', 'HIIT', 'Pilates', 'Dancing'
    ];

    const workouts: Workout[] = [];
    const now = new Date();

    for (let i = 0; i < limit; i++) {
      const startTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const duration = 30 + Math.random() * 90; // 30-120 minutes
      const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
      const type = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
      
      // Calculate calories based on workout type and duration
      let caloriesPerMinute = 5; // Base rate
      if (type === 'Running') caloriesPerMinute = 12;
      else if (type === 'Cycling') caloriesPerMinute = 8;
      else if (type === 'Swimming') caloriesPerMinute = 10;
      else if (type === 'Strength Training') caloriesPerMinute = 6;
      else if (type === 'Yoga') caloriesPerMinute = 3;

      const calories = Math.round(duration * caloriesPerMinute * (0.8 + Math.random() * 0.4));
      const avgHeartRate = 120 + Math.random() * 40;
      const maxHeartRate = avgHeartRate + 20 + Math.random() * 20;

      workouts.push({
        id: `workout_${Date.now()}_${i}`,
        type,
        startTime,
        endTime,
        duration,
        calories,
        distance: type === 'Running' || type === 'Walking' || type === 'Cycling' ? 
          Math.round((duration / 60) * (5 + Math.random() * 5) * 100) / 100 : undefined,
        averageHeartRate: Math.round(avgHeartRate),
        maxHeartRate: Math.round(maxHeartRate),
      });
    }

    return workouts.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  private getMockSleepData(days: number): SleepSession[] {
    const sessions: SleepSession[] = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
      const sleepDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const sleepHours = 6 + Math.random() * 3; // 6-9 hours
      const startTime = new Date(sleepDate.getTime() - sleepHours * 60 * 60 * 1000);
      const endTime = new Date(sleepDate.getTime());
      
      const totalMinutes = sleepHours * 60;
      const deep = Math.round(totalMinutes * (0.15 + Math.random() * 0.1));
      const light = Math.round(totalMinutes * (0.45 + Math.random() * 0.1));
      const rem = Math.round(totalMinutes * (0.2 + Math.random() * 0.1));
      const awake = totalMinutes - deep - light - rem;

      const quality = Math.max(0, Math.min(100, 
        70 + (deep / totalMinutes) * 20 + (rem / totalMinutes) * 10 + Math.random() * 10
      ));

      sessions.push({
        id: `sleep_${Date.now()}_${i}`,
        startTime,
        endTime,
        duration: sleepHours,
        quality: Math.round(quality),
        stages: {
          deep,
          light,
          rem,
          awake,
        },
      });
    }

    return sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }
}

export const healthService = HealthService.getInstance();
