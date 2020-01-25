$.delegate('[data-modal-open="visual"]', (e, el) => {
  const { src } = el.dataset;
  $.qs('.visual-img img').src = src;
});
