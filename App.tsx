import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Text } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { WordProvider } from './src/context/WordContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ErrorBoundary } from './src/components/ErrorBoundary';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Today: '◈', History: '◷', Favorites: '★', Settings: '⚙',
};

function AppNavigator() {
  const { theme } = useTheme();
  return (
    <>
      <StatusBar
        barStyle={theme.statusBar}
        backgroundColor={theme.tabBg}
      />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: theme.tabBg,
              borderTopColor: theme.tabBorder,
              borderTopWidth: 1,
              paddingBottom: 8,
              paddingTop: 8,
              height: 64,
            },
            tabBarActiveTintColor: theme.accent,
            tabBarInactiveTintColor: theme.textMuted,
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 18, color, lineHeight: 22 }}>
                {TAB_ICONS[route.name]}
              </Text>
            ),
          })}
        >
          <Tab.Screen name="Today" component={HomeScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
          <Tab.Screen name="Favorites" component={FavoritesScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <WordProvider>
            <AppNavigator />
          </WordProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
