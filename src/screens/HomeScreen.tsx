import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Share, RefreshControl, Animated, AccessibilityInfo, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWord } from '../context/WordContext';
import { useTheme } from '../context/ThemeContext';
import { HomeScreenSkeleton } from '../components/Skeleton';
import { Analytics } from '../services/analytics';
import { fetchRandomWord } from '../api/wordApi';
import { Word } from '../types';

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={{ opacity, transform: [{ translateY }] }}>{children}</Animated.View>;
};

export default function HomeScreen() {
  const { todayWord, loading, refreshing, error, toggleFavorite, isFavorite, refresh } = useWord();
  const { theme } = useTheme();
  const [randomWord, setRandomWord] = useState<Word | null>(null);
  const [randomLoading, setRandomLoading] = useState(false);

  // The word currently being displayed (random takes priority over today's)
  const displayWord = randomWord ?? todayWord;
  const isRandom = !!randomWord;

  const handleRandom = useCallback(async () => {
    setRandomLoading(true);
    try {
      const word = await fetchRandomWord(displayWord?.word);
      setRandomWord(word);
      Analytics.wordViewed(word.word);
    } catch {
      // silently fail — button just stays pressable
    } finally {
      setRandomLoading(false);
    }
  }, [displayWord]);

  const handleBackToToday = () => setRandomWord(null);

  const handleShare = async () => {
    if (!displayWord) return;
    Analytics.wordShared(displayWord.word);
    await Share.share({
      message: `📖 Word of the Day: ${displayWord.word}\n\n${displayWord.definition}${displayWord.example ? `\n\n"${displayWord.example}"` : ''}`,
    });
  };

  const handleFavorite = () => {
    if (!displayWord) return;
    toggleFavorite(displayWord);
    const isFav = isFavorite(displayWord.word);
    AccessibilityInfo.announceForAccessibility(isFav ? 'Removed from favorites' : 'Added to favorites');
  };

  if (loading) return <HomeScreenSkeleton />;

  if (error && !displayWord) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: theme.bg }]}>
        <Text style={styles.errorIcon}>⚡</Text>
        <Text style={[styles.errorTitle, { color: theme.textPrimary }]}>Couldn't load today's word</Text>
        <Text style={[styles.errorMsg, { color: theme.textMuted }]}>{error}</Text>
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: theme.accent }]} onPress={refresh}>
          <Text style={[styles.retryText, { color: theme.bg }]}>Try again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!displayWord) return null;
  const favorited = isFavorite(displayWord.word);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={theme.accent} colors={[theme.accent]} />}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn>
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.label, { color: theme.accent }]}>
                {isRandom ? 'RANDOM WORD' : 'WORD OF THE DAY'}
              </Text>
              <Text style={[styles.date, { color: theme.textMuted }]}>
                {isRandom
                  ? 'Tap again for another'
                  : new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
            </View>
            {isRandom && (
              <TouchableOpacity
                onPress={handleBackToToday}
                style={[styles.backBtn, { borderColor: theme.border }]}
                accessibilityLabel="Back to today's word"
              >
                <Text style={[styles.backBtnText, { color: theme.textMuted }]}>← Today</Text>
              </TouchableOpacity>
            )}
          </View>
        </FadeIn>

        <FadeIn delay={80}>
          <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border, shadowColor: theme.accent }]}>
            <Text style={[styles.word, { color: theme.textPrimary }]}>{displayWord.word}</Text>
            {displayWord.phonetic ? (
              <Text style={[styles.phonetic, { color: theme.accent }]}>{displayWord.phonetic}</Text>
            ) : null}
            <View style={[styles.badge, { backgroundColor: theme.bgBadge, borderColor: theme.border }]}>
              <Text style={[styles.badgeText, { color: theme.accent }]}>{displayWord.partOfSpeech}</Text>
            </View>

            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>DEFINITION</Text>
            <Text style={[styles.definition, { color: theme.textSecondary }]}>{displayWord.definition}</Text>

            {displayWord.example ? (
              <>
                <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>EXAMPLE</Text>
                <Text style={[styles.example, { color: theme.textExample }]}>"{displayWord.example}"</Text>
              </>
            ) : null}

            {displayWord.synonyms.length > 0 ? (
              <>
                <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>SYNONYMS</Text>
                <View style={styles.synonymsRow}>
                  {displayWord.synonyms.map(s => (
                    <View key={s} style={[styles.synonymChip, { backgroundColor: theme.bgChip, borderColor: theme.border }]}>
                      <Text style={[styles.synonymText, { color: theme.textExample }]}>{s}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : null}
          </View>
        </FadeIn>

        <FadeIn delay={160}>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.bgAction, borderColor: favorited ? theme.accent : theme.border },
                favorited && { backgroundColor: theme.bgActionActive }]}
              onPress={handleFavorite}
              accessibilityLabel={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Text style={[styles.actionBtnText, { color: theme.accent }]}>{favorited ? '★ Saved' : '☆ Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.bgAction, borderColor: theme.border }]}
              onPress={handleShare}
              accessibilityLabel="Share this word"
            >
              <Text style={[styles.actionBtnText, { color: theme.accent }]}>↗ Share</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.randomBtn, { backgroundColor: theme.bgBadge, borderColor: theme.accent }]}
            onPress={handleRandom}
            disabled={randomLoading}
            accessibilityLabel="Show a random word"
          >
            {randomLoading
              ? <ActivityIndicator size="small" color={theme.accent} />
              : <Text style={[styles.randomBtnText, { color: theme.accent }]}>⚄ Random Word</Text>
            }
          </TouchableOpacity>
        </FadeIn>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  backBtn: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, marginTop: 4 },
  backBtnText: { fontSize: 13, fontWeight: '600' },
  label: { fontSize: 11, letterSpacing: 3, fontWeight: '700', marginBottom: 6 },
  date: { fontSize: 13 },
  card: {
    borderRadius: 24, padding: 26, borderWidth: 1,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 8,
  },
  word: { fontSize: 44, fontWeight: '800', letterSpacing: -1.5, marginBottom: 4 },
  phonetic: { fontSize: 15, marginBottom: 14 },
  badge: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 28, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  sectionLabel: { fontSize: 10, letterSpacing: 2.5, fontWeight: '700', marginBottom: 10, marginTop: 4 },
  definition: { fontSize: 16, lineHeight: 27, marginBottom: 20 },
  example: { fontSize: 15, lineHeight: 25, fontStyle: 'italic', marginBottom: 20 },
  synonymsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  synonymChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1 },
  synonymText: { fontSize: 13, fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  actionBtn: { flex: 1, borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1 },
  actionBtnText: { fontWeight: '700', fontSize: 15, letterSpacing: 0.5 },
  randomBtn: {
    marginTop: 12, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', borderWidth: 1,
  },
  randomBtnText: { fontWeight: '700', fontSize: 15, letterSpacing: 0.5 },
  errorIcon: { fontSize: 40, marginBottom: 16 },
  errorTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  errorMsg: { fontSize: 14, textAlign: 'center', marginBottom: 24 },
  retryBtn: { borderRadius: 12, paddingHorizontal: 28, paddingVertical: 13 },
  retryText: { fontWeight: '700', fontSize: 15 },
});
