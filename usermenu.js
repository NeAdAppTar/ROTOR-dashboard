document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const themeBtn = document.getElementById("themeBtn");
    const userName = document.getElementById("userName");

    const login = localStorage.getItem("userLogin") || "user";
    userName.textContent = login;

    // тема
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === "dark") document.body.classList.add("dark");

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });

    document.getElementById("nyBtn").addEventListener("click", () => {
    document.body.classList.toggle("ny-mode");

    if (document.body.classList.contains("ny-mode")) {
        startSnow();
    } else {
        stopSnow();
    }
});

    // снежок
    document.getElementById("nyBtn").addEventListener("click", () => {
    const enabled = document.body.classList.toggle("ny-mode");

    if (enabled) {
        startSnow();
        setCookie("nyMode", "on");
    } else {
        stopSnow();
        setCookie("nyMode", "off");
    }
});

    let snowInterval;

    function isLightTheme() {
        return !document.body.classList.contains('dark-mode');
    }

    function startSnow() {
        snowInterval = setInterval(() => {
            const snow = document.createElement("div");
            const light = isLightTheme();

            snow.classList.add("snowflake");
            if (light) snow.classList.add("light-snowflake");

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

    document.addEventListener("DOMContentLoaded", () => {
    const mode = getCookie("nyMode");

    if (mode === "on") {
        document.body.classList.add("ny-mode");
        startSnow();
    }
});



    // выход
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("userLogin");
        document.cookie = "userLogin=; path=/; domain=.rotorbus.ru; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "https://auth.rotorbus.ru/";
    });
});
