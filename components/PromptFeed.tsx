import React, { useEffect, useState } from 'react';
import { View, Animated, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Lightbulb, TrendingUp, Heart, Zap, Target, CheckCircle } from 'lucide-react-native';
import { DesignSystem, createGlassMorphism } from '../constants/design';

const { width } = Dimensions.get('window');

interface Prompt {
  id: string;
  type: 'insight' | 'suggestion' | 'achievement' | 'reminder' | 'tip';
  title: string;
  message: string;
  action?: string;
  onAction?: () => void;
  dismissed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  timestamp: number;
}

interface PromptFeedProps {
  prompts?: Prompt[];
  maxVisible?: number;
  onDismiss?: (promptId: string) => void;
  onAction?: (promptId: string) => void;
}

export default function PromptFeed({ 
  prompts = [], 
  maxVisible = 3, 
  onDismiss,
  onAction 
}: PromptFeedProps) {
  const [visiblePrompts, setVisiblePrompts] = useState<Prompt[]>([]);
  const [animations, setAnimations] = useState<Map<string, Animated.Value>>(new Map());

  // Generate sample prompts if none provided
  useEffect(() => {
    try {
      const allPrompts = prompts.length === 0 ? generateSamplePrompts() : prompts;
      const newPrompts = allPrompts
        .filter(p => !p.dismissed)
        .sort((a, b) => {
          // Sort by priority first, then by timestamp
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority || 'low'];
          const bPriority = priorityOrder[b.priority || 'low'];
          if (aPriority !== bPriority) return bPriority - aPriority;
          return b.timestamp - a.timestamp;
        })
        .slice(0, maxVisible);

      setVisiblePrompts(prev => {
        const same = prev.length === newPrompts.length &&
          prev.every((p, i) => p.id === newPrompts[i].id);
        return same ? prev : newPrompts;
      });
    } catch (error) {
      console.error('Error processing prompts:', error);
      setVisiblePrompts([]);
    }
  }, [prompts, maxVisible]);

  // Animate new prompts
  useEffect(() => {
    setAnimations(prevMap => {
      const newMap = new Map(prevMap);
      visiblePrompts.forEach(prompt => {
        if (!newMap.has(prompt.id)) {
          const animValue = new Animated.Value(0);
          newMap.set(prompt.id, animValue);

          Animated.spring(animValue, {
            toValue: 1,
            tension: 80,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      });
      return newMap;
    });
  }, [visiblePrompts]);

  const handleDismiss = (promptId: string) => {
    try {
      const animValue = animations.get(promptId);
      if (animValue) {
        Animated.timing(animValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          if (onDismiss && typeof onDismiss === 'function') {
            const result = onDismiss(promptId);
            // Ensure the callback doesn't return a string that could be rendered
            if (typeof result === 'string') {
              console.warn('onDismiss callback returned a string, ignoring:', result);
            }
          }
        });
      } else {
        if (onDismiss && typeof onDismiss === 'function') {
          const result = onDismiss(promptId);
          // Ensure the callback doesn't return a string that could be rendered
          if (typeof result === 'string') {
            console.warn('onDismiss callback returned a string, ignoring:', result);
          }
        }
      }
    } catch (error) {
      console.error('Error in handleDismiss:', error);
    }
    return;
  };

  const handleAction = (prompt: Prompt) => {
    try {
      if (prompt.onAction && typeof prompt.onAction === 'function') {
        const result = prompt.onAction();
        // Ensure the callback doesn't return a string that could be rendered
        if (typeof result === 'string') {
          console.warn('onAction callback returned a string, ignoring:', result);
        }
      }
      if (onAction && typeof onAction === 'function') {
        const result = onAction(prompt.id);
        // Ensure the callback doesn't return a string that could be rendered
        if (typeof result === 'string') {
          console.warn('onAction callback returned a string, ignoring:', result);
        }
      }
    } catch (error) {
      console.error('Error in handleAction:', error);
    }
    return;
  };

  const getPromptIcon = (type: Prompt['type']) => {
    try {
      const iconProps = { size: 20, strokeWidth: 1.5 };
      switch (type) {
        case 'insight': return <Lightbulb {...iconProps} color="#a855f7" />;
        case 'suggestion': return <TrendingUp {...iconProps} color="#10b981" />;
        case 'achievement': return <CheckCircle {...iconProps} color="#fbbf24" />;
        case 'reminder': return <Target {...iconProps} color="#3b82f6" />;
        case 'tip': return <Zap {...iconProps} color="#f59e0b" />;
        default: return <Lightbulb {...iconProps} color="#7dd3fc" />;
      }
    } catch (error) {
      console.error('Error in getPromptIcon:', error);
      return <Lightbulb size={20} strokeWidth={1.5} color="#7dd3fc" />;
    }
  };

  const getPromptGradient = (type: Prompt['type']): [string, string] => {
    try {
      switch (type) {
        case 'insight': return ['rgba(168, 85, 247, 0.1)', 'rgba(168, 85, 247, 0.05)'];
        case 'suggestion': return ['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)'];
        case 'achievement': return ['rgba(251, 191, 36, 0.1)', 'rgba(251, 191, 36, 0.05)'];
        case 'reminder': return ['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)'];
        case 'tip': return ['rgba(245, 158, 11, 0.1)', 'rgba(245, 158, 11, 0.05)'];
        default: return ['rgba(125, 211, 252, 0.1)', 'rgba(125, 211, 252, 0.05)'];
      }
    } catch (error) {
      console.error('Error in getPromptGradient:', error);
      return ['rgba(125, 211, 252, 0.1)', 'rgba(125, 211, 252, 0.05)'];
    }
  };

  const getPriorityColor = (priority: Prompt['priority']) => {
    try {
      switch (priority) {
        case 'high': return '#ef4444';
        case 'medium': return '#f59e0b';
        case 'low': return '#10b981';
        default: return '#7dd3fc';
      }
    } catch (error) {
      console.error('Error in getPriorityColor:', error);
      return '#7dd3fc';
    }
  };

  if (visiblePrompts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No prompts at the moment</Text>
        <Text style={styles.emptySubtext}>Check back later for insights and tips</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {visiblePrompts.map((prompt, index) => {
        try {
          const animValue = animations.get(prompt.id) || new Animated.Value(1);
          return (
            <Animated.View
              key={`prompt-${typeof prompt.id === 'string' ? prompt.id : index}-${index}`}
              style={[
                styles.promptContainer,
                { 
                  transform: [{ scale: animValue }],
                  opacity: animValue
                }
              ]}
            >
                         <LinearGradient
               colors={(() => {
                 try {
                   return getPromptGradient(prompt.type);
                 } catch (error) {
                   console.error('Error getting prompt gradient:', error);
                   return ['rgba(125, 211, 252, 0.1)', 'rgba(125, 211, 252, 0.05)'];
                 }
               })()}
               style={styles.promptBackground}
             />
            
            <View style={styles.promptContent}>
              <View style={styles.promptHeader}>
                                 <View style={styles.promptIconContainer}>
                   {(() => {
                     try {
                       const icon = getPromptIcon(prompt.type);
                       return icon || <Lightbulb size={20} strokeWidth={1.5} color="#7dd3fc" />;
                     } catch (error) {
                       console.error('Error rendering prompt icon:', error);
                       return <Lightbulb size={20} strokeWidth={1.5} color="#7dd3fc" />;
                     }
                   })()}
                 </View>
                <View style={styles.promptTextContainer}>
                  <Text style={styles.promptTitle}>{typeof prompt.title === 'string' ? prompt.title : ''}</Text>
                  <Text style={styles.promptMessage}>{typeof prompt.message === 'string' ? prompt.message : ''}</Text>
                </View>
                <TouchableOpacity
                  style={styles.dismissButton}
                  onPress={() => {
                    try {
                      if (typeof prompt.id === 'string') {
                        handleDismiss(prompt.id);
                      }
                    } catch (error) {
                      console.error('Error in dismiss onPress:', error);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <X size={16} color={DesignSystem.colors.neutral.silver} />
                </TouchableOpacity>
              </View>
              
              {prompt.action && typeof prompt.action === 'string' && prompt.action.trim() && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    try {
                      if (prompt && typeof prompt.id === 'string') {
                        handleAction(prompt);
                      }
                    } catch (error) {
                      console.error('Error in action onPress:', error);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionButtonText}>{prompt.action}</Text>
                </TouchableOpacity>
              )}
              
                             {prompt.priority && (
                 <View style={[styles.priorityIndicator, { 
                   backgroundColor: (() => {
                     try {
                       return getPriorityColor(prompt.priority);
                     } catch (error) {
                       console.error('Error getting priority color:', error);
                       return '#7dd3fc';
                     }
                   })()
                 }]} />
               )}
            </View>
          </Animated.View>
        );
        } catch (error) {
          console.error('Error rendering prompt:', error);
          return null;
        }
      })}
    </View>
  );
}

// Generate sample prompts for demonstration
function generateSamplePrompts(): Prompt[] {
  try {
    const now = Date.now();
    return [
      {
        id: 'insight-1',
        type: 'insight',
        title: 'Sleep Pattern Detected',
        message: 'Your sleep quality improves by 23% when you go to bed before 11 PM.',
        action: 'View Details',
        priority: 'medium',
        timestamp: now - 1000 * 60 * 30, // 30 minutes ago
      },
      {
        id: 'suggestion-1',
        type: 'suggestion',
        title: 'Hydration Reminder',
        message: 'You\'ve been active for 2 hours. Consider drinking some water.',
        action: 'Log Water',
        priority: 'low',
        timestamp: now - 1000 * 60 * 15, // 15 minutes ago
      },
      {
        id: 'achievement-1',
        type: 'achievement',
        title: 'Weekly Goal Achieved!',
        message: 'You\'ve completed 5 out of 5 daily wellness goals this week.',
        action: 'Celebrate',
        priority: 'high',
        timestamp: now - 1000 * 60 * 5, // 5 minutes ago
      },
    ];
  } catch (error) {
    console.error('Error generating sample prompts:', error);
    return [];
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: DesignSystem.spacing.lg,
    gap: DesignSystem.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: DesignSystem.spacing.xl,
  },
  emptyText: {
    color: DesignSystem.colors.neutral.silver,
    ...DesignSystem.typography.body1,
    marginBottom: DesignSystem.spacing.xs,
  },
  emptySubtext: {
    color: DesignSystem.colors.neutral.platinum,
    ...DesignSystem.typography.caption,
  },
  promptContainer: {
    position: 'relative',
    borderRadius: DesignSystem.radius.lg,
    overflow: 'hidden',
    ...DesignSystem.shadows.soft,
  },
  promptBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  promptContent: {
    padding: DesignSystem.spacing.lg,
    borderWidth: 1,
    borderColor: DesignSystem.colors.alpha[8],
    borderRadius: DesignSystem.radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: DesignSystem.spacing.md,
  },
  promptIconContainer: {
    width: 40,
    height: 40,
    borderRadius: DesignSystem.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  promptTextContainer: {
    flex: 1,
  },
  promptTitle: {
    color: DesignSystem.colors.neutral.pearl,
    ...DesignSystem.typography.body1,
    fontWeight: '600',
    marginBottom: DesignSystem.spacing.xs,
  },
  promptMessage: {
    color: DesignSystem.colors.neutral.platinum,
    ...DesignSystem.typography.body2,
    lineHeight: 20,
  },
  dismissButton: {
    padding: DesignSystem.spacing.xs,
    marginTop: -DesignSystem.spacing.xs,
    marginRight: -DesignSystem.spacing.xs,
  },
  actionButton: {
    backgroundColor: DesignSystem.colors.primary.cyan,
    paddingVertical: DesignSystem.spacing.sm,
    paddingHorizontal: DesignSystem.spacing.md,
    borderRadius: DesignSystem.radius.md,
    alignSelf: 'flex-start',
    marginTop: DesignSystem.spacing.md,
  },
  actionButtonText: {
    color: '#000',
    ...DesignSystem.typography.caption,
    fontWeight: '600',
  },
  priorityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    borderTopLeftRadius: DesignSystem.radius.lg,
    borderBottomLeftRadius: DesignSystem.radius.lg,
  },
});


