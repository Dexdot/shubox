import Slider from '@/components/slider';

// Gallery
window.addEventListener('DOMContentLoaded', () => {
  const onUpdate = ({ index, DOM }) => {
    // Dots
    $.each('.gallery-slider .slider-nav__dots li', li => {
      li.classList.remove('active');
    });

    $.qs(
      `.gallery-slider .slider-nav__dots li:nth-child(${index + 1})`
    ).classList.add('active');

    // Arrows
    if (index === 0) {
      $.each('.js-gallery-prev', el => {
        el.classList.remove('active');
      });
    } else {
      $.each('.js-gallery-prev', el => {
        el.classList.add('active');
      });
    }

    if (index === DOM.slides.length - 1) {
      $.each('.js-gallery-next', el => {
        el.classList.remove('active');
      });
    } else {
      $.each('.js-gallery-next', el => {
        el.classList.add('active');
      });
    }
  };

  const gallerySliderList = $.qs('.gallery-slider ul');
  if (!gallerySliderList) return false;

  const gallery = new Slider(gallerySliderList);
  onUpdate(gallery);
  gallery.DOM.el.addEventListener('slider:updatecomplete', () => {
    onUpdate(gallery);
  });

  $.delegate('.js-gallery-prev', () => {
    gallery.prev();
  });
  $.delegate('.js-gallery-next', () => {
    gallery.next();
  });
  $.delegate('.js-gallery-dot', (e, btn) => {
    gallery.update('', $.nodeIndex(btn.parentElement));
  });
});

// Gallery
window.addEventListener('DOMContentLoaded', () => {
  if (!window.zoomer) return false;

  const onUpdate = ({ index, DOM }) => {
    // Arrows

    if (index === 0) {
      $.each('.js-zooder-prev', el => {
        el.classList.remove('active');
      });
    } else {
      $.each('.js-zooder-prev', el => {
        el.classList.add('active');
      });
    }

    if (index === DOM.slides.length - 1) {
      $.each('.js-zooder-next', el => {
        el.classList.remove('active');
      });
    } else {
      $.each('.js-zooder-next', el => {
        el.classList.add('active');
      });
    }
  };

  onUpdate(window.zoomer.zoomer);
  window.zoomer.zoomer.DOM.el.addEventListener('slider:updatecomplete', () => {
    onUpdate(window.zoomer.zoomer);
  });

  $.delegate('.js-zooder-prev', () => {
    window.zoomer.prev();
  });
  $.delegate('.js-zooder-next', () => {
    window.zoomer.next();
  });
});
