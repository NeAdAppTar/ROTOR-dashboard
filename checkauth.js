(function () {
  // Если переменная не объявлена — доступ запрещён
  const allowedPosts = (typeof pageAccess !== "undefined") ? pageAccess : [];

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  async function getUserInfo(username) {
    try {
      const response = await fetch(
        "https://transdigital.pythonanywhere.com/api/get_user_info/rotor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: username })
        }
      );
      return await response.json();
    } catch (err) {
      console.error("Ошибка API:", err);
      return null;
    }
  }

  async function check() {
    const user = getCookie("userLogin");

    // Нет логина → на страницу входа
    if (!user) {
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://auth.rotorbus.ru/?redirect=${redirectUrl}`;
      return;
    }

    // Доступ открыт для всех
    if (allowedPosts === null) return;

    // Получить должность
    const info = await getUserInfo(user);

    if (!info || info.status !== "ok") {
      window.location.href = "https://auth.rotorbus.ru/no-access.html";
      return;
    }

    const post = info.post?.trim() || "";

    // Если должность не в списке allowed → запрет
    if (!allowedPosts.includes(post)) {
      window.location.href = "https://auth.rotorbus.ru/no-access.html";
      return;
    }

    // Ок — сохраняем
    localStorage.setItem("userPost", post);
    localStorage.setItem("userLogin", user);
  }

  check();
})();
