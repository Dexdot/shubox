$.delegate('.burger', (e, el) => {
  el.classList.toggle('active');
  $.qs('.menu').classList.toggle('active');
  $.qs('body').classList.toggle('menu-active');

  window.scroll[el.classList.contains('active') ? 'stop' : 'start']();
});
