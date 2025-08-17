import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DesignSystem } from '../constants/design';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = DesignSystem.colors.primary.cyan,
  fullScreen = false 
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 64;
      default: return 40;
    }
  };

  const spinnerSize = getSize();

  const SpinnerComponent = (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderRadius: spinnerSize / 2,
            transform: [
              { rotate: spin },
              { scale: pulseValue }
            ],
          }
        ]}
      >
        <View style={[styles.gradient, { width: spinnerSize, height: spinnerSize, borderRadius: spinnerSize / 2 }]}>
          <LinearGradient
            colors={[color, `${color}80`, 'transparent']}
            style={styles.gradientInner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </View>
      </Animated.View>
    </View>
  );

  if (fullScreen) {
    return (
      <LinearGradient colors={['#0a0a0a', '#161616', '#2a2a2a']} style={styles.fullScreenContainer}>
        {SpinnerComponent}
      </LinearGradient>
    );
  }

  return SpinnerComponent;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreen: {
    flex: 1,
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradient: {
    overflow: 'hidden',
  },
  gradientInner: {
    width: '100%',
    height: '100%',
  },
});

export default LoadingSpinner;
