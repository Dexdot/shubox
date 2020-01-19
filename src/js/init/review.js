$.delegate('.js-review', (e, el) => {
  const { src } = el.dataset;
  $.qs('.review-img img').src = src;
});
