import Hammer from 'hammerjs';
import { TweenMax } from 'gsap';

export default class Rail {
  constructor(el) {
    this.DOM = { el };
    this.containerWidth = 0;
    this.reverse = this.DOM.el.classList.contains('js-rail-reverse');

    this.init();

    this.requestAnimation = null;

    this.translation = 0;

    this.grabbed = false;
    this.preventClick = false;

    this.originalVelocity = 1;
    this.velocity = this.originalVelocity;
    // this.velocity = 0;
  }

  init() {
    this.initializeElements();
    this.initializeEvents();
  }

  initializeElements() {
    this.DOM.railContainer = $.qs('.rail__container', this.DOM.el);
    this.getBCR();
  }

  initializeEvents() {
    this.update();

    $.qsa('a', this.DOM.el).forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();

        if (!this.preventClick) {
          window.open(a.href);
        }
      });
    });

    this.onPanStart = () => {
      this.grabbed = true;
      this.preventClick = true;
      this.progressOnGrabStart = this.translation;
    };

    this.onPanMove = ({ deltaX }) => {
      const coef = window.innerWidth > 500 ? 2 : 3;
      this.translation = this.progressOnGrabStart + deltaX * coef;
    };

    this.onPanEnd = () => {
      this.grabbed = false;

      requestAnimationFrame(() => {
        this.preventClick = false;
      }, 10);
    };

    this.panManager = new Hammer.Manager(this.DOM.el);

    this.panManager.add(
      new Hammer.Pan({
        direction: Hammer.DIRECTION_HORIZONTAL,
        threshold: 0
      })
    );

    this.panManager.add(new Hammer.Tap());
    this.panManager.on('panstart', this.onPanStart);
    this.panManager.on('panstart panmove', this.onPanMove);
    this.panManager.on('panend', this.onPanEnd);
  }

  update() {
    if (!this.grabbed) {
      this.translation = this.reverse
        ? this.translation + this.velocity
        : this.translation - this.velocity;
    }

    const t =
      this.translation > 0
        ? -this.containerWidth + (this.translation % this.containerWidth)
        : this.translation % this.containerWidth;

    TweenMax.set(this.DOM.railContainer, {
      x: t / 2
    });

    this.requestAnimation = window.requestAnimationFrame(
      this.update.bind(this)
    );
  }

  getBCR() {
    this.railContainerBCR = this.DOM.railContainer.getBoundingClientRect();
    this.containerWidth = this.railContainerBCR.width;
  }
}
