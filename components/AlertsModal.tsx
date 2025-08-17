import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, AlertTriangle, Info, TrendingUp, TrendingDown, Activity } from 'lucide-react-native';
import { ovrService } from '../services/ovrService';
import { DesignSystem, createGlassMorphism } from '../constants/design';

interface Alert {
  id: string;
  timestamp: number;
  domain: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  read?: boolean;
}

interface AlertsModalProps {
  visible: boolean;
  onClose: () => void;
}

const AlertsModal: React.FC<AlertsModalProps> = ({ visible, onClose }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  // Remove animations for cleaner experience

  useEffect(() => {
    console.log('AlertsModal visible changed:', visible);
    if (visible) {
      loadAlerts();
    }
  }, [visible]);

  const loadAlerts = () => {
    // Get alerts from service and add mock ones for demo
    const serviceAlerts = ovrService.getThresholdAlerts(20).map(alert => ({
      id: alert.id,
      timestamp: alert.timestamp,
      domain: alert.domain,
      severity: alert.severity,
      message: alert.message,
      read: false,
    }));

    // Add some sample alerts for demo
    const mockAlerts: Alert[] = [
      {
        id: 'stress-spike',
        timestamp: Date.now() - 300000, // 5 minutes ago
        domain: 'biological',
        severity: 'warning',
        message: 'Stress levels elevated. Heart rate variability decreased by 15%. Consider taking a break.',
      },
      {
        id: 'air-quality',
        timestamp: Date.now() - 600000, // 10 minutes ago
        domain: 'environmental',
        severity: 'info',
        message: 'Air quality excellent (AQI: 28). Perfect time for outdoor activities.',
      },
      {
        id: 'financial-goal',
        timestamp: Date.now() - 900000, // 15 minutes ago
        domain: 'financial',
        severity: 'info',
        message: 'Monthly savings goal achieved! You\'re ahead by $320.',
      },
      {
        id: 'sleep-pattern',
        timestamp: Date.now() - 1800000, // 30 minutes ago
        domain: 'emotional',
        severity: 'critical',
        message: 'Sleep debt detected. REM sleep 25% below optimal. Prioritize rest tonight.',
      },
    ];

    const allAlerts = [...serviceAlerts, ...mockAlerts].sort((a, b) => b.timestamp - a.timestamp);
    setAlerts(allAlerts);
  };

  const handleClose = () => {
    onClose();
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle size={20} color={DesignSystem.colors.error} />;
      case 'warning':
        return <TrendingDown size={20} color={DesignSystem.colors.warning} />;
      case 'info':
        return <Info size={20} color={DesignSystem.colors.primary.cyan} />;
      default:
        return <Bell size={20} color={DesignSystem.colors.neutral.silver} />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return DesignSystem.colors.error;
      case 'warning': return DesignSystem.colors.warning;
      case 'info': return DesignSystem.colors.primary.cyan;
      default: return DesignSystem.colors.neutral.silver;
    }
  };

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case 'biological':
        return <Activity size={16} color="#10b981" />;
      case 'emotional':
        return <TrendingUp size={16} color="#3b82f6" />;
      case 'environmental':
        return <TrendingUp size={16} color="#f59e0b" />;
      case 'financial':
        return <TrendingUp size={16} color="#ef4444" />;
      default:
        return <Bell size={16} color={DesignSystem.colors.neutral.silver} />;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;
    
    return 'Yesterday';
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const renderAlert = (alert: Alert) => {
    const severityColor = getSeverityColor(alert.severity);

    return (
      <View
        key={alert.id}
        style={[
          styles.alertCard,
          {
            borderLeftColor: severityColor,
            opacity: alert.read ? 0.6 : 1,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.alertContent}
          onPress={() => markAsRead(alert.id)}
          activeOpacity={0.8}
        >
          <View style={styles.alertHeader}>
            <View style={styles.alertIconRow}>
              {getSeverityIcon(alert.severity)}
              {getDomainIcon(alert.domain)}
              <Text style={[styles.alertDomain, { color: severityColor }]}>
                {alert.domain.charAt(0).toUpperCase() + alert.domain.slice(1)}
              </Text>
            </View>
            <Text style={styles.alertTime}>
              {formatTimestamp(alert.timestamp)}
            </Text>
          </View>
          
          <Text style={styles.alertMessage}>
            {alert.message}
          </Text>
          
          {!alert.read && (
            <View style={[styles.unreadIndicator, { backgroundColor: severityColor }]} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
      transparent={false}
    >
      <LinearGradient
        colors={['#0a0a0a', '#161616', '#2a2a2a']}
        style={styles.container}
      >
        <View style={styles.modalContent}>
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <ArrowLeft size={24} color={DesignSystem.colors.primary.cyan} />
              </TouchableOpacity>
            </View>

            {/* Alerts Count */}
            <View style={styles.statsRow}>
              <Text style={styles.alertCount}>
                {alerts.filter(a => !a.read).length} unread alerts
              </Text>
              <TouchableOpacity
                style={styles.markAllButton}
                onPress={() => setAlerts(prev => prev.map(a => ({ ...a, read: true })))}
                activeOpacity={0.7}
              >
                <Text style={styles.markAllText}>Mark All Read</Text>
              </TouchableOpacity>
            </View>

            {/* Alerts List */}
            <ScrollView
              style={styles.alertsList}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.alertsContent}
            >
              {alerts.length > 0 ? (
                alerts.map(renderAlert)
              ) : (
                <View style={styles.emptyState}>
                  <Bell size={48} color={DesignSystem.colors.neutral.steel} />
                  <Text style={styles.emptyText}>No alerts at this time</Text>
                  <Text style={styles.emptySubtext}>
                    Your Atmos companion is monitoring your metrics
                  </Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 32 : DesignSystem.spacing.md,
    paddingBottom: DesignSystem.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystem.colors.alpha[8],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.md,
  },
  title: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.heading1,
  },
  closeButton: {
    padding: DesignSystem.spacing.sm,
  },
  backButton: {
    padding: DesignSystem.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.md,
  },
  alertCount: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.body1,
  },
  markAllButton: {
    paddingHorizontal: DesignSystem.spacing.md,
    paddingVertical: DesignSystem.spacing.xs,
    borderRadius: DesignSystem.radius.md,
    backgroundColor: DesignSystem.colors.alpha[8],
  },
  markAllText: {
    color: DesignSystem.colors.primary.cyan,
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  alertsList: {
    flex: 1,
  },
  alertsContent: {
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingBottom: DesignSystem.spacing['4xl'],
    gap: DesignSystem.spacing.md,
  },
  alertCard: {
    ...createGlassMorphism(0.06),
    borderRadius: DesignSystem.radius.lg,
    borderLeftWidth: 4,
    overflow: 'hidden',
    position: 'relative',
    ...DesignSystem.shadows.soft,
  },
  alertContent: {
    padding: DesignSystem.spacing.lg,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: DesignSystem.spacing.sm,
  },
  alertIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: DesignSystem.spacing.sm,
    flex: 1,
  },
  alertDomain: {
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  alertTime: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.micro,
  },
  alertMessage: {
    color: DesignSystem.colors.neutral.platinum,
    ...DesignSystem.typography.body2,
    lineHeight: 20,
  },
  unreadIndicator: {
    position: 'absolute',
    top: DesignSystem.spacing.md,
    right: DesignSystem.spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: DesignSystem.spacing['4xl'],
    gap: DesignSystem.spacing.md,
  },
  emptyText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.heading3,
    textAlign: 'center',
  },
  emptySubtext: {
    color: DesignSystem.colors.neutral.steel,
    ...DesignSystem.typography.body2,
    textAlign: 'center',
  },
});

export default AlertsModal;
