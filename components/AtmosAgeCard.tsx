import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, TrendingUp, TrendingDown, Activity, ChevronRight } from 'lucide-react-native';
import { AtmosAge } from '../types';
import { atmosAgeService } from '../services/atmosAgeService';

const { width } = Dimensions.get('window');

interface AtmosAgeCardProps {
  atmosAge: AtmosAge;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  preview?: boolean;
}

const AtmosAgeCard: React.FC<AtmosAgeCardProps> = ({ 
  atmosAge, 
  onPress, 
  size = 'medium',
  showDetails = false,
  preview = false
}) => {
  const [animations] = useState({
    pulse: new Animated.Value(1),
    glow: new Animated.Value(0.3),
    particles: new Animated.Value(0),
  });

  useEffect(() => {
    // Gentle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.pulse, {
          toValue: 1.05,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.pulse, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Particle animation
    Animated.loop(
      Animated.timing(animations.particles, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const getAgeColor = (ageDifference: number): string => {
    if (ageDifference <= -3) return '#10b981'; // Much younger - green
    if (ageDifference <= -1) return '#7dd3fc'; // Younger - blue
    if (ageDifference <= 1) return '#f59e0b'; // Normal - yellow
    if (ageDifference <= 3) return '#f97316'; // Older - orange
    return '#ef4444'; // Much older - red
  };

  const getPaceColor = (pace: number): string => {
    if (pace <= 0.8) return '#10b981'; // Slow aging - green
    if (pace <= 1.0) return '#7dd3fc'; // Normal - blue
    if (pace <= 1.2) return '#f59e0b'; // Fast - yellow
    return '#ef4444'; // Very fast - red
  };

  const getAgeDifferenceText = (difference: number): string => {
    if (difference <= -3) return `${Math.abs(difference).toFixed(1)} years younger`;
    if (difference <= -1) return `${Math.abs(difference).toFixed(1)} years younger`;
    if (difference <= 1) return 'Age aligned';
    if (difference <= 3) return `${difference.toFixed(1)} years older`;
    return `${difference.toFixed(1)} years older`;
  };

  const getPaceText = (pace: number): string => {
    if (pace <= 0.8) return 'Slow aging';
    if (pace <= 1.0) return 'Normal pace';
    if (pace <= 1.2) return 'Fast aging';
    return 'Very fast aging';
  };

  const renderPaceSlider = () => {
    const pacePosition = ((atmosAge.paceOfAging - 0.5) / 1.5) * 100; // 0.5 to 2.0 range
    
    return (
      <View style={styles.paceContainer}>
        <Text style={styles.paceLabel}>PACE OF AGING</Text>
        <View style={styles.paceSlider}>
          <View style={styles.paceTrack}>
            <View style={styles.paceLabels}>
              <Text style={styles.paceLabelText}>Slow</Text>
              <Text style={styles.paceLabelText}>Fast</Text>
            </View>
            <View style={styles.paceBar}>
              <View 
                style={[
                  styles.paceIndicator,
                  { 
                    left: `${Math.max(0, Math.min(100, pacePosition))}%`,
                    backgroundColor: getPaceColor(atmosAge.paceOfAging)
                  }
                ]} 
              />
            </View>
            <View style={styles.paceValues}>
              <Text style={styles.paceValueText}>0.5x</Text>
              <Text style={styles.paceValueText}>1.0x</Text>
              <Text style={styles.paceValueText}>2.0x</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.paceDescription, { color: getPaceColor(atmosAge.paceOfAging) }]}>
          {getPaceText(atmosAge.paceOfAging)}
        </Text>
      </View>
    );
  };

  const renderAnalysis = () => {
    const primaryInsight = atmosAge.insights[0] || "Your biological age reflects your current health status.";
    const primaryRecommendation = atmosAge.recommendations[0] || "Continue maintaining healthy habits.";
    
    return (
      <View style={styles.analysisContainer}>
        <Text style={styles.analysisTitle}>Steady and Healthy</Text>
        <Text style={styles.analysisText}>
          {primaryInsight} {primaryRecommendation}
        </Text>
      </View>
    );
  };

  const renderParticles = () => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const particleAnimation = animations.particles.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      });

      particles.push(
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: particleAnimation,
              transform: [{
                scale: particleAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                })
              }]
            }
          ]}
        />
      );
    }
    return particles;
  };

  const ageColor = getAgeColor(atmosAge.ageDifference);

  return (
    <View 
      style={[styles.container, size === 'large' && styles.containerLarge]} 
    >
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.04)']}
        style={styles.card}
      >
        {preview ? (
          // Preview Mode - Compact Display
          <View style={styles.previewContainer}>
            <View style={styles.previewHeader}>
              <View style={styles.previewHeaderLeft}>
                <Clock size={14} color="#7dd3fc" strokeWidth={1.5} />
                <Text style={styles.previewTitle}>ATMOS AGE</Text>
              </View>
            </View>
            
            <View style={styles.previewContent}>
              <View style={styles.previewAgeSection}>
                <Text style={[styles.previewAgeValue, { color: ageColor }]}>
                  {atmosAge.biologicalAge.toFixed(1)}
                </Text>
                <Text style={styles.previewAgeLabel}>Biological Age</Text>
              </View>
              
              <View style={styles.previewDivider} />
              
              <View style={styles.previewStats}>
                <View style={styles.previewStat}>
                  <Text style={[styles.previewStatValue, { color: ageColor }]}>
                    {atmosAge.ageDifference > 0 ? '+' : ''}{atmosAge.ageDifference.toFixed(1)}
                  </Text>
                  <Text style={styles.previewStatLabel}>Years</Text>
                </View>
                
                <View style={styles.previewStat}>
                  <Text style={[styles.previewStatValue, { color: getPaceColor(atmosAge.paceOfAging) }]}>
                    {atmosAge.paceOfAging.toFixed(1)}x
                  </Text>
                  <Text style={styles.previewStatLabel}>Pace</Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          // Full Display Mode
          <>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Clock size={16} color="#7dd3fc" />
                <Text style={styles.headerTitle}>ATMOS AGE</Text>
              </View>
              <Text style={styles.updateText}>Next update in 6 days</Text>
              <TouchableOpacity style={styles.infoButton}>
                <Text style={styles.infoText}>i</Text>
              </TouchableOpacity>
            </View>

            {/* Date Range */}
            <View style={styles.dateContainer}>
              <TouchableOpacity style={styles.dateArrow}>
                <Text style={styles.dateArrowText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.dateRange}>AUG 19 - AUG 26</Text>
              <TouchableOpacity style={styles.dateArrow}>
                <Text style={styles.dateArrowText}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Main Age Display */}
            <View style={styles.ageDisplay}>
              <Animated.View 
                style={[
                  styles.ageCircle,
                  {
                    transform: [{ scale: animations.pulse }],
                    borderColor: `${ageColor}30`,
                  }
                ]}
              >
                {/* Particle background */}
                <View style={styles.particleContainer}>
                  {renderParticles()}
                </View>
                
                {/* Age value */}
                <Text style={[styles.ageValue, { color: ageColor }]}>
                  {atmosAge.biologicalAge.toFixed(1)}
                </Text>
                <Text style={styles.ageLabel}>ATMOS AGE</Text>
                <Text style={[styles.ageDifference, { color: ageColor }]}>
                  {getAgeDifferenceText(atmosAge.ageDifference)}
                </Text>
              </Animated.View>
            </View>

            {/* Pace of Aging */}
            {showDetails && renderPaceSlider()}

            {/* Analysis */}
            {showDetails && renderAnalysis()}

            {/* Call to Action */}
            {showDetails && (
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaText}>VIEW YOUR ATMOS ANALYSIS</Text>
                <ChevronRight size={16} color="#7dd3fc" />
              </TouchableOpacity>
            )}
          </>
        )}
             </LinearGradient>
     </View>
   );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  containerLarge: {
    marginVertical: 16,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#7dd3fc',
    letterSpacing: 1.2,
  },
  updateText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  infoButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#7dd3fc',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dateArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateArrowText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dateRange: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  ageDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ageCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  particleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 80,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7dd3fc',
  },
  ageValue: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    fontWeight: '900',
    marginBottom: 4,
  },
  ageLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  ageDifference: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  paceContainer: {
    marginBottom: 20,
  },
  paceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#7dd3fc',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  paceSlider: {
    marginBottom: 8,
  },
  paceTrack: {
    position: 'relative',
  },
  paceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paceLabelText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  paceBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    position: 'relative',
  },
  paceIndicator: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  paceValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  paceValueText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  paceDescription: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  analysisContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  analysisTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  analysisText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#7dd3fc',
    letterSpacing: 0.5,
  },
  // Preview Mode Styles
  previewContainer: {
    padding: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  previewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewTitle: {
    fontSize: 11,
    fontFamily: 'Inter-Bold',
    color: '#7dd3fc',
    letterSpacing: 1.2,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewAgeSection: {
    flex: 1,
    alignItems: 'center',
  },
  previewAgeValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  previewAgeLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.5,
  },
  previewDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },
  previewStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  previewStat: {
    alignItems: 'center',
  },
  previewStatValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  previewStatLabel: {
    fontSize: 9,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 0.3,
  },
});

export default AtmosAgeCard;
