import Swiper from 'swiper';

if ($.qs('.swiper-container')) {
  const onUpdate = ({ activeIndex, slides }) => {
    // Arrows
    if (activeIndex === 0) {
      $.each('.js-swiper-prev', el => {
        el.classList.remove('active');
      });
    } else {
      $.each('.js-swiper-prev', el => {
        el.classList.add('active');
      });
    }

    if (activeIndex === slides.length - 1) {
      $.each('.js-swiper-next', el => {
        el.classList.remove('active');
      });
    } else {
      $.each('.js-swiper-next', el => {
        el.classList.add('active');
      });
    }
  };

  const slider = new Swiper('.swiper-container', {
    slidesPerView: 'auto'
  });

  $.delegate('.js-swiper-prev', () => {
    slider.slidePrev();
  });

  $.delegate('.js-swiper-next', () => {
    slider.slideNext();
  });

  onUpdate(slider);
  slider.on('slideChange', () => {
    onUpdate(slider);
  });
}
