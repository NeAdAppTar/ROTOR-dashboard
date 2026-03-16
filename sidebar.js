// cookie
function getCookie(name) {
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; domain=.rotorprov.ru`;
}

function deleteCookie(name) {
  document.cookie =
    `${name}=; path=/; domain=.rotorprov.ru; max-age=0; samesite=None; secure`;
}


// load sidebar
async function loadSidebar() {

  const container = document.getElementById("sidebar-container");
  if (!container) return;

  const res = await fetch("sidebar.html");
  const html = await res.text();

  container.innerHTML = html;

  initSidebar();
  initUserMenu();
}


// sidebar logic
function initSidebar() {

  const sidebar = document.getElementById("sidebar");

  sidebar?.addEventListener("click", (e) => {

    if (e.target.closest("a")) return;
    if (e.target.closest(".user-menu-item")) return;

    sidebar.classList.toggle("collapsed");

  });

  const links = document.querySelectorAll(".sidebar-menu a");
  const current = window.location.pathname.split("/").pop();

  links.forEach(link => {

    const href = link.getAttribute("href");

    if (href === current) {
      link.classList.add("active");
    }

  });

}


// usermenu (lower)
function initUserMenu() {

  const logoutBtn = document.getElementById("logoutBtn");
  const themeBtn = document.getElementById("themeBtn");
  const userName = document.getElementById("userName");
  const nyBtn = document.getElementById("nyBtn");

  const login = getCookie("userLogin");

  if (userName) {
    userName.textContent = login || "—";
  }


// theme

  const currentTheme = localStorage.getItem("theme") || "light";

  if (currentTheme === "dark") {
    document.body.classList.add("dark");
  }

  themeBtn?.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");

  });


 // snow

/*  let snowInterval;

  function startSnow() {

    snowInterval = setInterval(() => {

      const snow = document.createElement("div");

      snow.classList.add("snowflake");
      snow.textContent = "❄";
      snow.style.left = Math.random() * window.innerWidth + "px";
      snow.style.fontSize = (Math.random() * 8 + 8) + "px";

      document.body.appendChild(snow);

      setTimeout(() => snow.remove(), 10000);

    }, 200);

  }

  function stopSnow() {

    clearInterval(snowInterval);

    document.querySelectorAll(".snowflake")
      .forEach(s => s.remove());

  }

  if (getCookie("snow") === "1") {

    document.body.classList.add("ny-mode");
    startSnow();

  }

  nyBtn?.addEventListener("click", () => {

    document.body.classList.toggle("ny-mode");

    if (document.body.classList.contains("ny-mode")) {

      startSnow();
      setCookie("snow", "1");

    } else {

      stopSnow();
      setCookie("snow", "0");

    }

  });
*/

// logout

  logoutBtn?.addEventListener("click", () => {

    deleteCookie("userLogin");
    deleteCookie("userPass");
    deleteCookie("snow");

    localStorage.removeItem("userLogin");
    localStorage.removeItem("userPost");

    window.location.href = "https://auth.rotorprov.ru/";

  });

}


// start
document.addEventListener("DOMContentLoaded", loadSidebar);