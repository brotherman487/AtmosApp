// Atmos Luxury Design System
// Premium wearable UI aesthetic - minimalistic, high-end, cinematic

export const DesignSystem = {
  // Typography - Premium, cinematic feel
  typography: {
    display: {
      fontFamily: 'Inter-Light',
      fontSize: 48,
      lineHeight: 52,
      letterSpacing: -1.2,
      fontWeight: '300',
    },
    heading1: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 32,
      lineHeight: 36,
      letterSpacing: -0.8,
      fontWeight: '600',
    },
    heading2: {
      fontFamily: 'Inter-Medium',
      fontSize: 24,
      lineHeight: 28,
      letterSpacing: -0.5,
      fontWeight: '500',
    },
    heading3: {
      fontFamily: 'Inter-Medium',
      fontSize: 20,
      lineHeight: 24,
      letterSpacing: -0.3,
      fontWeight: '500',
    },
    body1: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      lineHeight: 22,
      letterSpacing: 0,
      fontWeight: '400',
    },
    body2: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
      fontWeight: '400',
    },
    caption: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.3,
      fontWeight: '500',
    },
    micro: {
      fontFamily: 'Inter-Medium',
      fontSize: 10,
      lineHeight: 12,
      letterSpacing: 0.5,
      fontWeight: '500',
    },
  },

  // Color Palette - Sophisticated, minimal
  colors: {
    // Primary Brand Colors
    primary: {
      gold: '#f59e0b',      // Atmos Gold
      cyan: '#7dd3fc',      // Data Cyan
      emerald: '#10b981',   // Success Green
      crimson: '#ef4444',   // Alert Red
    },

    // Neutrals - Modern sexy gray aesthetic
    neutral: {
      space: '#0a0a0a',     // Deep charcoal background
      void: '#161616',      // Rich gray secondary
      nebula: '#1f1f1f',    // Warm charcoal tertiary
      slate: '#2a2a2a',     // Card backgrounds
      steel: '#404040',     // Borders
      silver: '#8a8a8a',    // Secondary text
      platinum: '#e0e0e0',  // Primary text
      pearl: '#f5f5f5',     // Accent text
    },

    // Semantic Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#7dd3fc',

    // Transparency Layers
    alpha: {
      5: 'rgba(255, 255, 255, 0.05)',
      8: 'rgba(255, 255, 255, 0.08)',
      10: 'rgba(255, 255, 255, 0.10)',
      15: 'rgba(255, 255, 255, 0.15)',
      20: 'rgba(255, 255, 255, 0.20)',
      25: 'rgba(255, 255, 255, 0.25)',
    },
  },

  // Spacing System - Consistent rhythm
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 56,
    '7xl': 64,
    '8xl': 80,
  },

  // Border Radius - Soft, modern curves
  radius: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },

  // Shadows - Subtle depth
  shadows: {
    soft: {
      boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      elevation: 2,
    },
    medium: {
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
      elevation: 4,
    },
    strong: {
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
      elevation: 8,
    },
  },

  // Gradients - Modern sexy gray backgrounds
  gradients: {
    primary: ['#0a0a0a', '#161616', '#1f1f1f'],
    card: ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)'],
    accent: ['rgba(125, 211, 252, 0.15)', 'rgba(125, 211, 252, 0.08)', 'transparent'],
    success: ['rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0.05)', 'transparent'],
    warning: ['rgba(245, 158, 11, 0.15)', 'rgba(245, 158, 11, 0.05)', 'transparent'],
    sophisticated: ['#0a0a0a', '#161616', '#2a2a2a'], // Deep to lighter charcoal
    metallic: ['#1a1a1a', '#2d2d2d', '#404040'], // Metallic gray progression
  },

  // Animation Durations - Smooth, luxury feel
  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },

  // Component Sizes
  components: {
    button: {
      height: {
        sm: 36,
        md: 44,
        lg: 52,
      },
      padding: {
        sm: { horizontal: 16, vertical: 8 },
        md: { horizontal: 20, vertical: 12 },
        lg: { horizontal: 24, vertical: 16 },
      },
    },
    card: {
      padding: {
        sm: 16,
        md: 20,
        lg: 24,
      },
    },
  },
} as const;

// Utility functions for common design patterns
export const createGlassMorphism = (opacity = 0.08) => ({
  backgroundColor: `rgba(255, 255, 255, ${opacity})`,
  borderWidth: 1,
  borderColor: `rgba(255, 255, 255, ${Math.min(opacity * 2, 0.15)})`,
  backdropFilter: 'blur(20px)', // Note: Limited support in React Native
});

export const createMetallicCard = (opacity = 0.06) => ({
  backgroundColor: `rgba(255, 255, 255, ${opacity})`,
  borderWidth: 1,
  borderColor: `rgba(160, 160, 160, 0.15)`,
  backdropFilter: 'blur(15px)',
});

export const createNeumorphism = (isPressed = false) => ({
  backgroundColor: DesignSystem.colors.neutral.slate,
  borderRadius: DesignSystem.radius.xl,
  ...(isPressed ? {
    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  } : {
    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.2)',
  }),
});

export const createPulseAnimation = (scale = 1.05) => ({
  transform: [{ scale }],
});

// Export type for TypeScript support
export type DesignSystemType = typeof DesignSystem;
