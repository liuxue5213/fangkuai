import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isMediumScreen = width < 414;

export const THEME = {
  colors: {
    background: '#1e1e2f',
    backgroundGradient: '#2d2d44',
    boardBackground: '#363655',
    boardBorder: '#4a4a75',
    emptyCell: '#252540',
    emptyCellHover: '#2f2f4e',
    text: '#ffffff',
    textSecondary: '#a0a0c0',
    textMuted: '#6b6b7b',
    highlight: '#ffd700',
    highlightGlow: '#ffe066',
    success: '#00d68a',
    successGlow: '#00ff88',
    error: '#ff4757',
    warning: '#ffa502',
    primary: '#667eea',
    primaryDark: '#764ba2',
  },
  board: {
    size: Math.min(width - 32, 420),
    cellSize: 0,
    gap: isSmallScreen ? 2 : 3,
    borderRadius: isSmallScreen ? 8 : 12,
    borderWidth: isSmallScreen ? 1 : 2,
  },
  block: {
    borderRadius: isSmallScreen ? 6 : 8,
    innerBorderRadius: isSmallScreen ? 4 : 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    innerShadowColor: 'rgba(0,0,0,0.1)',
  },
  fonts: {
    regular: Platform.OS === 'android' ? 'Roboto' : 'System',
    bold: Platform.OS === 'android' ? 'Roboto-Bold' : 'System',
    sizes: {
      xs: isSmallScreen ? 10 : 12,
      sm: isSmallScreen ? 12 : 14,
      md: isSmallScreen ? 14 : 16,
      lg: isSmallScreen ? 16 : 20,
      xl: isSmallScreen ? 20 : 24,
      xxl: isSmallScreen ? 24 : 32,
    },
  },
  spacing: {
    xs: isSmallScreen ? 3 : 4,
    sm: isSmallScreen ? 6 : 8,
    md: isSmallScreen ? 12 : 16,
    lg: isSmallScreen ? 18 : 24,
    xl: isSmallScreen ? 24 : 32,
    xxl: isSmallScreen ? 36 : 48,
  },
  gradients: {
    primary: {
      colors: ['#667eea', '#764ba2'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    success: {
      colors: ['#00d68a', '#00ff88'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    background: {
      colors: ['#1e1e2f', '#2d2d44'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
  effects: {
    shadow: {
      small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
      large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12,
      },
    },
  },
  animation: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
  },
};

export default THEME;
