import { FinancialGoal } from '../types/ovr';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
  merchant?: string;
}

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
}

interface FinancialMetrics {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  emergencyFund: number;
  debtToIncomeRatio: number;
  creditScore?: number;
  investmentPortfolio?: number;
}

interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

class FinancialService {
  private static instance: FinancialService;
  private apiKey: string = '';
  private baseUrl: string = 'https://api.plaid.com';
  private transactions: Transaction[] = [];
  private budgets: Budget[] = [];
  private lastUpdate: number = 0;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes

  static getInstance(): FinancialService {
    if (!FinancialService.instance) {
      FinancialService.instance = new FinancialService();
    }
    return FinancialService.instance;
  }

  // Set API key (you'll need to get one from Plaid or similar service)
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  // Get financial metrics
  async getFinancialMetrics(): Promise<FinancialMetrics> {
    try {
      if (!this.apiKey) {
        return this.getMockFinancialMetrics();
      }

      // In a real implementation, you'd fetch from Plaid API
      // For now, we'll use mock data
      return this.getMockFinancialMetrics();
    } catch (error) {
      console.error('Error fetching financial metrics:', error);
      return this.getMockFinancialMetrics();
    }
  }

  // Get recent transactions
  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    try {
      if (!this.apiKey) {
        return this.getMockTransactions(limit);
      }

      // In a real implementation, you'd fetch from Plaid API
      return this.getMockTransactions(limit);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return this.getMockTransactions(limit);
    }
  }

  // Get spending by category
  async getSpendingByCategory(period: 'week' | 'month' = 'month'): Promise<SpendingCategory[]> {
    try {
      const transactions = await this.getRecentTransactions(100);
      const expenses = transactions.filter(t => t.type === 'expense');
      
      const categoryMap = new Map<string, number>();
      let totalSpent = 0;

      expenses.forEach(transaction => {
        const current = categoryMap.get(transaction.category) || 0;
        categoryMap.set(transaction.category, current + transaction.amount);
        totalSpent += transaction.amount;
      });

      const categories: SpendingCategory[] = [];
      categoryMap.forEach((amount, category) => {
        categories.push({
          category,
          amount,
          percentage: (amount / totalSpent) * 100,
          trend: this.getRandomTrend(),
        });
      });

      return categories.sort((a, b) => b.amount - a.amount);
    } catch (error) {
      console.error('Error calculating spending by category:', error);
      return this.getMockSpendingCategories();
    }
  }

  // Get budgets
  async getBudgets(): Promise<Budget[]> {
    try {
      if (!this.apiKey) {
        return this.getMockBudgets();
      }

      return this.getMockBudgets();
    } catch (error) {
      console.error('Error fetching budgets:', error);
      return this.getMockBudgets();
    }
  }

  // Add a transaction (for manual entry)
  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };

    this.transactions.push(newTransaction);
    return newTransaction;
  }

  // Create a budget
  async createBudget(budget: Omit<Budget, 'id'>): Promise<Budget> {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
    };

    this.budgets.push(newBudget);
    return newBudget;
  }

  // Calculate financial wellness score
  calculateFinancialScore(metrics: FinancialMetrics): number {
    let score = 50; // Base score

    // Savings rate impact (0-25 points)
    if (metrics.savingsRate >= 20) score += 25;
    else if (metrics.savingsRate >= 15) score += 20;
    else if (metrics.savingsRate >= 10) score += 15;
    else if (metrics.savingsRate >= 5) score += 10;
    else if (metrics.savingsRate >= 0) score += 5;

    // Emergency fund impact (0-20 points)
    const emergencyFundMonths = metrics.emergencyFund / (metrics.monthlyExpenses || 1);
    if (emergencyFundMonths >= 6) score += 20;
    else if (emergencyFundMonths >= 3) score += 15;
    else if (emergencyFundMonths >= 1) score += 10;

    // Debt to income ratio impact (0-15 points)
    if (metrics.debtToIncomeRatio <= 0.2) score += 15;
    else if (metrics.debtToIncomeRatio <= 0.3) score += 10;
    else if (metrics.debtToIncomeRatio <= 0.4) score += 5;

    // Credit score impact (0-10 points)
    if (metrics.creditScore && metrics.creditScore >= 750) score += 10;
    else if (metrics.creditScore && metrics.creditScore >= 700) score += 7;
    else if (metrics.creditScore && metrics.creditScore >= 650) score += 5;

    return Math.min(100, Math.max(0, score));
  }

  private getMockFinancialMetrics(): FinancialMetrics {
    const baseIncome = 5000;
    const baseExpenses = 3500;
    const savingsRate = ((baseIncome - baseExpenses) / baseIncome) * 100;

    return {
      totalBalance: 15000 + Math.random() * 10000,
      monthlyIncome: baseIncome + Math.random() * 1000 - 500,
      monthlyExpenses: baseExpenses + Math.random() * 800 - 400,
      savingsRate: Math.max(0, savingsRate + Math.random() * 10 - 5),
      emergencyFund: 8000 + Math.random() * 5000,
      debtToIncomeRatio: 0.25 + Math.random() * 0.2,
      creditScore: 700 + Math.random() * 100,
      investmentPortfolio: 25000 + Math.random() * 15000,
    };
  }

  private getMockTransactions(limit: number): Transaction[] {
    const categories = [
      'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
      'Healthcare', 'Utilities', 'Housing', 'Education', 'Travel'
    ];

    const merchants = [
      'Starbucks', 'Uber', 'Amazon', 'Netflix', 'CVS', 'Target',
      'Whole Foods', 'Shell', 'Apple Store', 'Airbnb'
    ];

    const transactions: Transaction[] = [];
    const now = new Date();

    for (let i = 0; i < limit; i++) {
      const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const isExpense = Math.random() > 0.2; // 80% chance of expense
      const amount = isExpense ? 
        Math.random() * 200 + 10 : 
        Math.random() * 5000 + 2000;

      transactions.push({
        id: `txn_${Date.now()}_${i}`,
        amount: Math.round(amount * 100) / 100,
        category: categories[Math.floor(Math.random() * categories.length)],
        description: `${isExpense ? 'Payment to' : 'Payment from'} ${merchants[Math.floor(Math.random() * merchants.length)]}`,
        date: date.toISOString().split('T')[0],
        type: isExpense ? 'expense' : 'income',
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
      });
    }

    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private getMockBudgets(): Budget[] {
    const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment'];
    const budgets: Budget[] = [];

    categories.forEach((category, index) => {
      const limit = [800, 400, 300, 200][index];
      const spent = limit * (0.3 + Math.random() * 0.7); // 30-100% of budget

      budgets.push({
        id: `budget_${index}`,
        category,
        limit,
        spent: Math.round(spent * 100) / 100,
        period: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      });
    });

    return budgets;
  }

  private getMockSpendingCategories(): SpendingCategory[] {
    return [
      { category: 'Food & Dining', amount: 650, percentage: 35, trend: 'up' },
      { category: 'Transportation', amount: 320, percentage: 17, trend: 'stable' },
      { category: 'Shopping', amount: 280, percentage: 15, trend: 'down' },
      { category: 'Entertainment', amount: 200, percentage: 11, trend: 'up' },
      { category: 'Healthcare', amount: 180, percentage: 10, trend: 'stable' },
      { category: 'Utilities', amount: 150, percentage: 8, trend: 'stable' },
      { category: 'Other', amount: 70, percentage: 4, trend: 'down' },
    ];
  }

  private getRandomTrend(): 'up' | 'down' | 'stable' {
    const rand = Math.random();
    if (rand < 0.33) return 'up';
    if (rand < 0.66) return 'down';
    return 'stable';
  }
}

export const financialService = FinancialService.getInstance();
