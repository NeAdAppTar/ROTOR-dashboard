document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const themeBtn = document.getElementById("themeBtn");
    const nyBtn = document.getElementById("nyBtn");
    const userName = document.getElementById("userName");

    const login = localStorage.getItem("userLogin") || "user";
    userName.textContent = login;

    // ===== Т Е М А =====
    const savedTheme = getCookie("theme") || localStorage.getItem("theme") || "light";

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");

        // сохраняем в localStorage
        localStorage.setItem("theme", isDark ? "dark" : "light");
        // сохраняем в cookies
        setCookie("theme", isDark ? "dark" : "light");
    });

    // ===== Н О В О Г О Д Н И Й   Р Е Ж И М =====
    const savedNy = getCookie("nyMode") || "off";

    if (savedNy === "on") {
        document.body.classList.add("ny-mode");
        startSnow();
    }

    nyBtn.addEventListener("click", () => {
        document.body.classList.toggle("ny-mode");
        const isNy = document.body.classList.contains("ny-mode");

        if (isNy) {
            startSnow();
            setCookie("nyMode", "on");
        } else {
            stopSnow();
            setCookie("nyMode", "off");
        }
    });

    // ===== С Н Е Г =====
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

    // ===== В Ы Х О Д =====
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("userLogin");
        document.cookie = "userLogin=; path=/; domain=.rotorbus.ru; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "https://auth.rotorbus.ru/";
    });
});
