const set = () => {
  // Viewport height
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

window.addEventListener('DOMContentLoaded', () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--initial-vh', `${vh}px`);

  set();
});
window.addEventListener('resize', set);
