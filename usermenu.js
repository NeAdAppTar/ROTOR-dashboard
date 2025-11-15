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

    // выход
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("userLogin");
        document.cookie = "userLogin=; path=/; domain=.rotorbus.ru; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "https://auth.rotorbus.ru/";
    });
});
