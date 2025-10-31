// src/theme/theme.js

/**
 * Enhanced Cyberpunk Theme System
 * Centralized theme configuration for consistent styling across the application
 */

export const theme = {
  // ==================== COLOR PALETTE ====================
  colors: {
    // Primary neon colors
    neon: {
      cyan: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee', // Primary cyan
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63',
      },
      fuchsia: {
        50: '#fdf4ff',
        100: '#fae8ff',
        200: '#f5d0fe',
        300: '#f0abfc',
        400: '#e879f9',
        500: '#d946ef', // Primary fuchsia
        600: '#c026d3',
        700: '#a21caf',
        800: '#86198f',
        900: '#701a75',
      },
      violet: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa', // Primary violet
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
      },
      emerald: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399', // Success green
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
      },
      rose: {
        50: '#fff1f2',
        100: '#ffe4e6',
        200: '#fecdd3',
        300: '#fda4af',
        400: '#fb7185',
        500: '#f43f5e', // Error/danger red
        600: '#e11d48',
        700: '#be123c',
        800: '#9f1239',
        900: '#881337',
      },
      amber: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24', // Warning yellow
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },
    },
    
    // Grayscale
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      850: '#1a202c',
      900: '#111827',
      925: '#0d1117',
      950: '#030712', // Deepest background
    },
  },

  // ==================== GRADIENTS ====================
  gradients: {
    primary: 'from-cyan-500 via-violet-500 to-fuchsia-600',
    secondary: 'from-violet-500 to-fuchsia-600',
    success: 'from-emerald-400 to-cyan-500',
    danger: 'from-rose-500 to-fuchsia-600',
    warning: 'from-amber-400 to-orange-500',
    neonGlow: 'from-cyan-400 via-fuchsia-400 to-violet-500',
    darkGlass: 'from-gray-900/90 to-gray-800/70',
  },

  // ==================== SHADOWS ====================
  shadows: {
    neonCyan: '0 0 20px rgba(34, 211, 238, 0.4)',
    neonCyanLg: '0 0 40px rgba(34, 211, 238, 0.5), 0 0 80px rgba(34, 211, 238, 0.2)',
    neonFuchsia: '0 0 20px rgba(217, 70, 239, 0.4)',
    neonFuchsiaLg: '0 0 40px rgba(217, 70, 239, 0.5), 0 0 80px rgba(217, 70, 239, 0.2)',
    neonViolet: '0 0 20px rgba(167, 139, 250, 0.4)',
    neonRose: '0 0 20px rgba(244, 63, 94, 0.4)',
    neonEmerald: '0 0 20px rgba(52, 211, 153, 0.4)',
    cardShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
    cardShadowHover: '0 20px 50px rgba(0, 0, 0, 0.7)',
    inset: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
  },

  // ==================== BORDERS ====================
  borders: {
    neonCyan: 'border-cyan-400/50',
    neonFuchsia: 'border-fuchsia-400/50',
    neonViolet: 'border-violet-400/50',
    neonRose: 'border-rose-500/50',
    neonEmerald: 'border-emerald-400/50',
    dark: 'border-gray-700/50',
    darkStrong: 'border-gray-700',
  },

  // ==================== BACKGROUNDS ====================
  backgrounds: {
    base: 'bg-gray-950',
    card: 'bg-gray-900/90',
    cardLight: 'bg-gray-800/60',
    glass: 'bg-gray-900/70 backdrop-blur-xl',
    glassLight: 'bg-gray-800/40 backdrop-blur-md',
    overlay: 'bg-black/70 backdrop-blur-sm',
    overlayStrong: 'bg-black/80 backdrop-blur-md',
  },

  // ==================== TEXT COLORS ====================
  text: {
    primary: 'text-white',
    secondary: 'text-gray-200',
    muted: 'text-gray-400',
    dimmed: 'text-gray-500',
    neonCyan: 'text-cyan-400',
    neonFuchsia: 'text-fuchsia-400',
    neonViolet: 'text-violet-400',
    neonRose: 'text-rose-500',
    neonEmerald: 'text-emerald-400',
    neonAmber: 'text-amber-400',
  },

  // ==================== COMPONENT STYLES ====================
  components: {
    button: {
      primary: 'bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white font-bold shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 transition-all duration-300',
      secondary: 'bg-gray-700/50 hover:bg-gray-700 text-gray-200 border border-gray-600 hover:border-cyan-500 transition-all duration-300',
      success: 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold shadow-lg shadow-emerald-500/30 transition-all duration-300',
      danger: 'bg-gradient-to-r from-rose-500 to-fuchsia-500 hover:from-rose-400 hover:to-fuchsia-400 text-white font-bold shadow-lg shadow-rose-500/30 transition-all duration-300',
      ghost: 'bg-transparent hover:bg-gray-800/80 text-gray-300 hover:text-white border border-transparent hover:border-cyan-400/50 transition-all duration-300',
      icon: 'p-2 rounded-full bg-gray-800/60 hover:bg-gray-700/80 border border-gray-700/50 hover:border-cyan-400/50 text-gray-300 hover:text-cyan-400 transition-all duration-300',
    },
    
    input: {
      base: 'w-full px-4 py-3 bg-gray-700/70 text-white border border-gray-600/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-fuchsia-500/50 focus:border-cyan-400 hover:border-fuchsia-400 placeholder-gray-400 transition-all duration-300',
      error: 'border-rose-500 focus:ring-rose-500/50',
    },
    
    card: {
      base: 'bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl',
      hover: 'hover:shadow-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300',
      interactive: 'cursor-pointer transform hover:scale-[1.02] hover:shadow-cyan-500/30 hover:border-cyan-400/70 transition-all duration-300',
    },
    
    modal: {
      backdrop: 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50',
      container: 'bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl',
    },
    
    badge: {
      success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-full px-3 py-1 text-xs font-semibold',
      error: 'bg-rose-500/20 text-rose-400 border border-rose-500/50 rounded-full px-3 py-1 text-xs font-semibold',
      warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/50 rounded-full px-3 py-1 text-xs font-semibold',
      info: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-full px-3 py-1 text-xs font-semibold',
    },
  },

  // ==================== ANIMATIONS ====================
  animations: {
    fadeIn: 'animate-fade-in',
    fadeOut: 'animate-fade-out',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    bounce: 'animate-bounce',
    neonPulse: 'animate-neon-pulse',
    gradientShift: 'animate-gradient-shift',
  },

  // ==================== SPACING ====================
  spacing: {
    section: 'p-6 md:p-8',
    card: 'p-4 sm:p-6',
    cardLg: 'p-6 sm:p-8 md:p-10',
  },

  // ==================== BORDER RADIUS ====================
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  },

  // ==================== TRANSITIONS ====================
  transitions: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },

  // ==================== BREAKPOINTS (for reference) ====================
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get a complete button class string
 */
export const getButtonClasses = (variant = 'primary', size = 'md', className = '') => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-base rounded-xl',
    lg: 'px-6 py-3 text-lg rounded-xl',
    icon: 'p-2 rounded-full',
  };
  
  return `${baseClasses} ${sizeClasses[size]} ${theme.components.button[variant]} ${className}`;
};

/**
 * Get a complete card class string
 */
export const getCardClasses = (variant = 'base', className = '') => {
  const variants = {
    base: theme.components.card.base,
    hover: `${theme.components.card.base} ${theme.components.card.hover}`,
    interactive: `${theme.components.card.base} ${theme.components.card.interactive}`,
  };
  
  return `${variants[variant]} ${className}`;
};

/**
 * Get neon glow effect class
 */
export const getNeonGlow = (color = 'cyan', intensity = 'normal') => {
  const glowMap = {
    cyan: intensity === 'strong' ? 'shadow-[0_0_30px_rgba(34,211,238,0.6)]' : 'shadow-[0_0_20px_rgba(34,211,238,0.4)]',
    fuchsia: intensity === 'strong' ? 'shadow-[0_0_30px_rgba(217,70,239,0.6)]' : 'shadow-[0_0_20px_rgba(217,70,239,0.4)]',
    violet: intensity === 'strong' ? 'shadow-[0_0_30px_rgba(167,139,250,0.6)]' : 'shadow-[0_0_20px_rgba(167,139,250,0.4)]',
    rose: intensity === 'strong' ? 'shadow-[0_0_30px_rgba(244,63,94,0.6)]' : 'shadow-[0_0_20px_rgba(244,63,94,0.4)]',
    emerald: intensity === 'strong' ? 'shadow-[0_0_30px_rgba(52,211,153,0.6)]' : 'shadow-[0_0_20px_rgba(52,211,153,0.4)]',
  };
  
  return glowMap[color] || glowMap.cyan;
};

/**
 * Create a gradient text class
 */
export const getGradientText = (gradient = 'primary') => {
  return `text-transparent bg-clip-text bg-gradient-to-r ${theme.gradients[gradient]}`;
};

export default theme;