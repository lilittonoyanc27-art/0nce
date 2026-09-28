import { BilingualText, WordCategory, RuleRow, AnalyzedWord, QAQuestion } from './types.ts';

export const APP_HEADER = {
  sectionNumber: '5',
  titleEs: 'REGLAS DE ACENTUACIÓN',
  titleHy: 'ՇԵՇՏԱԴՐՄԱՆ ԿԱՆՈՆՆԵՐԸ',
  subtitleEs: 'Guía interactiva completa con traducción al armenio y pronunciación',
  subtitleHy: 'Լիարժեք ինտերակտիվ ուղեցույց՝ իսպաներենից հայերեն թարգմանությամբ և արտասանությամբ'
};

export const FULL_TEXT_PARAGRAPHS: BilingualText[] = [
  {
    id: 'full-1',
    es: 'En español, todas las palabras tienen una sílaba que se pronuncia con más fuerza. Esa sílaba se llama sílaba tónica.',
    hy: 'Իսպաներենում բոլոր բառերն ունեն մի վանկ, որը մյուսներից ավելի ուժեղ է արտասանվում։ Այդ վանկը կոչվում է շեշտված վանկ։',
    badge: 'Sílaba tónica / Շեշտված վանկ'
  },
  {
    id: 'full-2',
    es: 'Según la posición de la sílaba tónica, las palabras se dividen en cuatro grupos principales: agudas, llanas o graves, esdrújulas y sobresdrújulas.',
    hy: 'Ըստ շեշտված վանկի դիրքի՝ բառերը բաժանվում են չորս հիմնական խմբի՝ agudas, llanas կամ graves, esdrújulas և sobresdrújulas։',
    badge: '4 Grupos / 4 Խումբ'
  },
  {
    id: 'full-3',
    es: 'Las palabras agudas tienen la sílaba tónica en la última sílaba. Llevan tilde cuando terminan en vocal, en n o en s. Por ejemplo: canción, café, también.',
    hy: 'Agudas բառերում շեշտը ընկնում է վերջին վանկի վրա։ Դրանք շեշտադրական նշան են ստանում, երբ վերջանում են ձայնավորով, n կամ s տառով։ Օրինակ՝ canción, café, también։',
    badge: '1. Agudas'
  },
  {
    id: 'full-4',
    es: 'Las palabras llanas o graves tienen la sílaba tónica en la penúltima sílaba. Llevan tilde cuando NO terminan en vocal, en n o en s. Por ejemplo: árbol, lápiz, fácil.',
    hy: 'Llanas կամ graves բառերում շեշտը ընկնում է նախավերջին վանկի վրա։ Դրանք շեշտադրական նշան են ստանում, երբ ՉԵՆ վերջանում ձայնավորով, n կամ s տառով։ Օրինակ՝ árbol, lápiz, fácil։',
    badge: '2. Llanas / Graves'
  },
  {
    id: 'full-5',
    es: 'Las palabras esdrújulas tienen la sílaba tónica en la antepenúltima sílaba. Siempre llevan tilde. Por ejemplo: música, teléfono, pájaro.',
    hy: 'Esdrújulas բառերում շեշտը ընկնում է վերջից երրորդ վանկի վրա։ Դրանք միշտ ունեն շեշտադրական նշան։ Օրինակ՝ música, teléfono, pájaro։',
    badge: '3. Esdrújulas'
  },
  {
    id: 'full-6',
    es: 'Las palabras sobresdrújulas tienen la sílaba tónica antes de la antepenúltima sílaba. También llevan siempre tilde. Por ejemplo: dígamelo, rápidamente.',
    hy: 'Sobresdrújulas բառերում շեշտը ընկնում է վերջից երրորդ վանկից էլ առաջ։ Դրանք նույնպես միշտ ունեն շեշտադրական նշան։ Օրինակ՝ dígamelo, rápidamente։',
    badge: '4. Sobresdrújulas'
  },
  {
    id: 'full-7',
    es: 'La tilde es muy importante porque ayuda a pronunciar correctamente las palabras y, en algunos casos, también permite distinguir palabras con significados diferentes.',
    hy: 'Շեշտադրական նշանը կարևոր է, որովհետև օգնում է ճիշտ արտասանել բառերը և երբեմն նաև տարբերել տարբեր իմաստ ունեցող բառերը։',
    badge: 'Importancia / Կարևորությունը'
  }
];

export const WORD_CATEGORIES: WordCategory[] = [
  {
    id: 'cat-agudas',
    typeNumber: 1,
    esTitle: 'Palabras agudas',
    hyTitle: 'Վերջին վանկում շեշտ ունեցող բառեր',
    stressSyllableEs: 'Última sílaba',
    stressSyllableHy: 'Վերջին վանկի վրա',
    esDescription: 'La sílaba tónica está en la última sílaba.',
    hyDescription: 'Շեշտը ընկնում է վերջին վանկի վրա։',
    esRule: 'Llevan tilde si terminan en: vocal, n, s',
    hyRule: 'Շեշտադրական նշան են ստանում, երբ վերջանում են ձայնավորով, n կամ s-ով։',
    rulesList: [
      { es: 'Terminan en vocal (a, e, i, o, u)', hy: 'Վերջանում են ձայնավորով (a, e, i, o, u)' },
      { es: 'Terminan en n', hy: 'Վերջանում են n տառով' },
      { es: 'Terminan en s', hy: 'Վերջանում են s տառով' }
    ],
    accentedExamples: [
      { word: 'café', hyMeaning: 'սուրճ', note: 'Termina en vocal -e' },
      { word: 'canción', hyMeaning: 'երգ', note: 'Termina en -n' },
      { word: 'compás', hyMeaning: 'ռիթմ / կարկին', note: 'Termina en -s' },
      { word: 'también', hyMeaning: 'նույնպես / նաև', note: 'Termina en -n' }
    ],
    unaccentedExamples: [
      { word: 'reloj', hyMeaning: 'ժամացույց', note: 'Termina en -j (no vocal, n, s)' },
      { word: 'doctor', hyMeaning: 'բժիշկ', note: 'Termina en -r (no vocal, n, s)' },
      { word: 'papel', hyMeaning: 'թուղթ', note: 'Termina en -l (no vocal, n, s)' }
    ],
    badgeColor: 'emerald'
  },
  {
    id: 'cat-llanas',
    typeNumber: 2,
    esTitle: 'Palabras llanas o graves',
    hyTitle: 'Նախավերջին վանկում շեշտ ունեցող բառեր',
    stressSyllableEs: 'Penúltima sílaba',
    stressSyllableHy: 'Նախավերջին վանկի վրա',
    esDescription: 'La sílaba tónica está en la penúltima sílaba.',
    hyDescription: 'Շեշտը ընկնում է նախավերջին վանկի վրա։',
    esRule: 'Llevan tilde cuando NO terminan en vocal, n o s.',
    hyRule: 'Շեշտադրական նշան ունեն, երբ ՉԵՆ վերջանում ձայնավորով, n կամ s-ով։',
    accentedExamples: [
      { word: 'árbol', hyMeaning: 'ծառ', note: 'Termina en -l' },
      { word: 'lápiz', hyMeaning: 'մատիտ', note: 'Termina en -z' },
      { word: 'fácil', hyMeaning: 'հեշտ', note: 'Termina en -l' },
      { word: 'azúcar', hyMeaning: 'շաքարավազ', note: 'Termina en -r' }
    ],
    unaccentedExamples: [
      { word: 'casa', hyMeaning: 'տուն', note: 'Termina en vocal -a' },
      { word: 'mesa', hyMeaning: 'սեղան', note: 'Termina en vocal -a' },
      { word: 'joven', hyMeaning: 'երիտասարդ', note: 'Termina en -n' },
      { word: 'lunes', hyMeaning: 'երկուշաբթի', note: 'Termina en -s' }
    ],
    badgeColor: 'sky'
  },
  {
    id: 'cat-esdrujulas',
    typeNumber: 3,
    esTitle: 'Palabras esdrújulas',
    hyTitle: 'Վերջից երրորդ վանկում շեշտ ունեցող բառեր',
    stressSyllableEs: 'Antepenúltima sílaba',
    stressSyllableHy: 'Վերջից երրորդ վանկի վրա',
    esDescription: 'La sílaba tónica está en la antepenúltima sílaba.',
    hyDescription: 'Շեշտը ընկնում է վերջից երրորդ վանկի վրա։',
    esRule: 'Siempre llevan tilde.',
    hyRule: 'Միշտ ունեն շեշտադրական նշան։',
    accentedExamples: [
      { word: 'música', hyMeaning: 'երաժշտություն', note: 'Antepenúltima sílaba' },
      { word: 'teléfono', hyMeaning: 'հեռախոս', note: 'Antepenúltima sílaba' },
      { word: 'médico', hyMeaning: 'բժիշկ', note: 'Antepenúltima sílaba' },
      { word: 'pájaro', hyMeaning: 'թռչուն', note: 'Antepenúltima sílaba' },
      { word: 'sábado', hyMeaning: 'շաբաթ (օր)', note: 'Antepenúltima sílaba' }
    ],
    badgeColor: 'purple'
  },
  {
    id: 'cat-sobresdrujulas',
    typeNumber: 4,
    esTitle: 'Palabras sobresdrújulas',
    hyTitle: 'Ավելի վաղ վանկում շեշտ ունեցող բառեր',
    stressSyllableEs: 'Antes de la antepenúltima',
    stressSyllableHy: 'Վերջից երրորդ վանկից էլ առաջ',
    esDescription: 'La sílaba tónica aparece antes de la antepenúltima sílaba.',
    hyDescription: 'Շեշտը ընկնում է վերջից երրորդ վանկից առաջ։',
    esRule: 'Siempre llevan tilde.',
    hyRule: 'Միշտ ունեն շեշտադրական նշան։',
    accentedExamples: [
      { word: 'dígamelo', hyMeaning: 'ասացեք ինձ դա', note: 'Antes de antepenúltima' },
      { word: 'cuéntamelo', hyMeaning: 'պատմիր ինձ դա', note: 'Antes de antepenúltima' },
      { word: 'explícaselo', hyMeaning: 'բացատրիր նրան դա', note: 'Antes de antepenúltima' }
    ],
    badgeColor: 'rose'
  }
];

export const MEMORY_TABLE_ROWS: RuleRow[] = [
  {
    typeEs: 'Aguda',
    typeHy: 'Aguda (վերջին վանկ)',
    stressEs: 'última',
    stressHy: 'վերջին',
    ruleEs: 'vocal, n, s',
    ruleHy: 'ձայնավոր, n, s',
    example: 'café, canción, compás'
  },
  {
    typeEs: 'Llana',
    typeHy: 'Llana (նախավերջին վանկ)',
    stressEs: 'penúltima',
    stressHy: 'նախավերջին',
    ruleEs: 'NO vocal, n, s',
    ruleHy: 'ՈՉ ձայնավոր, n, s',
    example: 'árbol, lápiz, fácil'
  },
  {
    typeEs: 'Esdrújula',
    typeHy: 'Esdrújula (վերջից 3-րդ վանկ)',
    stressEs: 'antepenúltima',
    stressHy: 'վերջից երրորդ',
    ruleEs: 'siempre',
    ruleHy: 'միշտ',
    example: 'música, teléfono, médico'
  },
  {
    typeEs: 'Sobresdrújula',
    typeHy: 'Sobresdrújula (նախքան 3-րդ վանկ)',
    stressEs: 'anterior',
    stressHy: 'նախքան վերջից երրորդ',
    ruleEs: 'siempre',
    ruleHy: 'միշտ',
    example: 'dígamelo, cuéntamelo'
  }
];

export const ANALYZED_WORDS: AnalyzedWord[] = [
  {
    id: 'ana-cancion',
    word: 'canción',
    syllables: 'can-CIÓN',
    typeEs: 'Aguda',
    typeHy: 'Aguda',
    analysisEs: 'Aguda. Termina en n, por eso lleva tilde.',
    analysisHy: 'Aguda է։ Վերջանում է n-ով, դրա համար ունի շեշտադրական նշան։',
    stressedIndex: 1
  },
  {
    id: 'ana-arbol',
    word: 'árbol',
    syllables: 'ÁR-bol',
    typeEs: 'Llana',
    typeHy: 'Llana',
    analysisEs: 'Llana. Termina en l, por eso lleva tilde.',
    analysisHy: 'Llana է։ Վերջանում է l-ով, դրա համար ունի շեշտադրական նշան։',
    stressedIndex: 0
  },
  {
    id: 'ana-musica',
    word: 'música',
    syllables: 'MÚ-si-ca',
    typeEs: 'Esdrújula',
    typeHy: 'Esdrújula',
    analysisEs: 'Esdrújula. Siempre lleva tilde.',
    analysisHy: 'Esdrújula է։ Միշտ ունի շեշտադրական նշան։',
    stressedIndex: 0
  }
];

export const QA_QUESTIONS: QAQuestion[] = [
  {
    id: 1,
    questionEs: '¿Qué es la sílaba tónica?',
    questionHy: 'Ի՞նչ է շեշտված վանկը։',
    answerEs: 'Es la sílaba que se pronuncia con más fuerza.',
    answerHy: 'Դա այն վանկն է, որն ավելի ուժեղ է արտասանվում։',
    category: 'Concepto'
  },
  {
    id: 2,
    questionEs: '¿Cuáles son los cuatro tipos de palabras según la sílaba tónica?',
    questionHy: 'Որո՞նք են բառերի չորս տեսակները ըստ շեշտված վանկի։',
    answerEs: 'Agudas, llanas, esdrújulas y sobresdrújulas.',
    answerHy: 'Agudas, llanas, esdrújulas և sobresdrújulas։',
    category: 'Tipos'
  },
  {
    id: 3,
    questionEs: '¿Dónde tienen la sílaba tónica las palabras agudas?',
    questionHy: 'Որտե՞ղ է շեշտը agudas բառերում։',
    answerEs: 'En la última sílaba.',
    answerHy: 'Վերջին վանկի վրա։',
    category: 'Agudas'
  },
  {
    id: 4,
    questionEs: '¿Cuándo llevan tilde las palabras agudas?',
    questionHy: 'Ե՞րբ են agudas բառերը շեշտադրական նշան ստանում։',
    answerEs: 'Cuando terminan en vocal, n o s.',
    answerHy: 'Երբ վերջանում են ձայնավորով, n կամ s-ով։',
    category: 'Agudas'
  },
  {
    id: 5,
    questionEs: '¿Dónde tienen la sílaba tónica las palabras llanas?',
    questionHy: 'Որտե՞ղ է շեշտը llanas բառերում։',
    answerEs: 'En la penúltima sílaba.',
    answerHy: 'Նախավերջին վանկի վրա։',
    category: 'Llanas'
  },
  {
    id: 6,
    questionEs: '¿Cuándo llevan tilde las palabras llanas?',
    questionHy: 'Ե՞րբ են llanas բառերը շեշտադրական նշան ստանում։',
    answerEs: 'Cuando no terminan en vocal, n o s.',
    answerHy: 'Երբ չեն վերջանում ձայնավորով, n կամ s-ով։',
    category: 'Llanas'
  },
  {
    id: 7,
    questionEs: '¿Dónde tienen la sílaba tónica las esdrújulas?',
    questionHy: 'Որտե՞ղ է շեշտը esdrújulas բառերում։',
    answerEs: 'En la antepenúltima sílaba.',
    answerHy: 'Վերջից երրորդ վանկի վրա։',
    category: 'Esdrújulas'
  },
  {
    id: 8,
    questionEs: '¿Las esdrújulas llevan siempre tilde?',
    questionHy: 'Esdrújulas բառերը միշտ շեշտադրական նշա՞ն ունեն։',
    answerEs: 'Sí, siempre.',
    answerHy: 'Այո, միշտ։',
    category: 'Esdrújulas'
  },
  {
    id: 9,
    questionEs: '¿Qué tipo de palabra es “canción”?',
    questionHy: '«Canción» բառը ո՞ր տեսակին է պատկանում։',
    answerEs: 'Aguda.',
    answerHy: 'Aguda։',
    category: 'Ejemplos'
  },
  {
    id: 10,
    questionEs: '¿Qué tipo de palabra es “árbol”?',
    questionHy: '«Árbol» բառը ո՞ր տեսակին է պատկանում։',
    answerEs: 'Llana.',
    answerHy: 'Llana։',
    category: 'Ejemplos'
  },
  {
    id: 11,
    questionEs: '¿Qué tipo de palabra es “música”?',
    questionHy: '«Música» բառը ո՞ր տեսակին է պատկանում։',
    answerEs: 'Esdrújula.',
    answerHy: 'Esdrújula։',
    category: 'Ejemplos'
  },
  {
    id: 12,
    questionEs: '¿Por qué “café” lleva tilde?',
    questionHy: 'Ինչո՞ւ «café» բառը շեշտադրական նշան ունի։',
    answerEs: 'Porque es aguda y termina en vocal.',
    answerHy: 'Որովհետև aguda է և վերջանում է ձայնավորով։',
    category: 'Reglas'
  },
  {
    id: 13,
    questionEs: '¿Por qué “lápiz” lleva tilde?',
    questionHy: 'Ինչո՞ւ «lápiz» բառը շեշտադրական նշան ունի։',
    answerEs: 'Porque es llana y termina en una consonante distinta de n o s.',
    answerHy: 'Որովհետև llana է և վերջանում է n կամ s-ից տարբեր բաղաձայնով։',
    category: 'Reglas'
  },
  {
    id: 14,
    questionEs: '¿Por qué “teléfono” lleva tilde?',
    questionHy: 'Ինչո՞ւ «teléfono» բառը շեշտադրական նշան ունի։',
    answerEs: 'Porque es una palabra esdrújula.',
    answerHy: 'Որովհետև esdrújula բառ է։',
    category: 'Reglas'
  }
];

export const SHORT_TEXT_PARAGRAPHS: BilingualText[] = [
  {
    id: 'short-1',
    es: 'Las palabras se clasifican según la posición de la sílaba tónica.',
    hy: 'Բառերը դասակարգվում են ըստ շեշտված վանկի դիրքի։',
    badge: '1'
  },
  {
    id: 'short-2',
    es: 'Las palabras agudas tienen la fuerza en la última sílaba y llevan tilde si terminan en vocal, n o s. Las llanas tienen la fuerza en la penúltima sílaba y llevan tilde si no terminan en vocal, n o s.',
    hy: 'Agudas բառերում շեշտը վերջին վանկի վրա է, և դրանք շեշտադրական նշան են ստանում, եթե վերջանում են ձայնավորով, n կամ s-ով։ Llanas բառերում շեշտը նախավերջին վանկի վրա է, և դրանք շեշտադրական նշան են ստանում, եթե չեն վերջանում ձայնավորով, n կամ s-ով։',
    badge: '2'
  },
  {
    id: 'short-3',
    es: 'Las esdrújulas tienen la sílaba tónica en la antepenúltima sílaba y siempre llevan tilde. Las sobresdrújulas también llevan siempre tilde.',
    hy: 'Esdrújulas բառերում շեշտը վերջից երրորդ վանկի վրա է, և դրանք միշտ շեշտադրական նշան ունեն։ Sobresdrújulas բառերը նույնպես միշտ շեշտադրական նշան ունեն։',
    badge: '3'
  }
];
