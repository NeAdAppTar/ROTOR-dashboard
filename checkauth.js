(function() {
  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  const user = getCookie('userLogin');

  if (!user) {
    const redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `https://auth.rotorbus.ru/?redirect=${redirectUrl}`;
  } else {
    localStorage.setItem('userLogin', user);
  }
})();
