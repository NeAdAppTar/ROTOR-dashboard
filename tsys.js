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

async function initTest(testName) {
  if (testName === "Устав") {
    initRegulationTest();
  } else if (testName === "Адекватность") {
    initAdequacyTest();
  }
}

//     УСТАВ

async function initRegulationTest() {
  const username = getUsername();
  document.getElementById('playerName').textContent = username;

  const form = document.getElementById('testForm');
  const resultText = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    let score = 0;
    for (const value of formData.values()) score += Number(value);

    resultText.textContent = "Результат отправляется...";

    try {
      const resGet = await fetch(`${API_BASE}/training/${COMPANY}`);
      const dataGet = await resGet.json();

      if (dataGet.status !== "ok" || !Array.isArray(dataGet.trainings)) {
        throw new Error(dataGet.message || "Ошибка получения данных");
      }

      const existing = dataGet.trainings.find(
        t => t.user_name?.trim().toLowerCase() === username.toLowerCase()
      );

      const payload = {
        user_name: username,
        score_regulation: score,
        score_adequacy: Number(existing?.score_adequacy ?? 0),
        completed: existing?.completed === "yes" ? 1 : 0
      };

      let apiUrl = `${API_BASE}/training/${COMPANY}`;
      let method = "POST";

      if (existing?.id) {
        apiUrl = `${API_BASE}/training/${COMPANY}/${existing.id}`;
        method = "PUT";
      }

      const resSend = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const dataSend = await resSend.json();
      if (!resSend.ok || dataSend.status !== "ok") {
        throw new Error(dataSend.message || "Ошибка API");
      }

      resultText.textContent = "Тест успешно сдан.";
      setTimeout(() => window.location.href = "t.html", 1200);

    } catch (err) {
      console.error(err);
      resultText.textContent = "Ошибка: " + err.message;
    }
  });
}

//     АДЕКВАТНОСТЬ

async function initAdequacyTest() {
  const username = getUsername();
  document.getElementById('playerName').textContent = username;

  const form = document.getElementById('testForm');
  const resultText = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    let score = 0;
    for (const value of formData.values()) score += Number(value);

    resultText.textContent = "Результат отправляется...";

    try {
      // Получаем текущие стажировки
      const resGet = await fetch(`${API_BASE}/training/${COMPANY}`);
      const dataGet = await resGet.json();

      if (dataGet.status !== "ok" || !Array.isArray(dataGet.trainings)) {
        throw new Error(dataGet.message || "Ошибка получения данных");
      }

      const existing = dataGet.trainings.find(
        t => t.user_name?.trim().toLowerCase() === username.toLowerCase()
      );

      const payload = {
        user_name: username,
        score_regulation: Number(existing?.score_regulation ?? 0),
        score_adequacy: score,
        completed: 1
      };

      let apiUrl = `${API_BASE}/training/${COMPANY}`;
      let method = "POST";

      // Если запись есть → обновляем PUT
      if (existing?.id) {
        apiUrl = `${API_BASE}/training/${COMPANY}/${existing.id}`;
        method = "PUT";
      }

      const resSend = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const dataSend = await resSend.json();
      if (!resSend.ok || dataSend.status !== "ok") {
        throw new Error(dataSend.message || "Ошибка API");
      }

      resultText.textContent = "Тест успешно сдан.";
      setTimeout(() => window.location.href = "t.html", 1200);

    } catch (err) {
      console.error(err);
      resultText.textContent = "Ошибка: " + err.message;
    }
  });
}