import React, { useState, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  BookOpen,
  Layers,
  Table as TableIcon,
  HelpCircle,
  CheckCircle,
  Search,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  X,
  Play,
  Lightbulb,
  GraduationCap,
  FileText
} from 'lucide-react';
import {
  APP_HEADER,
  FULL_TEXT_PARAGRAPHS,
  WORD_CATEGORIES,
  MEMORY_TABLE_ROWS,
  ANALYZED_WORDS,
  QA_QUESTIONS,
  SHORT_TEXT_PARAGRAPHS
} from './data.ts';
import { ViewMode, ActiveTab, WordCategory } from './types.ts';
import { speakSpanish, stopSpeaking } from './speech.ts';

interface TranslationModalData {
  titleEs: string;
  titleHy: string;
  contentEs: string;
  contentHy: string;
  extraInfo?: string;
  syllables?: string;
  categoryBadge?: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('click-to-reveal');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Modal for clicking any Spanish element
  const [modalData, setModalData] = useState<TranslationModalData | null>(null);

  // Quiz / Trainer State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswerRevealed, setQuizAnswerRevealed] = useState(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });
  const [wordPracticeIndex, setWordPracticeIndex] = useState(0);
  const [selectedWordCategory, setSelectedWordCategory] = useState<string | null>(null);
  const [wordPracticeFeedback, setWordPracticeFeedback] = useState<boolean | null>(null);

  // All words pool for categorization practice
  const practiceWords = useMemo(() => [
    { word: 'canción', type: 'Aguda', reasonEs: 'Termina en n, acento en la última sílaba', reasonHy: 'Վերջանում է n-ով, շեշտը վերջին վանկի վրա է' },
    { word: 'café', type: 'Aguda', reasonEs: 'Termina en vocal, acento en la última sílaba', reasonHy: 'Վերջանում է ձայնավորով, շեշտը վերջին վանկի վրա է' },
    { word: 'compás', type: 'Aguda', reasonEs: 'Termina en s, acento en la última sílaba', reasonHy: 'Վերջանում է s-ով, շեշտը վերջին վանկի վրա է' },
    { word: 'también', type: 'Aguda', reasonEs: 'Termina en n, acento en la última sílaba', reasonHy: 'Վերջանում է n-ով, շեշտը վերջին վանկի վրա է' },
    { word: 'reloj', type: 'Aguda', reasonEs: 'Aguda sin tilde (termina en j)', reasonHy: 'Aguda առանց շեշտանիշի (վերջանում է j-ով)' },
    { word: 'doctor', type: 'Aguda', reasonEs: 'Aguda sin tilde (termina en r)', reasonHy: 'Aguda առանց շեշտանիշի (վերջանում է r-ով)' },
    { word: 'papel', type: 'Aguda', reasonEs: 'Aguda sin tilde (termina en l)', reasonHy: 'Aguda առանց շեշտանիշի (վերջանում է l-ով)' },
    { word: 'árbol', type: 'Llana', reasonEs: 'Termina en l (no vocal, n, s)', reasonHy: 'Շեշտը նախավերջին վանկում է, վերջանում է l-ով' },
    { word: 'lápiz', type: 'Llana', reasonEs: 'Termina en z (no vocal, n, s)', reasonHy: 'Շեշտը նախավերջին վանկում է, վերջանում է z-ով' },
    { word: 'fácil', type: 'Llana', reasonEs: 'Termina en l (no vocal, n, s)', reasonHy: 'Շեշտը նախավերջին վանկում է, վերջանում է l-ով' },
    { word: 'azúcar', type: 'Llana', reasonEs: 'Termina en r (no vocal, n, s)', reasonHy: 'Շեշտը նախավերջին վանկում է, վերջանում է r-ով' },
    { word: 'casa', type: 'Llana', reasonEs: 'Llana sin tilde (termina en vocal)', reasonHy: 'Llana առանց շեշտանիշի (վերջանում է ձայնավորով)' },
    { word: 'mesa', type: 'Llana', reasonEs: 'Llana sin tilde (termina en vocal)', reasonHy: 'Llana առանց շեշտանիշի (վերջանում է ձայնավորով)' },
    { word: 'joven', type: 'Llana', reasonEs: 'Llana sin tilde (termina en n)', reasonHy: 'Llana առանց շեշտանիշի (վերջանում է n-ով)' },
    { word: 'lunes', type: 'Llana', reasonEs: 'Llana sin tilde (termina en s)', reasonHy: 'Llana առանց շեշտանիշի (վերջանում է s-ով)' },
    { word: 'música', type: 'Esdrújula', reasonEs: 'Acento en antepenúltima sílaba (siempre tilde)', reasonHy: 'Շեշտը վերջից 3-րդ վանկում է (միշտ շեշտանիշով)' },
    { word: 'teléfono', type: 'Esdrújula', reasonEs: 'Acento en antepenúltima sílaba (siempre tilde)', reasonHy: 'Շեշտը վերջից 3-րդ վանկում է (միշտ շեշտանիշով)' },
    { word: 'médico', type: 'Esdrújula', reasonEs: 'Acento en antepenúltima sílaba (siempre tilde)', reasonHy: 'Շեշտը վերջից 3-րդ վանկում է (միշտ շեշտանիշով)' },
    { word: 'pájaro', type: 'Esdrújula', reasonEs: 'Acento en antepenúltima sílaba (siempre tilde)', reasonHy: 'Շեշտը վերջից 3-րդ վանկում է (միշտ շեշտանիշով)' },
    { word: 'sábado', type: 'Esdrújula', reasonEs: 'Acento en antepenúltima sílaba (siempre tilde)', reasonHy: 'Շեշտը վերջից 3-րդ վանկում է (միշտ շեշտանիշով)' },
    { word: 'dígamelo', type: 'Sobresdrújula', reasonEs: 'Acento antes de la antepenúltima sílaba', reasonHy: 'Շեշտը վերջից երրորդից առաջ է' },
    { word: 'cuéntamelo', type: 'Sobresdrújula', reasonEs: 'Acento antes de la antepenúltima sílaba', reasonHy: 'Շեշտը վերջից երրորդից առաջ է' },
    { word: 'explícaselo', type: 'Sobresdrújula', reasonEs: 'Acento antes de la antepenúltima sílaba', reasonHy: 'Շեշտը վերջից երրորդից առաջ է' },
  ], []);

  // Audio speech handler
  const handlePlayAudio = (id: string, text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (audioPlaying === id) {
      stopSpeaking();
      setAudioPlaying(null);
      return;
    }
    setAudioPlaying(id);
    speakSpanish(text, speechRate).then(() => {
      setAudioPlaying(null);
    });
  };

  // Toggle single item reveal
  const toggleReveal = (id: string) => {
    setRevealedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Open full modal for a clicked item
  const openModal = (
    titleEs: string,
    titleHy: string,
    contentEs: string,
    contentHy: string,
    extraInfo?: string,
    syllables?: string,
    categoryBadge?: string
  ) => {
    setModalData({
      titleEs,
      titleHy,
      contentEs,
      contentHy,
      extraInfo,
      syllables,
      categoryBadge
    });
  };

  // Copy to clipboard helper
  const handleCopy = (id: string, text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Check if item is revealed based on viewMode
  const isItemRevealed = (id: string) => {
    if (viewMode === 'bilingual') return true;
    return !!revealedIds[id];
  };

  // Filter helper
  const matchesSearch = (textEs: string, textHy: string) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return textEs.toLowerCase().includes(term) || textHy.toLowerCase().includes(term);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-slate-50 to-slate-100/70 text-slate-800">
      {/* Top Banner / Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-amber-200/60 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Title & Badges */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md font-bold text-lg shrink-0">
                5
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                    🇪🇸 Español
                  </span>
                  <span className="text-slate-400">↔</span>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
                    🇦🇲 Հայերեն
                  </span>
                  <span className="text-xs text-amber-700 font-medium hidden sm:inline-block bg-amber-50 px-2 py-0.5 rounded border border-amber-200/70">
                    💡 Սեղմիր իսպաներենի վրա՝ հայերենը բացելու համար
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
                  <span>{APP_HEADER.titleEs}</span>
                  <span className="text-slate-400 text-base font-normal">/</span>
                  <span className="text-amber-800 font-bold text-base sm:text-lg">{APP_HEADER.titleHy}</span>
                </h1>
              </div>
            </div>

            {/* Quick Controls: View Modes & Speed */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* View Mode Toggle */}
              <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex text-xs font-medium">
                <button
                  onClick={() => setViewMode('click-to-reveal')}
                  title="Կտտացնելով բացել հայերենը"
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === 'click-to-reveal'
                      ? 'bg-white shadow-xs text-amber-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-amber-600" />
                  <span>Սեղմիր բացվի</span>
                </button>
                <button
                  onClick={() => setViewMode('bilingual')}
                  title="Միշտ ցուցադրել երկու լեզուներն էլ"
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === 'bilingual'
                      ? 'bg-white shadow-xs text-amber-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Զուգահեռ</span>
                </button>
                <button
                  onClick={() => setViewMode('arm-to-esp')}
                  title="Հայերենը տեսնել, սեղմել իսպաներենը բացելու համար"
                  className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewMode === 'arm-to-esp'
                      ? 'bg-white shadow-xs text-amber-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
                  <span>🇦🇲 ➔ 🇪🇸</span>
                </button>
              </div>

              {/* Audio Speed Rate */}
              <button
                onClick={() => setSpeechRate(rate => (rate === 0.9 ? 0.7 : 0.9))}
                title="Փոխել ձայնի արագությունը (դանդաղ/նորմալ)"
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1 shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{speechRate === 0.7 ? '🐌 0.7x' : '⚡ 0.9x'}</span>
              </button>

              {/* Reveal/Hide All for Click-to-reveal */}
              {viewMode === 'click-to-reveal' && (
                <button
                  onClick={() => {
                    const allIds = [
                      ...FULL_TEXT_PARAGRAPHS.map(p => p.id),
                      ...WORD_CATEGORIES.map(c => c.id),
                      ...ANALYZED_WORDS.map(a => a.id),
                      ...QA_QUESTIONS.map(q => `qa-${q.id}`),
                      ...SHORT_TEXT_PARAGRAPHS.map(s => s.id)
                    ];
                    const allRevealed = allIds.every(id => revealedIds[id]);
                    const next: Record<string, boolean> = {};
                    if (!allRevealed) {
                      allIds.forEach(id => { next[id] = true; });
                    }
                    setRevealedIds(next);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-xs font-semibold text-amber-900 flex items-center gap-1 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Բոլորը</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
                activeTab === 'all'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Բոլորը (Все)</span>
            </button>

            <button
              onClick={() => setActiveTab('fulltext')}
              className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
                activeTab === 'fulltext'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Լիարժեք տեքստ</span>
            </button>

            <button
              onClick={() => setActiveTab('types')}
              className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
                activeTab === 'types'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>4 Տեսակներ</span>
            </button>

            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
                activeTab === 'table'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Աղյուսակ</span>
            </button>

            <button
              onClick={() => setActiveTab('examples')}
              className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
                activeTab === 'examples'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Վերլուծված օրինակներ</span>
            </button>

            <button
              onClick={() => setActiveTab('qa')}
              className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
                activeTab === 'qa'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>14 Հարց ու պատասխան</span>
            </button>

            <button
              onClick={() => setActiveTab('shorttext')}
              className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
                activeTab === 'shorttext'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Կարճ տեքստ</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
                activeTab === 'quiz'
                  ? 'bg-purple-700 text-white shadow-xs font-bold'
                  : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Վարժանք և Թեստ</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-10">

        {/* Global Search and Interactive Tip Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Որոնել բառ, կանոն, հարց..."
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 bg-amber-50/80 px-4 py-2 rounded-xl border border-amber-200/70 w-full md:w-auto">
            <span className="text-lg">👆</span>
            <div>
              <p className="font-semibold text-amber-950">
                Կտտացրու ցանկացած իսպաներեն նախադասության կամ բառի վրա
              </p>
              <p className="text-amber-800 text-xs">
                Անմիջապես կբացվի հայերեն ամբողջական թարգմանությունն ու բացատրությունը
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 1: TEXTO COMPLETO / ԼԻԱՐԺԵՔ ՏԵՔՍՏ */}
        {(activeTab === 'all' || activeTab === 'fulltext') && (
          <section id="full-text-section" className="space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
                  Բաժին 1 • Sección 1
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>Texto completo</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-amber-800">Լիարժեք տեքստ</span>
                </h2>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                {FULL_TEXT_PARAGRAPHS.length} պարբերություն
              </span>
            </div>

            <div className="grid gap-3.5">
              {FULL_TEXT_PARAGRAPHS
                .filter(p => matchesSearch(p.es, p.hy))
                .map((item, idx) => {
                  const revealed = isItemRevealed(item.id);
                  const isAudioRunning = audioPlaying === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        toggleReveal(item.id);
                        openModal(
                          `Texto completo #${idx + 1}`,
                          `Լիարժեք տեքստ #${idx + 1}`,
                          item.es,
                          item.hy,
                          item.badge
                        );
                      }}
                      className="group relative bg-white hover:bg-amber-50/30 rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-amber-300 shadow-2xs hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900">
                          {item.badge || `Պարբերություն ${idx + 1}`}
                        </span>

                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={e => handlePlayAudio(item.id, item.es, e)}
                            title="Լսել իսպաներեն արտասանությունը"
                            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                              isAudioRunning
                                ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                                : 'bg-slate-100 hover:bg-amber-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline font-medium">Լսել</span>
                          </button>
                          <button
                            onClick={e => handleCopy(item.id, item.es, e)}
                            title="Պատճենել իսպաներեն տեքստը"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Display based on ViewMode */}
                      {viewMode === 'arm-to-esp' ? (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-blue-700">🇦🇲 Հայերեն:</span>
                          </div>
                          <p className="text-slate-800 font-medium leading-relaxed">
                            {item.hy}
                          </p>
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            {revealed ? (
                              <p className="text-amber-950 font-semibold leading-relaxed">
                                <span className="text-xs font-bold text-amber-600 block mb-1">🇪🇸 Español:</span>
                                {item.es}
                              </p>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-md">
                                <Eye className="w-3.5 h-3.5" /> Սեղմիր իսպաներենը տեսնելու համար
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          {/* Spanish Text (Always shown in default / bilingual) */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-amber-700">🇪🇸 Español:</span>
                            <span className="text-[11px] text-slate-400 group-hover:text-amber-600 transition-colors">
                              (սեղմիր հայերեն թարգմանության համար)
                            </span>
                          </div>
                          <p className="text-slate-900 font-semibold text-base sm:text-lg leading-relaxed group-hover:text-amber-950">
                            {item.es}
                          </p>

                          {/* Armenian translation */}
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            {revealed ? (
                              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-blue-950 leading-relaxed text-sm sm:text-base animate-in fade-in duration-200">
                                <span className="text-xs font-bold text-blue-700 block mb-1">🇦🇲 Հայերեն թարգմանություն:</span>
                                {item.hy}
                              </div>
                            ) : (
                              <div className="flex items-center justify-between text-xs text-slate-500 py-1">
                                <span className="flex items-center gap-1.5 text-blue-700 font-medium group-hover:underline">
                                  <Eye className="w-3.5 h-3.5" /> Ցույց տալ հայերեն թարգմանությունը
                                </span>
                                <span className="text-slate-400 text-[11px]">Կտտացրու քարտին</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* SECTION 2: TIPOS DE PALABRAS / 4 ՏԵՍԱԿՆԵՐԸ */}
        {(activeTab === 'all' || activeTab === 'types') && (
          <section id="types-section" className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
                Բաժին 2 • Sección 2
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>Tipos de palabras según la sílaba tónica</span>
                <span className="text-slate-300">/</span>
                <span className="text-amber-800">Բառերի տեսակները ըստ շեշտված վանկի</span>
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                4 հիմնական խմբերը՝ իրենց կանոններով և օրինակներով
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {WORD_CATEGORIES
                .filter(c => matchesSearch(c.esTitle + ' ' + c.esRule, c.hyTitle + ' ' + c.hyRule))
                .map((cat: WordCategory) => {
                  const cardId = `cat-${cat.id}`;
                  const isRevealed = isItemRevealed(cardId);

                  return (
                    <div
                      key={cat.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Header of category */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 font-extrabold flex items-center justify-center text-sm">
                              {cat.typeNumber}
                            </span>
                            <div>
                              <h3
                                onClick={() => openModal(cat.esTitle, cat.hyTitle, cat.esDescription, cat.hyDescription, cat.esRule)}
                                className="font-extrabold text-lg text-slate-900 hover:text-amber-700 cursor-pointer flex items-center gap-1.5"
                              >
                                {cat.esTitle}
                                <span className="text-xs text-amber-600 font-normal underline">🇪🇸</span>
                              </h3>
                              <p className="text-xs text-amber-800 font-medium">
                                {cat.hyTitle}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={e => handlePlayAudio(`cat-title-${cat.id}`, cat.esTitle, e)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 border border-slate-200"
                            title="Լսել անվանումը"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Syllable Stress Position */}
                        <div
                          onClick={() => toggleReveal(cardId)}
                          className="bg-slate-50 hover:bg-amber-50/50 p-3 rounded-xl border border-slate-200/80 cursor-pointer mb-4 transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span className="font-semibold text-amber-900">Շեշտված վանկի դիրքը / Sílaba tónica:</span>
                            <span className="text-amber-700 font-medium">Սեղմիր թարգմանության համար</span>
                          </div>
                          <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span>🇪🇸 {cat.esDescription}</span>
                          </p>
                          {(isRevealed || viewMode === 'bilingual') && (
                            <p className="text-sm font-semibold text-blue-900 mt-1.5 pt-1.5 border-t border-slate-200">
                              🇦🇲 {cat.hyDescription}
                            </p>
                          )}
                        </div>

                        {/* Accent Rule */}
                        <div
                          onClick={() => toggleReveal(cardId)}
                          className="bg-amber-50/60 hover:bg-amber-100/60 p-3.5 rounded-xl border border-amber-200/80 cursor-pointer mb-4 transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs text-amber-900 font-bold mb-1">
                            <span>Շեշտադրման կանոնը / Regla de tilde:</span>
                            <span className="text-xs font-normal text-amber-700">👆</span>
                          </div>
                          <p className="text-sm font-bold text-amber-950">
                            🇪🇸 {cat.esRule}
                          </p>
                          {(isRevealed || viewMode === 'bilingual') && (
                            <p className="text-sm font-semibold text-blue-950 mt-1.5 pt-1.5 border-t border-amber-200/70">
                              🇦🇲 {cat.hyRule}
                            </p>
                          )}
                        </div>

                        {/* Accented Examples */}
                        <div className="mb-4">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                            Օրինակներ շեշտանիշով (Con tilde):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {cat.accentedExamples.map((ex, idx) => (
                              <button
                                key={idx}
                                onClick={() => openModal(
                                  ex.word,
                                  ex.hyMeaning || '',
                                  `${ex.word} (${cat.esTitle})`,
                                  `${ex.word} — ${ex.hyMeaning || ''}`,
                                  ex.note
                                )}
                                className="group/word inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/70 hover:bg-amber-200 text-amber-950 font-bold text-sm border border-amber-300 transition-all shadow-2xs"
                              >
                                <span>{ex.word}</span>
                                {ex.hyMeaning && (
                                  <span className="text-xs font-medium text-amber-800">
                                    • {ex.hyMeaning}
                                  </span>
                                )}
                                <span
                                  onClick={e => {
                                    e.stopPropagation();
                                    handlePlayAudio(`ex-${ex.word}`, ex.word);
                                  }}
                                  className="p-1 rounded-md hover:bg-amber-300 text-amber-800"
                                  title="Լսել"
                                >
                                  <Volume2 className="w-3 h-3" />
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Unaccented Examples (if applicable) */}
                        {cat.unaccentedExamples && cat.unaccentedExamples.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                              Բայց առանց շեշտանիշի (Pero no llevan tilde):
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {cat.unaccentedExamples.map((ex, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => openModal(
                                    ex.word,
                                    ex.hyMeaning || '',
                                    `${ex.word} (${cat.esTitle} sin tilde)`,
                                    `${ex.word} — ${ex.hyMeaning || ''}`,
                                    ex.note
                                  )}
                                  className="group/word inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all"
                                >
                                  <span>{ex.word}</span>
                                  {ex.hyMeaning && (
                                    <span className="text-xs font-medium text-slate-500">
                                      • {ex.hyMeaning}
                                    </span>
                                  )}
                                  <span
                                    onClick={e => {
                                      e.stopPropagation();
                                      handlePlayAudio(`ex-${ex.word}`, ex.word);
                                    }}
                                    className="p-1 rounded-md hover:bg-slate-300 text-slate-600"
                                    title="Լսել"
                                  >
                                    <Volume2 className="w-3 h-3" />
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Շեշտը՝ {cat.stressSyllableHy}
                        </span>
                        <button
                          onClick={() => toggleReveal(cardId)}
                          className="text-amber-700 hover:text-amber-900 font-semibold"
                        >
                          {isRevealed ? 'Փակել' : 'Մանրամասն'}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* SECTION 3: REGLA RÁPIDA PARA MEMORIZAR / ԱՐԱԳ ԿԱՆՈՆՆԵՐԻ ԱՂՅՈՒՍԱԿ */}
        {(activeTab === 'all' || activeTab === 'table') && (
          <section id="table-section" className="space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
                  Բաժին 3 • Sección 3
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>Regla rápida para memorizar</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-amber-800">Արագ կանոն՝ հիշելու համար</span>
                </h2>
              </div>
              <span className="text-xs text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-medium">
                4 խումբ
              </span>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-amber-500/10 border-b border-amber-200/80 text-amber-950 font-bold text-xs sm:text-sm">
                    <th className="py-3 px-4 sm:px-6">Տեսակ / Tipo</th>
                    <th className="py-3 px-4 sm:px-6">Շեշտված վանկ / Sílaba tónica</th>
                    <th className="py-3 px-4 sm:px-6">Շեշտադրման կանոն / Regla de tilde</th>
                    <th className="py-3 px-4 sm:px-6">Օրինակներ / Ejemplos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {MEMORY_TABLE_ROWS.map((row, idx) => (
                    <tr
                      key={idx}
                      onClick={() => openModal(
                        `${row.typeEs} (${row.stressEs})`,
                        `${row.typeHy} (${row.stressHy})`,
                        `Regla de tilde: ${row.ruleEs}. Ejemplos: ${row.example}`,
                        `Շեշտանիշի կանոն՝ ${row.ruleHy}։ Օրինակներ՝ ${row.example}`,
                        `Շեշտը ընկնում է ${row.stressHy} վանկի վրա`
                      )}
                      className="hover:bg-amber-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-extrabold text-slate-900 group-hover:text-amber-800">
                          {row.typeEs}
                        </div>
                        <div className="text-xs text-slate-500">
                          {row.typeHy}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-semibold text-xs inline-block">
                          🇪🇸 {row.stressEs}
                        </span>
                        <div className="text-xs text-slate-600 mt-1 font-medium">
                          🇦🇲 {row.stressHy}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold text-xs inline-block">
                          🇪🇸 {row.ruleEs}
                        </span>
                        <div className="text-xs text-amber-900 mt-1 font-semibold">
                          🇦🇲 {row.ruleHy}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-mono text-xs font-semibold text-slate-700">
                          {row.example}
                        </div>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handlePlayAudio(`table-ex-${idx}`, row.example);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 mt-1 font-medium"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Լսել</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* SECTION 4: EJEMPLOS ANALIZADOS / ՎԵՐԼՈՒԾՎԱԾ ՕՐԻՆԱԿՆԵՐ */}
        {(activeTab === 'all' || activeTab === 'examples') && (
          <section id="examples-section" className="space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
                  Բաժին 4 • Sección 4
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>Ejemplos analizados</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-amber-800">Վերլուծված օրինակներ</span>
                </h2>
              </div>
              <span className="text-xs text-purple-800 bg-purple-100 px-3 py-1 rounded-full font-medium">
                Վանկատում և վերլուծություն
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {ANALYZED_WORDS
                .filter(w => matchesSearch(w.word + ' ' + w.analysisEs, w.analysisHy))
                .map(item => {
                  const revealed = isItemRevealed(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        toggleReveal(item.id);
                        openModal(
                          item.word,
                          item.typeHy,
                          item.analysisEs,
                          item.analysisHy,
                          `Վանկատում՝ ${item.syllables}`,
                          item.syllables,
                          item.typeEs
                        );
                      }}
                      className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-extrabold text-xs">
                            {item.typeEs}
                          </span>
                          <button
                            onClick={e => handlePlayAudio(item.id, item.word, e)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700"
                            title="Լսել բառը"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Word & Syllable Breakdown */}
                        <div className="text-center py-3 bg-slate-50 rounded-xl border border-slate-100 mb-3">
                          <h3 className="text-2xl font-extrabold text-slate-900 tracking-wide">
                            {item.word}
                          </h3>
                          <div className="mt-1 font-mono text-sm font-bold text-amber-800 tracking-wider">
                            {item.syllables}
                          </div>
                        </div>

                        {/* Spanish Analysis */}
                        <div className="space-y-1 mb-2">
                          <span className="text-xs font-bold text-amber-700 block">🇪🇸 Análisis:</span>
                          <p className="text-sm font-semibold text-slate-800 leading-snug">
                            {item.analysisEs}
                          </p>
                        </div>

                        {/* Armenian Analysis */}
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          {revealed || viewMode === 'bilingual' ? (
                            <div className="bg-blue-50/80 p-2.5 rounded-xl border border-blue-100">
                              <span className="text-xs font-bold text-blue-700 block mb-0.5">🇦🇲 Հայերեն վերլուծություն:</span>
                              <p className="text-xs sm:text-sm font-medium text-blue-950">
                                {item.analysisHy}
                              </p>
                            </div>
                          ) : (
                            <div className="text-xs text-blue-600 font-medium flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              <span>Սեղմիր հայերենը տեսնելու համար</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* SECTION 5: PREGUNTAS Y RESPUESTAS / 14 ՀԱՐՑ ԵՎ ՊԱՏԱՍԽԱՆ */}
        {(activeTab === 'all' || activeTab === 'qa') && (
          <section id="qa-section" className="space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
                  Բաժին 5 • Sección 5
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>Preguntas y respuestas</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-amber-800">Հարցեր և պատասխաններ</span>
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Բոլոր 14 հարցերն ու պատասխանները՝ իսպաներենով և հայերենով
                </p>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                14 Հարց
              </span>
            </div>

            <div className="grid gap-3">
              {QA_QUESTIONS
                .filter(q => matchesSearch(q.questionEs + ' ' + q.answerEs, q.questionHy + ' ' + q.answerHy))
                .map(qa => {
                  const qaId = `qa-${qa.id}`;
                  const isRevealed = isItemRevealed(qaId);

                  return (
                    <div
                      key={qa.id}
                      onClick={() => {
                        toggleReveal(qaId);
                        openModal(
                          qa.questionEs,
                          qa.questionHy,
                          `Respuesta: ${qa.answerEs}`,
                          `Պատասխան՝ ${qa.answerHy}`,
                          `Հարց #${qa.id}`
                        );
                      }}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            {qa.id}
                          </span>

                          <div className="space-y-1.5">
                            {/* Question in Spanish */}
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-xs font-bold text-amber-700">🇪🇸 Հարց:</span>
                              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 hover:text-amber-800">
                                {qa.questionEs}
                              </h4>
                            </div>

                            {/* Question in Armenian */}
                            <p className="text-xs sm:text-sm font-semibold text-amber-900/90 pl-6">
                              🇦🇲 {qa.questionHy}
                            </p>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={e => handlePlayAudio(`qa-${qa.id}`, `${qa.questionEs} ... ${qa.answerEs}`, e)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 border border-slate-200 text-xs flex items-center gap-1"
                            title="Լսել հարցն ու պատասխանը"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Լսել</span>
                          </button>
                        </div>
                      </div>

                      {/* Answer Section */}
                      <div className="mt-4 pt-3 border-t border-slate-100 pl-10">
                        {isRevealed || viewMode === 'bilingual' ? (
                          <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 space-y-1 animate-in fade-in duration-150">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-800">🇪🇸 Պատասխան:</span>
                              <span className="text-emerald-950 font-bold text-sm sm:text-base">
                                {qa.answerEs}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 pt-1 border-t border-emerald-100">
                              <span className="text-xs font-bold text-blue-800">🇦🇲 Հայերեն:</span>
                              <span className="text-blue-950 font-semibold text-sm">
                                {qa.answerHy}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs text-slate-500 py-1">
                            <span className="text-amber-800 font-semibold flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> Կտտացրու պատասխանը բացելու համար
                            </span>
                            <span className="text-slate-400 text-[11px]">👆 Սեղմիր</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* SECTION 6: TEXTO CORTO / ԿԱՐՃ ՏԵՔՍՏ */}
        {(activeTab === 'all' || activeTab === 'shorttext') && (
          <section id="short-text-section" className="space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
                  Բաժին 6 • Sección 6
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>Texto corto</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-amber-800">Կարճ տեքստ</span>
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  Ամփոփ համառոտագիր արագ վերհիշելու համար
                </p>
              </div>
              <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                Ամփոփում
              </span>
            </div>

            <div className="grid gap-3.5">
              {SHORT_TEXT_PARAGRAPHS
                .filter(s => matchesSearch(s.es, s.hy))
                .map((item, idx) => {
                  const isRevealed = isItemRevealed(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        toggleReveal(item.id);
                        openModal(
                          `Texto corto #${idx + 1}`,
                          `Կարճ տեքստ #${idx + 1}`,
                          item.es,
                          item.hy
                        );
                      }}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <button
                          onClick={e => handlePlayAudio(item.id, item.es, e)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 border border-slate-200 text-xs flex items-center gap-1"
                          title="Լսել"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Լսել</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                          🇪🇸 {item.es}
                        </p>

                        <div className="pt-2 border-t border-slate-100">
                          {isRevealed || viewMode === 'bilingual' ? (
                            <p className="text-sm sm:text-base font-semibold text-blue-900 bg-blue-50/70 p-3 rounded-xl border border-blue-100 leading-relaxed">
                              🇦🇲 {item.hy}
                            </p>
                          ) : (
                            <span className="text-xs text-blue-700 font-medium flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> Սեղմիր հայերեն թարգմանության համար
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* SECTION 7: INTERACTIVE TRAINER & QUIZ / ՎԱՐԺԱՆՔ ԵՎ ԹԵՍՏ */}
        {activeTab === 'quiz' && (
          <section id="quiz-section" className="space-y-8">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-xs font-bold tracking-wider text-purple-600 uppercase">
                Ինտերակտիվ վարժանք • Entrenamiento Interactivo
              </span>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>Գիտելիքների Ստուգում և Պրակտիկա</span>
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Փորձիր որոշել բառերի տեսակը կամ ստուգիր քեզ 14 հարցերի միջոցով
              </p>
            </div>

            {/* Sub-Trainer 1: Word Category Identifier Game */}
            <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-bold">
                  Վարժություն 1. Որոշիր բառի տեսակը ({wordPracticeIndex + 1} / {practiceWords.length})
                </span>
                <span className="text-xs text-slate-500">
                  Հաշիվ՝ {quizScore.correct} / {quizScore.total}
                </span>
              </div>

              {/* Current Word to test */}
              <div className="text-center py-6 bg-gradient-to-b from-purple-50/50 to-white rounded-2xl border border-purple-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest block mb-1">
                  Ինչպիսի՞ բառ է սա (¿Qué tipo de palabra es?)
                </span>
                <h3 className="text-4xl font-black text-purple-950 tracking-wide mb-2">
                  {practiceWords[wordPracticeIndex].word}
                </h3>
                <button
                  onClick={() => handlePlayAudio('quiz-word', practiceWords[wordPracticeIndex].word)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-purple-100 text-purple-800 text-xs font-bold border border-purple-200 shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Լսել արտասանությունը</span>
                </button>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Aguda', 'Llana', 'Esdrújula', 'Sobresdrújula'].map(catType => {
                  const currentWord = practiceWords[wordPracticeIndex];
                  const isSelected = selectedWordCategory === catType;
                  const isCorrect = isSelected && catType === currentWord.type;
                  const isWrong = isSelected && catType !== currentWord.type;

                  return (
                    <button
                      key={catType}
                      disabled={wordPracticeFeedback !== null}
                      onClick={() => {
                        setSelectedWordCategory(catType);
                        const correct = catType === currentWord.type;
                        setWordPracticeFeedback(correct);
                        setQuizScore(prev => ({
                          correct: prev.correct + (correct ? 1 : 0),
                          total: prev.total + 1
                        }));
                      }}
                      className={`p-3.5 rounded-xl font-extrabold text-sm sm:text-base border transition-all text-center ${
                        isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : isWrong
                          ? 'bg-rose-500 text-white border-rose-600'
                          : wordPracticeFeedback !== null && catType === currentWord.type
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                          : 'bg-slate-50 hover:bg-purple-50 text-slate-800 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      {catType}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Explanation */}
              {wordPracticeFeedback !== null && (
                <div className={`p-4 rounded-xl border ${
                  wordPracticeFeedback ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 text-base mb-1">
                    {wordPracticeFeedback ? '✅ Ճիշտ է! (¡Correcto!)' : '❌ Սխալ է (Incorrecto)'}
                  </div>
                  <p className="text-sm font-semibold">
                    🇪🇸 {practiceWords[wordPracticeIndex].reasonEs}
                  </p>
                  <p className="text-xs sm:text-sm font-medium mt-1 text-slate-700">
                    🇦🇲 {practiceWords[wordPracticeIndex].reasonHy}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedWordCategory(null);
                      setWordPracticeFeedback(null);
                      setWordPracticeIndex((prev) => (prev + 1) % practiceWords.length);
                    }}
                    className="mt-3 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Հաջորդ բառը ➔
                  </button>
                </div>
              )}
            </div>

            {/* Sub-Trainer 2: Flashcards on the 14 Questions */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                  Վարժություն 2. 14 Հարցերի Ֆլեշքարտեր ({quizIndex + 1} / {QA_QUESTIONS.length})
                </span>
                <button
                  onClick={() => {
                    setQuizIndex(0);
                    setQuizAnswerRevealed(false);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Սկզբից
                </button>
              </div>

              <div
                onClick={() => setQuizAnswerRevealed(!quizAnswerRevealed)}
                className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 rounded-2xl border border-amber-200 text-center cursor-pointer min-h-48 flex flex-col justify-center items-center gap-3 transition-all hover:shadow-xs"
              >
                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                  Հարց #{QA_QUESTIONS[quizIndex].id}
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                  {QA_QUESTIONS[quizIndex].questionEs}
                </h4>
                <p className="text-sm font-semibold text-amber-900">
                  {QA_QUESTIONS[quizIndex].questionHy}
                </p>

                {quizAnswerRevealed ? (
                  <div className="mt-4 pt-4 border-t border-amber-200 w-full animate-in fade-in duration-200">
                    <span className="text-xs font-bold text-emerald-700 uppercase block mb-1">
                      Պատասխան (Respuesta)
                    </span>
                    <p className="text-lg font-extrabold text-emerald-950">
                      🇪🇸 {QA_QUESTIONS[quizIndex].answerEs}
                    </p>
                    <p className="text-sm font-semibold text-blue-900 mt-1">
                      🇦🇲 {QA_QUESTIONS[quizIndex].answerHy}
                    </p>
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-200/60 px-3 py-1.5 rounded-xl mt-2">
                    <Eye className="w-3.5 h-3.5" /> Սեղմիր պատասխանը բացելու համար
                  </span>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  disabled={quizIndex === 0}
                  onClick={() => {
                    setQuizIndex(prev => Math.max(0, prev - 1));
                    setQuizAnswerRevealed(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  ⬅ Նախորդը
                </button>

                <button
                  onClick={() => handlePlayAudio(
                    `flash-${quizIndex}`,
                    `${QA_QUESTIONS[quizIndex].questionEs}. ${QA_QUESTIONS[quizIndex].answerEs}`
                  )}
                  className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Լսել</span>
                </button>

                <button
                  disabled={quizIndex === QA_QUESTIONS.length - 1}
                  onClick={() => {
                    setQuizIndex(prev => Math.min(QA_QUESTIONS.length - 1, prev + 1));
                    setQuizAnswerRevealed(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold disabled:opacity-40"
                >
                  Հաջորդը ➔
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* DETAILED TRANSLATION POPUP / MODAL (Opens on click on Spanish text) */}
      {modalData && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setModalData(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setModalData(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              title="Փակել"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Badges */}
            <div className="flex items-center gap-2 flex-wrap pr-10">
              <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 font-bold text-xs flex items-center gap-1">
                🇪🇸 Español
              </span>
              <span className="text-slate-400">➔</span>
              <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-950 font-bold text-xs flex items-center gap-1">
                🇦🇲 Հայերեն
              </span>
              {modalData.categoryBadge && (
                <span className="px-2.5 py-1 rounded-md bg-purple-100 text-purple-950 font-bold text-xs">
                  {modalData.categoryBadge}
                </span>
              )}
            </div>

            {/* Spanish content */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  {modalData.titleEs || 'Տեքստ իսպաներենով'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePlayAudio('modal-audio', modalData.contentEs)}
                    className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 shadow-2xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Լսել</span>
                  </button>
                  <button
                    onClick={() => handleCopy('modal-copy', modalData.contentEs)}
                    className="p-1.5 rounded-lg bg-white hover:bg-amber-100 text-slate-700 border border-amber-200 text-xs"
                    title="Պատճենել"
                  >
                    {copiedId === 'modal-copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <p className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                {modalData.contentEs}
              </p>
              {modalData.syllables && (
                <p className="text-sm font-mono font-bold text-amber-900 pt-1">
                  Վանկատում՝ {modalData.syllables}
                </p>
              )}
            </div>

            {/* Armenian content */}
            <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200/80 space-y-1.5">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                {modalData.titleHy || 'Հայերեն թարգմանություն'}
              </span>
              <p className="text-base sm:text-lg font-bold text-blue-950 leading-relaxed">
                {modalData.contentHy}
              </p>
            </div>

            {/* Extra details if available */}
            {modalData.extraInfo && (
              <div className="text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                💡 <span className="text-slate-800">{modalData.extraInfo}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setModalData(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all"
              >
                Լավ է, փակել
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white mt-16 py-8 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-700">
          5. Reglas de Acentuación | Շեշտադրման Կանոնները
        </p>
        <p>
          Agudas • Llanas / Graves • Esdrújulas • Sobresdrújulas
        </p>
        <p className="text-slate-400">
          Իսպաներենի շեշտադրման ինտերակտիվ ուսումնական հավելված հայերեն թարգմանությամբ
        </p>
      </footer>
    </div>
  );
}
