import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { AlertTriangle, CheckCircle, Info, Zap, X } from 'lucide-react-native';
import { ovrService } from '../services/ovrService';
import { DesignSystem, createGlassMorphism } from '../constants/design';

interface Alert {
  id: string;
  timestamp: number;
  domain: 'biological' | 'emotional' | 'environmental' | 'financial' | 'overall';
  threshold: number;
  currentValue: number;
  previousValue: number;
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

interface AIAlertsProps {
  onAlertPress?: (alert: Alert) => void;
  onDismissAlert?: (alertId: string) => void;
  maxAlerts?: number;
  autoHide?: boolean;
}

const AIAlerts: React.FC<AIAlertsProps> = ({ 
  onAlertPress, 
  onDismissAlert,
  maxAlerts = 5,
  autoHide = true 
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [animations] = useState(new Map<string, Animated.Value>());
  const dismissedAlertsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Only run once on mount to avoid infinite loops
    const newAlerts = ovrService.getThresholdAlerts(maxAlerts) as Alert[];
    const filteredAlerts = newAlerts.filter(alert => !dismissedAlertsRef.current.has(alert.id));
    setAlerts(filteredAlerts);

    // Setup animations for new alerts
    filteredAlerts.forEach(alert => {
      if (!animations.has(alert.id)) {
        const animValue = new Animated.Value(0);
        animations.set(alert.id, animValue);
        
        // Slide in animation
        Animated.spring(animValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();

        // Auto-hide for info alerts if enabled
        if (autoHide && alert.severity === 'info') {
          setTimeout(() => handleDismiss(alert.id), 5000);
        }
      }
    });
  }, []); // Empty dependency array to run only once

  const handleDismiss = (alertId: string) => {
    const animValue = animations.get(alertId);
    if (animValue) {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        dismissedAlertsRef.current.add(alertId);
        setDismissedAlerts(prev => new Set(prev).add(alertId));
        animations.delete(alertId);
        onDismissAlert?.(alertId);
      });
    }
  };

  const getAlertIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle size={16} color={DesignSystem.colors.error} />;
      case 'warning':
        return <Zap size={16} color={DesignSystem.colors.warning} />;
      case 'info':
        return <Info size={16} color={DesignSystem.colors.info} />;
      default:
        return <CheckCircle size={16} color={DesignSystem.colors.success} />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return DesignSystem.colors.error;
      case 'warning': return DesignSystem.colors.warning;
      case 'info': return DesignSystem.colors.info;
      default: return DesignSystem.colors.success;
    }
  };

  const getDomainColor = (domain: Alert['domain']) => {
    switch (domain) {
      case 'biological': return '#a855f7';
      case 'emotional': return '#ef4444';
      case 'environmental': return '#10b981';
      case 'financial': return '#f59e0b';
      case 'overall': return DesignSystem.colors.primary.cyan;
      default: return DesignSystem.colors.primary.cyan;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}h ago`;
  };

  const renderAlert = (alert: Alert) => {
    const animValue = animations.get(alert.id) || new Animated.Value(1);
    const severityColor = getSeverityColor(alert.severity);
    const domainColor = getDomainColor(alert.domain);

    return (
      <Animated.View
        key={alert.id}
        style={[
          styles.alertCard,
          {
            borderLeftColor: severityColor,
            transform: [
              {
                translateX: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [200, 0],
                }),
              },
              {
                scale: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1],
                }),
              },
            ],
            opacity: animValue,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.alertContent}
          onPress={() => onAlertPress?.(alert)}
          activeOpacity={0.9}
        >
          {/* Compact Alert Header */}
          <View style={styles.alertHeader}>
            <View style={styles.alertIconContainer}>
              {getAlertIcon(alert.severity)}
            </View>
            <View style={styles.alertInfo}>
              <Text style={styles.alertDomain}>
                {alert.domain.charAt(0).toUpperCase() + alert.domain.slice(1)}
              </Text>
              <Text style={styles.alertTimestamp}>
                {formatTimestamp(alert.timestamp)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={() => handleDismiss(alert.id)}
              activeOpacity={0.7}
            >
              <X size={12} color={DesignSystem.colors.neutral.silver} />
            </TouchableOpacity>
          </View>

          {/* Alert Message */}
          <Text style={styles.alertMessage}>{alert.message}</Text>

          {/* Minimal Value Change */}
          <View style={styles.valueChange}>
            <Text style={[styles.valueChangeText, { color: severityColor }]}>
              {alert.previousValue.toFixed(1)} → {alert.currentValue.toFixed(1)}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Real-time Alerts</Text>
        <View style={styles.alertCount}>
          <Text style={styles.alertCountText}>{alerts.length}</Text>
        </View>
      </View>
      
      <ScrollView 
        style={styles.alertsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.alertsContent}
      >
        {alerts.map(renderAlert)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: DesignSystem.colors.neutral.pearl,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  alertCount: {
    backgroundColor: DesignSystem.colors.error,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  alertCountText: {
    color: DesignSystem.colors.neutral.pearl,
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
  alertsList: {
    maxHeight: 280,
  },
  alertsContent: {
    gap: 8,
  },
  alertCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertContent: {
    padding: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertIconContainer: {
    marginRight: 10,
  },
  alertInfo: {
    flex: 1,
  },
  alertDomain: {
    color: DesignSystem.colors.neutral.platinum,
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  alertTimestamp: {
    color: DesignSystem.colors.neutral.silver,
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    marginTop: 1,
  },
  dismissButton: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  alertMessage: {
    color: DesignSystem.colors.neutral.platinum,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
    marginBottom: 8,
  },
  valueChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueChangeText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    fontWeight: '600',
  },
});

export default AIAlerts;
