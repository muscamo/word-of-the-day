import React, { createContext, useContext, useEffect, useCallback, useReducer, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { fetchWordOfTheDay } from '../api/wordApi';
import { storage } from '../services/storage';
import { Analytics } from '../services/analytics';
import { Word } from '../types';

const HISTORY_KEY = 'word_history';
const FAVORITES_KEY = 'word_favorites';
const MAX_HISTORY = 30;

// ─── State ───────────────────────────────────────────────────────────────────

interface State {
  todayWord: Word | null;
  history: Word[];
  favorites: Word[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
}

type Action =
  | { type: 'LOAD_START' }
  | { type: 'REFRESH_START' }
  | { type: 'LOAD_SUCCESS'; word: Word }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'SET_HISTORY'; history: Word[] }
  | { type: 'SET_FAVORITES'; favorites: Word[] }
  | { type: 'TOGGLE_FAVORITE'; word: Word };

const initialState: State = {
  todayWord: null,
  history: [],
  favorites: [],
  loading: true,
  refreshing: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'REFRESH_START':
      return { ...state, refreshing: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, loading: false, refreshing: false, error: null, todayWord: action.word };
    case 'LOAD_ERROR':
      return { ...state, loading: false, refreshing: false, error: action.error };
    case 'SET_HISTORY':
      return { ...state, history: action.history };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.favorites };
    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.some(w => w.word === action.word.word);
      const favorites = exists
        ? state.favorites.filter(w => w.word !== action.word.word)
        : [action.word, ...state.favorites];
      return { ...state, favorites };
    }
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface WordContextType extends State {
  toggleFavorite: (word: Word) => void;
  isFavorite: (word: string) => boolean;
  refresh: () => void;
}

const WordContext = createContext<WordContextType | undefined>(undefined);

export const WordProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load persisted data once
  useEffect(() => {
    const loadStored = async () => {
      const [history, favorites] = await Promise.all([
        storage.get<Word[]>(HISTORY_KEY),
        storage.get<Word[]>(FAVORITES_KEY),
      ]);
      if (history) dispatch({ type: 'SET_HISTORY', history });
      if (favorites) dispatch({ type: 'SET_FAVORITES', favorites });
    };
    loadStored();
  }, []);

  // Load today's word
  const loadTodayWord = useCallback(async (isRefresh = false) => {
    dispatch({ type: isRefresh ? 'REFRESH_START' : 'LOAD_START' });
    try {
      const today = new Date().toISOString().split('T')[0];
      // Use cache unless refreshing
      if (!isRefresh) {
        const cached = await storage.get<Word>(`word_${today}`);
        if (cached) {
          dispatch({ type: 'LOAD_SUCCESS', word: cached });
          Analytics.wordViewed(cached.word);
          return;
        }
      }

      const word = await fetchWordOfTheDay();
      dispatch({ type: 'LOAD_SUCCESS', word });
      Analytics.wordViewed(word.word);

      // Persist word for today
      await storage.set(`word_${today}`, word);

      // Update history
      const current = (await storage.get<Word[]>(HISTORY_KEY)) || [];
      if (!current.find(w => w.date === today)) {
        const updated = [word, ...current].slice(0, MAX_HISTORY);
        dispatch({ type: 'SET_HISTORY', history: updated });
        await storage.set(HISTORY_KEY, updated);
      }
    } catch (e: any) {
      dispatch({ type: 'LOAD_ERROR', error: e.message || 'Failed to load word.' });
    }
  }, []);

  useEffect(() => {
    Analytics.appOpen();
    loadTodayWord();
  }, [loadTodayWord]);

  // Reload if app comes back to foreground on a new day
  useEffect(() => {
    let lastDate = new Date().toISOString().split('T')[0];
    const sub = AppState.addEventListener('change', (status: AppStateStatus) => {
      if (status === 'active') {
        const today = new Date().toISOString().split('T')[0];
        if (today !== lastDate) {
          lastDate = today;
          loadTodayWord();
        }
      }
    });
    return () => sub.remove();
  }, [loadTodayWord]);

  const toggleFavorite = useCallback((word: Word) => {
    dispatch({ type: 'TOGGLE_FAVORITE', word });
    const isFav = state.favorites.some(w => w.word === word.word);
    if (isFav) {
      Analytics.wordUnfavorited(word.word);
    } else {
      Analytics.wordFavorited(word.word);
    }
    // Persist asynchronously
    setTimeout(async () => {
      const current = (await storage.get<Word[]>(FAVORITES_KEY)) || [];
      const exists = current.some(w => w.word === word.word);
      const updated = exists ? current.filter(w => w.word !== word.word) : [word, ...current];
      await storage.set(FAVORITES_KEY, updated);
    }, 0);
  }, [state.favorites]);

  const isFavorite = useCallback(
    (word: string) => state.favorites.some(w => w.word === word),
    [state.favorites]
  );

  return (
    <WordContext.Provider value={{
      ...state,
      toggleFavorite,
      isFavorite,
      refresh: () => loadTodayWord(true),
    }}>
      {children}
    </WordContext.Provider>
  );
};

export const useWord = (): WordContextType => {
  const ctx = useContext(WordContext);
  if (!ctx) throw new Error('useWord must be used within WordProvider');
  return ctx;
};
