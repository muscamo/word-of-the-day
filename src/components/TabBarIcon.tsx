import React from 'react';
import { Text } from 'react-native';

const icons: Record<string, string> = {
  Today: '◈',
  History: '◷',
  Favorites: '★',
};

export default function TabBarIcon({ route, color }: { route: string; color: string; size: number }) {
  return <Text style={{ fontSize: 20, color }}>{icons[route] ?? '•'}</Text>;
}
