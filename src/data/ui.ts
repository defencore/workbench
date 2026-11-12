import type { CategoryId, Lang, Level, Text } from "./types";
export const T = (uk: string, en: string): Text => ({ uk, en });
export const categories: {
  id: CategoryId;
  name: Text;
  description: Text;
  color: string;
}[] = [
  {
    id: "safety",
    name: T("Безпека", "Safety"),
    description: T(
      "Захист, обертання, енергія, стружка та пожежі.",
      "Protection, rotation, energy, chips and fire.",
    ),
    color: "orange",
  },
  {
    id: "machine-care",
    name: T("Підготовка й обслуговування", "Machine preparation & care"),
    description: T(
      "Огляд, змащування, люфти, юстування й перевірка геометрії.",
      "Inspection, lubrication, backlash, alignment and geometry verification.",
    ),
    color: "blue",
  },
  {
    id: "fundamentals",
    name: T("Основи майстерні", "Workshop essentials"),
    description: T(
      "Інструменти, розмітка, кріплення.",
      "Tools, marking out, workholding.",
    ),
    color: "sage",
  },
  {
    id: "tooling",
    name: T("Різальний інструмент", "Cutting tools"),
    description: T(
      "Вибір різців, фрез, свердел і тримачів під матеріал та операцію.",
      "Choose turning tools, mills, drills and holders for the material and operation.",
    ),
    color: "blue",
  },
  {
    id: "lathe",
    name: T("Токарна обробка", "Turning"),
    description: T(
      "Від торцювання до точних посадок.",
      "From facing to accurate fits.",
    ),
    color: "blue",
  },
  {
    id: "milling",
    name: T("Фрезерна обробка", "Milling"),
    description: T("Площини, пази та отвори.", "Faces, slots and holes."),
    color: "purple",
  },
  {
    id: "cnc",
    name: T("Верстати з ЧПУ", "CNC machining"),
    description: T(
      "Координати, підготовка, перевірка.",
      "Coordinates, setup, verification.",
    ),
    color: "sage",
  },
  {
    id: "materials",
    name: T("Матеріали", "Materials"),
    description: T(
      "Зрозуміти матеріал до першого різу.",
      "Know your material before the first cut.",
    ),
    color: "yellow",
  },
  {
    id: "measurement",
    name: T("Вимірювання", "Metrology"),
    description: T(
      "Не просто цифра. Достовірний розмір.",
      "More than a number. A reliable dimension.",
    ),
    color: "blue",
  },
  {
    id: "reverse",
    name: T("Реверс-інжиніринг", "Reverse engineering"),
    description: T(
      "Від зразка до креслення й нової деталі.",
      "From sample to drawing to a new part.",
    ),
    color: "purple",
  },
];
export const levels: Record<Level, Text> = {
  beginner: T("Базовий", "Beginner"),
  intermediate: T("Середній", "Intermediate"),
  advanced: T("Поглиблений", "Advanced"),
};
export const ui: Record<string, Text> = {
  tooling: T("Підбір інструмента", "Tool selection"),
  path5: T("Підготувати верстат до роботи", "Prepare a machine for use"),
  path5sub: T(
    "Оцінка стану, сервісні межі, люфти, геометрія та виставлення інструмента.",
    "Condition assessment, servicing limits, backlash, geometry and tool setting.",
  ),
  path6: T("Вибрати й встановити інструмент", "Choose and set a cutting tool"),
  path6sub: T(
    "Вимоги деталі, матеріал, операція, державка й стан різальної крайки.",
    "Part requirements, material, operation, holder and cutting-edge condition.",
  ),
  library: T("База знань", "Knowledge library"),
  paths: T("Навчальні маршрути", "Learning paths"),
  projects: T("Практичні проєкти", "Practice projects"),
  workshop: T("3D майстерня", "3D workshop"),
  saved: T("Збережене", "Saved resources"),
  settings: T("Дані та налаштування", "Data & settings"),
  search: T(
    "Інструкція, інструмент або матеріал…",
    "Find a guide, tool or material…",
  ),
  searchShort: T("Пошук у майстерні", "Search the workshop"),
  local: T("Збережено на цьому пристрої", "Stored on this device"),
  start: T("Почати з основ", "Start with the essentials"),
  recommended: T("Хороше місце для початку", "A good place to start"),
  minutes: T("хв читання", "min read"),
  steps: T("кроків", "steps"),
  savedAction: T("Зберегти", "Save"),
  unsave: T("Прибрати зі збереженого", "Remove from saved"),
  savedLabel: T("Збережено", "Saved"),
  progress: T("Ваш прогрес", "Your progress"),
  completed: T("Опрацьовано", "Completed"),
  allCategories: T("Усі розділи", "All categories"),
  allLevels: T("Усі рівні", "All levels"),
  sortRecommended: T("Рекомендовані", "Recommended"),
  sortTitle: T("За назвою", "Alphabetical"),
  sortTime: T("За часом читання", "Reading time"),
  resetFilters: T("Скинути фільтри", "Reset filters"),
  noResults: T("Нічого не знайшлося", "No matches yet"),
  noResultsSub: T(
    "Спробуйте інший запит або виберіть інший розділ.",
    "Try a different search or choose another category.",
  ),
  prerequisites: T("Перед початком", "Before you begin"),
  risks: T("Ризики та умови зупинки", "Hazards & stop conditions"),
  plan: T("У цій інструкції", "In this guide"),
  keyPoints: T("Що варто запам’ятати", "What to remember"),
  sources: T("Перевірити першоджерела", "Consult the original sources"),
  quiz: T("Перевірте розуміння", "Check your understanding"),
  checkAnswer: T("Перевірити відповідь", "Check answer"),
  correct: T("Правильно.", "Correct."),
  incorrect: T("Спробуйте ще раз.", "Try again."),
  markComplete: T("Позначити як опрацьоване", "Mark as completed"),
  markIncomplete: T("Скасувати позначку", "Mark as incomplete"),
  completionNote: T(
    "Позначка фіксує самостійне опрацювання матеріалу й не підтверджує допуск до роботи на верстаті.",
    "This records self-study progress and does not certify competence or authorise machine operation.",
  ),
  checklist: T(
    "Позначайте виконані контрольні пункти",
    "Tick the checks as you work through the guide",
  ),
  supervision: T(
    "Перша практика — під наглядом інструктора",
    "First practice requires an instructor",
  ),
  supervisionBody: T(
    "Навчальний матеріал доповнює інструкцію виробника та очний інструктаж. Режими різання, допустимі оберти й кріплення перевіряйте для конкретного обладнання.",
    "This guide supplements the manufacturer’s manual and hands-on training. Verify cutting conditions, speed limits and workholding for the actual equipment.",
  ),
  pathIntro: T(
    "Відкрийте маршрут і рухайтеся послідовно. Спочатку безпека, потім практика.",
    "Open a path and work through it in order. Safety first, then practice.",
  ),
  path1: T("Перший день у майстерні", "Your first day in the workshop"),
  path1sub: T(
    "Безпечна підготовка, інструменти, розмітка й перші вимірювання.",
    "Safe preparation, tools, marking out and your first measurements.",
  ),
  path2: T("Перша токарна деталь", "Your first turned part"),
  path2sub: T(
    "Кріплення, центрування та базові токарні операції.",
    "Workholding, centring and essential turning operations.",
  ),
  path3: T("Від площини до ЧПУ", "From a flat face to CNC"),
  path3sub: T(
    "Фрезерні основи, координати й контроль першого запуску.",
    "Milling foundations, coordinates and a verified first run.",
  ),
  path4: T("Від зразка до креслення", "From sample to drawing"),
  path4sub: T(
    "Вимірювання, функціональні бази та відтворення некритичної деталі.",
    "Measurement, functional datums and reproducing a noncritical part.",
  ),
  learningRoute: T("Навчальний маршрут", "Learning path"),
  routeNote: T(
    "Послідовність для самонавчання. Практичні операції виконуйте після очного допуску.",
    "A self-study sequence. Practical operations require hands-on authorisation.",
  ),
  projectIntro: T(
    "Виготовляйте просте. Розумійте складне.",
    "Make simple things. Understand complex ones.",
  ),
  projectIntroSub: T(
    "Від дистанційної втулки до відтворення деталі за зразком. Розміри — навчальні приклади, а не готові режими для вашого верстата.",
    "From a spacer to reproducing a sample part. Dimensions are learning examples, not machine-specific production instructions.",
  ),
  material: T("Матеріал", "Material"),
  duration: T("Орієнтовний час", "Estimated time"),
  dimensions: T("Навчальна геометрія", "Learning geometry"),
  tools: T("Що знадобиться", "What you will need"),
  inspect: T("Контроль готової деталі", "Final inspection"),
  related: T("Корисні інструкції", "Related guides"),
  process: T("План виготовлення", "Manufacturing plan"),
  workshopIntro: T(
    "Поверніть. Роздивіться. Зрозумійте.",
    "Rotate. Inspect. Understand.",
  ),
  workshopIntroSub: T(
    "Досліджуйте геометрію деталей і принципи кріплення. Навчальні моделі схематичні та не замінюють креслень чи перевірки оснащення.",
    "Explore part geometry and workholding concepts. These schematic models do not replace drawings or workholding verification.",
  ),
  modelLathe: T("Токарний верстат", "Manual lathe"),
  modelShaft: T("Ступінчастий вал", "Stepped shaft"),
  modelFlange: T("Фланець", "Flange"),
  modelBracket: T("Кронштейн", "Bracket"),
  modelVice: T("Машинні лещата", "Machine vice"),
  savedIntro: T(
    "Ваш особистий робочий довідник.",
    "Your personal workshop reference.",
  ),
  savedIntroSub: T(
    "Зберігайте корисне — ці матеріали також з’являтимуться вище в рекомендаціях.",
    "Save what helps. Your saved guides will also appear first in recommendations.",
  ),
  savedEmpty: T("Тут буде те, що стане у пригоді", "Keep useful things close"),
  savedEmptySub: T(
    "Натисніть на закладку біля інструкції або проєкту, щоб швидко повернутися до них.",
    "Use the bookmark on a guide or project to find it here whenever you need it.",
  ),
  browse: T("Переглянути базу знань", "Browse the knowledge library"),
  settingsIntro: T("Ваш браузер. Ваші дані.", "Your browser. Your data."),
  settingsSub: T(
    "Без облікового запису та сервера. Закладки, мова, прогрес і контрольні пункти зберігаються лише в цьому браузері.",
    "No account or server. Bookmarks, language, progress and checklists are stored only in this browser.",
  ),
  storage: T("Локальне сховище", "Local storage"),
  bookmarks: T("Закладки", "Bookmarks"),
  checked: T("Контрольні пункти", "Checklist items"),
  offline: T("Офлайн-доступ", "Offline access"),
  offlineBody: T(
    "Після першого завантаження сервіс зберігає оболонку та відвідані ресурси для роботи без мережі. Зовнішні першоджерела потребують інтернету. Браузер може автоматично видалити кеш, зокрема у приватному режимі.",
    "After the first load, the service caches its shell and visited resources for offline use. External sources require an internet connection. Your browser may evict cached data, especially in private browsing.",
  ),
  clear: T("Очистити дані та кеш сервісу", "Clear service data & cache"),
  clearSub: T(
    "Видалить закладки, прогрес, вибрану мову та офлайн-файли Workbench у цьому браузері.",
    "Removes Workbench bookmarks, progress, language preference and offline files from this browser.",
  ),
  confirmTitle: T("Очистити локальні дані?", "Clear local data?"),
  confirmBody: T(
    "Закладки й прогрес буде втрачено. Це стосується лише Workbench у цьому браузері.",
    "Your bookmarks and progress will be lost. This only affects Workbench in this browser.",
  ),
  cancel: T("Залишити дані", "Keep my data"),
  confirmClear: T("Так, очистити", "Yes, clear data"),
  cleared: T(
    "Локальні дані та кеш Workbench очищено.",
    "Workbench local data and cache cleared.",
  ),
  storageError: T(
    "Браузер не дозволив зберегти дані. Зміни працюють лише до закриття сторінки.",
    "Your browser blocked storage. Changes will last only until you close this page.",
  ),
  clearError: T(
    "Не вдалося повністю очистити кеш. Перевірте дозволи браузера.",
    "Cache could not be completely cleared. Check your browser permissions.",
  ),
  footer: T(
    "Для тих, хто створює власними руками.",
    "For people who make things.",
  ),
  footerSafety: T(
    "Знання допомагають. Безпека починається з дій.",
    "Knowledge helps. Safety starts with action.",
  ),
  close: T("Закрити", "Close"),
  menu: T("Відкрити меню", "Open menu"),
  searchResults: T("Результати пошуку", "Search results"),
  typeSearch: T(
    "Шукайте, наприклад: «патрон», «штангенциркуль», «ЧПУ».",
    "Try searching “chuck”, “caliper” or “CNC”.",
  ),
  offlineStatus: T(
    "Без мережі · доступний кеш",
    "Offline · cached resources available",
  ),
  onlineStatus: T("Локальні дані · без реєстрації", "Local data · no sign-up"),
};
export const tr = (key: string, lang: Lang) => ui[key]?.[lang] ?? key;

export function countLabel(
  n: number,
  kind: "guide" | "resource" | "project",
  lang: Lang,
): string {
  const forms = {
    guide: {
      one: "інструкція",
      few: "інструкції",
      many: "інструкцій",
      other: "інструкції",
    },
    resource: {
      one: "матеріал",
      few: "матеріали",
      many: "матеріалів",
      other: "матеріалу",
    },
    project: {
      one: "навчальний проєкт",
      few: "навчальні проєкти",
      many: "навчальних проєктів",
      other: "навчального проєкту",
    },
  };
  if (lang === "en")
    return `${n} ${kind === "guide" ? "guide" : kind === "resource" ? "resource" : "practice project"}${n === 1 ? "" : "s"}`;
  const form = new Intl.PluralRules("uk").select(n) as keyof typeof forms.guide;
  return `${n} ${forms[kind][form] || forms[kind].other}`;
}
