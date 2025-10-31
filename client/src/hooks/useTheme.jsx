import { theme, getButtonClasses, getCardClasses, getNeonGlow, getGradientText } from '../theme/theme.js';

/**
 * Custom hook to access theme utilities
 * Usage: const { theme, getButton, getCard, getGlow, getGradient } = useTheme();
 */
export const useTheme = () => {
  return {
    theme,
    getButton: getButtonClasses,
    getCard: getCardClasses,
    getGlow: getNeonGlow,
    getGradient: getGradientText,
  };
};