import { OVRScore } from '../types/ovr';

export interface Friend {
  id: string;
  name: string;
  ovrScore: number;
  rank: number;
  change: number;
  avatar?: string;
  isUser: boolean;
  subScores: {
    biological: number;
    emotional: number;
    environmental: number;
    financial: number;
  };
  streak?: number;
  badges?: string[];
  lastActive?: Date;
}

export interface LeaderboardData {
  friends: Friend[];
  userRank: number;
  userOVR: number;
  timeRange: 'daily' | 'weekly' | 'monthly';
  lastUpdated: Date;
}

class FriendService {
  private friends: Friend[] = [];
  private userOVR: number = 87;
  private userRank: number = 4;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    this.friends = [
      {
        id: '1',
        name: 'Sarah Chen',
        ovrScore: 94,
        rank: 1,
        change: 2.1,
        isUser: false,
        subScores: { biological: 92, emotional: 96, environmental: 95, financial: 91 },
        streak: 12,
        badges: ['weekly_top', 'streak_7'],
      },
      {
        id: '2',
        name: 'Marcus Rodriguez',
        ovrScore: 91,
        rank: 2,
        change: -0.8,
        isUser: false,
        subScores: { biological: 89, emotional: 93, environmental: 88, financial: 94 },
        streak: 8,
        badges: ['improvement'],
      },
      {
        id: '3',
        name: 'Emma Thompson',
        ovrScore: 89,
        rank: 3,
        change: 1.5,
        isUser: false,
        subScores: { biological: 87, emotional: 91, environmental: 92, financial: 86 },
        streak: 5,
      },
      {
        id: 'user',
        name: 'James Wilson',
        ovrScore: this.userOVR,
        rank: this.userRank,
        change: 1.2,
        isUser: true,
        subScores: { biological: 87, emotional: 83, environmental: 88, financial: 75 },
        streak: 3,
      },
      {
        id: '4',
        name: 'Alex Kim',
        ovrScore: 85,
        rank: 5,
        change: -1.1,
        isUser: false,
        subScores: { biological: 84, emotional: 86, environmental: 85, financial: 83 },
      },
      {
        id: '5',
        name: 'Priya Patel',
        ovrScore: 82,
        rank: 6,
        change: 0.5,
        isUser: false,
        subScores: { biological: 80, emotional: 85, environmental: 81, financial: 82 },
        streak: 2,
      },
      {
        id: '6',
        name: 'David Park',
        ovrScore: 79,
        rank: 7,
        change: -0.3,
        isUser: false,
        subScores: { biological: 78, emotional: 81, environmental: 77, financial: 80 },
      },
      {
        id: '7',
        name: 'Lisa Anderson',
        ovrScore: 76,
        rank: 8,
        change: 2.8,
        isUser: false,
        subScores: { biological: 75, emotional: 78, environmental: 76, financial: 74 },
        badges: ['improvement'],
      },
    ];
  }

  async getLeaderboard(timeRange: 'daily' | 'weekly' | 'monthly' = 'weekly'): Promise<LeaderboardData> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Update user data with current OVR
    const userFriend = this.friends.find(f => f.isUser);
    if (userFriend) {
      userFriend.ovrScore = this.userOVR;
      userFriend.rank = this.userRank;
    }

    // Sort by OVR score (descending)
    const sortedFriends = [...this.friends].sort((a, b) => b.ovrScore - a.ovrScore);
    
    // Update ranks
    sortedFriends.forEach((friend, index) => {
      friend.rank = index + 1;
    });

    return {
      friends: sortedFriends,
      userRank: this.userRank,
      userOVR: this.userOVR,
      timeRange,
      lastUpdated: new Date(),
    };
  }

  async getTopFriends(limit: number = 3): Promise<Friend[]> {
    const leaderboard = await this.getLeaderboard();
    return leaderboard.friends.slice(0, limit);
  }

  async updateUserOVR(newOVR: number): Promise<void> {
    this.userOVR = newOVR;
    
    // Recalculate rankings
    const leaderboard = await this.getLeaderboard();
    const userFriend = leaderboard.friends.find(f => f.isUser);
    if (userFriend) {
      this.userRank = userFriend.rank;
    }
  }

  async addFriend(friendData: Omit<Friend, 'id' | 'isUser' | 'rank'>): Promise<Friend> {
    const newFriend: Friend = {
      ...friendData,
      id: Date.now().toString(),
      isUser: false,
      rank: this.friends.length + 1,
    };
    
    this.friends.push(newFriend);
    return newFriend;
  }

  async removeFriend(friendId: string): Promise<void> {
    this.friends = this.friends.filter(f => f.id !== friendId);
  }

  async getFriendSuggestions(): Promise<Friend[]> {
    // Mock friend suggestions
    return [
      {
        id: 'suggested1',
        name: 'Michael Chang',
        ovrScore: 88,
        rank: 0,
        change: 0,
        isUser: false,
        subScores: { biological: 86, emotional: 90, environmental: 89, financial: 87 },
      },
      {
        id: 'suggested2',
        name: 'Rachel Green',
        ovrScore: 85,
        rank: 0,
        change: 0,
        isUser: false,
        subScores: { biological: 83, emotional: 87, environmental: 86, financial: 84 },
      },
    ];
  }

  async checkForMilestones(): Promise<string[]> {
    const milestones: string[] = [];
    
    // Check for rank improvements
    if (this.userRank <= 3) {
      milestones.push('top_3_achievement');
    }
    
    // Check for OVR improvements
    if (this.userOVR >= 90) {
      milestones.push('elite_ovr');
    }
    
    // Check for streaks
    const userFriend = this.friends.find(f => f.isUser);
    if (userFriend?.streak && userFriend.streak >= 7) {
      milestones.push('week_streak');
    }
    
    return milestones;
  }

  async getFriendStats(friendId: string): Promise<{
    totalFriends: number;
    averageOVR: number;
    topRank: number;
    improvementRate: number;
  }> {
    const totalFriends = this.friends.length - 1; // Exclude user
    const averageOVR = this.friends
      .filter(f => !f.isUser)
      .reduce((sum, f) => sum + f.ovrScore, 0) / totalFriends;
    
    return {
      totalFriends,
      averageOVR: Math.round(averageOVR),
      topRank: 1,
      improvementRate: 12.5, // Mock improvement rate
    };
  }

  // Real-time updates simulation
  startRealTimeUpdates(callback: (data: LeaderboardData) => void): () => void {
    const interval = setInterval(async () => {
      // Simulate real-time score changes
      this.friends.forEach(friend => {
        if (!friend.isUser) {
          // Random small changes to simulate real-time updates
          const change = (Math.random() - 0.5) * 2;
          friend.ovrScore = Math.max(50, Math.min(99, friend.ovrScore + change));
          friend.change = change;
        }
      });
      
      const updatedData = await this.getLeaderboard();
      callback(updatedData);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }
}

export const friendService = new FriendService();
export default FriendService;
