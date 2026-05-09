import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const NOTIF_ID_KEY = 'daily_notif_id';
const NOTIF_ENABLED_KEY = 'notif_enabled';
const NOTIF_HOUR_KEY = 'notif_hour';
const NOTIF_MINUTE_KEY = 'notif_minute';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export const requestNotificationPermission = async (): Promise<boolean> => {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const scheduleDailyReminder = async (hour = 8, minute = 0): Promise<boolean> => {
  const granted = await requestNotificationPermission();
  if (!granted) return false;

  // Cancel existing
  await cancelDailyReminder();

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Word of the Day 📖',
      body: 'Your new word is ready. Tap to expand your vocabulary!',
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  await AsyncStorage.setItem(NOTIF_ID_KEY, id);
  await AsyncStorage.setItem(NOTIF_ENABLED_KEY, 'true');
  await AsyncStorage.setItem(NOTIF_HOUR_KEY, String(hour));
  await AsyncStorage.setItem(NOTIF_MINUTE_KEY, String(minute));
  return true;
};

export const cancelDailyReminder = async () => {
  const id = await AsyncStorage.getItem(NOTIF_ID_KEY);
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
  await AsyncStorage.setItem(NOTIF_ENABLED_KEY, 'false');
};

export const getNotificationSettings = async () => {
  const [enabled, hour, minute] = await Promise.all([
    AsyncStorage.getItem(NOTIF_ENABLED_KEY),
    AsyncStorage.getItem(NOTIF_HOUR_KEY),
    AsyncStorage.getItem(NOTIF_MINUTE_KEY),
  ]);
  return {
    enabled: enabled === 'true',
    hour: hour ? parseInt(hour) : 8,
    minute: minute ? parseInt(minute) : 0,
  };
};
