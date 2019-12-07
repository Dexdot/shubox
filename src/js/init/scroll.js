import LocomotiveScroll from 'locomotive-scroll';

const loco = new LocomotiveScroll({
  el: document.querySelector('#js-scroll'),
  smooth: true,
  getDirection: true
});

loco.on('scroll', ({ scroll }) => {
  if (scroll.y > window.innerHeight / 2) {
    $.qs('.header').classList.add('header--primary');
  } else {
    $.qs('.header').classList.remove('header--primary');
  }
});

// $.delegate('.js-goto', (e, el) => {
//   loco.scrollTo(el.dataset.target, 0);
// });
