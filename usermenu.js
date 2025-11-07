document.addEventListener('DOMContentLoaded', () => {
  const userName = document.getElementById('userName');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const logoutBtn = document.getElementById('logoutBtn');
  const themeBtn = document.getElementById('themeBtn');

  if (!userName || !dropdownMenu || !logoutBtn || !themeBtn) return;

  const login = localStorage.getItem('userLogin') || 'user';
  userName.textContent = login;

  // Проверяем текущую тему
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
    themeBtn.textContent = '☀️ Светлая тема';
  }

  // Переключение темы
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeBtn.textContent = isDark ? '☀️ Светлая тема' : '🌙 Тёмная тема';
  });

  // Меню пользователя
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
