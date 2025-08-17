import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Inbox, 
  Activity, 
  Brain, 
  Globe, 
  User, 
  RefreshCw,
  Plus 
} from 'lucide-react-native';

interface EmptyStateProps {
  type?: 'default' | 'metrics' | 'insights' | 'zones' | 'profile' | 'achievements';
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  showAction?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'default',
  title,
  message,
  actionText,
  onAction,
  showAction = true,
}) => {
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'metrics':
        return {
          icon: <Activity size={60} color="#10b981" strokeWidth={1.5} />,
          defaultTitle: 'No Metrics Available',
          defaultMessage: 'Connect your wearable device to start tracking your wellness metrics.',
          defaultActionText: 'Connect Device',
          color: '#10b981',
        };
      case 'insights':
        return {
          icon: <Brain size={60} color="#a855f7" strokeWidth={1.5} />,
          defaultTitle: 'No Insights Yet',
          defaultMessage: 'Start using the app to generate personalized insights about your wellness.',
          defaultActionText: 'Get Started',
          color: '#a855f7',
        };
      case 'zones':
        return {
          icon: <Globe size={60} color="#06b6d4" strokeWidth={1.5} />,
          defaultTitle: 'No Calm Zones Found',
          defaultMessage: 'We\'ll help you discover peaceful locations around you.',
          defaultActionText: 'Discover Zones',
          color: '#06b6d4',
        };
      case 'profile':
        return {
          icon: <User size={60} color="#f59e0b" strokeWidth={1.5} />,
          defaultTitle: 'Profile Empty',
          defaultMessage: 'Complete your profile to get personalized recommendations.',
          defaultActionText: 'Complete Profile',
          color: '#f59e0b',
        };
      case 'achievements':
        return {
          icon: <RefreshCw size={60} color="#ef4444" strokeWidth={1.5} />,
          defaultTitle: 'No Achievements Yet',
          defaultMessage: 'Keep using the app to unlock achievements and track your progress.',
          defaultActionText: 'Start Journey',
          color: '#ef4444',
        };
      default:
        return {
          icon: <Inbox size={60} color="#7dd3fc" strokeWidth={1.5} />,
          defaultTitle: 'Nothing Here',
          defaultMessage: 'This area is empty. Check back later for updates.',
          defaultActionText: 'Refresh',
          color: '#7dd3fc',
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${config.color}20` }]}>
          {config.icon}
        </View>
        
        <Text style={styles.title}>
          {title || config.defaultTitle}
        </Text>
        
        <Text style={styles.message}>
          {message || config.defaultMessage}
        </Text>

        {showAction && onAction && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: config.color }]}
            onPress={onAction}
            activeOpacity={0.8}
          >
            <Plus size={20} color="#ffffff" style={styles.actionIcon} />
            <Text style={styles.actionText}>
              {actionText || config.defaultActionText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 140,
    justifyContent: 'center',
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});

export default EmptyState;
