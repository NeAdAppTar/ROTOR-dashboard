(function () {
  const allowedPosts = (typeof pageAccess !== "undefined") ? pageAccess : [];

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function getUserByName(username) {
    try {
      const response = await fetch(
        "https://rotorbus.ru/api/users/rotor"
      );
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
    const storedHash = getCookie("userHash");

    if (!user || !storedHash) {
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://auth.rotorprov.ru/?redirect=${redirectUrl}`;
      return;
    }

    // 🔐 Проверка пользователя
    const userData = await getUserByName(user);

    if (!userData) {
      window.location.href = "https://auth.rotorprov.ru/no-access.html";
      return;
    }

    // Проверка подлинности cookie
    const passHash = await sha256(userData.password || "");

    if (storedHash !== passHash) {
      // Cookie подделаны
      window.location.href = "https://auth.rotorprov.ru/";
      return;
    }

    // Если доступ открыт для всех
    if (allowedPosts === null) return;

    const post = (userData.post || "").trim();

    if (!allowedPosts.includes(post)) {
      window.location.href = "https://auth.rotorprov.ru/no-access.html";
      return;
    }

    localStorage.setItem("userPost", post);
    localStorage.setItem("userLogin", user);
  }

  check();
})();
