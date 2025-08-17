import { SensorData } from '../types';

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
}

interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
  o3: number;
  so2: number;
  status: string;
}

interface EnvironmentalData {
  weather: WeatherData;
  airQuality: AirQualityData;
  noiseLevel?: number;
  uvIndex?: number;
  pollenCount?: number;
}

class EnvironmentalService {
  private static instance: EnvironmentalService;
  private apiKey: string = '';
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5';
  private airQualityUrl: string = 'https://api.openweathermap.org/data/2.5/air_pollution';
  private lastUpdate: number = 0;
  private cacheDuration: number = 10 * 60 * 1000; // 10 minutes
  private cachedData: EnvironmentalData | null = null;

  static getInstance(): EnvironmentalService {
    if (!EnvironmentalService.instance) {
      EnvironmentalService.instance = new EnvironmentalService();
    }
    return EnvironmentalService.instance;
  }

  // Set API key (you'll need to get one from OpenWeatherMap)
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  // Get environmental data for a location
  async getEnvironmentalData(latitude: number, longitude: number): Promise<EnvironmentalData> {
    try {
      // Check cache first
      if (this.cachedData && Date.now() - this.lastUpdate < this.cacheDuration) {
        return this.cachedData;
      }

      // If no API key, return mock data
      if (!this.apiKey) {
        return this.getMockEnvironmentalData();
      }

      // Fetch real data
      const [weatherData, airQualityData] = await Promise.all([
        this.fetchWeatherData(latitude, longitude),
        this.fetchAirQualityData(latitude, longitude),
      ]);

      const environmentalData: EnvironmentalData = {
        weather: weatherData,
        airQuality: airQualityData,
        noiseLevel: this.estimateNoiseLevel(weatherData.windSpeed),
        uvIndex: this.estimateUVIndex(weatherData.description),
        pollenCount: this.estimatePollenCount(weatherData.description, weatherData.humidity),
      };

      // Cache the data
      this.cachedData = environmentalData;
      this.lastUpdate = Date.now();

      return environmentalData;
    } catch (error) {
      console.error('Error fetching environmental data:', error);
      return this.getMockEnvironmentalData();
    }
  }

  private async fetchWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    const response = await fetch(
      `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  }

  private async fetchAirQualityData(latitude: number, longitude: number): Promise<AirQualityData> {
    const response = await fetch(
      `${this.airQualityUrl}?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Air quality API error: ${response.status}`);
    }

    const data = await response.json();
    const aqi = data.list[0].main.aqi;
    
    return {
      aqi: aqi,
      pm25: data.list[0].components.pm2_5,
      pm10: data.list[0].components.pm10,
      co: data.list[0].components.co,
      no2: data.list[0].components.no2,
      o3: data.list[0].components.o3,
      so2: data.list[0].components.so2,
      status: this.getAQIStatus(aqi),
    };
  }

  private getAQIStatus(aqi: number): string {
    if (aqi <= 1) return 'Good';
    if (aqi <= 2) return 'Fair';
    if (aqi <= 3) return 'Moderate';
    if (aqi <= 4) return 'Poor';
    return 'Very Poor';
  }

  private estimateNoiseLevel(windSpeed: number): number {
    // Simple estimation based on wind speed
    return Math.min(100, 30 + windSpeed * 2 + Math.random() * 10);
  }

  private estimateUVIndex(description: string): number {
    const isSunny = description.toLowerCase().includes('clear') || 
                   description.toLowerCase().includes('sun');
    return isSunny ? 5 + Math.random() * 5 : 1 + Math.random() * 3;
  }

  private estimatePollenCount(description: string, humidity: number): number {
    const isRaining = description.toLowerCase().includes('rain');
    if (isRaining) return 10 + Math.random() * 20;
    if (humidity > 70) return 30 + Math.random() * 40;
    return 50 + Math.random() * 50;
  }

  private getMockEnvironmentalData(): EnvironmentalData {
    const now = new Date();
    const hour = now.getHours();
    
    // Simulate realistic environmental data based on time of day
    let baseTemp = 20;
    let baseHumidity = 50;
    let baseAQI = 40;
    
    if (hour < 6) {
      baseTemp = 15;
      baseHumidity = 70;
      baseAQI = 30;
    } else if (hour < 12) {
      baseTemp = 22;
      baseHumidity = 45;
      baseAQI = 35;
    } else if (hour < 18) {
      baseTemp = 25;
      baseHumidity = 40;
      baseAQI = 45;
    } else {
      baseTemp = 18;
      baseHumidity = 60;
      baseAQI = 35;
    }

    return {
      weather: {
        temperature: baseTemp + Math.random() * 6 - 3,
        humidity: Math.max(20, Math.min(90, baseHumidity + Math.random() * 20 - 10)),
        pressure: 1013 + Math.random() * 20 - 10,
        windSpeed: 2 + Math.random() * 8,
        description: ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        icon: '01d',
      },
      airQuality: {
        aqi: Math.max(1, Math.min(5, Math.round(baseAQI / 20) + Math.random() * 2)),
        pm25: 10 + Math.random() * 20,
        pm10: 20 + Math.random() * 30,
        co: 200 + Math.random() * 300,
        no2: 10 + Math.random() * 20,
        o3: 30 + Math.random() * 40,
        so2: 5 + Math.random() * 10,
        status: 'Good',
      },
      noiseLevel: 35 + Math.random() * 25,
      uvIndex: 3 + Math.random() * 5,
      pollenCount: 30 + Math.random() * 40,
    };
  }

  // Update sensor data with real environmental data
  async updateSensorDataWithEnvironmentalData(sensorData: SensorData): Promise<SensorData> {
    try {
      const environmentalData = await this.getEnvironmentalData(
        sensorData.location?.latitude || 37.7749,
        sensorData.location?.longitude || -122.4194
      );

      return {
        ...sensorData,
        airQuality: environmentalData.airQuality.aqi * 20, // Convert to 0-100 scale
        skinTemperature: environmentalData.weather.temperature + 15, // Approximate body temp
        // Add environmental context to stress calculation
        stressIndex: this.calculateEnvironmentalStress(
          sensorData.stressIndex,
          environmentalData
        ),
      };
    } catch (error) {
      console.error('Error updating sensor data with environmental data:', error);
      return sensorData;
    }
  }

  private calculateEnvironmentalStress(baseStress: number, envData: EnvironmentalData): number {
    let stressMultiplier = 1;
    
    // Air quality impact
    if (envData.airQuality.aqi > 3) stressMultiplier += 0.2;
    if (envData.airQuality.aqi > 4) stressMultiplier += 0.3;
    
    // Temperature impact
    if (envData.weather.temperature > 30 || envData.weather.temperature < 10) {
      stressMultiplier += 0.15;
    }
    
    // Humidity impact
    if (envData.weather.humidity > 80 || envData.weather.humidity < 30) {
      stressMultiplier += 0.1;
    }
    
    // Noise impact
    if (envData.noiseLevel && envData.noiseLevel > 60) {
      stressMultiplier += 0.25;
    }

    return Math.min(100, baseStress * stressMultiplier);
  }
}

export const environmentalService = EnvironmentalService.getInstance();
