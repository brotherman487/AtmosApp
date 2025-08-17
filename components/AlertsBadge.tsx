import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import { ovrService } from '../services/ovrService';
import AlertsModal from './AlertsModal';
import { DesignSystem, createGlassMorphism } from '../constants/design';

interface AlertsBadgeProps {
  onPress?: () => void;
  style?: any;
}

const AlertsBadge: React.FC<AlertsBadgeProps> = ({ onPress, style }) => {
  const [alertCount, setAlertCount] = useState(0);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  // Remove animations for cleaner experience

  useEffect(() => {
    // Poll for alerts every 2 seconds
    const interval = setInterval(() => {
      const alerts = ovrService.getThresholdAlerts(10);
      const newCount = alerts.length;
      
      if (newCount !== alertCount) {
        setAlertCount(newCount);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [alertCount]);



  const handlePress = () => {
    console.log('AlertsBadge pressed, opening modal');
    setShowAlertsModal(true);
    onPress?.();
  };

  const getSeverityColor = () => {
    if (alertCount >= 3) return DesignSystem.colors.error;
    if (alertCount >= 1) return DesignSystem.colors.warning;
    return DesignSystem.colors.primary.cyan;
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <Bell 
            size={20} 
            color={alertCount > 0 ? getSeverityColor() : DesignSystem.colors.neutral.silver} 
            strokeWidth={1.5}
          />
          
          {alertCount > 0 && (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: getSeverityColor(),
                }
              ]}
            >
              <Text style={styles.badgeText}>
                {alertCount > 9 ? '9+' : alertCount.toString()}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Full-Screen Alerts Modal */}
      <AlertsModal
        visible={showAlertsModal}
        onClose={() => setShowAlertsModal(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  badgeText: {
    color: DesignSystem.colors.neutral.pearl,
    fontSize: 9,
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },

});

export default AlertsBadge;
