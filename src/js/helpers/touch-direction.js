let touchDirection = 0;

let ts;
window.addEventListener('touchstart', e => {
  ts = e.touches[0].clientY;
});

window.addEventListener('touchmove', e => {
  const te = e.changedTouches[0].clientY;
  if (ts > te) {
    touchDirection = 1;
  } else {
    touchDirection = -1;
  }
});

export default () => touchDirection;
