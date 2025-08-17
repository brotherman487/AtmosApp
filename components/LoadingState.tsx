import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'large',
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        style={styles.fullScreenContainer}
      >
        <View style={styles.fullScreenContent}>
          <View style={styles.iconContainer}>
            <Sparkles size={60} color="#7dd3fc" strokeWidth={1.5} />
          </View>
          <ActivityIndicator
            size={size}
            color="#7dd3fc"
            style={styles.spinner}
          />
          <Text style={styles.fullScreenMessage}>{message}</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#7dd3fc" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenContent: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  spinner: {
    marginBottom: 16,
  },
  fullScreenMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginLeft: 12,
  },
});

export default LoadingState;
