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
      // 1️⃣ Проверяем есть ли уже запись
      const resGet = await fetch(`${API_BASE}/training/${COMPANY}`);
      const dataGet = await resGet.json();

      let existing = null;

      if (dataGet.status === "ok" && Array.isArray(dataGet.trainings)) {
        existing = dataGet.trainings.find(t => t.user_name === username);
      }

      if (existing) {
        // 2️⃣ Удаляем старую запись
        await fetch(`${API_BASE}/training/${COMPANY}/${existing.id}`, {
          method: "DELETE"
        });
      }

      // 3️⃣ Создаём новую запись с обновлённым score_adequacy
      const payload = {
        user_name: username,
        score_regulation: existing ? existing.score_regulation : "0",
        score_adequacy: score.toString(),
        completed: "yes"
      };

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
      resultText.textContent = "Ошибка: " + err.message;
    }
  });
}