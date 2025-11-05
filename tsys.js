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



function initTest(testType) {
  const username = getUsername();
  document.getElementById('playerName').textContent = `${username}`;

  const form = document.getElementById('testForm');
  const resultText = document.getElementById('result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    let score = 0;
    for (const value of formData.values()) {
      score += Number(value);
    }

    resultText.textContent = `Результат отправляется...`;

  const payload = {
    name: `${username} (${testType})`, 
    score: score.toString()
  };


  
    try {
      const res = await fetch('https://rotor.pythonanywhere.com/add-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.status === 'ok') {
        resultText.textContent = `Спросите результат у руководства`;
        setTimeout(() => {
        window.location.href = 't.html';
      }, 1000);

      } else {
        resultText.textContent = `Ошибка: ${data.message || 'Не удалось отправить результат'}`;
      }
    } catch (err) {
      resultText.textContent = 'Ошибка соединения с сервером.';
    }
  });

  
}
