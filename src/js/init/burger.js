$.delegate('.burger', (e, el) => {
  el.classList.toggle('active');
  $.qs('.menu').classList.toggle('active');
  $.qs('body').classList.toggle('menu-active');

  window.scroll[el.classList.contains('active') ? 'stop' : 'start']();
});

if ($.qs('[data-page]').dataset.page !== 'main') {
  $.qs('.header__nav').classList.add('u-hidden');
}
