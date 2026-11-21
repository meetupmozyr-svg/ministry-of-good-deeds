const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

const user = tg?.initDataUnsafe?.user;
const hello = document.querySelector("#hello");
if (user?.first_name) hello.textContent = `Здравствуйте, ${user.first_name}!`;

const initData = tg?.initData || "";
async function api(path, body) {
  const response = await fetch(path, {
    method: body ? "POST" : "GET",
    headers: { "content-type": "application/json", "X-Telegram-Init-Data": initData },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!response.ok) throw new Error("Не удалось загрузить данные. Откройте приложение через Telegram.");
  return response.json();
}

async function loadProfile() {
  if (!initData) {
    document.querySelector("#feedback").textContent = "Откройте приложение из Telegram, чтобы сохранить прогресс.";
    return;
  }
  try {
    const data = await api("/api/me");
    document.querySelector("#rank").textContent = data.profile.rank || "Новичок";
    document.querySelector("#points").textContent = data.profile.points || 0;
    if (data.completed.includes("first-riddle")) {
      document.querySelector("#feedback").textContent = "Первая загадка уже разгадана. Достижение сохранено.";
    }
  } catch (e) {
    document.querySelector("#feedback").textContent = e.message;
  }
}

document.querySelector("#riddleForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const answer = document.querySelector("#answer").value;
  const feedback = document.querySelector("#feedback");
  if (!initData) {
    feedback.textContent = "Для проверки и сохранения ответа откройте Mini App через Telegram.";
    return;
  }
  try {
    const result = await api("/api/riddle", { answer });
    feedback.textContent = result.message;
    if (result.ok) await loadProfile();
  } catch (e) { feedback.textContent = e.message; }
});

loadProfile();
