# Production Launch Checklist

## Code ✅ (already done)
- [x] 403-word list — no repeats for over a year
- [x] Retry logic + exponential backoff on all API calls
- [x] Offline caching — today's word survives no internet
- [x] Error boundary — no white-screen crashes
- [x] Skeleton loaders
- [x] Pull-to-refresh
- [x] Accessibility labels and roles
- [x] Analytics hooks (ready to plug in Firebase/Mixpanel)
- [x] Daily notification scheduling with time picker
- [x] Light / dark / system theme, persisted
- [x] Random word button
- [x] EAS build config (dev / preview / production)
- [x] ESLint + TypeScript strict mode
- [x] .gitignore with secrets excluded

## Before Building
- [ ] Replace `com.mauriceg.wordoftheday` in app.config.js with YOUR package name
- [ ] Update email in docs/privacy.html
- [ ] Run `npm run type-check` — fix any TypeScript errors
- [ ] Run `npm run lint` — fix any lint errors
- [ ] Test on a real Android device (not just Expo Go)

## Assets (must do before Play Store)
- [ ] icon.png — 1024×1024px, no alpha, no transparent corners
- [ ] adaptive-icon.png — 1024×1024px foreground on transparent
- [ ] splash.png — 1284×2778px (or 1242×2688)
- [ ] notification-icon.png — 96×96px white monochrome on transparent
- [ ] feature-graphic.png — 1024×500px (Play Store banner image)
- [ ] 2–8 screenshots at 1080×1920px
  > Tip: Run `node generate-assets.js` for SVG templates to design from

## Error Tracking (strongly recommended)
- [ ] Create free account at https://sentry.io
- [ ] `npx expo install @sentry/react-native`
- [ ] Follow setup at https://docs.sentry.io/platforms/react-native/
- [ ] Add DSN to app.config.js under `extra.sentryDsn`

## Privacy Policy
- [ ] Host docs/privacy.html at a public URL
  > Easiest: push to GitHub, enable Pages under Settings → Pages → /docs folder
  > URL will be: https://YOUR-USERNAME.github.io/word-of-the-day/privacy
- [ ] Update `extra.privacyPolicyUrl` in app.config.js with your real URL

## Play Store Setup
- [ ] Create Google Play Console account ($25 one-time fee)
  > https://play.google.com/console
- [ ] Create new app → select "App" type, free, English
- [ ] Fill in store listing using store-listing.md content
- [ ] Set content rating (complete the questionnaire — choose "Everyone")
- [ ] Set app category: Education > Language
- [ ] Add privacy policy URL
- [ ] Upload feature graphic and screenshots

## Building & Releasing
```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Configure (first time only)
eas build:configure

# 4. Build production AAB
npm run build:android:prod
# EAS builds in the cloud — takes ~10 min, you get a download link

# 5. Download the .aab file from the EAS dashboard

# 6. In Play Console: Production → Create new release → Upload .aab
```

## Post-Launch
- [ ] Monitor crash reports (Sentry)
- [ ] Reply to reviews within 48 hours
- [ ] Submit update with bug fixes after first week of feedback
