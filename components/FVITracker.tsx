import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DollarSign, Target, TrendingUp, TrendingDown, Plus, ChevronRight, Zap, ArrowLeft } from 'lucide-react-native';
import { FinancialGoal, FinancialTransaction } from '../types/ovr';
import { hapticFeedback } from '../utils/haptics';

const { width } = Dimensions.get('window');

interface FVITrackerProps {
  onAddGoal?: () => void;
  onGoalPress?: (goal: FinancialGoal) => void;
  onConnectAccounts?: () => void;
  onClose?: () => void;
}

const FVITracker: React.FC<FVITrackerProps> = ({ 
  onAddGoal, 
  onGoalPress, 
  onConnectAccounts,
  onClose,
}) => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<FinancialTransaction[]>([]);

  useEffect(() => {
    // Load data only once on mount
    const mockGoals: FinancialGoal[] = [
      {
        id: '1',
        name: 'Emergency Fund',
        targetAmount: 10000,
        currentAmount: 7500,
        targetDate: Date.now() + 90 * 24 * 60 * 60 * 1000,
        category: 'emergency',
        priority: 'high',
        progress: 75,
      },
      {
        id: '2',
        name: 'Vacation Fund',
        targetAmount: 5000,
        currentAmount: 3200,
        targetDate: Date.now() + 180 * 24 * 60 * 60 * 1000,
        category: 'savings',
        priority: 'medium',
        progress: 64,
      },
      {
        id: '3',
        name: 'Debt Payoff',
        targetAmount: 15000,
        currentAmount: 8500,
        targetDate: Date.now() + 365 * 24 * 60 * 60 * 1000,
        category: 'debt',
        priority: 'critical',
        progress: 57,
      },
    ];

    const mockTransactions: FinancialTransaction[] = [
      {
        id: '1',
        amount: 2500,
        category: 'Income',
        description: 'Salary Deposit',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        type: 'income',
        impact: 'positive',
      },
      {
        id: '2',
        amount: -150,
        category: 'Food',
        description: 'Grocery Shopping',
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
        type: 'expense',
        impact: 'negative',
      },
      {
        id: '3',
        amount: 500,
        category: 'Savings',
        description: 'Emergency Fund Contribution',
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
        type: 'transfer',
        impact: 'positive',
      },
    ];

    setGoals(mockGoals);
    setRecentTransactions(mockTransactions);
  }, []); // Empty dependency array to run only once

  const getPriorityColor = (priority: FinancialGoal['priority']) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#7dd3fc';
    }
  };

  const getCategoryIcon = (category: FinancialGoal['category']) => {
    switch (category) {
      case 'savings': return <Target size={16} color="#10b981" />;
      case 'debt': return <TrendingDown size={16} color="#ef4444" />;
      case 'investment': return <TrendingUp size={16} color="#3b82f6" />;
      case 'emergency': return <Zap size={16} color="#f59e0b" />;
      default: return <DollarSign size={16} color="#7dd3fc" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const renderGoalCard = (goal: FinancialGoal) => (
    <TouchableOpacity
      key={goal.id}
      style={[styles.goalCard, { borderColor: getPriorityColor(goal.priority) + '40' }]}
      onPress={() => {
        hapticFeedback.light();
        Alert.alert(
          goal.name,
          `Progress: ${goal.progress}%\nTarget: $${goal.targetAmount.toLocaleString()}\nCurrent: $${goal.currentAmount.toLocaleString()}`,
          [
            { text: 'Close', style: 'cancel' },
            { text: 'Update Progress', onPress: () => onGoalPress?.(goal) }
          ]
        );
      }}
      activeOpacity={0.8}
    >
      <View style={styles.goalHeader}>
        <View style={styles.goalInfo}>
          {getCategoryIcon(goal.category)}
          <Text style={styles.goalName}>{goal.name}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(goal.priority) + '20' }]}>
          <Text style={[styles.priorityText, { color: getPriorityColor(goal.priority) }]}> {goal.priority.toUpperCase()} </Text>
        </View>
      </View>

      <View style={styles.goalProgress}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressAmount}>
            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
          </Text>
          <Text style={styles.progressPercentage}>{goal.progress}%</Text>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${goal.progress}%`,
                backgroundColor: getPriorityColor(goal.priority)
              }
            ]} 
          />
        </View>
        
        <Text style={styles.goalDeadline}>
          Target: {new Date(goal.targetDate).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderTransactionCard = (transaction: FinancialTransaction) => (
    <View key={transaction.id} style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        {getCategoryIcon(transaction.type === 'income' ? 'investment' : transaction.type === 'expense' ? 'debt' : 'savings')}
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription}>{transaction.description}</Text>
          <Text style={styles.transactionCategory}>{transaction.category}</Text>
        </View>
        <View style={styles.transactionAmount}>
          <Text style={[
            styles.amountText,
            { color: transaction.impact === 'positive' ? '#10b981' : '#ef4444' }
          ]}>
            {transaction.impact === 'positive' ? '+' : ''}{formatCurrency(transaction.amount)}
          </Text>
          <Text style={styles.transactionDate}>{formatDate(transaction.timestamp)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => {
            hapticFeedback.light();
            onClose?.();
          }} 
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#7dd3fc" />
        </TouchableOpacity>
      </View>

      {/* FVI Overview Summary */}
      <View style={styles.overviewSection}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Financial Health Score</Text>
          <Text style={styles.overviewScore}>87</Text>
          <Text style={styles.overviewStatus}>Strong</Text>
          <View style={styles.overviewMetrics}>
            <View style={styles.overviewMetric}>
              <Text style={styles.metricLabel}>Net Worth</Text>
              <Text style={styles.metricValue}>$24,500</Text>
            </View>
            <View style={styles.overviewMetric}>
              <Text style={styles.metricLabel}>Monthly Savings</Text>
              <Text style={styles.metricValue}>$1,250</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Financial Goals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => {
              hapticFeedback.light();
              Alert.alert(
                'Add Financial Goal',
                'Create a new financial goal to track your progress.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Create Goal', onPress: () => onAddGoal?.() }
                ]
              );
            }}
            activeOpacity={0.8}
          >
            <Plus size={16} color="#f59e0b" />
            <Text style={styles.addButtonText}>Add Goal</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.goalsContainer}>
          {goals.map(renderGoalCard)}
        </ScrollView>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => {
              hapticFeedback.light();
              Alert.alert('Transaction History', 'Full transaction history coming soon!');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={16} color="#7dd3fc" />
          </TouchableOpacity>
        </View>
        <View style={styles.transactionsContainer}>
          {recentTransactions.slice(0, 5).map(renderTransactionCard)}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: 'transparent'
  },
  scrollContent: { 
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 16,
    paddingTop: Platform.OS === 'ios' ? 24 : 8,
    paddingBottom: Platform.OS === 'ios' ? 40 : 32
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: Platform.OS === 'ios' ? 32 : 24,
    paddingTop: Platform.OS === 'ios' ? 32 : 8
  },
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: Platform.OS === 'ios' ? 16 : 12 
  },
  backBtn: { 
    padding: Platform.OS === 'ios' ? 8 : 6 
  },
  headerTitleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: Platform.OS === 'ios' ? 12 : 8 
  },
  title: { 
    color: '#fff', 
    fontSize: Platform.OS === 'ios' ? 24 : 22, 
    fontFamily: 'Inter-Bold', 
    letterSpacing: -0.5 
  },
  connectButton: {
    backgroundColor: 'rgba(139, 69, 19, 0.8)',
    borderWidth: 1,
    borderColor: '#f59e0b',
    paddingHorizontal: Platform.OS === 'ios' ? 12 : 10,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    borderRadius: Platform.OS === 'ios' ? 10 : 8,
    minWidth: Platform.OS === 'ios' ? 100 : 80,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#f59e0b',
    fontSize: Platform.OS === 'ios' ? 12 : 11,
    fontWeight: '600',
  },
  
  overviewSection: { 
    marginBottom: Platform.OS === 'ios' ? 32 : 28 
  },
  overviewCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
    borderRadius: 20, 
    padding: Platform.OS === 'ios' ? 24 : 20, 
    borderWidth: 1, 
    borderColor: 'rgba(125, 211, 252, 0.2)', 
    alignItems: 'center' 
  },
  overviewTitle: { 
    color: '#7dd3fc', 
    fontSize: Platform.OS === 'ios' ? 15 : 14, 
    fontFamily: 'Inter-Medium', 
    marginBottom: Platform.OS === 'ios' ? 12 : 8, 
    opacity: 0.9 
  },
  overviewScore: { 
    color: '#f59e0b', 
    fontSize: Platform.OS === 'ios' ? 48 : 44, 
    fontFamily: 'Inter-Bold', 
    fontWeight: '900', 
    marginBottom: Platform.OS === 'ios' ? 8 : 6 
  },
  overviewStatus: { 
    color: '#10b981', 
    fontSize: Platform.OS === 'ios' ? 17 : 16, 
    fontFamily: 'Inter-SemiBold', 
    marginBottom: Platform.OS === 'ios' ? 20 : 16 
  },
  overviewMetrics: { 
    flexDirection: 'row', 
    gap: Platform.OS === 'ios' ? 32 : 28 
  },
  overviewMetric: { 
    alignItems: 'center' 
  },
  metricLabel: { 
    color: '#7dd3fc', 
    fontSize: Platform.OS === 'ios' ? 13 : 12, 
    fontFamily: 'Inter-Regular', 
    opacity: 0.8, 
    marginBottom: Platform.OS === 'ios' ? 6 : 4 
  },
  metricValue: { 
    color: '#fff', 
    fontSize: Platform.OS === 'ios' ? 17 : 16, 
    fontFamily: 'Inter-Bold' 
  },
  section: { 
    marginBottom: Platform.OS === 'ios' ? 32 : 28 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: Platform.OS === 'ios' ? 16 : 14 
  },
  sectionTitle: { 
    color: '#fff', 
    fontSize: Platform.OS === 'ios' ? 20 : 18, 
    fontFamily: 'Inter-SemiBold', 
    letterSpacing: -0.3 
  },
  addButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: Platform.OS === 'ios' ? 6 : 4, 
    backgroundColor: 'rgba(245, 158, 11, 0.15)', 
    borderWidth: 1, 
    borderColor: '#f59e0b', 
    borderRadius: 16, 
    paddingHorizontal: Platform.OS === 'ios' ? 14 : 12, 
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    minHeight: Platform.OS === 'ios' ? 40 : 36,
  },
  addButtonText: { 
    color: '#f59e0b', 
    fontSize: Platform.OS === 'ios' ? 12 : 11, 
    fontFamily: 'Inter-Medium' 
  },
  goalsContainer: { 
    paddingRight: Platform.OS === 'ios' ? 16 : 12 
  },
  goalCard: { 
    width: Platform.OS === 'ios' ? 280 : 260, 
    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
    borderRadius: 16, 
    borderWidth: 1, 
    padding: Platform.OS === 'ios' ? 20 : 16, 
    marginRight: Platform.OS === 'ios' ? 16 : 12 
  },
  goalHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: Platform.OS === 'ios' ? 16 : 12 
  },
  goalInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: Platform.OS === 'ios' ? 8 : 6 
  },
  goalName: { 
    color: '#fff', 
    fontSize: Platform.OS === 'ios' ? 16 : 15, 
    fontFamily: 'Inter-SemiBold' 
  },
  priorityBadge: { 
    paddingHorizontal: Platform.OS === 'ios' ? 8 : 6, 
    paddingVertical: Platform.OS === 'ios' ? 4 : 3, 
    borderRadius: 10 
  },
  priorityText: { 
    fontSize: Platform.OS === 'ios' ? 10 : 9, 
    fontFamily: 'Inter-Bold', 
    letterSpacing: 0.5 
  },
  goalProgress: { 
    gap: Platform.OS === 'ios' ? 10 : 8 
  },
  progressHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  progressAmount: { 
    color: '#7dd3fc', 
    fontSize: Platform.OS === 'ios' ? 14 : 13, 
    fontFamily: 'Inter-Medium' 
  },
  progressPercentage: { 
    color: '#fff', 
    fontSize: Platform.OS === 'ios' ? 18 : 17, 
    fontFamily: 'Inter-Bold' 
  },
  progressBar: { 
    height: Platform.OS === 'ios' ? 6 : 5, 
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 3, 
    overflow: 'hidden' 
  },
  progressFill: { 
    height: '100%', 
    borderRadius: 3 
  },
  goalDeadline: { 
    color: '#7dd3fc', 
    fontSize: Platform.OS === 'ios' ? 11 : 10, 
    fontFamily: 'Inter-Regular', 
    opacity: 0.7 
  },
  transactionsContainer: { 
    gap: Platform.OS === 'ios' ? 12 : 10 
  },
  transactionCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
    borderRadius: 14, 
    padding: Platform.OS === 'ios' ? 16 : 14, 
    borderWidth: 1, 
    borderColor: 'rgba(125, 211, 252, 0.15)' 
  },
  transactionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: Platform.OS === 'ios' ? 10 : 8 
  },
  transactionInfo: { 
    flex: 1 
  },
  transactionDescription: { 
    color: '#fff', 
    fontSize: Platform.OS === 'ios' ? 15 : 14, 
    fontFamily: 'Inter-Medium', 
    marginBottom: Platform.OS === 'ios' ? 4 : 2 
  },
  transactionCategory: { 
    color: '#7dd3fc', 
    fontSize: Platform.OS === 'ios' ? 11 : 10, 
    fontFamily: 'Inter-Regular', 
    opacity: 0.7 
  },
  transactionAmount: { 
    alignItems: 'flex-end' 
  },
  amountText: { 
    fontSize: Platform.OS === 'ios' ? 16 : 15, 
    fontFamily: 'Inter-Bold', 
    marginBottom: Platform.OS === 'ios' ? 4 : 2 
  },
  transactionDate: { 
    color: '#7dd3fc', 
    fontSize: Platform.OS === 'ios' ? 10 : 9, 
    fontFamily: 'Inter-Regular', 
    opacity: 0.7 
  },
  viewAllButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: Platform.OS === 'ios' ? 6 : 4,
    paddingHorizontal: Platform.OS === 'ios' ? 12 : 8,
    paddingVertical: Platform.OS === 'ios' ? 8 : 6,
    backgroundColor: 'rgba(125, 211, 252, 0.1)',
    borderRadius: Platform.OS === 'ios' ? 10 : 8,
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.2)',
  },
  viewAllText: { 
    color: '#7dd3fc', 
    fontSize: Platform.OS === 'ios' ? 14 : 12, 
    fontWeight: '600',
  },
});

export default FVITracker; 