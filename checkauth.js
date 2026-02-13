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

  function setCookieRaw(raw) {
    document.cookie = raw;
  }

  function clearAuthCookies() {
    const base = "path=/; domain=.rotorprov.ru; max-age=0; samesite=None; secure";
    setCookieRaw(`userLogin=; ${base}`);
    setCookieRaw(`userPass=; ${base}`);
  }

  function redirectToAuth() {
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `https://auth.rotorprov.ru/?redirect=${redirectUrl}`;
  }

  async function verifyLogin(name, password) {
    try {
      const response = await fetch("https://rotorbus.ru/api/login/rotor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password })
      });

      if (!response.ok) return false;

      const data = await response.json();
      return data.status === "ok";
    } catch (err) {
      console.error("Ошибка проверки логина:", err);
      return false;
    }
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
      console.error("Ошибка API users:", err);
      return null;
    }
  }

  async function check() {
    let user = getCookie("userLogin");
    let pass = getCookie("userPass");

    if (!user || !pass) { // чтоь куки прогрузились
    await new Promise(r => setTimeout(r, 150));
    user = getCookie("userLogin");
    pass = getCookie("userPass");
  }

    // нет логина/пароля → на авторизацию
    if (!user || !pass) {
      clearAuthCookies();
      redirectToAuth();
      return;
    }

    const ok = await verifyLogin(user, pass);
    if (!ok) {
      clearAuthCookies();
      redirectToAuth();
      return;
    }


    const userData = await getUserByName(user);

    if (!userData) {
      clearAuthCookies();
      window.location.href = "https://auth.rotorprov.ru/no-access.html";
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
      window.location.href = "https://auth.rotorprov.ru/no-access.html";
      return;
    }

    // успех
    localStorage.setItem("userLogin", user);
    localStorage.setItem("userPost", post);
  }

  check();
})();
