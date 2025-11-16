const sidebar = document.getElementById("sidebar");

sidebar.addEventListener("click", (e) => {

    if (e.target.closest("a")) return;

    if (e.target.closest(".user-menu-item")) return;

    sidebar.classList.toggle("collapsed");
});


const userPanel = document.getElementById("userPanel");
