import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Platform, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MapPin, 
  Wind, 
  Coffee, 
  TreePine, 
  Waves, 
  Star, 
  Navigation, 
  Heart, 
  Compass,
  Sun,
  Moon,
  Cloud,
  Droplets,
  Zap,
  Sparkles,
  CheckCircle,
  ExternalLink
} from 'lucide-react-native';
import { hapticFeedback } from '../../utils/haptics';

const { width, height } = Dimensions.get('window');

const EnvironmentScreen = () => {
  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [compassRotation, setCompassRotation] = useState(0);
  const [savedZones, setSavedZones] = useState<number[]>([]);
  const [optimizedZones, setOptimizedZones] = useState<number[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const [animations] = useState({
    pulse: new Animated.Value(1),
    glow: new Animated.Value(0.3),
    compass: new Animated.Value(0),
    background: new Animated.Value(0),
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
      icon: <Waves size={24} color="#7dd3fc" strokeWidth={1.5} />,
      mood: 'peaceful',
      color: '#7dd3fc',
      gradient: ['#0ea5e9', '#0284c7'],
      compassDirection: 45,
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
      icon: <Coffee size={24} color="#f59e0b" strokeWidth={1.5} />,
      mood: 'focused',
      color: '#f59e0b',
      gradient: ['#f59e0b', '#d97706'],
      compassDirection: 120,
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
      icon: <TreePine size={24} color="#10b981" strokeWidth={1.5} />,
      mood: 'grounded',
      color: '#10b981',
      gradient: ['#10b981', '#059669'],
      compassDirection: 180,
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
      icon: <Star size={24} color="#a78bfa" strokeWidth={1.5} />,
      mood: 'inspired',
      color: '#a78bfa',
      gradient: ['#a78bfa', '#8b5cf6'],
      compassDirection: 270,
      image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const currentLocation = {
    name: 'Urban Oasis District',
    airQuality: 78,
    noiseLevel: 52,
    weather: 'Partly cloudy, 21°C',
    humidity: 48,
    coordinates: '37.7749° N, 122.4194° W',
    timeOfDay: 'afternoon'
  };

  // Find best zone for compass orientation
  const bestZone = calmZones.reduce((best, zone) => 
    zone.airQuality > best.airQuality ? zone : best
  );

  useEffect(() => {
    // Compass rotation animation
    Animated.loop(
      Animated.timing(animations.compass, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();

    // Background animation based on best zone
    Animated.timing(animations.background, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Pulse animation for selected zone
    if (selectedZone) {
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
    } else {
      animations.pulse.setValue(1);
    }
  }, [selectedZone]);

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

  const getBackgroundGradient = (): [string, string, string] => {
    if (selectedZone) {
      const zone = calmZones.find(z => z.id === selectedZone);
      return zone ? [zone.gradient[0], zone.gradient[1], '#16213e'] : ['#0f0f23', '#1a1a2e', '#16213e'];
    }
    return ['#0f0f23', '#1a1a2e', '#16213e'];
  };

  const compassRotationInterpolate = animations.compass.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.98],
    extrapolate: 'clamp',
  });

  const handleNavigate = (zone: any) => {
    hapticFeedback.light();
    
    // Open in default maps app
    const url = `https://maps.google.com/?q=${zone.name}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(
          'Navigation',
          `Navigate to ${zone.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Maps', onPress: () => Linking.openURL(url) }
          ]
        );
      }
    });
  };

  const handleSaveZone = (zoneId: number) => {
    hapticFeedback.success();
    
    if (savedZones.includes(zoneId)) {
      setSavedZones(savedZones.filter(id => id !== zoneId));
      Alert.alert('Zone Removed', 'Zone removed from your saved locations');
    } else {
      setSavedZones([...savedZones, zoneId]);
      Alert.alert('Zone Saved', 'Zone added to your saved locations');
    }
  };

  const handleOptimizeZone = (zone: any) => {
    hapticFeedback.medium();
    
    Alert.alert(
      'Optimize Environment',
      `Optimize your experience at ${zone.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Optimize', 
          onPress: () => {
            setOptimizedZones([...optimizedZones, zone.id]);
            Alert.alert(
              'Optimization Complete',
              `Your environment at ${zone.name} has been optimized for maximum wellness benefits.`,
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={styles.backgroundGradient}
      >
        <LinearGradient
          colors={getBackgroundGradient()}
          style={styles.gradientBackground}
        />
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header with Compass */}
        <Animated.View 
          style={[
            styles.header,
            { transform: [{ scale: headerScale }] }
          ]}
        >
          <View style={styles.compassContainer}>
            <Animated.View
              style={[
                styles.compassRing,
                {
                  transform: [{ rotate: compassRotationInterpolate }]
                }
              ]}
            >
              <Compass size={32} color="#7dd3fc" strokeWidth={1.5} />
            </Animated.View>
            <View style={styles.compassGlow} />
          </View>
          
          <Text style={styles.title}>Atmos Compass</Text>
          <Text style={styles.subtitle}>Your symbiotic environmental guide</Text>
          
          <View style={styles.compassIndicator}>
            <Text style={styles.compassText}>
              Best zone: {bestZone.name} ({bestZone.compassDirection}°)
            </Text>
          </View>
        </Animated.View>

        <Animated.ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {/* Current Location Card */}
          <View style={styles.currentLocationCard}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
              style={styles.locationGradient}
            >
                             <View style={styles.locationHeader}>
                 <View style={styles.locationIconContainer}>
                   <MapPin size={18} color="#7dd3fc" strokeWidth={1.5} />
                   <View style={styles.locationGlow} />
                 </View>
                 <View style={styles.locationInfo}>
                   <Text style={styles.locationTitle}>{currentLocation.name}</Text>
                   <Text style={styles.locationSubtitle}>Current Position</Text>
                 </View>
               </View>
              
              <View style={styles.locationMetrics}>
                <View style={styles.metricCard}>
                  <View style={styles.metricIcon}>
                    <Wind size={16} color={getQualityColor(currentLocation.airQuality)} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.metricValue}>
                    {currentLocation.airQuality}
                  </Text>
                  <Text style={styles.metricLabel}>Air Quality</Text>
                  <Text style={[styles.metricStatus, { color: getQualityColor(currentLocation.airQuality) }]}>
                    {getQualityLabel(currentLocation.airQuality)}
                  </Text>
                </View>
                
                <View style={styles.metricCard}>
                  <View style={styles.metricIcon}>
                    <Droplets size={16} color={getQualityColor(100 - currentLocation.noiseLevel)} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.metricValue}>
                    {currentLocation.noiseLevel}dB
                  </Text>
                  <Text style={styles.metricLabel}>Noise Level</Text>
                  <Text style={[styles.metricStatus, { color: getQualityColor(100 - currentLocation.noiseLevel) }]}>
                    {getNoiseLabel(currentLocation.noiseLevel)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.locationFooter}>
                <Text style={styles.weatherText}>{currentLocation.weather}</Text>
                <Text style={styles.coordinatesText}>{currentLocation.coordinates}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Traveler Mode Banner */}
          <View style={styles.travelerBanner}>
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0.05)']}
              style={styles.travelerGradient}
            >
              <View style={styles.travelerIcon}>
                <Navigation size={18} color="#10b981" strokeWidth={1.5} />
                <Sparkles size={12} color="#10b981" strokeWidth={1.5} style={styles.sparkleIcon} />
              </View>
              <Text style={styles.travelerText}>
                Symbiotic Mode: Adapting to your environment
              </Text>
            </LinearGradient>
          </View>

          {/* Calm Zones */}
          <View style={styles.zonesContainer}>
            <Text style={styles.zonesTitle}>Nearby Sanctuaries</Text>
            
            {calmZones.map((zone, index) => (
              <TouchableOpacity
                key={zone.id}
                style={styles.zoneCardContainer}
                onPress={() => {
              hapticFeedback.light();
              setSelectedZone(selectedZone === zone.id ? null : zone.id);
            }}
                activeOpacity={0.9}
              >
                <Animated.View
                  style={[
                    styles.zoneCard,
                    selectedZone === zone.id && styles.zoneCardSelected,
                    {
                      transform: selectedZone === zone.id ? [{ scale: animations.pulse }] : [{ scale: 1 }]
                    }
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)']}
                    style={styles.zoneGradient}
                  >
                    {/* Zone Glow Effect */}
                    {selectedZone === zone.id && (
                      <Animated.View
                        style={[
                          styles.zoneGlow,
                          {
                            backgroundColor: zone.color,
                            opacity: animations.glow
                          }
                        ]}
                      />
                    )}
                    
                    <View style={styles.zoneHeader}>
                      <View style={[styles.zoneIcon, { backgroundColor: `${zone.color}20` }]}>
                        {zone.icon}
                        {selectedZone === zone.id && (
                          <Animated.View
                            style={[
                              styles.iconGlow,
                              { backgroundColor: zone.color }
                            ]}
                          />
                        )}
                      </View>
                      
                      <View style={styles.zoneInfo}>
                        <Text style={styles.zoneName}>{zone.name}</Text>
                        <Text style={styles.zoneDistance}>{zone.distance} away</Text>
                        <Text style={styles.zoneMood}>{zone.mood}</Text>
                      </View>
                      
                      <View style={styles.zoneMetrics}>
                        <View style={styles.miniMetric}>
                          <Wind size={12} color={getQualityColor(zone.airQuality)} strokeWidth={1.5} />
                          <Text style={[styles.miniMetricText, { color: getQualityColor(zone.airQuality) }]}>
                            {zone.airQuality}
                          </Text>
                        </View>
                        <View style={styles.miniMetric}>
                          <Droplets size={12} color={getQualityColor(100 - zone.noiseLevel)} strokeWidth={1.5} />
                          <Text style={[styles.miniMetricText, { color: getQualityColor(100 - zone.noiseLevel) }]}>
                            {zone.noiseLevel}dB
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <Text style={styles.zoneDescription}>{zone.description}</Text>
                    
                    {selectedZone === zone.id && (
                      <Animated.View 
                        style={styles.zoneDetails}
                      >
                        <View style={styles.zoneActions}>
                          <TouchableOpacity 
                            style={[styles.actionButton, { borderColor: zone.color }]}
                            onPress={() => handleNavigate(zone)}
                            activeOpacity={0.8}
                          >
                            <Navigation size={14} color={zone.color} strokeWidth={1.5} />
                            <Text style={[styles.actionButtonText, { color: zone.color }]}>Navigate</Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            style={[
                              styles.actionButton, 
                              { 
                                borderColor: zone.color,
                                backgroundColor: savedZones.includes(zone.id) ? zone.color + '20' : 'transparent'
                              }
                            ]}
                            onPress={() => handleSaveZone(zone.id)}
                            activeOpacity={0.8}
                          >
                            <Heart 
                              size={14} 
                              color={zone.color} 
                              strokeWidth={1.5}
                              fill={savedZones.includes(zone.id) ? zone.color : 'none'}
                            />
                            <Text style={[styles.actionButtonText, { color: zone.color }]}>
                              {savedZones.includes(zone.id) ? 'Saved' : 'Save'}
                            </Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity 
                            style={[
                              styles.actionButton, 
                              { 
                                borderColor: zone.color,
                                backgroundColor: optimizedZones.includes(zone.id) ? zone.color + '20' : 'transparent'
                              }
                            ]}
                            onPress={() => {
                              hapticFeedback.light();
                              handleOptimizeZone(zone);
                            }}
                            activeOpacity={0.8}
                          >
                            <Zap 
                              size={14} 
                              color={zone.color} 
                              strokeWidth={1.5}
                              fill={optimizedZones.includes(zone.id) ? zone.color : 'none'}
                            />
                            <Text style={[styles.actionButtonText, { color: zone.color }]}>
                              {optimizedZones.includes(zone.id) ? 'Optimized' : 'Optimize'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </Animated.View>
                    )}
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Environment Insights */}
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Symbiotic Insights</Text>
            
            <View style={styles.insightCard}>
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)']}
                style={styles.insightGradient}
              >
                <View style={styles.insightIcon}>
                  <Wind size={18} color="#10b981" strokeWidth={1.5} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightText}>
                    Air quality improves significantly after 3 PM today. Perfect timing for outdoor mindfulness.
                  </Text>
                </View>
              </LinearGradient>
            </View>
            
            <View style={styles.insightCard}>
              <LinearGradient
                colors={['rgba(125, 211, 252, 0.1)', 'rgba(125, 211, 252, 0.05)']}
                style={styles.insightGradient}
              >
                <View style={styles.insightIcon}>
                  <Waves size={18} color="#7dd3fc" strokeWidth={1.5} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightText}>
                    Riverside Sanctuary has the most consistent calm conditions throughout the day.
                  </Text>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.insightCard}>
              <LinearGradient
                colors={['rgba(167, 139, 250, 0.1)', 'rgba(167, 139, 250, 0.05)']}
                style={styles.insightGradient}
              >
                <View style={styles.insightIcon}>
                  <Star size={18} color="#a78bfa" strokeWidth={1.5} />
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightText}>
                    Golden hour at Sunset Vista begins at 6:47 PM - ideal for reflection.
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    marginBottom: Platform.OS === 'ios' ? 20 : 30,
  },
  compassContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  compassRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.3)',
  },
  compassGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
    top: -10,
    left: -10,
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 28 : 32,
    fontFamily: 'Inter-Light',
    color: '#ffffff',
    marginBottom: Platform.OS === 'ios' ? 6 : 8,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  compassIndicator: {
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.2)',
  },
  compassText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#7dd3fc',
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 120,
  },
  currentLocationCard: {
    marginBottom: Platform.OS === 'ios' ? 20 : 24,
    borderRadius: Platform.OS === 'ios' ? 20 : 24,
    overflow: 'hidden',
  },
  locationGradient: {
    padding: Platform.OS === 'ios' ? 20 : 24,
    borderRadius: Platform.OS === 'ios' ? 20 : 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 16 : 20,
    paddingVertical: 4,
  },
  locationIconContainer: {
    position: 'relative',
    marginRight: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(125, 211, 252, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.3)',
  },
  locationGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
    top: -8,
    left: -8,
  },
  locationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 3,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  locationSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  weatherIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  locationMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Platform.OS === 'ios' ? 16 : 20,
  },
  metricCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: Platform.OS === 'ios' ? 14 : 16,
    borderRadius: Platform.OS === 'ios' ? 14 : 16,
    minWidth: Platform.OS === 'ios' ? 90 : 100,
  },
  metricIcon: {
    marginBottom: 8,
  },
  metricValue: {
    fontSize: Platform.OS === 'ios' ? 22 : 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  metricStatus: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.2,
  },
  locationFooter: {
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  coordinatesText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.2,
  },
  travelerBanner: {
    marginBottom: Platform.OS === 'ios' ? 24 : 32,
    borderRadius: Platform.OS === 'ios' ? 16 : 20,
    overflow: 'hidden',
  },
  travelerGradient: {
    paddingHorizontal: Platform.OS === 'ios' ? 16 : 20,
    paddingVertical: Platform.OS === 'ios' ? 14 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  travelerIcon: {
    position: 'relative',
    marginRight: 12,
  },
  sparkleIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  travelerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10b981',
    letterSpacing: 0.1,
    flex: 1,
  },
  zonesContainer: {
    marginBottom: Platform.OS === 'ios' ? 32 : 40,
  },
  zonesTitle: {
    fontSize: Platform.OS === 'ios' ? 20 : 22,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: Platform.OS === 'ios' ? 20 : 24,
    letterSpacing: -0.3,
  },
  zoneCardContainer: {
    marginBottom: 16,
  },
  zoneCard: {
    borderRadius: Platform.OS === 'ios' ? 16 : 20,
    overflow: 'hidden',
    position: 'relative',
  },
  zoneCardSelected: {
    transform: [{ scale: 1.02 }],
  },
  zoneGradient: {
    padding: Platform.OS === 'ios' ? 16 : 20,
    borderRadius: Platform.OS === 'ios' ? 16 : 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  zoneGlow: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 24,
    top: -10,
    left: -10,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 12 : 16,
  },
  zoneIcon: {
    width: Platform.OS === 'ios' ? 44 : 48,
    height: Platform.OS === 'ios' ? 44 : 48,
    borderRadius: Platform.OS === 'ios' ? 22 : 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Platform.OS === 'ios' ? 12 : 16,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    opacity: 0.3,
    top: -4,
    left: -4,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: Platform.OS === 'ios' ? 16 : 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  zoneDistance: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  zoneMood: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'capitalize',
    letterSpacing: 0.2,
  },
  zoneMetrics: {
    alignItems: 'flex-end',
  },
  miniMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  miniMetricText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
    letterSpacing: 0.1,
  },
  zoneDescription: {
    fontSize: Platform.OS === 'ios' ? 13 : 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: Platform.OS === 'ios' ? 20 : 22,
    letterSpacing: 0.1,
  },
  zoneDetails: {
    marginTop: Platform.OS === 'ios' ? 16 : 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  zoneActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: Platform.OS === 'ios' ? 14 : 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 12,
    borderRadius: Platform.OS === 'ios' ? 14 : 16,
    borderWidth: 1,
    minWidth: Platform.OS === 'ios' ? 70 : 80,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 6,
    letterSpacing: 0.2,
  },
  insightsContainer: {
    marginBottom: Platform.OS === 'ios' ? 32 : 40,
  },
  insightsTitle: {
    fontSize: Platform.OS === 'ios' ? 20 : 22,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: Platform.OS === 'ios' ? 20 : 24,
    letterSpacing: -0.3,
  },
  insightCard: {
    marginBottom: Platform.OS === 'ios' ? 12 : 16,
    borderRadius: Platform.OS === 'ios' ? 16 : 18,
    overflow: 'hidden',
  },
  insightGradient: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Platform.OS === 'ios' ? 16 : 20,
    borderRadius: Platform.OS === 'ios' ? 16 : 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  insightIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  insightContent: {
    flex: 1,
  },
  insightText: {
    fontSize: Platform.OS === 'ios' ? 13 : 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: Platform.OS === 'ios' ? 20 : 22,
    letterSpacing: 0.1,
  },
});

export default EnvironmentScreen;