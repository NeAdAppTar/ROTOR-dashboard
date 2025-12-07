(function () {
  const allowedPosts = (typeof pageAccess !== "undefined") ? pageAccess : [];

  function getCookie(name) {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1];
  }

  const login =
    getCookie("userLogin") ||
    localStorage.getItem("username") ||
    "user";

  userName.textContent = decodeURIComponent(login);


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

    if (!user) {
      const redirectUrl = encodeURIComponent(window.location.href);
      window.location.href = `https://auth.rotorbus.ru/?redirect=${redirectUrl}`;
      return;
    }

    if (allowedPosts === null) return;

    const info = await getUserInfo(user);

    if (!info || info.status !== "ok") {
      window.location.href = "https://auth.rotorbus.ru/no-access.html";
      return;
    }

    const post = info.post?.trim() || "";

    if (!allowedPosts.includes(post)) {
      window.location.href = "https://auth.rotorbus.ru/no-access.html";
      return;
    }

    // --- ВНОВЬ ИСПРАВЛЕННЫЕ СТРОКИ ---
    localStorage.setItem("userPost", post);

    // Перезаписываем только если пусто или отличается
    if (localStorage.getItem("username") !== user) {
      localStorage.setItem("username", user);
    }
  }

  check();
})();
