import LocomotiveScroll from 'locomotive-scroll';

let loco;

window.addEventListener('DOMContentLoaded', () => {
  loco = new LocomotiveScroll({
    el: document.querySelector('#js-scroll'),
    smooth: true,
    getDirection: true
  });

  loco.on('scroll', ({ scroll }) => {
    if (scroll.y > 80) {
      $.qs('.header').classList.add('header--primary');
    } else {
      $.qs('.header').classList.remove('header--primary');
    }
  });
});

window.addEventListener('load', () => {
  if (loco) loco.update();
});

// $.delegate('.js-goto', (e, el) => {
//   loco.scrollTo(el.dataset.target, 0);
// });
