import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  roundness: 12,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0F172A', // deep indigo
    onPrimary: '#FFFFFF',
    secondary: '#FCA311', // warm amber accent
    surface: '#F8FAFC',
    background: '#F1F5F9',
    error: '#EF4444',
    outline: '#E2E8F0',
  },
  // subtle elevation tokens for premium feel
  elevation: {
    level0: { shadowColor: 'transparent' },
    level1: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 },
  } as any,
};
