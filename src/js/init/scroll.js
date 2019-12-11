import LocomotiveScroll from 'locomotive-scroll';
import { TweenMax, Power2 } from 'gsap';
// import defaultScroll from '@/helpers/stop-scroll';

let loco;

const scrollbar = {
  show: () => {
    if (loco.scroll.scrollbar)
      loco.scroll.scrollbar.classList.remove('u-hidden');
  },
  hide: () => {
    if (loco.scroll.scrollbar) loco.scroll.scrollbar.classList.add('u-hidden');
  }
};

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

  window.scroll = {
    start: () => {
      // if (loco.isMobile && !loco.smoothMobile) {
      //   defaultScroll.enable();
      // } else {
      //   scrollbar.show();
      //   loco.start();
      // }
      window.addEventListener('keydown', loco.scroll.checkKey, false);
      scrollbar.show();
      loco.start();
    },
    stop: () => {
      // if (loco.isMobile && !loco.smoothMobile) {
      //   defaultScroll.disable();
      // } else {
      //   scrollbar.hide();
      //   loco.stop();
      // }
      window.removeEventListener('keydown', loco.scroll.checkKey, false);
      scrollbar.hide();
      loco.stop();
    },
    to: (selector, offset = 0, onComplete) => {
      window.scroll.stop();

      const y = $.qs(selector).offsetTop + offset;

      if (loco.isMobile && !loco.smoothMobile) {
        loco.scrollTo(selector, 0);
        window.scroll.start();

        if (onComplete) onComplete();
      } else {
        TweenMax.fromTo(
          '#js-scroll',
          0.6,
          {
            y: -loco.scroll.instance.scroll.y
          },
          {
            y: -y,
            ease: Power2.easeInOut,
            onComplete: () => {
              loco.scroll.instance.scroll.y = y;
              loco.scrollTo(selector, 0);
              window.scroll.start();

              if (onComplete) onComplete();
            }
          }
        );
      }
    }
  };
});

$.delegate('.js-scrollto', (e, el) => {
  e.preventDefault();
  const { dataset } = el;

  // WARNING: Сильная завязка к конкретному элементу .zoomer
  if (dataset.target !== '.zoomer')
    window.scroll.to(
      dataset.target,
      window.innerWidth <= 1000 ? -80 : 0,
      () => {
        $.qs('.zoomer').dispatchEvent(new Event('scrollto:complete'));
      }
    );

  if ($.qs('.menu').classList.contains('active')) {
    $.qs('.burger').click();
  }
});

window.addEventListener('load', () => {
  if (loco) loco.update();
});
