import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWord } from '../context/WordContext';
import { useTheme } from '../context/ThemeContext';
import { Word } from '../types';

const WordRow = ({ item, isFav, onToggle, theme }: { item: Word; isFav: boolean; onToggle: () => void; theme: any }) => (
  <View style={[styles.row, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
    <View style={styles.rowLeft}>
      <Text style={[styles.rowWord, { color: theme.textPrimary }]}>{item.word}</Text>
      <Text style={[styles.rowMeta, { color: theme.accent }]}>{item.partOfSpeech} · {item.date}</Text>
      <Text style={[styles.rowDef, { color: theme.textExample }]} numberOfLines={2}>{item.definition}</Text>
    </View>
    <TouchableOpacity onPress={onToggle} style={styles.starBtn}>
      <Text style={[styles.star, { color: isFav ? theme.accent : theme.textMuted }]}>{isFav ? '★' : '☆'}</Text>
    </TouchableOpacity>
  </View>
);

export default function HistoryScreen() {
  const { history, toggleFavorite, isFavorite } = useWord();
  const { theme } = useTheme();

  if (history.length === 0) {
    return (
      <SafeAreaView style={[styles.empty, { backgroundColor: theme.bg }]} edges={['top']}>
        <Text style={[styles.emptyText, { color: theme.textPrimary }]}>No history yet.</Text>
        <Text style={[styles.emptySubText, { color: theme.textMuted }]}>Words you view will appear here.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]} edges={['top']}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>History</Text>
      <FlatList
        data={history}
        keyExtractor={item => item.date}
        renderItem={({ item }) => (
          <WordRow item={item} isFav={isFavorite(item.word)} onToggle={() => toggleFavorite(item)} theme={theme} />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -1, padding: 24, paddingTop: 20, paddingBottom: 12 },
  list: { paddingHorizontal: 24, paddingBottom: 32 },
  row: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 14, padding: 16, borderWidth: 1 },
  rowLeft: { flex: 1 },
  rowWord: { fontSize: 20, fontWeight: '700', marginBottom: 2 },
  rowMeta: { fontSize: 12, marginBottom: 6 },
  rowDef: { fontSize: 14, lineHeight: 20 },
  starBtn: { padding: 4, marginLeft: 8 },
  star: { fontSize: 22 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: '700' },
  emptySubText: { marginTop: 6 },
});
