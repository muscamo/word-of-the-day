import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const val = await AsyncStorage.getItem(key);
      return val ? (JSON.parse(val) as T) : null;
    } catch (e) {
      console.warn(`[Storage] Failed to get "${key}"`, e);
      return null;
    }
  },

  set: async <T>(key: string, value: T): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[Storage] Failed to set "${key}"`, e);
      return false;
    }
  },

  remove: async (key: string): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`[Storage] Failed to remove "${key}"`, e);
      return false;
    }
  },

  multiGet: async <T>(keys: string[]): Promise<Record<string, T | null>> => {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      return Object.fromEntries(
        pairs.map(([k, v]) => [k, v ? (JSON.parse(v) as T) : null])
      );
    } catch (e) {
      console.warn('[Storage] Failed multiGet', e);
      return {};
    }
  },
};
