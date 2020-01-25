window.addEventListener('DOMContentLoaded', () => {
  const visualImg = $.qs('.visual-img img');
  if (!visualImg) return false;

  visualImg.addEventListener('load', () => {
    visualImg.style.display = 'block';
  });

  $.delegate('.js-visual', (e, el) => {
    visualImg.style.display = 'none';

    $.qs('[data-modal-open="visual"]').click();

    const { src } = el.dataset;
    visualImg.src = src;
  });
});
