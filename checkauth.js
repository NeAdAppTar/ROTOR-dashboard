(function () {
  // ⚠️ Если pageAccess НЕ объявлен на странице — значит доступ СТРОГО ЗАПРЕЩЁН
  // Чтобы страница была доступна всем, нужно явно прописать pageAccess = null;
  const allowedPosts = typeof pageAccess !== "undefined" ? pageAccess : [];

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  async function getUserInfo(name) {
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
    } catch (e) {
      console.error("Ошибка API:", e);
      return null;
    }
  }

  async function protectPage() {
    const user = getCookie("userLogin");

    // 1. Если не авторизован → на страницу входа
    if (!user) {
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://auth.rotorbus.ru/?redirect=${redirectUrl}`;
      return;
    }

    // 2. Если страница доступна для всех (pageAccess = null)
    if (allowedPosts === null) {
      return; 
    }

    // 3. Получить данные пользователя из БД
    const info = await getUserInfo(user);

    if (!info || info.status !== "ok") {
      window.location.href = "https://auth.rotorbus.ru/no-access.html";
      return;
    }

    const userPost = info.post?.trim() || "";

    // 4. Проверка должности
    if (!allowedPosts.includes(userPost)) {
      window.location.href = "https://auth.rotorbus.ru/no-access.html";
      return;
    }

    // 5. Всё ок — сохраняем инфу
    localStorage.setItem("userLogin", user);
    localStorage.setItem("userPost", userPost);
  }

  protectPage();
})();
