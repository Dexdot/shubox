export const qs = (selector, ctx = document) => ctx.querySelector(selector);

export const qsa = (selector, ctx = document) =>
  Array.from(ctx.querySelectorAll(selector));

export const each = (selector, cb) => {
  const elements = qsa(selector);

  if (elements.length <= 0) return false;

  elements.forEach((el, i) => {
    cb(el, i);
  });
};

export const delegate = (selector, cb, ev = 'click') => {
  document.addEventListener(
    ev,
    e => {
      const el = e.target.closest(selector);
      if (el) {
        cb(e, el);
      }
    },
    false
  );
};
