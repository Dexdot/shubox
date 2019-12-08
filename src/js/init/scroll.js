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

  window.loco = loco;
  const { scrollbar } = loco.scroll;

  window.scroll = {
    start: () => {
      if (scrollbar) scrollbar.classList.add('u-hidden');
      loco.start();
    },
    stop: () => {
      if (scrollbar) scrollbar.classList.remove('u-hidden');
      loco.stop();
    }
  };
});

window.addEventListener('load', () => {
  if (loco) loco.update();
});

// $.delegate('.js-goto', (e, el) => {
//   loco.scrollTo(el.dataset.target, 0);
// });
