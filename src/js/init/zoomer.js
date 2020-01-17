import { TweenMax, Power2 } from 'gsap';
import WheelIndicator from 'wheel-indicator';
import Slider from '@/components/slider';
import { isMobileDevice } from '@/helpers/detect';

const arrayMax = arr => arr.reduce((p, v) => (p > v ? p : v));

export default class Zoomer {
  constructor(el) {
    this.DOM = {};
    this.DOM.el = el;
    this.DOM.scaleNode = $.qs('.zoomer__scale');
    this.DOM.imgParent = $.qs('.zoomer__img');
    this.DOM.img = $.qs('.zoomer__img img');
    this.DOM.slider = $.qs('.zoomer__slider');
    this.DOM.firstNum = $.qs('.zoomer__counter span:first-child');
    this.DOM.lastNum = $.qs('.zoomer__counter span:last-child');
    this.DOM.box = $.qs('.zoomer__box');
    this.DOM.btn = $.qs('.zoomer__btn');
    this.DOM.cover = $.qs('.zoomer__cover');
    this.DOM.colorsList = $.qs('.zoomer-colors');
    this.DOM.material = $.qs('.zoomer-material');
    this.DOM.materialImages = $.qsa('img[data-mat]');

    this.initialStyles = {};
    this.initialStyles.scale = window.getComputedScaleXY(
      this.DOM.scaleNode
    ).scale;
    this.initialStyles.x = window.getComputedScaleXY(
      this.DOM.imgParent
    ).xPercent;
    this.initialStyles.y = window.getComputedScaleXY(
      this.DOM.imgParent
    ).yPercent;

    this.sliderAnimating = false;
    this.scrollAnimating = false;
    this.introVisible = false;
    this.onTop = true;
    this.isMob = window.innerWidth <= 500;

    this.init();
  }

  init() {
    this.zoomer = new Slider(this.DOM.slider, this.isMob);

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
    // window.addEventListener('keydown', e => {
    //   if ([32, 38, 40].includes(e.keyCode)) {
    //     e.preventDefault();
    //     return false;
    //   }
    // });

    $.delegate('.js-zoomer-prev', () => {
      this.prev();
    });
    $.delegate('.js-zoomer-next', () => {
      this.next();
    });
    $.delegate('.js-zoomer-skip', () => {
      this.skip(true);
    });

    // Color change
    this.originalImgUrl = this.DOM.img.src;
    $.delegate('[data-color]', (e, el) => {
      // Parent
      const parent = el.closest('.zoomer-colors__inner');

      // Active class change
      $.qsa('[data-color]', parent).forEach(color => {
        color.classList.remove('active');
      });
      el.classList.add('active');

      // Set url by active colors
      const outerColor = $.qs('.zoomer-colors__inner:first-child .active')
        .dataset.color;
      const innerColor = $.qs('.zoomer-colors__inner:last-child .active')
        .dataset.color;
      const activeImgUrl = `img/colors/${outerColor}-${innerColor}.jpg`;
      this.DOM.img.src = activeImgUrl;
    });

    this.observe();

    $.delegate('.js-scrollto[data-target=".zoomer"]', () => {
      if (!this.scrollAnimating && !window.loco.isMobile) {
        this.introIn();
      }
    });

    $.each('.js-material', btn => {
      btn.addEventListener('mouseenter', () => {
        this.toggleMaterial(btn.dataset.mat);
      });
    });

    this.DOM.material.addEventListener('mouseleave', () => {
      this.toggleMaterial('all');
    });

    this.createWI();
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
          const first = this.zoomer.index === 0;
          const loop = this.isMob || !first;

          if (loop && !this.sliderAnimating) {
            this.prev();
          } else if (first && !this.sliderAnimating) {
            this.introOut();
            window.scroll.to('.hero', 0);
          }
        } else if (direction === 'down') {
          this.next();
        }
      });
    }
  }

  prev() {
    const notFirst = this.zoomer.index !== 0;
    const loop = this.isMob || notFirst;
    if (loop && !this.sliderAnimating) {
      this.zoomer.prev();
    }
  }

  next() {
    const last = this.zoomer.index !== this.zoomer.DOM.slides.length - 1;
    const loop = this.isMob || last;
    if (loop && !this.sliderAnimating) {
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
      window.scroll.start();
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
      this.sliderAnimating = false;
    });
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

    // Hide / show colors
    if (index === 1) {
      this.DOM.colorsList.classList.remove('hidden');
    } else {
      this.DOM.colorsList.classList.add('hidden');
    }

    // Hide / show material
    if (index === 2) {
      this.DOM.material.classList.remove('hidden');
    } else {
      this.DOM.material.classList.add('hidden');
      this.toggleMaterial('all');
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

    TweenMax.set(this.DOM.imgParent, {
      x: `${x}%`,
      y: `${y}%`
    });
  }

  animateZoom(onComplete) {
    const { dataset } = this.zoomer.DOM.active;
    const x = window.parseFloat(dataset.x);
    const y = window.parseFloat(dataset.y);
    const scale = window.parseFloat(dataset.scale);

    TweenMax.to(this.DOM.scaleNode, 0.8, {
      scale,
      ease: Power2.easeInOut
    });

    TweenMax.to(this.DOM.imgParent, 0.8, {
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

    TweenMax.to(this.DOM.imgParent, 0.8, {
      x: `${this.initialStyles.x}%`,
      y: `${this.initialStyles.y}%`,
      ease: Power2.easeInOut
    });
  }

  introIn() {
    this.scrollAnimating = true;

    if (!window.loco.isMobile) {
      window.scroll.to(
        '.zoomer',
        window.innerWidth <= 1000 ? -80 : 0,
        null,
        true
      );

      TweenMax.to(this.DOM.cover, 0.6, {
        x: '0%',
        ease: Power2.easeOut,
        delay: 0.2,
        onStart: () => {
          this.animateZoom(() => {
            this.scrollAnimating = false;
            this.onTop = false;
            this.introVisible = true;
          });
        }
      });

      TweenMax.to([this.DOM.btn, this.DOM.box], 0.6, {
        opacity: 1,
        ease: Power2.easeOut,
        delay: 0.4
      });
    } else {
      TweenMax.to(this.DOM.cover, 0.6, {
        x: '0%',
        ease: Power2.easeOut,
        onComplete: () => {
          this.scrollAnimating = false;
          this.onTop = false;
          this.introVisible = true;
        }
      });
      this.animateZoom();

      TweenMax.to([this.DOM.btn, this.DOM.box], 0.6, {
        opacity: 1,
        ease: Power2.easeOut
      });
    }
  }

  introOut() {
    this.scrollAnimating = true;
    this.introVisible = false;

    this.resetColor();

    this.zoomOut();

    TweenMax.to(this.DOM.cover, 0.4, {
      x: '100%',
      ease: Power2.easeIn,
      onComplete: () => {
        this.scrollAnimating = false;
        this.onTop = true;
        this.zoomer.updateNoEvent(0);
        this.onUpdate();
      }
    });

    TweenMax.to([this.DOM.btn, this.DOM.box], 0.4, {
      opacity: 0,
      ease: Power2.easeIn
    });
  }

  introComplete() {
    this.scrollAnimating = true;

    TweenMax.set(this.DOM.cover, {
      x: '0%'
    });

    TweenMax.set([this.DOM.btn, this.DOM.box], {
      opacity: 1
    });

    this.setZoom();

    this.resetColor();

    this.scrollAnimating = false;
    this.onTop = false;
    this.introVisible = false;
  }

  observe() {
    const self = this;
    // let lastY = window.loco.scroll.instance.scroll.y;
    let lastY = 0;

    function onScroll({ scroll, direction }) {
      if (self.scrollAnimating || scroll.y < 0) return false;

      let dir;
      if (direction) {
        dir = direction;
      } else {
        dir = scroll.y > lastY ? 'down' : 'up';
      }

      if (scroll.y > 0) lastY = scroll.y;

      const edge = window.parseInt(window.innerHeight * 0.6);
      const y = window.parseInt(scroll.y);

      // Header
      // if (dir === 'up') $.qs('.header').classList.remove('hidden');
      // if (dir === 'down' && y > 80) $.qs('.header').classList.add('hidden');

      const upCondition = window.loco.isMobile
        ? dir === 'up' && y <= edge - 150 && !self.onTop
        : dir === 'up' && y <= edge + 100 && !self.onTop;

      const downCondition = window.loco.isMobile
        ? dir === 'down' && y >= edge - 100 && y <= edge + 100 && self.onTop
        : dir === 'down' && y >= 80 && self.onTop;

      // Intro I/O
      if (upCondition) {
        self.introOut();
      }

      if (downCondition) {
        self.introIn();
      }
    }

    window.loco.on('scroll', onScroll);
  }

  resetColor() {
    this.DOM.img.src = this.originalImgUrl;
    this.setColorActive('white', 'yellow');
    this.toggleMaterial('all');
  }

  setColorActive(c1, c2) {
    $.qsa('[data-color]', this.DOM.colorsList).forEach(color => {
      color.classList.remove('active');
    });
    $.qs(`.zoomer-colors__inner:first-child [data-color=${c1}]`).classList.add(
      'active'
    );
    $.qs(`.zoomer-colors__inner:last-child [data-color=${c2}]`).classList.add(
      'active'
    );
  }

  toggleMaterial(type) {
    clearTimeout(this.matTimer);

    if (type === 'all') {
      this.DOM.materialImages.forEach(img => {
        img.classList.add('hidden');
      });
    } else {
      $.qs(`img[data-mat="${type}"]`).classList.remove('hidden');

      this.matTimer = setTimeout(() => {
        this.DOM.materialImages.forEach(img => {
          if (img.dataset.mat !== type) {
            img.classList.add('hidden');
          }
        });
      }, 150);
    }
  }
}

const init = () => {
  const el = $.qs('.zoomer');
  if (el) {
    window.zoomer = new Zoomer(el);
    document.dispatchEvent(new Event('zoomer:inited'));
  }
};

window.addEventListener('DOMContentLoaded', () => {
  const img = $.qs('.zoomer__img img');
  if (!img) return false;

  img.addEventListener('load', () => {
    if (!img.dataset.inited) {
      img.dataset.inited = 'true';
      init();
    }
  });

  const loadImages = () => {
    if (!img.dataset.inited) {
      img.src = isMobileDevice()
        ? 'img/render-1000.png'
        : 'img/render-3840.png';
      $.each('img[data-src]', i => {
        i.src = i.dataset.src;
      });
    }
  };
  loadImages();
  window.addEventListener('resize', loadImages);
});
