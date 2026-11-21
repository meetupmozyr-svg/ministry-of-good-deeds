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
  { id: "phet", title: "PhET", category: "Школьные предметы", tag: "Эксперименты", description: "Виртуальные эксперименты по физике, химии, биологии и математике.", url: "https://phet.colorado.edu/ru/", terms: "Условия использования смотрите на сайте проекта." },
  { id: "geogebra", title: "GeoGebra", category: "Школьные предметы", tag: "Математика", description: "Интерактивная геометрия, графики и трёхмерные модели для наглядного объяснения.", url: "https://www.geogebra.org/", terms: "Бесплатно для некоммерческого использования; для коммерческого нужна лицензия." },
  { id: "python-tutor", title: "Python Tutor", category: "Школьные предметы", tag: "Информатика", description: "Пошаговая визуализация выполнения кода: видно, как меняются переменные и объекты.", url: "https://pythontutor.com/", terms: "Условия и доступные режимы смотрите на сайте проекта." }
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

function pageHeader(title, subtitle) {
  return `<div class="page-head"><a class="back" href="#map">← На карту Министерства</a><h1>${title}</h1>${subtitle ? `<p class="intro">${subtitle}</p>` : ""}</div>`;
}

function passNumber() {
  const tgId = tg?.initDataUnsafe?.user?.id;
  if (!tgId) return "№ 001024";
  return `№ ${String(tgId).slice(-6).padStart(6, "0")}`;
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
          <p class="intro">Здесь находят полезное для уроков, готовят праздник и делятся теплом. Начните с любой двери.</p>
          <div class="hero-actions">
            <a class="button red" href="#map">◇ Карта Министерства</a>
            <a class="button secondary" href="#pass">Мой пропуск</a>
          </div>
        </div>
      </section>
      <section class="card-panel">
        <div class="section-head"><h2>На доске объявлений</h2><span class="eyebrow-dark">Скоро</span></div>
        <div class="notice-grid">
          <article class="notice"><span class="date">1 декабря</span><h3>Праздник начинается</h3><p>Языковые разминки и новогодние активности для начальной школы.</p></article>
          <article class="notice"><span class="date">7 декабря</span><h3>Новая почта</h3><p>IT-викторина, обновлённые материалы и общий праздничный дайджест.</p></article>
        </div>
        <p class="note">Материалы и ссылки будут появляться по мере готовности.</p>
      </section>
    </div>`;
  } else if (page === "map") {
    main.innerHTML = `<div class="shell">
      ${pageHeader("У каждого дела<br>есть своя комната", "Выберите нужную дверь — все пространства открыты без обязательных заданий.")}
      <div class="map-scene">
        <img src="map.jpg" alt="Библиотека слева, мастерская справа и бюро добрых дел внизу">
        <a class="room-label lib" href="#library">📖 Библиотека</a>
        <a class="room-label work" href="#workshop">✨ Мастерская</a>
        <a class="room-label bureau" href="#bureau">✉ Бюро добрых дел</a>
      </div>
      <div class="room-list">
        <a class="room-card" href="#library"><h2>Библиотека находок</h2><p>Инструменты и сервисы для уроков</p></a>
        <a class="room-card" href="#workshop"><h2>Мастерская праздника</h2><p>Занятия, оформление и челленджи</p></a>
        <a class="room-card" href="#bureau"><h2>Бюро добрых дел</h2><p>Тёплые инициативы и поддержка</p></a>
      </div>
    </div>`;
  } else if (page === "library") {
    main.innerHTML = `<div class="shell">
      ${pageHeader("Библиотека находок", "Проверенные инструменты для обычных и праздничных уроков.")}
      <div class="scene-banner">
        <img src="library.jpg" alt="Книжные полки, зелёная книга и золотая лампа в библиотеке">
        <span class="scene-pill">📖 Библиотека</span>
        <button class="button red book-button" id="open-book">Открыть книгу находок</button>
      </div>
      <section class="card-panel" id="catalog">
        <label class="search-label" for="search">Найти ресурс</label>
        <input id="search" type="search" placeholder="Название, предмет или задача" value="${esc(search)}">
        <div class="filters" aria-label="Разделы библиотеки">
          ${["Все", "Языки", "Школьные предметы", "Дошкольникам и младшим", "Для разных уроков"].map(f => `<button class="filter" data-filter="${esc(f)}" aria-pressed="${filter === f}">${esc(f)}</button>`).join("")}
        </div>
        <div id="results" class="resource-grid"></div>
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
      ${pageHeader("Ваши полезные находки", demo ? "В демо подборка хранится в этом браузере." : "Материалы, сохранённые в вашем профиле Telegram.")}
      <section class="card-panel"><div id="results" class="resource-grid"></div></section>
    </div>`;
    renderResults(true);
  } else if (page === "pass") {
    main.innerHTML = `<div class="shell">
      ${pageHeader("Личный пропуск", "Вы уже часть Министерства. Здесь нет экзаменов — только тёплая атмосфера.")}
      <div class="pass-layout">
        <div class="pass-wrap">
          <div class="lanyard-strap" aria-hidden="true"></div>
          <article class="pass-card">
            <div class="pass-clasp" aria-hidden="true"></div>
            <span class="eyebrow-dark">Пропуск · Министерство добрых дел</span>
            <div class="pass-crest" aria-hidden="true"><span class="pass-initial">${esc((state.name || "Г").slice(0, 1).toUpperCase())}</span></div>
            <h2>${esc(state.name)}</h2>
            <span class="rank-ribbon">${esc(state.title)}</span>
            <p class="pass-num">${esc(passNumber())}</p>
            <div class="pass-stamp" aria-hidden="true">❄</div>
          </article>
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
      ${pageHeader("Мастерская праздника", "Занятия, оформление и праздничные идеи для ваших учеников.")}
      <section class="card-panel">
        <article class="soon"><span class="status">Готовится · план на 1 декабря</span><h2>Провести занятие</h2><p>Языковые разминки, рождественские и новогодние уроки. IT-викторина запланирована на 7 декабря.</p></article>
        <article class="soon"><span class="status">В подготовке</span><h2>Оформить и поздравить</h2><p>Распечатки и раскраски для начальной школы, фоны, открытки и карта пожеланий сообщества.</p></article>
        <article class="soon"><span class="status">Ожидаем ссылку</span><h2>Предложить ученикам</h2><p>Новогодний челлендж на Скайхабе: цифровые подарки, сайты и проекты на Python.</p></article>
      </section>
    </div>`;
  } else if (page === "bureau") {
    main.innerHTML = `<div class="shell">
      ${pageHeader("Бюро добрых дел", "Можно подарить не только вещь, но и внимание, время и поддержку.")}
      <section class="card-panel">
        <article class="soon"><span class="status">На проверке</span><h2>Найти инициативу</h2><p>«Ёлка желаний» и «Подари Подарок» предложены командой. Уточняем условия и актуальные ссылки.</p></article>
        <article class="soon"><span class="status">Следующий этап</span><h2>Предложить инициативу</h2><p>Пространство для проектов, которые поддерживают педагоги. Участие полностью добровольное.</p></article>
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

  return `<article class="resource"><span class="tag">${esc(r.tag)}</span><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p><p class="terms">${esc(r.terms)}</p><div class="resource-foot"><a class="button secondary" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Открыть</a>${actionBtn}</div></article>`;
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

  const query = search.toLocaleLowerCase("ru-RU");
  const list = resources.filter(r =>
    (!savedOnly || state.saved.includes(r.id)) &&
    (savedOnly || filter === "Все" || r.category === filter) &&
    (savedOnly || `${r.title} ${r.description} ${r.tag}`.toLocaleLowerCase("ru-RU").includes(query))
  );

  target.innerHTML = list.length
    ? list.map(r => card(r, savedOnly)).join("")
    : `<div class="empty"><h2>${savedOnly ? "Пока ни одной находки" : filter !== "Все" && !search ? "Эта полка наполняется" : "Ничего не нашлось"}</h2><p>${savedOnly ? "Загляните в библиотеку и сохраните то, что пригодится." : "В первой подборке доступны три ресурса в разделе «Школьные предметы»."}</p>${savedOnly ? '<div class="actions"><a class="button" href="#library">В библиотеку</a></div>' : ""}</div>`;
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
    btn.addEventListener("click", () => {
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
        state.title = roleTitles[winner] || "Хранитель тепла";
        saveTitleLocal(state.title);
        quizStep = null;
        quizAnswers = [];
        render();
        toast(`Новое звание: ${state.title}`);
      }
    });
  });
}

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
      toast(err.status === 404 ? "Для удаления обновите src/index.js (Шаг 2)." : err.message);
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
    state = {
      ...state,
      name: data.profile?.display_name || "Гость",
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
  render();
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
});

render();
loadProfile();
