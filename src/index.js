const encoder = new TextEncoder();

const ALLOWED_RANKS = new Set([
  "Новичок",
  "Хранитель тепла",
  "Архивариус чудес",
  "Мастер тёплых писем",
  "Маяк поддержки"
]);

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  }
});

function timingSafeEqualStr(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ba = encoder.encode(a);
  const bb = encoder.encode(b);
  if (ba.length !== bb.length) return false;
  return crypto.subtle.timingSafeEqual(ba, bb);
}

async function parseJsonBody(request) {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch {
    return null;
  }
}

function parseInitData(raw) {
  return Object.fromEntries(new URLSearchParams(raw));
}

async function validateTelegramInitData(initData, botToken) {
  if (!initData || !botToken) return null;
  const params = parseInitData(initData);
  const receivedHash = params.hash;
  if (!receivedHash) return null;
  delete params.hash;

  const checkString = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join("\n");
  const secretKey = await crypto.subtle.importKey(
    "raw", encoder.encode("WebAppData"), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const botKey = await crypto.subtle.sign("HMAC", secretKey, encoder.encode(botToken));
  const key = await crypto.subtle.importKey(
    "raw", botKey, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const digest = await crypto.subtle.sign("HMAC", key, encoder.encode(checkString));
  const hex = [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");

  if (!timingSafeEqualStr(hex, String(receivedHash).toLowerCase())) return null;

  let user;
  try { user = JSON.parse(params.user || "null"); } catch { return null; }
  if (!user?.id) return null;

  const authDate = Number(params.auth_date || 0);
  if (!Number.isFinite(authDate) || authDate <= 0 || (Date.now() / 1000 - authDate) > 86400) {
    return null;
  }
  return user;
}

async function telegramCall(env, method, payload) {
  if (!env.BOT_TOKEN) return false;
  const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    console.error("Telegram API error:", method, res.status, await res.text());
    return false;
  }
  return true;
}

async function editBotCard(env, cq, text, replyMarkup) {
  const chatId = cq.message?.chat?.id;
  const messageId = cq.message?.message_id;
  if (!chatId || !messageId) return false;

  if (cq.message?.photo) {
    return telegramCall(env, "editMessageCaption", {
      chat_id: chatId,
      message_id: messageId,
      caption: text,
      parse_mode: "HTML",
      reply_markup: replyMarkup
    });
  }
  return telegramCall(env, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    reply_markup: replyMarkup
  });
}

async function ensureUser(env, user) {
  await env.DB.prepare(`
    INSERT INTO users (telegram_id, first_name, username, display_name)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(telegram_id) DO UPDATE SET
      first_name=excluded.first_name,
      username=excluded.username,
      updated_at=CURRENT_TIMESTAMP
  `).bind(String(user.id), user.first_name || "", user.username || "", user.first_name || "Гость").run();
}

async function ensureUserExists(env, user) {
  const exists = await env.DB.prepare("SELECT 1 FROM users WHERE telegram_id = ?")
    .bind(String(user.id))
    .first();
  if (!exists) await ensureUser(env, user);
}

function validMaterialId(value) {
  if (typeof value !== "string") return "";
  const id = value.trim();
  return /^[a-z0-9_-]{1,80}$/i.test(id) ? id : "";
}

async function solveFirstRiddle(env, user) {
  await ensureUserExists(env, user);
  const id = String(user.id);
  const res = await env.DB.prepare("INSERT OR IGNORE INTO progress (telegram_id, task_id) VALUES (?, 'first-riddle')")
    .bind(id).run();
  const newlySolved = (res.meta?.changes || 0) > 0;
  if (newlySolved) {
    await env.DB.prepare("UPDATE users SET points=points+10, updated_at=CURRENT_TIMESTAMP WHERE telegram_id=?")
      .bind(id).run();
  }
  return newlySolved;
}

async function api(request, env) {
  const user = await validateTelegramInitData(request.headers.get("X-Telegram-Init-Data"), env.BOT_TOKEN);
  if (!user) return json({ error: "Telegram authorization required" }, 401);

  const id = String(user.id);
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/api/me") {
    await ensureUser(env, user);
    const row = await env.DB.prepare("SELECT * FROM users WHERE telegram_id = ?").bind(id).first();
    const tasks = await env.DB.prepare("SELECT task_id FROM progress WHERE telegram_id = ?").bind(id).all();
    const saved = await env.DB.prepare("SELECT material_id FROM saved_materials WHERE telegram_id = ?").bind(id).all();
    return json({
      profile: row,
      completed: tasks.results.map(x => x.task_id),
      saved: saved.results.map(x => x.material_id)
    });
  }

  if (request.method === "POST" && url.pathname === "/api/profile") {
    const body = await parseJsonBody(request);
    if (!body) return json({ error: "Invalid JSON" }, 400);

    const hasName = typeof body.displayName === "string";
    const hasRank = typeof body.rank === "string";
    if (!hasName && !hasRank) return json({ error: "Nothing to update" }, 400);

    const displayName = hasName ? body.displayName.trim().slice(0, 40) : null;
    if (hasName && !displayName) return json({ error: "Укажите имя" }, 400);

    const rank = hasRank ? body.rank.trim() : null;
    if (hasRank && !ALLOWED_RANKS.has(rank)) return json({ error: "Invalid rank" }, 400);

    await ensureUserExists(env, user);
    if (hasName && hasRank) {
      await env.DB.prepare("UPDATE users SET display_name=?, rank=?, updated_at=CURRENT_TIMESTAMP WHERE telegram_id=?")
        .bind(displayName, rank, id).run();
    } else if (hasName) {
      await env.DB.prepare("UPDATE users SET display_name=?, updated_at=CURRENT_TIMESTAMP WHERE telegram_id=?")
        .bind(displayName, id).run();
    } else {
      await env.DB.prepare("UPDATE users SET rank=?, updated_at=CURRENT_TIMESTAMP WHERE telegram_id=?")
        .bind(rank, id).run();
    }
    return json({ ok: true, displayName, rank });
  }

  if (request.method === "POST" && url.pathname === "/api/riddle") {
    const body = await parseJsonBody(request);
    if (!body) return json({ error: "Invalid JSON" }, 400);
    const choice = typeof body.choice === "string" ? body.choice.trim().toLowerCase() : "";
    const answer = typeof body.answer === "string"
      ? body.answer.trim().toLocaleUpperCase("ru-RU").replaceAll("Ё", "Е")
      : "";

    const isCorrect = choice === "kindness" || answer === "ДОБРОЕ СЛОВО" || answer === "СНЕЖИНКА";
    if (!isCorrect) {
      return json({ ok: false, message: "Почти! Этот ключ умножается, когда им делятся на уроке." });
    }
    const newlySolved = await solveFirstRiddle(env, user);
    return json({
      ok: true,
      message: "Дверь открыта! Ключ принят — добро пожаловать в Министерство.",
      pointsAwarded: newlySolved ? 10 : 0
    });
  }

  if (request.method === "POST" && url.pathname === "/api/save") {
    const body = await parseJsonBody(request);
    if (!body) return json({ error: "Invalid JSON" }, 400);
    const materialId = validMaterialId(body.materialId);
    if (!materialId) return json({ error: "Invalid materialId" }, 400);

    await ensureUserExists(env, user);
    await env.DB.prepare("INSERT OR IGNORE INTO saved_materials (telegram_id, material_id) VALUES (?, ?)")
      .bind(id, materialId).run();
    return json({ ok: true });
  }

  if (request.method === "DELETE" && url.pathname === "/api/save") {
    let rawId = url.searchParams.get("materialId");
    if (!rawId) {
      const body = await parseJsonBody(request);
      rawId = body?.materialId;
    }
    const materialId = validMaterialId(rawId);
    if (!materialId) return json({ error: "Invalid materialId" }, 400);

    await env.DB.prepare("DELETE FROM saved_materials WHERE telegram_id = ? AND material_id = ?")
      .bind(id, materialId).run();
    return json({ ok: true });
  }

  return json({ error: "Not found" }, 404);
}

const RIDDLE_TEXT =
  "🗝 <b>Ключ от дверей Министерства</b>\n\n" +
  "<i>Оно не боится ни вьюги, ни расстояний,\n" +
  "приходит без почты на зимний урок,\n" +
  "не прячется в ящик и в яркую бумагу —\n" +
  "но дарит крылья и тёплый огонёк.\n" +
  "Чем щедрее им делятся, тем больше его становится.</i>\n\n" +
  "Что открывает наши двери?";

function riddleKeyboard(appUrl) {
  return {
    inline_keyboard: [
      [{ text: "❄ Снежинка на варежке", callback_data: "riddle:ans:snow" }],
      [{ text: "✨ Доброе слово и участие", callback_data: "riddle:ans:kindness" }],
      [{ text: "📦 Подарок под ёлкой", callback_data: "riddle:ans:gift" }],
      [{ text: "🕰 Бой курантов", callback_data: "riddle:ans:chimes" }],
      [{ text: "Пропустить загадку →", callback_data: "riddle:skip" }]
    ]
  };
}

async function handleTelegram(request, env) {
  const supplied = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
  if (!env.TELEGRAM_WEBHOOK_SECRET || !supplied || !timingSafeEqualStr(supplied, env.TELEGRAM_WEBHOOK_SECRET)) {
    return new Response("Forbidden", { status: 403 });
  }
  const update = await parseJsonBody(request);
  if (!update) return new Response("Bad Request", { status: 400 });

  const appUrl = (env.APP_URL || new URL(request.url).origin).trim().replace(/\/+$/, "");

  const cq = update.callback_query;
  if (cq) {
    const data = cq.data || "";

    if (data === "riddle:start") {
      await telegramCall(env, "answerCallbackQuery", { callback_query_id: cq.id });
      await editBotCard(env, cq, RIDDLE_TEXT, riddleKeyboard(appUrl));
    } else if (data === "riddle:ans:kindness") {
      await solveFirstRiddle(env, cq.from);
      await telegramCall(env, "answerCallbackQuery", {
        callback_query_id: cq.id,
        text: "Ключ подошёл! Дверь открыта ✨"
      });
      await editBotCard(
        env,
        cq,
        "✅ <b>Дверь согрелась и открылась!</b>\n\nДоброе слово действительно не знает расстояний. В вашем пропуске зажглась отметка хранителя — добро пожаловать внутрь.",
        {
          inline_keyboard: [
            [{ text: "🚪 Войти в Министерство", web_app: { url: appUrl } }],
            [{ text: "▣ Посмотреть мой пропуск", web_app: { url: `${appUrl}/#pass` } }]
          ]
        }
      );
    } else if (data === "riddle:skip") {
      await telegramCall(env, "answerCallbackQuery", {
        callback_query_id: cq.id,
        text: "Проходим по тихому пропуску…"
      });
      await editBotCard(
        env,
        cq,
        "🚪 <b>Вход свободен</b>\n\nВы всегда можете вернуться к загадке позже, а все комнаты Министерства уже ждут вас.",
        {
          inline_keyboard: [
            [{ text: "🚪 Войти в Министерство", web_app: { url: appUrl } }],
            [{ text: "🗝 Вернуться к загадке", callback_data: "riddle:start" }]
          ]
        }
      );
    } else if (data === "riddle:ans:snow") {
      await telegramCall(env, "answerCallbackQuery", {
        callback_query_id: cq.id,
        text: "Красиво! Но снежинка растает на ладони, а наш ключ только крепнет."
      });
    } else if (data === "riddle:ans:gift") {
      await telegramCall(env, "answerCallbackQuery", {
        callback_query_id: cq.id,
        text: "Коробку можно открыть однажды, а этот подарок не кончается, когда им делятся!"
      });
    } else if (data === "riddle:ans:chimes") {
      await telegramCall(env, "answerCallbackQuery", {
        callback_query_id: cq.id,
        text: "Куранты бьют в полночь, а наш ключ согревает любой урок круглый год."
      });
    } else {
      await telegramCall(env, "answerCallbackQuery", { callback_query_id: cq.id });
    }
    return new Response("ok");
  }

  const message = update.message;
  if (message?.text?.startsWith("/start") || message?.text?.startsWith("/help")) {
    const caption =
      "✨ <b>Министерство добрых дел</b>\n\n" +
      "Перед вами — тёплые двери нашего зимнего ведомства для преподавателей.\n\n" +
      "Чтобы зажечь фонари в Холле, <b>подберите ключ-загадку</b> — или пропустите её и загляните сразу внутрь.";
    const replyMarkup = {
      inline_keyboard: [
        [{ text: "🗝 Разгадать ключ и войти", callback_data: "riddle:start" }],
        [{ text: "Пропустить → Войти сразу", web_app: { url: appUrl } }]
      ]
    };

    const sentPhoto = await telegramCall(env, "sendPhoto", {
      chat_id: message.chat.id,
      photo: `${appUrl}/hall.jpg`,
      caption,
      parse_mode: "HTML",
      reply_markup: replyMarkup
    });

    if (!sentPhoto) {
      await telegramCall(env, "sendMessage", {
        chat_id: message.chat.id,
        text: caption,
        parse_mode: "HTML",
        reply_markup: replyMarkup
      });
    }
  }

  return new Response("ok");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      try {
        return await api(request, env);
      } catch (e) {
        console.error("API error:", e);
        return json({ error: "Internal error" }, 500);
      }
    }
    if (url.pathname === "/telegram/webhook" && request.method === "POST") {
      try {
        return await handleTelegram(request, env);
      } catch (e) {
        console.error("Webhook error:", e);
        return new Response("Webhook error", { status: 500 });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
