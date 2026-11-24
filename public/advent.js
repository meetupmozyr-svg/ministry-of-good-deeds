"use strict";
(() => {
  const YEAR = 2026;

  const departments = {
    lessons: { name: "Для урока", short: "Урок", desc: "Найти идею для занятия", tone: "pine", symbol: "✦" },
    words: { name: "Хорошие слова", short: "Слова", desc: "Сказать спасибо", tone: "crimson", symbol: "♡" },
    rest: { name: "Отдых", short: "Отдых", desc: "Выдохнуть", tone: "sage", symbol: "☼" },
    wins: { name: "Маленькие победы", short: "Победы", desc: "Заметить прогресс", tone: "gold", symbol: "✧" }
  };

  const weeks = [
    { label: "1–7 декабря", start: 1, end: 7 },
    { label: "8–14 декабря", start: 8, end: 14 },
    { label: "15–21 декабря", start: 15, end: 21 },
    { label: "22–30 декабря", start: 22, end: 30 }
  ];

  const winter = [
    "https://static.tildacdn.com/tila3834-3936-4339-a235-323736626631/Frame_2131328648.png",
    "https://static.tildacdn.com/tila3837-6637-4263-a636-326233643034/Frame_2131328649.png",
    "https://static.tildacdn.com/tila6231-3737-4537-b262-343761653362/Frame_2131328651.png",
    "https://static.tildacdn.com/tila3137-3639-4466-a563-356365643735/Frame_2131328652.png",
    "https://static.tildacdn.com/tila6530-3936-4562-b665-636138656565/Frame_2131328653.png"
  ];

  const backgrounds = [
    ["Зимний городок", "winter-1.jpg"],
    ["Заснеженные мосты", "winter-2.jpg"],
    ["Северное сияние", "winter-3.jpg"],
    ["Морозные узоры", "winter-4.jpg"],
    ["Зимний лес", "winter-5.jpg"]
  ];

  const cardCopy = {
    1: ["Спасибо, что вы рядом!", "Пусть в новом году будет больше поводов собой гордиться."],
    4: ["С Новым годом!", "Пусть будет время на то, что радует."]
  };

  const entries = [
    { title: "Открываем Министерство", dept: "wins", text: "В декабре здесь каждый день открывается новая карточка. Заглядывайте за идеями для занятий, фонами, открытками и поводами заметить свой вклад." },
    { title: "Зимние обои", dept: "rest", text: "Выберите зимний фон для телефона или компьютера. Скачайте картинку и установите её в настройках экрана.", downloads: [["Городок · ПК", "winter-1.jpg"], ["Лес · ПК", "winter-5.jpg"], ["Городок · телефон", "phone-1.jpg"], ["Лес · телефон", "phone-5.jpg"]] },
    { title: "Расписание мастер-классов", dept: "rest", text: "В программе — новогодние творческие встречи. Расписание и условия участия пока уточняются." },
    { title: "Новогодний плейлист Олега", dept: "rest", text: "Музыка для перерыва между занятиями или зимней прогулки. Ссылка на плейлист пока уточняется." },
    { title: "Один момент, когда получилось", dept: "wins", text: "Вспомните, с чем ученик долго разбирался и что у него получилось. Запишите одну фразу о его прогрессе — ею можно начать итоговое занятие." },
    { title: "Короткое спасибо коллеге", dept: "words", text: "Вспомните, кто в этом году поделился материалом, помог разобраться или поддержал. Напишите пару строк о том, чем именно вам помог этот человек." },
    { title: "Зимняя разминка для урока", dept: "lessons", text: "Попросите ученика описать зимний предмет тремя подсказками, а сами попробуйте его угадать. Потом поменяйтесь ролями." },
    { title: "Фоны для видеозвонков", dept: "rest", text: "Скачайте понравившийся фон и добавьте его в настройках видеозвонка. Проверьте, как он выглядит, до начала занятия.", downloads: backgrounds },
    { title: "Материалы для уроков", dept: "lessons", text: "Собрали 38 проверенных интерактивных ресурсов для занятий вне платформы в Библиотеке находок.", route: "#library", linkLabel: "Открыть Библиотеку находок →" },
    { title: "Новогодние уроки на платформе", dept: "lessons", text: "Новогодние и рождественские уроки прошлых лет можно найти в каталоге на платформе. Ссылки на новые уроки пока уточняются." },
    { title: "Советы методистов", dept: "lessons", text: "Как подвести итоги года вместе с учеником? Попробуйте начать с вопроса «Что вы теперь можете сделать сами?» и вспомните конкретный пример." },
    { title: "Пауза между занятиями", dept: "rest", text: "Если между занятиями нашлось несколько свободных минут, закройте вкладки и отойдите от экрана. Чашки чая или короткой прогулки вполне достаточно." },
    { title: "Задание на перемену ролей", dept: "lessons", text: "Предложите ученику стать преподавателем на три минуты. Пусть он объяснит тему, которую недавно понял, и придумает один проверочный вопрос." },
    { title: "Заметка ученику", dept: "words", text: "Напишите ученику, какой момент с занятий вам запомнился. Назовите конкретное действие, которое заметили, и скажите, чему оно помогло." },
    { title: "Новогодние открытки", dept: "words", text: "Скачайте готовую открытку или соберите свою собственную в нашей Мастерской открыток.", route: "postcards.html", linkLabel: "✨ Сделать открытку →", downloads: [["Спасибо, что вы рядом!", "card-1.jpg"], ["С Новым годом!", "card-4.jpg"]] },
    { title: "Советы психологов", dept: "rest", text: "Здесь запланированы рекомендации психологов о том, как мягко завершить год. Ссылка пока уточняется." },
    { title: "Анонс итоговой встречи", dept: "words", text: "Итоговая встреча — повод поблагодарить друг друга и вспомнить, что получилось за год. Дату, время и формат ещё согласовывают." },
    { title: "Благотворительная подборка", dept: "words", text: "В Бюро добрых дел мы собрали проверенные акции, где можно поддержать детей и семьи перед праздником.", route: "#bureau", linkLabel: "Перейти в Бюро добрых дел →" },
    { title: "Четыре вопроса об итогах", dept: "wins", text: "Предложите ученику: что стало получаться, что запомнилось, чем он гордится и что хочет попробовать дальше. Можно выбрать один вопрос." },
    { title: "Урок с выбором", dept: "lessons", text: "Подготовьте к последнему занятию три коротких задания по знакомым темам. Пусть ученик выберет одно и объяснит почему." },
    { title: "Одна находка за год", dept: "wins", text: "Какое объяснение, задание или вопрос особенно помогли вашим ученикам в этом году? Сохраните эту идею и пример, с которым она сработала." },
    { title: "Добрые слова для встречи", dept: "words", text: "Если хотите поздравить коллег на итоговой встрече, начните с одного предложения: за что вы благодарны сообществу преподавателей?" },
    { title: "Итоговая встреча", dept: "words", text: "Здесь запланированы подробности итоговой встречи. Дату, время и ссылку ещё согласовывают." },
    { title: "Фраза, с которой хочется начать", dept: "lessons", text: "Предложите ученику закончить фразу «В новом году я хочу попробовать…». Запишите ответ, чтобы вернуться к нему после праздников." },
    { title: "День без спешки", dept: "rest", text: "Выберите одно небольшое дело для себя, на которое сегодня есть время: прогуляться, почитать или послушать любимую песню." },
    { title: "Маленькая победа ученика", dept: "wins", text: "Вспомните момент, когда ученик решился попробовать ещё раз. На следующем занятии расскажите ему, что вы тогда заметили." },
    { title: "Идея, которой можно поделиться", dept: "words", text: "Если в этом году вы нашли приём, который помог на занятиях, поделитесь им с коллегой. Одного примера и пары строк достаточно." },
    { title: "Что взять с собой в новый год", dept: "rest", text: "Выберите одну привычку, которая помогала вам чувствовать себя лучше между занятиями. Запишите, когда повторите её в январе." },
    { title: "Ваши личные итоги", dept: "wins", text: "Соберите короткую заметку: чему вы научились в этом году, кому помогли и какой момент хотите запомнить." },
    { title: "Новогодний дайджест", dept: "wins", text: "Финальный выпуск запланирован на 30 декабря. А все открытые карточки декабря остаются здесь.", route: "#workshop", linkLabel: "Заглянуть в Мастерскую →" }
  ];

  const moscowFmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow", year: "numeric", month: "2-digit", day: "2-digit"
  });
  const moscowDate = () => {
    const p = Object.fromEntries(moscowFmt.formatToParts().map(x => [x.type, x.value]));
    return `${p.year}-${p.month}-${p.day}`;
  };
  const isPreview = () => location.search.includes("preview=1") || location.hash.includes("preview=1");
  const releaseDate = day => `${YEAR}-12-${String(day).padStart(2, "0")}`;
  const isOpen = day => isPreview() || moscowDate() >= releaseDate(day);
  const esc = v => String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  let activeFilter = "";

  async function pictureBlob(file, picture) {
    const response = await fetch(picture);
    if (!response.ok) throw new Error("Фон недоступен");
    const background = await response.blob();
    if (file.startsWith("winter")) return background;

    const image = await createImageBitmap(background);
    const canvas = document.createElement("canvas");
    const phone = file.startsWith("phone");
    canvas.width = phone ? 1080 : 1200;
    canvas.height = phone ? 1920 : 667;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const height = Math.round(image.height * canvas.width / image.width);
    ctx.drawImage(image, 0, canvas.height - height, canvas.width, height);
    image.close();

    if (!phone) {
      const [headline, message] = cardCopy[Number(file.match(/-(\d+)/)[1])];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#243ab7";
      ctx.font = "bold 76px Arial, sans-serif";
      ctx.fillText(headline, 600, 292, 990);
      ctx.fillStyle = "#354c78";
      ctx.font = "32px Arial, sans-serif";
      ctx.fillText(message, 600, 405, 990);
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Ошибка сохранения")), "image/jpeg", 0.91);
    });
  }

  function renderWeeksHtml() {
    const today = moscowDate();
    const lockSvg = `<svg class="advent-lock" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.8" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" stroke-width="1.5"/></svg>`;

    return weeks.map((w, idx) => {
      const daysHtml = [];
      for (let d = w.start; d <= w.end; d++) {
        const entry = entries[d - 1];
        if (activeFilter && activeFilter !== entry.dept) continue;
        const open = isOpen(d);
        const isToday = !isPreview() && today === releaseDate(d);
        const special = [1, 7, 15, 24, 30].includes(d);
        const dept = departments[entry.dept];

        const innerContent = open
          ? `<div class="advent-open-head">
              <span class="advent-num">${String(d).padStart(2, "0")}</span>
              <span class="advent-badge" aria-hidden="true">${dept.symbol}</span>
            </div>
            <span class="advent-day-title">${esc(entry.title)}</span>`
          : `<span class="advent-seal-wrap" aria-hidden="true">
              <img class="advent-mini-seal" src="assets/decorations/wax-seal-snowflake.png" alt="" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='assets/decorations/wax-seal-snowflake.webp';}else{this.remove();}">
            </span>
            <span class="advent-num">${String(d).padStart(2, "0")}</span>
            <span class="advent-lock-corner" aria-hidden="true">${lockSvg}</span>
            ${special ? '<span class="advent-star-corner" aria-hidden="true">✦</span>' : ""}`;

        daysHtml.push(`<button type="button" class="advent-day ${open ? "is-open" : "is-locked"}${isToday ? " is-today" : ""}${special ? " is-special" : ""}" data-advent-day="${d}" data-tone="${dept.tone}" aria-label="${d} декабря. ${open ? esc(entry.title) : 'Карточка откроется ' + d + ' декабря'}">
          ${innerContent}
        </button>`);
      }
      if (!daysHtml.length) return "";
      const finalCls = !activeFilter && w.end === 30 ? " is-final" : "";
      return `<div class="advent-week${finalCls}">
        <div class="advent-week-head"><strong>${idx + 1}-я неделя</strong><span>${w.label}</span></div>
        <div class="advent-days">${daysHtml.join("")}</div>
      </div>`;
    }).join("");
  }

  function openDayModal(day) {
    const modal = document.querySelector("#png-modal");
    if (!modal) return;
    const entry = entries[day - 1];
    const open = isOpen(day);
    const dept = departments[entry.dept];
    const decorName = open ? "wax-seal-snowflake" : "sealed-envelope";

    let downloadsHtml = "";
    if (open && entry.downloads) {
      downloadsHtml = `<div class="advent-downloads">${entry.downloads.map(([label, file]) => {
        const pic = winter[Number(file.match(/-(\d+)/)[1]) - 1];
        return `<a class="advent-dl" href="${pic}" data-dl-file="${esc(file)}" data-dl-pic="${pic}">
          <img src="${pic}" alt="">
          <span>${esc(label)} ↓</span>
        </a>`;
      }).join("")}</div><p class="note" id="advent-dl-status"></p>`;
    }

    let actionHtml = "";
    if (open && entry.route) {
      actionHtml = `<a class="button red" href="${esc(entry.route)}" id="advent-route-link">${esc(entry.linkLabel || "Открыть")}</a>`;
    }

    modal.innerHTML = `<div class="modal-card advent-modal">
      <img class="advent-modal-decor" src="assets/decorations/${decorName}.png" alt="" hidden onload="this.hidden=false" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='assets/decorations/${decorName}.webp';}else{this.remove();}">
      <span class="eyebrow-dark">${day} декабря${open ? ` · ${esc(dept.name)}` : ""}</span>
      <h2 id="png-modal-title" style="margin-top:6px">${open ? esc(entry.title) : "Карточка пока закрыта"}</h2>
      <p style="margin-top:12px;text-align:left">${open ? esc(entry.text) : `Эта карточка откроется ${day} декабря в 00:00 по Москве.`}</p>
      ${downloadsHtml}
      <div class="modal-actions">
        ${actionHtml}
        <button type="button" class="button secondary" id="close-advent-modal">Закрыть</button>
      </div>
    </div>`;
    modal.hidden = false;

    document.querySelector("#close-advent-modal").addEventListener("click", () => {
      modal.hidden = true;
      modal.innerHTML = "";
    });

    const routeLink = document.querySelector("#advent-route-link");
    if (routeLink && entry.route?.startsWith("#")) {
      routeLink.addEventListener("click", () => {
        modal.hidden = true;
        modal.innerHTML = "";
      });
    }

    modal.querySelectorAll("[data-dl-file]").forEach(link => {
      link.addEventListener("click", async e => {
        e.preventDefault();
        const status = document.querySelector("#advent-dl-status");
        const file = link.dataset.dlFile;
        const pic = link.dataset.dlPic;
        status.textContent = "Готовим картинку…";
        try {
          const blob = await pictureBlob(file, pic);
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = file.startsWith("winter") ? file.replace(".jpg", ".png") : file;
          document.body.append(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 15000);
          status.textContent = "Файл сохранён!";
        } catch {
          window.open(pic, "_blank", "noopener,noreferrer");
          status.textContent = "Открыли картинку в новой вкладке для сохранения.";
        }
      });
    });
  }

  window.MinistryAdvent = {
    renderHtml() {
      const openCount = entries.filter((_, i) => isOpen(i + 1)).length;
      const statusText = openCount > 0 ? `Открыто ${openCount} из ${entries.length}` : "Старт 1 декабря";
      const filtersHtml = [
        `<button type="button" class="filter" data-advent-filter="" aria-pressed="${activeFilter === ""}">Все</button>`,
        ...Object.entries(departments).map(([id, d]) =>
          `<button type="button" class="filter" data-advent-filter="${id}" aria-pressed="${activeFilter === id}">${d.symbol} ${esc(d.short)}</button>`
        )
      ].join("");

      return `<section class="card-panel advent-panel" id="advent">
        <div class="advent-banner-wrap">
          <img class="advent-banner-img" src="assets/scenes/advent-banner.webp" alt="Новогодний адвент-шкафчик Министерства" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='assets/scenes/advent-banner.png';}else{this.parentElement.remove();}">
        </div>
        <div class="advent-body">
          <div class="advent-head-ornate">
            <img class="advent-title-img" src="assets/scenes/advent-title.png" alt="Адвент-календарь" onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='assets/scenes/advent-title.webp';}else{this.hidden=true;this.nextElementSibling.hidden=false;}">
            <div class="advent-title-row" hidden>
              <span class="advent-rule" aria-hidden="true"></span>
              <h2>Адвент-календарь</h2>
              <span class="advent-rule" aria-hidden="true"></span>
            </div>
            <span class="advent-status-pill" id="advent-status">${statusText}</span>
            <p class="advent-lead">Каждый день декабря — тёплое письмо, находка или идея для урока</p>
          </div>
          <div class="filters advent-filters" aria-label="Отделы календаря">${filtersHtml}</div>
          <div id="advent-weeks">${renderWeeksHtml()}</div>
        </div>
      </section>`;
    },

    bind() {
      const root = document.querySelector("#advent");
      if (!root) return;

      root.addEventListener("click", e => {
        const fBtn = e.target.closest("[data-advent-filter]");
        if (fBtn) {
          activeFilter = fBtn.dataset.adventFilter;
          root.querySelectorAll("[data-advent-filter]").forEach(b =>
            b.setAttribute("aria-pressed", String(b.dataset.adventFilter === activeFilter))
          );
          const weeksEl = root.querySelector("#advent-weeks");
          if (weeksEl) weeksEl.innerHTML = renderWeeksHtml();
          return;
        }
        const dayBtn = e.target.closest("[data-advent-day]");
        if (dayBtn) openDayModal(Number(dayBtn.dataset.adventDay));
      });
    }
  };
})();
