const set = () => {
  // Viewport height
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  const slide = $.qs('.zoomer__slide:nth-child(2)');
  slide.dataset.x = window.innerWidth <= 1000 ? -40 : -44;
};

window.addEventListener('DOMContentLoaded', () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--initial-vh', `${vh}px`);

  set();
});
window.addEventListener('resize', set);
