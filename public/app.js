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
const tgFirstName = (tg?.initDataUnsafe?.user?.first_name || "").trim().slice(0, 40);
const DEMO_KEY = "ministry-warm-letters-demo-v1";
const TITLE_KEY = "ministry-pass-title-v1";
const GATE_KEY = "ministry-gate-open-v1";
const ONBOARD_KEY = "ministry-pass-onboarded-v1";

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

const entranceRiddle = {
  text: "Оно не боится ни вьюги, ни расстояний, приходит без почты на зимний урок, не прячется в ящик и в яркую бумагу — но дарит крылья и тёплый огонёк. Чем щедрее им делятся, тем больше его становится. Что открывает двери Министерства?",
  options: [
    { id: "snow", label: "❄ Снежинка на варежке", hint: "Красиво, но на тёплой ладони снежинка растает, а наш ключ только крепнет!" },
    { id: "kindness", label: "✨ Доброе слово и участие" },
    { id: "gift", label: "📦 Подарок под ёлкой", hint: "Коробку открывают один раз, а этот подарок умножается, когда им делятся через экран!" },
    { id: "chimes", label: "🕰 Бой курантов", hint: "Куранты бьют в полночь, а этот ключ согревает уроки круглый год." }
  ]
};

const roleMeta = {
  "Хранитель тепла": { key: "warm", emoji: "🕯️", desc: "Зажигает на онлайн-уроках уютный свет, к которому хочется возвращаться даже в самую вьюжную неделю." },
  "Архивариус чудес": { key: "wonder", emoji: "✨", desc: "Находит маленькие открытия в каждой теме и превращает обычный пример в зимнее чудо." },
  "Мастер тёплых писем": { key: "letter", emoji: "🪶", desc: "Превращает слова, открытки и заметки в настоящую поддержку через экран." },
  "Маяк поддержки": { key: "care", emoji: "🧭", desc: "Помогает не сбиться с курса и спокойно дойти до любой цели." },
  "Дежурный по ночным идеям": { key: "owl", emoji: "🦉", desc: "Придумывает лучшие разминки и ходы, когда город уже укутан снегом." },
  "Хранитель тайных подарков": { key: "gift", emoji: "🎁", desc: "Умеет спрятать в занятии сюрприз, который запомнится ученикам надолго." },
  "Алхимик зимнего какао": { key: "tea", emoji: "☕", desc: "Смешивает терпение, юмор и знание в идеальный согревающий рецепт урока." },
  "Смотритель морозных узоров": { key: "crystal", emoji: "❄️", desc: "Замечает тонкую красоту в деталях и бережно собирает её в систему." }
};

const roleTitleByKey = Object.fromEntries(
  Object.entries(roleMeta).map(([title, meta]) => [meta.key, title])
);

const quizQuestions = [
  {
    q: "Утро перед зимним уроком. С чего начинается ваше настроение?",
    options: [
      { label: "Зажигаю свечу или тёплую настольную лампу", role: "warm" },
      { label: "Готовлю горячий напиток по особому рецепту", role: "tea" },
      { label: "Перелистываю идеи, которые пришли ночью", role: "owl" },
      { label: "Любуюсь морозным узором на окне", role: "crystal" }
    ]
  },
  {
    q: "До праздника две недели, а ученик устал. Как вы его поддержите?",
    options: [
      { label: "Спрячу в уроке маленький игровой сюрприз", role: "gift" },
      { label: "Дам спокойный и понятный ориентир на сегодня", role: "care" },
      { label: "Покажу деталь, от которой загорятся глаза", role: "wonder" },
      { label: "Оставлю тёплую записку с искренней похвалой", role: "letter" }
    ]
  },
  {
    q: "На вашем столе в Министерстве лежит один особый предмет. Какой?",
    options: [
      { label: "Перьевая ручка с золотыми чернилами", role: "letter" },
      { label: "Старинный компас для трудных тем", role: "care" },
      { label: "Калейдоскоп, собирающий редкие идеи", role: "crystal" },
      { label: "Медная кружка, которая не остывает", role: "tea" }
    ]
  },
  {
    q: "В какой момент к вам приходят самые удачные задумки?",
    options: [
      { label: "Поздним вечером, когда за окном тишина и снег", role: "owl" },
      { label: "В разгар тёплого и живого разговора", role: "warm" },
      { label: "Внезапно — как искра среди обычного дела", role: "wonder" },
      { label: "Когда хочется порадовать кого-то без повода", role: "gift" }
    ]
  },
  {
    q: "Какой подарок вы бы передали коллеге через экран?",
    options: [
      { label: "Конверт с письмом, от которого становится легче", role: "letter" },
      { label: "Секретную коробочку с подсказкой для урока", role: "gift" },
      { label: "Термос уюта на самую загруженную неделю", role: "tea" },
      { label: "Карту Министерства, где отмечены тихие гавани", role: "care" }
    ]
  },
  {
    q: "Если бы на вашей двери в Министерстве висела табличка, что там было бы написано?",
    options: [
      { label: "«Здесь тепло даже в январе»", role: "warm" },
      { label: "«Ночная смена волшебных идей»", role: "owl" },
      { label: "«Каждая мелочь складывается в узор»", role: "crystal" },
      { label: "«Обычное — только до первого взгляда»", role: "wonder" }
    ]
  }
];

function getRoleMeta(title) {
  return roleMeta[title] || roleMeta["Хранитель тепла"];
}

const ICONS = {
  map: `<svg class="ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20V6.5Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M9 4v13.5M15 6.5V20" stroke="currentColor" stroke-width="1.9"/></svg>`,
  book: `<svg class="ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v17H6.5A2.5 2.5 0 0 0 4 22V5.5Zm16 0A2.5 2.5 0 0 0 17.5 3H12v17h5.5a2.5 2.5 0 0 1 2.5 2V5.5Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>`,
  spark: `<svg class="ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m12 3 1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3Z" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>`,
  mail: `<svg class="ico" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" stroke-width="1.9"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>`
};

let state = { name: tgFirstName || "Гость", saved: [], completed: [], title: loadSavedTitle() };
let loaded = demo;
let loadError = false;
let gateOpen = loadGateOpen();
let passOnboarded = loadPassOnboarded();
let onboardStep = "intro";
let passBgImg = null;
let passDeskImg = null;
let gateHint = "";
let filter = "Все";
let search = "";
let quizStep = null;
let quizAnswers = [];
let toastTimer;

function loadGateOpen() {
  try { return localStorage.getItem(GATE_KEY) === "1"; } catch { return false; }
}

function saveGateOpen() {
  gateOpen = true;
  try { localStorage.setItem(GATE_KEY, "1"); } catch {}
}

function loadPassOnboarded() {
  try { return localStorage.getItem(ONBOARD_KEY) === "1"; } catch { return false; }
}

function savePassOnboarded() {
  passOnboarded = true;
  try { localStorage.setItem(ONBOARD_KEY, "1"); } catch {}
}

function loadSavedTitle() {
  try {
    const val = localStorage.getItem(TITLE_KEY);
    return val && roleMeta[val] ? val : "Хранитель тепла";
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
    if (data && typeof data.name === "string") {
      state.name = data.name.slice(0, 40) || "Гость";
      if (Array.isArray(data.saved)) state.saved = data.saved.filter(x => typeof x === "string");
      if (Array.isArray(data.completed)) state.completed = data.completed.filter(x => typeof x === "string");
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
    localStorage.setItem(DEMO_KEY, JSON.stringify({
      name: state.name,
      saved: state.saved,
      completed: state.completed
    }));
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
  return `<div class="page-head">
    ${showBack ? '<a class="back" href="#map">← На карту Министерства</a>' : ""}
    ${decorImg("gold-star-ornament", "decor-star")}
    <h1>${title}</h1>
    ${subtitle ? `<p class="intro">${subtitle}</p>` : ""}
  </div>`;
}

function passNumber() {
  const tgId = tg?.initDataUnsafe?.user?.id;
  if (!tgId) return "№ 001024";
  return `№ ${String(tgId).slice(-6).padStart(6, "0")}`;
}

function sceneImg(primary, fallback, alt, cls = "", priority = false) {
  return `<img${cls ? ` class="${cls}"` : ""} src="${primary}" alt="${esc(alt)}"${priority ? ' fetchpriority="high"' : ""} onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='${fallback}';}">`;
}

function roomHeroHtml(primaryImg, fallbackImg, alt, title, subtitle, actionHtml = "") {
  return `<section class="room-hero">
    <div class="room-hero-media">
      ${sceneImg(primaryImg, fallbackImg, alt, "room-hero-img", true)}
    </div>
    <a class="room-back" href="#map">← На карту</a>
    <div class="room-hero-copy">
      <h1>${title}</h1>
      ${subtitle ? `<p class="intro">${subtitle}</p>` : ""}
      ${actionHtml ? `<div class="room-hero-actions">${actionHtml}</div>` : ""}
    </div>
  </section>`;
}

function decorImg(name, cls) {
  return `<img class="${cls}" src="assets/decorations/${name}.png" alt="" hidden onload="this.hidden=false" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='assets/decorations/${name}.webp';}else{this.remove();}">`;
}

function snowflakeSvg() {
  return `<svg class="gate-snowflake" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <path d="M24 4v40M6.7 14l34.6 20M41.3 14L6.7 34" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M19 8l5 5 5-5M19 40l5-5 5 5M9.5 21l6-3.5-1-6.5M38.5 27l-6 3.5 1 6.5M38.5 21l-6-3.5 1-6.5M9.5 27l6 3.5-1 6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="24" cy="24" r="3.5" fill="currentColor"/>
  </svg>`;
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

function passCardHtml() {
  const riddleDone = state.completed.includes("first-riddle");
  const meta = getRoleMeta(state.title);
  return `
  ${decorImg("burgundy-bow", "pass-bow-img")}
  <article class="pass-card${passBgImg ? " has-pass-bg" : ""}">
    <div class="pass-slot" aria-hidden="true"></div>
    <div class="pass-title-main">ПРОПУСК</div>
    <div class="pass-subtitle">Министерство добрых дел</div>
    <div class="pass-portrait-row">
      ${laurelSvg()}
      <div class="pass-arch" aria-hidden="true">
       <img class="pass-avatar" src="avatars/${esc(meta.key)}.png" alt="" hidden onload="this.hidden=false;this.parentElement.classList.add('has-avatar')" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='avatars/${esc(meta.key)}.webp';}else{this.remove();}">
        <span class="pass-emoji">${esc(meta.emoji)}</span>
      </div>
      ${laurelSvg("right")}
    </div>
<h2>${esc(state.name)}</h2>
    <span class="rank-ribbon">${esc(meta.emoji)} ${esc(state.title)}</span>
    <p class="pass-role-desc">${esc(meta.desc)}</p>
    <p class="pass-num">${esc(passNumber())}</p>
    <p class="pass-season">ЗИМА · 2026/2027</p>

    <img class="pass-wax-img" src="assets/decorations/wax-seal-snowflake.png" alt="" hidden onload="this.hidden=false;this.nextElementSibling.setAttribute('hidden','')" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='assets/decorations/wax-seal-snowflake.webp';}else{this.remove();}">
    ${postmarkSvg()}
  </article>`;
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

function loadImageOptional(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function loadImageAny(paths) {
  for (const p of paths) {
    const img = await loadImageOptional(p);
    if (img) return img;
  }
  return null;
}

async function preloadPassAssets() {
  const [cardBg, deskBg] = await Promise.all([
    loadImageAny(["assets/pass/pass-card-bg.webp", "assets/pass/pass-card-bg.png"]),
    loadImageAny(["assets/pass/pass-desk-bg.webp", "assets/pass/pass-desk-bg.png"])
  ]);
  passBgImg = cardBg;
  passDeskImg = deskBg;
  if (cardBg) {
    document.querySelectorAll(".pass-card").forEach(el => el.classList.add("has-pass-bg"));
  }
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

async function downloadPassPng() {
  const btn = document.querySelector("#download-pass");
  if (btn) btn.disabled = true;
  try {
    const meta = getRoleMeta(state.title);
    const [avatarImg, waxSealImg, cardBg, deskBg] = await Promise.all([
      loadImageAny([`avatars/${meta.key}.png`, `avatars/${meta.key}.webp`]),
      loadImageAny(["assets/decorations/wax-seal-snowflake.png", "assets/decorations/wax-seal-snowflake.webp"]),
      passBgImg ? Promise.resolve(passBgImg) : loadImageAny(["assets/pass/pass-card-bg.webp", "assets/pass/pass-card-bg.png"]),
      passDeskImg ? Promise.resolve(passDeskImg) : loadImageAny(["assets/pass/pass-desk-bg.webp", "assets/pass/pass-desk-bg.png"])
    ]);

    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1240;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (deskBg) {
      const scale = Math.max(900 / deskBg.width, 1240 / deskBg.height);
      const dw = deskBg.width * scale;
      const dh = deskBg.height * scale;
      ctx.drawImage(deskBg, (900 - dw) / 2, (1240 - dh) / 2, dw, dh);
    } else {
      const bg = ctx.createRadialGradient(450, 180, 60, 450, 620, 760);
      bg.addColorStop(0, "#215042");
      bg.addColorStop(1, "#122c24");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 900, 1240);
    }

    ctx.save();
    roundRectPath(ctx, 110, 118, 680, 1030, 46);
    if (cardBg) {
      ctx.clip();
      ctx.drawImage(cardBg, 110, 118, 680, 1030);
    } else {
      const cardGrad = ctx.createLinearGradient(0, 118, 0, 1150);
      cardGrad.addColorStop(0, "#fdf9f0");
      cardGrad.addColorStop(1, "#f4e8d1");
      ctx.fillStyle = cardGrad;
      ctx.fill();
    }
    ctx.restore();

    roundRectPath(ctx, 110, 118, 680, 1030, 46);
    ctx.strokeStyle = "#cfa96e";
    ctx.lineWidth = 4;
    ctx.stroke();

    if (!cardBg) {
      ctx.strokeStyle = "rgba(181,142,83,0.45)";
      ctx.lineWidth = 2;
      roundRectPath(ctx, 134, 142, 632, 982, 32);
      ctx.stroke();
      ctx.fillStyle = "#1c3d32";
      roundRectPath(ctx, 386, 174, 128, 22, 11);
      ctx.fill();
    }
ctx.textAlign = "center";
    ctx.fillStyle = "#1e3a31";
    ctx.font = "600 42px Georgia, serif";
    ctx.fillText("ПРОПУСК", 450, 294);

    ctx.fillStyle = "#665b4c";
    ctx.font = "bold 17px sans-serif";
    ctx.fillText("МИНИСТЕРСТВО ДОБРЫХ ДЕЛ", 450, 326);

if (avatarImg) {
      const s = Math.min(280 / avatarImg.width, 290 / avatarImg.height);
      const aw = avatarImg.width * s;
      const ah = avatarImg.height * s;
      ctx.save();
      ctx.shadowColor = "rgba(42, 30, 18, 0.18)";
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 6;
      ctx.drawImage(avatarImg, 450 - aw / 2, 482 - ah / 2, aw, ah);
      ctx.restore();
    } else {
      ctx.save();
      roundRectPath(ctx, 336, 345, 228, 255, 114);
      const archGrad = ctx.createLinearGradient(0, 345, 0, 600);
      archGrad.addColorStop(0, "#ebe0c8");
      archGrad.addColorStop(1, "#dfd0af");
      ctx.fillStyle = archGrad;
      ctx.fill();
      ctx.strokeStyle = "#c9a366";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
      ctx.font = "108px sans-serif";
      ctx.fillText(meta.emoji, 450, 505);
    }

    ctx.fillStyle = "#1e3a31";
    ctx.font = "56px Georgia, serif";
    ctx.fillText((state.name || "Гость").slice(0, 24), 450, 680);

    ctx.fillStyle = "#9d3443";
    roundRectPath(ctx, 165, 720, 570, 68, 34);
    ctx.fill();

ctx.fillStyle = "#fff9ee";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(`${meta.emoji} ${state.title}`, 450, 764);

    // Character description on saved PNG
    ctx.fillStyle = "#5f5445";
    ctx.font = "20px Georgia, serif";
    const words = (meta.desc || "").split(" ");
    let line = "", descY = 822;
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > 480) {
        ctx.fillText(line, 450, descY);
        line = w;
        descY += 28;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, 450, descY);

    ctx.fillStyle = "#665b4c";
    ctx.font = "bold 26px Georgia, serif";
    ctx.fillText(passNumber(), 450, Math.max(descY + 44, 915));

ctx.fillStyle = "#665b4c";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("ЗИМА · 2026/2027", 450, 1080);

    if (waxSealImg) {
      ctx.save();
      ctx.translate(645, 1005);
      ctx.rotate(-0.12);
      ctx.drawImage(waxSealImg, -72, -72, 144, 144);
      ctx.restore();
    } else {
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
    }

    const blob = await new Promise((resolve, reject) => canvas.toBlob(
      value => value ? resolve(value) : reject(new Error("Не удалось создать PNG")), "image/png"));
    showImageExport(blob, "ministry-pass.png", "Ваш пропуск готов");
  } catch (error) {
    toast("Не удалось подготовить пропуск. Попробуйте ещё раз.");
  } finally {
    if (btn) btn.disabled = false;
  }
}

function renderQuizMarkup(stepIdx, skipId = "skip-quiz") {
  const item = quizQuestions[stepIdx];
  const dots = quizQuestions.map((_, i) =>
    `<span class="quiz-dot ${i < stepIdx ? "done" : i === stepIdx ? "active" : ""}"></span>`
  ).join("");
  return `<div class="quiz-head">
    <span class="eyebrow-dark">Вопрос ${stepIdx + 1} из ${quizQuestions.length}</span>
    <div class="quiz-dots" aria-hidden="true">${dots}</div>
  </div>
  <p class="quiz-q">${esc(item.q)}</p>
  <div class="quiz-options">
    ${item.options.map((opt, idx) => `<button type="button" class="quiz-option" data-quiz-choice="${idx}">${esc(opt.label)}</button>`).join("")}
  </div>
  <div class="actions" style="justify-content:center"><button type="button" class="button secondary" id="${skipId}">Пропустить</button></div>`;
}

function renderQuizSection() {
  const meta = getRoleMeta(state.title);
  if (quizStep === null) {
    return `<div class="quiz-box">
      <div class="quiz-result">
        <span class="eyebrow-dark">Ваше звание · 8 вариантов</span>
        <p style="margin-top:6px"><strong>${esc(meta.emoji)} ${esc(state.title)}</strong></p>
        <p class="note" style="margin-top:6px">${esc(meta.desc)}</p>
      </div>
      <p class="note">Пройдите викторину из 6 зимних вопросов, чтобы узнать своё министерское звание и получить уникальный значок на пропуск.</p>
      <div class="actions"><button type="button" class="button red" id="start-quiz">Пройти викторину (6 вопросов)</button></div>
    </div>`;
  }
  return `<div class="quiz-box">${renderQuizMarkup(quizStep)}</div>`;
}

function computeQuizWinner(answers) {
  const scores = {};
  const lastIndex = {};
  answers.forEach((role, stepIdx) => {
    scores[role] = (scores[role] || 0) + 1;
    lastIndex[role] = stepIdx;
  });
  const winner = Object.keys(scores).sort((a, b) =>
    (scores[b] - scores[a]) || (lastIndex[b] - lastIndex[a])
  )[0] || "warm";
  return roleTitleByKey[winner] || "Хранитель тепла";
}

function shouldShowGate() {
  if (gateOpen || state.completed.includes("first-riddle")) return false;
  if (!demo && !loaded && !loadError) return "loading";
  return true;
}

function renderGate() {
  document.body.classList.add("is-gated");
  document.body.classList.remove("is-pass");
  main.innerHTML = `<div class="shell">
    <div class="gate-frame">
      ${decorImg("evergreen-sprig", "hero-branch tl")}
      ${decorImg("evergreen-sprig", "hero-branch tr")}
      <section class="gate-stage">
        <div class="gate-banner">
          ${sceneImg("assets/scenes/hall.jpg", "hall.jpg", "Волшебные двери приёмной Министерства добрых дел", "gate-bg", true)}
          <span class="gate-key-badge">Ключ от дверей Министерства</span>
        </div>
        <div class="gate-body">
          ${snowflakeSvg()}
          <h1>Тайна зимнего входа</h1>
          <p class="intro">Чтобы зажечь фонари в Холле и открыть комнаты, подберите ключ-отгадку.</p>
          <blockquote class="gate-riddle">${esc(entranceRiddle.text)}</blockquote>
          <div class="gate-options">
            ${entranceRiddle.options.map(opt => `<button type="button" class="gate-option" data-gate-choice="${esc(opt.id)}">${esc(opt.label)}</button>`).join("")}
          </div>
          ${gateHint ? `<p class="gate-hint" role="status">${esc(gateHint)}</p>` : ""}
          <button type="button" class="gate-skip" id="gate-skip-btn">Пропустить загадку и войти</button>
        </div>
      </section>
    </div>
  </div>`;

  document.querySelectorAll("[data-gate-choice]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.gateChoice;
      const picked = entranceRiddle.options.find(o => o.id === id);
      if (!picked) return;
      if (id !== "kindness") {
        gateHint = picked.hint || "Попробуйте другой вариант!";
        render();
        return;
      }
      btn.disabled = true;
      btn.textContent = "Открываем двери…";
      if (!demo) {
        try { await api("/api/riddle", "POST", { choice: "kindness" }); } catch {}
      }
      if (!state.completed.includes("first-riddle")) state.completed.push("first-riddle");
      if (demo) persistDemo();
      gateHint = "";
      saveGateOpen();
      render();
      toast("Двери открыты! Оформите свой пропуск ✨");
    });
  });

  const skipBtn = document.querySelector("#gate-skip-btn");
  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      gateHint = "";
      saveGateOpen();
      render();
    });
  }
}

function renderOnboarding() {
  document.body.classList.add("is-gated");
  document.body.classList.toggle("is-pass", onboardStep === "done");

  if (onboardStep === "quiz") {
    main.innerHTML = `<div class="shell">
      <section class="card-panel onboard-card">
        <div class="section-head">
          <div class="section-title-row">${decorImg("vintage-lantern", "decor-inline")}<h2>Ваше звание</h2></div>
          <span class="eyebrow-dark">Пропуск</span>
        </div>
        ${renderQuizMarkup(quizStep ?? 0, "onboard-skip-quiz")}
      </section>
    </div>`;

    document.querySelector("#onboard-skip-quiz").addEventListener("click", () => {
      quizStep = null;
      quizAnswers = [];
      onboardStep = "done";
      render();
    });

    document.querySelectorAll("[data-quiz-choice]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const idx = Number(btn.dataset.quizChoice);
        const picked = quizQuestions[quizStep ?? 0]?.options[idx]?.role;
        if (picked) quizAnswers.push(picked);
        if ((quizStep ?? 0) + 1 < quizQuestions.length) {
          quizStep = (quizStep ?? 0) + 1;
          render();
        } else {
          const newTitle = computeQuizWinner(quizAnswers);
          const meta = getRoleMeta(newTitle);
          state.title = newTitle;
          saveTitleLocal(newTitle);
          quizStep = null;
          quizAnswers = [];
          onboardStep = "done";
          render();
          if (!demo) {
            try { await api("/api/profile", "POST", { rank: newTitle }); } catch {}
          }
          toast(`Вы получили звание: ${meta.emoji} ${newTitle}`);
        }
      });
    });
    return;
  }

  if (onboardStep === "done") {
    main.innerHTML = `<div class="shell">
      <div class="page-head">
        ${decorImg("gold-star-ornament", "decor-star")}
        <h1>Ваш пропуск готов!</h1>
        <p class="intro">Сохраните карточку на память или откройте карту Министерства.</p>
      </div>
      <div class="pass-wrap">
        ${passCardHtml()}
        <div class="onboard-actions">
          <button type="button" class="button red" id="onboard-enter-map">${ICONS.map} На карту Министерства</button>
          <button type="button" class="button cream" id="download-pass">⬇ Сохранить PNG</button>
          <button type="button" class="button secondary" id="onboard-enter-hall">В Главный холл</button>
        </div>
      </div>
    </div>`;

    document.querySelector("#download-pass").addEventListener("click", downloadPassPng);
    document.querySelector("#onboard-enter-map").addEventListener("click", () => {
      savePassOnboarded();
      location.hash = "#map";
      render();
    });
    document.querySelector("#onboard-enter-hall").addEventListener("click", () => {
      savePassOnboarded();
      location.hash = "#hall";
      render();
    });
    return;
  }

  main.innerHTML = `<div class="shell">
    <div class="gate-frame">
      ${decorImg("evergreen-sprig", "hero-branch tl")}
      ${decorImg("evergreen-sprig", "hero-branch tr")}
      <section class="gate-stage">
        <div class="gate-banner">
          ${sceneImg("assets/scenes/hall.jpg", "hall.jpg", "Приёмная Министерства добрых дел", "gate-bg", true)}
          <span class="gate-key-badge">Личный пропуск · ${esc(passNumber())}</span>
        </div>
        <div class="gate-body">
          ${decorImg("vintage-lantern", "decor-star")}
<h1>Оформите свой пропуск</h1>
        <p class="intro">Добро пожаловать! Ответьте на 6 коротких вопросов, чтобы узнать своё звание в Министерстве и получить именной значок. Если спешите, этот шаг можно пропустить.</p>
        <form id="onboard-name-form" class="onboard-form">
          <label for="onboard-name">Как подписать пропуск?</label>
          <input id="onboard-name" type="text" maxlength="40" required value="${esc(state.name)}">
          <div class="onboard-actions">
            <button type="submit" class="button red">${ICONS.spark} Пройти викторину и получить пропуск</button>
            <button type="button" class="button secondary" id="onboard-skip-all">Пропустить и войти в Холл</button>
          </div>
        </form>
        </div>
      </section>
    </div>
  </div>`;

  document.querySelector("#onboard-name-form").addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.querySelector("#onboard-name").value.trim().slice(0, 40);
    if (!name) {
      toast("Введите имя для пропуска.");
      return;
    }
    state.name = name;
    if (demo) {
      persistDemo();
    } else {
      try { await api("/api/profile", "POST", { displayName: name }); } catch {}
    }
    quizStep = 0;
    quizAnswers = [];
    onboardStep = "quiz";
    render();
  });

  document.querySelector("#onboard-skip-all").addEventListener("click", () => {
    const inputName = document.querySelector("#onboard-name")?.value.trim().slice(0, 40);
    if (inputName) {
      state.name = inputName;
      if (demo) persistDemo();
    }
    savePassOnboarded();
    location.hash = "#hall";
    render();
  });
}

function render() {
  const gateState = shouldShowGate();
  if (gateState === "loading") {
    document.body.classList.add("is-gated");
    document.body.classList.remove("is-pass");
    main.innerHTML = `<div class="shell"><div class="card-panel"><p class="intro">Приоткрываем двери Министерства…</p></div></div>`;
    return;
  }
  if (gateState === true) {
    renderGate();
    return;
  }
  if (!passOnboarded) {
    renderOnboarding();
    return;
  }

  document.body.classList.remove("is-gated");
  const page = route();
  document.body.classList.toggle("is-pass", page === "pass");
  const active = ["library", "workshop", "bureau"].includes(page) ? "map" : page;
  document.querySelectorAll("[data-nav]").forEach(a => a.setAttribute("aria-current", a.dataset.nav === active ? "page" : "false"));

  if (page === "hall") {
    const greetingName = state.name && state.name !== "Гость" ? esc(state.name) : "коллега";
    main.innerHTML = `<div class="shell">
      <div class="hero-frame">
        ${decorImg("evergreen-sprig", "hero-branch tl")}
        ${decorImg("evergreen-sprig", "hero-branch tr")}
        <section class="hero-stage">
          ${sceneImg("assets/scenes/hall.jpg", "hall.jpg", "Уютная приёмная Министерства: письма на столе, свет лампы и снег за окном", "hero-bg", true)}
          <div class="hero-scrim">
            <span class="eyebrow">Бюро тёплых писем</span>
            <h1>Добро пожаловать,<br>${greetingName}!</h1>
            <p class="intro">38 полезных находок, идеи к празднику и тёплые дела.</p>
            <div class="hero-actions">
              <a class="button red" href="#map">${ICONS.map} Карта</a>
              <a class="button cream" href="#pass">Мой пропуск</a>
            </div>
          </div>
        </section>
      </div>
 ${window.MinistryAdvent ? window.MinistryAdvent.renderHtml() : ""}
    </div>`;
} else if (page === "map") {
    main.innerHTML = `<div class="shell">
      <div class="map-head-wrap">
        <p class="map-subtitle">Выберите дверь — все пространства открыты без обязательных заданий</p>
        <div class="map-title-wrap">
          <img class="map-title-img" src="assets/scenes/map-title.png" alt="Карта Министерства" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='assets/scenes/map-title.webp';}else{this.hidden=true;}">
        </div>
      </div>

      <div class="map-doors-stage">
        <div class="map-doors-inner">
          ${sceneImg("assets/scenes/map-doors.webp", "assets/scenes/map-doors.png", "Три волшебные двери: Библиотека, Мастерская и Бюро добрых дел", "map-doors-img", true)}
          <a class="door-touch door-lib" href="#library" aria-label="Войти в Библиотеку находок"></a>
          <a class="door-touch door-work" href="#workshop" aria-label="Войти в Мастерскую праздника"></a>
          <a class="door-touch door-bureau" href="#bureau" aria-label="Войти в Бюро добрых дел"></a>
        </div>
      </div>

     <div class="room-list">
        <a class="room-card" href="#library">
          <span class="door-mini door-mini-lib" aria-hidden="true"></span>
          <div class="room-card-body"><h2>Библиотека находок</h2><p>38 проверенных сервисов для уроков</p></div>
          <span class="room-arrow" aria-hidden="true">›</span>
        </a>
        <a class="room-card" href="#workshop">
          <span class="door-mini door-mini-work" aria-hidden="true"></span>
          <div class="room-card-body"><h2>Мастерская праздника</h2><p>Занятия, открытки и челлендж</p></div>
          <span class="room-arrow" aria-hidden="true">›</span>
        </a>
        <a class="room-card" href="#bureau">
          <span class="door-mini door-mini-bureau" aria-hidden="true"></span>
          <div class="room-card-body"><h2>Бюро добрых дел</h2><p>Тёплые инициативы и поддержка</p></div>
          <span class="room-arrow" aria-hidden="true">›</span>
        </a>
      </div>
    </div>`;
  } else if (page === "library") {
    main.innerHTML = `<div class="shell">
      ${roomHeroHtml(
        "assets/scenes/library-interior.png",
        "library.jpg",
        "Книжные полки, зелёная книга и золотая лампа в библиотеке",
        "Библиотека находок",
        "38 интерактивных веб-ресурсов по школьным предметам и языкам — с честными заметками о лицензиях.",
        `<button class="button red" id="open-book">${ICONS.book} Открыть книгу находок</button>`
      )}
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
          ${passCardHtml()}
          <div class="actions">
            <button type="button" class="button cream" id="download-pass">⬇ Сохранить PNG</button>
            ${!riddleDone ? `<button type="button" class="button secondary" id="replay-riddle-btn">Загадка входа</button>` : ""}
          </div>
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
      ${roomHeroHtml(
        "assets/scenes/workshop-interior.webp",
        "assets/scenes/hall.jpg",
        "Новогодняя мастерская Министерства с лентами, подарками и лампой",
        "Мастерская праздника",
        "Новогодние занятия, разминки и активности для ваших учеников."
      )}
      <section class="card-panel">
        <article class="soon"><span class="status">С 1 декабря · языки</span><h2>Разминки и 8 новых уроков</h2><p>Адвент-разминки и обновлённые рождественские и новогодние уроки для разных уровней, плюс резервная копия на Google-сайте.</p></article>
<article class="soon">
          <div class="soon-head"><span class="status">Работает сейчас</span>${decorImg("burgundy-bow", "decor-inline")}</div>
          <h2>Мастерская тёплых открыток</h2>
          <p>Создайте праздничную открытку для учеников и коллег прямо в браузере.</p>
          <div class="actions" style="margin-top:12px">
            <a class="button red" href="postcards.html">✨ Открыть мастерскую открыток</a>
          </div>
        </article>
        <article class="soon"><span class="status">С 1 декабря · начальная школа</span><h2>Комиксы, распечатки и раскраски</h2><p>Тематический поиск подарков и комиксов внутри уроков и карточки с распечатками для праздничных занятий.</p></article>        <article class="soon"><span class="status">7 декабря · IT и хоумскулинг</span><h2>Урок-викторина и челлендж Скайхаба</h2><p>Интерактивная викторина по компьютерной грамотности и алгоритмам, а также новогодний челлендж цифровых подарков и Python-проектов до конца января.</p></article>
        <article class="soon">
          <div class="soon-head"><span class="status">Доступно сейчас</span>${decorImg("paper-snowflake", "decor-inline")}</div>
          <h2>Фоны и расписание встреч</h2>
          <p>Новогодние обои для телефона и компьютера (включая серию с козликом — символом 2027) и календарь декабрьских встреч.</p>
          <div class="actions" style="margin-top:12px">
            <button type="button" class="button red" id="workshop-wallpapers-btn">Открыть обои</button>
            <button type="button" class="button secondary" id="workshop-schedule-btn">Расписание встреч</button>
          </div>
        </article>
      </section>
    </div>`;
  } else if (page === "bureau") {
    main.innerHTML = `<div class="shell">
      ${roomHeroHtml(
        "assets/scenes/bureau-interior.webp",
        "assets/scenes/hall.jpg",
        "Бюро тёплых писем с почтовыми ячейками, пером и подарками",
        "Бюро добрых дел",
        "Можно подарить не только вещь, но и внимание, время и поддержку."
      )}
      <section class="card-panel">
        <article class="soon">
          <div class="soon-head"><span class="status">Проверенная инициатива</span>${decorImg("evergreen-sprig", "decor-inline")}</div>
          <h2>Ёлка желаний</h2>
          <p>Всероссийская акция, где можно выбрать открытку и исполнить новогоднюю мечту ребёнка из уязвимой категории.</p>
          <div class="actions"><a class="button" href="https://xn--80aanbeohciex.xn--p1ai/" target="_blank" rel="noopener noreferrer">Открыть проект</a></div>
        </article>
        <article class="soon">
          <div class="soon-head"><span class="status">Проверенная инициатива</span>${decorImg("sealed-envelope", "decor-inline")}</div>
          <h2>Подари Подарок</h2>
          <p>Публикуют реальные истории и списки необходимых вещей для семей, оказавшихся в тяжёлой ситуации.</p>
          <div class="actions"><a class="button" href="https://podaripodarok.org/families" target="_blank" rel="noopener noreferrer">Посмотреть истории</a></div>
        </article>
        <article class="soon">
          <div class="soon-head"><span class="status">Добровольное участие</span>${decorImg("wax-seal-snowflake", "decor-inline")}</div>
          <h2>Поделиться своей инициативой</h2>
          <p>Мы собираем проверенные проекты в разных странах, где живут преподаватели. Участие полностью добровольное — без баллов и рейтингов.</p>
        </article>
      </section>
    </div>`;
} else {
    main.innerHTML = `<div class="shell">${pageHeader("Такой комнаты пока нет", "Вернитесь на карту и выберите одну из трёх дверей.")}</div>`;
  }

  bindActions();
  window.MinistryAdvent?.bind();
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
const wsWp = document.querySelector("#workshop-wallpapers-btn");
  if (wsWp) wsWp.addEventListener("click", () => window.MinistryAdvent?.openDay(3));
  const wsSch = document.querySelector("#workshop-schedule-btn");
  if (wsSch) wsSch.addEventListener("click", () => window.MinistryAdvent?.openDay(2));

  const replayBtn = document.querySelector("#replay-riddle-btn");
  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      gateOpen = false;
      try { localStorage.removeItem(GATE_KEY); } catch {}
      render();
    });
  }

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
        const newTitle = computeQuizWinner(quizAnswers);
        const meta = getRoleMeta(newTitle);
        state.title = newTitle;
        saveTitleLocal(newTitle);
        quizStep = null;
        quizAnswers = [];
        render();
        if (!demo) {
          try { await api("/api/profile", "POST", { rank: newTitle }); } catch {}
        }
        toast(`Ваше звание: ${meta.emoji} ${newTitle}`);
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
    const validRank = dbRank && roleMeta[dbRank] ? dbRank : state.title;
    const completed = Array.isArray(data.completed) ? data.completed : [];
    if (completed.includes("first-riddle")) saveGateOpen();
    state = {
      ...state,
      name: data.profile?.display_name || tgFirstName || "Гость",
      title: validRank,
      saved: Array.isArray(data.saved) ? data.saved : [],
      completed
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
    render();
    toast(err.message);
  }
}

window.addEventListener("hashchange", () => {
  closePngModal();
  render();
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
});

try {
  preloadPassAssets();
  render();
  loadProfile();
} catch (err) {
  mode.textContent = "Ошибка запуска: " + (err?.message || err);
}
// END OF APP.JS

// Keep generated images inside the Mini App; never navigate to a blob URL.
function showImageExport(blob, filename, title) {
  document.querySelector('#image-export-preview')?.remove();
  const url = URL.createObjectURL(blob);
  const previousFocus = document.activeElement;
  const previousOverflow = document.body.style.overflow;
  const file = new File([blob], filename, {type: blob.type});
  let canShare = false;
  try { canShare = !!navigator.share && !!navigator.canShare?.({files:[file]}); } catch {}
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
  const overlay = document.createElement('div');
  overlay.id = 'image-export-preview';
  overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label', title);
  overlay.innerHTML = `<style>
  #image-export-preview{position:fixed;inset:0;z-index:2147483647;box-sizing:border-box;display:flex;flex-direction:column;gap:10px;padding: max(12px,env(safe-area-inset-top)) 12px max(12px,env(safe-area-inset-bottom));background:#173b31;color:#fff8e9;font:16px/1.4 system-ui,sans-serif;overflow:auto}
  #image-export-preview *{box-sizing:border-box}
  #image-export-preview .export-toolbar{flex:none;text-align:center}
  #image-export-preview h2{font:600 21px/1.2 system-ui,sans-serif;margin:0 0 8px;color:#fff8e9}
  #image-export-preview p{font:14px/1.4 system-ui,sans-serif;margin:8px 0;color:#fff8e9}
  #image-export-preview .export-buttons{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
  #image-export-preview button{font:600 14px/1.2 system-ui,sans-serif;min-height:44px;padding:10px 16px;border:1px solid #d4bd8c;border-radius:24px;background:#fff4dc;color:#173b31;cursor:pointer}
  #image-export-preview .export-image{flex:1;min-height:80px;display:flex;align-items:center;justify-content:center}
  #image-export-preview img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;box-shadow:none;border-radius:0;-webkit-touch-callout:default;user-select:auto}
  #image-export-preview.capture-mode .export-toolbar{display:none}
  #image-export-preview.capture-mode{padding:0}
  </style><div class="export-toolbar"><h2></h2><div class="export-buttons">
  ${canShare ? '<button data-export="share">Поделиться / Сохранить</button>' : ''}
  ${!mobile ? '<button data-export="download">Скачать файл</button>' : ''}
  <button data-export="screenshot">Для скриншота</button><button data-export="close">Вернуться</button></div>
  <p>Если сохранение недоступно: нажмите «Для скриншота» и сделайте снимок экрана. Коснитесь картинки, чтобы вернуть кнопки.</p><p class="export-status" role="status"></p></div><div class="export-image"><img alt="Готовое изображение"></div>`;
  overlay.querySelector('h2').textContent = title;
  overlay.querySelector('img').src = url;
  document.body.append(overlay); document.body.style.overflow='hidden';
  const status = text => { overlay.querySelector('.export-status').textContent=text; };
  const close = () => { overlay.remove(); URL.revokeObjectURL(url); document.body.style.overflow=previousOverflow; document.removeEventListener('keydown',onKey); previousFocus?.focus(); };
  const onKey = e => { if(e.key==='Escape') close(); if(e.key==='Tab'){ const buttons=[...overlay.querySelectorAll('button')];const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}} };
  document.addEventListener('keydown',onKey);
  overlay.addEventListener('click',async e=>{
    if(overlay.classList.contains('capture-mode')){overlay.classList.remove('capture-mode');return;}
    const action=e.target.closest('button')?.dataset.export;
    if(action==='close')close();
    if(action==='screenshot')overlay.classList.add('capture-mode');
    if(action==='share')try{await navigator.share({files:[file],title});}catch(error){if(error.name!=='AbortError')status('Сохранение недоступно в этом приложении. Используйте «Для скриншота».');}
    if(action==='download'){const link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();status('Если загрузка не началась, используйте «Для скриншота».');}
  });
  overlay.querySelector('button').focus();
}
