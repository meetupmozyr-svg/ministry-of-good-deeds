const encoder = new TextEncoder();

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
  if (!env.BOT_TOKEN) return;
  const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    console.error("Telegram API error:", method, res.status, await res.text());
  }
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
    const displayName = typeof body.displayName === "string" ? body.displayName.trim().slice(0, 40) : "";
    if (!displayName) return json({ error: "Укажите имя" }, 400);

    await ensureUserExists(env, user);
    await env.DB.prepare("UPDATE users SET display_name=?, updated_at=CURRENT_TIMESTAMP WHERE telegram_id=?")
      .bind(displayName, id).run();
    return json({ ok: true, displayName });
  }

  if (request.method === "POST" && url.pathname === "/api/riddle") {
    const body = await parseJsonBody(request);
    if (!body) return json({ error: "Invalid JSON" }, 400);
    const answer = typeof body.answer === "string"
      ? body.answer.trim().toLocaleUpperCase("ru-RU").replaceAll("Ё", "Е")
      : "";
    if (answer !== "СНЕЖИНКА") return json({ ok: false, message: "Попробуй ещё раз." });

    await ensureUserExists(env, user);
    const res = await env.DB.prepare("INSERT OR IGNORE INTO progress (telegram_id, task_id) VALUES (?, 'first-riddle')")
      .bind(id).run();
    const newlySolved = (res.meta?.changes || 0) > 0;
    if (newlySolved) {
      await env.DB.prepare("UPDATE users SET points=points+10, updated_at=CURRENT_TIMESTAMP WHERE telegram_id=?")
        .bind(id).run();
    }
    return json({
      ok: true,
      message: "Верно! Первая загадка разгадана.",
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

async function handleTelegram(request, env) {
  const supplied = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
  if (!env.TELEGRAM_WEBHOOK_SECRET || !supplied || !timingSafeEqualStr(supplied, env.TELEGRAM_WEBHOOK_SECRET)) {
    return new Response("Forbidden", { status: 403 });
  }
  const update = await parseJsonBody(request);
  if (!update) return new Response("Bad Request", { status: 400 });

  const message = update.message;
  if (message?.text?.startsWith("/start")) {
    const appUrl = (env.APP_URL || new URL(request.url).origin).trim();
    await telegramCall(env, "sendMessage", {
      chat_id: message.chat.id,
      text: "Добро пожаловать в Министерство добрых дел! Открой свой пропуск и начни знакомство.",
      reply_markup: { inline_keyboard: [[{ text: "Открыть Министерство", web_app: { url: appUrl } }]] }
    });
  } else if (message?.text?.startsWith("/help")) {
    await telegramCall(env, "sendMessage", {
      chat_id: message.chat.id,
      text: "Нажми кнопку «Открыть Министерство», чтобы перейти в Mini App."
    });
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
