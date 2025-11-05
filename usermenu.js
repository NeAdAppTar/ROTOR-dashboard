document.addEventListener('DOMContentLoaded', () => {
  const userName = document.getElementById('userName');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const logoutBtn = document.getElementById('logoutBtn');

  if (!userName || !dropdownMenu || !logoutBtn) return;


  const login = localStorage.getItem('userLogin') || 'user';
  userName.textContent = login;

  userName.addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
      dropdownMenu.style.display = 'none';
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('userLogin');
    document.cookie = "userLogin=; path=/; domain=.rotorbus.ru; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "https://auth.rotorbus.ru/";
  });
});
