import { TweenMax, Power2 } from 'gsap';
import WheelIndicator from 'wheel-indicator';
import Slider from '@/components/slider';

const arrayMax = arr => arr.reduce((p, v) => (p > v ? p : v));

export default class Zoomer {
  constructor() {
    this.DOM = {};
    this.DOM.el = $.qs('.zoomer');
    this.DOM.scaleNode = $.qs('.zoomer__scale');
    this.DOM.imgNode = $.qs('.zoomer__img');
    this.DOM.slider = $.qs('.zoomer__slider');
    this.DOM.firstNum = $.qs('.zoomer__counter span:first-child');
    this.DOM.lastNum = $.qs('.zoomer__counter span:last-child');
    this.DOM.box = $.qs('.zoomer__box');
    this.DOM.btn = $.qs('.zoomer__btn');
    this.DOM.cover = $.qs('.zoomer__cover');

    this.initialStyles = {};
    this.initialStyles.scale = window.getComputedScaleXY(
      this.DOM.scaleNode
    ).scale;
    this.initialStyles.x = window.getComputedScaleXY(this.DOM.imgNode).xPercent;
    this.initialStyles.y = window.getComputedScaleXY(this.DOM.imgNode).yPercent;

    this.sliderAnimating = false;
    this.scrollAnimating = false;
    this.introVisible = false;
    this.onTop = true;

    this.init();
  }

  init() {
    this.zoomer = new Slider(this.DOM.slider);

    this.DOM.el.addEventListener('scrollto:complete', () => {
      this.introComplete();
    });

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
    window.addEventListener('keydown', e => {
      if ([32, 38, 40].includes(e.keyCode)) {
        e.preventDefault();
        return false;
      }
    });

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

    $.delegate('.js-scrollto[data-target=".zoomer"]', () => {
      if (!this.scrollAnimating) this.introIn();
    });

    // this.createWI();
  }

  createWI() {
    this.wi = new WheelIndicator({
      callback: e => {
        this.DOM.el.dispatchEvent(new CustomEvent('wi', { detail: e }));
      }
    });

    if (!window.loco.isMobile) {
      this.DOM.el.addEventListener('wi', ({ detail }) => {
        const { direction } = detail;
        if (!this.introVisible) return false;

        if (direction === 'up') {
          this.prev();
        } else if (direction === 'down') {
          this.next();
        }
      });
    }
  }

  prev() {
    if (this.zoomer.index !== 0 && !this.sliderAnimating) {
      this.zoomer.prev();
    }
  }

  next() {
    if (
      this.zoomer.index !== this.zoomer.DOM.slides.length - 1 &&
      !this.sliderAnimating
    ) {
      this.zoomer.next();
    }
  }

  skip = (scrollTo = false) => {
    this.scrollAnimating = true;

    if (scrollTo) {
      this.introVisible = false;
      window.scroll.to('.gallery', window.innerWidth <= 1000 ? -80 : 0, () => {
        this.scrollAnimating = false;
      });
    } else {
      // window.scroll.start();
      this.introVisible = false;
      this.scrollAnimating = false;
    }
  };

  updateBegin() {
    this.sliderAnimating = true;
    this.animateLine();
  }

  updateComplete() {
    this.onUpdate();
    this.animateZoom(() => {
      // Stop intro on last slide
      if (this.zoomer.index === this.zoomer.DOM.slides.length - 1) {
        this.skip();
      }
      // this.sliderAnimating = false;
    });
    this.sliderAnimating = false;
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

  setZoom() {
    const { dataset } = this.zoomer.DOM.active;
    const x = window.parseFloat(dataset.x);
    const y = window.parseFloat(dataset.y);
    const scale = window.parseFloat(dataset.scale);

    TweenMax.set(this.DOM.scaleNode, {
      scale
    });

    TweenMax.set(this.DOM.imgNode, {
      x: `${x}%`,
      y: `${y}%`
    });
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

  zoomOut() {
    TweenMax.to(this.DOM.scaleNode, 0.8, {
      scale: this.initialStyles.scale,
      ease: Power2.easeInOut
    });

    TweenMax.to(this.DOM.imgNode, 0.8, {
      x: `${this.initialStyles.x}%`,
      y: `${this.initialStyles.y}%`,
      ease: Power2.easeInOut
    });
  }

  introIn() {
    this.scrollAnimating = true;

    this.animateZoom(() => {
      // this.DOM.el.classList.add('u-ovh');
      this.scrollAnimating = false;
      this.onTop = false;
      this.introVisible = true;
    });

    TweenMax.to(this.DOM.cover, 0.4, {
      x: '0%',
      ease: Power2.easeOut
    });

    TweenMax.to([this.DOM.btn, this.DOM.box], 0.4, {
      opacity: 1,
      ease: Power2.easeOut
    });
  }

  // introIn() {
  //   this.scrollAnimating = true;

  //   window.scroll.to('.zoomer', window.innerWidth <= 1000 ? -80 : 0, () => {
  //     window.scroll.stop();

  //     TweenMax.to(this.DOM.cover, 0.6, {
  //       x: '0%',
  //       ease: Power2.easeOut,
  //       delay: 0.2,
  //       onStart: () => {
  //         this.animateZoom(() => {
  //           this.DOM.el.classList.add('u-ovh');
  //           this.scrollAnimating = false;
  //           this.onTop = false;
  //           this.introVisible = true;

  //           window.scroll.start();
  //         });
  //       }
  //     });

  //     TweenMax.to([this.DOM.btn, this.DOM.box], 0.6, {
  //       opacity: 1,
  //       ease: Power2.easeOut,
  //       delay: 0.4
  //     });
  //   });
  // }

  introOut() {
    this.scrollAnimating = true;
    this.introVisible = false;

    // this.DOM.el.classList.remove('u-ovh');
    this.zoomOut();

    TweenMax.to(this.DOM.cover, 0.4, {
      x: '100%',
      ease: Power2.easeIn,
      onComplete: () => {
        this.scrollAnimating = false;
        this.onTop = true;
      }
    });

    TweenMax.to([this.DOM.btn, this.DOM.box], 0.4, {
      opacity: 0,
      ease: Power2.easeIn
    });
  }

  introComplete() {
    // this.scrollAnimating = true;

    TweenMax.set(this.DOM.cover, {
      x: '0%'
    });

    TweenMax.set([this.DOM.btn, this.DOM.box], {
      opacity: 1
    });

    this.setZoom();
    // this.DOM.el.classList.add('u-ovh');

    // this.scrollAnimating = false;
    this.onTop = false;
    this.introVisible = false;
  }

  observe() {
    const self = this;
    let lastY = window.loco.scroll.instance.scroll.y;

    function onScroll({ scroll, direction }) {
      if (self.scrollAnimating) return false;

      let dir;
      if (direction) {
        dir = direction;
      } else {
        dir = scroll.y > lastY ? 'down' : 'up';
      }

      lastY = scroll.y;

      const edge = window.parseInt(window.innerHeight * 0.6);
      const y = window.parseInt(scroll.y);

      // if (dir === 'up' && y <= edge + 100 && !self.onTop) {
      if (dir === 'up' && y <= edge - 200 && !self.onTop) {
        self.introOut();
      }

      // if (dir === 'down' && y >= edge - 100 && y < edge && self.onTop) {
      if (dir === 'down' && y >= edge - 50 && y < edge && self.onTop) {
        self.introIn();
      }
    }

    window.loco.on('scroll', onScroll);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const zoomer = new Zoomer();
});
