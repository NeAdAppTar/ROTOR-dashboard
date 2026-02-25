const API_BASE = "https://rotorbus.ru/api";
const COMPANY = "rotor";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return null;
}

function getUsername() {
  const cookieUser = getCookie('userLogin');
  if (cookieUser && cookieUser !== 'undefined') return cookieUser;

  const localUser = localStorage.getItem('username');
  if (localUser) return localUser;

  return 'НЛО';
}

async function initAdequacyTest() {
  const username = getUsername();
  document.getElementById('playerName').textContent = username;

  const form = document.getElementById('testForm');
  const resultText = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    let score = 0;

    for (const value of formData.values()) {
      score += Number(value);
    }

    resultText.textContent = "Результат отправляется...";

    try {
      // 1️⃣ Получаем текущие стажировки
      const resGet = await fetch(`${API_BASE}/training/${COMPANY}`);
      const dataGet = await resGet.json();

      if (dataGet.status !== "ok" || !Array.isArray(dataGet.trainings)) {
        throw new Error(dataGet.message || "Ошибка получения данных");
      }

      const existing = dataGet.trainings.find(
        t => t.user_name?.trim().toLowerCase() === username?.trim().toLowerCase()
      );

      // 2️⃣ Формируем payload полностью как строки
      const payload = {
        user_name: String(username),
        score_regulation: String(existing?.score_regulation || "0"),
        score_adequacy: String(score),
        completed: "yes"
      };

      // 3️⃣ Отправляем POST (он обновляет запись, если уже есть)
      const resPost = await fetch(`${API_BASE}/training/${COMPANY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const dataPost = await resPost.json();

      if (!resPost.ok || dataPost.status !== "ok") {
        throw new Error(dataPost.message || "Ошибка API");
      }

      resultText.textContent = "Тест успешно сдан.";

      setTimeout(() => {
        window.location.href = "t.html";
      }, 1200);

    } catch (err) {
      console.error(err);
      resultText.textContent = "Ошибка: " + err.message;
    }
  });
}