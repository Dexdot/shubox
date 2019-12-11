const set = () => {
  // Viewport height
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  const slide = $.qs('.zoomer__slide:nth-child(2)');
  slide.dataset.x = window.innerWidth <= 1000 ? -50 : -57;
};

window.addEventListener('DOMContentLoaded', () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--initial-vh', `${vh}px`);

  set();
});
window.addEventListener('resize', set);

window.getComputedScaleXY = el => {
  if (!window.getComputedStyle || !el) return false;

  const style = getComputedStyle(el);
  const transform =
    style.transform || style.webkitTransform || style.mozTransform;

  let mat = transform.match(/^matrix3d\((.+)\)$/);

  if (mat) return parseFloat(mat[1].split(', ')[13]);

  mat = transform.match(/^matrix\((.+)\)$/);

  const data = {};

  data.scale = mat ? parseFloat(mat[1].split(', ')[3]) : 0;

  data.x = mat ? parseFloat(mat[1].split(', ')[4]) : 0;
  data.y = mat ? parseFloat(mat[1].split(', ')[5]) : 0;

  data.xPercent = data.x === 0 ? 0 : data.x / (el.offsetWidth / 100);
  data.yPercent = data.y === 0 ? 0 : data.y / (el.offsetHeight / 100);

  return data;
};
