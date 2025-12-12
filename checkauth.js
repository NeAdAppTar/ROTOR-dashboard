(function () {
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

  async function getUserBase(username) {
    try {
      const response = await fetch(
        "https://transdigital.pythonanywhere.com/api/get_user/rotor",
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

  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  async function check() {
    const user = getCookie("userLogin");
    const storedHash = getCookie("userHash");

    if (!user || !storedHash) {
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://auth.rotorbus.ru/?redirect=${redirectUrl}`;
      return;
    }

    // Проверка пароля
    const base = await getUserBase(user);
    if (!base || base.status !== "ok") {
      window.location.href = "https://auth.rotorbus.ru/no-access.html";
      return;
    }

    const passHash = await sha256(base.password);

    if (storedHash !== passHash) {
      // Хэш не совпадает — значит cookie подделали
      window.location.href = "https://auth.rotorbus.ru/";
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

    localStorage.setItem("userPost", post);
    localStorage.setItem("userLogin", user);
  }

  check();
})();
