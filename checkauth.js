(function () {
  const COMPANY = "rotor";
  const allowedPosts = (typeof pageAccess !== "undefined") ? pageAccess : null;

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  async function getUsers() {
    try {
      const res = await fetch(`https://rotorbus.ru/api/users/${COMPANY}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error("API error:", e);
      return null;
    }
  }

  async function checkAccess() {
    const username = getCookie("userLogin");

    if (!username) {
      const redirect = encodeURIComponent(location.href);
      location.href = `https://auth.rotorprov.ru/?redirect=${redirect}`;
      return;
    }

    const data = await getUsers();

    if (!data || data.status !== "ok") {
      location.href = "https://auth.rotorprov.ru/no-access.html";
      return;
    }

    const user = data.users.find(u => u.name === username);

    if (!user) {
      location.href = "https://auth.rotorprov.ru/no-access.html";
      return;
    }

    const post = user.post?.trim() || "";

    // если страница не ограничивает роли — пускаем
    if (allowedPosts && !allowedPosts.includes(post)) {
      location.href = "https://auth.rotorprov.ru/no-access.html";
      return;
    }

    localStorage.setItem("userLogin", user.name);
    localStorage.setItem("userPost", post);
  }

  checkAccess();
})();
