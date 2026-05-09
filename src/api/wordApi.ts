import { Word } from '../types';

export const WORD_LIST: string[] = [
  "aberrant", "abhor", "abstruse", "acrimony", "acumen", "adamant", "adroit", "adulation",
  "adumbrate", "aesthetic", "affable", "affliction", "affluent", "aggrandize", "agile", "alacrity",
  "alienate", "allegory", "alleviate", "aloof", "altruism", "ambiguous", "ambivalent", "ameliorate",
  "amiable", "amicable", "anachronism", "anarchy", "anomaly", "antiquity", "apathy", "aplomb",
  "appease", "apprehensive", "ardent", "arduous", "articulate", "ascetic", "assiduous", "astute",
  "atrophy", "audacious", "augment", "auspicious", "austere", "aversion", "avid", "banal",
  "baroque", "beguile", "bellicose", "benevolent", "benign", "bequeath", "blithe", "bombastic",
  "boon", "brazen", "brevity", "brusque", "bucolic", "buoyant", "byzantine", "cacophony",
  "candid", "candor", "caprice", "captivate", "catharsis", "caustic", "celestial", "censure",
  "chagrin", "chicanery", "circumspect", "clandestine", "clemency", "coalesce", "cogent", "colloquial",
  "compassion", "complacent", "concise", "condone", "confluence", "congenial", "connive", "contrite",
  "conundrum", "conviction", "copious", "corroborate", "covet", "credulous", "cryptic", "culpable",
  "cursory", "dauntless", "debilitate", "decorum", "deference", "deft", "dejected", "deliberate",
  "delusion", "demure", "denigrate", "denounce", "deplore", "desolate", "devout", "dexterous",
  "didactic", "diffident", "diligent", "discern", "discordant", "disdain", "disparate", "dogmatic",
  "dormant", "duplicity", "ebullient", "eclectic", "effervescent", "effrontery", "egalitarian", "egregious",
  "elation", "eloquent", "elusive", "emanate", "embellish", "embolden", "empathy", "endemic",
  "enigmatic", "entreat", "ephemeral", "equanimity", "erudite", "esteem", "ethereal", "euphoria",
  "evanescent", "evoke", "exacerbate", "exalt", "exonerate", "expedient", "exquisite", "exuberant",
  "fallacious", "fastidious", "fathom", "fatuous", "feign", "fervent", "fervor", "fidelity",
  "flagrant", "flippant", "flourish", "forbearance", "forlorn", "fortitude", "fractious", "frugal",
  "furtive", "gallant", "garrulous", "glean", "gracious", "grandiose", "gratuitous", "gregarious",
  "grit", "guile", "hallowed", "harangue", "harbinger", "hasten", "heed", "hegemony",
  "heresy", "hiraeth", "holistic", "homage", "hubris", "humble", "hyperbole", "iconoclast",
  "idyllic", "ignominy", "illuminate", "immutable", "impartial", "impetuous", "implore", "impudent",
  "incandescent", "incisive", "incongruous", "indolent", "indomitable", "ineffable", "inexorable", "ingenuity",
  "ingenuous", "inimical", "innate", "inscrutable", "insipid", "inspire", "integral", "intrepid",
  "inveterate", "invoke", "irascible", "iridescent", "jocular", "jubilant", "judicious", "juxtapose",
  "kenopsia", "kindred", "knell", "laconic", "lacuna", "lament", "languid", "lassitude",
  "latent", "laudable", "lavish", "lethargic", "levity", "liberate", "liminal", "longevity",
  "loquacious", "luminous", "magnanimous", "malevolent", "malleable", "manifest", "marvel", "melancholy",
  "mellifluous", "mendacious", "mentor", "mercurial", "meticulous", "mindful", "mitigate", "modicum",
  "morose", "munificent", "mutable", "myopic", "nebulous", "nefarious", "nihilism", "noble",
  "nocturnal", "nonchalant", "nuanced", "nurture", "obdurate", "obfuscate", "oblique", "obsequious",
  "obstinate", "obtuse", "ominous", "omniscient", "onomatopoeia", "opaque", "ostentatious", "overcome",
  "palpable", "panacea", "paradox", "pariah", "parsimonious", "passion", "patience", "pedantic",
  "pensive", "perceive", "perfidious", "permeate", "persevere", "perspicacious", "petrichor", "phlegmatic",
  "phosphene", "placid", "poignant", "pragmatic", "precarious", "presumptuous", "profound", "prolific",
  "propitious", "prosaic", "prosper", "prudent", "pugnacious", "pursue", "quandary", "querulous",
  "quixotic", "radiant", "rancor", "rapacious", "recalcitrant", "reconcile", "redolent", "reflect",
  "rejoice", "relentless", "remedy", "renew", "resilience", "reticent", "reverence", "reverent",
  "rhapsody", "righteous", "robust", "ruminate", "sacred", "sagacious", "sanctimonious", "sardonic",
  "scrupulous", "serendipity", "serene", "simplicity", "sincerity", "skeptical", "solace", "solipsism",
  "solivagant", "sonder", "soothe", "specious", "steadfast", "stoic", "stolid", "strive",
  "stymie", "sublime", "succinct", "surreptitious", "susurrus", "syzygy", "taciturn", "tangential",
  "temerity", "temperate", "tenacious", "terse", "thrive", "timorous", "tintinnabulation", "torpor",
  "tranquil", "transform", "transient", "triumph", "truculent", "ubiquitous", "umbrage", "unequivocal",
  "unflinching", "uplift", "urbane", "vacuous", "valor", "vapid", "veracious", "verbose",
  "vibrant", "vicarious", "vigilant", "vindictive", "virtuous", "virulent", "visceral", "vision",
  "vivacious", "vociferous", "vulnerable", "whimsical", "wisdom", "wistful", "wonder", "yearning",
  "zealous", "zenith", "zephyr",
];

const fetchWithTimeout = async (url: string, timeoutMs = 8000): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

const fetchWithRetry = async (url: string, retries = 2): Promise<Response> => {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetchWithTimeout(url);
      if (res.ok) return res;
      if (res.status === 404) throw new Error('WORD_NOT_FOUND');
    } catch (e: any) {
      if (i === retries || e.message === 'WORD_NOT_FOUND') throw e;
      await new Promise(r => setTimeout(r, 800 * Math.pow(2, i)));
    }
  }
  throw new Error('MAX_RETRIES');
};

const parseApiResponse = (data: any[]): Omit<Word, 'date'> => {
  const entry = data[0];
  const meaning = entry.meanings[0];
  const def = meaning.definitions[0];
  return {
    word: entry.word,
    phonetic: entry.phonetic || entry.phonetics?.find((p: any) => p.text)?.text || '',
    partOfSpeech: meaning.partOfSpeech,
    definition: def.definition,
    example: def.example || '',
    synonyms: [...(meaning.synonyms || []), ...(def.synonyms || [])].slice(0, 4),
  };
};

export const getDailyWord = (): string => {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((today.getTime() - start.getTime()) / 86400000);
  // Offset by year so Jan 1 2026 != Jan 1 2027
  const seed = (today.getFullYear() - 2024) * 366 + dayOfYear;
  return WORD_LIST[seed % WORD_LIST.length];
};

export const fetchWordOfTheDay = async (): Promise<Word> => {
  const word = getDailyWord();
  const date = new Date().toISOString().split('T')[0];
  try {
    const res = await fetchWithRetry(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    return { ...parseApiResponse(data), date };
  } catch {
    throw new Error('Unable to load word. Please check your connection.');
  }
};

export const fetchArbitraryWord = async (word: string): Promise<Word> => {
  const res = await fetchWithRetry(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.toLowerCase().trim())}`
  );
  const data = await res.json();
  return { ...parseApiResponse(data), date: new Date().toISOString().split('T')[0] };
};

export const fetchRandomWord = async (exclude?: string): Promise<Word> => {
  const pool = exclude ? WORD_LIST.filter(w => w !== exclude) : WORD_LIST;
  const word = pool[Math.floor(Math.random() * pool.length)];
  try {
    const res = await fetchWithRetry(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await res.json();
    return { ...parseApiResponse(data), date: new Date().toISOString().split('T')[0] };
  } catch {
    throw new Error('Unable to load word. Please check your connection.');
  }
};
