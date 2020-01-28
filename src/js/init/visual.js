import Hammer from 'hammerjs';

window.addEventListener('DOMContentLoaded', () => {
  const visual = $.qs('.visual-img');
  if (!visual) return false;

  const visualImg = $.qs('.visual-img img');
  const sliderList = $.qs('.gallery-slider ul');
  let i = 0;

  const showByIndex = index => {
    const slideImg = sliderList.children[index].querySelector('.js-visual');
    const { src, srcMob } = slideImg.dataset;
    visualImg.src = window.innerWidth <= 500 ? srcMob : src;
  };

  const prev = () => {
    i = i === 0 ? sliderList.children.length - 1 : i - 1;
    showByIndex(i);
  };

  const next = () => {
    i = i === sliderList.children.length - 1 ? 0 : i + 1;
    showByIndex(i);
  };

  $.delegate('.js-visual', (e, el) => {
    i = $.nodeIndex(el.closest('li'));

    $.qs('[data-modal-open="visual"]').click();
    showByIndex(i);
  });

  const hammer = new Hammer(visual);

  hammer.on('swipeleft', () => {
    next();
  });
  hammer.on('swiperight', () => {
    prev();
  });
});
