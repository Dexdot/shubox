window.addEventListener('DOMContentLoaded', () => {
  const visualImg = $.qs('.visual-img img');
  if (!visualImg) return false;

  visualImg.addEventListener('load', () => {
    setTimeout(() => {
      visualImg.style.opacity = 1;
    }, 200);
  });

  $.delegate('.js-visual', (e, el) => {
    visualImg.style.opacity = 0;

    $.qs('[data-modal-open="visual"]').click();

    const { src } = el.dataset;
    visualImg.src = src;
  });
});
