"use strict";
const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();
try {
  tg?.setHeaderColor?.("#183b31");
  tg?.setBackgroundColor?.("#15342b");
} catch {}

const initData = tg?.initData || "";
const demo = !initData;
const DEMO_KEY = "ministry-warm-letters-demo-v1";
const TITLE_KEY = "ministry-pass-title-v1";

const resources = [
  { id: "tutoriko-lab", title: "Лаборатория Tutoriko", category: "Для разных уроков", tag: "Все предметы", access: "Бесплатно", accessTone: "free", description: "Интерактивные симуляции и тренажёры по математике, физике, биологии, химии, информатике, обществознанию, английскому и русскому.", url: "https://lab.tutoriko.ru/", terms: "Открывается без регистрации. Не путать с платформой Tutoriko для репетиторов (там отдельные тарифы).", termsUrl: "https://lab.tutoriko.ru/" },
  { id: "neuroom", title: "Нейрум", category: "Для разных уроков", tag: "Подготовка уроков", access: "Freemium", accessTone: "limit", description: "ИИ-помощник учителя: рабочие листы, планы уроков, презентации, контрольные и проверка домашних заданий.", url: "https://neuroom.ru/", terms: "Есть бесплатный тариф с пополняемыми токенами; платные планы от 990 ₽/мес.", termsUrl: "https://neuroom.ru/tariffs/" },
  { id: "lichess-practice", title: "Lichess Practice", category: "Для разных уроков", tag: "Шахматы", access: "Бесплатно", accessTone: "free", description: "Интерактивные уроки по тактике и базовым шахматным приёмам: матовые конструкции, вилки, связки, эндшпиль.", url: "https://lichess.org/practice", terms: "Бесплатная платформа; раздел Practice подходит для урока и самостоятельной тренировки. Интерфейс на русском.", termsUrl: "https://lichess.org/practice" },
  { id: "chesstactics", title: "ChessTactics.app", category: "Для разных уроков", tag: "Шахматы", access: "Ограниченный доступ", accessTone: "limit", description: "Анализирует партии с Lichess или Chess.com и показывает пропущенные тактические возможности ученика.", url: "https://chesstactics.app/ru", terms: "Проверьте текущий бесплатный лимит партий на сайте перед рекомендацией ученикам. Интерфейс на русском.", termsUrl: "https://chesstactics.app/ru" },

  { id: "mersibo", title: "Мерсибо", category: "Дошкольникам и младшим", tag: "Дошкольное · речь", access: "Подписка / 10 игр", accessTone: "limit", description: "Развивающие игры для речи, внимания, памяти, логики, чтения и подготовки к школе.", url: "https://mersibo.ru/online-games", terms: "10 игр бесплатно после регистрации; требуется установка приложения «Студия Мерсибо» на компьютер.", termsUrl: "https://mersibo.ru/tariffs" },
  { id: "teach-your-monster", title: "Teach Your Monster", category: "Дошкольникам и младшим", tag: "Английский · чтение", access: "Бесплатно в браузере", accessTone: "limit", description: "Игровое обучение фонетике, буквам и раннему чтению на английском через игровой маршрут.", url: "https://www.teachyourmonster.org/", terms: "Браузерная версия на компьютере бесплатна после регистрации; мобильные приложения могут быть платными.", termsUrl: "https://help.teachyourmonster.org/en/articles/15925215-can-i-try-your-apps-for-free" },
  { id: "toy-theater", title: "Toy Theater", category: "Дошкольникам и младшим", tag: "Математика · игры", access: "Бесплатно / членство", accessTone: "limit", description: "Виртуальные инструменты и игры: часы, дроби, числовые модели, фигуры, кости, счёт и головоломки.", url: "https://toytheater.com/", terms: "Основные игры бесплатны; платное членство добавляет настройки для учителя. Интерфейс на английском.", termsUrl: "https://toytheater.com/about/" },
  { id: "topmarks", title: "Topmarks", category: "Дошкольникам и младшим", tag: "Начальная школа", access: "Бесплатно", accessTone: "free", description: "Браузерные игры для счёта, арифметики, форм, времени, букв и фонетики для коротких разминок.", url: "https://www.topmarks.co.uk/", terms: "Публичные игры доступны бесплатно; интерфейс на английском.", termsUrl: "https://www.topmarks.co.uk/" },
  { id: "math-learning-center", title: "Math Learning Center", category: "Дошкольникам и младшим", tag: "Математика", access: "Бесплатно", accessTone: "free", description: "Числовая прямая, дроби, геодоска, часы, счётные модели и разрядные блоки в браузере.", url: "https://www.mathlearningcenter.org/apps", terms: "Бесплатные веб-приложения; модели понятны интуитивно, интерфейс на английском.", termsUrl: "https://www.mathlearningcenter.org/apps" },

  { id: "phet", title: "PhET Simulations", category: "Школьные предметы", tag: "Физика · химия · био", access: "Некоммерчески бесплатно", accessTone: "license", description: "Виртуальные эксперименты: электрические цепи, движение, волны, атомы, реакции, дроби.", url: "https://phet.colorado.edu/", terms: "Бесплатно для некоммерческого обучения; для платных уроков нужна проверка лицензии. Есть русский интерфейс.", termsUrl: "https://phet.colorado.edu/en/licensing/" },
  { id: "python-tutor", title: "Python Tutor", category: "Школьные предметы", tag: "Информатика", access: "Бесплатно", accessTone: "free", description: "Пошаговая визуализация выполнения кода: переменные, циклы, списки, вызовы функций.", url: "https://pythontutor.com/", terms: "Бесплатный веб-инструмент для разбора коротких программ. Интерфейс на английском.", termsUrl: "https://pythontutor.com/" },
  { id: "codemonkey-cs", title: "CodeMonkey CS Tools", category: "Школьные предметы", tag: "Информатика", access: "Бесплатно", accessTone: "free", description: "Четыре инструмента: сортировки, симулятор логических элементов, структуры данных и поиск.", url: "https://www.codemonkey.com/interactive-cs-tools", terms: "Эти 4 инструмента бесплатны без регистрации; другие курсы CodeMonkey платные.", termsUrl: "https://www.codemonkey.com/interactive-cs-tools" },
  { id: "ruscorpora", title: "Национальный корпус русского языка", category: "Школьные предметы", tag: "Русский · литература", access: "Бесплатно", accessTone: "free", description: "Конструктор исследовательских заданий: реальное употребление, история и изменение значений слов.", url: "https://education.yandex.ru/projects/culture/ruscorpora", terms: "Бесплатно; лучше всего подходит для средних и старших классов.", termsUrl: "https://education.yandex.ru/projects/culture/ruscorpora" },
  { id: "polypad", title: "Mathigon Polypad", category: "Школьные предметы", tag: "Математика", access: "Некоммерчески бесплатно", accessTone: "license", description: "Виртуальные манипулятивы: дроби, алгебраические плитки, геометрия, графики и кубики.", url: "https://polypad.amplify.com/", terms: "Бесплатно для некоммерческих образовательных целей; для коммерции нужна лицензия. Есть русский язык.", termsUrl: "https://mathigon.org/faqs" },
  { id: "geogebra", title: "GeoGebra", category: "Школьные предметы", tag: "Математика · 3D", access: "Некоммерчески бесплатно", accessTone: "license", description: "Интерактивная геометрия, графики, алгебра, статистика и 3D-модели в реальном времени.", url: "https://www.geogebra.org/", terms: "Бесплатно для некоммерческого использования; коммерческое требует отдельной лицензии. Есть русский.", termsUrl: "https://www.geogebra.org/license" },
  { id: "gapminder", title: "Gapminder", category: "Школьные предметы", tag: "География · экономика", access: "Бесплатно", accessTone: "free", description: "Интерактивные графики по странам и эпохам, а также проект Dollar Street о быте семей по миру.", url: "https://www.gapminder.org/tools/", terms: "Бесплатно онлайн и офлайн; интерфейс на английском.", termsUrl: "https://www.gapminder.org/about/about-gapminder/faq/" },
  { id: "falstad", title: "Falstad Circuit", category: "Школьные предметы", tag: "Физика · схемы", access: "Бесплатно", accessTone: "free", description: "Симулятор электрических цепей: сборка схем, изменение напряжения, сопротивления и наблюдение тока.", url: "https://www.falstad.com/circuit/", terms: "Бесплатный браузерный симулятор; интерфейс на английском.", termsUrl: "https://www.falstad.com/circuit/" },
  { id: "chemcollective", title: "ChemCollective", category: "Школьные предметы", tag: "Химия", access: "Бесплатно", accessTone: "free", description: "Виртуальная химическая лаборатория: реактивы, смешивание растворов, концентрации и стехиометрия.", url: "https://chemcollective.org/vlabs", terms: "Бесплатно для преподавателей и учеников; интерфейс на английском.", termsUrl: "https://chemcollective.org/help/FAQ" },
  { id: "molview", title: "MolView", category: "Школьные предметы", tag: "Химия · 3D", access: "Бесплатно (базово)", accessTone: "free", description: "Рисование структурной формулы и просмотр 3D-модели молекулы для объяснения геометрии веществ.", url: "https://molview.com/", terms: "Основные функции бесплатны; отдельные данные зависят от внешних сервисов. На английском.", termsUrl: "https://molview.com/" },

  { id: "languageguide", title: "LanguageGuide", category: "Языки", tag: "Много языков", access: "Бесплатно", accessTone: "free", description: "Иллюстрированные словари с озвучкой, аудиозаданиями и тренировкой произношения.", url: "https://www.languageguide.org/", terms: "Бесплатно для всех; поддерживает русский и множество иностранных языков.", termsUrl: "https://www.languageguide.org/" },
  { id: "youglish", title: "YouGlish", category: "Языки", tag: "Произношение", access: "Freemium", accessTone: "limit", description: "Поиск реальных видеороликов, где носители произносят нужное слово или фразу в контексте.", url: "https://youglish.com/", terms: "Есть дневной лимит бесплатных запросов; видео работают через YouTube.", termsUrl: "https://youglish.com/terms" },
  { id: "forvo", title: "Forvo", category: "Языки", tag: "Произношение", access: "Некоммерчески · лимит", accessTone: "license", description: "Словарь произношения с живыми аудиозаписями носителей для проверки ударения и звучания.", url: "https://forvo.com/", terms: "Бесплатно для личных/академических некоммерческих целей (до 500 запросов/день).", termsUrl: "https://forvo.com/terms-and-conditions/" },
  { id: "conjuguemos", title: "Conjuguemos", category: "Языки", tag: "Европейские языки", access: "Freemium", accessTone: "limit", description: "Тренажёры грамматики, спряжения глаголов, лексики, аудирования и игры для учеников.", url: "https://www.conjuguemos.com/", terms: "Публичные активности бесплатны; бесплатный план учителя — до 5 активностей и 25 оценок.", termsUrl: "https://conjuguemos.com/auth/pricing" },
  { id: "skell", title: "SKELL", category: "Языки", tag: "Английский", access: "Бесплатно", accessTone: "free", description: "Корпусный поиск естественных фраз, коллокаций и близких по смыслу слов.", url: "https://skell.sketchengine.eu/", terms: "Упрощённый интерфейс SKELL бесплатен; расширенный Sketch Engine требует подписку.", termsUrl: "https://www.sketchengine.eu/skell/" },
  { id: "elllo", title: "ELLLO", category: "Языки", tag: "Английский", access: "Бесплатно", accessTone: "free", description: "Библиотека аудио и видео с разными акцентами, транскриптами, словарём и заданиями.", url: "https://elllo.org/", terms: "Основная библиотека уроков бесплатна; интерфейс на английском.", termsUrl: "https://elllo.org/" },
  { id: "profedeele", title: "ProfeDeELE", category: "Языки", tag: "Испанский", access: "Бесплатные материалы", accessTone: "free", description: "Коллекция заданий по грамматике, лексике, песням, видео и культуре по уровням CEFR.", url: "https://www.profedeele.es/actividades/", terms: "Основная библиотека бесплатна; проверяйте условия отдельных материалов.", termsUrl: "https://www.profedeele.es/actividades/" },
  { id: "123teachme", title: "123TeachMe", category: "Языки", tag: "Испанский", access: "Базово бесплатно", accessTone: "free", description: "Упражнения по испанской грамматике, спряжению глаголов, лексике и чтению.", url: "https://www.123teachme.com/", terms: "Публичные упражнения бесплатны; на сайте есть реклама.", termsUrl: "https://www.123teachme.com/" },
  { id: "tv5monde", title: "TV5MONDE", category: "Языки", tag: "Французский", access: "Бесплатно", accessTone: "free", description: "Тысячи заданий для уровней A1–B2 на основе подлинных видеосюжетов и репортажей.", url: "https://apprendre.tv5monde.com/", terms: "Бесплатный ресурс без рекламы.", termsUrl: "https://support-apprendre.tv5monde.com/support/solutions/articles/61000298831-warum-franz%C3%B6sisch-mit-tv5monde-lernen-" },
  { id: "rfi-francais", title: "RFI – Le français facile", category: "Языки", tag: "Французский", access: "Бесплатно", accessTone: "free", description: "Аутентичные новости, аудио с транскриптами и упражнения для актуальных тем.", url: "https://francaisfacile.rfi.fr/fr/", terms: "Основные учебные материалы доступны бесплатно.", termsUrl: "https://francaisfacile.rfi.fr/fr/" },
  { id: "dw-nicos-weg", title: "DW – Nicos Weg", category: "Языки", tag: "Немецкий", access: "Бесплатно", accessTone: "free", description: "Сюжетный видеокурс уровней A1–B1 о жизни в Германии с упражнениями и лексикой.", url: "https://learngerman.dw.com/", terms: "Курс предоставляется бесплатно; есть поддержка на русском языке.", termsUrl: "https://learngerman.dw.com/" },
  { id: "goethe-uebungen", title: "Goethe – Deutsch für dich", category: "Языки", tag: "Немецкий", access: "Бесплатно", accessTone: "free", description: "Более 260 интерактивных упражнений по немецкому для разных уровней и сообщество.", url: "https://www.goethe.de/ins/gb/en/spr/ueb.html", terms: "Бесплатно; для сообщества может понадобиться регистрация.", termsUrl: "https://www.goethe.de/ins/gb/en/spr/ueb.html" },
  { id: "nhk-japanese", title: "NHK Easy Japanese", category: "Языки", tag: "Японский", access: "Бесплатно", accessTone: "free", description: "Курс для начинающих: короткие видеодиалоги, аудио и фразы для повседневных ситуаций.", url: "https://www.nhk.or.jp/lesson/en/", terms: "Базовый курс бесплатен; есть многоязычная поддержка.", termsUrl: "https://www.nhk.or.jp/lesson/en/" },
  { id: "kanji-alive", title: "Kanji alive", category: "Языки", tag: "Японский", access: "Бесплатно", accessTone: "free", description: "Поиск кандзи, анимация порядка черт, радикалы и примеры для отработки письма.", url: "https://app.kanjialive.com/", terms: "Веб-приложение бесплатно; при повторном использовании данных действует лицензия CC BY.", termsUrl: "https://kanjialive.com/" },
  { id: "hanzi-writer", title: "Hanzi Writer", category: "Языки", tag: "Китайский", access: "Бесплатно", accessTone: "free", description: "Анимация порядка черт китайских иероглифов и интерактивная тренировка письма.", url: "https://hanziwriter.org/demo.html", terms: "Демо и open-source библиотека бесплатны.", termsUrl: "https://hanziwriter.org/" },
  { id: "mandarin-bean", title: "Mandarin Bean", category: "Языки", tag: "Китайский", access: "Freemium", accessTone: "limit", description: "Градуированные тексты: переключение пиньиня, подсказки к словам и озвучка по уровням.", url: "https://mandarinbean.com/", terms: "Базовый доступ бесплатен с ограничениями; полный контент в Premium.", termsUrl: "https://mandarinbean.com/subscription-plan/" },
  { id: "yee-turkish", title: "Yunus Emre Institute", category: "Языки", tag: "Турецкий", access: "Бесплатно", accessTone: "free", description: "Официальный портал изучения турецкого языка: учебные блоки и видео по уровням.", url: "https://turkce.yee.org.tr/en", terms: "Бесплатный доступ к материалам; для части курсов нужна регистрация.", termsUrl: "https://turkce.yee.org.tr/en" },
  { id: "yasar-turkish", title: "Yaşar University Turkish", category: "Языки", tag: "Турецкий", access: "Бесплатно", accessTone: "free", description: "Интерактивный курс A1 с видеоуроками и заданиями; есть русские субтитры.", url: "https://turkish.yasar.edu.tr/?l=en", terms: "Обучение доступно бесплатно; основной уровень — A1.", termsUrl: "https://turkish.yasar.edu.tr/?l=en" },
  { id: "pame-greek", title: "Pame! Modern Greek", category: "Языки", tag: "Греческий", access: "Бесплатно", accessTone: "free", description: "Открытый учебник современного греческого для начинающих: диалоги, аудио и упражнения.", url: "https://pressbooks.cuny.edu/moderngreek1/", terms: "Открытый доступ к электронной книге.", termsUrl: "https://pressbooks.cuny.edu/moderngreek1/" }
];

const quizQuestions = [
  {
    q: "Что для вас самое важное в зимнем занятии?",
    options: [
      { label: "Тёплая и уютная атмосфера", role: "warm" },
      { label: "Маленькое чудо и открытие", role: "wonder" },
      { label: "История, письмо и слово", role: "letter" },
      { label: "Чуткая поддержка каждого", role: "care" }
    ]
  },
  {
    q: "Какой волшебный предмет лежит на вашем столе?",
    options: [
      { label: "Кружка горячего какао", role: "warm" },
      { label: "Снежный шар с идеями", role: "wonder" },
      { label: "Перьевая ручка и конверт", role: "letter" },
      { label: "Тёплый золотой фонарик", role: "care" }
    ]
  },
  {
    q: "Что вы отправите в общую почту Министерства?",
    options: [
      { label: "Доброе пожелание коллегам", role: "warm" },
      { label: "Загадку для учеников", role: "wonder" },
      { label: "Тёплое письмо и открытку", role: "letter" },
      { label: "Полезный совет или помощь", role: "care" }
    ]
  }
];

const roleTitles = {
  warm: "Хранитель тепла",
  wonder: "Архивариус чудес",
  letter: "Мастер тёплых писем",
  care: "Маяк поддержки"
};

let state = { name: "Гость", saved: [], completed: [], title: loadSavedTitle() };
let loaded = demo;
let loadError = false;
let filter = "Все";
let search = "";
let quizStep = null;
let quizAnswers = [];
let toastTimer;

function loadSavedTitle() {
  try {
    const val = localStorage.getItem(TITLE_KEY);
    return val && Object.values(roleTitles).includes(val) ? val : "Хранитель тепла";
  } catch {
    return "Хранитель тепла";
  }
}

function saveTitleLocal(title) {
  try { localStorage.setItem(TITLE_KEY, title); } catch {}
}

if (demo) {
  try {
    const data = JSON.parse(localStorage.getItem(DEMO_KEY) || "null");
    if (data && typeof data.name === "string" && Array.isArray(data.saved)) {
      state.name = data.name.slice(0, 40) || "Гость";
      state.saved = data.saved.filter(x => typeof x === "string");
    }
  } catch {}
}

const main = document.querySelector("#main");
const mode = document.querySelector("#mode");
const modal = document.querySelector("#png-modal");

function esc(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message;
  el.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("visible"), 4000);
}

function persistDemo() {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify({ name: state.name, saved: state.saved }));
    return true;
  } catch {
    toast("Браузер не разрешает хранение.");
    return false;
  }
}

async function api(path, method = "GET", body = undefined) {
  const headers = { "X-Telegram-Init-Data": initData };
  if (body !== undefined) headers["content-type"] = "application/json";
  const response = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  if (!response.ok) {
    const err = new Error(
      response.status === 401
        ? "Откройте приложение заново через Telegram."
        : "Не удалось выполнить запрос. Попробуйте ещё раз."
    );
    err.status = response.status;
    throw err;
  }
  return response.json();
}

function route() {
  const candidate = location.hash.slice(1).split("?")[0];
  return ["hall", "map", "library", "workshop", "bureau", "saved", "pass"].includes(candidate) ? candidate : "hall";
}

function pageHeader(title, subtitle, showBack = true) {
  return `<div class="page-head">${showBack ? '<a class="back" href="#map">← На карту Министерства</a>' : ""}<h1>${title}</h1>${subtitle ? `<p class="intro">${subtitle}</p>` : ""}</div>`;
}

function passNumber() {
  const tgId = tg?.initDataUnsafe?.user?.id;
  if (!tgId) return "№ 001024";
  return `№ ${String(tgId).slice(-6).padStart(6, "0")}`;
}

function laurelSvg(extraClass = "") {
  return `<svg class="pass-laurel ${extraClass}" viewBox="0 0 40 72" fill="none" aria-hidden="true">
    <path d="M32 64C18 52 14 34 22 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="14" cy="50" rx="6" ry="3.2" transform="rotate(-25 14 50)" fill="currentColor"/>
    <ellipse cx="11" cy="37" rx="6" ry="3.2" transform="rotate(-15 11 37)" fill="currentColor"/>
    <ellipse cx="12" cy="24" rx="6" ry="3.2" transform="rotate(-5 12 24)" fill="currentColor"/>
    <ellipse cx="18" cy="12" rx="5.5" ry="3" transform="rotate(20 18 12)" fill="currentColor"/>
    <ellipse cx="26" cy="44" rx="5.5" ry="3" transform="rotate(25 26 44)" fill="currentColor"/>
    <ellipse cx="24" cy="30" rx="5.5" ry="3" transform="rotate(20 24 30)" fill="currentColor"/>
  </svg>`;
}

function postmarkSvg() {
  return `<svg class="pass-postmark" viewBox="0 0 110 74" fill="none" aria-hidden="true">
    <path d="M6 28 Q 20 22, 34 28 T 62 28" stroke="#9d3443" stroke-width="2" stroke-linecap="round"/>
    <path d="M6 38 Q 20 32, 34 38 T 62 38" stroke="#9d3443" stroke-width="2" stroke-linecap="round"/>
    <path d="M6 48 Q 20 42, 34 48 T 62 48" stroke="#9d3443" stroke-width="2" stroke-linecap="round"/>
    <circle cx="76" cy="37" r="28" stroke="#9d3443" stroke-width="2" stroke-dasharray="5 4"/>
    <circle cx="76" cy="37" r="21" stroke="#9d3443" stroke-width="1.2"/>
    <text x="76" y="45" text-anchor="middle" fill="#9d3443" font-size="24" font-family="Georgia,serif">❄</text>
  </svg>`;
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function closePngModal() {
  modal.hidden = true;
  modal.innerHTML = "";
}

function openPngModal(dataUrl, blob) {
  const canShare = typeof navigator.share === "function" && typeof File === "function";
  modal.innerHTML = `<div class="modal-card">
    <h2 id="png-modal-title">Ваш пропуск готов</h2>
    <img src="${dataUrl}" alt="Пропуск в Министерство добрых дел">
    <p class="note">На телефоне: нажмите и удерживайте картинку, чтобы сохранить в Фото.</p>
    <div class="modal-actions">
      ${canShare ? '<button type="button" class="button red" id="share-pass-btn">Поделиться / Сохранить</button>' : ""}
      <button type="button" class="button secondary" id="close-modal-btn">Закрыть</button>
    </div>
  </div>`;
  modal.hidden = false;

  const shareBtn = document.querySelector("#share-pass-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      try {
        const file = new File([blob], "ministry-pass.png", { type: "image/png" });
        if (navigator.canShare && !navigator.canShare({ files: [file] })) {
          toast("Удерживайте картинку выше, чтобы сохранить.");
          return;
        }
        await navigator.share({ files: [file], title: "Мой пропуск · Министерство добрых дел" });
      } catch (err) {
        if (err?.name !== "AbortError") toast("Удерживайте картинку выше, чтобы сохранить.");
      }
    });
  }
  document.querySelector("#close-modal-btn").addEventListener("click", closePngModal);
}

function downloadPassPng() {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1240;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const bg = ctx.createRadialGradient(450, 180, 60, 450, 620, 760);
  bg.addColorStop(0, "#215042");
  bg.addColorStop(1, "#122c24");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 900, 1240);

  ctx.fillStyle = "#9d3443";
  roundRectPath(ctx, 412, 48, 76, 86, 18);
  ctx.fill();

  const cardGrad = ctx.createLinearGradient(0, 118, 0, 1150);
  cardGrad.addColorStop(0, "#fcf5e7");
  cardGrad.addColorStop(1, "#f0dfc1");
  ctx.fillStyle = cardGrad;
  roundRectPath(ctx, 110, 118, 680, 1030, 46);
  ctx.fill();

  ctx.strokeStyle = "#c59d62";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.strokeStyle = "rgba(181,142,83,0.45)";
  ctx.lineWidth = 2;
  roundRectPath(ctx, 134, 142, 632, 982, 32);
  ctx.stroke();

  ctx.fillStyle = "#23463a";
  roundRectPath(ctx, 386, 174, 128, 22, 11);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = "#1e3a31";
  ctx.font = "54px Georgia, serif";
  ctx.fillText("Пропуск", 450, 265);

  ctx.fillStyle = "#665b4c";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("МИНИСТЕРСТВО ДОБРЫХ ДЕЛ", 450, 305);

  ctx.save();
  roundRectPath(ctx, 336, 345, 228, 255, 114);
  const archGrad = ctx.createLinearGradient(0, 345, 0, 600);
  archGrad.addColorStop(0, "#e7d8b9");
  archGrad.addColorStop(1, "#d7c39c");
  ctx.fillStyle = archGrad;
  ctx.fill();
  ctx.strokeStyle = "#c59d62";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#1e3a31";
  ctx.font = "102px Georgia, serif";
  ctx.fillText((state.name || "Г").slice(0, 1).toUpperCase(), 450, 505);

  ctx.fillStyle = "#1e3a31";
  ctx.font = "56px Georgia, serif";
  ctx.fillText((state.name || "Гость").slice(0, 24), 450, 685);

  ctx.fillStyle = "#9d3443";
  roundRectPath(ctx, 215, 730, 470, 68, 34);
  ctx.fill();

  ctx.fillStyle = "#fff9ee";
  ctx.font = "bold 30px sans-serif";
  ctx.fillText(state.title, 450, 774);

  ctx.fillStyle = "#665b4c";
  ctx.font = "30px Georgia, serif";
  ctx.fillText(passNumber(), 450, 868);

  if (state.completed.includes("first-riddle")) {
    ctx.fillStyle = "#e2f0d9";
    roundRectPath(ctx, 250, 905, 400, 44, 22);
    ctx.fill();
    ctx.fillStyle = "#214b2d";
    ctx.font = "bold 21px sans-serif";
    ctx.fillText("❄ Первая загадка разгадана", 450, 934);
  }

  ctx.fillStyle = "#665b4c";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("ЗИМА · 2026", 450, 1080);

  ctx.save();
  ctx.translate(650, 1005);
  ctx.rotate(-0.18);
  ctx.strokeStyle = "rgba(157,52,67,0.55)";
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 6]);
  ctx.beginPath();
  ctx.arc(0, 0, 62, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(157,52,67,0.72)";
  ctx.font = "46px Georgia, serif";
  ctx.fillText("❄", 0, 16);
  ctx.restore();

  const dataUrl = canvas.toDataURL("image/png");
  canvas.toBlob(blob => {
    if (!blob) {
      toast("Не удалось создать PNG.");
      return;
    }
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ministry-pass.png";
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch {}
    openPngModal(dataUrl, blob);
  }, "image/png");
}

function renderQuizSection() {
  if (quizStep === null) {
    return `<div class="quiz-box"><p class="note">Хотите подобрать особое звание для пропуска? Это короткая зимняя мини-викторина из 3 вопросов — можно пройти или пропустить.</p><div class="actions"><button type="button" class="button red" id="start-quiz">Получить звание</button></div></div>`;
  }
  const item = quizQuestions[quizStep];
  return `<div class="quiz-box">
    <span class="eyebrow-dark">Вопрос ${quizStep + 1} из ${quizQuestions.length}</span>
    <p class="quiz-q">${esc(item.q)}</p>
    <div class="quiz-options">
      ${item.options.map((opt, idx) => `<button type="button" class="quiz-option" data-quiz-choice="${idx}">${esc(opt.label)}</button>`).join("")}
    </div>
    <div class="actions"><button type="button" class="button secondary" id="skip-quiz">Пропустить</button></div>
  </div>`;
}

function render() {
  const page = route();
  const active = ["library", "workshop", "bureau"].includes(page) ? "map" : page;
  document.querySelectorAll("[data-nav]").forEach(a => a.setAttribute("aria-current", a.dataset.nav === active ? "page" : "false"));

  if (page === "hall") {
    main.innerHTML = `<div class="shell">
      <section class="hero-stage">
        <img src="hall.jpg" alt="Уютная приёмная Министерства: письма на столе, свет лампы и снег за окном" fetchpriority="high">
        <div class="hero-scrim">
          <span class="eyebrow">Бюро тёплых писем</span>
          <h1>Добро пожаловать,<br>коллега.</h1>
          <p class="intro">38 полезных находок, идеи к празднику и тёплые дела.</p>
          <div class="hero-actions">
            <a class="button red" href="#map">◇ Карта</a>
            <a class="button secondary" href="#pass">Мой пропуск</a>
          </div>
        </div>
      </section>
      <section class="card-panel">
        <div class="section-head"><h2>На доске объявлений</h2><span class="eyebrow-dark">План зимы</span></div>
        <div class="notice-grid">
          <article class="notice"><span class="date">1 декабря</span><h3>Праздник начинается</h3><p>Запуск языковых разминок (адвент-формат) и новогодних активностей для начальной школы.</p></article>
          <article class="notice"><span class="date">7 декабря</span><h3>Большой дайджест</h3><p>Релиз IT-викторины по алгоритмам, обновлённые уроки и единый новогодний анонс.</p></article>
        </div>
        <p class="note">Материалы в Мастерской обновляются по мере готовности команд.</p>
      </section>
    </div>`;
  } else if (page === "map") {
    main.innerHTML = `<div class="shell">
      ${pageHeader("Карта Министерства", "Выберите нужную дверь — все пространства открыты без обязательных заданий.", false)}
      <div class="map-scene">
        <img src="map.jpg" alt="Библиотека слева, мастерская справа и бюро добрых дел внизу">
        <a class="room-label lib" href="#library">📖 Библиотека</a>
        <a class="room-label work" href="#workshop">✨ Мастерская</a>
        <a class="room-label bureau" href="#bureau">✉ Бюро добрых дел</a>
      </div>
      <div class="room-list">
        <a class="room-card" href="#library"><h2>Библиотека находок</h2><p>38 проверенных инструментов для уроков</p></a>
        <a class="room-card" href="#workshop"><h2>Мастерская праздника</h2><p>Занятия, оформление и челлендж Скайхаба</p></a>
        <a class="room-card" href="#bureau"><h2>Бюро добрых дел</h2><p>Проверенные благотворительные инициативы</p></a>
      </div>
    </div>`;
  } else if (page === "library") {
    main.innerHTML = `<div class="shell">
      ${pageHeader("Библиотека находок", "38 интерактивных веб-ресурсов по школьным предметам и языкам — с честными заметками о лицензиях.")}
      <div class="scene-banner">
        <img src="library.jpg" alt="Книжные полки, зелёная книга и золотая лампа в библиотеке">
        <span class="scene-pill">📖 Библиотека · 38 находок</span>
        <button class="button red book-button" id="open-book">Открыть книгу находок</button>
      </div>
      <section class="card-panel" id="catalog">
        <label class="search-label" for="search">Найти ресурс</label>
        <input id="search" type="search" placeholder="Название, предмет, язык или «бесплатно»" value="${esc(search)}">
        <div class="filters" aria-label="Разделы библиотеки">
          ${["Все", "Языки", "Школьные предметы", "Дошкольникам и младшим", "Для разных уроков"].map(f => `<button class="filter" data-filter="${esc(f)}" aria-pressed="${filter === f}">${esc(f)}</button>`).join("")}
        </div>
        <div class="catalog-meta"><span id="result-count"></span><span>Проверено 07.11.2026</span></div>
        <div id="results" class="resource-grid"></div>
        <div class="license-callout"><strong>О лицензиях:</strong> не все бесплатные сайты разрешают коммерческое использование. У <strong>PhET</strong>, <strong>GeoGebra</strong>, <strong>Mathigon Polypad</strong> и <strong>Forvo</strong> коммерческое применение на платных уроках требует проверки условий.</div>
      </section>
    </div>`;
    renderResults();
    document.querySelector("#search").addEventListener("input", e => {
      search = e.target.value;
      renderResults();
    });
    document.querySelector("#open-book").addEventListener("click", () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.querySelector("#catalog").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      if (window.matchMedia("(pointer: fine)").matches) {
        document.querySelector("#search").focus({ preventScroll: true });
      }
    });
  } else if (page === "saved") {
    main.innerHTML = `<div class="shell">
      ${pageHeader("Сохранённое", demo ? "В демо подборка хранится в этом браузере." : "Материалы, сохранённые в вашем профиле Telegram.")}
      <section class="card-panel"><div id="results" class="resource-grid"></div></section>
    </div>`;
    renderResults(true);
  } else if (page === "pass") {
    const riddleDone = state.completed.includes("first-riddle");
    main.innerHTML = `<div class="shell">
      ${pageHeader("Личный пропуск", "Ваша карта сотрудника Министерства.")}
      <div class="pass-layout">
        <div class="pass-wrap">
          <article class="pass-card">
            <div class="pass-hanger" aria-hidden="true">
              <div class="pass-ribbon-top"></div>
              <div class="pass-slot"></div>
            </div>
            <div class="pass-title-main">Пропуск</div>
            <div class="pass-subtitle">Министерство добрых дел</div>
            <div class="pass-portrait-row">
              ${laurelSvg()}
              <div class="pass-arch" aria-hidden="true"><span class="pass-initial">${esc((state.name || "Г").slice(0, 1).toUpperCase())}</span></div>
              ${laurelSvg("right")}
            </div>
            <h2>${esc(state.name)}</h2>
            <span class="rank-ribbon">${esc(state.title)}</span>
            <p class="pass-num">${esc(passNumber())}</p>
            <div class="pass-bottom-row">
              ${riddleDone ? `<span class="pass-achievement">❄ Первая загадка разгадана</span>` : ""}
            </div>
            ${postmarkSvg()}
          </article>
          <div class="actions"><button type="button" class="button secondary" id="download-pass">⬇ Сохранить PNG</button></div>
        </div>
        <div class="card-panel">
          <form id="name-form" class="form-box">
            <label for="display-name">Как к вам обращаться?</label>
            <input id="display-name" type="text" maxlength="40" required value="${esc(state.name)}" ${!loaded ? "disabled" : ""}>
            <div class="form-row">
              <button class="button" ${!loaded ? "disabled" : ""}>Сохранить имя</button>
            </div>
          </form>
          ${renderQuizSection()}
        </div>
      </div>
    </div>`;
  } else if (page === "workshop") {
    main.innerHTML = `<div class="shell">
      ${pageHeader("Мастерская праздника", "Новогодние занятия, разминки и активности для ваших учеников.")}
      <section class="card-panel">
        <article class="soon"><span class="status">С 1 декабря · языки</span><h2>Разминки и 8 новых уроков</h2><p>Адвент-разминки и обновлённые рождественские и новогодние уроки для разных уровней, плюс резервная копия на Google-сайте.</p></article>
        <article class="soon"><span class="status">С 1 декабря · начальная школа</span><h2>Комиксы, распечатки и раскраски</h2><p>Тематический поиск подарков и комиксов внутри уроков и карточки с распечатками для праздничных занятий.</p></article>
        <article class="soon"><span class="status">7 декабря · IT и хоумскулинг</span><h2>Урок-викторина и челлендж Скайхаба</h2><p>Интерактивная викторина по компьютерной грамотности и алгоритмам, а также новогодний челлендж цифровых подарков и Python-проектов до конца января.</p></article>
        <article class="soon"><span class="status">От сообщества</span><h2>Фоны, открытки и карта пожеланий</h2><p>Дополнительные праздничные материалы для учеников и преподавателей.</p></article>
      </section>
    </div>`;
  } else if (page === "bureau") {
    main.innerHTML = `<div class="shell">
      ${pageHeader("Бюро добрых дел", "Можно подарить не только вещь, но и внимание, время и поддержку.")}
      <section class="card-panel">
        <article class="soon">
          <span class="status">Проверенная инициатива</span>
          <h2>Ёлка желаний</h2>
          <p>Всероссийская акция, где можно выбрать открытку и исполнить новогоднюю мечту ребёнка из уязвимой категории.</p>
          <div class="actions"><a class="button" href="https://xn--80aanbeohciex.xn--p1ai/" target="_blank" rel="noopener noreferrer">Открыть проект</a></div>
        </article>
        <article class="soon">
          <span class="status">Проверенная инициатива</span>
          <h2>Подари Подарок</h2>
          <p>Публикуют реальные истории и списки необходимых вещей для семей, оказавшихся в тяжёлой ситуации.</p>
          <div class="actions"><a class="button" href="https://podaripodarok.org/families" target="_blank" rel="noopener noreferrer">Посмотреть истории</a></div>
        </article>
        <article class="soon">
          <span class="status">Добровольное участие</span>
          <h2>Поделиться своей инициативой</h2>
          <p>Мы собираем проверенные проекты в разных странах, где живут преподаватели. Участие полностью добровольное — без баллов и рейтингов.</p>
        </article>
      </section>
    </div>`;
  } else {
    main.innerHTML = `<div class="shell">${pageHeader("Такой комнаты пока нет", "Вернитесь на карту и выберите одну из трёх дверей.")}</div>`;
  }

  bindActions();
}

function card(r, savedOnly = false) {
  const saved = state.saved.includes(r.id);
  const actionBtn = saved
    ? `<button class="button secondary" data-unsave="${esc(r.id)}" aria-pressed="true" ${!loaded ? "disabled" : ""}>${!loaded ? "Загрузка…" : savedOnly ? "Убрать" : "✓ Сохранено"}</button>`
    : `<button class="button" data-save="${esc(r.id)}" ${!loaded ? "disabled" : ""}>${!loaded ? "Загрузка…" : "Сохранить"}</button>`;

  const termsLink = r.termsUrl && r.termsUrl !== r.url
    ? `<a class="terms-link" href="${esc(r.termsUrl)}" target="_blank" rel="noopener noreferrer">Условия и лицензия →</a>`
    : "";

  return `<article class="resource">
    <div class="resource-meta">
      <span class="tag">${esc(r.tag)}</span>
      <span class="access-badge ${esc(r.accessTone)}">${esc(r.access)}</span>
    </div>
    <h3>${esc(r.title)}</h3>
    <p>${esc(r.description)}</p>
    <p class="terms">${esc(r.terms)}</p>
    ${termsLink}
    <div class="resource-foot">
      <a class="button secondary" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Открыть</a>
      ${actionBtn}
    </div>
  </article>`;
}

function renderResults(savedOnly = false) {
  const target = document.querySelector("#results");
  if (!target) return;

  if (savedOnly && !loaded) {
    target.innerHTML = loadError
      ? `<div class="empty"><h2>Не удалось загрузить подборку</h2><p>Нажмите «Повторить» на верхней панели или откройте приложение снова из Telegram.</p></div>`
      : `<div class="empty"><h2>Загружаем вашу подборку</h2><p>Ожидаем ответ сервера.</p></div>`;
    return;
  }

  const query = search.trim().toLocaleLowerCase("ru-RU");
  const list = resources.filter(r =>
    (!savedOnly || state.saved.includes(r.id)) &&
    (savedOnly || filter === "Все" || r.category === filter) &&
    (savedOnly || !query || `${r.title} ${r.description} ${r.tag} ${r.access} ${r.terms}`.toLocaleLowerCase("ru-RU").includes(query))
  );

  const countEl = document.querySelector("#result-count");
  if (countEl) countEl.textContent = `Показано ${list.length} из ${resources.length}`;

  target.innerHTML = list.length
    ? list.map(r => card(r, savedOnly)).join("")
    : `<div class="empty"><h2>${savedOnly ? "Пока ни одной находки" : "Ничего не нашлось"}</h2><p>${savedOnly ? "Загляните в библиотеку и сохраните то, что пригодится на уроках." : "Попробуйте изменить запрос или выбрать раздел «Все»."}</p>${savedOnly ? '<div class="actions"><a class="button" href="#library">В библиотеку</a></div>' : ""}</div>`;
}

function bindActions() {
  const form = document.querySelector("#name-form");
  if (form) {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const name = document.querySelector("#display-name").value.trim().slice(0, 40);
      if (!name) {
        toast("Введите имя.");
        return;
      }
      const b = form.querySelector("button");
      b.disabled = true;
      try {
        if (!demo) await api("/api/profile", "POST", { displayName: name });
        state.name = name;
        if (demo) persistDemo();
        render();
        toast("Имя сохранено");
      } catch (err) {
        toast(err.message);
        b.disabled = false;
      }
    });
  }

  const dlBtn = document.querySelector("#download-pass");
  if (dlBtn) dlBtn.addEventListener("click", downloadPassPng);

  const startQuiz = document.querySelector("#start-quiz");
  if (startQuiz) {
    startQuiz.addEventListener("click", () => {
      quizStep = 0;
      quizAnswers = [];
      render();
    });
  }

  const skipQuiz = document.querySelector("#skip-quiz");
  if (skipQuiz) {
    skipQuiz.addEventListener("click", () => {
      quizStep = null;
      quizAnswers = [];
      render();
    });
  }

  document.querySelectorAll("[data-quiz-choice]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const idx = Number(btn.dataset.quizChoice);
      const picked = quizQuestions[quizStep]?.options[idx]?.role;
      if (picked) quizAnswers.push(picked);
      if (quizStep + 1 < quizQuestions.length) {
        quizStep += 1;
        render();
      } else {
        const counts = {};
        for (const r of quizAnswers) counts[r] = (counts[r] || 0) + 1;
        const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "warm";
        const newTitle = roleTitles[winner] || "Хранитель тепла";
        state.title = newTitle;
        saveTitleLocal(newTitle);
        quizStep = null;
        quizAnswers = [];
        render();
        if (!demo) {
          try { await api("/api/profile", "POST", { rank: newTitle }); } catch {}
        }
        toast(`Новое звание: ${newTitle}`);
      }
    });
  });
}

modal.addEventListener("click", e => {
  if (e.target === modal) closePngModal();
});
window.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modal.hidden) closePngModal();
});

main.addEventListener("click", async event => {
  const category = event.target.closest("[data-filter]");
  if (category) {
    filter = category.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(el => el.setAttribute("aria-pressed", el.dataset.filter === filter));
    renderResults();
    return;
  }

  const save = event.target.closest("[data-save]");
  if (save && !save.disabled) {
    const id = save.dataset.save;
    save.disabled = true;
    save.textContent = "Сохраняем…";
    try {
      if (!demo) await api("/api/save", "POST", { materialId: id });
      if (!state.saved.includes(id)) state.saved.push(id);
      if (demo) persistDemo();
      renderResults(route() === "saved");
      toast(demo ? "Добавлено в демо-подборку" : "Добавлено в сохранённое");
    } catch (err) {
      save.disabled = false;
      save.textContent = "Повторить";
      toast(err.message);
    }
    return;
  }

  const unsave = event.target.closest("[data-unsave]");
  if (unsave && !unsave.disabled) {
    const id = unsave.dataset.unsave;
    unsave.disabled = true;
    unsave.textContent = "Убираем…";
    try {
      if (!demo) await api(`/api/save?materialId=${encodeURIComponent(id)}`, "DELETE");
      state.saved = state.saved.filter(x => x !== id);
      if (demo) persistDemo();
      renderResults(route() === "saved");
      toast("Убрано из сохранённого");
    } catch (err) {
      unsave.disabled = false;
      unsave.textContent = route() === "saved" ? "Убрать" : "✓ Сохранено";
      toast(err.message);
    }
  }
});

async function loadProfile() {
  if (demo) {
    mode.textContent = "Демо-режим · сохранения остаются только в этом браузере";
    render();
    return;
  }
  loadError = false;
  mode.textContent = "Загружаем ваш профиль…";
  try {
    const data = await api("/api/me");
    const dbRank = data.profile?.rank;
    const validRank = dbRank && Object.values(roleTitles).includes(dbRank) ? dbRank : state.title;
    state = {
      ...state,
      name: data.profile?.display_name || "Гость",
      title: validRank,
      saved: Array.isArray(data.saved) ? data.saved : [],
      completed: Array.isArray(data.completed) ? data.completed : []
    };
    loaded = true;
    loadError = false;
    mode.textContent = "";
    if (document.activeElement?.id === "search") {
      renderResults(false);
    } else {
      render();
    }
  } catch (err) {
    loadError = true;
    mode.textContent = "";
    const msg = document.createElement("span");
    msg.textContent = err.message;
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "mode-retry";
    retry.textContent = "Повторить";
    retry.addEventListener("click", loadProfile);
    mode.append(msg, retry);
    if (route() === "saved") renderResults(true);
    toast(err.message);
  }
}

window.addEventListener("hashchange", () => {
  closePngModal();
  render();
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
});

render();
loadProfile();
