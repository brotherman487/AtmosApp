# AtmosApp - Symbiotic AI Health Companion

A sophisticated health and wellness app that uses AI to provide personalized insights and track your overall vitality through multiple life domains.

## Features

### 🌟 Atmos Age
- **Biological Age Calculation**: Advanced algorithm that calculates your biological age based on health metrics
- **Pace of Aging**: Tracks how fast or slow you're aging compared to chronological time
- **Health Factor Analysis**: Breaks down how sleep, stress, activity, environment, and financial health impact your biological age
- **AI Insights**: Personalized recommendations to improve your biological age
- **Trend Tracking**: Weekly and monthly trends to see your aging patterns

### 📊 OVR (Overall Vitality Rating)
- **Multi-Domain Scoring**: Biological, Emotional, Environmental, and Financial health metrics
- **Real-time Updates**: Intelligent scoring system that adapts to your current state
- **Trend Analysis**: Historical data and pattern recognition
- **Goal Setting**: Personalized targets and progress tracking

### 🏃‍♂️ Health Monitoring
- **Sensor Integration**: Heart rate, stress levels, sleep quality, and environmental data
- **AI Companion**: Intelligent assistant that learns your patterns and provides guidance
- **Voice Commands**: Natural language interaction with your health data
- **Social Features**: Friend leaderboards and community challenges

### 💰 Financial Wellness
- **Financial Vitality Index**: Tracks savings, debt, budget adherence, and income growth
- **Goal Tracking**: Set and monitor financial goals
- **Transaction Analysis**: Smart categorization and impact assessment

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Run on Device/Simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## Architecture

### Services
- `atmosAgeService`: Biological age calculation and aging analysis
- `ovrService`: Overall vitality rating system
- `wearableService`: Sensor data integration
- `financialService`: Financial health tracking
- `environmentalService`: Environmental data processing
- `aiInsightsService`: AI-powered insights and recommendations

### Components
- `AtmosAgeCard`: Beautiful UI for displaying biological age data
- `OVRHeroCard`: Main OVR score display
- `SensorDashboard`: Real-time health metrics
- `PromptFeed`: AI-generated insights and actions
- `FriendLeaderboardCard`: Social features and community

### Data Flow
1. Sensor data is collected from wearable devices
2. OVR scores are calculated across all life domains
3. Atmos Age is computed using health metrics and OVR data
4. AI generates personalized insights and recommendations
5. UI updates in real-time with beautiful animations

## Technologies

- **React Native** with Expo
- **TypeScript** for type safety
- **Linear Gradients** for beautiful UI
- **Lucide React Native** for icons
- **Animated API** for smooth animations
- **Expo Router** for navigation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
