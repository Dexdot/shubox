import { TweenMax, Power2 } from 'gsap';
import VirtualScroll from 'virtual-scroll';
import Slider from '@/components/slider';

const arrayMax = arr => arr.reduce((p, v) => (p > v ? p : v));

export default class Zoomer {
  constructor() {
    this.DOM = {};
    this.DOM.el = $.qs('.zoomer__slider');
    this.DOM.section = $.qs('.zoomer');
    this.DOM.scaleNode = $.qs('.zoomer__scale');
    this.DOM.imgNode = $.qs('.zoomer__img');
    this.DOM.slider = $.qs('.zoomer__slider');
    this.DOM.firstNum = $.qs('.zoomer__counter span:first-child');
    this.DOM.lastNum = $.qs('.zoomer__counter span:last-child');
    this.DOM.box = $.qs('.zoomer__box');
    this.DOM.btn = $.qs('.zoomer__btn');
    this.DOM.cover = $.qs('.zoomer__cover');

    this.animated = false;

    this.init();
  }

  init() {
    this.zoomer = new Slider(this.DOM.el);

    this.onUpdate();
    this.onResize();

    // Begin
    this.zoomer.DOM.el.addEventListener(
      'slider:updatebegin',
      this.updateBegin.bind(this)
    );

    // Complete
    this.zoomer.DOM.el.addEventListener(
      'slider:updatecomplete',
      this.updateComplete.bind(this)
    );

    // Resize
    window.addEventListener('resize', this.onResize.bind(this));

    $.delegate('.js-zoomer-prev', () => {
      this.prev();
    });
    $.delegate('.js-zoomer-next', () => {
      this.next();
    });
    $.delegate('.js-zoomer-skip', () => {
      this.skip(true);
    });

    this.observe();
  }

  createVS() {
    this.vs = new VirtualScroll({
      firefoxMultiplier: 50,
      mouseMultiplier: 0.8,
      touchMultiplier: 2
    });

    this.vs.on(this.onVS.bind(this));
  }

  destroyVS() {
    this.vs.off(this.onVS);
    this.vs.destroy();
  }

  onVS({ deltaY }) {
    if (TweenMax.isTweening(this.DOM.imgNode)) return false;

    if (deltaY > 0) {
      this.prev();
    } else {
      this.next();
    }
  }

  prev() {
    if (this.zoomer.index !== 0) this.zoomer.prev();
  }

  next() {
    if (this.zoomer.index !== this.zoomer.DOM.slides.length - 1)
      this.zoomer.next();
  }

  skip(scrollTo = false) {
    window.scroll.start();
    if (scrollTo) {
      window.loco.scrollTo('.gallery', window.innerWidth <= 1000 ? -80 : 0);
    }
    this.animated = true;
  }

  updateBegin() {
    this.animateLine();
  }

  updateComplete() {
    this.onUpdate();
    this.animateZoom();
  }

  animateLine = () => {
    const targets = '.zoomer__line';

    TweenMax.set(targets, {
      transformOrigin: '100% 50%'
    });

    TweenMax.fromTo(
      targets,
      0.5,
      {
        scale: 1,
        ease: Power2.easeIn
      },
      {
        scale: 0,
        onComplete: () => {
          TweenMax.set(targets, {
            transformOrigin: '0% 50%'
          });

          TweenMax.fromTo(
            targets,
            0.5,
            {
              scale: 0,
              ease: Power2.easeOut
            },
            {
              scale: 1
            }
          );
        }
      }
    );
  };

  onUpdate() {
    const { index, DOM } = this.zoomer;

    // Stop intro on last slide
    if (index === DOM.slides.length - 1 && !this.animated) {
      this.skip();
    }

    // Arrows
    this.DOM.firstNum.textContent = index + 1;
    this.DOM.lastNum.textContent = DOM.slides.length;

    if (index === 0) {
      $.each('.js-zoomer-prev', el => {
        el.classList.remove('active');
      });
      this.DOM.firstNum.classList.remove('active');
    } else {
      $.each('.js-zoomer-prev', el => {
        el.classList.add('active');
      });
      this.DOM.firstNum.classList.add('active');
    }

    if (index === DOM.slides.length - 1) {
      $.each('.js-zoomer-next', el => {
        el.classList.remove('active');
      });
      this.DOM.lastNum.classList.remove('active');
    } else {
      $.each('.js-zoomer-next', el => {
        el.classList.add('active');
      });
      this.DOM.lastNum.classList.add('active');
    }
  }

  onResize() {
    const height = arrayMax(
      this.zoomer.DOM.slides.map(slide => slide.scrollHeight)
    );
    this.DOM.slider.style.height = `${height}px`;
  }

  animateZoom(onComplete) {
    const { dataset } = this.zoomer.DOM.active;
    const x = window.parseFloat(dataset.x);
    const y = window.parseFloat(dataset.y);
    const scale = window.parseFloat(dataset.scale);

    TweenMax.to(this.DOM.scaleNode, 1, {
      scale,
      ease: Power2.easeInOut
    });

    TweenMax.to(this.DOM.imgNode, 1, {
      x: `${x}%`,
      y: `${y}%`,
      ease: Power2.easeInOut,
      onComplete
    });
  }

  intro() {
    window.scroll.stop();
    window.loco.scrollTo('.zoomer', window.innerWidth <= 1000 ? -80 : 0);

    TweenMax.to(this.DOM.cover, 0.6, {
      x: '0%',
      ease: Power2.easeOut,
      delay: 0.2,
      onStart: () => {
        this.animateZoom(() => {
          this.DOM.section.classList.add('u-ovh');
        });
      }
    });

    TweenMax.to([this.DOM.btn, this.DOM.box], 0.6, {
      opacity: 1,
      ease: Power2.easeOut,
      delay: 0.4
    });
  }

  observe() {
    const self = this;

    function onScroll({ scroll }) {
      if (scroll.y >= window.innerHeight * 0.6) {
        self.intro();
        window.loco.off('scroll', onScroll);
      }
    }

    window.loco.on('scroll', onScroll);
    // this.observer = new IntersectionObserver(
    //   items => {
    //     items.forEach(({ isIntersecting, intersectionRatio }) => {
    //       if (isIntersecting && intersectionRatio >= 0.8 && !this.animated) {
    //         this.intro();
    //         this.observer.unobserve(this.DOM.el);
    //       }
    //     });
    //   },
    //   {
    //     threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 0.8, 0.9, 0.95, 1]
    //   }
    // );

    // this.observer.observe(this.DOM.section);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const zoomer = new Zoomer();
});
