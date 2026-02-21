import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

const THEME = {
  light: {
    background: 'hsl(36 33% 97%)',
    foreground: 'hsl(24 30% 11%)',
    card: 'hsl(35 28% 94%)',
    cardForeground: 'hsl(24 30% 11%)',
    popover: 'hsl(36 33% 97%)',
    popoverForeground: 'hsl(24 30% 11%)',
    primary: 'hsl(18 76% 47%)',
    primaryForeground: 'hsl(40 50% 97%)',
    secondary: 'hsl(30 18% 89%)',
    secondaryForeground: 'hsl(24 30% 11%)',
    muted: 'hsl(32 14% 91%)',
    mutedForeground: 'hsl(24 10% 46%)',
    accent: 'hsl(38 35% 89%)',
    accentForeground: 'hsl(24 30% 11%)',
    destructive: 'hsl(6 72% 52%)',
    border: 'hsl(30 20% 82%)',
    input: 'hsl(30 20% 82%)',
    ring: 'hsl(18 60% 55%)',
  },
  dark: {
    background: 'hsl(24 22% 7%)',
    foreground: 'hsl(36 28% 91%)',
    card: 'hsl(24 20% 11%)',
    cardForeground: 'hsl(36 28% 91%)',
    popover: 'hsl(24 20% 11%)',
    popoverForeground: 'hsl(36 28% 91%)',
    primary: 'hsl(18 80% 54%)',
    primaryForeground: 'hsl(24 25% 7%)',
    secondary: 'hsl(24 15% 16%)',
    secondaryForeground: 'hsl(36 28% 91%)',
    muted: 'hsl(24 13% 15%)',
    mutedForeground: 'hsl(28 12% 52%)',
    accent: 'hsl(30 18% 16%)',
    accentForeground: 'hsl(36 28% 91%)',
    destructive: 'hsl(6 65% 52%)',
    border: 'hsl(24 16% 18%)',
    input: 'hsl(24 16% 18%)',
    ring: 'hsl(18 55% 48%)',
  },
};

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
