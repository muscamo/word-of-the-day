import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { storage } from '../services/storage';

const THEME_KEY = 'user_theme_preference';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  // Backgrounds
  bg: string;
  bgCard: string;
  bgChip: string;
  bgBadge: string;
  bgAction: string;
  bgActionActive: string;
  // Borders
  border: string;
  borderActive: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textExample: string;
  // Accent
  accent: string;
  accentDim: string;
  // Status bar
  statusBar: 'light-content' | 'dark-content';
  // Tab bar
  tabBg: string;
  tabBorder: string;
}

const dark: Theme = {
  bg: '#0a0a12',
  bgCard: '#14142a',
  bgChip: '#1a1a30',
  bgBadge: '#1e0a3a',
  bgAction: '#14142a',
  bgActionActive: '#1e0a3a',
  border: '#1e1e38',
  borderActive: '#c084fc',
  textPrimary: '#f0e6ff',
  textSecondary: '#d0c8e0',
  textMuted: '#4a4a6a',
  textExample: '#8878a8',
  accent: '#c084fc',
  accentDim: '#7c3aed',
  statusBar: 'light-content',
  tabBg: '#0a0a12',
  tabBorder: '#1a1a2e',
};

const light: Theme = {
  bg: '#f8f5ff',
  bgCard: '#ffffff',
  bgChip: '#f0ebff',
  bgBadge: '#ede5ff',
  bgAction: '#ffffff',
  bgActionActive: '#ede5ff',
  border: '#e4daf7',
  borderActive: '#7c3aed',
  textPrimary: '#1a0a3a',
  textSecondary: '#3a2a5a',
  textMuted: '#9b8ab8',
  textExample: '#7a6a9a',
  accent: '#7c3aed',
  accentDim: '#5b21b6',
  statusBar: 'dark-content',
  tabBg: '#ffffff',
  tabBorder: '#e4daf7',
};

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    storage.get<ThemeMode>(THEME_KEY).then(saved => {
      if (saved) setModeState(saved);
    });
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    storage.set(THEME_KEY, m);
  };

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const theme = isDark ? dark : light;

  return (
    <ThemeContext.Provider value={{ theme, mode, isDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
