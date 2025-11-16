const sidebar = document.getElementById("sidebar");

sidebar.addEventListener("click", (e) => {

    if (e.target.closest("a")) return;

    if (e.target.closest(".user-menu-item")) return;

    sidebar.classList.toggle("collapsed");
});


const userPanel = document.getElementById("userPanel");

const links = document.querySelectorAll(".sidebar-menu a");
const current = window.location.pathname.split("/").pop();

links.forEach(link => {
    const href = link.getAttribute("href");
    if (href === current) {
        link.classList.add("active");
    }
});
