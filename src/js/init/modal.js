import scroll from '@/helpers/stop-scroll';

// Callbacks
const onOpen = modal => {
  $.qs('body').classList.add(`modal-${modal}-active`);

  switch (modal) {
    default:
      break;
  }
};

const onClose = modal => {
  $.qs('body').classList.remove(`modal-${modal}-active`);

  switch (modal) {
    default:
      break;
  }
};

const onEscape = e => {
  if (e.keyCode === 27) {
    const el = $.qs('[data-modal].active');

    if (!el) return false;

    const { modal } = el.dataset;
    close(el, modal);
  }
};

export const init = () => {
  // Open
  $.delegate(`[data-modal-open]`, (e, el) => {
    const name = el.dataset.modalOpen;
    const modal = $.qs(`[data-modal="${name}"]`);
    open(modal, name);
  });

  // Close
  $.delegate(`[data-modal-close]`, (e, el) => {
    const name = el.dataset.modalClose;
    const modal = $.qs(`[data-modal="${name}"]`);
    close(modal, name);
  });
};

window.addEventListener('DOMContentLoaded', init);

export function open(el, modal) {
  onOpen(modal);

  if (window.loco.isMobile) scroll.disable(el);
  // window.scroll.stop();

  el.classList.add('active');
  window.addEventListener('keydown', onEscape);
}

export function close(el, modal) {
  onClose(modal);
  if (window.loco.isMobile) scroll.enable();
  // window.scroll.start();

  el.classList.remove('active');

  window.removeEventListener('keydown', onEscape);
}
