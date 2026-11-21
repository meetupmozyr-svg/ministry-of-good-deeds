"use strict";
const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();
try {
  tg?.setHeaderColor?.("#f7efdf");
  tg?.setBackgroundColor?.("#e9e0ce");
} catch {}

const initData = tg?.initData || "";
const demo = !initData;
const DEMO_KEY = "ministry-warm-letters-demo-v1";
const resources = [
  { id: "phet", title: "PhET", category: "Школьные предметы", tag: "Эксперименты", description: "Виртуальные эксперименты по физике, химии, биологии и математике.", url: "https://phet.colorado.edu/ru/", terms: "Условия использования смотрите на сайте проекта." },
  { id: "geogebra", title: "GeoGebra", category: "Школьные предметы", tag: "Математика", description: "Интерактивная геометрия, графики и трёхмерные модели для наглядного объяснения.", url: "https://www.geogebra.org/", terms: "На сайте указано: бесплатно для некоммерческого использования. Для коммерческого применения нужна отдельная лицензия." },
  { id: "python-tutor", title: "Python Tutor", category: "Школьные предметы", tag: "Информатика", description: "Пошаговая визуализация выполнения кода: наблюдайте, как меняются переменные и объекты.", url: "https://pythontutor.com/", terms: "Условия и доступные режимы смотрите на сайте проекта." }
];

let state = { name: "Гость", saved: [], completed: [] };
let loaded = demo;
let loadError = false;
let filter = "Все";
let search = "";
let toastTimer;

if (demo) {
  try {
    const data = JSON.parse(localStorage.getItem(DEMO_KEY) || "null");
    if (data && typeof data.name === "string" && Array.isArray(data.saved)) {
      state = {
        name: data.name.slice(0, 40) || "Гость",
        saved: data.saved.filter(x => typeof x === "string"),
        completed: []
      };
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
    localStorage.setItem(DEMO_KEY, JSON.stringify(state));
    return true;
  } catch {
    toast("Браузер не разрешает хранение. Изменения останутся только до закрытия страницы.");
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
    throw new Error(
      response.status === 401
        ? "Откройте приложение заново через Telegram."
        : "Не удалось сохранить данные. Попробуйте ещё раз."
    );
  }
  return response.json();
}

function route() {
  const candidate = location.hash.slice(1).split("?")[0];
  return ["hall", "map", "library", "workshop", "bureau", "saved", "pass"].includes(candidate) ? candidate : "hall";
}

function pageHeader(title, subtitle) {
  return `<div class="page-top"><a class="back" href="#map">На карту Министерства</a><h1>${title}</h1>${subtitle ? `<p class="intro">${subtitle}</p>` : ""}</div>`;
}

function render() {
  const page = route();
  const active = ["library", "workshop", "bureau"].includes(page) ? "map" : page;
  document.querySelectorAll("[data-nav]").forEach(a => a.setAttribute("aria-current", a.dataset.nav === active ? "page" : "false"));

  if (page === "hall") {
    main.innerHTML = `<div class="hero"><img src="hall.jpg" alt="Тёплая бумажная приёмная: письма на столе, свет лампы и снег за окном" fetchpriority="high"></div><section class="welcome"><span class="eyebrow">Бюро тёплых писем</span><h1>Добро пожаловать,<br>коллега.</h1><p class="intro">Здесь находят полезное, готовят праздник и делятся добром. Начните с любой двери.</p><div class="actions"><a class="button red" href="#map">Исследовать Министерство</a><a class="button secondary" href="#pass">Мой пропуск</a></div></section><section class="section"><div class="section-head"><h2>На доске объявлений</h2><span class="eyebrow">Скоро</span></div><div class="notice-grid"><article class="notice"><span class="date">1 декабря</span><h3>Праздник начинается</h3><p>Планируются языковые разминки и новогодние активности для начальной школы.</p></article><article class="notice"><span class="date">7 декабря</span><h3>Новая почта</h3><p>Планируются IT-викторина, обновлённые материалы и общий праздничный дайджест.</p></article></div><p class="note">Планы из встречи 20 ноября. Ссылки появятся после подтверждения готовности материалов.</p></section>`;
  } else if (page === "map") {
    main.innerHTML = pageHeader("У каждого дела<br>есть своя комната.", "Выберите, что вам сейчас нужно. Все двери открыты — задания проходить необязательно.") + `<div class="map-scene"><img src="map.jpg" alt="Библиотека слева, праздничная мастерская справа и бюро писем внизу"><a class="room-label lib" href="#library">Библиотека находок</a><a class="room-label work" href="#workshop">Мастерская праздника</a><a class="room-label bureau" href="#bureau">Бюро добрых дел</a></div><div class="room-list"><a class="room-card" href="#library"><h2>Библиотека находок</h2><p>Инструменты и ресурсы для ваших уроков</p></a><a class="room-card" href="#workshop"><h2>Мастерская праздника</h2><p>Занятия, оформление и активности для учеников</p></a><a class="room-card" href="#bureau"><h2>Бюро добрых дел</h2><p>Инициативы, участие и тёплые истории</p></a></div>`;
  } else if (page === "library") {
    main.innerHTML = pageHeader("Библиотека находок", "Полезное для обычных и необычных уроков. Откройте книгу — и соберите свою подборку.") + `<div class="library-scene"><img src="library.jpg" alt="Книжные полки, зелёная книга и лампа в бумажной библиотеке"><button class="button book-button" id="open-book">Открыть книгу находок</button></div><section class="catalog" id="catalog"><label class="search-label" for="search">Найти ресурс</label><input id="search" type="search" placeholder="Название, предмет или задача" value="${esc(search)}"><div class="filters" aria-label="Разделы библиотеки">${["Все", "Языки", "Школьные предметы", "Дошкольникам и младшим", "Для разных уроков"].map(f => `<button class="filter" data-filter="${esc(f)}" aria-pressed="${filter === f}">${esc(f)}</button>`).join("")}</div><div id="results" class="resource-grid"></div><p class="note">Первая подборка для проверки интерфейса. Остальные ресурсы из списка добавим после уточнения ссылок и условий использования.</p></section>`;
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
    main.innerHTML = pageHeader("Ваши полезные находки", demo ? "В демо подборка хранится только в этом браузере." : "Материалы, сохранённые в вашем профиле Telegram.") + `<section class="catalog"><div id="results" class="resource-grid"></div></section>`;
    renderResults(true);
  } else if (page === "pass") {
    main.innerHTML = pageHeader("Ваш пропуск", "Вы уже часть Министерства. Здесь нет экзаменов и сравнений.") + `<div class="pass-layout"><article class="pass-card"><span class="eyebrow">Министерство добрых дел</span><div class="portrait" aria-hidden="true">${esc((state.name || "Г").slice(0, 1).toUpperCase())}</div><h2>${esc(state.name)}</h2><span class="rank">Хранитель тепла</span><p class="note">${demo ? "Демонстрационный пропуск" : "Макет пропуска · номер пока не присвоен"}</p><div class="stamp" aria-hidden="true">✳</div><p class="note">Зима 2026</p></article><div><form id="name-form" class="form-box"><label for="display-name">Как к вам обращаться?</label><input id="display-name" type="text" maxlength="40" required value="${esc(state.name)}" ${!loaded ? "disabled" : ""}><button class="button" ${!loaded ? "disabled" : ""}>Сохранить имя</button></form><p class="note">«Хранитель тепла» — игровое звание, не оценка профессиональных качеств.</p><p class="note">Фото, уникальный номер и PNG-экспорт появятся на следующем этапе.</p></div></div>`;
  } else if (page === "workshop") {
    main.innerHTML = pageHeader("Мастерская праздника", "Здесь собираются материалы, с которыми проще подготовить праздничный урок.") + `<section class="catalog"><article class="soon"><span class="status">Готовится · план на 1 декабря</span><h2>Провести занятие</h2><p>Языковые разминки, рождественские и новогодние уроки. IT-викторина запланирована на 7 декабря.</p></article><article class="soon"><span class="status">Материалы в подготовке</span><h2>Оформить и поздравить</h2><p>Распечатки и раскраски для начальной школы; фоны, открытки и карта пожеланий от сообщества.</p></article><article class="soon"><span class="status">Ожидаем ссылку и условия</span><h2>Предложить ученикам</h2><p>Новогодний челлендж на Скайхабе: цифровые подарки, сайты и проекты на Python. Это отдельная ученическая активность со своими правилами.</p></article><p class="note">Содержание по итогам встречи 20 ноября. Готовность и даты ещё предстоит подтвердить.</p></section>`;
  } else if (page === "bureau") {
    main.innerHTML = pageHeader("Бюро добрых дел", "Можно подарить не только вещь, но и время, внимание, поддержку.") + `<section class="catalog"><article class="soon"><span class="status">Кандидаты из обсуждения · ещё не опубликованы</span><h2>Найти инициативу</h2><p>«Ёлка желаний» и «Подари Подарок» предложены командой. Условия участия и актуальность ещё нужно проверить.</p></article><article class="soon"><span class="status">Планируем следующий этап</span><h2>Предложить инициативу</h2><p>Место для проектов, которые поддерживают преподаватели. Форма предложений пока не подключена.</p></article><p class="note">Участие добровольное. За пожертвования нет баллов или рейтингов.</p></section>`;
  } else {
    main.innerHTML = pageHeader("Такой комнаты пока нет", "Вернитесь на карту и выберите одну из трёх дверей.");
  }

  bindActions();
}

function card(r, savedOnly = false) {
  const saved = state.saved.includes(r.id);
  const actionBtn = saved
    ? `<button class="button secondary" data-unsave="${esc(r.id)}" aria-pressed="true" ${!loaded ? "disabled" : ""}>${!loaded ? "Загрузка…" : savedOnly ? "Убрать" : "✓ Сохранено"}</button>`
    : `<button class="button" data-save="${esc(r.id)}" ${!loaded ? "disabled" : ""}>${!loaded ? "Загрузка…" : "Сохранить"}</button>`;

  return `<article class="resource"><span class="tag">${esc(r.tag)}</span><h3>${esc(r.title)}</h3><p>${esc(r.description)}</p><p class="terms">${esc(r.terms)}</p><div class="resource-foot"><a class="button secondary" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Открыть сайт</a>${actionBtn}</div></article>`;
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
    : `<div class="empty"><h2>${savedOnly ? "Пока ни одной находки" : filter !== "Все" && !search ? "Эта полка наполняется" : "Ничего не нашлось"}</h2><p>${savedOnly ? "Загляните в библиотеку и сохраните то, что пригодится." : "В первой версии доступны три ресурса в разделе «Школьные предметы»."}</p>${savedOnly ? '<div class="actions"><a class="button" href="#library">В библиотеку</a></div>' : ""}</div>`;
}

function bindActions() {
  const form = document.querySelector("#name-form");
  if (!form) return;
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
    mode.textContent = "Демо · сохранения остаются в этом браузере, данные Telegram не меняются";
    render();
    return;
  }
  loadError = false;
  mode.textContent = "Загружаем ваш профиль…";
  try {
    const data = await api("/api/me");
    state = {
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
