/**
 * Google Drive Inspired Theme Configuration
 * Centralized theme system for consistent styling across the application
 */

export const theme = {
  // ==================== COLOR PALETTE ====================
  colors: {
    // Primary - Google Drive Blue
    primary: {
      50: '#e8f0fe',
      100: '#d2e3fc',
      200: '#aecbfa',
      300: '#8ab4f8',
      400: '#669df6',
      500: '#4285f4',  // Main blue
      600: '#1a73e8',  // Darker blue
      700: '#1967d2',
      800: '#185abc',
      900: '#174ea6',
    },

    // Gray Scale
    gray: {
      50: '#f8f9fa',   // Very light background
      100: '#f1f3f4',  // Light background
      200: '#e8eaed',  // Border
      300: '#dadce0',  // Lighter border
      400: '#bdc1c6',  // Disabled text
      500: '#9aa0a6',  // Secondary text
      600: '#80868b',  // Secondary text darker
      700: '#5f6368',  // Primary text light
      800: '#3c4043',  // Primary text
      900: '#202124',  // Primary text dark
    },

    // Semantic Colors
    success: {
      light: '#e6f4ea',
      main: '#1e8e3e',
      dark: '#137333',
    },
    warning: {
      light: '#fef7e0',
      main: '#e37400',
      dark: '#b96000',
    },
    error: {
      light: '#fce8e6',
      main: '#d93025',
      dark: '#a50e0e',
    },
    info: {
      light: '#e8f0fe',
      main: '#1a73e8',
      dark: '#174ea6',
    },

    // Background
    background: {
      default: '#ffffff',
      paper: '#ffffff',
      hover: '#f8f9fa',
      selected: '#e8f0fe',
    },
  },

  // ==================== TYPOGRAPHY ====================
  typography: {
    fontFamily: {
      sans: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      mono: '"Roboto Mono", "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // ==================== SPACING ====================
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
  },

  // ==================== BORDER RADIUS ====================
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },

  // ==================== SHADOWS ====================
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)',
    md: '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)',
    lg: '0 2px 6px 2px rgba(60, 64, 67, 0.15), 0 8px 16px 4px rgba(60, 64, 67, 0.15)',
    xl: '0 4px 16px 0 rgba(60, 64, 67, 0.15), 0 8px 24px 4px rgba(60, 64, 67, 0.15)',
    hover: '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)',
  },

  // ==================== COMPONENT STYLES ====================
  components: {
    button: {
      primary: {
        base: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
        shadow: 'shadow-sm hover:shadow-md',
        disabled: 'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed',
      },
      secondary: {
        base: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
        shadow: 'shadow-sm hover:shadow',
        disabled: 'disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
      },
      danger: {
        base: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
        shadow: 'shadow-sm hover:shadow-md',
        disabled: 'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed',
      },
      ghost: {
        base: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
        shadow: '',
        disabled: 'disabled:text-gray-400 disabled:cursor-not-allowed',
      },
      text: {
        base: 'bg-transparent text-blue-600 hover:bg-blue-50 active:bg-blue-100',
        shadow: '',
        disabled: 'disabled:text-gray-400 disabled:cursor-not-allowed',
      },
    },

    card: {
      base: 'bg-white rounded-lg border border-gray-200 shadow-sm',
      hover: 'hover:shadow-md hover:border-gray-300 transition-all duration-200',
      interactive: 'cursor-pointer transform hover:scale-[1.01] hover:shadow-md transition-all duration-200',
      padding: 'p-4',
    },

    input: {
      base: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      error: 'border-red-500 focus:ring-red-500',
      disabled: 'bg-gray-100 text-gray-500 cursor-not-allowed',
    },

    modal: {
      backdrop: 'fixed inset-0 bg-black/50 z-50',
      container: 'bg-white rounded-lg shadow-xl max-w-lg w-full mx-4',
      header: 'px-6 py-4 border-b border-gray-200',
      body: 'px-6 py-4',
      footer: 'px-6 py-4 border-t border-gray-200 flex justify-end gap-3',
    },

    iconButton: {
      base: 'p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150',
      small: 'p-1.5',
      large: 'p-3',
    },

    badge: {
      success: 'bg-green-50 text-green-700 border border-green-200',
      warning: 'bg-orange-50 text-orange-700 border border-orange-200',
      error: 'bg-red-50 text-red-700 border border-red-200',
      info: 'bg-blue-50 text-blue-700 border border-blue-200',
      base: 'px-2 py-1 rounded-full text-xs font-medium',
    },
  },

  // ==================== TRANSITIONS ====================
  transitions: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-200',
    slow: 'transition-all duration-300',
  },

  // ==================== BREAKPOINTS ====================
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ==================== Z-INDEX ====================
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get button classes based on variant and size
 */
export const getButtonClasses = (variant = 'primary', size = 'md', fullWidth = false) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantStyle = theme.components.button[variant];
  const widthClass = fullWidth ? 'w-full' : '';

  return `${baseClasses} ${sizeClasses[size]} ${variantStyle.base} ${variantStyle.shadow} ${variantStyle.disabled} ${widthClass}`.trim();
};

/**
 * Get card classes based on variant
 */
export const getCardClasses = (variant = 'base', interactive = false) => {
  const baseCard = theme.components.card.base;
  const padding = theme.components.card.padding;
  
  if (interactive) {
    return `${baseCard} ${theme.components.card.interactive} ${padding}`;
  }
  
  if (variant === 'hover') {
    return `${baseCard} ${theme.components.card.hover} ${padding}`;
  }
  
  return `${baseCard} ${padding}`;
};

/**
 * Get icon button classes
 */
export const getIconButtonClasses = (size = 'base') => {
  const base = theme.components.iconButton.base;
  
  if (size === 'small') {
    return `${base} ${theme.components.iconButton.small}`;
  }
  if (size === 'large') {
    return `${base} ${theme.components.iconButton.large}`;
  }
  
  return base;
};

/**
 * Get input classes
 */
export const getInputClasses = (error = false, disabled = false) => {
  const base = theme.components.input.base;
  
  if (error) {
    return `${base} ${theme.components.input.error}`;
  }
  if (disabled) {
    return `${base} ${theme.components.input.disabled}`;
  }
  
  return base;
};

export default theme;
