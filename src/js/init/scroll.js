import LocomotiveScroll from 'locomotive-scroll';
import { TweenMax, Power2 } from 'gsap';

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
      scrollbar.show();
      loco.start();
    },
    stop: () => {
      scrollbar.hide();
      loco.stop();
    },
    to: (selector, offset = 0, onComplete) => {
      window.scroll.stop();

      const y = $.qs(selector).offsetTop + offset;

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
  };
});

window.addEventListener('load', () => {
  if (loco) loco.update();
});
