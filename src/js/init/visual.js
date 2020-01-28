window.addEventListener('DOMContentLoaded', () => {
  const visualImg = $.qs('.visual-img img');
  if (!visualImg) return false;
  const container = $.qs('.visual .modal__container');

  visualImg.addEventListener('load', () => {
    setTimeout(() => {
      container.style.visibility = 'visible';
    }, 200);
  });

  $.delegate('.js-visual', (e, el) => {
    container.style.visibility = 'hidden';

    $.qs('[data-modal-open="visual"]').click();

    const { src, srcMob } = el.dataset;
    visualImg.src = window.innerWidth <= 500 ? srcMob : src;
  });
});
