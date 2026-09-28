export type ViewMode = 'click-to-reveal' | 'bilingual' | 'arm-to-esp';

export type ActiveTab = 'all' | 'fulltext' | 'types' | 'table' | 'examples' | 'qa' | 'shorttext' | 'quiz';

export interface BilingualText {
  id: string;
  es: string;
  hy: string;
  audioText?: string;
  notes?: string;
  badge?: string;
}

export interface WordCategory {
  id: string;
  typeNumber: number;
  esTitle: string;
  hyTitle: string;
  esDescription: string;
  hyDescription: string;
  esRule: string;
  hyRule: string;
  rulesList?: { es: string; hy: string }[];
  accentedExamples: { word: string; hyMeaning?: string; note?: string }[];
  unaccentedExamples?: { word: string; hyMeaning?: string; note?: string }[];
  stressSyllableEs: string;
  stressSyllableHy: string;
  badgeColor: string;
}

export interface RuleRow {
  typeEs: string;
  typeHy: string;
  stressEs: string;
  stressHy: string;
  ruleEs: string;
  ruleHy: string;
  example: string;
}

export interface AnalyzedWord {
  id: string;
  word: string;
  syllables: string;
  typeEs: string;
  typeHy: string;
  analysisEs: string;
  analysisHy: string;
  stressedIndex: number; // e.g. 1 for second, etc.
}

export interface QAQuestion {
  id: number;
  questionEs: string;
  questionHy: string;
  answerEs: string;
  answerHy: string;
  category?: string;
}
