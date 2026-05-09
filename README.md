# Word of the Day 📖

A production-ready daily vocabulary app built with Expo + React Native, ready for Google Play.

## Features
- 📖 New curated word every day — definition, phonetic, part of speech, example sentence
- 🔄 Pull-to-refresh with retry logic and exponential backoff
- 📅 History of the last 30 words (persisted offline)
- ★ Save favorites, persisted across sessions
- 📤 Native share sheet
- 🔔 Daily notification reminder (configurable time)
- 💾 Offline-first — words are cached so they load instantly on reopen
- 🌙 Respects new-day detection when app is reopened after midnight
- ♿ Full accessibility labels and roles
- ⚠️ Error boundary prevents white-screen crashes
- 📊 Analytics hooks (swap in any provider)

---

## Project Structure
```
WordOfTheDay/
├── App.tsx                        # Root: ErrorBoundary + SafeAreaProvider + Navigation
├── app.config.ts                  # Expo config (name, icons, android package)
├── eas.json                       # EAS build profiles (dev / preview / production)
├── src/
│   ├── api/
│   │   └── wordApi.ts             # API calls with retry, timeout, offline fallback
│   ├── context/
│   │   └── WordContext.tsx        # Global state via useReducer
│   ├── screens/
│   │   ├── HomeScreen.tsx         # Today's word (skeleton loader, animations)
│   │   ├── HistoryScreen.tsx      # Past 30 words
│   │   ├── FavoritesScreen.tsx    # Saved words
│   │   └── SettingsScreen.tsx     # Notification time picker
│   ├── components/
│   │   ├── ErrorBoundary.tsx      # Catches render errors gracefully
│   │   └── Skeleton.tsx           # Animated loading placeholders
│   ├── services/
│   │   ├── analytics.ts           # Pluggable analytics (swap in Firebase/Mixpanel)
│   │   ├── notifications.ts       # Daily push notification scheduling
│   │   └── storage.ts             # Safe AsyncStorage wrapper
│   └── types/
│       └── index.ts               # Shared TypeScript types
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- `npm install -g expo-cli eas-cli`
- Expo Go on your Android device

### Run locally
```bash
npm install
npm start
# Scan QR code with Expo Go
```

### Lint + type-check
```bash
npm run lint
npm run type-check
```

---

## Publishing to Google Play

### 1. Create an Expo account
https://expo.dev (free)

### 2. Log in to EAS
```bash
eas login
eas build:configure   # creates eas.json if not present
```

### 3. Build production AAB
```bash
npm run build:android:prod
```
EAS builds in the cloud — no local Android SDK needed. You'll get a download link.

### 4. Upload to Google Play Console
- https://play.google.com/console → Create app
- Internal testing → Upload your `.aab`
- Fill in store listing: title, description, screenshots, content rating
- Promote to Production when ready (first review: 2–7 days)

### 5. Automate submissions (optional)
Add your Google service account key as `google-service-account.json` (gitignored), then:
```bash
npm run submit:android
```

---

## Adding Analytics
Open `src/services/analytics.ts` and replace the `send` stub:
```ts
// Firebase example:
import analytics from '@react-native-firebase/analytics';
const send = (event, props) => analytics().logEvent(event, props);
```
All calls flow through that one function — nothing else to change.

## Adding Error Tracking (Sentry)
```bash
npx expo install @sentry/react-native
```
Add to `src/components/ErrorBoundary.tsx`:
```ts
import * as Sentry from '@sentry/react-native';
componentDidCatch(error, info) { Sentry.captureException(error); }
```
