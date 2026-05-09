import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Switch, TouchableOpacity,
  ScrollView, Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { getNotificationSettings, scheduleDailyReminder, cancelDailyReminder } from '../services/notifications';
import { Analytics } from '../services/analytics';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const formatHour = (h: number) => {
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${period}`;
};

const THEME_OPTIONS: { label: string; value: ThemeMode; icon: string }[] = [
  { label: 'Light', value: 'light', icon: '☀' },
  { label: 'Dark', value: 'dark', icon: '🌙' },
  { label: 'System', value: 'system', icon: '⚙' },
];

export default function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [selectedHour, setSelectedHour] = useState(8);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getNotificationSettings().then(s => {
      setNotifEnabled(s.enabled);
      setSelectedHour(s.hour);
    });
  }, []);

  const handleToggle = async (value: boolean) => {
    setSaving(true);
    if (value) {
      const success = await scheduleDailyReminder(selectedHour, 0);
      if (success) {
        setNotifEnabled(true);
        Analytics.notificationEnabled(selectedHour);
      } else {
        Alert.alert('Permission Required', 'Please enable notifications in your device settings.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]);
      }
    } else {
      await cancelDailyReminder();
      setNotifEnabled(false);
      Analytics.notificationDisabled();
    }
    setSaving(false);
  };

  const handleHourChange = async (hour: number) => {
    setSelectedHour(hour);
    if (notifEnabled) await scheduleDailyReminder(hour, 0);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Settings</Text>

        {/* Appearance */}
        <View style={[styles.section, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>APPEARANCE</Text>
          <View style={[styles.divider, { borderColor: theme.border }]} />
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map(opt => {
              const active = mode === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.themeChip,
                    { backgroundColor: theme.bgChip, borderColor: theme.border },
                    active && { backgroundColor: theme.bgBadge, borderColor: theme.accent },
                  ]}
                  onPress={() => setMode(opt.value)}
                  accessibilityLabel={`Set theme to ${opt.label}`}
                  accessibilityState={{ selected: active }}
                >
                  <Text style={styles.themeIcon}>{opt.icon}</Text>
                  <Text style={[styles.themeLabel, { color: active ? theme.accent : theme.textMuted }, active && { fontWeight: '700' }]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Notifications */}
        <View style={[styles.section, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>NOTIFICATIONS</Text>
          <View style={[styles.divider, { borderColor: theme.border }]} />
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>Daily Reminder</Text>
              <Text style={[styles.rowSub, { color: theme.textMuted }]}>Get notified when your new word is ready</Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={handleToggle}
              disabled={saving}
              trackColor={{ false: theme.border, true: theme.accentDim }}
              thumbColor={notifEnabled ? theme.accent : theme.textMuted}
            />
          </View>
          {notifEnabled && (
            <View style={styles.hourPicker}>
              <Text style={[styles.hourPickerLabel, { color: theme.textExample }]}>Remind me at</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {HOURS.map(h => (
                  <TouchableOpacity
                    key={h}
                    style={[
                      styles.hourChip,
                      { backgroundColor: theme.bgChip, borderColor: theme.border },
                      selectedHour === h && { backgroundColor: theme.bgBadge, borderColor: theme.accent },
                    ]}
                    onPress={() => handleHourChange(h)}
                  >
                    <Text style={[styles.hourText, { color: selectedHour === h ? theme.accent : theme.textExample },
                      selectedHour === h && { fontWeight: '700' }]}>
                      {formatHour(h)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* About */}
        <View style={[styles.section, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>ABOUT</Text>
          <View style={[styles.divider, { borderColor: theme.border }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textExample }]}>Version</Text>
            <Text style={[styles.infoValue, { color: theme.textSecondary }]}>1.0.0</Text>
          </View>
          <View style={[styles.divider, { borderColor: theme.border }]} />
          <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL('https://dictionaryapi.dev')}>
            <Text style={[styles.infoLabel, { color: theme.textExample }]}>Data source</Text>
            <Text style={[styles.infoValue, { color: theme.accent }]}>dictionaryapi.dev ↗</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 20, paddingBottom: 40 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -1, marginBottom: 28 },
  section: { borderRadius: 20, borderWidth: 1, marginBottom: 20, overflow: 'hidden' },
  sectionTitle: { fontSize: 10, letterSpacing: 2.5, fontWeight: '700', padding: 20, paddingBottom: 14 },
  divider: { borderTopWidth: 1 },
  themeRow: { flexDirection: 'row', gap: 10, padding: 16 },
  themeChip: {
    flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 14,
    borderWidth: 1, gap: 4,
  },
  themeIcon: { fontSize: 20 },
  themeLabel: { fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
  rowText: { flex: 1, marginRight: 16 },
  rowLabel: { fontSize: 16, fontWeight: '600' },
  rowSub: { fontSize: 13, marginTop: 2 },
  hourPicker: { paddingHorizontal: 18, paddingBottom: 18 },
  hourPickerLabel: { fontSize: 13, marginBottom: 10 },
  hourChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  hourText: { fontSize: 13 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  infoLabel: { fontSize: 15 },
  infoValue: { fontSize: 15 },
});
