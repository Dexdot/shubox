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

// Header primary state
const headerPrimary = loco => {
  const mainEl = $.qs('[data-page]');
  if (!mainEl) return false;

  const isMain = mainEl.dataset.page === 'main';
  if (!isMain) return false;

  loco.on('scroll', e => {
    if (e.scroll.y > 80) {
      $.qs('.header').classList.add('header--primary');
    } else {
      $.qs('.header').classList.remove('header--primary');
    }
  });
};

window.addEventListener('DOMContentLoaded', () => {
  loco = new LocomotiveScroll({
    el: document.querySelector('#js-scroll'),
    smooth: true,
    getDirection: true
  });

  headerPrimary(loco);

  window.loco = loco;

  window.scroll = {
    start: () => {
      window.addEventListener('keydown', loco.scroll.checkKey, false);
      scrollbar.show();
      loco.start();
    },
    stop: () => {
      window.removeEventListener('keydown', loco.scroll.checkKey, false);
      scrollbar.hide();
      loco.stop();
    },
    to: (selector, offset = 0, onComplete, dontEnable = false) => {
      window.scroll.stop();

      const y = $.qs(selector).offsetTop + offset;

      if (loco.isMobile && !loco.smoothMobile) {
        loco.scrollTo(selector, 0);
        if (!dontEnable) window.scroll.start();

        setTimeout(() => {
          if (onComplete) onComplete();
        }, 400);
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
              if (!dontEnable) window.scroll.start();

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

  // Идем на главную, если на внутренней странице
  if (!$.qs('.zoomer')) {
    $.qs('.header__logo').click();
  }

  // WARNING: Сильная завязка к конкретному элементу .zoomer
  if (dataset.target !== '.zoomer') {
    window.zoomer.scrollAnimating = true;

    window.scroll.to(
      dataset.target,
      window.innerWidth <= 1000 ? -80 : 0,
      () => {
        window.zoomer.scrollAnimating = false;
        $.qs('.zoomer').dispatchEvent(new Event('scrollto:complete'));
      }
    );
  } else if (dataset.target === '.zoomer' && loco.isMobile) {
    window.zoomer.scrollAnimating = true;

    window.scroll.to(
      dataset.target,
      window.innerWidth <= 1000 ? -80 : 0,
      () => {
        window.zoomer.scrollAnimating = false;
      }
    );
  }

  if ($.qs('.menu').classList.contains('active')) {
    $.qs('.burger').click();
  }
});

window.addEventListener('load', () => {
  if (loco) loco.update();
});
