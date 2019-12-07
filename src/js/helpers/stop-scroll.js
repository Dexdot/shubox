import { lockyOn } from 'dom-locky';
import { isMobileSafari } from '@/helpers/detect';

const html = document.querySelector('html');

const freezeVp = e => {
  e.preventDefault();
};
let unlock = null;

const disable = el => {
  if (isMobileSafari()) {
    unlock = lockyOn(el);
  } else {
    html.classList.add('no-scroll');
    document.body.addEventListener('touchmove', freezeVp, false);
  }
};

const enable = () => {
  if (isMobileSafari()) {
    if (unlock) unlock();
  } else {
    html.classList.remove('no-scroll');
    document.body.removeEventListener('touchmove', freezeVp, false);
  }
};

export default { disable, enable };
