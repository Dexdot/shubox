let wheelDirection = 0;

window.addEventListener('wheel', e => {
  wheelDirection = e.deltaY > 0 ? 1 : -1;
});

export default () => wheelDirection;
