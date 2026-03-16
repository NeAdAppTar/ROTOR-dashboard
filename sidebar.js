async function loadSidebar() {

  const container = document.getElementById("sidebar-container");

  const res = await fetch("sidebar.html");
  const html = await res.text();

  container.innerHTML = html;

  initSidebar(); 
}


function initSidebar() {

  const sidebar = document.getElementById("sidebar");

  sidebar.addEventListener("click", (e) => {

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


document.addEventListener("DOMContentLoaded", loadSidebar);