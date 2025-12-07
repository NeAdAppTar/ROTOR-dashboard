(function () {
  const allowedPosts = typeof pageAccess !== "undefined" ? pageAccess : null;

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  async function fetchUserInfo(name) {
    try {
      const response = await fetch(
        "https://transdigital.pythonanywhere.com/api/get_user_info/rotor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name })
        }
      );

      return await response.json();
    } catch (error) {
      console.error("Ошибка API:", error);
      return null;
    }
  }

  async function checkAccess() {
    const username = getCookie("userLogin");

    // 1. Пользователь не вошёл
    if (!username) {
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://auth.rotorbus.ru/?redirect=${redirectUrl}`;
      return;
    }

    // 2. Если доступ свободный — пропускаем
    if (!allowedPosts) {
      return;
    }

    // 3. Получаем расширенную инфу о пользователе
    const info = await fetchUserInfo(username);

    if (!info || info.status !== "ok") {
      window.location.href = "https://auth.rotorbus.ru/no-access.html";
      return;
    }

    const userPost = info.post?.trim() || "";

    // 4. Проверяем должность
    if (!allowedPosts.includes(userPost)) {
      window.location.href = "https://auth.rotorbus.ru/no-access.html";
      return;
    }

    // 5. Всё ок
    localStorage.setItem("userLogin", username);
    localStorage.setItem("userPost", userPost);
  }

  checkAccess();
})();
