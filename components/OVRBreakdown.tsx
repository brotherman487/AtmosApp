import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, Zap, Brain, Heart, Wind, DollarSign, ArrowLeft } from 'lucide-react-native';
import type { OVRBreakdown, OVRScore } from '../types/ovr';

const { width } = Dimensions.get('window');

interface OVRBreakdownProps {
  ovrScore: OVRScore;
  onClose?: () => void;
}

const OVRBreakdown: React.FC<OVRBreakdownProps> = ({ ovrScore, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [animations] = useState({
    slide: new Animated.Value(0),
    fade: new Animated.Value(0),
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(animations.slide, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animations.fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const getScoreCategory = (score: number) => {
    if (score >= 90) return 'Elite';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Average';
    if (score >= 40) return 'Below Average';
    if (score >= 30) return 'Poor';
    return 'Critical';
  };

  const getTrendIcon = (trend: number[]) => {
    if (trend.length < 2) return <Minus size={16} color="#7dd3fc" />;

    const recent = trend.slice(-3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previous = trend.slice(-6, -3);
    const prevAvg = previous.length > 0 ? previous.reduce((a, b) => a + b, 0) / previous.length : avg;

    if (avg > prevAvg + 2) return <TrendingUp size={16} color="#10b981" />;
    if (avg < prevAvg - 2) return <TrendingDown size={16} color="#ef4444" />;
    return <Minus size={16} color="#7dd3fc" />;
  };

  const getTrendColor = (trend: number[]) => {
    if (trend.length < 2) return '#7dd3fc';

    const recent = trend.slice(-3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const previous = trend.slice(-6, -3);
    const prevAvg = previous.length > 0 ? previous.reduce((a, b) => a + b, 0) / previous.length : avg;

    if (avg > prevAvg + 2) return '#10b981';
    if (avg < prevAvg - 2) return '#ef4444';
    return '#7dd3fc';
  };

  const renderTrendChart = (data: number[], color: string) => {
    if (data.length === 0) return null;

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    return (
      <View style={styles.trendChart}>
        <View style={styles.trendBars}>
          {data.slice(-7).map((value, index) => (
            <View key={index} style={styles.trendBarContainer}>
              <View
                style={[
                  styles.trendBar,
                  {
                    height: ((value - minValue) / range) * 40,
                    backgroundColor: color,
                  },
                ]}
              />
            </View>
          ))}
        </View>
        <Text style={styles.trendLabel}>7-day trend</Text>
      </View>
    );
  };

  const renderSection = (
    key: string,
    title: string,
    score: number,
    icon: React.ReactNode,
    color: string,
    components: Record<string, number>,
    trends: { daily: number[]; weekly: number[]; monthly: number[] },
    insights: string[]
  ) => {
    const isExpanded = expandedSections.has(key);

    return (
      <View key={key} style={[styles.sectionCard, { borderColor: color + '40' }]}>
        <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(key)} activeOpacity={0.7}>
          <View style={styles.sectionTitle}>
            {icon}
            <Text style={styles.sectionTitleText}>{title}</Text>
          </View>
          <View style={styles.sectionScore}>
            <Text style={[styles.sectionScoreText, { color }]}>{score}</Text>
            <Text style={styles.sectionScoreMax}>/99</Text>
            {isExpanded ? <ChevronUp size={16} color="#7dd3fc" /> : <ChevronDown size={16} color="#7dd3fc" />}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <Animated.View style={styles.expandedContent}>
            <View style={styles.scoreCategory}>
              <Text style={styles.categoryLabel}>Category:</Text>
              <Text style={[styles.categoryValue, { color }]}>{getScoreCategory(score)}</Text>
            </View>

            <View style={styles.componentsContainer}>
              <Text style={styles.componentsTitle}>Components</Text>
              <View style={styles.componentsGrid}>
                {Object.entries(components).map(([name, value]) => (
                  <View key={name} style={styles.componentItem}>
                    <Text style={styles.componentLabel}>
                      {name.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </Text>
                    <Text style={[styles.componentValue, { color }]}>{Math.round(value)}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.trendContainer}>
              <Text style={styles.trendTitle}>Performance Trend</Text>
              {renderTrendChart(trends.weekly || [], color)}
            </View>

            {insights.length > 0 && (
              <View style={styles.insightsContainer}>
                <Text style={styles.insightsTitle}>AI Insights</Text>
                {insights.map((insight, index) => (
                  <View key={index} style={styles.insightItem}>
                    <Zap size={14} color={color} />
                    <Text style={styles.insightText}>{insight}</Text>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        )}
      </View>
    );
  };

  // Mock data
  const mockBreakdown: OVRBreakdown = {
    biological: {
      score: ovrScore.biological,
      components: { sleepQuality: 85, activityBalance: 72, recovery: 68, heartRateVariability: 75 },
      trends: { daily: [65, 68, 72, 70, 73, 75, 72], weekly: [68, 70, 72, 75, 73, 76, 78], monthly: [70, 72, 75, 78, 76, 79, 81] },
      insights: ['Your sleep quality has improved 15% this week', 'Activity balance is optimal', 'Heart rate variability indicates good stress management'],
    },
    emotional: {
      score: ovrScore.emotional,
      components: { moodStability: 78, stressLevels: 65, positiveInteractions: 82, emotionalResilience: 75 },
      trends: { daily: [70, 72, 75, 73, 76, 78, 75], weekly: [72, 75, 78, 76, 79, 81, 78], monthly: [75, 78, 81, 79, 82, 84, 81] },
      insights: ['Mood stability has been consistent this month', 'Stress levels are within healthy range', 'Positive interactions are boosting emotional resilience'],
    },
    environmental: {
      score: ovrScore.environmental,
      components: { airQuality: 88, noiseLevels: 75, temperatureComfort: 82, daylightExposure: 78 },
      trends: { daily: [80, 82, 85, 83, 86, 88, 85], weekly: [82, 85, 88, 86, 89, 91, 88], monthly: [85, 88, 91, 89, 92, 94, 91] },
      insights: ['Air quality has been excellent this week', 'Noise levels are conducive to focus', 'Temperature comfort is optimal for productivity'],
    },
    financial: {
      score: ovrScore.financial,
      components: { savingsProgress: 72, debtRatio: 68, budgetAdherence: 75, incomeGrowth: 70 },
      trends: { daily: [65, 68, 70, 68, 72, 75, 72], weekly: [68, 70, 73, 71, 75, 78, 75], monthly: [70, 73, 76, 74, 78, 81, 78] },
      insights: ['Savings progress is ahead of monthly target', 'Debt ratio is decreasing steadily', 'Budget adherence has improved 8% this month'],
      goals: [],
      recentTransactions: [],
    },
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animations.fade,
          transform: [
            {
              translateY: animations.slide.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient colors={['rgba(125, 211, 252, 0.1)', 'rgba(125, 211, 252, 0.05)', 'transparent']} style={styles.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <ArrowLeft size={24} color="#7dd3fc" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSection('biological', 'Biological Index', mockBreakdown.biological.score, <Brain size={20} color="#a855f7" />, '#a855f7', mockBreakdown.biological.components, mockBreakdown.biological.trends, mockBreakdown.biological.insights)}
        {renderSection('emotional', 'Emotional Index', mockBreakdown.emotional.score, <Heart size={20} color="#ef4444" />, '#ef4444', mockBreakdown.emotional.components, mockBreakdown.emotional.trends, mockBreakdown.emotional.insights)}
        {renderSection('environmental', 'Environmental Index', mockBreakdown.environmental.score, <Wind size={20} color="#10b981" />, '#10b981', mockBreakdown.environmental.components, mockBreakdown.environmental.trends, mockBreakdown.environmental.insights)}
        {renderSection('financial', 'Financial Vitality Index', mockBreakdown.financial.score, <DollarSign size={20} color="#f59e0b" />, '#f59e0b', mockBreakdown.financial.components, mockBreakdown.financial.trends, mockBreakdown.financial.insights)}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(30, 41, 59, 0.98)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(125, 211, 252, 0.2)', margin: 16 },
  background: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(125, 211, 252, 0.2)' },
  title: { color: '#fff', fontSize: 24, fontFamily: 'Inter-Bold' },
  subtitle: { color: '#7dd3fc', fontSize: 14, fontFamily: 'Inter-Regular', opacity: 0.8 },
  backButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255, 255, 255, 0.1)', alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, padding: 20 },
  sectionCard: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sectionTitleText: { color: '#fff', fontSize: 18, fontFamily: 'Inter-SemiBold' },
  sectionScore: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionScoreText: { fontSize: 24, fontFamily: 'Inter-Bold' },
  sectionScoreMax: { color: '#7dd3fc', fontSize: 14, fontFamily: 'Inter-Regular', opacity: 0.7 },
  expandedContent: { padding: 20, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
  scoreCategory: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  categoryLabel: { color: '#7dd3fc', fontSize: 14, fontFamily: 'Inter-Regular' },
  categoryValue: { fontSize: 16, fontFamily: 'Inter-Bold' },
  componentsContainer: { marginBottom: 20 },
  componentsTitle: { color: '#fff', fontSize: 16, fontFamily: 'Inter-SemiBold', marginBottom: 12 },
  componentsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  componentItem: { minWidth: (width - 120) / 2 },
  componentLabel: { color: '#7dd3fc', fontSize: 12, fontFamily: 'Inter-Regular', marginBottom: 4 },
  componentValue: { fontSize: 18, fontFamily: 'Inter-Bold' },
  trendContainer: { marginBottom: 20 },
  trendTitle: { color: '#fff', fontSize: 16, fontFamily: 'Inter-SemiBold', marginBottom: 12 },
  trendChart: { alignItems: 'center' },
  trendBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 50, marginBottom: 8 },
  trendBarContainer: { alignItems: 'center' },
  trendBar: { width: 8, borderRadius: 4, minHeight: 4 },
  trendLabel: { color: '#7dd3fc', fontSize: 12, fontFamily: 'Inter-Regular', opacity: 0.7 },
  insightsContainer: { marginBottom: 20 },
  insightsTitle: { color: '#fff', fontSize: 16, fontFamily: 'Inter-SemiBold', marginBottom: 12 },
  insightItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  insightText: { color: '#7dd3fc', fontSize: 14, fontFamily: 'Inter-Regular', flex: 1 },
});

export default OVRBreakdown;

