import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Zap, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  ChevronRight,
  Brain,
  Heart,
  Wind,
  Activity
} from 'lucide-react-native';
import { AIInsight, SensorData } from '../types';
import { aiInsightsService } from '../services/aiInsightsService';
import { wearableService } from '../services/wearableService';

const { width } = Dimensions.get('window');

interface AIInsightsFeedProps {
  onInsightPress?: (insight: AIInsight) => void;
  onActionPress?: (insight: AIInsight) => void;
}

const priorityToColor = (priority: AIInsight['priority']) => {
  switch (priority) {
    case 'critical': return '#ef4444';
    case 'high': return '#f97316';
    case 'medium': return '#f59e0b';
    case 'low': return '#10b981';
    default: return '#7dd3fc';
  }
};

const AIInsightsFeed: React.FC<AIInsightsFeedProps> = ({ 
  onInsightPress, 
  onActionPress 
}) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = wearableService.subscribe((sensorData: SensorData) => {
      const historicalData = wearableService.getHistoricalData(100);
      const newInsights = aiInsightsService.generateInsights(sensorData, historicalData);
      if (newInsights.length > 0) {
        setInsights(prev => [...newInsights, ...prev]);
      }
    });

    const existingInsights = aiInsightsService.getAllInsights();
    setInsights(existingInsights);

    return unsubscribe;
  }, []);

  const handleInsightPress = (insight: AIInsight) => {
    if (expandedInsight === insight.id) {
      setExpandedInsight(null);
    } else {
      setExpandedInsight(insight.id);
      aiInsightsService.markAsRead(insight.id);
      onInsightPress?.(insight);
    }
  };

  const handleActionPress = (insight: AIInsight) => {
    onActionPress?.(insight);
  };

  const getInsightIcon = (insight: AIInsight) => {
    switch (insight.type) {
      case 'warning':
        return <AlertTriangle size={20} color="#ef4444" />;
      case 'nudge':
        return <Zap size={20} color="#f59e0b" />;
      case 'insight':
        return <Lightbulb size={20} color="#10b981" />;
      case 'optimization':
        return <TrendingUp size={20} color="#06b6d4" />;
      case 'pattern':
        return <Brain size={20} color="#a855f7" />;
      default:
        return <Lightbulb size={20} color="#7dd3fc" />;
    }
  };

  const getSensorIcon = (sensor?: keyof SensorData) => {
    if (!sensor) return null;
    
    switch (sensor) {
      case 'heartRate':
        return <Heart size={14} color="#ef4444" />;
      case 'stressIndex':
        return <Brain size={14} color="#a855f7" />;
      case 'airQuality':
        return <Wind size={14} color="#10b981" />;
      case 'movement':
        return <Activity size={14} color="#06b6d4" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return new Date(timestamp).toLocaleDateString();
  };

  const renderInsightCard = (insight: AIInsight) => {
    const isExpanded = expandedInsight === insight.id;
    const isNew = !insight.read;
    const color = priorityToColor(insight.priority);
    const icon = getInsightIcon(insight);
    const sensorIcon = getSensorIcon(insight.sensorTrigger);

    return (
      <View key={insight.id} style={[styles.insightCard, { borderColor: color + '40' }]}> 
        <TouchableOpacity style={styles.insightHeader} onPress={() => handleInsightPress(insight)} activeOpacity={0.7}>
          <View style={styles.insightIconContainer}>
            {icon}
            {sensorIcon && <View style={styles.sensorIconContainer}>{sensorIcon}</View>}
          </View>
          
          <View style={styles.insightContent}>
            <View style={styles.insightTitleRow}>
              <Text style={[styles.insightTitle, { color }]} numberOfLines={1}>{insight.title}</Text>
              {isNew && <View style={[styles.newIndicator, { backgroundColor: color }]} />}
            </View>
            
            <View style={styles.insightTimestamp}>
              <Clock size={12} color="#7dd3fc" />
              <Text style={styles.timestampText}>{formatTimestamp(insight.timestamp)}</Text>
            </View>
          </View>
          
          <View style={styles.insightActions}>
            <ChevronRight size={16} color="#7dd3fc" style={styles.expandIcon} />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.insightDescription}>{insight.content}</Text>
            
            {insight.action && (
              <TouchableOpacity style={[styles.actionButton, { borderColor: color }]} onPress={() => handleActionPress(insight)} activeOpacity={0.7}>
                <Text style={[styles.actionButtonText, { color }]}>{insight.action}</Text>
                <CheckCircle size={16} color={color} />
              </TouchableOpacity>
            )}

            {insight.threshold && insight.sensorTrigger && (
              <View style={styles.thresholdInfo}>
                <Text style={styles.thresholdText}>Triggered when {insight.sensorTrigger} exceeds {insight.threshold}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Brain size={48} color="#7dd3fc" />
      </View>
      <Text style={styles.emptyTitle}>No Insights Yet</Text>
      <Text style={styles.emptyDescription}>
        Your Atmos AI is analyzing your patterns. Insights will appear here as it learns about your rhythms.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Insights</Text>
        <Text style={styles.subtitle}>Your symbiotic intelligence companion</Text>
      </View>

      {insights.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView style={styles.insightsList} showsVerticalScrollIndicator={false} contentContainerStyle={styles.insightsContent}>
          {insights.map((insight) => renderInsightCard(insight))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 12 },
  title: { color: '#fff', fontSize: 24, fontFamily: 'Inter-Bold', marginBottom: 2 },
  subtitle: { color: '#7dd3fc', fontSize: 14, fontFamily: 'Inter-Regular', opacity: 0.8 },
  insightsList: { flex: 1 },
  insightsContent: { paddingHorizontal: 20, paddingBottom: 20 },
  insightCard: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  insightHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  insightIconContainer: { position: 'relative', marginRight: 12 },
  sensorIconContainer: { position: 'absolute', top: -4, right: -4, backgroundColor: 'rgba(0, 0, 0, 0.8)', borderRadius: 8, padding: 2 },
  insightContent: { flex: 1 },
  insightTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  insightTitle: { fontSize: 16, fontFamily: 'Inter-SemiBold', flex: 1 },
  newIndicator: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
  insightTimestamp: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timestampText: { color: '#7dd3fc', fontSize: 12, fontFamily: 'Inter-Regular', opacity: 0.7 },
  insightActions: { marginLeft: 8 },
  expandIcon: {},
  expandedContent: { paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: 'rgba(125, 211, 252, 0.1)' },
  insightDescription: { color: '#fff', fontSize: 14, fontFamily: 'Inter-Regular', lineHeight: 20, marginBottom: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 18, borderWidth: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', gap: 8 },
  actionButtonText: { fontSize: 14, fontFamily: 'Inter-Medium' },
  thresholdInfo: { marginTop: 10, padding: 10, backgroundColor: 'rgba(125, 211, 252, 0.1)', borderRadius: 8 },
  thresholdText: { color: '#7dd3fc', fontSize: 12, fontFamily: 'Inter-Regular', opacity: 0.8 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyIcon: { marginBottom: 16 },
  emptyTitle: { color: '#fff', fontSize: 18, fontFamily: 'Inter-SemiBold', marginBottom: 8 },
  emptyDescription: { color: '#7dd3fc', fontSize: 14, fontFamily: 'Inter-Regular', textAlign: 'center', lineHeight: 20, opacity: 0.8 },
});

export default AIInsightsFeed; 