export interface Word {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  example?: string;
  synonyms: string[];
  date: string; // YYYY-MM-DD
}
