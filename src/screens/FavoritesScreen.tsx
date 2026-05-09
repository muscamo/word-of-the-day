import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWord } from '../context/WordContext';
import { useTheme } from '../context/ThemeContext';
import { Word } from '../types';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useWord();
  const { theme } = useTheme();

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={[styles.empty, { backgroundColor: theme.bg }]} edges={['top']}>
        <Text style={[styles.emptyIcon, { color: theme.border }]}>★</Text>
        <Text style={[styles.emptyText, { color: theme.textPrimary }]}>No favorites yet.</Text>
        <Text style={[styles.emptySubText, { color: theme.textMuted }]}>Tap ☆ on any word to save it here.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={['top']}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={item => item.word}
        renderItem={({ item }: { item: Word }) => (
          <View style={[styles.card, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.word, { color: theme.textPrimary }]}>{item.word}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item)} accessibilityLabel={`Remove ${item.word} from favorites`}>
                <Text style={[styles.remove, { color: theme.textMuted }]}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.pos, { color: theme.accent }]}>{item.partOfSpeech}</Text>
            <Text style={[styles.def, { color: theme.textSecondary }]}>{item.definition}</Text>
            {item.example ? <Text style={[styles.example, { color: theme.textExample }]}>"{item.example}"</Text> : null}
          </View>
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -1, padding: 24, paddingTop: 20, paddingBottom: 12 },
  list: { paddingHorizontal: 24, paddingBottom: 32 },
  card: { borderRadius: 16, padding: 20, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  word: { fontSize: 22, fontWeight: '800', flex: 1 },
  remove: { fontSize: 16, padding: 4 },
  pos: { fontSize: 12, marginBottom: 10 },
  def: { fontSize: 15, lineHeight: 24, marginBottom: 8 },
  example: { fontSize: 14, fontStyle: 'italic' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '700' },
  emptySubText: { marginTop: 6, textAlign: 'center' },
});
