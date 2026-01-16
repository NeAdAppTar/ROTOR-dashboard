function getCookie(name) {
    const match = document.cookie.match(
        new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? decodeURIComponent(match[2]) : null;
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const themeBtn = document.getElementById("themeBtn");
    const userName = document.getElementById("userName");
    const nyBtn = document.getElementById("nyBtn");

    const login = getCookie('userLogin');
    if (userName) {
        userName.textContent = login || '—';
    }

    // ===== ТЕМА =====
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === "dark") {
        document.body.classList.add("dark");
    }

    themeBtn?.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    // ===== COOKIE HELPERS =====
    function setCookie(name, value, days = 30) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie =
            `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; domain=.rotorprov.ru`;
    }

    function deleteCookie(name) {
        document.cookie =
            `${name}=; path=/; domain=.rotorprov.ru; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }

    // ===== SNOW =====
    let snowInterval;

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
        document.querySelectorAll(".snowflake").forEach(s => s.remove());
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

    // ===== LOGOUT =====
    logoutBtn?.addEventListener("click", () => {
        deleteCookie("userLogin");
        deleteCookie("userHash");
        deleteCookie("snow");

        window.location.href = "https://auth.rotorprov.ru/";
    });
});
