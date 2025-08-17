// API Configuration
export const API_CONFIG = {
  // OpenWeatherMap API (for weather and air quality)
  OPENWEATHER_API_KEY: process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || '',
  
  // Plaid API (for financial data)
  PLAID_API_KEY: process.env.EXPO_PUBLIC_PLAID_API_KEY || '',
  PLAID_ENV: process.env.EXPO_PUBLIC_PLAID_ENV || 'sandbox',
  
  // Health APIs (Apple HealthKit, Google Fit)
  HEALTH_API_KEY: process.env.EXPO_PUBLIC_HEALTH_API_KEY || '',
  
  // AI/ML APIs (for insights)
  OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
  
  // Analytics (optional)
  ANALYTICS_KEY: process.env.EXPO_PUBLIC_ANALYTICS_KEY || '',
};

// Feature flags
export const FEATURES = {
  REAL_WEATHER_DATA: !!API_CONFIG.OPENWEATHER_API_KEY,
  REAL_FINANCIAL_DATA: !!API_CONFIG.PLAID_API_KEY,
  REAL_HEALTH_DATA: !!API_CONFIG.HEALTH_API_KEY,
  AI_INSIGHTS: !!API_CONFIG.OPENAI_API_KEY,
  ANALYTICS: !!API_CONFIG.ANALYTICS_KEY,
};

// Default location (San Francisco)
export const DEFAULT_LOCATION = {
  latitude: 37.7749,
  longitude: -122.4194,
  city: 'San Francisco',
  country: 'US',
};
