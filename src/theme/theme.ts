import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { DesignConstants } from './designConstants';

const colors = {
  primary: '#3108c5ff',
  secondary: '#FFD700',
  tertiary: '#c66606ff',
  accent: '#3108c5ff',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#2C2C2C',
  textSecondary: '#6B6B6B',
  border: '#878585ff',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FFCC00',
  disabled: '#919191dd',
  transparentBg: '#1414143a',
};

const fontSizes = {
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 24,
    xxl: 32,
};

const fontWeights = {
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
};

const typography = {
  fontFamily: 'System',
  
  fontStyles: {
    h1: {
      fontSize: fontSizes.xxl,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    h2: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.semibold,
      color: colors.text,
    },
    body: {
      fontSize: fontSizes.m,
      fontWeight: fontWeights.regular,
      color: colors.text,
    },
    light: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.light,
      color: colors.textSecondary,
    },
  },
};

const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.m,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: DesignConstants.BORDER_RADIUS,
    padding: spacing.m,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadow: {
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRegular: {
    width: DesignConstants.LOGO_REGULAR_WIDTH,
    height: DesignConstants.LOGO_REGULAR_HEIGHT,
    marginBottom: spacing.m,
 },
  logoSmall: {
    width: DesignConstants.LOGO_SMALL_WIDTH,
    height: DesignConstants.LOGO_SMALL_HEIGHT,
    marginBottom: spacing.s,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  }
});

export const theme = {
  colors,
  typography,
  spacing,
  commonStyles,
};

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type CommonStyles = typeof commonStyles;
