export const qs = (selector, ctx = document) => ctx.querySelector(selector);

export const qsa = (selector, ctx = document) =>
  Array.from(ctx.querySelectorAll(selector));

export const siblings = el =>
  [...el.parentElement.children].filter(c => c !== el);

export const nodeIndex = el => [...el.parentNode.children].indexOf(el);

export const listen = (selector, event, cb) => {
  qsa(selector).forEach(el => {
    el.addEventListener(event, cb);
  });
};

export const outerHeight = el => {
  let height = el.offsetHeight;
  const style = getComputedStyle(el);

  height +=
    window.parseFloat(style.marginTop) + window.parseFloat(style.marginBottom);

  return height;
};

export const each = (selector, cb) => {
  const elements = qsa(selector);

  if (elements.length <= 0) return false;

  elements.forEach((el, i) => {
    cb(el, i);
  });
};
