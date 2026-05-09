module.exports = {
  name: "Word of the Day",
  slug: "word-of-the-day",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#0a0a12",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#0a0a12",
    },
    // TODO: Replace with your own reverse-domain package name.
    // Format: com.yourname.appname — must be unique on Play Store.
    // Once published this CANNOT be changed.
    package: "com.muscamo.wordoftheday",
    versionCode: 1,
    permissions: ["RECEIVE_BOOT_COMPLETED", "VIBRATE"],
  },
  plugins: [
    [
      "expo-notifications",
      {
        icon: "./assets/notification-icon.png",
        color: "#c084fc",
        sounds: [],
      },
    ],
  ],
  extra: {
    privacyPolicyUrl: "https://muscamo.github.io/word-of-the-day/privacy.html",
    eas: {
      projectId: "2bb65523-b3be-4d62-8745-38302f10a5d7",
    },
  },
};
