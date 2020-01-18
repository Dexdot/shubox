import Swiper from 'swiper';

if ($.qs('.swiper-container')) {
  const slider = new Swiper('.swiper-container', {
    slidesPerView: 'auto'
  });
}
