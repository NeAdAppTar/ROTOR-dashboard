(function () {
  // роли, разрешённые для страницы
  const allowedPosts =
    (typeof pageAccess !== "undefined") ? pageAccess : null;

  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  }

  async function getUserByName(username) {
    try {
      const response = await fetch(
        "https://rotorbus.ru/api/users/rotor",
        { method: "GET" }
      );

      if (!response.ok) return null;

      const data = await response.json();
      if (data.status !== "ok") return null;

      return data.users.find(u => u.name === username) || null;
    } catch (err) {
      console.error("Ошибка API:", err);
      return null;
    }
  }

  async function check() {
    const user = getCookie("userLogin");

    // ❌ нет логина → на авторизацию
    if (!user) {
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href =
        `https://auth.rotorprov.ru/?redirect=${redirectUrl}`;
      return;
    }

    // получаем пользователя
    const userData = await getUserByName(user);

    if (!userData) {
      window.location.href =
        "https://auth.rotorprov.ru/no-access.html";
      return;
    }

    // если доступ открыт всем
    if (allowedPosts === null) {
      localStorage.setItem("userLogin", user);
      localStorage.setItem("userPost", userData.post || "");
      return;
    }

    const post = (userData.post || "").trim();

    if (!allowedPosts.includes(post)) {
      window.location.href =
        "https://auth.rotorprov.ru/no-access.html";
      return;
    }

    // успех
    localStorage.setItem("userLogin", user);
    localStorage.setItem("userPost", post);
  }

  check();
})();
