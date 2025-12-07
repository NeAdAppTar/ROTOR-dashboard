document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const themeBtn = document.getElementById("themeBtn");
    const userName = document.getElementById("userName");

    const login = localStorage.getItem("userLogin") || "user";
    userName.textContent = login;

    // Тема
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === "dark") document.body.classList.add("dark");

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    // ---- COOKIE FUNCTIONS ----
    function setCookie(name, value, days = 30) {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }

    function getCookie(name) {
        return document.cookie
            .split("; ")
            .find(row => row.startsWith(name + "="))
            ?.split("=")[1];
    }

    // ---- SNOW BLOCK ----
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

    const snowState = getCookie("snow");
    if (snowState === "1") {
        document.body.classList.add("ny-mode");
        startSnow();
    }

    document.getElementById("nyBtn").addEventListener("click", () => {
        document.body.classList.toggle("ny-mode");

        if (document.body.classList.contains("ny-mode")) {
            startSnow();
            setCookie("snow", "1");
        } else {
            stopSnow();
            setCookie("snow", "0");
        }
    });

    // ---- LOGOUT ----
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("userLogin");
        document.cookie = "userLogin=; path=/; domain=.rotorbus.ru; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "https://auth.rotorbus.ru/";
    });
});
