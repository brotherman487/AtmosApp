import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Wind, Coffee, TreePine, Waves, Star, Navigation, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const EnvironmentScreen = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [animations] = useState({
    pulse: new Animated.Value(1),
    glow: new Animated.Value(0.3),
  });

  const calmZones = [
    {
      id: 1,
      name: 'Riverside Sanctuary',
      distance: '0.3 km',
      airQuality: 95,
      noiseLevel: 28,
      type: 'nature',
      description: 'Gentle flowing water creates natural white noise, perfect for morning meditation',
      icon: <Waves size={20} color="#7dd3fc" strokeWidth={1.5} />,
      mood: 'peaceful',
      color: '#7dd3fc',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      name: 'Mindful Brew',
      distance: '0.5 km',
      airQuality: 82,
      noiseLevel: 35,
      type: 'cafe',
      description: 'Quiet corner with plants and soft ambient music, ideal for focused work',
      icon: <Coffee size={20} color="#f59e0b" strokeWidth={1.5} />,
      mood: 'focused',
      color: '#f59e0b',
      image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      name: 'Ancient Oak Grove',
      distance: '1.2 km',
      airQuality: 98,
      noiseLevel: 22,
      type: 'forest',
      description: 'Century-old trees and pristine air quality create a natural cathedral',
      icon: <TreePine size={20} color="#10b981" strokeWidth={1.5} />,
      mood: 'grounded',
      color: '#10b981',
      image: 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 4,
      name: 'Sunset Vista',
      distance: '2.1 km',
      airQuality: 90,
      noiseLevel: 25,
      type: 'viewpoint',
      description: 'Elevated sanctuary with panoramic views and clear mountain air',
      icon: <Star size={20} color="#a78bfa" strokeWidth={1.5} />,
      mood: 'inspired',
      color: '#a78bfa',
      image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const currentLocation = {
    name: 'Urban Oasis District',
    airQuality: 78,
    noiseLevel: 52,
    weather: 'Partly cloudy, 21°C',
    humidity: 48,
    coordinates: '37.7749° N, 122.4194° W'
  };

  useEffect(() => {
    // Gentle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.pulse, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.pulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.glow, {
          toValue: 0.7,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(animations.glow, {
          toValue: 0.3,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const getQualityColor = (value: number) => {
    if (value >= 90) return '#10b981';
    if (value >= 75) return '#f59e0b';
    if (value >= 50) return '#f97316';
    return '#ef4444';
  };

  const getQualityLabel = (value: number) => {
    if (value >= 90) return 'Excellent';
    if (value >= 75) return 'Good';
    if (value >= 50) return 'Fair';
    return 'Poor';
  };

  const getNoiseLabel = (value: number) => {
    if (value < 30) return 'Serene';
    if (value < 45) return 'Quiet';
    if (value < 60) return 'Moderate';
    return 'Loud';
  };

  return (
    <LinearGradient
      colors={['#0f0f23', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Zones</Text>
          <Text style={styles.subtitle}>Discover your calm spaces</Text>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Current Location */}
          <Animated.View 
            style={[
              styles.currentLocationCard,
              { transform: [{ scale: animations.pulse }] }
            ]}
          >
            <View style={styles.locationHeader}>
              <MapPin size={18} color="#7dd3fc" strokeWidth={1.5} />
              <Text style={styles.locationTitle}>{currentLocation.name}</Text>
            </View>
            
            <View style={styles.locationMetrics}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Air Quality</Text>
                <Text style={[styles.metricValue, { color: getQualityColor(currentLocation.airQuality) }]}>
                  {currentLocation.airQuality}
                </Text>
                <Text style={styles.metricStatus}>
                  {getQualityLabel(currentLocation.airQuality)}
                </Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Noise Level</Text>
                <Text style={[styles.metricValue, { color: getQualityColor(100 - currentLocation.noiseLevel) }]}>
                  {currentLocation.noiseLevel}dB
                </Text>
                <Text style={styles.metricStatus}>
                  {getNoiseLabel(currentLocation.noiseLevel)}
                </Text>
              </View>
            </View>
            
            <Text style={styles.weatherText}>{currentLocation.weather}</Text>
            <Text style={styles.coordinatesText}>{currentLocation.coordinates}</Text>
          </Animated.View>

          {/* Traveler Mode Banner */}
          <View style={styles.travelerBanner}>
            <View style={styles.travelerIcon}>
              <Navigation size={16} color="#10b981" strokeWidth={1.5} />
            </View>
            <Text style={styles.travelerText}>
              Traveler Mode: Syncing with your environment
            </Text>
          </View>

          {/* Calm Zones */}
          <View style={styles.zonesContainer}>
            <Text style={styles.zonesTitle}>Nearby Calm Zones</Text>
            
            {calmZones.map((zone) => (
              <TouchableOpacity
                key={zone.id}
                style={[
                  styles.zoneCard,
                  selectedZone === zone.id && styles.zoneCardSelected
                ]}
                onPress={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                activeOpacity={0.9}
              >
                <Animated.View
                  style={[
                    styles.zoneGlow,
                    {
                      opacity: selectedZone === zone.id ? animations.glow : 0,
                      shadowColor: zone.color,
                    }
                  ]}
                />
                
                <View style={styles.zoneHeader}>
                  <View style={[styles.zoneIcon, { backgroundColor: `${zone.color}20` }]}>
                    {zone.icon}
                  </View>
                  <View style={styles.zoneInfo}>
                    <Text style={styles.zoneName}>{zone.name}</Text>
                    <Text style={styles.zoneDistance}>{zone.distance} away</Text>
                  </View>
                  <View style={styles.zoneMetrics}>
                    <View style={styles.miniMetric}>
                      <Wind size={10} color={getQualityColor(zone.airQuality)} strokeWidth={1.5} />
                      <Text style={[styles.miniMetricText, { color: getQualityColor(zone.airQuality) }]}>
                        {zone.airQuality}
                      </Text>
                    </View>
                    <View style={styles.miniMetric}>
                      <Text style={[styles.miniMetricText, { color: getQualityColor(100 - zone.noiseLevel) }]}>
                        {zone.noiseLevel}dB
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Text style={styles.zoneDescription}>{zone.description}</Text>
                
                {selectedZone === zone.id && (
                  <View style={styles.zoneDetails}>
                    <View style={styles.zoneActions}>
                      <TouchableOpacity style={[styles.actionButton, { borderColor: zone.color }]}>
                        <Navigation size={12} color={zone.color} strokeWidth={1.5} />
                        <Text style={[styles.actionButtonText, { color: zone.color }]}>Navigate</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionButton, { borderColor: zone.color }]}>
                        <Heart size={12} color={zone.color} strokeWidth={1.5} />
                        <Text style={[styles.actionButtonText, { color: zone.color }]}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Environment Insights */}
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Environment Insights</Text>
            
            <View style={styles.insightCard}>
              <View style={styles.insightIcon}>
                <Wind size={16} color="#10b981" strokeWidth={1.5} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightText}>
                  Air quality improves significantly after 3 PM today. Perfect timing for outdoor mindfulness.
                </Text>
              </View>
            </View>
            
            <View style={styles.insightCard}>
              <View style={styles.insightIcon}>
                <Waves size={16} color="#7dd3fc" strokeWidth={1.5} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightText}>
                  Riverside Sanctuary has the most consistent calm conditions throughout the day.
                </Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <View style={styles.insightIcon}>
                <Star size={16} color="#a78bfa" strokeWidth={1.5} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightText}>
                  Golden hour at Sunset Vista begins at 6:47 PM - ideal for reflection.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Light',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  currentLocationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginLeft: 8,
    letterSpacing: -0.2,
  },
  locationMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  metricStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.2,
  },
  weatherText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  coordinatesText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  travelerBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  travelerIcon: {
    marginRight: 10,
  },
  travelerText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#10b981',
    letterSpacing: 0.1,
  },
  zonesContainer: {
    marginBottom: 40,
  },
  zonesTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  zoneCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
    overflow: 'hidden',
  },
  zoneCardSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  zoneGlow: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 10,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  zoneDistance: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.1,
  },
  zoneMetrics: {
    alignItems: 'flex-end',
  },
  miniMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  miniMetricText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
    letterSpacing: 0.1,
  },
  zoneDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  zoneDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  zoneActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
    letterSpacing: 0.2,
  },
  insightsContainer: {
    marginBottom: 40,
  },
  insightsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  insightIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  insightContent: {
    flex: 1,
  },
  insightText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});

export default EnvironmentScreen;