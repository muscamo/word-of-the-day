/**
 * Analytics service
 * Swap the `send` implementation for any provider:
 * - Firebase Analytics: @react-native-firebase/analytics
 * - Mixpanel: mixpanel-react-native
 * - PostHog: posthog-react-native
 */

type EventName =
  | 'app_open'
  | 'word_viewed'
  | 'word_favorited'
  | 'word_unfavorited'
  | 'word_shared'
  | 'notification_enabled'
  | 'notification_disabled'
  | 'history_viewed'
  | 'favorites_viewed';

type EventProperties = Record<string, string | number | boolean>;

const send = (event: EventName, props?: EventProperties) => {
  // Replace this with your analytics provider call
  if (__DEV__) {
    console.log(`[Analytics] ${event}`, props ?? '');
  }
  // Example Firebase:
  // analytics().logEvent(event, props);
};

export const Analytics = {
  appOpen: () => send('app_open'),
  wordViewed: (word: string) => send('word_viewed', { word }),
  wordFavorited: (word: string) => send('word_favorited', { word }),
  wordUnfavorited: (word: string) => send('word_unfavorited', { word }),
  wordShared: (word: string) => send('word_shared', { word }),
  notificationEnabled: (hour: number) => send('notification_enabled', { hour }),
  notificationDisabled: () => send('notification_disabled'),
  historyViewed: () => send('history_viewed'),
  favoritesViewed: () => send('favorites_viewed'),
};
